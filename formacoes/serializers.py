# serializers.py
from rest_framework import serializers
from .models import Instrutor, Competencia, Formacao, Inscricao, Presenca, AvaliacaoFormacao, Certificado, AvaliacaoCompetencia

class InstrutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrutor
        fields = '__all__'

class CompetenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competencia
        fields = '__all__'

class FormacaoSerializer(serializers.ModelSerializer):
    instrutor_nome = serializers.CharField(source='instrutor.nome', read_only=True)
    total_inscritos = serializers.SerializerMethodField()
    
    class Meta:
        model = Formacao
        fields = '__all__'
    
    def get_total_inscritos(self, obj):
        return obj.inscricoes.count()

class InscricaoSerializer(serializers.ModelSerializer):
    funcionario_nome = serializers.CharField(source='funcionario.nome', read_only=True)
    formacao_titulo = serializers.CharField(source='formacao.titulo', read_only=True)
    
    class Meta:
        model = Inscricao
        fields = '__all__'

class PresencaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presenca
        fields = '__all__'

class AvaliacaoFormacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvaliacaoFormacao
        fields = '__all__'

class CertificadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificado
        fields = '__all__'

class AvaliacaoCompetenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvaliacaoCompetencia
        fields = '__all__'

# Serializers para relatórios e estatísticas
class EstatisticasFormacoesSerializer(serializers.Serializer):
    total_formacoes = serializers.IntegerField()
    formacoes_ativas = serializers.IntegerField()
    total_inscricoes = serializers.IntegerField()
    taxa_conclusao = serializers.FloatField()
    horas_treinamento = serializers.IntegerField()
    investimento_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    certificados_emitidos = serializers.IntegerField()
    media_satisfacao = serializers.FloatField()

class EvolucaoMensalSerializer(serializers.Serializer):
    mes = serializers.CharField()
    formacoes = serializers.IntegerField()
    participantes = serializers.IntegerField()
    conclusoes = serializers.IntegerField()

class DistribuicaoTipoSerializer(serializers.Serializer):
    name = serializers.CharField()
    value = serializers.IntegerField()