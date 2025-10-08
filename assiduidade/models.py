from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from app.models import Empresa, Funcionario, Departamento, UsuarioEmpresa

class BiometriaFuncionario(models.Model):
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='biometrias')
    tipo = models.CharField(max_length=50, choices=[
        ('digital', 'Digital'),
        ('facial', 'Facial'),
        ('voz', 'Voz'),
    ])
    dados_biometricos = models.TextField()  # Hash dos dados biométricos
    dispositivo = models.CharField(max_length=100)  # Telefone, computador, etc
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'biometria_funcionario'
        verbose_name = 'Biometria do Funcionário'
        verbose_name_plural = 'Biometrias dos Funcionários'


class Horario(models.Model):
    nome = models.CharField(max_length=100)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='horarios')
    entrada = models.TimeField()
    saida = models.TimeField()
    intervalo_inicio = models.TimeField(null=True, blank=True)
    intervalo_fim = models.TimeField(null=True, blank=True)
    tolerancia_entrada = models.IntegerField(default=15)  # minutos
    tolerancia_saida = models.IntegerField(default=15)  # minutos
    dias_semana = models.JSONField(default=list)  # [1,2,3,4,5] = seg-sex
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'horario'
        verbose_name = 'Horário'
        verbose_name_plural = 'Horários'


class Escala(models.Model):
    """Define escalas de trabalho (turnos)"""
    nome = models.CharField(max_length=100)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='escalas')
    tipo = models.CharField(max_length=50, choices=[
        ('fixa', 'Fixa'),
        ('rotativa', 'Rotativa'),
        ('flexivel', 'Flexível'),
    ])
    horario = models.ForeignKey(Horario, on_delete=models.SET_NULL, null=True, related_name='escalas')
    data_inicio = models.DateField()
    data_fim = models.DateField(null=True, blank=True)
    funcionarios = models.ManyToManyField(Funcionario, related_name='escalas')
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'escala'
        verbose_name = 'Escala'
        verbose_name_plural = 'Escalas'


class RegistroPonto(models.Model):
    """Registra marcações de ponto"""
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='registros_ponto')
    tipo = models.CharField(max_length=50, choices=[
        ('entrada', 'Entrada'),
        ('saida', 'Saída'),
        ('saida_intervalo', 'Saída Intervalo'),
        ('retorno_intervalo', 'Retorno Intervalo'),
    ])
    data_hora = models.DateTimeField(default=timezone.now)
    localizacao = models.CharField(max_length=200, null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    biometria_validada = models.BooleanField(default=False)
    biometria = models.ForeignKey(BiometriaFuncionario, on_delete=models.SET_NULL, null=True, blank=True)
    dispositivo = models.CharField(max_length=100, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    observacao = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=[
        ('sucesso', 'Sucesso'),
        ('pendente', 'Pendente'),
        ('rejeitado', 'Rejeitado'),
    ], default='sucesso')
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'registro_ponto'
        verbose_name = 'Registro de Ponto'
        verbose_name_plural = 'Registros de Ponto'
        ordering = ['-data_hora']


class Justificativa(models.Model):
    """Justificativas de ausências e atrasos"""
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='justificativas')
    tipo = models.CharField(max_length=50, choices=[
        ('falta', 'Falta'),
        ('atraso', 'Atraso'),
        ('saida_antecipada', 'Saída Antecipada'),
    ])
    data_inicio = models.DateField()
    data_fim = models.DateField()
    motivo = models.TextField()
    documento = models.FileField(upload_to='justificativas/', null=True, blank=True)
    status = models.CharField(max_length=50, choices=[
        ('pendente', 'Pendente'),
        ('aprovado', 'Aprovado'),
        ('rejeitado', 'Rejeitado'),
    ], default='pendente')
    aprovador = models.ForeignKey(UsuarioEmpresa, on_delete=models.SET_NULL, null=True, blank=True, related_name='justificativas_aprovadas')
    data_aprovacao = models.DateTimeField(null=True, blank=True)
    observacao_aprovador = models.TextField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'justificativa'
        verbose_name = 'Justificativa'
        verbose_name_plural = 'Justificativas'
        ordering = ['-criado_em']


class BancoHoras(models.Model):
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='banco_horas')
    data = models.DateField()
    tipo = models.CharField(max_length=50, choices=[
        ('credito', 'Crédito'),
        ('debito', 'Débito'),
        ('compensacao', 'Compensação'),
    ])
    horas = models.DecimalField(max_digits=5, decimal_places=2)  # 99.99 horas
    descricao = models.TextField()
    registro_ponto = models.ForeignKey(RegistroPonto, on_delete=models.SET_NULL, null=True, blank=True)
    saldo_anterior = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    saldo_atual = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    aprovado = models.BooleanField(default=False)
    aprovador = models.ForeignKey(UsuarioEmpresa, on_delete=models.SET_NULL, null=True, blank=True, related_name='banco_horas_aprovadas')
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'banco_horas'
        verbose_name = 'Banco de Horas'
        verbose_name_plural = 'Banco de Horas'
        ordering = ['-data']


class Alerta(models.Model):
    tipo = models.CharField(max_length=100)
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='alertas')
    departamento = models.ForeignKey(Departamento, on_delete=models.SET_NULL, null=True, blank=True)
    prioridade = models.CharField(max_length=50, choices=[
        ('baixa', 'Baixa'),
        ('media', 'Média'),
        ('alta', 'Alta'),
    ])
    descricao = models.TextField()
    data = models.DateField()
    status = models.CharField(max_length=50, choices=[
        ('pendente', 'Pendente'),
        ('resolvido', 'Resolvido'),
        ('ignorado', 'Ignorado'),
    ], default='pendente')
    resolvido_por = models.ForeignKey(UsuarioEmpresa, on_delete=models.SET_NULL, null=True, blank=True, related_name='alertas_resolvidos')
    data_resolucao = models.DateTimeField(null=True, blank=True)
    observacao_resolucao = models.TextField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'alerta'
        verbose_name = 'Alerta'
        verbose_name_plural = 'Alertas'
        ordering = ['-criado_em']
