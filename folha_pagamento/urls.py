from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    # ViewSets principais
    EmpresaViewSet, DepartamentoViewSet, FuncionarioViewSet,
    FolhaPagamentoViewSet, ReciboPagamentoViewSet, HoraExtraViewSet,
    FeriasViewSet, DecimoTerceiroViewSet, EmprestimoViewSet,
    RelatorioFiscalViewSet, RelatorioContabilViewSet, DispensasViewSet,
    DescontosImpostoViewSet, DescontoViewSet, BeneficioViewSet,relatorio_mensal_completo,resumo_folha_completo,historico_folha,
    simular_folha, simular_rescisao, simular_reajuste, simular_custo_contratacao
) 
urlpatterns = [
    
    # Empresas
    path('empresas/', EmpresaViewSet.as_view({'get': 'list', 'post': 'create'}), name='empresas-list'),
    path('empresas/<int:pk>/', EmpresaViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='empresas-detail'),
    
    # Departamentos
    path('departamentos/', DepartamentoViewSet.as_view({'get': 'list', 'post': 'create'}), name='departamentos-list'),
    path('departamentos/<int:pk>/', DepartamentoViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='departamentos-detail'),
    
    # Funcionários
    path('funcionarios/', FuncionarioViewSet.as_view({'get': 'list', 'post': 'create'}), name='funcionarios-list'),
    path('funcionarios/me/', FuncionarioViewSet.as_view({'get': 'me'}), name='funcionarios-me'),
    path('funcionarios/<int:pk>/', FuncionarioViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='funcionarios-detail'),
    
    # Folhas de Pagamento
    path('pagamentos/', FolhaPagamentoViewSet.as_view({'get': 'list', 'post': 'create'}), name='folhas-list'),
    path('pagamentos/<int:pk>/', FolhaPagamentoViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='folhas-detail'),
    path('folhas-pagamento/<int:pk>/processar/', FolhaPagamentoViewSet.as_view({'post': 'processar'}), name='folhas-processar'),
    path('folhas-pagamento/<int:pk>/aprovar/', FolhaPagamentoViewSet.as_view({'post': 'aprovar'}), name='folhas-aprovar'),
    path('resumo-folha-completo/',resumo_folha_completo,name="resumo"),
    path('historico-folha/',historico_folha,name="historico"),
    path('relatorio-mensal-completo/',relatorio_mensal_completo,name="relatorio")
    ,
    # Recibos de Pagamento
    path('recibos/', ReciboPagamentoViewSet.as_view({'get': 'list', 'post': 'create'}), name='recibos-list'),
    path('recibos/meus/', ReciboPagamentoViewSet.as_view({'get': 'meus'}), name='recibos-meus'),
    path('recibos/<int:pk>/', ReciboPagamentoViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='recibos-detail'),
    path('recibos/<int:pk>/visualizar/', ReciboPagamentoViewSet.as_view({'get': 'visualizar'}), name='recibos-visualizar'),
    path('recibos/<int:pk>/baixar/', ReciboPagamentoViewSet.as_view({'get': 'baixar'}), name='recibos-baixar'),
    path('recibos/estatisticas/', ReciboPagamentoViewSet.as_view({'get': 'estatisticas'}), name='recibos-estatisticas'),
    # Horas Extras
    path('horas-extras/', HoraExtraViewSet.as_view({'get': 'list', 'post': 'create'}), name='horas-extras-list'),
    path('horas-extras/estatisticas/', HoraExtraViewSet.as_view({'get': 'estatisticas'}), name='horas-extras-estatisticas'),
    path('horas-extras/<int:pk>/', HoraExtraViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='horas-extras-detail'),
    path('horas-extras/<int:pk>/aprovar/', HoraExtraViewSet.as_view({'post': 'aprovar'}), name='horas-extras-aprovar'),
    path('horas-extras/<int:pk>/rejeitar/', HoraExtraViewSet.as_view({'post': 'rejeitar'}), name='horas-extras-rejeitar'),
    
    # Férias
    path('ferias/', FeriasViewSet.as_view({'get': 'list', 'post': 'create'}), name='ferias-list'),
    path('ferias/estatisticas/', FeriasViewSet.as_view({'get': 'estatisticas'}), name='ferias-estatisticas'),
    path('ferias/<int:pk>/', FeriasViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='ferias-detail'),
    path('ferias/<int:pk>/aprovar/', FeriasViewSet.as_view({'post': 'aprovar'}), name='ferias-aprovar'),
    
    # Décimo Terceiro
    path('decimo-terceiro/', DecimoTerceiroViewSet.as_view({'get': 'list', 'post': 'create'}), name='decimo-terceiro-list'),
    path('decimo-terceiro/<int:pk>/', DecimoTerceiroViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='decimo-terceiro-detail'),
    
    # Empréstimos
    path('emprestimos/', EmprestimoViewSet.as_view({'get': 'list', 'post': 'create'}), name='emprestimos-list'),
    path('emprestimos/estatisticas/', EmprestimoViewSet.as_view({'get': 'estatisticas'}), name='emprestimos-estatisticas'),
    path('emprestimos/<int:pk>/', EmprestimoViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='emprestimos-detail'),
    path('emprestimos/<int:pk>/aprovar/', EmprestimoViewSet.as_view({'post': 'aprovar'}), name='emprestimos-aprovar'),
    path('emprestimos/<int:pk>/rejeitar/', EmprestimoViewSet.as_view({'post': 'rejeitar'}), name='emprestimos-rejeitar'),
    
    # Relatórios Fiscais
    path('relatorios-fiscais/', RelatorioFiscalViewSet.as_view({'get': 'list', 'post': 'create'}), name='relatorios-fiscais-list'),
    path('relatorios-fiscais/<int:pk>/', RelatorioFiscalViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='relatorios-fiscais-detail'),
    
    # Relatórios Contábeis
    path('relatorios-contabeis/', RelatorioContabilViewSet.as_view({'get': 'list', 'post': 'create'}), name='relatorios-contabeis-list'),
    path('relatorios-contabeis/<int:pk>/', RelatorioContabilViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='relatorios-contabeis-detail'),
    
    # Dispensas
    path('dispensas/', DispensasViewSet.as_view({'get': 'list', 'post': 'create'}), name='dispensas-list'),
    path('dispensas/<int:pk>/', DispensasViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='dispensas-detail'),
    path('dispensas/<int:pk>/aprovar/', DispensasViewSet.as_view({'post': 'aprovar'}), name='dispensas-aprovar'),
    path('dispensas/<int:pk>/rejeitar/', DispensasViewSet.as_view({'post': 'rejeitar'}), name='dispensas-rejeitar'),
    
    # Descontos e Impostos
    path('descontos-impostos/', DescontosImpostoViewSet.as_view({'get': 'list', 'post': 'create'}), name='descontos-impostos-list'),
    path('descontos-impostos/atual/', DescontosImpostoViewSet.as_view({'get': 'atual'}), name='descontos-impostos-atual'),
    path('descontos-impostos/<int:pk>/', DescontosImpostoViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='descontos-impostos-detail'),
    
  
    # Simuladores
    path('simuladores/folha/', simular_folha, name='simular-folha'),
    path('simuladores/rescisao/', simular_rescisao, name='simular-rescisao'),
    path('simuladores/reajuste/', simular_reajuste, name='simular-reajuste'),
    path('simuladores/custo-contratacao/', simular_custo_contratacao, name='simular-custo-contratacao'),
    path('descontos/', DescontoViewSet.as_view({'get': 'list', 'post': 'create'}), name='descontos-list'),
    path('descontos/estatisticas/', DescontoViewSet.as_view({'get': 'estatisticas'}), name='descontos-estatisticas'),
    path('descontos/<int:pk>/', DescontoViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='descontos-detail'),
    path('descontos/<int:pk>/ativar/', DescontoViewSet.as_view({'post': 'ativar'}), name='descontos-ativar'),
    path('descontos/<int:pk>/desativar/', DescontoViewSet.as_view({'post': 'desativar'}), name='descontos-desativar'),
    path('beneficios/', BeneficioViewSet.as_view({'get': 'list', 'post': 'create'}), name='beneficios-list'),
    path('beneficios/estatisticas/', BeneficioViewSet.as_view({'get': 'estatisticas'}), name='beneficios-estatisticas'),
    path('beneficios/<int:pk>/', BeneficioViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='beneficios-detail'),
    path('beneficios/<int:pk>/ativar/', BeneficioViewSet.as_view({'post': 'ativar'}), name='beneficios-ativar'),
    path('beneficios/<int:pk>/desativar/', BeneficioViewSet.as_view({'post': 'desativar'}), name='beneficios-desativar'),

]
 
