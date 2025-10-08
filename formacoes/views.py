# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Avg, Sum, Q
from django.db.models.functions import TruncMonth
from datetime import datetime, timedelta
from .models import Instrutor, Competencia, Formacao, Inscricao, Presenca, AvaliacaoFormacao, Certificado, AvaliacaoCompetencia
from .serializers import *

class InstrutorViewSet(viewsets.ModelViewSet):
    queryset = Instrutor.objects.all()
    serializer_class = InstrutorSerializer
    
    def get_queryset(self):
        queryset = Instrutor.objects.all()
        tipo = self.request.query_params.get('tipo')
        if tipo:
            queryset = queryset.filter(tipo=tipo.upper())
        return queryset

class CompetenciaViewSet(viewsets.ModelViewSet):
    queryset = Competencia.objects.all()
    serializer_class = CompetenciaSerializer

class FormacaoViewSet(viewsets.ModelViewSet):
    queryset = Formacao.objects.all()
    serializer_class = FormacaoSerializer
    
    def get_queryset(self):
        queryset = Formacao.objects.all()
        
        # Filtros
        status_filter = self.request.query_params.get('status')
        categoria_filter = self.request.query_params.get('categoria')
        tipo_filter = self.request.query_params.get('tipo')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter.upper())
        if categoria_filter:
            queryset = queryset.filter(categoria=categoria_filter)
        if tipo_filter:
            queryset = queryset.filter(tipo=tipo_filter.upper())
            
        return queryset
    
    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        total_formacoes = Formacao.objects.count()
        formacoes_ativas = Formacao.objects.filter(
            status__in=['INSCRICOES_ABERTAS', 'EM_ANDAMENTO']
        ).count()
        total_inscricoes = Inscricao.objects.count()
        
        # Taxa de conclusão (inscrições concluídas / total de inscrições)
        inscricoes_concluidas = Inscricao.objects.filter(status='CONCLUIDA').count()
        taxa_conclusao = (inscricoes_concluidas / total_inscricoes * 100) if total_inscricoes > 0 else 0
        
        # Horas de treinamento
        horas_treinamento = Formacao.objects.aggregate(
            total_horas=Sum('carga_horaria')
        )['total_horas'] or 0
        
        # Investimento total
        investimento_total = Formacao.objects.aggregate(
            total_investimento=Sum('custo')
        )['total_investimento'] or 0
        
        # Certificados emitidos
        certificados_emitidos = Certificado.objects.count()
        
        # Média de satisfação
        media_satisfacao = AvaliacaoFormacao.objects.aggregate(
            media=Avg('nota_geral')
        )['media'] or 0
        
        data = {
            'total_formacoes': total_formacoes,
            'formacoes_ativas': formacoes_ativas,
            'total_inscricoes': total_inscricoes,
            'taxa_conclusao': round(taxa_conclusao, 2),
            'horas_treinamento': horas_treinamento,
            'investimento_total': investimento_total,
            'certificados_emitidos': certificados_emitidos,
            'media_satisfacao': round(media_satisfacao, 1)
        }
        
        serializer = EstatisticasFormacoesSerializer(data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def evolucao_mensal(self, request):
        # Últimos 6 meses
        end_date = datetime.now()
        start_date = end_date - timedelta(days=180)
        
        evolucao = Formacao.objects.filter(
            data_criacao__range=[start_date, end_date]
        ).annotate(
            mes=TruncMonth('data_criacao')
        ).values('mes').annotate(
            formacoes=Count('id'),
            participantes=Count('inscricoes'),
            conclusoes=Count('inscricoes', filter=Q(inscricoes__status='CONCLUIDA'))
        ).order_by('mes')
        
        # Formatar dados para o gráfico
        meses_map = {
            1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun',
            7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'
        }
        
        dados_formatados = []
        for item in evolucao:
            dados_formatados.append({
                'mes': meses_map[item['mes'].month],
                'formacoes': item['formacoes'],
                'participantes': item['participantes'],
                'conclusoes': item['conclusoes']
            })
        
        return Response(dados_formatados)
    
    @action(detail=False, methods=['get'])
    def distribuicao_tipo(self, request):
        distribuicao = Formacao.objects.values('tipo').annotate(
            total=Count('id')
        )
        
        dados_formatados = []
        tipo_map = {
            'PRESENCIAL': 'Presencial',
            'ONLINE': 'Online',
            'HIBRIDO': 'Híbrido',
            'EAD': 'EAD'
        }
        
        cores = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981']
        
        for i, item in enumerate(distribuicao):
            dados_formatados.append({
                'name': tipo_map.get(item['tipo'], item['tipo']),
                'value': item['total'],
                'color': cores[i] if i < len(cores) else '#94a3b8'
            })
        
        return Response(dados_formatados)

class InscricaoViewSet(viewsets.ModelViewSet):
    queryset = Inscricao.objects.all()
    serializer_class = InscricaoSerializer
    
    def get_queryset(self):
        queryset = Inscricao.objects.all()
        
        # Filtros
        status_filter = self.request.query_params.get('status')
        formacao_filter = self.request.query_params.get('formacao')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter.upper())
        if formacao_filter:
            queryset = queryset.filter(formacao_id=formacao_filter)
            
        return queryset

class PresencaViewSet(viewsets.ModelViewSet):
    queryset = Presenca.objects.all()
    serializer_class = PresencaSerializer

class AvaliacaoFormacaoViewSet(viewsets.ModelViewSet):
    queryset = AvaliacaoFormacao.objects.all()
    serializer_class = AvaliacaoFormacaoSerializer

class CertificadoViewSet(viewsets.ModelViewSet):
    queryset = Certificado.objects.all()
    serializer_class = CertificadoSerializer

class AvaliacaoCompetenciaViewSet(viewsets.ModelViewSet):
    queryset = AvaliacaoCompetencia.objects.all()
    serializer_class = AvaliacaoCompetenciaSerializer

# Views para relatórios
class RelatoriosViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['get'])
    def top_formacoes(self, request):
        top_formacoes = Formacao.objects.annotate(
            total_participantes=Count('inscricoes'),
            avaliacao_media=Avg('avaliacao_media')
        ).order_by('-total_participantes')[:5]
        
        dados = []
        for formacao in top_formacoes:
            inscricoes_concluidas = formacao.inscricoes.filter(status='CONCLUIDA').count()
            taxa_conclusao = (inscricoes_concluidas / formacao.total_participantes * 100) if formacao.total_participantes > 0 else 0
            
            dados.append({
                'nome': formacao.titulo,
                'participantes': formacao.total_participantes,
                'avaliacao': float(formacao.avaliacao_media) if formacao.avaliacao_media else 0,
                'conclusao': round(taxa_conclusao, 1)
            })
        
        return Response(dados)
    
    @action(detail=False, methods=['get'])
    def investimento_mensal(self, request):
        # Últimos 6 meses de investimento
        end_date = datetime.now()
        start_date = end_date - timedelta(days=180)
        
        investimento = Formacao.objects.filter(
            data_criacao__range=[start_date, end_date]
        ).annotate(
            mes=TruncMonth('data_criacao')
        ).values('mes').annotate(
            realizado=Sum('custo')
        ).order_by('mes')
        
        # Adicionar valores planejados (aqui seria com base no orçamento)
        meses_map = {
            1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun'
        }
        
        dados_formatados = []
        for i, item in enumerate(investimento):
            planejado = (item['realizado'] or 0) * 1.1  # Simulação de 10% a mais do planejado
            dados_formatados.append({
                'mes': meses_map[item['mes'].month],
                'planejado': float(planejado),
                'realizado': float(item['realizado'] or 0)
            })
        
        return Response(dados_formatados)