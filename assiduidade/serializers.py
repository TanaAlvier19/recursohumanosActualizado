"""
Django REST Framework Serializers para Sistema de Assiduidade
"""

from rest_framework import serializers


class BiometriaSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    funcionario_id = serializers.IntegerField()
    tipo = serializers.ChoiceField(choices=['digital', 'facial', 'voz'])
    dados_biometricos = serializers.CharField()
    dispositivo = serializers.CharField(max_length=100)
    ativo = serializers.BooleanField(default=True)
    criado_em = serializers.DateTimeField(read_only=True)


class HorarioSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    nome = serializers.CharField(max_length=100)
    empresa_id = serializers.IntegerField()
    entrada = serializers.TimeField()
    saida = serializers.TimeField()
    intervalo_inicio = serializers.TimeField(required=False, allow_null=True)
    intervalo_fim = serializers.TimeField(required=False, allow_null=True)
    tolerancia_entrada = serializers.IntegerField(default=15)
    tolerancia_saida = serializers.IntegerField(default=15)
    dias_semana = serializers.ListField(child=serializers.IntegerField(), default=list)
    ativo = serializers.BooleanField(default=True)
    criado_em = serializers.DateTimeField(read_only=True)


class EscalaSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    nome = serializers.CharField(max_length=100)
    empresa_id = serializers.IntegerField()
    tipo = serializers.ChoiceField(choices=['fixa', 'rotativa', 'flexivel'])
    horario_id = serializers.IntegerField(required=False, allow_null=True)
    data_inicio = serializers.DateField()
    data_fim = serializers.DateField(required=False, allow_null=True)
    funcionarios = serializers.ListField(child=serializers.IntegerField(), default=list)
    ativo = serializers.BooleanField(default=True)
    criado_em = serializers.DateTimeField(read_only=True)


class RegistroPontoSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    funcionario_id = serializers.IntegerField()
    funcionario_nome = serializers.CharField(read_only=True)
    departamento_nome = serializers.CharField(read_only=True)
    tipo = serializers.ChoiceField(choices=['entrada', 'saida', 'saida_intervalo', 'retorno_intervalo'])
    data_hora = serializers.DateTimeField()
    localizacao = serializers.CharField(max_length=200, required=False, allow_null=True)
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=False, allow_null=True)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=False, allow_null=True)
    biometria_validada = serializers.BooleanField(default=False)
    biometria_id = serializers.IntegerField(required=False, allow_null=True)
    dispositivo = serializers.CharField(max_length=100, required=False, allow_null=True)
    ip_address = serializers.IPAddressField(required=False, allow_null=True)
    observacao = serializers.CharField(required=False, allow_null=True)
    status = serializers.ChoiceField(choices=['sucesso', 'pendente', 'rejeitado'], default='sucesso')
    criado_em = serializers.DateTimeField(read_only=True)


class JustificativaSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    funcionario_id = serializers.IntegerField()
    funcionario_nome = serializers.CharField(read_only=True)
    departamento_nome = serializers.CharField(read_only=True)
    tipo = serializers.ChoiceField(choices=['falta', 'atraso', 'saida_antecipada'])
    data_inicio = serializers.DateField()
    data_fim = serializers.DateField()
    motivo = serializers.CharField()
    documento = serializers.FileField(required=False, allow_null=True)
    status = serializers.ChoiceField(choices=['pendente', 'aprovado', 'rejeitado'], default='pendente')
    aprovador_id = serializers.IntegerField(required=False, allow_null=True)
    aprovador_nome = serializers.CharField(read_only=True)
    data_aprovacao = serializers.DateTimeField(required=False, allow_null=True)
    observacao_aprovador = serializers.CharField(required=False, allow_null=True)
    criado_em = serializers.DateTimeField(read_only=True)


class BancoHorasSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    funcionario_id = serializers.IntegerField()
    funcionario_nome = serializers.CharField(read_only=True)
    data = serializers.DateField()
    tipo = serializers.ChoiceField(choices=['credito', 'debito', 'compensacao'])
    horas = serializers.DecimalField(max_digits=5, decimal_places=2)
    descricao = serializers.CharField()
    registro_ponto_id = serializers.IntegerField(required=False, allow_null=True)
    saldo_anterior = serializers.DecimalField(max_digits=6, decimal_places=2, default=0)
    saldo_atual = serializers.DecimalField(max_digits=6, decimal_places=2, default=0)
    aprovado = serializers.BooleanField(default=False)
    aprovador_id = serializers.IntegerField(required=False, allow_null=True)
    criado_em = serializers.DateTimeField(read_only=True)


class AlertaSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    tipo = serializers.CharField(max_length=100)
    funcionario_id = serializers.IntegerField()
    funcionario_nome = serializers.CharField(read_only=True)
    departamento_id = serializers.IntegerField(required=False, allow_null=True)
    departamento_nome = serializers.CharField(read_only=True)
    prioridade = serializers.ChoiceField(choices=['baixa', 'media', 'alta'])
    descricao = serializers.CharField()
    data = serializers.DateField()
    status = serializers.ChoiceField(choices=['pendente', 'resolvido', 'ignorado'], default='pendente')
    resolvido_por_id = serializers.IntegerField(required=False, allow_null=True)
    data_resolucao = serializers.DateTimeField(required=False, allow_null=True)
    observacao_resolucao = serializers.CharField(required=False, allow_null=True)
    criado_em = serializers.DateTimeField(read_only=True)
