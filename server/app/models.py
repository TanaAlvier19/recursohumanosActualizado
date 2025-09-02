from xml.parsers.expat import model
from django.db import models
import uuid
from django.conf import settings
import os
from datetime import timezone
from django.contrib.auth.models import AbstractUser
TIPO_CAMPO=[
    ('texto_curto', 'Texto Curto'),
    ('text', 'Texto Longo'),
    ('number', 'Número'),
    ('date', 'Data'),
    ('booleano', 'Sim/Não'),
    ('escolha_unica', 'Escolha Única'),
    ('select', 'Múltipla Escolha'),
    ('file', 'Arquivo'),
    ('email', 'Email'),
    ('telefone', 'Telefone'),
]
Escolha=[
    ('pendente',"Pendente"),
    ('aprovado','Aprovado'),
    ('terminadado','Terminadado')
]
class Empresa(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255)
    nif = models.CharField(max_length=14, unique=True)
    email_corporativo = models.EmailField(unique=True)
    tipo_empresa = models.CharField(max_length=50, blank=True, null=True)
    setor_atuacao = models.CharField(max_length=100, blank=True, null=True)
    telefone = models.CharField(max_length=15, blank=True, null=True)
    endereco = models.CharField(max_length=255, blank=True, null=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.nome

class UsuarioEmpresa(AbstractUser):
    username = None  
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    nomeRep= models.CharField(max_length=255, blank=True, null=True)
    nivel_acesso = models.CharField(
        max_length=20,
        choices=[
            ("admin", "Administrador"),
            ("funcionario", "Funcionario"),
            
        ],
        default="admin"
    )
    emailRep = models.EmailField(blank=True, null=True, unique=True)
    is_active = models.BooleanField(default=True)
    USERNAME_FIELD = 'emailRep'
    REQUIRED_FIELDS = ['empresa']
    def __str__(self):
        return f"{self.nomeRep} - {self.empresa.nome}"
class CamposPersonalizados (models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa=models.ForeignKey(Empresa, on_delete=models.CASCADE)
    nome=models.CharField(max_length=100, blank=True, null=True)
    tipo=models.CharField(max_length=50, choices=TIPO_CAMPO, blank=True, null=True)
    obrigatorio=models.BooleanField(default=False)
  
    def __str__(self):
        return self.nome

class DescontosImposto(models.Model):
    empresa=models.ForeignKey(Empresa, on_delete=models.CASCADE)
    desconto_inss=models.DecimalField(max_digits=10, decimal_places=2, default=0.03)
    irt2=models.DecimalField(max_digits=10, decimal_places=2, default=0.10)
    irt3=models.DecimalField(max_digits=10, decimal_places=2, default=0.13)
    irt4=models.DecimalField(max_digits=10, decimal_places=2, default=0.16)
    irt5=models.DecimalField(max_digits=10, decimal_places=2, default=0.18)
    irt6=models.DecimalField(max_digits=10, decimal_places=2, default=0.19)
    irt7=models.DecimalField(max_digits=10, decimal_places=2, default=0.20)
    def __str__(self):
        return super().__str__()
class FolhaPagamento(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    nome = models.CharField(max_length=100, default="Tana")
    mes_referencia = models.DateField()
    salario_bruto = models.DecimalField(max_digits=10, decimal_places=2)
    desconto_inss = models.DecimalField(max_digits=10, decimal_places=2, default=0.03)
    desconto_irt = models.DecimalField(max_digits=10, decimal_places=2, default=0.10)
    salario_liquido = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    # horas_trabalhadas = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    # horas_faltas = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    # bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, blank=True, null=True)
    descontos = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} - {self.mes_referencia.strftime('%B %Y')}"

class Departamento(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa=models.ForeignKey(Empresa, on_delete=models.CASCADE)
    responsavel=models.CharField(max_length=40, default="Tana", blank=True, null=True)
    nome=models.CharField(max_length=100, blank=True, null=True)
    orcamento=models.DecimalField(max_digits=10, decimal_places=2, default=0.00, blank=True, null=True)
    funcionarios=models.IntegerField( blank=True, null=True)
    status=models.BooleanField(default=False)
    data_criacao=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.nome if self.nome else "Departamento sem nome"
class Valores(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    funcionario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    departamento=models.ForeignKey(Departamento, on_delete=models.CASCADE, blank=True, null=True)
    empresa=models.ForeignKey(Empresa, on_delete=models.CASCADE)
    valores=models.JSONField()
    data_criacao = models.DateTimeField(auto_now_add=True)
class ValoresArquivo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    valores_instancia = models.ForeignKey(Valores, on_delete=models.CASCADE, related_name='arquivos')
    campo_personalizado = models.ForeignKey(CamposPersonalizados, on_delete=models.CASCADE)
    arquivo = models.FileField(upload_to='arquivos/')

    def __str__(self):
        return f"Arquivo para {self.valores_instancia.id} - {self.campo_personalizado.nome}"
class OTP(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    funcionario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    codigo = models.CharField(max_length=6)
    criado_em = models.DateTimeField(auto_now_add=True)
    usado = models.BooleanField(default=False)

    class Meta:
        ordering = ['-criado_em']

    def __str__(self):
        return f"OTP para {self.funcionario.emailRep}"

    def is_valid(self):
        return not self.usado and (timezone.now() - self.criado_em).seconds < 300
class Formacoes(models.Model):
    titulo=models.CharField(max_length=30)
    empresa=models.ForeignKey(Empresa, on_delete=models.CASCADE)
    area_tematica=models.CharField(max_length=100)
    departamento=models.ForeignKey(Departamento, on_delete=models.CASCADE, null=True, blank=True)
    Carga_horaria=models.CharField(max_length=15)
    horario=models.CharField(max_length=15, default="10-14H")
    modalidade=models.CharField(max_length=20)
    dataInicio=models.DateField()
    dataFim=models.DateField()
    descricao=models.TextField(default="O curso deve ser feito")
    local=models.CharField(max_length=100)
    Formadores=models.CharField(max_length=200)
    vagas=models.IntegerField(null=True, blank=True)
    empresaParceira=models.CharField(max_length=200, blank=True, null=True)
    inscritos=models.IntegerField(null=True, blank=True)
    # programaFormacao=models.FileField(upload_to="programaFormacao/")
    def __str__(self):
        return self.titulo
class Inscricao(models.Model):
    empresa=models.ForeignKey(Empresa, on_delete=models.CASCADE)
    funcionario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="Inscrito", null=True, blank=True)
    inscricao=models.ForeignKey(Formacoes, on_delete=models.CASCADE)
    estado=models.CharField(max_length=20,choices=Escolha,default="pendente")
    def __str__(self):
        return self.inscricao
class Modulos(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    nome = models.JSONField(blank=True, null=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome if self.nome else "Módulo sem nome"
class Vagas(models.Model):
    STATUS_CHOICES = [
        ('aberta', 'Aberta'),
        ('fechada', 'Fechada'),
    ]
    TIPO_CHOICES = [
        ('tempoIntegral', 'Tempo Integral'),
        ('remoto', 'Remoto'),
        ('meioPeriodo', 'Meio Período'),
    ]
    titulo=models.CharField(max_length=100)
    empresa=models.ForeignKey(Empresa, on_delete=models.CASCADE)
    departamento=models.ForeignKey(Departamento, on_delete=models.CASCADE)
    requisitos=models.TextField()
    dataAbertura=models.DateField()
    dataFim=models.DateField()
    tipoVaga=models.CharField(max_length=30,choices=TIPO_CHOICES,default="tempoIntegral" )
    status=models.CharField(max_length=10,choices=STATUS_CHOICES, default='aberta')
    
class Candidato(models.Model):
    ETAPA_CHOICES = [
        ('triagem', 'Triagem'),
        ('entrevista', 'Entrevista'),
        ('teste', 'Teste Técnico'),
        ('contratado', 'Contratado'),
        ('rejeitado', 'Rejeitado'),
    ]
    nome = models.CharField(max_length=100)
    email = models.EmailField()
    telefone = models.CharField(max_length=20)
    vaga = models.ForeignKey(Vagas, on_delete=models.CASCADE, related_name='candidatos')
    etapa = models.CharField(max_length=10, choices=ETAPA_CHOICES, default='triagem')
    dataInscricao = models.DateTimeField(auto_now_add=True)
    curriculum = models.FileField(upload_to='curriculos/')
    score = models.IntegerField(default=0)
    observacoes = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.nome
class Dispensas(models.Model):
    STATUS_CHOICES = [
        ("pendente", "Pendente"),
        ( "aprovado","Aprovado"),
        ( "rejeitado","Rejeitado"),
    ]
    empresa=models.ForeignKey(Empresa, on_delete=models.CASCADE)
    funcionario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="leave_requests"
    )
    motivo = models.TextField()
    inicio = models.DateField()
    fim = models.DateField()
    justificativo = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pendente")
    admin_comentario = models.TextField(blank=True)
    por=models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.funcionario.emailRep} - {self.status}"
class Entrevista(models.Model):
    candidato = models.ForeignKey(Candidato, on_delete=models.CASCADE)
    vaga = models.ForeignKey(Vagas, on_delete=models.CASCADE)
    dataHora = models.DateTimeField()
    local = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)

class TesteTecnico(models.Model):
    candidato = models.ForeignKey(Candidato, on_delete=models.CASCADE)
    vaga = models.ForeignKey(Vagas, on_delete=models.CASCADE)
    link = models.URLField()
    dataLimite = models.DateTimeField()
    enviado_em = models.DateTimeField(auto_now_add=True)