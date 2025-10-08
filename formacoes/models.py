from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from app.models import Funcionario
class Instrutor(models.Model):
    
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=200)
    funcionario=models.ForeignKey(Funcionario,on_delete=models.CASCADE, null=True, blank=True)
    tipo = models.CharField(max_length=10)
    especialidade = models.CharField(max_length=200)
    email = models.EmailField()
    telefone = models.CharField(max_length=20)
    certificacoes = models.JSONField(default=list)
    biografia = models.TextField(blank=True)
    avaliacao_media = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_formacoes = models.IntegerField(default=0)
    total_alunos = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'instrutores'
        verbose_name = 'Instrutor'
        verbose_name_plural = 'Instrutores'
    
    def __str__(self):
        return f"{self.nome} - {self.especialidade}"

class Competencia(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)
    categoria = models.CharField(max_length=100)
    data_criacao = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'competencias'
        verbose_name = 'Competência'
        verbose_name_plural = 'Competências'
    
    def __str__(self):
        return self.nome

class Formacao(models.Model):
    TIPO_CHOICES = [
        ('PRESENCIAL', 'Presencial'),
        ('ONLINE', 'Online'),
        ('HIBRIDO', 'Híbrido'),
        ('EAD', 'EAD'),
    ]
    
    STATUS_CHOICES = [
        ('PLANEJADA', 'Planejada'),
        ('INSCRICOES_ABERTAS', 'Inscrições Abertas'),
        ('EM_ANDAMENTO', 'Em Andamento'),
        ('CONCLUIDA', 'Concluída'),
        ('CANCELADA', 'Cancelada'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    categoria = models.CharField(max_length=100)
    instrutor = models.ForeignKey(Instrutor, on_delete=models.SET_NULL, null=True, related_name='formacoes')
    carga_horaria = models.IntegerField()
    vagas = models.IntegerField()
    vagas_disponiveis = models.IntegerField()
    data_inicio = models.DateField()
    data_fim = models.DateField()
    horario = models.CharField(max_length=100)
    local = models.CharField(max_length=200, blank=True)
    link_online = models.URLField(blank=True)
    custo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    competencias = models.ManyToManyField(Competencia, related_name='formacoes', blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PLANEJADA')
    avaliacao_media = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_avaliacoes = models.IntegerField(default=0)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'formacoes'
        verbose_name = 'Formação'
        verbose_name_plural = 'Formações'
    
    def __str__(self):
        return self.titulo

class Inscricao(models.Model):
    STATUS_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('APROVADA', 'Aprovada'),
        ('REPROVADA', 'Reprovada'),
        ('CANCELADA', 'Cancelada'),
    ]
    
    PRIORIDADE_CHOICES = [
        ('ALTA', 'Alta'),
        ('MEDIA', 'Média'),
        ('BAIXA', 'Baixa'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    formacao = models.ForeignKey(Formacao, on_delete=models.CASCADE, related_name='inscricoes')
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='inscricoes_formacoes')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDENTE')
    prioridade = models.CharField(max_length=10, choices=PRIORIDADE_CHOICES, default='MEDIA')
    justificativa = models.TextField()
    motivo_reprovacao = models.TextField(blank=True)
    aprovador = models.CharField(max_length=200, blank=True)
    data_inscricao = models.DateTimeField(auto_now_add=True)
    data_aprovacao = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'inscricoes_formacoes'
        verbose_name = 'Inscrição'
        verbose_name_plural = 'Inscrições'
        unique_together = ['formacao', 'funcionario']
    
    def __str__(self):
        return f"{self.funcionario} - {self.formacao.titulo}"

class Presenca(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inscricao = models.ForeignKey(Inscricao, on_delete=models.CASCADE, related_name='presencas')
    data = models.DateField()
    presente = models.BooleanField(default=False)
    observacao = models.TextField(blank=True)
    data_registro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'presencas_formacoes'
        verbose_name = 'Presença'
        verbose_name_plural = 'Presenças'
        unique_together = ['inscricao', 'data']
    
    def __str__(self):
        return f"{self.inscricao.funcionario} - {self.data}"

class AvaliacaoFormacao(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inscricao = models.OneToOneField(Inscricao, on_delete=models.CASCADE, related_name='avaliacao')
    nota_conteudo = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    nota_instrutor = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    nota_material = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    nota_organizacao = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    nota_geral = models.DecimalField(max_digits=3, decimal_places=2)
    comentario = models.TextField(blank=True)
    recomendaria = models.BooleanField(default=True)
    data_avaliacao = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'avaliacoes_formacoes'
        verbose_name = 'Avaliação de Formação'
        verbose_name_plural = 'Avaliações de Formações'
    
    def save(self, *args, **kwargs):
        # Calcula nota geral automaticamente
        self.nota_geral = (self.nota_conteudo + self.nota_instrutor + self.nota_material + self.nota_organizacao) / 4
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Avaliação - {self.inscricao.funcionario} - {self.inscricao.formacao.titulo}"

class Certificado(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inscricao = models.OneToOneField(Inscricao, on_delete=models.CASCADE, related_name='certificado')
    codigo = models.CharField(max_length=50, unique=True)
    data_emissao = models.DateField(auto_now_add=True)
    data_validade = models.DateField(null=True, blank=True)
    arquivo = models.FileField(upload_to='certificados/', blank=True)
    
    class Meta:
        db_table = 'certificados_formacoes'
        verbose_name = 'Certificado'
        verbose_name_plural = 'Certificados'
    
    def __str__(self):
        return f"Certificado {self.codigo} - {self.inscricao.funcionario}"

class AvaliacaoCompetencia(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='avaliacoes_competencias')
    competencia = models.ForeignKey(Competencia, on_delete=models.CASCADE, related_name='avaliacoes')
    nivel_atual = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    nivel_desejado = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    gap = models.IntegerField()
    avaliador = models.CharField(max_length=200)
    data_avaliacao = models.DateField(auto_now_add=True)
    observacoes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'avaliacoes_competencias'
        verbose_name = 'Avaliação de Competência'
        verbose_name_plural = 'Avaliações de Competências'
        unique_together = ['funcionario', 'competencia', 'data_avaliacao']
    
    def save(self, *args, **kwargs):
        self.gap = self.nivel_desejado - self.nivel_atual
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.funcionario} - {self.competencia.nome}"
