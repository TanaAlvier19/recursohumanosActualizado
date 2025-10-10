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
            ("gestor", "Gestor"),
            
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

class Departamento(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    codigo = models.CharField(max_length=20, default="TI")
    empresa=models.ForeignKey(Empresa, on_delete=models.CASCADE)
    descricao = models.TextField(blank=True)
    responsavel=models.CharField(max_length=40, default="Tana", blank=True, null=True)
    nome=models.CharField(max_length=100, blank=True, null=True)
    orcamento=models.DecimalField(max_digits=10, decimal_places=2, default=0.00, blank=True, null=True)
    local=models.CharField(max_length=100, blank=True, null=True)
    status=models.BooleanField(default=False)
    data_criacao=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.nome if self.nome else "Departamento sem nome"
class Funcionario(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    departamento=models.ForeignKey(Departamento, on_delete=models.CASCADE, blank=True, null=True)
    empresa=models.ForeignKey(Empresa, on_delete=models.CASCADE)
    valores=models.JSONField()
    salario_bruto=models.DecimalField(max_digits=10, decimal_places=2, default="100.00")
    data_criacao = models.DateTimeField(auto_now_add=True)
class ValoresArquivo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    valores_instancia = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='arquivos')
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
class Satisfacao(models.Model):
    empresa=models.ForeignKey(Empresa, on_delete=models.CASCADE)
    pontuacao=models.IntegerField()
    comentario=models.TextField(blank=True, null=True)
    def __str__(self):
        return self.pontuacao


""" class Modulos(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    nome = models.JSONField(blank=True, null=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome if self.nome else "Módulo sem nome" """

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
