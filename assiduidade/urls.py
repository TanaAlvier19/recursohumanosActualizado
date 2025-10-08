from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegistroPontoViewSet,
    BiometriaViewSet,
    HorarioViewSet,
    EscalaViewSet,
    JustificativaViewSet,
    BancoHorasViewSet,
    AlertaViewSet,
    AssiduidadeDashboardViewSet,
)

router = DefaultRouter()

router.register(r'registros-ponto', RegistroPontoViewSet, basename='registro-ponto')
router.register(r'biometrias', BiometriaViewSet, basename='biometria')
router.register(r'horarios', HorarioViewSet, basename='horario')
router.register(r'escalas', EscalaViewSet, basename='escala')
router.register(r'justificativas', JustificativaViewSet, basename='justificativa')
router.register(r'banco-horas', BancoHorasViewSet, basename='banco-horas')
router.register(r'alertas', AlertaViewSet, basename='alerta')
router.register(r'assiduidade', AssiduidadeDashboardViewSet, basename='assiduidade-estatisticas')

urlpatterns = [
    path('', include(router.urls)),
]

"""
This configuration creates the following URL patterns:

REGISTRO DE PONTO:
- GET    /api/registros-ponto/                          - List all records
- POST   /api/registros-ponto/                          - Create new record
- GET    /api/registros-ponto/{id}/                     - Retrieve specific record
- PUT    /api/registros-ponto/{id}/                     - Update record
- DELETE /api/registros-ponto/{id}/                     - Delete record
- GET    /api/registros-ponto/funcionario/{funcionario_id}/ - Records by employee
- GET    /api/registros-ponto/hoje/                     - Today's records
- GET    /api/registros-ponto/estatisticas/             - Statistics

BIOMETRIA:
- GET    /api/biometrias/                               - List all biometrics
- POST   /api/biometrias/                               - Register new biometric
- GET    /api/biometrias/{id}/                          - Retrieve specific biometric
- DELETE /api/biometrias/{id}/                          - Delete biometric
- POST   /api/biometrias/validar/                       - Validate biometric
- GET    /api/biometrias/funcionario/{funcionario_id}/  - Biometrics by employee

HORÁRIOS:
- GET    /api/horarios/                                 - List all schedules
- POST   /api/horarios/                                 - Create new schedule
- GET    /api/horarios/{id}/                            - Retrieve specific schedule
- PUT    /api/horarios/{id}/                            - Update schedule
- DELETE /api/horarios/{id}/                            - Delete schedule

ESCALAS:
- GET    /api/escalas/                                  - List all shifts
- POST   /api/escalas/                                  - Create new shift
- GET    /api/escalas/{id}/                             - Retrieve specific shift
- PUT    /api/escalas/{id}/                             - Update shift
- DELETE /api/escalas/{id}/                             - Delete shift
- GET    /api/escalas/funcionario/{funcionario_id}/     - Shifts by employee
- GET    /api/escalas/ativas/                           - Active shifts

JUSTIFICATIVAS:
- GET    /api/justificativas/                           - List all justifications
- POST   /api/justificativas/                           - Create new justification
- GET    /api/justificativas/{id}/                      - Retrieve specific justification
- PUT    /api/justificativas/{id}/                      - Update justification
- DELETE /api/justificativas/{id}/                      - Delete justification
- POST   /api/justificativas/{id}/aprovar/              - Approve justification
- POST   /api/justificativas/{id}/rejeitar/             - Reject justification
- GET    /api/justificativas/pendentes/                 - Pending justifications

BANCO DE HORAS:
- GET    /api/banco-horas/                              - List all hour bank entries
- POST   /api/banco-horas/                              - Create new entry
- GET    /api/banco-horas/{id}/                         - Retrieve specific entry
- PUT    /api/banco-horas/{id}/                         - Update entry
- DELETE /api/banco-horas/{id}/                         - Delete entry
- GET    /api/banco-horas/funcionario/{funcionario_id}/saldo/ - Employee balance
- POST   /api/banco-horas/{id}/aprovar/                 - Approve entry

ALERTAS:
- GET    /api/alertas/                                  - List all alerts
- POST   /api/alertas/                                  - Create new alert
- GET    /api/alertas/{id}/                             - Retrieve specific alert
- PUT    /api/alertas/{id}/                             - Update alert
- DELETE /api/alertas/{id}/                             - Delete alert
- POST   /api/alertas/{id}/resolver/                    - Resolve alert
- POST   /api/alertas/{id}/ignorar/                     - Ignore alert
- GET    /api/alertas/nao-resolvidos/                   - Unresolved alerts

ESTATÍSTICAS (Dashboard):
- GET    /api/assiduidade/estatisticas/                 - General statistics
- GET    /api/assiduidade/evolucao-mensal/              - Monthly evolution
- GET    /api/assiduidade/distribuicao-atual/           - Current distribution
- GET    /api/assiduidade/taxa-presenca-departamento/   - Attendance rate by department
- POST   /api/assiduidade/gerar-relatorio/              - Generate report
- GET    /api/assiduidade/historico-relatorios/         - Report history
"""
