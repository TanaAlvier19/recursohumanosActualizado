import json
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from rest_framework import status
from django.db import transaction
from django.db.models import Count
from django.db.models.functions import TruncMonth
from .models import Empresa, Entrevista, UsuarioEmpresa, ValoresArquivo,OTP,FolhaPagamento,Dispensas,Formacoes,Inscricao, CamposPersonalizados, Vagas,Modulos,Valores, Departamento,DescontosImposto,Candidato
from datetime import time, timedelta, datetime
from decimal import Decimal,ROUND_HALF_UP
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import EmpresaSerializer, EntrevistaSerializer, TesteTecnicoSerializer, UsuarioEmpresaSerializer,DispensasSerializer,InscricaoSerializer,FormacoesSerializer,ModulosSerializer, VagaSerializer,ValoresSerializer,FolhaPagamentoSerializer,CandidatoSerializer, CamposPersonalizadosSerializer, DescontosSerializer,DepartamentoSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.db.models import Avg, F,Sum
from django.utils import timezone
from django.contrib.auth.hashers import make_password
User = get_user_model()
from rest_framework.decorators import api_view,permission_classes


class CadastrarEmpresa(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer=EmpresaSerializer(data=request.data)
        if(serializer.is_valid()):
            empresa=serializer.save()
            dados=request.data.copy()
            dados['empresa'] = empresa.id
            serializer=UsuarioEmpresaSerializer(data=dados)
            if serializer.is_valid():
                usuario=serializer.save()
                return Response({
                    "empresa": EmpresaSerializer(empresa).data,
                    "usuario": UsuarioEmpresaSerializer(usuario).data
                }, status=status.HTTP_201_CREATED)
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        empresas=Empresa.objects.all()
        serializer=EmpresaSerializer(empresas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def delete(self, request):
        empresas=Empresa.objects.all()
        empresas.delete()
        return Response({"message": "Todas as empresas foram deletadas."}, status=status.HTTP_204_NO_CONTENT)
@api_view(['GET'])
@permission_classes([AllowAny])
def ususario(request):
    usuario=UsuarioEmpresa.objects.all()
    serializer=UsuarioEmpresaSerializer(usuario, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
class FolhaPagamentoView(APIView):
    def post(self, request):
        user = request.user
        dados = request.data.copy()  
        dados["empresa"] = user.empresa.id

        salario_bruto_float = dados.get("salario_bruto")
        if salario_bruto_float is None:
            return Response({"error": "Salário bruto não fornecido."}, status=status.HTTP_400_BAD_REQUEST)
        
        salario_bruto = Decimal(str(salario_bruto_float))

        try:
            impostos = DescontosImposto.objects.get(empresa=user.empresa)
        except DescontosImposto.DoesNotExist:
            return Response({"error": "Configuração de impostos não encontrada para esta empresa."}, status=status.HTTP_400_BAD_REQUEST)
        
        inss = Decimal('0.03')
        desconto_inss = salario_bruto * inss

        if salario_bruto <= 70000:
            desconto_irt = Decimal('0.00')
        elif salario_bruto <= 100000:
            desconto_irt = salario_bruto * impostos.irt2
        elif salario_bruto <= 150000:
            desconto_irt = salario_bruto * impostos.irt3
        elif salario_bruto <= 200000:
            desconto_irt = salario_bruto * impostos.irt4
        elif salario_bruto <= 300000:
            desconto_irt = salario_bruto * impostos.irt5
        elif salario_bruto <= 500000:
            desconto_irt = salario_bruto * impostos.irt6
        else:
            desconto_irt = salario_bruto * impostos.irt7

        salario_liquido = salario_bruto - desconto_inss - desconto_irt

        desconto_inss = desconto_inss.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        desconto_irt = desconto_irt.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        salario_liquido = salario_liquido.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        dados.update({
            "desconto_inss": desconto_inss,
            "desconto_irt": desconto_irt,
            "salario_liquido": salario_liquido
        })
        
        serializer = FolhaPagamentoSerializer(data=dados)
        if serializer.is_valid():
            folha_pagamento = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        user=request.user
        folhas_pagamento = FolhaPagamento.objects.filter(empresa=user.empresa.id)
        serializer = FolhaPagamentoSerializer(folhas_pagamento, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request):
        FolhaPagamento.objects.all().delete()
        return Response({"message": "Todas as folhas de pagamento foram deletadas."}, status=status.HTTP_204_NO_CONTENT)
class ResumoFolhaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        empresa = user.empresa
        
        # Obter dados do último mês
        ultimo_mes = FolhaPagamento.objects.filter(
            empresa=empresa
        ).order_by('-mes_referencia').first()

        if not ultimo_mes:
            return Response({
                "total_folha": 0,
                "funcionarios": 0,
                "media_salarial": 0,
                "proximo_pagamento": "05/" + (datetime.now() + timedelta(days=30)).strftime("%m")
            })

        total_folha = FolhaPagamento.objects.filter(
            empresa=empresa,
            mes_referencia=ultimo_mes.mes_referencia
        ).aggregate(total=Sum('salario_liquido'))['total'] or 0

        funcionarios = FolhaPagamento.objects.filter(
            empresa=empresa,
            mes_referencia=ultimo_mes.mes_referencia
        ).count()

        media_salarial = FolhaPagamento.objects.filter(
            empresa=empresa,
            mes_referencia=ultimo_mes.mes_referencia
        ).aggregate(media=Avg('salario_bruto'))['media'] or 0

        return Response({
            "total_folha": total_folha,
            "funcionarios": funcionarios,
            "media_salarial": media_salarial,
            "proximo_pagamento": "05/" + (ultimo_mes.mes_referencia + timedelta(days=32)).strftime("%m")
        })
class HistoricoFolhaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        empresa = user.empresa
        
        seis_meses_atras = datetime.now() - timedelta(days=180)
        
        historico = FolhaPagamento.objects.filter(
            empresa=empresa,
            mes_referencia__gte=seis_meses_atras
        ).annotate(
            mes=TruncMonth('mes_referencia')
        ).values('mes').annotate(
            folha=Sum('salario_liquido'),
            impostos=Sum('desconto_inss') + Sum('desconto_irt')
        ).order_by('mes')
        
        dados_grafico = []
        for item in historico:
            dados_grafico.append({
                "mes": item['mes'].strftime("%Y-%m"),
                "folha": item['folha'],
                "impostos": item['impostos']
            })
        
        return Response(dados_grafico)

class Login(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            
            return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
        
        # 
        user = serializer.user
        
        resposta = super().post(request, *args, **kwargs)
        data = resposta.data
        
        data['nivel_acesso'] = user.nivel_acesso
        
        access_token = data.get("access")
        refresh_token = data.get('refresh')
        
        resposta.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=60*60
        )
        resposta.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=60*60*60*60
        )
        
        return resposta

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def campos(request):
    if request.method == 'POST':
        data= request.data
        novo_campos=[]
        serializer = CamposPersonalizadosSerializer(data=novo_campos, many=True)
        for item in data:
            
            nome=item["nome"]
            empresa=item["empresa"]
            print(empresa)
            existe=CamposPersonalizados.objects.filter(nome=nome, empresa=empresa)
            if not existe:
                novo_campos.append(item)
            if existe:
                serializer_existe=CamposPersonalizadosSerializer(existe, many=True)
                return Response({"error":"Campo Já existe","campos":serializer_existe.data}, status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            serializer.save()
            print("dados", serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class valoresdoscampos(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        empresa = user.empresa

        valores_json_str = request.data.get('valores', '{}')
        try:
            valores_json = json.loads(valores_json_str)
        except json.JSONDecodeError:
            return Response({"valores": "Formato JSON inválido."}, status=status.HTTP_400_BAD_REQUEST)

        nome_funcionario = valores_json.get('Nome', valores_json.get('nome', None))
        email_funcionario = valores_json.get('Email', valores_json.get('email', None))

        if not nome_funcionario or not email_funcionario:
            return Response({"erro": "Nome e Email do funcionário são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

        departamento_id = request.data.get('departamento')
        departamento_instance = None
        if departamento_id:
            try:
                departamento_instance = Departamento.objects.get(id=departamento_id, empresa=empresa)
            except Departamento.DoesNotExist:
                return Response({"departamento": "Departamento inválido ou não pertence a esta empresa."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                usuario_funcionario, created = UsuarioEmpresa.objects.get_or_create(
                    emailRep=email_funcionario,
                    defaults={
                        'nomeRep': nome_funcionario,
                        'empresa': empresa,
                        'nivel_acesso': 'funcionario',
                        'is_active': False, 
                        'password': make_password(None) 
                    }
                )

                if created:
                    codigo = get_random_string(length=6, allowed_chars='0123456789')
                    OTP.objects.create(funcionario=usuario_funcionario, codigo=codigo)

                    send_mail(
                        subject="Seu código OTP",
                        message=f"Olá {usuario_funcionario.nomeRep}, seja bem-vindo! Seu código OTP é: {codigo}. Use-o para ativar sua conta e definir sua senha. http://localhost:3000/verificar-otp?email={usuario_funcionario.emailRep}",
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[usuario_funcionario.emailRep],
                        fail_silently=False,
                    )
                else:
                    
                    pass
                
                data_para_serializer = {
                    'empresa': empresa.id,
                    'valores': valores_json,
                    'funcionario': usuario_funcionario.id,
                    'departamento': departamento_instance.id if departamento_instance else None,
                }
                
                serializer = ValoresSerializer(data=data_para_serializer)
                if serializer.is_valid():
                    valores_instancia = serializer.save() 
                    
                    arquivos = request.FILES
                    for nome_campo, arquivo in arquivos.items():
                        try:
                            campo_personalizado = CamposPersonalizados.objects.get(nome=nome_campo, empresa=empresa)
                            
                            ValoresArquivo.objects.create(
                                valores_instancia=valores_instancia,
                                campo_personalizado=campo_personalizado,
                                arquivo=arquivo
                            )
                        except CamposPersonalizados.DoesNotExist:
                            print(f"Campo personalizado '{nome_campo}' não encontrado.")
                    
                    return Response({
                        "detail": "Funcionário cadastrado com sucesso. Verifique o e-mail para ativar a conta.",
                        "data": serializer.data
                    }, status=status.HTTP_201_CREATED)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"Erro inesperado: {e}")
            return Response({"erro": "Ocorreu um erro inesperado."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def get(self, request):
        user=request.user
        
        valores=Valores.objects.filter(empresa__nome=user.empresa).prefetch_related('arquivos')
        print(user.empresa)
        serializer=ValoresSerializer(valores, many=True)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
@api_view(['GET'])
@permission_classes([AllowAny])
def campos_lista(request):
    campos=CamposPersonalizados.objects.all()
    serializer = CamposPersonalizadosSerializer(campos, many=True)

    
    # if(CamposPersonalizados.objects.filter(nome=dt)):
    #     print("Siiiiiiiiii")
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def criar_dispensa(request):
    serializer = DispensasSerializer(data=request.data)
    
    if serializer.is_valid():
       
        user = request.user
        empresa = user.empresa
        
        serializer.save(funcionario=user, empresa=empresa)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def minha_dispensa(request):
    user=request.user
    minha_dispensa=Dispensas.objects.filter(empresa=user.empresa, funcionario=user)
    serializer = DispensasSerializer(minha_dispensa, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def todo_dispensa(request):
    user=request.user
    todo_dispensa=Dispensas.objects.filter(empresa=user.empresa)
    serializer = DispensasSerializer(todo_dispensa, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)      
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def campos_empresa(request):
    user=request.user
    campo=CamposPersonalizados.objects.all()

    campos=CamposPersonalizados.objects.filter(empresa=user.empresa)
    serializer = CamposPersonalizadosSerializer(campos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
class DepartamentoView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self, request):
        user=request.user
        empresa=user.empresa
        data=request.data
        data["empresa"]=empresa.id
        serializer=DepartamentoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        user=request.user
        empresa=user.empresa
        deparmentos=Departamento.objects.filter(empresa=empresa)
        orcamentoTotal=sum([d.orcamento for d in deparmentos ])
        funcionarios=sum([d.funcionarios or 0 for d in deparmentos])
        # funcionarios=sum([(f.funcionarios for f in deparmentos)])
        serializer=DepartamentoSerializer(deparmentos, many=True)
        ativo=Departamento.objects.filter(status=True, empresa=empresa).count()
        return Response({"dados":serializer.data,"orcamento":orcamentoTotal, "status":ativo, "funcionarios":funcionarios}, status=status.HTTP_202_ACCEPTED)
    def patch(self, request):
        departameto_id=request.data["id"]
        empresa=request.data["empresa"]
        departamento=get_object_or_404(Departamento, id=departameto_id, empresa=request.empresa)
        departamento=Departamento.objects.get(id=id)
        serializer=DepartamentoSerializer(departamento, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request):
        departamento_id = request.data.get("id")
        if not departamento_id:
            return Response({"error": "ID do departamento é obrigatório"}, status=400)
        
        try:
            departamento = Departamento.objects.get(
                id=departamento_id, 
                empresa=request.user.empresa
            )
            departamento.delete()
            return Response(status=204)
        except Departamento.DoesNotExist:
            return Response({"error": "Departamento não encontrado"}, status=404)
class InscricoesView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self, request):
        data=request.data
        user=request.user
        data["funcionario"]=user.nomeRep
        data["empresa"]=user.empresa.id
        serializer=InscricaoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        user=request.user.empresa
        dado=Inscricao.objects.filter(empresa=user)
        serializer=InscricaoSerializer(dado, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def minha_formacoes(request):
    user = request.user
    
    inscricoes = Inscricao.objects.filter(funcionario=user.id)
    
    if not inscricoes.exists():
        return Response([])

    ids_formacoes = [i.inscricao_id for i in inscricoes]
    print(ids_formacoes)
    formacoes = Formacoes.objects.filter(id__in=ids_formacoes)
    
    serializer = FormacoesSerializer(formacoes, many=True)
    
    return Response(serializer.data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def Inscritos(request):
    user = request.user
    
    inscricoes = Inscricao.objects.filter(funcionario=user.id)
    
    if not inscricoes.exists():
        return Response([])

    ids_formacoes = [i.inscricao_id for i in inscricoes]
    print(ids_formacoes)
    formacoes = Formacoes.objects.filter(id__in=ids_formacoes)
    
    serializer = FormacoesSerializer(formacoes, many=True)
    
    return Response(serializer.data)
@api_view(['GET'])
@permission_classes([AllowAny])
def listar_vagas_por_empresa(request):
    nome_empresa = request.GET.get('empresa')
    if nome_empresa:
        vagas = Vagas.objects.filter(empresa__nome=nome_empresa)
        serializer = VagaSerializer(vagas, many=True)
        return Response(serializer.data)
    return Response({"error": "Empresa não especificada"}, status=400)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def formacores_data(request):
    user=request.user
    inicio = request.GET.get('dataInicio')
    fim = request.GET.get('dataFim')
    if inicio and fim:
        formacoes = Formacoes.objects.filter(dataInicio=inicio, dataFim=fim, empresa=user.empresa)
        serializer = FormacoesSerializer(formacoes, many=True)
        return Response(serializer.data)
    return Response({"error": "Data não especificada"}, status=400)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def formacores_departamento(request):
    user=request.user
    dept = request.GET.get('departamento')
    if dept:
        formacoes = Formacoes.objects.filter(departamento=dept, empresa=user.empresa)
        serializer = FormacoesSerializer(formacoes, many=True)
        return Response(serializer.data)
    return Response({"error": "Departamento não especificada"}, status=400)
# @api_view(['GET'])
# @permission_classes([AllowAny])
# def formacores_funcionario(request):
#     user=request.user
#     dept = request.GET.get('funcionario')
#     if dept:
#         formacoes = Formacoes.objects.filter(departamento=dept empresa=user.empresa)
#         serializer = FormacoesSerializer(formacoes, many=True)
#         return Response(serializer.data)
#     return Response({"error": "Departamento não especificada"}, status=400)
@api_view(['GET'])
@permission_classes([AllowAny])
def perfil_funcionario(request):
    id = request.GET.get('id')
    if id:
        valores = Valores.objects.filter(id=id)
        serializer = ValoresSerializer(valores, many=True)
        return Response(serializer.data)
    return Response({"error": "Empresa não especificada"}, status=400)
class DescontoImpostos(APIView):
    permission_classes=[IsAuthenticated]
    def post(self, request):
        user=request.user
        data=request.data
        empresa=user.empresa
        data["empresa"]=empresa.id
        serializer=DescontosSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self,request):
        user=request.user
        desconto=DescontosImposto.objects.filter(empresa=user.empresa)
        serializer=DepartamentoSerializer(desconto, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
class CandidaturaView(APIView):
    permission_classes=[AllowAny]
    def post(self, request):
        
        data=request.data
        serializer=CandidatoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
hoje=datetime.today()
seis_meses_atras=hoje-timedelta(30*6)
ultima_24h=hoje-timedelta(hours=24)
inicio_dia = datetime.combine(datetime.today().date(), time.min)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def candidatosView(request):
    user=request.user
    candidatos=Candidato.objects.filter(vaga__empresa=user.empresa.id)
    # candidatoshoje=Candidato.objects.filter(vaga__empresa=user.empresa.id, dataInscricao=hoje).count()
    serializer=CandidatoSerializer(candidatos, many=True)
    return Response({"dados":serializer.data}, status=status.HTTP_202_ACCEPTED)
def fecharVaga():
    vagaId = Vagas.objects.filter(status="aberta",dataFim__lt=timezone.now()).values_list('id', flat=True)
    if not vagaId:
        return Response({"message": "Nenhuma vaga precisa ser fechada"}, status=status.HTTP_202_ACCEPTED)
    Vagas.objects.filter(id__in=vagaId).update(status="fechada")
    vaga_actualizada=Vagas.objects.filter(id__in=vagaId)
@api_view(['POST'])
def logout_view(request):
    res=Response({'mensagem':'Logout Feito'})
    res.delete_cookie('access_token')
    return res
class PainelDados(APIView):
    def get(self,request):
        user=request.user
        departamento=Departamento.objects.filter(empresa=user.empresa.id).count()
        funcionarios=Valores.objects.filter(empresa=user.empresa.id).count()
        folha=FolhaPagamento.objects.filter(empresa=user.empresa.id)
        candidatura=Candidato.objects.filter(vaga__empresa=user.empresa.id, etapa="triagem").count()
        totaldefolha=sum(i.salario_liquido for i in folha)
        print(totaldefolha)
        return Response({"departamento":departamento, "funcionarios":funcionarios, "folha":totaldefolha,"Candidatura":candidatura}, status=status.HTTP_200_OK)
class DescontosImpostoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            descontos = DescontosImposto.objects.get(empresa=user.empresa)
            serializer = DescontosSerializer(descontos)
            return Response(serializer.data)
        except DescontosImposto.DoesNotExist:
            defaults = {
                'desconto_inss': 0.03,
                'irt2': 0.10,
                'irt3': 0.13,
                'irt4': 0.16,
                'irt5': 0.18,
                'irt6': 0.19,
                'irt7': 0.20
            }
            descontos = DescontosImposto.objects.create(empresa=user.empresa, **defaults)
            serializer = DescontosSerializer(descontos)
            return Response(serializer.data)

    def put(self, request):
        user = request.user
        try:
            descontos = DescontosImposto.objects.get(empresa=user.empresa)
            serializer = DescontosSerializer(descontos, data=request.data, partial=True)
            
            if serializer.is_valid():
                for field in ['desconto_inss', 'irt2', 'irt3', 'irt4', 'irt5', 'irt6', 'irt7']:
                    value = serializer.validated_data.get(field)
                    if value is not None and (value < 0 or value > 1):
                        return Response(
                            {"error": f"{field} deve ser entre 0 e 1 (0% a 100%)"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except DescontosImposto.DoesNotExist:
            return Response(
                {"error": "Configuração de impostos não encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )
class FormacoesView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        dados=request.data
        user=request.user
        dados["empresa"]=user.empresa.id
        serializer=FormacoesSerializer(data=dados)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        user=request.user
        formacoes=Formacoes.objects.filter(empresa=user.empresa.id)
        serializer=FormacoesSerializer(formacoes, many=True)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
class VagasView(APIView):
    def post(self,request):
        data=request.data
        user=request.user
        data["empresa"]=user.empresa.id
        serializer=VagaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        fecharVaga()
        user=request.user
        vaga=Vagas.objects.filter(empresa=user.empresa.id, status="aberta").count()
        candidato=Candidato.objects.filter(vaga__empresa=user.empresa.id).exclude(etapa="rejeitado").count()
        candidato1=Candidato.objects.filter(vaga__empresa=user.empresa.id, dataInscricao__gte=ultima_24h)
        candidatohoje=Candidato.objects.filter(vaga__empresa=user.empresa.id, dataInscricao__gte=inicio_dia)
        serializer_hoje=CandidatoSerializer(candidatohoje, many=True)
        serializer=CandidatoSerializer(candidato1, many=True)
        NomeEmpresa=Empresa.objects.get(nome=user.empresa.nome)
        serializer1=EmpresaSerializer(NomeEmpresa)
        print(serializer1.data)
        vagas=(Vagas.objects
              .filter(empresa=user.empresa.id, dataAbertura__gte=seis_meses_atras)
              .annotate(mes=TruncMonth("dataAbertura"))
              .values("mes")
              .annotate(vagas=Count("id"))
              .order_by("mes"))
        vg = Vagas.objects.filter(status='aberta',empresa=user.empresa.id)
        
        data = []
        for vag in vg:
            candidatos_count = Candidato.objects.filter(vaga=vag).count()
            data.append({
                'id': str(vag.id),
                'titulo': vag.titulo,
                'departamento': {'nome': vag.departamento.nome},
                'candidatos': candidatos_count,
                'dataAbertura': vag.dataAbertura,
                'dataFim': vag.dataFim,
                'status': vag.status
            })        
        return Response({"Aberta":vaga, "vagas":vagas,"candidato":candidato, "ultimaHoras":serializer.data,"empresa":serializer1.data, "candidatoshoje":serializer_hoje.data,"destaque":data}, status=status.HTTP_202_ACCEPTED)

class ModulosView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data=request.data
        user=request.user
        empresa=user.empresa
        data["empresa"]=empresa.id
        serializer = ModulosSerializer(data=data)
        if serializer.is_valid():
            modulos = serializer.save()
            return Response(ModulosSerializer(modulos).data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        user=request.user
        empresa=user.empresa
        modulos = Modulos.objects.filter(empresa=empresa)
        serializer = ModulosSerializer(modulos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def usuario_logado(request):
   user=request.user
   serializer=UsuarioEmpresaSerializer(user)
   empresa_data=EmpresaSerializer(user.empresa)
   return Response({"user":serializer.data, "empresa":empresa_data.data}, status=status.HTTP_200_OK)
def pegar_user(user):
    refresh=RefreshToken.for_user(user)
    return{
        'refresh':str(refresh),
        'access':str(refresh.access_token)
    }
from .serializers import VerificarOTPSerializer, SetPasswordSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def verificar_otp(request):
    
    serializer = VerificarOTPSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    email = serializer.validated_data['email']
    codigo = serializer.validated_data['otp']

    try:
        otp = OTP.objects.filter(
            funcionario__emailRep=email,  
            codigo=codigo,
            usado=False
        ).latest('criado_em')

        if (timezone.now() - otp.criado_em).total_seconds() > 300: # 300 segundos = 5 minutos
            return Response({'detail': 'OTP expirado.'}, status=status.HTTP_400_BAD_REQUEST)

    except OTP.DoesNotExist:
        return Response({'detail': 'OTP inválido ou já usado.'},
                        status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        otp.usado = True
        otp.save()

        funcionario = otp.funcionario
        funcionario.is_active = True
        funcionario.save()

    return Response({'detail': 'OTP verificado. Agora, defina sua nova senha.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def set_password(request):
    
    serializer = SetPasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    email = serializer.validated_data['email']
    senha = serializer.validated_data['senha']

    try:
        funcionario = UsuarioEmpresa.objects.get(emailRep=email)

    except UsuarioEmpresa.DoesNotExist:
        return Response({'detail': 'Funcionário não existe.'},
                        status=status.HTTP_404_NOT_FOUND)
    
    if not funcionario.is_active:
        return Response({'detail': 'A conta do funcionário ainda não foi ativada. Verifique o OTP primeiro.'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    funcionario.set_password(senha)
    funcionario.save()
    
    return Response({'detail': 'Senha criada com sucesso. Você pode fazer login agora.'},
                    status=status.HTTP_200_OK)
@api_view(['PUT'])
@permission_classes([AllowAny])
def ActualizarAPIView(request, id):

    try:
        leave = Dispensas.objects.get(pk=id)
    except Dispensas.DoesNotExist:
        return Response({'error': 'Pedido não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    user=request.user
    status_ = request.data.get('status')
    comment = request.data.get('admin_comentario', '')
    nome=request.data.get('funcionario_nome')    
    if status_ not in ['aprovado', 'rejeitado']:
        print(f"Status inválido recebido: {status_}")
        return Response({'error': 'Status inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        
    leave.status = status_
    leave.admin_comentario = comment
    leave.por=user.nomeRep
    leave.save(update_fields=['status', 'admin_comentario','por'])
    serializer = DispensasSerializer(leave)
    if status_ == 'aprovado':
        send_mail(
            subject='Sua dispensa foi aprovada',
            message=f"Olá ,\n\nSua dispensa foi aprovada.\n\nComentário do administrador:\n{comment}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[leave.funcionario.email],
            fail_silently=False
        )
    elif status_ =='rejeitado':
        send_mail(
            subject='Sua dispensa foi Reprovada',
            message=f"Olá Caríssimo(a) ,\n\nSua dispensa foi Rejectada.\n\nComentário do administrador:\n{comment}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[leave.funcionario.email],
            fail_silently=False
        )
    serializer = DispensasSerializer(leave)
    return Response({'message': 'Atualizado com sucesso.', 'data': serializer.data})

@api_view(['DELETE'])
def deletar(request,pk):
    try:
        dispensas=Dispensas.objects.get(pk=pk)
    except dispensas.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method=="DELETE":
        dispensas.delete()
        return Response(status.HTTP_204_NO_CONTENT)
class EntrevistaView(APIView):
    def post(self, request):
        serializer = EntrevistaSerializer(data=request.data)
        if serializer.is_valid():
            entrevista = serializer.save()
            
            send_mail(
                 'Confirmação de Entrevista',
                 f'Olá, sua entrevista foi agendada para {entrevista.dataHora}',
                 
                 [entrevista.candidato.email],
                 fail_silently=False,
             )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TesteTecnicoView(APIView):
    def post(self, request):
        print(request.data)
        serializer = TesteTecnicoSerializer(data=request.data)
        if serializer.is_valid():
            teste = serializer.save()
            
            send_mail(
                 'Teste Técnico',
                 f'Acesse o teste em: {teste.link}',
                 [teste.candidato.email],
                 fail_silently=False,
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ProximasEntrevistasView(APIView):
    def get(self, request):
        hoje_inicio = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        amanha_fim = hoje_inicio + timedelta(days=2)
        
        entrevistas = Entrevista.objects.filter(
            dataHora__gte=hoje_inicio,
            dataHora__lt=amanha_fim
        ).order_by('dataHora')
        
        serializer = EntrevistaSerializer(entrevistas, many=True)
        return Response(serializer.data)
class RelatorioView(APIView):
    def get(self, request):
        tipo = request.GET.get('tipo', 'candidatos')
        periodo = request.GET.get('periodo', '7dias')
        
        
        relatorio_url = f"/relatorios/{tipo}/{periodo}.pdf"
        
        return Response({"url": relatorio_url}, status=status.HTTP_200_OK)