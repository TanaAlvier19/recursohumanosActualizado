"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MetricCard } from "@/components/metrcCard"
import { Calculator, TrendingUp, DollarSign, AlertCircle, FileText, Percent } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://recursohumanosactualizado.onrender.com"

interface ResultadoFolha {
  salario_bruto: number
  inss: number
  irt: number
  total_descontos: number
  salario_liquido: number
  deducao_dependentes: number
}

interface ResultadoRescisao {
  saldo_salario: number
  aviso_previo: number
  ferias_proporcionais: number
  terco_ferias: number
  decimo_terceiro: number
  multa_fgts: number
  total_rescisao: number
}

interface ResultadoReajuste {
  folha_atual: number
  nova_folha: number
  aumento_total: number
  aumento_por_funcionario: number
  custo_anual: number
  percentual: number
}

interface ResultadoCusto {
  salario: number
  inss_patronal: number
  fgts: number
  ferias_provisao: number
  terco_ferias: number
  decimo_provisao: number
  encargos_total: number
  custo_mensal: number
  custo_anual: number
}

const SimuladoresPage = () => {
  const [salarioBase, setSalarioBase] = useState("750000")
  const [horasExtras, setHorasExtras] = useState("0")
  const [comissoes, setComissoes] = useState("0")
  const [bonus, setBonus] = useState("0")
  const [dependentes, setDependentes] = useState("0")
  const [resultadoFolha, setResultadoFolha] = useState<ResultadoFolha | null>(null)

  const [salarioRescisao, setSalarioRescisao] = useState("750000")
  const [mesesTrabalhados, setMesesTrabalhados] = useState("12")
  const [tipoRescisao, setTipoRescisao] = useState<"SEM_JUSTA_CAUSA" | "COM_JUSTA_CAUSA" | "PEDIDO_DEMISSAO">(
    "SEM_JUSTA_CAUSA",
  )
  const [diasFeriasVencidas, setDiasFeriasVencidas] = useState("0")
  const [saldoFGTS, setSaldoFGTS] = useState("5000000")
  const [resultadoRescisao, setResultadoRescisao] = useState<ResultadoRescisao | null>(null)

  const [folhaAtual, setFolhaAtual] = useState("125000000")
  const [percentualReajuste, setPercentualReajuste] = useState([5])
  const [numeroFuncionarios, setNumeroFuncionarios] = useState("150")
  const [resultadoReajuste, setResultadoReajuste] = useState<ResultadoReajuste | null>(null)

  const [salarioContratacao, setSalarioContratacao] = useState("750000")
  const [cargoContratacao, setCargoContratacao] = useState("CLT")
  const [resultadoCusto, setResultadoCusto] = useState<ResultadoCusto | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(value)
  }

  // Simular Folha
  const simularFolha = async () => {
    try {
      const response = await fetch(`${API_URL}/api/simuladores/folha/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          salario_base: salarioBase,
          horas_extras: horasExtras,
          comissoes: comissoes,
          bonus: bonus,
          dependentes: dependentes,
        }),
      })
      const data = await response.json()
      setResultadoFolha(data)
    } catch (error) {
      console.error("Erro ao simular folha:", error)
    }
  }

  // Simular Rescisão
  const simularRescisao = async () => {
    try {
      const response = await fetch(`${API_URL}/api/simuladores/rescisao/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          salario: salarioRescisao,
          meses_trabalhados: mesesTrabalhados,
          tipo_rescisao: tipoRescisao,
          dias_ferias_vencidas: diasFeriasVencidas,
          saldo_fgts: saldoFGTS,
        }),
      })
      const data = await response.json()
      setResultadoRescisao(data)
    } catch (error) {
      console.error("Erro ao simular rescisão:", error)
    }
  }

  // Simular Reajuste
  const simularReajuste = async () => {
    try {
      const response = await fetch(`${API_URL}/api/simuladores/reajuste/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          folha_atual: folhaAtual,
          percentual_reajuste: percentualReajuste[0],
          numero_funcionarios: numeroFuncionarios,
        }),
      })
      const data = await response.json()
      setResultadoReajuste(data)
    } catch (error) {
      console.error("Erro ao simular reajuste:", error)
    }
  }

  const simularCusto = async () => {
    try {
      const response = await fetch(`${API_URL}/api/simuladores/custo-contratacao/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          salario: salarioContratacao,
          tipo_contratacao: cargoContratacao,
        }),
      })
      const data = await response.json()
      setResultadoCusto(data)
    } catch (error) {
      console.error("Erro ao simular custo:", error)
    }
  }

  // Simular automaticamente quando os valores mudarem
  useEffect(() => {
    simularFolha()
  }, [salarioBase, horasExtras, comissoes, bonus, dependentes])

  useEffect(() => {
    simularRescisao()
  }, [salarioRescisao, mesesTrabalhados, tipoRescisao, diasFeriasVencidas, saldoFGTS])

  useEffect(() => {
    simularReajuste()
  }, [folhaAtual, percentualReajuste, numeroFuncionarios])

  useEffect(() => {
    simularCusto()
  }, [salarioContratacao, cargoContratacao])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Simuladores de Folha
          </h1>
          <p className="text-lg text-slate-300">
            Simule folha de pagamento, rescisões, reajustes e custos de contratação
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Simulador de Folha"
          value={resultadoFolha ? formatCurrency(resultadoFolha.salario_liquido) : "Calculando..."}
          icon={Calculator}
          description="Salário líquido estimado"
        />
        <MetricCard
          title="Simulador de Rescisão"
          value={resultadoRescisao ? formatCurrency(resultadoRescisao.total_rescisao) : "Calculando..."}
          icon={FileText}
          description="Total da rescisão"
        />
        <MetricCard
          title="Impacto de Reajuste"
          value={resultadoReajuste ? formatCurrency(resultadoReajuste.aumento_total) : "Calculando..."}
          icon={TrendingUp}
          description={`${percentualReajuste[0]}% de aumento`}
        />
        <MetricCard
          title="Custo de Contratação"
          value={resultadoCusto ? formatCurrency(resultadoCusto.custo_mensal) : "Calculando..."}
          icon={DollarSign}
          description="Custo mensal total"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="folha" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
          <TabsTrigger value="folha" className="text-slate-300 data-[state=active]:bg-slate-700">
            <Calculator className="h-4 w-4 mr-2" />
            Folha
          </TabsTrigger>
          <TabsTrigger value="rescisao" className="text-slate-300 data-[state=active]:bg-slate-700">
            <FileText className="h-4 w-4 mr-2" />
            Rescisão
          </TabsTrigger>
          <TabsTrigger value="reajuste" className="text-slate-300 data-[state=active]:bg-slate-700">
            <TrendingUp className="h-4 w-4 mr-2" />
            Reajuste
          </TabsTrigger>
          <TabsTrigger value="contratacao" className="text-slate-300 data-[state=active]:bg-slate-700">
            <DollarSign className="h-4 w-4 mr-2" />
            Contratação
          </TabsTrigger>
        </TabsList>

        {/* Simulador de Folha Tab */}
        <TabsContent value="folha" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-cyan-400" />
                  Simulador de Folha de Pagamento
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Calcule o salário líquido com base nos vencimentos e descontos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Salário Base</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 750000"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={salarioBase}
                    onChange={(e) => setSalarioBase(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Horas Extras</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 50000"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={horasExtras}
                    onChange={(e) => setHorasExtras(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Comissões</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 30000"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={comissoes}
                    onChange={(e) => setComissoes(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Bônus</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 20000"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Número de Dependentes</Label>
                  <Select value={dependentes} onValueChange={setDependentes}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="0">0 dependentes</SelectItem>
                      <SelectItem value="1">1 dependente</SelectItem>
                      <SelectItem value="2">2 dependentes</SelectItem>
                      <SelectItem value="3">3 dependentes</SelectItem>
                      <SelectItem value="4">4+ dependentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Resultados */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Resultado da Simulação</CardTitle>
                <CardDescription className="text-slate-400">Cálculo detalhado do salário</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {resultadoFolha ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">Salário Base</span>
                        <span className="font-semibold text-white">{formatCurrency(Number(salarioBase))}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">Horas Extras</span>
                        <span className="font-semibold text-white">{formatCurrency(Number(horasExtras))}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">Comissões</span>
                        <span className="font-semibold text-white">{formatCurrency(Number(comissoes))}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">Bônus</span>
                        <span className="font-semibold text-white">{formatCurrency(Number(bonus))}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-600 pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">Salário Bruto</span>
                        <span className="font-bold text-white text-lg">
                          {formatCurrency(resultadoFolha.salario_bruto)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-red-400">
                        <span>INSS (11%)</span>
                        <span>-{formatCurrency(resultadoFolha.inss)}</span>
                      </div>
                      <div className="flex justify-between items-center text-red-400">
                        <span>IRT (15%)</span>
                        <span>-{formatCurrency(resultadoFolha.irt)}</span>
                      </div>
                      {resultadoFolha.deducao_dependentes > 0 && (
                        <div className="flex justify-between items-center text-green-400">
                          <span>Dedução Dependentes</span>
                          <span>-{formatCurrency(resultadoFolha.deducao_dependentes)}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-600 pt-4">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30">
                        <span className="font-bold text-white text-lg">Salário Líquido</span>
                        <span className="font-bold text-green-400 text-2xl">
                          {formatCurrency(resultadoFolha.salario_liquido)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-400 py-8">Calculando...</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Simulador de Rescisão Tab */}
        <TabsContent value="rescisao" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-400" />
                  Simulador de Rescisão
                </CardTitle>
                <CardDescription className="text-slate-400">Calcule os valores de rescisão contratual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Salário Base</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 750000"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={salarioRescisao}
                    onChange={(e) => setSalarioRescisao(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Tipo de Rescisão</Label>
                  <Select value={tipoRescisao} onValueChange={(v) => setTipoRescisao(v as any)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="SEM_JUSTA_CAUSA">Sem Justa Causa</SelectItem>
                      <SelectItem value="COM_JUSTA_CAUSA">Com Justa Causa</SelectItem>
                      <SelectItem value="PEDIDO_DEMISSAO">Pedido de Demissão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Meses Trabalhados</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 12"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={mesesTrabalhados}
                    onChange={(e) => setMesesTrabalhados(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Dias de Férias Vencidas</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 0"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={diasFeriasVencidas}
                    onChange={(e) => setDiasFeriasVencidas(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Saldo FGTS</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 5000000"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={saldoFGTS}
                    onChange={(e) => setSaldoFGTS(e.target.value)}
                  />
                </div>

                <Card className="bg-yellow-500/10 border-yellow-500/30">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-yellow-400">Informação</p>
                        <p className="text-sm text-slate-300">
                          Os valores são calculados pelo backend e podem variar conforme acordos coletivos.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Resultados */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Cálculo da Rescisão</CardTitle>
                <CardDescription className="text-slate-400">Verbas rescisórias detalhadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {resultadoRescisao ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">Saldo de Salário</span>
                        <span className="font-semibold text-white">
                          {formatCurrency(resultadoRescisao.saldo_salario)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">Aviso Prévio</span>
                        <span className="font-semibold text-white">
                          {formatCurrency(resultadoRescisao.aviso_previo)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">Férias Proporcionais</span>
                        <span className="font-semibold text-white">
                          {formatCurrency(resultadoRescisao.ferias_proporcionais)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">1/3 de Férias</span>
                        <span className="font-semibold text-white">
                          {formatCurrency(resultadoRescisao.terco_ferias)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">13º Proporcional</span>
                        <span className="font-semibold text-white">
                          {formatCurrency(resultadoRescisao.decimo_terceiro)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">Multa FGTS (40%)</span>
                        <span className="font-semibold text-white">{formatCurrency(resultadoRescisao.multa_fgts)}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-600 pt-4">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30">
                        <span className="font-bold text-white text-lg">Total da Rescisão</span>
                        <span className="font-bold text-green-400 text-2xl">
                          {formatCurrency(resultadoRescisao.total_rescisao)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Badge
                        className={
                          tipoRescisao === "SEM_JUSTA_CAUSA"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }
                      >
                        {tipoRescisao === "SEM_JUSTA_CAUSA"
                          ? "Rescisão Sem Justa Causa - Todos os direitos"
                          : tipoRescisao === "COM_JUSTA_CAUSA"
                            ? "Rescisão Com Justa Causa - Direitos reduzidos"
                            : "Pedido de Demissão - Sem aviso prévio e multa FGTS"}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-400 py-8">Calculando...</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Simulador de Reajuste Tab */}
        <TabsContent value="reajuste" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  Simulador de Reajuste Salarial
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Calcule o impacto de reajustes na folha de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Folha de Pagamento Atual</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 125000000"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={folhaAtual}
                    onChange={(e) => setFolhaAtual(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Número de Funcionários</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 150"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={numeroFuncionarios}
                    onChange={(e) => setNumeroFuncionarios(e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-slate-300">Percentual de Reajuste</Label>
                    <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                      {percentualReajuste[0]}%
                    </Badge>
                  </div>
                  <Slider
                    value={percentualReajuste}
                    onValueChange={setPercentualReajuste}
                    min={0}
                    max={20}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>0%</span>
                    <span>10%</span>
                    <span>20%</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 bg-transparent"
                    onClick={() => setPercentualReajuste([3])}
                  >
                    3%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 bg-transparent"
                    onClick={() => setPercentualReajuste([5])}
                  >
                    5%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 bg-transparent"
                    onClick={() => setPercentualReajuste([10])}
                  >
                    10%
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resultados */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Impacto do Reajuste</CardTitle>
                <CardDescription className="text-slate-400">Projeção de custos com reajuste</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {resultadoReajuste ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">Folha Atual</span>
                        <span className="font-semibold text-white">
                          {formatCurrency(resultadoReajuste.folha_atual)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">Nova Folha</span>
                        <span className="font-semibold text-white">{formatCurrency(resultadoReajuste.nova_folha)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                        <span className="text-cyan-400">Aumento Mensal</span>
                        <span className="font-bold text-cyan-400">
                          {formatCurrency(resultadoReajuste.aumento_total)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">Aumento por Funcionário</span>
                        <span className="font-semibold text-white">
                          {formatCurrency(resultadoReajuste.aumento_por_funcionario)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-600 pt-4">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/30">
                        <div>
                          <p className="text-sm text-slate-400">Custo Anual (13 meses)</p>
                          <p className="font-bold text-white text-lg">
                            {formatCurrency(resultadoReajuste.custo_anual)}
                          </p>
                        </div>
                        <Percent className="h-8 w-8 text-orange-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-3 bg-slate-700/50 rounded-lg text-center">
                        <p className="text-xs text-slate-400 mb-1">Percentual</p>
                        <p className="text-2xl font-bold text-cyan-400">{resultadoReajuste.percentual}%</p>
                      </div>
                      <div className="p-3 bg-slate-700/50 rounded-lg text-center">
                        <p className="text-xs text-slate-400 mb-1">Funcionários</p>
                        <p className="text-2xl font-bold text-white">{numeroFuncionarios}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-400 py-8">Calculando...</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contratacao" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-cyan-400" />
                  Simulador de Custo de Contratação
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Calcule o custo real de uma nova contratação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Salário Base</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 750000"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={salarioContratacao}
                    onChange={(e) => setSalarioContratacao(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Tipo de Contratação</Label>
                  <Select value={cargoContratacao} onValueChange={setCargoContratacao}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="CLT">CLT (Carteira Assinada)</SelectItem>
                      <SelectItem value="PJ">PJ (Pessoa Jurídica)</SelectItem>
                      <SelectItem value="ESTAGIO">Estágio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Card className="bg-blue-500/10 border-blue-500/30">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-blue-400">Encargos Incluídos (CLT)</p>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• INSS Patronal (20%)</li>
                          <li>• FGTS (8%)</li>
                          <li>• Provisão de Férias + 1/3</li>
                          <li>• Provisão de 13º Salário</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Resultados */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Custo Total da Contratação</CardTitle>
                <CardDescription className="text-slate-400">Breakdown completo de custos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {resultadoCusto ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">Salário Base</span>
                        <span className="font-semibold text-white">{formatCurrency(resultadoCusto.salario)}</span>
                      </div>
                      {cargoContratacao === "CLT" && (
                        <>
                          <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                            <span className="text-slate-300">INSS Patronal (20%)</span>
                            <span className="font-semibold text-orange-400">
                              {formatCurrency(resultadoCusto.inss_patronal)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                            <span className="text-slate-300">FGTS (8%)</span>
                            <span className="font-semibold text-orange-400">{formatCurrency(resultadoCusto.fgts)}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                            <span className="text-slate-300">Provisão Férias + 1/3</span>
                            <span className="font-semibold text-orange-400">
                              {formatCurrency(resultadoCusto.ferias_provisao + resultadoCusto.terco_ferias)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                            <span className="text-slate-300">Provisão 13º</span>
                            <span className="font-semibold text-orange-400">
                              {formatCurrency(resultadoCusto.decimo_provisao)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="border-t border-slate-600 pt-4 space-y-3">
                      {cargoContratacao === "CLT" && (
                        <div className="flex justify-between items-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                          <span className="text-orange-400">Total Encargos</span>
                          <span className="font-bold text-orange-400">
                            {formatCurrency(resultadoCusto.encargos_total)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30">
                        <div>
                          <p className="text-sm text-slate-400">Custo Mensal Total</p>
                          <p className="font-bold text-white text-xl">{formatCurrency(resultadoCusto.custo_mensal)}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
                        <div>
                          <p className="text-sm text-slate-400">
                            Custo Anual ({cargoContratacao === "CLT" ? "13" : "12"} meses)
                          </p>
                          <p className="font-bold text-purple-400 text-xl">
                            {formatCurrency(resultadoCusto.custo_anual)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-400 py-8">Calculando...</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SimuladoresPage
