from django.db import models
from django.contrib.auth.models import User
import uuid
from app.models import Departamento,Empresa
class Vaga(models.Model):
    STATUS_CHOICES = [
        ('ABERTA', 'Aberta'),
        ('EM_ANDAMENTO', 'Em Andamento'),
        ('PAUSADA', 'Pausada'),
        ('FECHADA', 'Fechada'),
    ]
    
    TIPO_CHOICES = [
        ('CLT', 'CLT'),
        ('PJ', 'PJ'),
        ('ESTAGIO', 'Estágio'),
        ('TEMPORARIO', 'Temporário'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    departamento = models.ForeignKey(Departamento,on_delete=models.CASCADE, related_name="vaga")
    localizacao = models.CharField(max_length=200)
    tipo_contrato = models.CharField(max_length=20, choices=TIPO_CHOICES, default='CLT')
    salario_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salario_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    requisitos = models.TextField()
    beneficios = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ABERTA')
    vagas_disponiveis = models.IntegerField(default=1)
    data_abertura = models.DateField(auto_now_add=True)
    data_fechamento = models.DateField(null=True, blank=True)
    responsavel = models.CharField(max_length=200, blank=True)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name="vaga_empresa")
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'vagas'
        ordering = ['-criado_em']
    
    def __str__(self):
        return f"{self.titulo} - {self.status}"


class Candidato(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    empresa=models.ForeignKey(Empresa,on_delete=models.CASCADE,related_name="candidato_empresa", default=None)
    vaga=models.ForeignKey(Vaga,on_delete=models.CASCADE,related_name="candidato")
    telefone = models.CharField(max_length=20)
    linkedin = models.URLField(blank=True)
    curriculo = models.FileField(upload_to='curriculos/', null=True, blank=True)
    experiencia_anos = models.IntegerField(default=0)
    formacao = models.CharField(max_length=200, blank=True)
    habilidades = models.TextField(blank=True)
    pretensao_salarial = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    disponibilidade = models.CharField(max_length=100, blank=True)
    observacoes = models.TextField(blank=True)
    fonte = models.CharField(max_length=100, blank=True)  
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'candidatos'
        ordering = ['-criado_em']
    
    def __str__(self):
        return f"{self.nome} - {self.email}"


class Aplicacao(models.Model):
    STATUS_CHOICES = [
        ('NOVO', 'Novo'),
        ('TRIAGEM', 'Triagem'),
        ('TESTE', 'Teste'),
        ('ENTREVISTA', 'Entrevista'),
        ('PROPOSTA', 'Proposta'),
        ('APROVADO', 'Aprovado'),
        ('REJEITADO', 'Rejeitado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vaga = models.ForeignKey(Vaga, on_delete=models.CASCADE, related_name='aplicacoes')
    candidato = models.ForeignKey(Candidato, on_delete=models.CASCADE, related_name='aplicacoes')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NOVO')
    pontuacao = models.IntegerField(null=True, blank=True)
    observacoes = models.TextField(blank=True)
    data_aplicacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'aplicacoes'
        ordering = ['-data_aplicacao']
        unique_together = ['vaga', 'candidato']
    
    def __str__(self):
        return f"{self.candidato.nome} - {self.vaga.titulo} ({self.status})"


class Avaliacao(models.Model):
    TIPO_CHOICES = [
        ('TRIAGEM', 'Triagem'),
        ('TECNICA', 'Técnica'),
        ('COMPORTAMENTAL', 'Comportamental'),
        ('FINAL', 'Final'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    aplicacao = models.ForeignKey(Aplicacao, on_delete=models.CASCADE, related_name='avaliacoes')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    avaliador = models.CharField(max_length=200)
    nota = models.IntegerField()  # 0-100
    comentarios = models.TextField(blank=True)
    criterios = models.JSONField(default=dict)  # {"tecnica": 8, "comunicacao": 9, etc}
    data_avaliacao = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'avaliacoes'
        ordering = ['-data_avaliacao']
    
    def __str__(self):
        return f"{self.tipo} - {self.aplicacao.candidato.nome} - Nota: {self.nota}"


class Teste(models.Model):
    TIPO_CHOICES = [
        ('TECNICO', 'Técnico'),
        ('LOGICA', 'Lógica'),
        ('IDIOMA', 'Idioma'),
        ('PERSONALIDADE', 'Personalidade'),
    ]
    
    STATUS_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('EM_ANDAMENTO', 'Em Andamento'),
        ('CONCLUIDO', 'Concluído'),
        ('EXPIRADO', 'Expirado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    aplicacao = models.ForeignKey(Aplicacao, on_delete=models.CASCADE, related_name='testes')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    titulo = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)
    link = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDENTE')
    nota = models.IntegerField(null=True, blank=True)
    data_envio = models.DateTimeField(auto_now_add=True)
    data_conclusao = models.DateTimeField(null=True, blank=True)
    prazo = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'testes'
        ordering = ['-data_envio']
    
    def __str__(self):
        return f"{self.titulo} - {self.aplicacao.candidato.nome}"


class Entrevista(models.Model):
    TIPO_CHOICES = [
        ('TELEFONE', 'Telefone'),
        ('VIDEO', 'Vídeo'),
        ('PRESENCIAL', 'Presencial'),
    ]
    
    STATUS_CHOICES = [
        ('AGENDADA', 'Agendada'),
        ('REALIZADA', 'Realizada'),
        ('CANCELADA', 'Cancelada'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    aplicacao = models.ForeignKey(Aplicacao, on_delete=models.CASCADE, related_name='entrevistas')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    entrevistador = models.CharField(max_length=200)
    data_hora = models.DateTimeField()
    duracao_minutos = models.IntegerField(default=60)
    local = models.CharField(max_length=200, blank=True)
    link_video = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AGENDADA')
    feedback = models.TextField(blank=True)
    nota = models.IntegerField(null=True, blank=True)
    
    class Meta:
        db_table = 'entrevistas'
        ordering = ['data_hora']
    
    def __str__(self):
        return f"{self.tipo} - {self.aplicacao.candidato.nome} - {self.data_hora}"
