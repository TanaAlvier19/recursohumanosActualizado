from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# ✅ Health Check View
def health_check(request):
    return JsonResponse({
        "status": "healthy", 
        "service": "Django API",
        "timestamp": "2024-01-01 00:00:00"  # Django vai preencher automaticamente
    })

urlpatterns = [
    path('', health_check),  # ✅ Rota raiz para health check
    path('health/', health_check),  # ✅ Rota específica health
    path('admin/', admin.site.urls),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include('app.urls')),
    path('', include('folha_pagamento.urls')),
    path('', include('recrutamento.urls')),
    path('', include('formacoes.urls')),
    path('', include('assiduidade.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)