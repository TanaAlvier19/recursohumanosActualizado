from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VagaViewSet, 
    CandidatoViewSet, 
    AplicacaoViewSet,
    AvaliacaoViewSet, 
    TesteViewSet, 
    EntrevistaViewSet,
    DashboardViewSet
)

router = DefaultRouter()
router.register(r'vagas', VagaViewSet, basename='vaga')
router.register(r'candidatos', CandidatoViewSet, basename='candidato')
router.register(r'aplicacoes', AplicacaoViewSet, basename='aplicacao')
router.register(r'avaliacoes', AvaliacaoViewSet, basename='avaliacao')
router.register(r'testes', TesteViewSet, basename='teste')
router.register(r'entrevistas', EntrevistaViewSet, basename='entrevista')
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]