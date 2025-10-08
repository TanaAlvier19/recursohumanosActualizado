from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from datetime import datetime, timedelta
from rest_framework.permissions import AllowAny, IsAuthenticated
from decimal import Decimal

from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta
import logging
logger = logging.getLogger(__name__)
from app.models import (
    Empresa, UsuarioEmpresa, Funcionario, Departamento, Dispensas
)
from .models import (
    DescontosImposto, FolhaPagamento, ReciboPagamento,
    HoraExtra, Ferias, DecimoTerceiro, Emprestimo,
    ParcelaEmprestimo, RelatorioFiscal, RelatorioContabil,
    Desconto, Beneficio
)
from .serializers import (
    FolhaPagamentoSerializer, ReciboPagamentoSerializer,
    HoraExtraSerializer, FeriasSerializer, DecimoTerceiroSerializer,
    EmprestimoSerializer, ParcelaEmprestimoSerializer, RelatorioFiscalSerializer,
    RelatorioContabilSerializer, DescontosImpostoSerializer,
    DescontoSerializer, BeneficioSerializer
)

from .calculadora_angola import CalculadoraAngola
from app.serializers import (
    ValoresSerializer,
    EmpresaSerializer, UsuarioEmpresaSerializer,
    DepartamentoSerializer,
    DispensasSerializer

)

class EmpresaViewSet(viewsets.ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['nome', 'nif', 'email_corporativo']
    
    def get_queryset(self):
        user = self.request.user
        if user.nivel_acesso == 'admin':
            return Empresa.objects.filter(id=user.empresa.id)
        return Empresa.objects.none()


class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['nome', 'codigo', 'responsavel']
    filterset_fields = ['empresa', 'status']
    
    def get_queryset(self):
        user = self.request.user
        return Departamento.objects.filter(empresa=user.empresa)


class FuncionarioViewSet(viewsets.ModelViewSet):
    queryset = Funcionario.objects.all()
    serializer_class = ValoresSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['valores__nome', 'valores__email']
    filterset_fields = ['empresa', 'departamento']
    
    def get_queryset(self):
        user = self.request.user
        if user.nivel_acesso == 'admin':
            return Funcionario.objects.filter(empresa=user.empresa)
        return Funcionario.objects.filter(id=user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        try:
            funcionario = Funcionario.objects.get(id=request.user.id)
            serializer = self.get_serializer(funcionario)
            return Response(serializer.data)
        except Funcionario.DoesNotExist:
            return Response(
                {'error': 'Funcionário não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )


class FolhaPagamentoViewSet(viewsets.ModelViewSet):
    queryset = FolhaPagamento.objects.all()
    serializer_class = FolhaPagamentoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'mes_referencia']
    
    def get_queryset(self):
        user = self.request.user
        if user.nivel_acesso == 'admin':
            # Admin vê todas as folhas da empresa
            return FolhaPagamento.objects.all()
        return FolhaPagamento.objects.none()
    
    @action(detail=True, methods=['post'])
    def processar(self, request, pk=None):
        """Processa a folha de pagamento"""
        folha = self.get_object()
        if folha.status != 'RASCUNHO':
            return Response(
                {'error': 'Folha já foi processada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        folha.status = 'EM_PROCESSAMENTO'
        folha.data_processamento = datetime.now()
        folha.save()
        
        # Aqui você implementaria a lógica de processamento
        # Por exemplo, calcular todos os recibos
        
        folha.status = 'PROCESSADA'
        folha.save()
        
        serializer = self.get_serializer(folha)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def aprovar(self, request, pk=None):
        """Aprova a folha de pagamento"""
        folha = self.get_object()
        if folha.status != 'PROCESSADA':
            return Response(
                {'error': 'Folha precisa estar processada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        folha.status = 'APROVADA'
        folha.data_aprovacao = datetime.now()
        folha.aprovado_por = request.user
        folha.save()
        
        serializer = self.get_serializer(folha)
        return Response(serializer.data)


class ReciboPagamentoViewSet(viewsets.ModelViewSet):
    queryset = ReciboPagamento.objects.all()
    serializer_class = ReciboPagamentoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['funcionario__valores__nome']
    filterset_fields = ['status', 'mes_referencia', 'folha']
    
    def get_queryset(self):
        user = self.request.user
        if user.nivel_acesso == 'admin':
            # Admin vê todos os recibos
            return ReciboPagamento.objects.all()
        # Funcionário vê apenas seus recibos
        return ReciboPagamento.objects.filter(funcionario=user)
    
    @action(detail=False, methods=['get'])
    def meus(self, request):
        """Retorna recibos do funcionário logado"""
        recibos = ReciboPagamento.objects.filter(funcionario=request.user.id)
        serializer = self.get_serializer(recibos, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def visualizar(self, request, pk=None):
        """Marca recibo como visualizado"""
        recibo = self.get_object()
        if not recibo.data_visualizacao:
            recibo.data_visualizacao = datetime.now()
            recibo.status = 'VISUALIZADO'
            recibo.save()
        
        serializer = self.get_serializer(recibo)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def baixar(self, request, pk=None):
        """Marca recibo como baixado"""
        recibo = self.get_object()
        recibo.data_download = datetime.now()
        recibo.status = 'BAIXADO'
        recibo.save()
        
        serializer = self.get_serializer(recibo)
        return Response(serializer.data)
    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        mes = request.query_params.get('mes')
        ano = request.query_params.get('ano')
        
        recibos = ReciboPagamento.objects.all()
        if mes and ano:
            recibos = recibos.filter(mes_referencia=mes, ano_referencia=ano)
        
        total_recibos = recibos.count()
        total_pago = recibos.filter(status='pago').count()
        total_pendente = recibos.filter(status='pendente').count()
        
        from django.db.models import Sum
        valor_total_mes = recibos.filter(status='pago').aggregate(
            total=Sum('salario_liquido')
        )['total'] or 0
        
        estatisticas = {
            'total_recibos': total_recibos,
            'total_pago': total_pago,
            'total_pendente': total_pendente,
            'valor_total_mes': valor_total_mes,
        }
        
        return Response(estatisticas)

class HoraExtraViewSet(viewsets.ModelViewSet):
    queryset = HoraExtra.objects.all()
    serializer_class = HoraExtraSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['funcionario__valores__nome']
    filterset_fields = ['status', 'tipo', 'data']
    
    def get_queryset(self):
        user = self.request.user
        if user.nivel_acesso == 'admin':
            return HoraExtra.objects.all()
        return HoraExtra.objects.filter(funcionario=user)
    
    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        """Retorna estatísticas de horas extras"""
        queryset = self.get_queryset()
        
        total = queryset.count()
        pendentes = queryset.filter(status='PENDENTE').count()
        aprovadas = queryset.filter(status='APROVADA').count()
        rejeitadas = queryset.filter(status='REJEITADA').count()
        
        # Valor total de horas extras aprovadas
        from django.db.models import Sum
        valor_total = queryset.filter(status='APROVADA').aggregate(
            total=Sum('valor_total')
        )['total'] or 0
        
        return Response({
            'total': total,
            'pendentes': pendentes,
            'aprovadas': aprovadas,
            'rejeitadas': rejeitadas,
            'valor_total': float(valor_total),
        })
    
    @action(detail=True, methods=['post'])
    def aprovar(self, request, pk=None):
        """Aprova hora extra"""
        hora_extra = self.get_object()
        if hora_extra.status != 'PENDENTE':
            return Response(
                {'error': 'Hora extra já foi processada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        hora_extra.status = 'APROVADA'
        hora_extra.data_aprovacao = datetime.now()
        hora_extra.aprovado_por = request.user
        hora_extra.save()
        
        serializer = self.get_serializer(hora_extra)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def rejeitar(self, request, pk=None):
        """Rejeita hora extra"""
        hora_extra = self.get_object()
        hora_extra.status = 'REJEITADA'
        hora_extra.observacoes = request.data.get('observacoes', '')
        hora_extra.save()
        
        serializer = self.get_serializer(hora_extra)
        return Response(serializer.data)


class FeriasViewSet(viewsets.ModelViewSet):
    queryset = Ferias.objects.all()
    serializer_class = FeriasSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['funcionario__valores__nome']
    filterset_fields = ['status', 'data_inicio', 'data_fim']
    
    def get_queryset(self):
        user = self.request.user
        if user.nivel_acesso == 'admin':
            return Ferias.objects.all()
        return Ferias.objects.filter(funcionario=user)
    
    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        """Retorna estatísticas de férias"""
        queryset = self.get_queryset()
        
        total = queryset.count()
        programadas = queryset.filter(status='PROGRAMADA').count()
        aprovadas = queryset.filter(status='APROVADA').count()
        em_gozo = queryset.filter(status='EM_GOZO').count()
        concluidas = queryset.filter(status='CONCLUIDA').count()
        
        # Valor total de férias
        from django.db.models import Sum
        valor_total = queryset.aggregate(total=Sum('valor_total'))['total'] or 0
        
        return Response({
            'total': total,
            'programadas': programadas,
            'aprovadas': aprovadas,
            'em_gozo': em_gozo,
            'concluidas': concluidas,
            'valor_total': float(valor_total),
        })
    
    @action(detail=True, methods=['post'])
    def aprovar(self, request, pk=None):
        """Aprova férias"""
        ferias = self.get_object()
        if ferias.status != 'PROGRAMADA':
            return Response(
                {'error': 'Férias já foram processadas'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ferias.status = 'APROVADA'
        ferias.data_aprovacao = datetime.now()
        ferias.aprovado_por = request.user
        ferias.save()
        
        serializer = self.get_serializer(ferias)
        return Response(serializer.data)


class DecimoTerceiroViewSet(viewsets.ModelViewSet):
    queryset = DecimoTerceiro.objects.all()
    serializer_class = DecimoTerceiroSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['funcionario__valores__nome']
    filterset_fields = ['status', 'ano_referencia']
    
    def get_queryset(self):
        user = self.request.user
        if user.nivel_acesso == 'admin':
            return DecimoTerceiro.objects.all()
        return DecimoTerceiro.objects.filter(funcionario=user)


class EmprestimoViewSet(viewsets.ModelViewSet):
    queryset = Emprestimo.objects.all()
    serializer_class = EmprestimoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['funcionario__valores__nome']
    filterset_fields = ['status', 'data_solicitacao']
    
    def get_queryset(self):
        user = self.request.user
        if user.nivel_acesso == 'admin':
            return Emprestimo.objects.all()
        return Emprestimo.objects.filter(funcionario=user)
    
    def perform_create(self, serializer):
        try:
            
            print("=== DEBUG EMPRÉSTIMO ===")
            print(f"Usuário: {self.request.user}")
            print(f"Empresa: {self.request.user.empresa}")
            print(f"Dados: {self.request.data}")
            
            instance = serializer.save(
                funcionario=self.request.user.id, 
                empresa=self.request.user.empresa
            )
            
            logger.info(f"Empréstimo criado com sucesso - ID: {instance.id}")
            print(f"EMPRÉSTIMO CRIADO - ID: {instance.id}")
            
        except Exception as e:
            logger.error(f"Erro ao criar empréstimo: {str(e)}")
            print(f" ERRO: {str(e)}")
            raise
    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        """Retorna estatísticas de empréstimos"""
        queryset = self.get_queryset()
        
        total = queryset.count()
        solicitados = queryset.filter(status='SOLICITADO').count()
        aprovados = queryset.filter(status='APROVADO').count()
        rejeitados = queryset.filter(status='REJEITADO').count()
        quitados = queryset.filter(status='QUITADO').count()
        
        from django.db.models import Sum
        valor_solicitado = queryset.aggregate(
            total=Sum('valor_solicitado')
        )['total'] or 0
        valor_aprovado = queryset.filter(status__in=['APROVADO', 'QUITADO']).aggregate(
            total=Sum('valor_aprovado')
        )['total'] or 0
        
        return Response({
            'total': total,
            'solicitados': solicitados,
            'aprovados': aprovados,
            'rejeitados': rejeitados,
            'quitados': quitados,
            'valor_solicitado': float(valor_solicitado),
            'valor_aprovado': float(valor_aprovado),
        })
    
    @action(detail=True, methods=['post'])
    def aprovar(self, request, pk=None):
        """Aprova empréstimo"""
        emprestimo = self.get_object()
        if emprestimo.status != 'SOLICITADO':
            return Response(
                {'error': 'Empréstimo já foi processado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        valor_aprovado = request.data.get('valor_aprovado', emprestimo.valor_solicitado)
        emprestimo.valor_aprovado = valor_aprovado
        emprestimo.status = 'APROVADO'
        emprestimo.data_aprovacao = datetime.now().date()
        emprestimo.aprovado_por = request.user
        emprestimo.calcular_parcelas()
        emprestimo.save()
        
        data_primeira_parcela = request.data.get('data_primeira_parcela')
        if data_primeira_parcela:
            emprestimo.data_primeira_parcela = data_primeira_parcela
            emprestimo.save()
            
            for i in range(1, emprestimo.numero_parcelas + 1):
                data_vencimento = datetime.strptime(data_primeira_parcela, '%Y-%m-%d').date()
                data_vencimento = data_vencimento.replace(month=data_vencimento.month + i - 1)
                
                ParcelaEmprestimo.objects.create(
                    emprestimo=emprestimo,
                    numero_parcela=i,
                    valor=emprestimo.valor_parcela,
                    data_vencimento=data_vencimento
                )
        
        serializer = self.get_serializer(emprestimo)
        print(serializer.errors)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def rejeitar(self, request, pk=None):
        emprestimo = self.get_object()
        emprestimo.status = 'REJEITADO'
        emprestimo.observacoes = request.data.get('observacoes', '')
        emprestimo.save()
        
        serializer = self.get_serializer(emprestimo)
        return Response(serializer.data)


class RelatorioFiscalViewSet(viewsets.ModelViewSet):
    queryset = RelatorioFiscal.objects.all()
    serializer_class = RelatorioFiscalSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo', 'periodo', 'status']


class RelatorioContabilViewSet(viewsets.ModelViewSet):
    queryset = RelatorioContabil.objects.all()
    serializer_class = RelatorioContabilSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo', 'periodo']


class DispensasViewSet(viewsets.ModelViewSet):
    queryset = Dispensas.objects.all()
    serializer_class = DispensasSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['funcionario__nomeRep', 'motivo']
    filterset_fields = ['status', 'inicio', 'fim']
    
    def get_queryset(self):
        user = self.request.user
        if user.nivel_acesso == 'admin':
            return Dispensas.objects.filter(empresa=user.empresa)
        return Dispensas.objects.filter(funcionario=user)
    
    def perform_create(self, serializer):
        serializer.save(funcionario=self.request.user, empresa=self.request.user.empresa)
    
    @action(detail=True, methods=['post'])
    def aprovar(self, request, pk=None):
        dispensa = self.get_object()
        dispensa.status = 'aprovado'
        dispensa.por = request.user.nomeRep
        dispensa.admin_comentario = request.data.get('comentario', '')
        dispensa.save()
        
        serializer = self.get_serializer(dispensa)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def rejeitar(self, request, pk=None):
        """Rejeita dispensa"""
        dispensa = self.get_object()
        dispensa.status = 'rejeitado'
        dispensa.por = request.user.nomeRep
        dispensa.admin_comentario = request.data.get('comentario', '')
        dispensa.save()
        
        serializer = self.get_serializer(dispensa)
        return Response(serializer.data)


class DescontosImpostoViewSet(viewsets.ModelViewSet):
    queryset = DescontosImposto.objects.all()
    serializer_class = DescontosImpostoSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def atual(self, request):
        """Retorna configuração atual de impostos"""
        try:
            config = DescontosImposto.objects.latest('atualizado_em')
            serializer = self.get_serializer(config)
            return Response(serializer.data)
        except DescontosImposto.DoesNotExist:
            return Response(
                {'error': 'Configuração de impostos não encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )


class DescontoViewSet(viewsets.ModelViewSet):
    queryset = Desconto.objects.all()
    serializer_class = DescontoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['funcionario__valores__nome', 'tipo', 'descricao']
    filterset_fields = ['status', 'tipo', 'recorrente', 'funcionario']
    
    def get_queryset(self):
        user = self.request.user
        if user.nivel_acesso == 'admin':
            return Desconto.objects.all()
        return Desconto.objects.filter(funcionario=user)
    
    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        queryset = self.get_queryset()
        
        from django.db.models import Sum, Count
        
        total = queryset.count()
        ativos = queryset.filter(status='ativo').count()
        inativos = queryset.filter(status='inativo').count()
        
        valor_total = queryset.filter(status='ativo').aggregate(
            total=Sum('valor_fixo')
        )['total'] or 0
        
        por_tipo = queryset.filter(status='ativo').values('tipo').annotate(
            count=Count('id'),
            total=Sum('valor_fixo')
        )
        
        return Response({
            'total': total,
            'ativos': ativos,
            'inativos': inativos,
            'valor_total': float(valor_total),
            'por_tipo': list(por_tipo),
        })
    
    @action(detail=True, methods=['post'])
    def ativar(self, request, pk=None):
        desconto = self.get_object()
        desconto.status = 'ativo'
        desconto.save()
        
        serializer = self.get_serializer(desconto)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def desativar(self, request, pk=None):
        desconto = self.get_object()
        desconto.status = 'inativo'
        desconto.save()
        
        serializer = self.get_serializer(desconto)
        return Response(serializer.data)


class BeneficioViewSet(viewsets.ModelViewSet):
    queryset = Beneficio.objects.all()
    serializer_class = BeneficioSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['funcionario__valores__nome', 'tipo', 'descricao']
    filterset_fields = ['status', 'tipo', 'recorrente', 'funcionario']
    
    def get_queryset(self):
        user = self.request.user
        if user.nivel_acesso == 'admin':
            return Beneficio.objects.all()
        return Beneficio.objects.filter(funcionario=user)
    
    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        queryset = self.get_queryset()
        
        from django.db.models import Sum, Count
        
        total = queryset.count()
        ativos = queryset.filter(status='ativo').count()
        inativos = queryset.filter(status='inativo').count()
        
        # Valor total de benefícios ativos
        valor_total = queryset.filter(status='ativo').aggregate(
            total=Sum('valor')
        )['total'] or 0
        
        por_tipo = queryset.filter(status='ativo').values('tipo').annotate(
            count=Count('id'),
            total=Sum('valor')
        )
        
        return Response({
            'total': total,
            'ativos': ativos,
            'inativos': inativos,
            'valor_total': float(valor_total),
            'por_tipo': list(por_tipo),
        })
    
    @action(detail=True, methods=['post'])
    def ativar(self, request, pk=None):
        beneficio = self.get_object()
        beneficio.status = 'ativo'
        beneficio.save()
        
        serializer = self.get_serializer(beneficio)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def desativar(self, request, pk=None):
        beneficio = self.get_object()
        beneficio.status = 'inativo'
        beneficio.save()
        
        serializer = self.get_serializer(beneficio)
        return Response(serializer.data)


@api_view(['POST'])
def simular_folha(request):
    """Simula cálculo de folha de pagamento com impostos reais de Angola"""
    try:
        data = request.data
        
        resultado = CalculadoraAngola.calcular_salario_liquido(
            salario_base=Decimal(str(data.get('salario_base', 0))),
            horas_extras=Decimal(str(data.get('horas_extras', 0))),
            bonus=Decimal(str(data.get('bonus', 0))),
            subsidio_alimentacao=Decimal(str(data.get('subsidio_alimentacao', 0))),
            subsidio_transporte=Decimal(str(data.get('subsidio_transporte', 0))),
            outros_vencimentos=Decimal(str(data.get('outros_vencimentos', 0))),
            emprestimos=Decimal(str(data.get('emprestimos', 0))),
            adiantamentos=Decimal(str(data.get('adiantamentos', 0))),
            outros_descontos=Decimal(str(data.get('outros_descontos', 0))),
            num_dependentes=int(data.get('num_dependentes', 0)),
        )
        
        # Converter Decimal para float para JSON
        resultado_json = {k: float(v) if isinstance(v, Decimal) else v 
                         for k, v in resultado.items() if k != 'irt_detalhes'}
        
        # Adicionar detalhes do IRT
        irt_detalhes = resultado['irt_detalhes']
        resultado_json['irt_detalhes'] = {
            k: float(v) if isinstance(v, Decimal) else v 
            for k, v in irt_detalhes.items()
        }
        
        return Response(resultado_json)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def simular_rescisao(request):
    """Simula cálculo de rescisão conforme legislação angolana"""
    try:
        data = request.data
        
        from datetime import datetime
        data_admissao = datetime.strptime(data.get('data_admissao'), '%Y-%m-%d').date()
        data_rescisao = datetime.strptime(data.get('data_rescisao'), '%Y-%m-%d').date()
        
        resultado = CalculadoraAngola.calcular_rescisao(
            salario_base=Decimal(str(data.get('salario_base', 0))),
            data_admissao=data_admissao,
            data_rescisao=data_rescisao,
            tipo_rescisao=data.get('tipo_rescisao', 'sem_justa_causa'),
            saldo_ferias_dias=int(data.get('saldo_ferias_dias', 0)),
        )
        
        # Converter Decimal para float
        resultado_json = {k: float(v) if isinstance(v, Decimal) else v 
                         for k, v in resultado.items()}
        
        return Response(resultado_json)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def simular_reajuste(request):
    """Simula impacto de reajuste salarial na folha"""
    try:
        data = request.data
        
        salario_atual = Decimal(str(data.get('salario_atual', 0)))
        percentual_reajuste = Decimal(str(data.get('percentual_reajuste', 0)))
        num_funcionarios = int(data.get('num_funcionarios', 1))
        
        # Novo salário
        novo_salario = salario_atual * (1 + percentual_reajuste / 100)
        
        # Calcular folha atual
        folha_atual = CalculadoraAngola.calcular_salario_liquido(
            salario_base=salario_atual,
            num_dependentes=int(data.get('num_dependentes', 0)),
        )
        
        # Calcular nova folha
        folha_nova = CalculadoraAngola.calcular_salario_liquido(
            salario_base=novo_salario,
            num_dependentes=int(data.get('num_dependentes', 0)),
        )
        
        # Impacto
        impacto_mensal = (folha_nova['custo_total_empresa'] - folha_atual['custo_total_empresa']) * num_funcionarios
        impacto_anual = impacto_mensal * 12
        
        resultado = {
            'salario_atual': float(salario_atual),
            'novo_salario': float(novo_salario),
            'percentual_reajuste': float(percentual_reajuste),
            'num_funcionarios': num_funcionarios,
            
            'folha_atual': {
                'salario_liquido': float(folha_atual['salario_liquido']),
                'custo_empresa': float(folha_atual['custo_total_empresa']),
            },
            'folha_nova': {
                'salario_liquido': float(folha_nova['salario_liquido']),
                'custo_empresa': float(folha_nova['custo_total_empresa']),
            },
            
            'impacto_mensal': float(impacto_mensal),
            'impacto_anual': float(impacto_anual),
        }
        
        return Response(resultado)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def simular_custo_contratacao(request):
    """Simula custo total de contratação"""
    try:
        data = request.data
        
        resultado = CalculadoraAngola.calcular_custo_contratacao(
            salario_base=Decimal(str(data.get('salario_base', 0))),
            subsidio_alimentacao=Decimal(str(data.get('subsidio_alimentacao', 0))),
            subsidio_transporte=Decimal(str(data.get('subsidio_transporte', 0))),
        )
        
        # Converter Decimal para float
        resultado_json = {k: float(v) if isinstance(v, Decimal) else v 
                         for k, v in resultado.items()}
        
        return Response(resultado_json)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
@api_view(['GET'])
def resumo_folha_completo(request):
    """Retorna resumo completo da folha de pagamento"""
    try:
        # Dados básicos
        total_funcionarios = Funcionario.objects.filter(empresa=request.user.empresa).count()
        funcionarios_ativos = Funcionario.objects.filter(
            empresa=request.user.empresa, 
            status='ativo'
        ).count()
        
        # Mês e ano atual para cálculos
        hoje = timezone.now()
        mes_atual = hoje.month
        ano_atual = hoje.year
        
        # Recibos do mês atual
        recibos_mes = ReciboPagamento.objects.filter(
            mes_referencia=mes_atual,
            ano_referencia=ano_atual
        )
        
        # Cálculos financeiros
        total_folha = recibos_mes.filter(status='PAGO').aggregate(
            total=Sum('salario_liquido')
        )['total'] or 0
        
        # Média salarial baseada nos funcionários ativos
        media_salarial = Funcionario.objects.filter(
            empresa=request.user.empresa,
            status='ativo'
        ).aggregate(
            media=Avg('salario_base')
        )['media'] or 0
        
        # Benefícios ativos
        total_beneficios = Beneficio.objects.filter(
            status='ativo'
        ).aggregate(
            total=Sum('valor')
        )['total'] or 0
        
        # Descontos totais
        total_descontos = recibos_mes.aggregate(
            total=Sum('total_descontos')
        )['total'] or 0
        
        # Folha pendente
        folha_pendente = recibos_mes.filter(status='PENDENTE').aggregate(
            total=Sum('salario_liquido')
        )['total'] or 0
        
        # Próximo pagamento (simulação - dia 5 de cada mês)
        if hoje.day >= 5:
            proximo_pagamento = hoje.replace(day=5) + timedelta(days=30)
        else:
            proximo_pagamento = hoje.replace(day=5)
        
        resumo = {
            'total_folha': float(total_folha),
            'funcionarios': total_funcionarios,
            'funcionarios_ativos': funcionarios_ativos,
            'media_salarial': float(media_salarial),
            'proximo_pagamento': proximo_pagamento.strftime('%d/%m/%Y'),
            'total_beneficios': float(total_beneficios),
            'total_descontos': float(total_descontos),
            'folha_pendente': float(folha_pendente),
        }
        
        return Response(resumo)
        
    except Exception as e:
        return Response(
            {'error': f'Erro ao gerar resumo: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])   
def resumo_folha_completo(request):
    """Retorna resumo completo da folha de pagamento"""
    try:
        empresa = request.user.empresa.id  # Fixed: use request.user.empresa.id
        
        # Dados básicos - buscar todos os funcionários da empresa
        total_funcionarios = Funcionario.objects.filter(empresa=empresa).count()
        
        # Mês e ano atual para cálculos
        hoje = timezone.now()
        mes_atual = hoje.month
        ano_atual = hoje.year
        
        # Recibos do mês atual
        recibos_mes = ReciboPagamento.objects.filter(
            mes_referencia=mes_atual,
            ano_referencia=ano_atual,
            funcionario__empresa=empresa
        )
        
        # Cálculos financeiros
        total_folha = recibos_mes.filter(status='PAGO').aggregate(
            total=Sum('salario_liquido')
        )['total'] or Decimal('0')
        
        # Média salarial baseada nos funcionários da empresa
        media_salarial = Funcionario.objects.filter(
            empresa=empresa
        ).aggregate(
            media=Avg('salario_bruto')
        )['media'] or Decimal('0')
        
        # Benefícios ativos - FIXED: Use valor_fixo instead of valor
        total_beneficios = Beneficio.objects.filter(
            status='ativo',
            funcionario__empresa=empresa
        ).aggregate(
            total=Sum('valor_fixo')  # Changed from 'valor' to 'valor_fixo'
        )['total'] or Decimal('0')
        
        # Descontos totais
        total_descontos = recibos_mes.aggregate(
            total=Sum('total_descontos')
        )['total'] or Decimal('0')
        
        # Folha pendente
        folha_pendente = recibos_mes.filter(status='PENDENTE').aggregate(
            total=Sum('salario_liquido')
        )['total'] or Decimal('0')
        
        # Próximo pagamento (dia 5 de cada mês)
        if hoje.day >= 5:
            proximo_mes = hoje.month + 1 if hoje.month < 12 else 1
            proximo_ano = hoje.year if hoje.month < 12 else hoje.year + 1
            proximo_pagamento = hoje.replace(month=proximo_mes, day=5, year=proximo_ano)
        else:
            proximo_pagamento = hoje.replace(day=5)
        
        resumo = {
            'total_folha': float(total_folha),
            'funcionarios': total_funcionarios,
            'funcionarios_ativos': total_funcionarios,  
            'media_salarial': float(media_salarial),
            'proximo_pagamento': proximo_pagamento.strftime('%d/%m/%Y'),
            'total_beneficios': float(total_beneficios),
            'total_descontos': float(total_descontos),
            'folha_pendente': float(folha_pendente),
        }
        
        return Response(resumo)
        
    except Exception as e:
        import traceback
        print(f" Erro em resumo_folha_completo: {str(e)}")
        print(traceback.format_exc())
        return Response(
            {'error': f'Erro ao gerar resumo: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historico_folha(request):
    """Retorna histórico dos últimos 12 meses"""
    try:
        empresa = request.user.empresa.id
        historico = []
        hoje = timezone.now()
        
        for i in range(11, -1, -1):  # Últimos 12 meses
            meses_atras = i
            ano = hoje.year
            mes = hoje.month - meses_atras
            
            while mes <= 0:
                mes += 12
                ano -= 1
            
            # Recibos do mês
            recibos_mes = ReciboPagamento.objects.filter(
                mes_referencia=mes,
                ano_referencia=ano,
                funcionario__empresa=empresa
            )
            
            # Totais do mês
            total_folha = recibos_mes.filter(status='PAGO').aggregate(
                total=Sum('salario_liquido')
            )['total'] or Decimal('0')
            
            total_impostos = recibos_mes.aggregate(
                total=Sum('total_descontos')
            )['total'] or Decimal('0')
            
            # Benefícios do mês - FIXED: Use valor_fixo instead of valor
            total_beneficios = Beneficio.objects.filter(
                status='ativo',
                funcionario__empresa=empresa
            ).aggregate(
                total=Sum('valor_fixo')  # Changed from 'valor' to 'valor_fixo'
            )['total'] or Decimal('0')
            
            historico.append({
                'mes': f"{ano}-{mes:02d}",
                'folha': float(total_folha),
                'impostos': float(total_impostos),
                'beneficios': float(total_beneficios)
            })
        
        return Response(historico)
        
    except Exception as e:
        import traceback
        print(f" Erro em historico_folha: {str(e)}")
        print(traceback.format_exc())
        return Response(
            {'error': f'Erro ao gerar histórico: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def relatorio_mensal_completo(request):
    try:
        empresa = request.user.empresa.id
        hoje = timezone.now()
        mes = hoje.month
        ano = hoje.year
        
        recibos_mes = ReciboPagamento.objects.filter(
            mes_referencia=mes,
            ano_referencia=ano,
            funcionario__empresa=empresa
        )
        
        funcionarios_pagos = recibos_mes.filter(status='PAGO').count()
        
        impostos_pagos = recibos_mes.filter(status='PAGO').aggregate(
            total=Sum('total_descontos')
        )['total'] or Decimal('0')
        
        # Total de benefícios - FIXED: Use valor_fixo instead of valor
        total_beneficios = Beneficio.objects.filter(
            status='ativo',
            funcionario__empresa=empresa
        ).aggregate(
            total=Sum('valor_fixo')  # Changed from 'valor' to 'valor_fixo'
        )['total'] or Decimal('0')
        
        # Horas extras do mês
        try:
            total_horas_extras = HoraExtra.objects.filter(
                status='APROVADA',
                data__month=mes,
                data__year=ano,
                funcionario__empresa=empresa
            ).aggregate(
                total=Sum('horas')
            )['total'] or Decimal('0')
        except Exception:
            total_horas_extras = Decimal('0')
        
        relatorio = {
            'funcionarios_pagos': funcionarios_pagos,
            'impostos_pagos': float(impostos_pagos),
            'total_beneficios': float(total_beneficios),
            'total_horas_extras': float(total_horas_extras),
        }
        
        return Response(relatorio)
        
    except Exception as e:
        import traceback
        print(f" Erro em relatorio_mensal_completo: {str(e)}")
        print(traceback.format_exc())
        return Response(
            {'error': f'Erro ao gerar relatório: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )