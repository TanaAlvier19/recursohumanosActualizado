from decimal import Decimal, ROUND_HALF_UP
from datetime import date, datetime
from dateutil.relativedelta import relativedelta

class CalculadoraAngola:
    """
    Calculadora de folha de pagamento específica para Angola
    Conforme legislação fiscal e laboral angolana
    """
    
    @staticmethod
    def calcular_irt(salario_tributavel, num_dependentes=0):
        """
        Calcula IRT conforme tabela 2024 de Angola
        Escalões atualizados conforme Decreto Presidencial n.º 80/23
        """
        # Dedução por dependente (15.000 AOA por dependente)
        deducao_dependentes = Decimal('15000') * num_dependentes
        base_calculo = max(salario_tributavel - deducao_dependentes, Decimal('0'))
        
        # Tabela IRT 2024
        escaloes = [
            (Decimal('0'), Decimal('70000'), Decimal('0.00'), Decimal('0')),
            (Decimal('70000'), Decimal('100000'), Decimal('0.10'), Decimal('7000')),
            (Decimal('100000'), Decimal('150000'), Decimal('0.13'), Decimal('10000')),
            (Decimal('150000'), Decimal('200000'), Decimal('0.16'), Decimal('14500')),
            (Decimal('200000'), Decimal('300000'), Decimal('0.19'), Decimal('20500')),
            (Decimal('300000'), Decimal('500000'), Decimal('0.22'), Decimal('29500')),
            (Decimal('500000'), Decimal('1000000'), Decimal('0.25'), Decimal('42500')),
            (Decimal('1000000'), Decimal('1500000'), Decimal('0.28'), Decimal('67500')),
            (Decimal('1500000'), Decimal('2000000'), Decimal('0.31'), Decimal('97500')),
            (Decimal('2000000'), Decimal('2500000'), Decimal('0.34'), Decimal('132500')),
            (Decimal('2500000'), Decimal('5000000'), Decimal('0.37'), Decimal('172500')),
            (Decimal('5000000'), None, Decimal('0.40'), Decimal('247500')),
        ]
        
        irt = Decimal('0')
        for escalao in escaloes:
            limite_inferior, limite_superior, taxa, deducao = escalao
            
            if limite_superior is None or base_calculo <= limite_superior:
                if base_calculo > limite_inferior:
                    irt = (base_calculo * taxa) - deducao
                break
        
        return max(irt, Decimal('0'))
    
    @staticmethod
    def calcular_inss(salario_bruto, percentual_trabalhador=3):
        """
        Calcula contribuição para INSS
        Trabalhador: 3% | Empresa: 8%
        """
        # Teto máximo para INSS (salário de referência)
        teto_inss = Decimal('1000000')  # 1.000.000 AOA
        
        base_calculo = min(salario_bruto, teto_inss)
        inss_trabalhador = (base_calculo * Decimal(percentual_trabalhador)) / Decimal('100')
        inss_empresa = (base_calculo * Decimal('8')) / Decimal('100')
        
        return {
            'trabalhador': inss_trabalhador,
            'empresa': inss_empresa,
            'base_calculo': base_calculo
        }
    
    @staticmethod
    def calcular_salario_liquido(
        salario_base,
        horas_extras=0,
        bonus=0,
        subsidio_alimentacao=0,
        subsidio_transporte=0,
        outros_vencimentos=0,
        num_dependentes=0,
        emprestimos=0,
        outros_descontos=0
    ):
        """Calcula salário líquido conforme legislação angolana"""
        
        # Vencimentos totais
        total_vencimentos = (
            Decimal(str(salario_base)) +
            Decimal(str(horas_extras)) +
            Decimal(str(bonus)) +
            Decimal(str(outros_vencimentos))
        )
        
        # Subsídios (não tributáveis até certo limite)
        subsidio_alimentacao = Decimal(str(subsidio_alimentacao))
        subsidio_transporte = Decimal(str(subsidio_transporte))
        
        # Base para IRT (subsídios têm tratamento fiscal diferente)
        base_irt = total_vencimentos
        
        # Cálculo de impostos
        irt = CalculadoraAngola.calcular_irt(base_irt, num_dependentes)
        inss = CalculadoraAngola.calcular_inss(total_vencimentos)
        
        # Descontos totais
        total_descontos = (
            irt +
            inss['trabalhador'] +
            Decimal(str(emprestimos)) +
            Decimal(str(outros_descontos))
        )
        
        salario_liquido = (
            total_vencimentos +
            subsidio_alimentacao +
            subsidio_transporte -
            total_descontos
        )
        
        custo_empresa = (
            total_vencimentos +
            subsidio_alimentacao +
            subsidio_transporte +
            inss['empresa']
        )
        
        return {
            'salario_base': Decimal(str(salario_base)),
            'total_vencimentos': total_vencimentos,
            'subsidio_alimentacao': subsidio_alimentacao,
            'subsidio_transporte': subsidio_transporte,
            'base_calculo_irt': base_irt,
            'irt': irt,
            'inss_trabalhador': inss['trabalhador'],
            'inss_empresa': inss['empresa'],
            'total_descontos': total_descontos,
            'salario_liquido': salario_liquido,
            'custo_total_empresa': custo_empresa,
            'num_dependentes': num_dependentes
        }
    
    @staticmethod
    def calcular_rescisao(salario_base, data_admissao, data_rescisao, 
                         tipo_rescisao='sem_justa_causa', saldo_ferias_dias=0):
        """
        """
        if isinstance(data_admissao, str):
            data_admissao = datetime.strptime(data_admissao, '%Y-%m-%d').date()
        if isinstance(data_rescisao, str):
            data_rescisao = datetime.strptime(data_rescisao, '%Y-%m-%d').date()
        
        salario = Decimal(str(salario_base))
        tempo_servico = relativedelta(data_rescisao, data_admissao)
        
        # Saldo de salário
        dias_mes = 30  # Considerando mês comercial
        dias_trabalhados = data_rescisao.day
        saldo_salario = (salario / dias_mes) * dias_trabalhados
        
        # Férias proporcionais
        meses_trabalhados_ano = tempo_servico.years * 12 + tempo_servico.months
        dias_ferias_proporcionais = (meses_trabalhados_ano * 30) / 12
        ferias_proporcionais = (salario / 30) * dias_ferias_proporcionais
        
        # 13º salário proporcional
        decimo_terceiro = (salario / 12) * meses_trabalhados_ano
        
        # Indenização
        if tipo_rescisao == 'sem_justa_causa':
            anos_trabalhados = tempo_servico.years + tempo_servico.months / 12
            indenizacao = salario * Decimal(str(min(anos_trabalhados, 12)))  # Máximo 12 salários
        else:
            indenizacao = Decimal('0')
        
        total_rescisao = (
            saldo_salario +
            ferias_proporcionais +
            decimo_terceiro +
            indenizacao
        )
        
        return {
            'saldo_salario': saldo_salario,
            'ferias_proporcionais': ferias_proporcionais,
            'decimo_terceiro': decimo_terceiro,
            'indenizacao': indenizacao,
            'total_rescisao': total_rescisao,
            'tempo_servico_anos': tempo_servico.years,
            'tempo_servico_meses': tempo_servico.months
        }