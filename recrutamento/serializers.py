from rest_framework import serializers
from .models import Vaga, Candidato, Aplicacao, Avaliacao, Teste, Entrevista


class VagaSerializer(serializers.ModelSerializer):
    total_candidatos = serializers.SerializerMethodField()
    departamento_nome = serializers.CharField(source='departamento.nome', read_only=True)
    empresa_nome = serializers.CharField(source='empresa.nome', read_only=True)
    
    class Meta:
        model = Vaga
        fields = '__all__'
    
    def get_total_candidatos(self, obj):
        return obj.aplicacoes.count()


class CandidatoSerializer(serializers.ModelSerializer):
    total_aplicacoes = serializers.SerializerMethodField()
    vaga_nome=serializers.CharField(source='vaga.titulo', read_only=True)
    class Meta:
        model = Candidato
        fields = '__all__'
    extra_kwargs = {
            'empresa': {'required': True},
            'vaga': {'required': True},
            'curriculo': {'required': False}}
    def get_total_aplicacoes(self, obj):
        return obj.aplicacoes.count()


class AvaliacaoSerializer(serializers.ModelSerializer):
    avaliador_nome = serializers.CharField(source='avaliador', read_only=True)
    
    class Meta:
        model = Avaliacao
        fields = '__all__'


class TesteSerializer(serializers.ModelSerializer):
    candidato_nome = serializers.CharField(source='aplicacao.candidato.nome', read_only=True)
    
    class Meta:
        model = Teste
        fields = '__all__'


class EntrevistaSerializer(serializers.ModelSerializer):
    candidato_nome = serializers.CharField(source='aplicacao.candidato.nome', read_only=True)
    vaga_titulo = serializers.CharField(source='aplicacao.vaga.titulo', read_only=True)
    
    class Meta:
        model = Entrevista
        fields = '__all__'


class AplicacaoSerializer(serializers.ModelSerializer):
    candidato = CandidatoSerializer(read_only=True)
    vaga = VagaSerializer(read_only=True)
    candidato_id = serializers.UUIDField(write_only=True)
    vaga_id = serializers.UUIDField(write_only=True)
    vaga_titulo=serializers.CharField(source='vaga.titulo',read_only=True)
    avaliacoes = AvaliacaoSerializer(many=True, read_only=True)
    testes = TesteSerializer(many=True, read_only=True)
    entrevistas = EntrevistaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Aplicacao
        fields = '__all__'
