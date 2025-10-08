from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
from app.models import Funcionario, Departamento, UsuarioEmpresa, Empresa

class DescontosImposto(models.Model):
    TIPO_IMPOSTO_CHOICES = [
        ('IRT', 'Imposto sobre o Rendimento do Trabalho'),
        ('INSS', 'Instituto Nacional de Segurança Social'),
        ('AGT', 'Administração Geral Tributária'),
    ]
    
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, default="37f1f5d0-4a49-4365-b8b2-beb988da968c")
    tipo_imposto = models.CharField(max_length=10, choices=TIPO_IMPOSTO_CHOICES, default=None)
    
    # Tabelas IRT 2024 Angola
    irt_escalao_1 = models.DecimalField(max_digits=10, decimal_places=2, default=70000)  # Até 70.000
    irt_escalao_2_min = models.DecimalField(max_digits=10, decimal_places=2, default=70000)
    irt_escalao_2_max = models.DecimalField(max_digits=10, decimal_places=2, default=100000)
    irt_escalao_2_percent = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    
    # INSS - Trabalhador 3%, Empresa 8%
    inss_trabalhador_percent = models.DecimalField(max_digits=5, decimal_places=2, default=3.00)
    inss_empresa_percent = models.DecimalField(max_digits=5, decimal_places=2, default=8.00)
    
    # Subsídios legais
    subsidio_alimentacao_minimo = models.DecimalField(max_digits=10, decimal_places=2, default=35000)
    subsidio_transporte_minimo = models.DecimalField(max_digits=10, decimal_places=2, default=25000)
    
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Configuração de Impostos Angola"
        verbose_name_plural = "Configurações de Impostos Angola"


class FolhaPagamento(models.Model):
    """Folha de pagamento mensal"""
    STATUS_CHOICES = [
        ('RASCUNHO', 'Rascunho'),
        ('EM_PROCESSAMENTO', 'Em Processamento'),
        ('PROCESSADA', 'Processada'),
        ('APROVADA', 'Aprovada'),
        ('PAGA', 'Paga'),
        ('CANCELADA', 'Cancelada'),
    ]
    
    mes_referencia = models.DateField(help_text="Primeiro dia do mês de referência")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='RASCUNHO')
    total_bruto = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_descontos = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_liquido = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_encargos = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_funcionarios = models.IntegerField(default=0)
    data_processamento = models.DateTimeField(null=True, blank=True)
    data_aprovacao = models.DateTimeField(null=True, blank=True)
    data_pagamento = models.DateTimeField(null=True, blank=True)
    aprovado_por = models.ForeignKey(UsuarioEmpresa, on_delete=models.SET_NULL, null=True, blank=True, related_name='folha_pagamento')
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Folha de Pagamento"
        verbose_name_plural = "Folhas de Pagamento"
        ordering = ['-mes_referencia']
        unique_together = ['mes_referencia']
    
    def __str__(self):
        return f"Folha {self.mes_referencia.strftime('%m/%Y')} - {self.get_status_display()}"


class ReciboPagamento(models.Model):
    """Recibo individual de pagamento"""
    STATUS_CHOICES = [
        ('GERADO', 'Gerado'),
        ('ENVIADO', 'Enviado'),
        ('VISUALIZADO', 'Visualizado'),
        ('BAIXADO', 'Baixado'),
    ]
    
    folha = models.ForeignKey(FolhaPagamento, on_delete=models.CASCADE, related_name='recibos')
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='recibos')
    mes_referencia = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)],
        help_text="Mês de referência (1-12)")
    data_emissao = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='GERADO')
    ano_referencia = models.IntegerField(default=2025)
    # Vencimentos
    salario_base = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    horas_extras = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    adicional_noturno = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    comissoes = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    bonus = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    outros_vencimentos = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Descontos
    inss = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    irt = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    faltas_atrasos = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    vale_transporte = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    emprestimos = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    outros_descontos = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Benefícios
    vale_alimentacao = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    plano_saude = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    seguro_vida = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Totais
    salario_bruto = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_descontos = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    salario_liquido = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    data_visualizacao = models.DateTimeField(null=True, blank=True)
    data_download = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Recibo de Pagamento"
        verbose_name_plural = "Recibos de Pagamento"
        """ ordering = ['-mes_referencia', 'funcionario__nome'] """
        unique_together = ['folha', 'funcionario']
    
    def __str__(self):
        return f"Recibo {self.funcionario.nome} - {self.mes_referencia.strftime('%m/%Y')}"
    
    def calcular_totais(self):
        """Calcula os totais do recibo"""
        self.salario_bruto = (
            self.salario_base + self.horas_extras + self.adicional_noturno +
            self.comissoes + self.bonus + self.outros_vencimentos
        )
        self.total_descontos = (
            self.inss + self.irt + self.faltas_atrasos +
            self.vale_transporte + self.emprestimos + self.outros_descontos
        )
        self.salario_liquido = self.salario_bruto - self.total_descontos


class HoraExtra(models.Model):
    """Registro de horas extras"""
    STATUS_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('APROVADA', 'Aprovada'),
        ('REJEITADA', 'Rejeitada'),
        ('PAGA', 'Paga'),
    ]
    
    TIPO_CHOICES = [
        ('NORMAL', 'Normal (50%)'),
        ('NOTURNA', 'Noturna (75%)'),
        ('DOMINGO_FERIADO', 'Domingo/Feriado (100%)'),
    ]
    
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='horas_extras')
    data = models.DateField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='NORMAL')
    horas = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0)])
    valor_hora = models.DecimalField(max_digits=10, decimal_places=2)
    percentual_adicional = models.DecimalField(max_digits=5, decimal_places=2, default=50)
    valor_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDENTE')
    justificativa = models.TextField()
    aprovado_por = models.ForeignKey(UsuarioEmpresa, on_delete=models.SET_NULL, null=True, blank=True, related_name='horas_extras')
    data_aprovacao = models.DateTimeField(null=True, blank=True)
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Hora Extra"
        verbose_name_plural = "Horas Extras"
        ordering = ['-data']
    
    def __str__(self):
        return f"{self.funcionario.nome} - {self.data.strftime('%d/%m/%Y')} - {self.horas}h"
    
    def calcular_valor(self):
        """Calcula o valor total da hora extra"""
        self.valor_total = self.horas * self.valor_hora * (1 + self.percentual_adicional / 100)


class Ferias(models.Model):
    """Gestão de férias"""
    STATUS_CHOICES = [
        ('PROGRAMADA', 'Programada'),
        ('APROVADA', 'Aprovada'),
        ('EM_GOZO', 'Em Gozo'),
        ('CONCLUIDA', 'Concluída'),
        ('CANCELADA', 'Cancelada'),
    ]
    
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='ferias')
    periodo_aquisitivo_inicio = models.DateField()
    periodo_aquisitivo_fim = models.DateField()
    data_inicio = models.DateField()
    data_fim = models.DateField()
    dias_corridos = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(30)])
    dias_abono = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(10)])
    adiantamento_13 = models.BooleanField(default=False)
    valor_ferias = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    valor_abono = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    valor_13_adiantado = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    valor_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PROGRAMADA')
    aprovado_por = models.ForeignKey(UsuarioEmpresa, on_delete=models.SET_NULL, null=True, blank=True, related_name='ferias')
    data_aprovacao = models.DateTimeField(null=True, blank=True)
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Férias"
        verbose_name_plural = "Férias"
        ordering = ['-data_inicio']
    
    def __str__(self):
        return f"{self.funcionario.nome} - {self.data_inicio.strftime('%d/%m/%Y')} a {self.data_fim.strftime('%d/%m/%Y')}"


class DecimoTerceiro(models.Model):
    """Gestão de 13º salário"""
    STATUS_CHOICES = [
        ('CALCULADO', 'Calculado'),
        ('PRIMEIRA_PARCELA_PAGA', 'Primeira Parcela Paga'),
        ('SEGUNDA_PARCELA_PAGA', 'Segunda Parcela Paga'),
        ('PAGO_INTEGRAL', 'Pago Integral'),
    ]
    
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='decimo_terceiro')
    ano_referencia = models.IntegerField()
    meses_trabalhados = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])
    salario_base = models.DecimalField(max_digits=12, decimal_places=2)
    valor_bruto = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    inss = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    irt = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    valor_liquido = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    primeira_parcela = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    segunda_parcela = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    data_pagamento_primeira = models.DateField(null=True, blank=True)
    data_pagamento_segunda = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='CALCULADO')
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "13º Salário"
        verbose_name_plural = "13º Salários"
        ordering = ['-ano_referencia']
        unique_together = ['funcionario', 'ano_referencia']
    
    def __str__(self):
        return f"{self.funcionario.nome} - 13º {self.ano_referencia}"
    
    def calcular_valores(self):
        """Calcula os valores do 13º salário"""
        self.valor_bruto = (self.salario_base / 12) * self.meses_trabalhados
        # Primeira parcela: 50% do bruto (sem descontos)
        self.primeira_parcela = self.valor_bruto / 2
        # Segunda parcela: 50% menos descontos
        self.segunda_parcela = (self.valor_bruto / 2) - self.inss - self.irt
        self.valor_liquido = self.valor_bruto - self.inss - self.irt


class Emprestimo(models.Model):
    """Gestão de empréstimos"""
    STATUS_CHOICES = [
        ('SOLICITADO', 'Solicitado'),
        ('APROVADO', 'Aprovado'),
        ('REJEITADO', 'Rejeitado'),
        ('EM_PAGAMENTO', 'Em Pagamento'),
        ('QUITADO', 'Quitado'),
        ('CANCELADO', 'Cancelado'),
    ]
    
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='emprestimos')
    valor_solicitado = models.DecimalField(max_digits=12, decimal_places=2)
    valor_aprovado = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    numero_parcelas = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(60)])
    valor_parcela = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    taxa_juros = models.DecimalField(max_digits=5, decimal_places=2, default=0, help_text="Taxa de juros mensal (%)")
    valor_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    parcelas_pagas = models.IntegerField(default=0)
    valor_pago = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    saldo_devedor = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    data_solicitacao = models.DateField(auto_now_add=True)
    data_aprovacao = models.DateField(null=True, blank=True)
    data_primeira_parcela = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='SOLICITADO')
    motivo = models.TextField()
    aprovado_por = models.ForeignKey(UsuarioEmpresa, on_delete=models.SET_NULL, null=True, blank=True, related_name='emprestimos')    
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Empréstimo"
        verbose_name_plural = "Empréstimos"
        ordering = ['-data_solicitacao']
    
    def __str__(self):
        return f"{self.funcionario.nome} - {self.valor_solicitado} AOA"
    
    def calcular_parcelas(self):
        if self.valor_aprovado and self.numero_parcelas:
            taxa = self.taxa_juros / 100
            if taxa > 0:
                self.valor_parcela = (self.valor_aprovado * taxa * (1 + taxa) ** self.numero_parcelas) / ((1 + taxa) ** self.numero_parcelas - 1)
            else:
                self.valor_parcela = self.valor_aprovado / self.numero_parcelas
            self.valor_total = self.valor_parcela * self.numero_parcelas
            self.saldo_devedor = self.valor_total


class ParcelaEmprestimo(models.Model):
    """Parcelas de empréstimos"""
    STATUS_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('PAGA', 'Paga'),
        ('ATRASADA', 'Atrasada'),
    ]
    
    emprestimo = models.ForeignKey(Emprestimo, on_delete=models.CASCADE, related_name='parcelas')
    numero_parcela = models.IntegerField()
    valor = models.DecimalField(max_digits=12, decimal_places=2)
    data_vencimento = models.DateField()
    data_pagamento = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDENTE')
    recibo = models.ForeignKey(ReciboPagamento, on_delete=models.SET_NULL, null=True, blank=True, related_name='parcelas_emprestimo')
    
    class Meta:
        verbose_name = "Parcela de Empréstimo"
        verbose_name_plural = "Parcelas de Empréstimos"
        ordering = ['emprestimo', 'numero_parcela']
        unique_together = ['emprestimo', 'numero_parcela']
    
    def __str__(self):
        return f"Parcela {self.numero_parcela}/{self.emprestimo.numero_parcelas} - {self.emprestimo.funcionario.nome}"


class RelatorioFiscal(models.Model):
    """Relatórios fiscais (SEFIP, DIRF, RAIS, etc)"""
    TIPO_CHOICES = [
        ('SEFIP', 'SEFIP'),
        ('DIRF', 'DIRF'),
        ('RAIS', 'RAIS'),
        ('CAGED', 'CAGED'),
        ('ESOCIAL', 'eSocial'),
    ]
    
    STATUS_CHOICES = [
        ('GERADO', 'Gerado'),
        ('ENVIADO', 'Enviado'),
        ('PROCESSANDO', 'Processando'),
    ]
    
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    periodo = models.CharField(max_length=20, help_text="Formato: YYYY-MM ou YYYY")
    data_geracao = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='GERADO')
    total_funcionarios = models.IntegerField(default=0)
    total_remuneracao = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_encargos = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    arquivo_gerado = models.FileField(upload_to='relatorios_fiscais/', null=True, blank=True)
    observacoes = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Relatório Fiscal"
        verbose_name_plural = "Relatórios Fiscais"
        ordering = ['-data_geracao']
    
    def __str__(self):
        return f"{self.tipo} - {self.periodo}"


class RelatorioContabil(models.Model):
    """Relatórios contábeis"""
    TIPO_CHOICES = [
        ('FOLHA_ANALITICA', 'Folha Analítica'),
        ('FOLHA_SINTETICA', 'Folha Sintética'),
        ('PROVISOES', 'Provisões'),
        ('ENCARGOS', 'Encargos Sociais'),
    ]
    
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    periodo = models.CharField(max_length=20, help_text="Formato: YYYY-MM")
    data_geracao = models.DateTimeField(auto_now_add=True)
    total_bruto = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_descontos = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_liquido = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_encargos = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    arquivo_gerado = models.FileField(upload_to='relatorios_contabeis/', null=True, blank=True)
    observacoes = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Relatório Contábil"
        verbose_name_plural = "Relatórios Contábeis"
        ordering = ['-data_geracao']
    
    def __str__(self):
        return f"{self.get_tipo_display()} - {self.periodo}"
class Desconto(models.Model):
    """Modelo para descontos variáveis aplicados aos funcionários"""
    
    TIPO_CHOICES = [
        ('FIXO', 'Valor Fixo'),
        ('PERCENTUAL', 'Percentual'),
        ('VARIAVEL', 'Variável'),
    ]
    
    CATEGORIA_CHOICES = [
        ('OBRIGATORIO', 'Desconto Obrigatório'),
        ('OPCIONAL', 'Desconto Opcional'),
        ('JUDICIAL', 'Desconto Judicial'),
        ('EMPRESTIMO', 'Empréstimo'),
        ('ADIANTO', 'Adiantamento'),
        ('OUTROS', 'Outros Descontos'),
    ]
    
    APLICAVEL_CHOICES = [
        ('TODOS', 'Todos os Funcionários'),
        ('DEPARTAMENTO', 'Por Departamento'),
        ('CARGO', 'Por Cargo'),
        ('INDIVIDUAL', 'Individual'),
    ]
    
    STATUS_CHOICES = [
        ('ATIVO', 'Ativo'),
        ('INATIVO', 'Inativo'),
        ('SUSPENSO', 'Suspenso'),
        ('EXPIRADO', 'Expirado'),
    ]
    
    # Identificação
    nome = models.CharField(max_length=100, help_text="Nome do desconto")
    descricao = models.TextField(blank=True, help_text="Descrição detalhada do desconto")
    
    # Configuração
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='FIXO')
    categoria = models.CharField(max_length=20, choices=CATEGORIA_CHOICES, default='OPCIONAL')
    aplicavel_a = models.CharField(max_length=20, choices=APLICAVEL_CHOICES, default='TODOS')
    
    # Valores
    valor_fixo = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Valor fixo do desconto (se tipo=FIXO)"
    )
    percentual = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Percentual do desconto (se tipo=PERCENTUAL)"
    )
    valor_minimo = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Valor mínimo do desconto"
    )
    valor_maximo = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Valor máximo do desconto"
    )
    
    # Vigência
    data_inicio = models.DateField(help_text="Data de início da vigência")
    data_fim = models.DateField(null=True, blank=True, help_text="Data de fim da vigência (opcional)")
    recorrente = models.BooleanField(default=False, help_text="Desconto recorrente mensalmente")
    
    # Status e controle
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='ATIVO')
    ativo = models.BooleanField(default=True, help_text="Desconto ativo no sistema")
    
    # Aplicação específica
    funcionario = models.ForeignKey(
        Funcionario, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='descontos',
        help_text="Funcionário específico (se aplicavel_a=INDIVIDUAL)"
    )
    departamento_alvo = models.CharField(max_length=100, blank=True, help_text="Departamento alvo")
    cargo_alvo = models.CharField(max_length=100, blank=True, help_text="Cargo alvo")
    
    # Auditoria
    criado_por = models.ForeignKey(UsuarioEmpresa, on_delete=models.SET_NULL, null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Desconto"
        verbose_name_plural = "Descontos"
        ordering = ['-criado_em']
        indexes = [
            models.Index(fields=['status', 'ativo']),
            models.Index(fields=['data_inicio', 'data_fim']),
            models.Index(fields=['tipo', 'categoria']),
        ]
    
    def __str__(self):
        return f"{self.nome} - {self.get_tipo_display()}"
    
    def calcular_valor(self, salario_base=0):
        """Calcula o valor do desconto baseado no tipo e salário"""
        if self.tipo == 'FIXO':
            return self.valor_fixo
        elif self.tipo == 'PERCENTUAL':
            valor_calculado = (salario_base * self.percentual) / 100
            # Aplica limites mínimos e máximos
            if self.valor_minimo and valor_calculado < self.valor_minimo:
                return self.valor_minimo
            if self.valor_maximo and valor_calculado > self.valor_maximo:
                return self.valor_maximo
            return valor_calculado
        return Decimal('0.00')
    
    def esta_vigente(self):
        """Verifica se o desconto está dentro do período de vigência"""
        from django.utils import timezone
        hoje = timezone.now().date()
        
        if self.data_inicio > hoje:
            return False
        if self.data_fim and self.data_fim < hoje:
            return False
        return True
    
    def pode_aplicar(self, funcionario=None):
        """Verifica se o desconto pode ser aplicado a um funcionário"""
        if not self.ativo or not self.esta_vigente():
            return False
        
        if self.aplicavel_a == 'TODOS':
            return True
        elif self.aplicavel_a == 'INDIVIDUAL':
            return funcionario and funcionario == self.funcionario
        elif self.aplicavel_a == 'DEPARTAMENTO':
            return funcionario and funcionario.departamento.nome == self.departamento_alvo
        elif self.aplicavel_a == 'CARGO':
            return funcionario and funcionario.valores.get('cargo', '') == self.cargo_alvo
        
        return False


class Beneficio(models.Model):
    """Modelo para benefícios oferecidos aos funcionários"""
    
    TIPO_CHOICES = [
        ('FIXO', 'Valor Fixo'),
        ('PERCENTUAL', 'Percentual'),
        ('VARIAVEL', 'Variável'),
    ]
    
    CATEGORIA_CHOICES = [
        ('ALIMENTACAO', 'Vale Alimentação'),
        ('TRANSPORTE', 'Vale Transporte'),
        ('SAUDE', 'Plano de Saúde'),
        ('EDUCACAO', 'Auxílio Educação'),
        ('MORADIA', 'Auxílio Moradia'),
        ('OUTROS', 'Outros Benefícios'),
    ]
    
    APLICAVEL_CHOICES = [
        ('TODOS', 'Todos os Funcionários'),
        ('DEPARTAMENTO', 'Por Departamento'),
        ('CARGO', 'Por Cargo'),
        ('INDIVIDUAL', 'Individual'),
    ]
    
    STATUS_CHOICES = [
        ('ATIVO', 'Ativo'),
        ('INATIVO', 'Inativo'),
        ('SUSPENSO', 'Suspenso'),
        ('EXPIRADO', 'Expirado'),
    ]
    
    # Identificação
    nome = models.CharField(max_length=100, help_text="Nome do benefício")
    descricao = models.TextField(blank=True, help_text="Descrição detalhada do benefício")
    
    # Configuração
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='FIXO')
    categoria = models.CharField(max_length=20, choices=CATEGORIA_CHOICES, default='OUTROS')
    aplicavel_a = models.CharField(max_length=20, choices=APLICAVEL_CHOICES, default='TODOS')
    
    # Valores
    valor_fixo = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Valor fixo do benefício (se tipo=FIXO)"
    )
    percentual = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Percentual do benefício (se tipo=PERCENTUAL)"
    )
    valor_minimo = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Valor mínimo do benefício"
    )
    valor_maximo = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Valor máximo do benefício"
    )
    
    # Configurações fiscais
    descontavel_ir = models.BooleanField(default=False, help_text="Descontável do Imposto de Renda")
    descontavel_inss = models.BooleanField(default=False, help_text="Descontável do INSS")
    tributavel = models.BooleanField(default=False, help_text="Benefício tributável")
    
    # Vigência
    data_inicio = models.DateField(help_text="Data de início da vigência")
    data_fim = models.DateField(null=True, blank=True, help_text="Data de fim da vigência (opcional)")
    recorrente = models.BooleanField(default=True, help_text="Benefício recorrente mensalmente")
    
    # Status e controle
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='ATIVO')
    ativo = models.BooleanField(default=True, help_text="Benefício ativo no sistema")
    
    # Aplicação específica
    funcionario = models.ForeignKey(
        Funcionario, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='beneficios',
        help_text="Funcionário específico (se aplicavel_a=INDIVIDUAL)"
    )
    departamento_alvo = models.CharField(max_length=100, blank=True, help_text="Departamento alvo")
    cargo_alvo = models.CharField(max_length=100, blank=True, help_text="Cargo alvo")
    
    # Auditoria
    criado_por = models.ForeignKey(UsuarioEmpresa, on_delete=models.SET_NULL, null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Benefício"
        verbose_name_plural = "Benefícios"
        ordering = ['-criado_em']
        indexes = [
            models.Index(fields=['status', 'ativo']),
            models.Index(fields=['data_inicio', 'data_fim']),
            models.Index(fields=['tipo', 'categoria']),
        ]
    
    def __str__(self):
        return f"{self.nome} - {self.get_categoria_display()}"
    
    def calcular_valor(self, salario_base=0):
        """Calcula o valor do benefício baseado no tipo e salário"""
        if self.tipo == 'FIXO':
            return self.valor_fixo
        elif self.tipo == 'PERCENTUAL':
            valor_calculado = (salario_base * self.percentual) / 100
            # Aplica limites mínimos e máximos
            if self.valor_minimo and valor_calculado < self.valor_minimo:
                return self.valor_minimo
            if self.valor_maximo and valor_calculado > self.valor_maximo:
                return self.valor_maximo
            return valor_calculado
        return Decimal('0.00')
    
    def esta_vigente(self):
        """Verifica se o benefício está dentro do período de vigência"""
        from django.utils import timezone
        hoje = timezone.now().date()
        
        if self.data_inicio > hoje:
            return False
        if self.data_fim and self.data_fim < hoje:
            return False
        return True
    
    def pode_aplicar(self, funcionario=None):
        """Verifica se o benefício pode ser aplicado a um funcionário"""
        if not self.ativo or not self.esta_vigente():
            return False
        
        if self.aplicavel_a == 'TODOS':
            return True
        elif self.aplicavel_a == 'INDIVIDUAL':
            return funcionario and funcionario == self.funcionario
        elif self.aplicavel_a == 'DEPARTAMENTO':
            return funcionario and funcionario.departamento.nome == self.departamento_alvo
        elif self.aplicavel_a == 'CARGO':
            return funcionario and funcionario.valores.get('cargo', '') == self.cargo_alvo
        
        return False
    
    def calcular_impacto_fiscal(self, valor_beneficio):
        """Calcula o impacto fiscal do benefício"""
        impacto = {
            'valor_beneficio': valor_beneficio,
            'desconto_ir': Decimal('0.00'),
            'desconto_inss': Decimal('0.00'),
            'valor_tributavel': Decimal('0.00')
        }
        
        if self.descontavel_ir:
            impacto['desconto_ir'] = valor_beneficio
        if self.descontavel_inss:
            impacto['desconto_inss'] = valor_beneficio
        if self.tributavel:
            impacto['valor_tributavel'] = valor_beneficio
            
        return impacto