from .models import Empresa, UsuarioEmpresa,Satisfacao,Dispensas,CamposPersonalizados,ValoresArquivo,  Departamento, Funcionario
from rest_framework.response import Response
from rest_framework import serializers
import re
from django.core.validators import EmailValidator
class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = '__all__'
class SatisfacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Satisfacao
        fields = '__all__'
class ValoresArquivoSerializer(serializers.ModelSerializer):
    nome_campo = serializers.SerializerMethodField()
    class Meta:
        model = ValoresArquivo
        fields = ['id', 'nome_campo', 'arquivo']
        
    def get_nome_campo(self, obj):
        return obj.campo_personalizado.nome
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
class SolicitarRecuperacaoSerializer(serializers.Serializer):
    email = serializers.EmailField(
        validators=[EmailValidator()],
        error_messages={
            'invalid': 'Por favor, insira um email válido.'
        }
    )

class VerificarCodigoRecuperacaoSerializer(serializers.Serializer):
    email = serializers.EmailField()
    codigo = serializers.CharField(max_length=6, min_length=6)

class RedefinirSenhaSerializer(serializers.Serializer):
    email = serializers.EmailField()
    codigo = serializers.CharField(max_length=6, min_length=6)
    nova_senha = serializers.CharField(min_length=8)
    confirmar_senha = serializers.CharField(min_length=8)

    def validate(self, data):
        if data['nova_senha'] != data['confirmar_senha']:
            raise serializers.ValidationError("As senhas não coincidem.")
        
        if not self.validar_senha(data['nova_senha']):
            raise serializers.ValidationError(
                "A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números."
            )
        
        return data

    def validar_senha(self, senha):
        if len(senha) < 8:
            return False
        if not re.search(r'[A-Z]', senha):
            return False
        if not re.search(r'[a-z]', senha):
            return False
        if not re.search(r'\d', senha):
            return False
        return True
class CamposPersonalizadosSerializer(serializers.ModelSerializer):
    class Meta:
        model = CamposPersonalizados
        fields = '__all__'
        extra_kwargs = {
            'opcoes': {'required': False, 'allow_null': True}
        }
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
    departamento_nome = serializers.CharField(source='departamento.nome', read_only=True)
    
    class Meta:
        model = Funcionario
        fields = ['id', 'departamento', 'departamento_nome', 'empresa', 'valores', 'salario_bruto', 'data_criacao', 'arquivos']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.departamento:
            representation['departamento'] = instance.departamento.nome
        else:
            representation['departamento'] = None
        representation.pop('departamento_nome', None)
        return representation
    
    def create(self, validated_data):
        valores = Funcionario(**validated_data)
        valores.save()
        return valores

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Departamento
        fields="__all__"
        def create(self, validated_data):
            departamento=Departamento(**validated_data)
            departamento.save()
            return departamento

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
