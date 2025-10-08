import json
from django.conf import settings
from django.http import Http404
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
from .models import Empresa,  Satisfacao,UsuarioEmpresa, Funcionario,ValoresArquivo,OTP, CamposPersonalizados, Dispensas,Departamento
from datetime import time, timedelta, datetime
from decimal import Decimal,ROUND_HALF_UP
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import EmpresaSerializer,  SatisfacaoSerializer,DispensasSerializer, ValoresSerializer, CamposPersonalizadosSerializer,DepartamentoSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.db.models import Avg, F,Sum
from django.utils import timezone
from django.contrib.auth.hashers import make_password
User = get_user_model()
from rest_framework.decorators import api_view,permission_classes




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
        print("erro",serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class satisfacao(APIView):
    permission_classes=[IsAuthenticated]
    def post(self, request):
        empresa=request.user.empresa
        dado= request.data
        dado["empresa"]=empresa.id
        if dado["pontuacao"]>5 or dado["pontuacao"]<1:
            return Response({"error":"A pontuação deve ser entre 1 e 5"}, status=status.HTTP_400_BAD_REQUEST)
        if Satisfacao.objects.filter(empresa=empresa).exists():
            return Response({"error":"Você já enviou sua avaliação"}, status=status.HTTP_400_BAD_REQUEST)
        serializer=SatisfacaoSerializer(data=dado)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
@api_view(['GET'])
@permission_classes([AllowAny])
def percentagemSatisfacao(request):
    satis=Satisfacao.objects.all()
    pontuacao=Satisfacao.objects.aggregate(pontuacao=Sum('pontuacao'))['pontuacao'] or 0
    empresa_count=Satisfacao.objects.values('empresa').distinct().count()
    if empresa_count==0:
        return Response(0, status=status.HTTP_202_ACCEPTED)
    percetagem=int((pontuacao/(empresa_count*5))*100)
    return Response(percetagem, status=status.HTTP_202_ACCEPTED)
class valoresdoscampos(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        empresa = user.empresa
        dado = request.data.copy()
        salario=request.data.get('salario_bruto')
        valores_json_str = request.data.get('valores', '{}')
        print("Content-Type:", request.content_type)
        print("Dados:", request.data)
        print("Arquivos:", dict(request.FILES))
        print("Usuário:", request.user)
        print("Empresa:", request.user.empresa)
        try:
            valores_json = json.loads(valores_json_str)
            salario1=Decimal(salario)
        except json.JSONDecodeError:
            return Response({"valores": "Formato JSON inválido."}, status=status.HTTP_400_BAD_REQUEST)

        nome_funcionario = valores_json.get('Nome', valores_json.get('nome', None))
        email_funcionario = valores_json.get('Email', valores_json.get('email', None))

        """ if not nome_funcionario or not email_funcionario:
            return Response({"erro": "Nome e Email do funcionário são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST) """

        departamento_id = request.data.get('departamento')
        dado["empresa"]=empresa.id
        departamento_instance = None
        if departamento_id:
            try:
                departamento_instance = Departamento.objects.get(id=departamento_id, empresa=empresa)
            except Departamento.DoesNotExist:
                return Response({"departamento": "Departamento inválido ou não pertence a esta empresa."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                
                if UsuarioEmpresa.objects.filter(emailRep=email_funcionario, empresa=empresa).exists():
                        return Response({"erro": "Já existe um funcionário com este email."}, status=status.HTTP_400_BAD_REQUEST)
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
                    'salario_bruto':salario1
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
                    print(serializer.errors)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"Erro inesperado: {e}")
            return Response({"erro": "Ocorreu um erro inesperado."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def get(self, request):
        user=request.user
        
        valores=Funcionario.objects.filter(empresa__nome=user.empresa).prefetch_related('arquivos')
        print(user.empresa)
        serializer=ValoresSerializer(valores, many=True)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    def get_object(self, pk, empresa):
        try:
            return Funcionario.objects.get(pk=pk, empresa=empresa)
        except Funcionario.DoesNotExist:
            raise Http404

    def put(self, request, pk):
        user = request.user
        empresa = user.empresa
        funcionario = self.get_object(pk, empresa)
        
        dados = request.data.copy()
        salario = dados.get('salario_bruto')
        valores_json_str = dados.get('valores', '{}')
        
        try:
            valores_json = json.loads(valores_json_str)
            salario_decimal = Decimal(salario) if salario else funcionario.salario_bruto
        except (json.JSONDecodeError, ValueError) as e:
            return Response({"erro": "Dados inválidos."}, status=status.HTTP_400_BAD_REQUEST)

        # Atualizar dados do funcionário
        departamento_id = dados.get('departamento')
        departamento_instance = None
        
        if departamento_id:
            try:
                departamento_instance = Departamento.objects.get(id=departamento_id, empresa=empresa)
            except Departamento.DoesNotExist:
                return Response({"departamento": "Departamento inválido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # Atualizar dados principais
                data_para_serializer = {
                    'empresa': empresa.id,
                    'valores': valores_json,
                    'departamento': departamento_instance.id if departamento_instance else funcionario.departamento.id if funcionario.departamento else None,
                    'salario_bruto': salario_decimal
                }
                
                serializer = ValoresSerializer(funcionario, data=data_para_serializer, partial=True)
                if serializer.is_valid():
                    valores_instancia = serializer.save()
                    
                    # Processar arquivos
                    arquivos = request.FILES
                    for nome_campo, arquivo in arquivos.items():
                        try:
                            campo_personalizado = CamposPersonalizados.objects.get(nome=nome_campo, empresa=empresa)
                            
                            # Verificar se já existe arquivo para este campo
                            arquivo_existente = ValoresArquivo.objects.filter(
                                valores_instancia=valores_instancia,
                                campo_personalizado=campo_personalizado
                            ).first()
                            
                            if arquivo_existente:
                                # Atualizar arquivo existente
                                arquivo_existente.arquivo = arquivo
                                arquivo_existente.save()
                            else:
                                # Criar novo arquivo
                                ValoresArquivo.objects.create(
                                    valores_instancia=valores_instancia,
                                    campo_personalizado=campo_personalizado,
                                    arquivo=arquivo
                                )
                                
                        except CamposPersonalizados.DoesNotExist:
                            print(f"Campo personalizado '{nome_campo}' não encontrado.")
                    
                    return Response({
                        "detail": "Funcionário atualizado com sucesso.",
                        "data": serializer.data
                    }, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"Erro inesperado: {e}")
            return Response({"erro": "Ocorreu um erro inesperado."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        user = request.user
        empresa = user.empresa
        
        try:
            funcionario = self.get_object(pk, empresa)
            funcionario.delete()
            
            return Response({
                "detail": "Funcionário excluído com sucesso."
            }, status=status.HTTP_204_NO_CONTENT)
            
        except Http404:
            return Response({"erro": "Funcionário não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Erro inesperado: {e}")
            return Response({"erro": "Ocorreu um erro ao excluir o funcionário."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
@permission_classes([AllowAny])
def campos_lista(request):
    campos=CamposPersonalizados.objects.all()
    serializer = CamposPersonalizadosSerializer(campos, many=True)

    
    # if(CamposPersonalizados.objects.filter(nome=dt)):
    #     print("Siiiiiiiiii")
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['GET'])
@permission_classes([AllowAny])
def empresa(request):
    empresa=Empresa.objects.all()
    serializer = EmpresaSerializer(campos, many=True)
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
       
        serializer=DepartamentoSerializer(deparmentos, many=True)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
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

""" @api_view(['GET'])
@permission_classes([AllowAny])
def listar_vagas_por_empresa(request):
    nome_empresa = request.GET.get('empresa')
    if nome_empresa:
        vagas = Vagas.objects.filter(empresa__nome=nome_empresa)
        serializer = VagaSerializer(vagas, many=True)
        return Response(serializer.data)
    return Response({"error": "Empresa não especificada"}, status=400) """

@api_view(['GET'])
@permission_classes([AllowAny])
def perfil_funcionario(request):
    id = request.GET.get('id')
    if id:
        valores = Funcionario.objects.filter(id=id)
        serializer = ValoresSerializer(valores, many=True)
        return Response(serializer.data)
    return Response({"error": "Empresa não especificada"}, status=400)

@api_view(['POST'])
def logout_view(request):
    res=Response({'mensagem':'Logout Feito'})
    res.delete_cookie('access_token')
    return res

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
@api_view(['GET', 'DELETE', 'PUT'])
@permission_classes([IsAuthenticated])
def campo_detalhe(request, pk):
    """
    View para obter, atualizar ou deletar um campo personalizado específico
    """
    user = request.user
    try:
        campo = CamposPersonalizados.objects.get(pk=pk, empresa=user.empresa)
    except CamposPersonalizados.DoesNotExist:
        return Response({"error": "Campo não encontrado"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CamposPersonalizadosSerializer(campo)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CamposPersonalizadosSerializer(campo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        campo_em_uso = ValoresArquivo.objects.filter(campo_personalizado=campo).exists()
        
        campos_em_valores = Funcionario.objects.filter(
            empresa=user.empresa,
            valores__has_key=campo.nome
        ).exists()
        
        if campo_em_uso or campos_em_valores:
            return Response({
                "error": "Não é possível excluir este campo pois ele está sendo utilizado em funcionários"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        campo.delete()
        return Response({"message": "Campo excluído com sucesso"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def campos_empresa_com_uso(request):
   
    user = request.user
    campos = CamposPersonalizados.objects.filter(empresa=user.empresa)
    
    campos_com_uso = []
    for campo in campos:
        em_uso_arquivos = ValoresArquivo.objects.filter(campo_personalizado=campo).exists()
        em_uso_valores = Funcionario.objects.filter(
            empresa=user.empresa,
            valores__has_key=campo.nome
        ).exists()
        
        em_uso = em_uso_arquivos or em_uso_valores
        
        campo_data = CamposPersonalizadosSerializer(campo).data
        campo_data['em_uso'] = em_uso
        campo_data['quantidade_uso'] = ValoresArquivo.objects.filter(campo_personalizado=campo).count() + \
                                     Funcionario.objects.filter(
                                         empresa=user.empresa,
                                         valores__has_key=campo.nome
                                     ).count()
        
        campos_com_uso.append(campo_data)
    
    return Response(campos_com_uso)