from rest_framework import serializers
from app.models import (
    Empresa, UsuarioEmpresa, Funcionario, Departamento,
    CamposPersonalizados, Dispensas
)
from .models import (
    DescontosImposto, FolhaPagamento, ReciboPagamento,
    HoraExtra, Ferias, DecimoTerceiro, Emprestimo,
    ParcelaEmprestimo, RelatorioFiscal, RelatorioContabil, Desconto, Beneficio
)


# Serializers de Empresa e Usuário
class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = ['id', 'nome', 'nif', 'email_corporativo', 'tipo_empresa', 
                  'setor_atuacao', 'telefone', 'endereco', 'data_criacao']
        read_only_fields = ['id', 'data_criacao']


class UsuarioEmpresaSerializer(serializers.ModelSerializer):
    empresa_nome = serializers.CharField(source='empresa.nome', read_only=True)
    
    class Meta:
        model = UsuarioEmpresa
        fields = ['id', 'empresa', 'empresa_nome', 'nomeRep', 'nivel_acesso', 
                  'emailRep', 'is_active']
        read_only_fields = ['id']
        extra_kwargs = {'password': {'write_only': True}}


# Serializers de Departamento e Funcionário
class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = ['id', 'codigo', 'empresa', 'descricao', 'responsavel', 
                  'nome', 'orcamento', 'local', 'status', 'data_criacao']
        read_only_fields = ['id', 'data_criacao']


class FuncionarioSerializer(serializers.ModelSerializer):
    departamento_nome = serializers.CharField(source='departamento.nome', read_only=True)
    empresa_nome = serializers.CharField(source='empresa.nome', read_only=True)
    
    class Meta:
        model = Funcionario
        fields = ['id', 'departamento', 'departamento_nome', 'empresa', 
                  'empresa_nome', 'valores', 'salario_bruto', 'data_criacao']
        read_only_fields = ['id', 'data_criacao']


# Serializers de Folha de Pagamento
class ReciboPagamentoSerializer(serializers.ModelSerializer):
    funcionario_nome = serializers.SerializerMethodField()
    funcionario_cargo = serializers.SerializerMethodField()
    funcionario_departamento = serializers.SerializerMethodField()
    mes_referencia_formatado = serializers.SerializerMethodField()
    
    class Meta:
        model = ReciboPagamento
        fields = [
            'id', 'folha', 'funcionario', 'funcionario_nome', 'funcionario_cargo',
            'funcionario_departamento', 'mes_referencia', 'mes_referencia_formatado',
            'data_emissao', 'status', 'salario_base', 'horas_extras', 
            'adicional_noturno', 'comissoes', 'bonus', 'outros_vencimentos',
            'inss', 'irt', 'faltas_atrasos', 'vale_transporte', 'emprestimos',
            'outros_descontos', 'vale_alimentacao', 'plano_saude', 'seguro_vida',
            'salario_bruto', 'total_descontos', 'salario_liquido',
            'data_visualizacao', 'data_download'
        ]
        read_only_fields = ['id', 'data_emissao', 'salario_bruto', 
                            'total_descontos', 'salario_liquido']
    
    def get_funcionario_nome(self, obj):
        return obj.funcionario.valores.get('nome', 'N/A')
    
    def get_funcionario_cargo(self, obj):
        return obj.funcionario.valores.get('cargo', 'N/A')
    
    def get_funcionario_departamento(self, obj):
        return obj.funcionario.departamento.nome if obj.funcionario.departamento else 'N/A'
    
    def get_mes_referencia_formatado(self, obj):
        return obj.mes_referencia.strftime('%B %Y')


class FolhaPagamentoSerializer(serializers.ModelSerializer):
    recibos = ReciboPagamentoSerializer(many=True, read_only=True)
    aprovado_por_nome = serializers.CharField(source='aprovado_por.nomeRep', read_only=True)
    
    class Meta:
        model = FolhaPagamento
        fields = [
            'id', 'mes_referencia', 'status', 'total_bruto', 'total_descontos',
            'total_liquido', 'total_encargos', 'total_funcionarios',
            'data_processamento', 'data_aprovacao', 'data_pagamento',
            'aprovado_por', 'aprovado_por_nome', 'observacoes',
            'criado_em', 'atualizado_em', 'recibos'
        ]
        read_only_fields = ['id', 'criado_em', 'atualizado_em']


# Serializers de Horas Extras
class HoraExtraSerializer(serializers.ModelSerializer):
    funcionario_nome = serializers.SerializerMethodField()
    aprovado_por_nome = serializers.CharField(source='aprovado_por.nomeRep', read_only=True)
    
    class Meta:
        model = HoraExtra
        fields = [
            'id', 'funcionario', 'funcionario_nome', 'data', 'tipo', 'horas',
            'valor_hora', 'percentual_adicional', 'valor_total', 'status',
            'justificativa', 'aprovado_por', 'aprovado_por_nome',
            'data_aprovacao', 'observacoes', 'criado_em', 'atualizado_em'
        ]
        read_only_fields = ['id', 'valor_total', 'criado_em', 'atualizado_em']
    
    def get_funcionario_nome(self, obj):
        return obj.funcionario.valores.get('nome', 'N/A')
    
    def create(self, validated_data):
        hora_extra = super().create(validated_data)
        hora_extra.calcular_valor()
        hora_extra.save()
        return hora_extra


# Serializers de Férias
class FeriasSerializer(serializers.ModelSerializer):
    funcionario_nome = serializers.SerializerMethodField()
    aprovado_por_nome = serializers.CharField(source='aprovado_por.nomeRep', read_only=True)
    
    class Meta:
        model = Ferias
        fields = [
            'id', 'funcionario', 'funcionario_nome', 'periodo_aquisitivo_inicio',
            'periodo_aquisitivo_fim', 'data_inicio', 'data_fim', 'dias_corridos',
            'dias_abono', 'adiantamento_13', 'valor_ferias', 'valor_abono',
            'valor_13_adiantado', 'valor_total', 'status', 'aprovado_por',
            'aprovado_por_nome', 'data_aprovacao', 'observacoes',
            'criado_em', 'atualizado_em'
        ]
        read_only_fields = ['id', 'valor_ferias', 'valor_abono', 
                            'valor_13_adiantado', 'valor_total',
                            'criado_em', 'atualizado_em']
    
    def get_funcionario_nome(self, obj):
        return obj.funcionario.valores.get('nome', 'N/A')


# Serializers de 13º Salário
class DecimoTerceiroSerializer(serializers.ModelSerializer):
    funcionario_nome = serializers.SerializerMethodField()
    
    class Meta:
        model = DecimoTerceiro
        fields = [
            'id', 'funcionario', 'funcionario_nome', 'ano_referencia',
            'meses_trabalhados', 'salario_base', 'valor_bruto', 'inss', 'irt',
            'valor_liquido', 'primeira_parcela', 'segunda_parcela',
            'data_pagamento_primeira', 'data_pagamento_segunda', 'status',
            'observacoes', 'criado_em', 'atualizado_em'
        ]
        read_only_fields = ['id', 'valor_bruto', 'valor_liquido', 
                            'primeira_parcela', 'segunda_parcela',
                            'criado_em', 'atualizado_em']
    
    def get_funcionario_nome(self, obj):
        return obj.funcionario.valores.get('nome', 'N/A')
    
    def create(self, validated_data):
        decimo = super().create(validated_data)
        decimo.calcular_valores()
        decimo.save()
        return decimo


# Serializers de Empréstimos
class ParcelaEmprestimoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParcelaEmprestimo
        fields = [
            'id', 'emprestimo', 'numero_parcela', 'valor', 'data_vencimento',
            'data_pagamento', 'status', 'recibo'
        ]
        read_only_fields = ['id']


class EmprestimoSerializer(serializers.ModelSerializer):
    funcionario_nome = serializers.SerializerMethodField()
    aprovado_por_nome = serializers.CharField(source='aprovado_por.nomeRep', read_only=True)
    parcelas = ParcelaEmprestimoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Emprestimo
        fields = [
            'id', 'funcionario', 'funcionario_nome', 'valor_solicitado',
            'valor_aprovado', 'numero_parcelas', 'valor_parcela', 'taxa_juros',
            'valor_total', 'parcelas_pagas', 'valor_pago', 'saldo_devedor',
            'data_solicitacao', 'data_aprovacao', 'data_primeira_parcela',
            'status', 'motivo', 'aprovado_por', 'aprovado_por_nome',
            'observacoes', 'criado_em', 'atualizado_em', 'parcelas'
        ]
        read_only_fields = ['id', 'valor_parcela', 'valor_total', 'parcelas_pagas',
                            'valor_pago', 'saldo_devedor', 'data_solicitacao',
                            'criado_em', 'atualizado_em']
    
    def get_funcionario_nome(self, obj):
        return obj.funcionario.valores.get('nome', 'N/A')


# Serializers de Relatórios
class RelatorioFiscalSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelatorioFiscal
        fields = [
            'id', 'tipo', 'periodo', 'data_geracao', 'status',
            'total_funcionarios', 'total_remuneracao', 'total_encargos',
            'arquivo_gerado', 'observacoes'
        ]
        read_only_fields = ['id', 'data_geracao']


class RelatorioContabilSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelatorioContabil
        fields = [
            'id', 'tipo', 'periodo', 'data_geracao', 'total_bruto',
            'total_descontos', 'total_liquido', 'total_encargos',
            'arquivo_gerado', 'observacoes'
        ]
        read_only_fields = ['id', 'data_geracao']


# Serializers de Descontos e Impostos
class DescontosImpostoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DescontosImposto
        fields = [
            'id', 'desconto_inss', 'irt2', 'irt3', 'irt4', 'irt5', 'irt6', 'irt7',
            'atualizado_em'
        ]
        read_only_fields = ['id', 'atualizado_em']


# Serializers de Dispensas
class DispensasSerializer(serializers.ModelSerializer):
    funcionario_nome = serializers.CharField(source='funcionario.nomeRep', read_only=True)
    
    class Meta:
        model = Dispensas
        fields = [
            'id', 'empresa', 'funcionario', 'funcionario_nome', 'motivo',
            'inicio', 'fim', 'justificativo', 'status', 'admin_comentario',
            'por', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class DescontoSerializer(serializers.ModelSerializer):
    funcionario_nome = serializers.SerializerMethodField()
    criado_por_nome = serializers.CharField(source='criado_por.nomeRep', read_only=True)
    valor_calculado = serializers.SerializerMethodField()
    esta_vigente = serializers.SerializerMethodField()
    
    class Meta:
        model = Desconto
        fields = [
            'id', 'nome', 'descricao', 'tipo', 'categoria', 'aplicavel_a',
            'valor_fixo', 'percentual', 'valor_minimo', 'valor_maximo',
            'data_inicio', 'data_fim', 'recorrente', 'status', 'ativo',
            'funcionario', 'funcionario_nome', 'departamento_alvo', 'cargo_alvo',
            'criado_por', 'criado_por_nome', 'criado_em', 'atualizado_em',
            'valor_calculado', 'esta_vigente'
        ]
        read_only_fields = ['id', 'criado_em', 'atualizado_em']
    
    def get_funcionario_nome(self, obj):
        if obj.funcionario:
            return obj.funcionario.valores.get('nome', 'N/A')
        return 'N/A'
    
    def get_valor_calculado(self, obj):
        salario_base = 750000  # Valor exemplo
        return obj.calcular_valor(salario_base)
    
    def get_esta_vigente(self, obj):
        return obj.esta_vigente()


class BeneficioSerializer(serializers.ModelSerializer):
    funcionario_nome = serializers.SerializerMethodField()
    criado_por_nome = serializers.CharField(source='criado_por.nomeRep', read_only=True)
    valor_calculado = serializers.SerializerMethodField()
    esta_vigente = serializers.SerializerMethodField()
    impacto_fiscal = serializers.SerializerMethodField()
    
    class Meta:
        model = Beneficio
        fields = [
            'id', 'nome', 'descricao', 'tipo', 'categoria', 'aplicavel_a',
            'valor_fixo', 'percentual', 'valor_minimo', 'valor_maximo',
            'descontavel_ir', 'descontavel_inss', 'tributavel',
            'data_inicio', 'data_fim', 'recorrente', 'status', 'ativo',
            'funcionario', 'funcionario_nome', 'departamento_alvo', 'cargo_alvo',
            'criado_por', 'criado_por_nome', 'criado_em', 'atualizado_em',
            'valor_calculado', 'esta_vigente', 'impacto_fiscal'
        ]
        read_only_fields = ['id', 'criado_em', 'atualizado_em']
    
    def get_funcionario_nome(self, obj):
        if obj.funcionario:
            return obj.funcionario.valores.get('nome', 'N/A')
        return 'N/A'
    
    def get_valor_calculado(self, obj):
        salario_base = 750000  # Valor exemplo
        return obj.calcular_valor(salario_base)
    
    def get_esta_vigente(self, obj):
        return obj.esta_vigente()
    
    def get_impacto_fiscal(self, obj):
        salario_base = 750000  # Valor exemplo
        valor_beneficio = obj.calcular_valor(salario_base)
        return obj.calcular_impacto_fiscal(valor_beneficio)
