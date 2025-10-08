from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg
from datetime import datetime, timedelta
from decimal import Decimal
from recrutamento.models import Vaga, Candidato, Aplicacao
@api_view(['GET'])
def metricas_gerais(request):
    try:
        from .models import Funcionario, Departamento
        
        total_funcionarios = Funcionario.objects.count()
        vagas_abertas = Vaga.objects.filter(status='ABERTA').count()
        folha_total = Funcionario.objects.aggregate(
            total=Sum('salario_bruto')
        )['total'] or Decimal('0')
        
        taxa_assiduidade = 96.8
        
        
        return Response({
            'total_funcionarios': total_funcionarios,
            'folha_mensal': float(folha_total),
            'taxa_assiduidade': taxa_assiduidade,
            'vagas_abertas': vagas_abertas,
        })
    except Exception as e:
        return Response({
            'total_funcionarios': 0,
            'folha_mensal': 0,
            'taxa_assiduidade': 0,
            'vagas_abertas': 0,
            'error': str(e)
        })

@api_view(['GET'])
def alertas_pendencias(request):
    try:
        alertas = [
            {
                'type': 'urgent',
                'module': 'Folha de Pagamento',
                'message': 'Fechamento da folha em 3 dias',
                'time': 'Hoje'
            },
            {
                'type': 'warning',
                'module': 'Assiduidade',
                'message': '8 justificativas de falta pendentes',
                'time': 'Há 2 horas'
            },
        ]
        
        return Response(alertas)
    except Exception as e:
        return Response([])

@api_view(['GET'])
def evolucao_geral(request):
    try:
        from .models import Funcionario
        
        meses = []
        hoje = datetime.now()
        
        for i in range(5, -1, -1):
            data = hoje - timedelta(days=30 * i)
            mes_nome = data.strftime('%b')
            
            funcionarios_count = Funcionario.objects.filter(
                data_criacao__lte=data
            ).count()
            
            # Calcular folha total
            folha_total = Funcionario.objects.filter(
                data_criacao__lte=data
            ).aggregate(total=Sum('salario_bruto'))['total'] or Decimal('0')
            
            meses.append({
                'month': mes_nome,
                'funcionarios': funcionarios_count,
                'folha': float(folha_total) / 1000000,  # Em milhões
                'formacoes': 30 + i * 3  # Mockado por enquanto
            })
        
        return Response(meses)
    except Exception as e:
        return Response([])

@api_view(['GET'])
def atividades_recentes(request):
    """Retorna atividades recentes do sistema"""
    try:
        # Por enquanto retorna dados mockados
        # Implementar com modelo de Log/Auditoria no futuro
        atividades = [
            {
                'user': 'Ana Silva',
                'action': 'aprovou folha de pagamento',
                'module': 'Folha de Pagamento',
                'time': 'Há 15 min'
            },
            {
                'user': 'Carlos Santos',
                'action': 'agendou entrevista',
                'module': 'Recrutamento',
                'time': 'Há 1 hora'
            },
        ]
        
        return Response(atividades)
    except Exception as e:
        return Response([])
