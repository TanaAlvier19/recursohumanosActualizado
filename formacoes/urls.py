# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'instrutores', InstrutorViewSet)
router.register(r'competencias', CompetenciaViewSet)
router.register(r'formacoes', FormacaoViewSet)
router.register(r'inscricoes', InscricaoViewSet)
router.register(r'presencas', PresencaViewSet)
router.register(r'avaliacoes-formacao', AvaliacaoFormacaoViewSet)
router.register(r'certificados', CertificadoViewSet)
router.register(r'avaliacoes-competencia', AvaliacaoCompetenciaViewSet)
router.register(r'relatorios', RelatoriosViewSet, basename='relatorios')

urlpatterns = [
    path('', include(router.urls)),
]