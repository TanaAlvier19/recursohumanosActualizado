from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal

class Departamento(models.Model):
    nome = models.CharField(max_length=100)
    codigo = models.CharField(max_length=20, unique=True)
    descricao = models.TextField(blank=True)
    responsavel = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='departamentos_responsavel')
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'departamentos'
        ordering = ['nome']

    def __str__(self):
        return self.nome


# ==================== FUNCIONÁRIOS ====================
class Funcionario(models.Model):
    TIPO_CONTRATO_CHOICES = [
        ('CLT', 'CLT'),
        ('PJ', 'PJ'),
        ('Estagiario', 'Estagiário'),
        ('Temporario', 'Temporário'),
    ]

    STATUS_CHOICES = [
        ('Ativo', 'Ativo'),
        ('Ferias', 'Férias'),
        ('Afastado', 'Afastado'),
        ('Desligado', 'Desligado'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='funcionario')
    matricula = models.CharField(max_length=20, unique=True)
    departamento = models.ForeignKey(Departamento, on_delete=models.SET_NULL, null=True, related_name='funcionarios')
    cargo = models.CharField(max_length=100)
    tipo_contrato = models.CharField(max_length=20, choices=TIPO_CONTRATO_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Ativo')
    data_admissao = models.DateField()
    data_demissao = models.DateField(null=True, blank=True)
    salario_base = models.DecimalField(max_digits=10, decimal_places=2)
    cpf = models.CharField(max_length=14, unique=True)
    rg = models.CharField(max_length=20)
    data_nascimento = models.DateField()
    telefone = models.CharField(max_length=20)
    endereco = models.TextField()
    foto = models.ImageField(upload_to='funcionarios/', null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'funcionarios'
        ordering = ['user__first_name']

    def __str__(self):
        return f"{self.matricula} - {self.user.get_full_name()}"


# ==================== FOLHA DE PAGAMENTO ====================
class FolhaPagamento(models.Model):
    STATUS_CHOICES = [
        ('Pendente', 'Pendente'),
        ('Processando', 'Processando'),
        ('Aprovada', 'Aprovada'),
        ('Paga', 'Paga'),
    ]

    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='folhas_pagamento')
    mes = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])
    ano = models.IntegerField()
    salario_base = models.DecimalField(max_digits=10, decimal_places=2)
    horas_extras = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    vale_transporte = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    vale_refeicao = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    plano_saude = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    inss = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    irrf = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    outros_descontos = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    salario_liquido = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendente')
    data_pagamento = models.DateField(null=True, blank=True)
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'folhas_pagamento'
        unique_together = ['funcionario', 'mes', 'ano']
        ordering = ['-ano', '-mes']

    def __str__(self):
        return f"{self.funcionario.matricula} - {self.mes}/{self.ano}"

    def calcular_salario_liquido(self):
        proventos = self.salario_base + self.horas_extras + self.bonus
        descontos = self.inss + self.irrf + self.outros_descontos
        self.salario_liquido = proventos - descontos
        return self.salario_liquido


# ==================== ASSIDUIDADE ====================
class RegistroPonto(models.Model):
    TIPO_CHOICES = [
        ('Entrada', 'Entrada'),
        ('Saida', 'Saída'),
        ('Intervalo_Inicio', 'Início Intervalo'),
        ('Intervalo_Fim', 'Fim Intervalo'),
    ]

    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='registros_ponto')
    data = models.DateField()
    hora = models.TimeField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    localizacao = models.CharField(max_length=200, blank=True)
    observacao = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'registros_ponto'
        ordering = ['-data', '-hora']

    def __str__(self):
        return f"{self.funcionario.matricula} - {self.data} {self.hora}"


class Dispensa(models.Model):
    TIPO_CHOICES = [
        ('Ferias', 'Férias'),
        ('Atestado', 'Atestado Médico'),
        ('Licenca', 'Licença'),
        ('Falta', 'Falta'),
        ('Folga', 'Folga'),
    ]

    STATUS_CHOICES = [
        ('Pendente', 'Pendente'),
        ('Aprovada', 'Aprovada'),
        ('Rejeitada', 'Rejeitada'),
    ]

    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='dispensas')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    data_inicio = models.DateField()
    data_fim = models.DateField()
    motivo = models.TextField()
    documento = models.FileField(upload_to='dispensas/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendente')
    aprovado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='dispensas_aprovadas')
    data_aprovacao = models.DateTimeField(null=True, blank=True)
    observacao_aprovacao = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'dispensas'
        ordering = ['-data_inicio']

    def __str__(self):
        return f"{self.funcionario.matricula} - {self.tipo} ({self.data_inicio} a {self.data_fim})"


class Instrutor(models.Model):
    TIPO_CHOICES = [
        ('Interno', 'Interno'),
        ('Externo', 'Externo'),
    ]

    nome = models.CharField(max_length=200)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    funcionario = models.ForeignKey(Funcionario, on_delete=models.SET_NULL, null=True, blank=True, related_name='instrutor_perfil')
    email = models.EmailField()
    telefone = models.CharField(max_length=20)
    especialidades = models.TextField()
    biografia = models.TextField(blank=True)
    avaliacao_media = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_formacoes = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'instrutores'
        ordering = ['nome']

    def __str__(self):
        return f"{self.nome} ({self.tipo})"


class Formacao(models.Model):
    TIPO_CHOICES = [
        ('Presencial', 'Presencial'),
        ('Online', 'Online'),
        ('Hibrido', 'Híbrido'),
        ('EAD', 'EAD'),
    ]

    STATUS_CHOICES = [
        ('Planejada', 'Planejada'),
        ('Inscricoes_Abertas', 'Inscrições Abertas'),
        ('Em_Andamento', 'Em Andamento'),
        ('Concluida', 'Concluída'),
        ('Cancelada', 'Cancelada'),
    ]

    CATEGORIA_CHOICES = [
        ('Tecnica', 'Técnica'),
        ('Comportamental', 'Comportamental'),
        ('Lideranca', 'Liderança'),
        ('Compliance', 'Compliance'),
        ('Idiomas', 'Idiomas'),
        ('Seguranca', 'Segurança'),
    ]

    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    categoria = models.CharField(max_length=30, choices=CATEGORIA_CHOICES)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    instrutor = models.ForeignKey(Instrutor, on_delete=models.SET_NULL, null=True, related_name='formacoes')
    carga_horaria = models.IntegerField()
    data_inicio = models.DateField()
    data_fim = models.DateField()
    horario = models.CharField(max_length=100)
    local = models.CharField(max_length=200, blank=True)
    link_online = models.URLField(blank=True)
    vagas_totais = models.IntegerField()
    vagas_disponiveis = models.IntegerField()
    custo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    obrigatoria = models.BooleanField(default=False)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Planejada')
    conteudo_programatico = models.TextField(blank=True)
    requisitos = models.TextField(blank=True)
    material_apoio = models.FileField(upload_to='formacoes/materiais/', null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'formacoes'
        ordering = ['-data_inicio']

    def __str__(self):
        return self.titulo


class InscricaoFormacao(models.Model):
    STATUS_CHOICES = [
        ('Pendente', 'Pendente'),
        ('Aprovada', 'Aprovada'),
        ('Rejeitada', 'Rejeitada'),
        ('Concluida', 'Concluída'),
        ('Cancelada', 'Cancelada'),
    ]

    formacao = models.ForeignKey(Formacao, on_delete=models.CASCADE, related_name='inscricoes')
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='inscricoes_formacao')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendente')
    data_inscricao = models.DateTimeField(auto_now_add=True)
    aprovado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='inscricoes_aprovadas')
    data_aprovacao = models.DateTimeField(null=True, blank=True)
    nota_final = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    frequencia = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    avaliacao_instrutor = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    feedback = models.TextField(blank=True)
    certificado = models.FileField(upload_to='formacoes/certificados/', null=True, blank=True)
    data_conclusao = models.DateField(null=True, blank=True)
    observacoes = models.TextField(blank=True)

    class Meta:
        db_table = 'inscricoes_formacao'
        unique_together = ['formacao', 'funcionario']
        ordering = ['-data_inscricao']

    def __str__(self):
        return f"{self.funcionario.matricula} - {self.formacao.titulo}"


class Competencia(models.Model):
    TIPO_CHOICES = [
        ('Tecnica', 'Técnica'),
        ('Comportamental', 'Comportamental'),
        ('Lideranca', 'Liderança'),
    ]

    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    tipo = models.CharField(max_length=30, choices=TIPO_CHOICES)
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'competencias'
        ordering = ['nome']

    def __str__(self):
        return self.nome


class AvaliacaoCompetencia(models.Model):
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='avaliacoes_competencia')
    competencia = models.ForeignKey(Competencia, on_delete=models.CASCADE, related_name='avaliacoes')
    nivel_atual = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    nivel_esperado = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    data_avaliacao = models.DateField()
    avaliador = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='avaliacoes_realizadas')
    observacoes = models.TextField(blank=True)

    class Meta:
        db_table = 'avaliacoes_competencia'
        ordering = ['-data_avaliacao']

    def __str__(self):
        return f"{self.funcionario.matricula} - {self.competencia.nome}"


class PDI(models.Model):
    STATUS_CHOICES = [
        ('Ativo', 'Ativo'),
        ('Concluido', 'Concluído'),
        ('Cancelado', 'Cancelado'),
    ]

    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='pdis')
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    data_inicio = models.DateField()
    data_fim = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Ativo')
    progresso = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    criado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='pdis_criados')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pdis'
        ordering = ['-data_inicio']

    def __str__(self):
        return f"{self.funcionario.matricula} - {self.titulo}"


class ObjetivoPDI(models.Model):
    STATUS_CHOICES = [
        ('Pendente', 'Pendente'),
        ('Em_Andamento', 'Em Andamento'),
        ('Concluido', 'Concluído'),
    ]

    pdi = models.ForeignKey(PDI, on_delete=models.CASCADE, related_name='objetivos')
    descricao = models.TextField()
    prazo = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendente')
    progresso = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    observacoes = models.TextField(blank=True)

    class Meta:
        db_table = 'objetivos_pdi'
        ordering = ['prazo']

    def __str__(self):
        return f"{self.pdi.funcionario.matricula} - {self.descricao[:50]}"


class Vaga(models.Model):
    STATUS_CHOICES = [
        ('Aberta', 'Aberta'),
        ('Em_Andamento', 'Em Andamento'),
        ('Pausada', 'Pausada'),
        ('Fechada', 'Fechada'),
        ('Cancelada', 'Cancelada'),
    ]

    TIPO_CHOICES = [
        
        ('Estagio', 'Estágio'),
        ('Temporario', 'Temporário'),
    ]

    PRIORIDADE_CHOICES = [
        ('Baixa', 'Baixa'),
        ('Media', 'Média'),
        ('Alta', 'Alta'),
        ('Urgente', 'Urgente'),
    ]

    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    departamento = models.ForeignKey(Departamento, on_delete=models.SET_NULL, null=True, related_name='vagas')
    tipo_contrato = models.CharField(max_length=20, choices=TIPO_CHOICES)
    localizacao = models.CharField(max_length=200)
    salario_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salario_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    requisitos = models.TextField()
    beneficios = models.TextField(blank=True)
    responsabilidades = models.TextField()
    numero_vagas = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Aberta')
    prioridade = models.CharField(max_length=20, choices=PRIORIDADE_CHOICES, default='Media')
    data_abertura = models.DateField(auto_now_add=True)
    data_fechamento = models.DateField(null=True, blank=True)
    prazo_candidatura = models.DateField()
    responsavel = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='vagas_responsavel')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vagas'
        ordering = ['-data_abertura']

    def __str__(self):
        return self.titulo


class Candidato(models.Model):
    nome = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=20)
    cpf = models.CharField(max_length=14, unique=True, null=True, blank=True)
    data_nascimento = models.DateField(null=True, blank=True)
    endereco = models.TextField(blank=True)
    linkedin = models.URLField(blank=True)
    portfolio = models.URLField(blank=True)
    curriculo = models.FileField(upload_to='candidatos/curriculos/')
    foto = models.ImageField(upload_to='candidatos/fotos/', null=True, blank=True)
    experiencia_anos = models.IntegerField(null=True, blank=True)
    formacao_academica = models.TextField(blank=True)
    habilidades = models.TextField(blank=True)
    pretensao_salarial = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    disponibilidade = models.CharField(max_length=100, blank=True)
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'candidatos'
        ordering = ['nome']

    def __str__(self):
        return f"{self.nome} - {self.email}"


class Candidatura(models.Model):
    STATUS_CHOICES = [
        ('Nova', 'Nova'),
        ('Triagem', 'Triagem'),
        ('Entrevista_RH', 'Entrevista RH'),
        ('Teste_Tecnico', 'Teste Técnico'),
        ('Entrevista_Tecnica', 'Entrevista Técnica'),
        ('Proposta', 'Proposta'),
        ('Aprovado', 'Aprovado'),
        ('Reprovado', 'Reprovado'),
        ('Desistiu', 'Desistiu'),
    ]

    vaga = models.ForeignKey(Vaga, on_delete=models.CASCADE, related_name='candidaturas')
    candidato = models.ForeignKey(Candidato, on_delete=models.CASCADE, related_name='candidaturas')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Nova')
    data_candidatura = models.DateTimeField(auto_now_add=True)
    carta_apresentacao = models.TextField(blank=True)
    fonte_recrutamento = models.CharField(max_length=100, blank=True)
    score = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    observacoes = models.TextField(blank=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'candidaturas'
        unique_together = ['vaga', 'candidato']
        ordering = ['-data_candidatura']

    def __str__(self):
        return f"{self.candidato.nome} - {self.vaga.titulo}"


class Entrevista(models.Model):
    TIPO_CHOICES = [
        ('RH', 'RH'),
        ('Tecnica', 'Técnica'),
        ('Comportamental', 'Comportamental'),
        ('Final', 'Final'),
    ]

    STATUS_CHOICES = [
        ('Agendada', 'Agendada'),
        ('Confirmada', 'Confirmada'),
        ('Realizada', 'Realizada'),
        ('Cancelada', 'Cancelada'),
        ('Remarcada', 'Remarcada'),
    ]

    FORMATO_CHOICES = [
        ('Presencial', 'Presencial'),
        ('Online', 'Online'),
    ]

    candidatura = models.ForeignKey(Candidatura, on_delete=models.CASCADE, related_name='entrevistas')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    formato = models.CharField(max_length=20, choices=FORMATO_CHOICES)
    data = models.DateField()
    hora = models.TimeField()
    duracao_minutos = models.IntegerField(default=60)
    local = models.CharField(max_length=200, blank=True)
    link_online = models.URLField(blank=True)
    entrevistador = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='entrevistas_realizadas')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Agendada')
    feedback = models.TextField(blank=True)
    nota = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)], null=True, blank=True)
    pontos_fortes = models.TextField(blank=True)
    pontos_fracos = models.TextField(blank=True)
    recomendacao = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'entrevistas'
        ordering = ['-data', '-hora']

    def __str__(self):
        return f"{self.candidatura.candidato.nome} - {self.tipo} ({self.data})"


class TesteTecnico(models.Model):
    STATUS_CHOICES = [
        ('Enviado', 'Enviado'),
        ('Em_Andamento', 'Em Andamento'),
        ('Concluido', 'Concluído'),
        ('Avaliado', 'Avaliado'),
        ('Expirado', 'Expirado'),
    ]

    candidatura = models.ForeignKey(Candidatura, on_delete=models.CASCADE, related_name='testes')
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    instrucoes = models.TextField()
    data_envio = models.DateTimeField(auto_now_add=True)
    prazo_entrega = models.DateTimeField()
    data_conclusao = models.DateTimeField(null=True, blank=True)
    link_teste = models.URLField(blank=True)
    arquivo_teste = models.FileField(upload_to='testes/enviados/', null=True, blank=True)
    arquivo_resposta = models.FileField(upload_to='testes/respostas/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Enviado')
    nota = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    feedback = models.TextField(blank=True)
    avaliado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='testes_avaliados')
    data_avaliacao = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'testes_tecnicos'
        ordering = ['-data_envio']

    def __str__(self):
        return f"{self.candidatura.candidato.nome} - {self.titulo}"


class AvaliacaoDesempenho(models.Model):
    STATUS_CHOICES = [
        ('Pendente', 'Pendente'),
        ('Em_Andamento', 'Em Andamento'),
        ('Concluida', 'Concluída'),
    ]

    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='avaliacoes_desempenho')
    avaliador = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='avaliacoes_realizadas_desempenho')
    periodo_inicio = models.DateField()
    periodo_fim = models.DateField()
    data_avaliacao = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendente')
    nota_final = models.DecimalField(max_digits=3, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(10)])
    pontos_fortes = models.TextField()
    pontos_melhoria = models.TextField()
    objetivos_alcancados = models.TextField()
    plano_acao = models.TextField()
    comentarios_avaliador = models.TextField(blank=True)
    comentarios_funcionario = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'avaliacoes_desempenho'
        ordering = ['-data_avaliacao']

    def __str__(self):
        return f"{self.funcionario.matricula} - {self.periodo_inicio} a {self.periodo_fim}"


class CriterioAvaliacao(models.Model):
    avaliacao = models.ForeignKey(AvaliacaoDesempenho, on_delete=models.CASCADE, related_name='criterios')
    competencia = models.ForeignKey(Competencia, on_delete=models.CASCADE)
    nota = models.DecimalField(max_digits=3, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(10)])
    observacao = models.TextField(blank=True)

    class Meta:
        db_table = 'criterios_avaliacao'
        unique_together = ['avaliacao', 'competencia']

    def __str__(self):
        return f"{self.avaliacao.funcionario.matricula} - {self.competencia.nome}"


class TicketSuporte(models.Model):
    CATEGORIA_CHOICES = [
        ('Tecnico', 'Técnico'),
        ('RH', 'RH'),
        ('Financeiro', 'Financeiro'),
        ('Acesso', 'Acesso'),
        ('Outro', 'Outro'),
    ]

    PRIORIDADE_CHOICES = [
        ('Baixa', 'Baixa'),
        ('Media', 'Média'),
        ('Alta', 'Alta'),
        ('Urgente', 'Urgente'),
    ]

    STATUS_CHOICES = [
        ('Aberto', 'Aberto'),
        ('Em_Atendimento', 'Em Atendimento'),
        ('Aguardando', 'Aguardando Resposta'),
        ('Resolvido', 'Resolvido'),
        ('Fechado', 'Fechado'),
    ]

    numero = models.CharField(max_length=20, unique=True)
    solicitante = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets_abertos')
    categoria = models.CharField(max_length=20, choices=CATEGORIA_CHOICES)
    prioridade = models.CharField(max_length=20, choices=PRIORIDADE_CHOICES, default='Media')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Aberto')
    assunto = models.CharField(max_length=200)
    descricao = models.TextField()
    anexo = models.FileField(upload_to='tickets/', null=True, blank=True)
    atendente = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets_atendidos')
    data_abertura = models.DateTimeField(auto_now_add=True)
    data_atendimento = models.DateTimeField(null=True, blank=True)
    data_resolucao = models.DateTimeField(null=True, blank=True)
    data_fechamento = models.DateTimeField(null=True, blank=True)
    tempo_resposta_minutos = models.IntegerField(null=True, blank=True)
    tempo_resolucao_minutos = models.IntegerField(null=True, blank=True)
    avaliacao = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tickets_suporte'
        ordering = ['-data_abertura']

    def __str__(self):
        return f"{self.numero} - {self.assunto}"


class RespostaTicket(models.Model):
    ticket = models.ForeignKey(TicketSuporte, on_delete=models.CASCADE, related_name='respostas')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    mensagem = models.TextField()
    anexo = models.FileField(upload_to='tickets/respostas/', null=True, blank=True)
    interno = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'respostas_ticket'
        ordering = ['criado_em']

    def __str__(self):
        return f"{self.ticket.numero} - Resposta de {self.usuario.username}"


class ConfiguracaoSistema(models.Model):
    chave = models.CharField(max_length=100, unique=True)
    valor = models.TextField()
    descricao = models.TextField(blank=True)
    tipo = models.CharField(max_length=20, default='string')
    atualizado_em = models.DateTimeField(auto_now=True)
    atualizado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'configuracoes_sistema'
        ordering = ['chave']

    def __str__(self):
        return self.chave
