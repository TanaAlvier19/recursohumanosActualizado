from .models import Empresa, UsuarioEmpresa, TesteTecnico,Entrevista,Dispensas,CamposPersonalizados,ValoresArquivo, Inscricao,Formacoes,Vagas,Candidato,FolhaPagamento, Modulos, Valores, Departamento,DescontosImposto
from rest_framework.response import Response
from rest_framework import serializers

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = '__all__'
class ValoresArquivoSerializer(serializers.ModelSerializer):
    nome_campo = serializers.SerializerMethodField()

    class Meta:
        model = ValoresArquivo
        fields = ['id', 'nome_campo', 'arquivo']
        
    def get_nome_campo(self, obj):
        return obj.campo_personalizado.nome
class InscricaoSerializer(serializers.ModelSerializer):
    funcionario_nome = serializers.CharField(source='funcionario.nomeRep', read_only=True)
    formacao = serializers.CharField(source='inscricao.titulo', read_only=True)
    class Meta:
        model=Inscricao
        fields="__all__"
class EntrevistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrevista
        fields = '__all__'

class TesteTecnicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TesteTecnico
        fields = '__all__'
class UsuarioEmpresaSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True, min_length=8)
    class Meta:
        model = UsuarioEmpresa
        fields = '__all__'
    def create(self, validated_data):
        password=validated_data.pop('password')
        usuarioEmpresa=UsuarioEmpresa(**validated_data)
        usuarioEmpresa.set_password(password)
        usuarioEmpresa.save()
        return usuarioEmpresa
class CamposPersonalizadosSerializer(serializers.ModelSerializer):
    class Meta:
        model = CamposPersonalizados
        fields = '__all__'
class VerificarOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate_otp(self, value):
        
        if not value.isdigit():
            raise serializers.ValidationError("O código OTP deve conter apenas números.")
        return value
class SetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    senha = serializers.CharField(min_length=8)
    confirmar_senha = serializers.CharField(min_length=8)

    def validate(self, data):
        if data['senha'] != data['confirmar_senha']:
            raise serializers.ValidationError("As senhas não coincidem.")
        return data
class ValoresSerializer(serializers.ModelSerializer):
    arquivos = ValoresArquivoSerializer(many=True, read_only=True)
    class Meta:
        model=Valores
        fields='__all__'
    def create(self, validated_data):
        valores=Valores(**validated_data)
        valores.save()
        return valores
class FormacoesSerializer(serializers.ModelSerializer):
    class Meta:
        model=Formacoes
        fields='__all__'
    def create(self, validated_data):
        formacoes=Formacoes(**validated_data)
        formacoes.save()
        return formacoes

class FolhaPagamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FolhaPagamento
        fields = '__all__'
        read_only_fields = ['id', 'data_criacao']
    def create(self, validated_data):
        folha_pagamento = FolhaPagamento(**validated_data)
        folha_pagamento.save()
        return folha_pagamento
class ModulosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modulos
        fields = '__all__'
    
    def create(self, validated_data):
        modulos = Modulos(**validated_data)
        modulos.save()
        return modulos
class DescontosSerializer(serializers.ModelSerializer):
    class Meta:
        model=DescontosImposto
        fields="__all__"
class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Departamento
        fields="__all__"
        def create(self, validated_data):
            departamento=Departamento(**validated_data)
            departamento.save()
            return departamento
class VagaSerializer(serializers.ModelSerializer):
    class Meta:
        model=Vagas
        fields=["id","titulo","departamento","empresa","requisitos","dataAbertura","dataFim","tipoVaga"]

        def create(self, validated_data):
                vaga=Vagas(**validated_data)
                vaga.save()
                return vaga
               
class CandidatoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Candidato
        fields="__all__"
        def create(self, validated_data):
                candidato=Candidato(**validated_data)
                candidato.save()
                return candidato
class DispensasSerializer(serializers.ModelSerializer):
    funcionario_nome = serializers.CharField(source='funcionario.nomeRep', read_only=True)

    class Meta:
        model = Dispensas
        fields = [
            'id', 'funcionario_nome',
            'motivo', 'inicio', 'fim', 'justificativo','por',
            'status', 'admin_comentario', 'created_at'
        ]
        read_only_fields = ['status', 'admin_comentario', 'created_at', 'funcionario_nome']
