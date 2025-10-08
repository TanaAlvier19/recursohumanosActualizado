"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MetricCard } from "@/components/metrcCard"
import {
  DollarSign,
  CreditCard,
  Clock,
  TrendingUp,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Building,
  Mail,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface Emprestimo {
  id: string
  tipo: "CONSIGNADO" | "PESSOAL" | "EMERGENCIAL"
  valorTotal: number
  valorParcela: number
  numeroParcelas: number
  parcelasPagas: number
  parcelasRestantes: number
  taxaJuros: number
  dataContratacao: string
  dataPrimeiraParcela: string
  dataUltimaParcela: string
  status: "ATIVO" | "QUITADO" | "ATRASADO" | "CANCELADO"
  saldoDevedor: number
  observacoes: string
}

interface Adiantamento {
  id: string
  valor: number
  datasolicitacao: string
  dataAprovacao?: string
  dataPagamento?: string
  mesReferencia: string
  status: "PENDENTE" | "APROVADO" | "PAGO" | "REJEITADO"
  motivo: string
  aprovadoPor?: string
  observacoes: string
}

interface FolhaPagamento {
  id: string
  mesReferencia: string
  salarioBase: number
  horasExtras: number
  bonus: number
  totalVencimentos: number
  inss: number
  irrf: number
  emprestimos: number
  adiantamentos: number
  totalDescontos: number
  salarioLiquido: number
  status: "PROCESSADA" | "PAGA" | "PENDENTE"
  dataPagamento?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://recursohumanosactualizado.onrender.com"

const PainelFuncionarioPage = () => {
  const [modalEmprestimoAberto, setModalEmprestimoAberto] = useState(false)
  const [modalAdiantamentoAberto, setModalAdiantamentoAberto] = useState(false)
  const [modalFolhaAberto, setModalFolhaAberto] = useState(false)
  const [folhaSelecionada, setFolhaSelecionada] = useState<FolhaPagamento | null>(null)

  
  const [tipoEmprestimo, setTipoEmprestimo] = useState<"CONSIGNADO" | "PESSOAL" | "EMERGENCIAL">("CONSIGNADO")
  const [valorEmprestimo, setValorEmprestimo] = useState("")
  const [numeroParcelas, setNumeroParcelas] = useState("12")
  const [taxaJuros, setTaxaJuros] = useState("2")
  const [valorAdiantamento, setValorAdiantamento] = useState("")
  const [motivoAdiantamento, setMotivoAdiantamento] = useState("")
  const [observacoes, setObservacoes] = useState("")

  // States for real data
  const [funcionario, setFuncionario] = useState<any>(null)
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
  const [adiantamentos, setAdiantamentos] = useState<Adiantamento[]>([])
  const [folhasPagamento, setFolhasPagamento] = useState<FolhaPagamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)

      const [emprestimosRes, recibosRes] = await Promise.all([
        fetch(`${API_URL}/emprestimos/`, { credentials: "include" }),
        fetch(`${API_URL}/recibos/meus/`, { credentials: "include" }),
      ])

      if (!emprestimosRes.ok || !recibosRes.ok) {
        throw new Error("Erro ao carregar dados")
      }

      const emprestimosData = await emprestimosRes.json()
      const recibosData = await recibosRes.json()

      setEmprestimos(emprestimosData)
      setFolhasPagamento(recibosData)

      setFuncionario({
        id: "F001",
        nome: "João Silva",
        cargo: "Desenvolvedor Senior",
        departamento: "Tecnologia",
        email: "joao.silva@empresa.com",
        telefone: "+244 923 456 789",
        dataAdmissao: "2020-03-15",
        salarioBase: 2500000,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      console.error("[v0] Erro ao carregar dados:", err)
    } finally {
      setLoading(false)
    }
  }

  const solicitarEmprestimo = async () => {
    try {
      const response = await fetch(`${API_URL}/emprestimos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tipo: tipoEmprestimo,
          valor_total: Number(valorEmprestimo),
          numero_parcelas: Number(numeroParcelas),
          taxa_juros: Number(taxaJuros),
          observacoes: observacoes,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao solicitar empréstimo")
      }

      const novoEmprestimo = await response.json()
      setEmprestimos([...emprestimos, novoEmprestimo])
      setModalEmprestimoAberto(false)

      setValorEmprestimo("")
      setObservacoes("")

      alert("Empréstimo solicitado com sucesso!")
    } catch (err) {
      console.error("[v0] Erro ao solicitar empréstimo:", err)
      alert("Erro ao solicitar empréstimo. Tente novamente.")
    }
  }

  const solicitarAdiantamento = async () => {
    try {
      const response = await fetch(`${API_URL}/adiantamentos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          valor: Number(valorAdiantamento),
          motivo: motivoAdiantamento,
          observacoes: observacoes,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao solicitar adiantamento")
      }

      const novoAdiantamento = await response.json()
      setAdiantamentos([...adiantamentos, novoAdiantamento])
      setModalAdiantamentoAberto(false)

      setValorAdiantamento("")
      setMotivoAdiantamento("")
      setObservacoes("")

      alert("Adiantamento solicitado com sucesso!")
    } catch (err) {
      console.error("[v0] Erro ao solicitar adiantamento:", err)
      alert("Erro ao solicitar adiantamento. Tente novamente.")
    }
  }

  const stats = {
    emprestimosAtivos: emprestimos.filter((e) => e.status === "ATIVO").length,
    totalEmprestado: emprestimos.reduce((acc, e) => acc + e.saldoDevedor, 0),
    adiantamentosPendentes: adiantamentos.filter((a) => a.status === "PENDENTE").length,
    ultimoSalario: folhasPagamento[0]?.salarioLiquido || 0,
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      ATIVO: { label: "Ativo", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      QUITADO: { label: "Quitado", color: "bg-green-500/20 text-green-400 border-green-500/30" },
      ATRASADO: { label: "Atrasado", color: "bg-red-500/20 text-red-400 border-red-500/30" },
      CANCELADO: { label: "Cancelado", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
      PENDENTE: { label: "Pendente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      APROVADO: { label: "Aprovado", color: "bg-green-500/20 text-green-400 border-green-500/30" },
      PAGO: { label: "Pago", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
      REJEITADO: { label: "Rejeitado", color: "bg-red-500/20 text-red-400 border-red-500/30" },
      PROCESSADA: { label: "Processada", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    }
    return configs[status as keyof typeof configs]
  }

  const getTipoConfig = (tipo: string) => {
    const configs = {
      CONSIGNADO: { label: "Consignado", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      PESSOAL: { label: "Pessoal", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
      EMERGENCIAL: { label: "Emergencial", color: "bg-red-500/20 text-red-400 border-red-500/30" },
    }
    return configs[tipo as keyof typeof configs]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-red-400 text-xl">Erro: {error}</div>
      </div>
    )
  }

  if (!funcionario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Funcionário não encontrado</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Meu Painel
          </h1>
          <p className="text-lg text-slate-300">Bem-vindo, {funcionario.nome}</p>
        </div>
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-white">{funcionario.nome}</p>
              <p className="text-sm text-slate-400">{funcionario.cargo}</p>
              <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                {funcionario.departamento}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Último Salário"
          value={formatCurrency(stats.ultimoSalario)}
          icon={DollarSign}
          description="Salário líquido"
        />
        <MetricCard
          title="Empréstimos Ativos"
          value={stats.emprestimosAtivos.toString()}
          icon={CreditCard}
          description="Em andamento"
        />
        <MetricCard
          title="Saldo Devedor"
          value={formatCurrency(stats.totalEmprestado)}
          icon={TrendingUp}
          description="Total a pagar"
        />
        <MetricCard
          title="Adiantamentos"
          value={stats.adiantamentosPendentes.toString()}
          icon={Clock}
          description="Aguardando aprovação"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="folha" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
          <TabsTrigger value="folha" className="text-slate-300 data-[state=active]:bg-slate-700">
            <FileText className="h-4 w-4 mr-2" />
            Folha de Pagamento
          </TabsTrigger>
          <TabsTrigger value="emprestimos" className="text-slate-300 data-[state=active]:bg-slate-700">
            <CreditCard className="h-4 w-4 mr-2" />
            Empréstimos
          </TabsTrigger>
          <TabsTrigger value="adiantamentos" className="text-slate-300 data-[state=active]:bg-slate-700">
            <DollarSign className="h-4 w-4 mr-2" />
            Adiantamentos
          </TabsTrigger>
        </TabsList>

        {/* Folha de Pagamento Tab */}
        <TabsContent value="folha" className="mt-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Minhas Folhas de Pagamento</CardTitle>
              <CardDescription className="text-slate-400">
                Histórico de {folhasPagamento.length} folhas de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-600">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-600 hover:bg-slate-700/50">
                      <TableHead className="text-slate-300">Mês/Ano</TableHead>
                      <TableHead className="text-slate-300">Salário Base</TableHead>
                      <TableHead className="text-slate-300">Vencimentos</TableHead>
                      <TableHead className="text-slate-300">Descontos</TableHead>
                      <TableHead className="text-slate-300">Salário Líquido</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-right text-slate-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {folhasPagamento.map((folha) => {
                      const statusInfo = getStatusConfig(folha.status)
                      return (
                        <TableRow key={folha.id} className="border-slate-600 hover:bg-slate-700/50">
                          <TableCell>
                            <p className="font-semibold text-white">
                              {new Date(folha.mesReferencia).toLocaleDateString("pt-AO", {
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-white">{formatCurrency(folha.salarioBase)}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-green-400 font-semibold">{formatCurrency(folha.totalVencimentos)}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-red-400 font-semibold">{formatCurrency(folha.totalDescontos)}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-cyan-400 font-bold text-lg">{formatCurrency(folha.salarioLiquido)}</p>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white"
                              onClick={() => {
                                setFolhaSelecionada(folha)
                                setModalFolhaAberto(true)
                              }}
                            >
                              Ver Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Empréstimos Tab */}
        <TabsContent value="emprestimos" className="mt-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <CardTitle className="text-white">Meus Empréstimos</CardTitle>
                  <CardDescription className="text-slate-400">
                    {emprestimos.length} empréstimos encontrados
                  </CardDescription>
                </div>
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 gap-2"
                  onClick={() => setModalEmprestimoAberto(true)}
                >
                  <CreditCard className="h-4 w-4" />
                  Solicitar Empréstimo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emprestimos.map((emprestimo) => {
                  const statusInfo = getStatusConfig(emprestimo.status)
                  const tipoInfo = getTipoConfig(emprestimo.tipo)
                  const progressoParcelas = (emprestimo.parcelasPagas / emprestimo.numeroParcelas) * 100
                  return (
                    <Card key={emprestimo.id} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Badge className={tipoInfo.color}>{tipoInfo.label}</Badge>
                                <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                              </div>
                              <p className="text-sm text-slate-400">
                                Contratado em {formatDate(emprestimo.dataContratacao)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-400">Saldo Devedor</p>
                              <p className="text-2xl font-bold text-orange-400">
                                {formatCurrency(emprestimo.saldoDevedor)}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-slate-400">Valor Total</p>
                              <p className="text-lg font-semibold text-white">
                                {formatCurrency(emprestimo.valorTotal)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-400">Valor da Parcela</p>
                              <p className="text-lg font-semibold text-white">
                                {formatCurrency(emprestimo.valorParcela)}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Progresso</span>
                              <span className="text-white font-semibold">
                                {emprestimo.parcelasPagas}/{emprestimo.numeroParcelas} parcelas pagas
                              </span>
                            </div>
                            <Progress value={progressoParcelas} className="h-2" />
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-slate-600">
                            <div>
                              <p className="text-xs text-slate-400">Taxa de Juros</p>
                              <p className="text-sm font-semibold text-white">{emprestimo.taxaJuros}% a.m.</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400">Última Parcela</p>
                              <p className="text-sm font-semibold text-white">
                                {formatDate(emprestimo.dataUltimaParcela)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adiantamentos Tab */}
        <TabsContent value="adiantamentos" className="mt-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <CardTitle className="text-white">Meus Adiantamentos</CardTitle>
                  <CardDescription className="text-slate-400">
                    {adiantamentos.length} adiantamentos encontrados
                  </CardDescription>
                </div>
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 gap-2"
                  onClick={() => setModalAdiantamentoAberto(true)}
                >
                  <DollarSign className="h-4 w-4" />
                  Solicitar Adiantamento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adiantamentos.map((adiantamento) => {
                  const statusInfo = getStatusConfig(adiantamento.status)
                  return (
                    <Card key={adiantamento.id} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                              <p className="text-sm text-slate-400">
                                Solicitado em {formatDate(adiantamento.datasolicitacao)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-400">Valor</p>
                              <p className="text-2xl font-bold text-green-400">{formatCurrency(adiantamento.valor)}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-slate-400">Motivo</p>
                            <p className="text-white">{adiantamento.motivo}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-slate-400">Mês Referência</p>
                              <p className="text-white">
                                {new Date(adiantamento.mesReferencia).toLocaleDateString("pt-AO", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            {adiantamento.aprovadoPor && (
                              <div>
                                <p className="text-sm text-slate-400">Aprovado por</p>
                                <p className="text-white">{adiantamento.aprovadoPor}</p>
                              </div>
                            )}
                          </div>

                          {adiantamento.observacoes && (
                            <div className="pt-2 border-t border-slate-600">
                              <p className="text-sm text-slate-400">Observações</p>
                              <p className="text-sm text-white">{adiantamento.observacoes}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Solicitar Empréstimo */}
      <Dialog open={modalEmprestimoAberto} onOpenChange={setModalEmprestimoAberto}>
        <DialogContent className="max-w-2xl bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-cyan-400" />
              Solicitar Empréstimo
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Preencha os dados para solicitar um empréstimo consignado
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Tipo de Empréstimo</Label>
                <Select value={tipoEmprestimo} onValueChange={(v) => setTipoEmprestimo(v as any)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    <SelectItem value="CONSIGNADO">Consignado</SelectItem>
                    <SelectItem value="PESSOAL">Pessoal</SelectItem>
                    <SelectItem value="EMERGENCIAL">Emergencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Valor do Empréstimo</Label>
                <Input
                  type="number"
                  placeholder="Ex: 5000000"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={valorEmprestimo}
                  onChange={(e) => setValorEmprestimo(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Número de Parcelas</Label>
                <Select value={numeroParcelas} onValueChange={setNumeroParcelas}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    <SelectItem value="6">6 parcelas</SelectItem>
                    <SelectItem value="12">12 parcelas</SelectItem>
                    <SelectItem value="18">18 parcelas</SelectItem>
                    <SelectItem value="24">24 parcelas</SelectItem>
                    <SelectItem value="36">36 parcelas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Taxa de Juros (% a.m.)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 2.5"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={taxaJuros}
                  onChange={(e) => setTaxaJuros(e.target.value)}
                  disabled
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Observações</Label>
              <Textarea
                placeholder="Informações adicionais sobre o empréstimo..."
                className="bg-slate-700 border-slate-600 text-white"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            {/* Simulação */}
            {valorEmprestimo && numeroParcelas && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Simulação do Empréstimo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Valor Solicitado</span>
                    <span className="font-semibold text-white">{formatCurrency(Number(valorEmprestimo))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Número de Parcelas</span>
                    <span className="font-semibold text-white">{numeroParcelas}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Valor da Parcela</span>
                    <span className="font-semibold text-white">
                      {formatCurrency(Number(valorEmprestimo) / Number(numeroParcelas))}
                    </span>
                  </div>
                  <div className="border-t border-slate-600 pt-3 flex justify-between items-center">
                    <span className="font-bold text-white">Total a Pagar</span>
                    <span className="font-bold text-green-400 text-lg">
                      {formatCurrency(Number(valorEmprestimo) * (1 + Number(taxaJuros) / 100))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 bg-transparent"
              onClick={() => setModalEmprestimoAberto(false)}
            >
              Cancelar
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600" onClick={solicitarEmprestimo}>
              Solicitar Empréstimo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Solicitar Adiantamento */}
      <Dialog open={modalAdiantamentoAberto} onOpenChange={setModalAdiantamentoAberto}>
        <DialogContent className="max-w-2xl bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-cyan-400" />
              Solicitar Adiantamento Salarial
            </DialogTitle>
            <DialogDescription className="text-slate-400">Solicite um adiantamento do seu salário</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Valor do Adiantamento</Label>
              <Input
                type="number"
                placeholder="Ex: 500000"
                className="bg-slate-700 border-slate-600 text-white"
                value={valorAdiantamento}
                onChange={(e) => setValorAdiantamento(e.target.value)}
              />
              <p className="text-xs text-slate-400">
                Máximo: {formatCurrency(funcionario.salarioBase * 0.4)} (40% do salário base)
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Motivo do Adiantamento</Label>
              <Textarea
                placeholder="Descreva o motivo da solicitação..."
                className="bg-slate-700 border-slate-600 text-white"
                value={motivoAdiantamento}
                onChange={(e) => setMotivoAdiantamento(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Observações</Label>
              <Textarea
                placeholder="Informações adicionais..."
                className="bg-slate-700 border-slate-600 text-white"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-yellow-400">Informação Importante</p>
                    <p className="text-sm text-slate-300">
                      O valor do adiantamento será descontado automaticamente na próxima folha de pagamento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 bg-transparent"
              onClick={() => setModalAdiantamentoAberto(false)}
            >
              Cancelar
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600" onClick={solicitarAdiantamento}>
              Solicitar Adiantamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Detalhes Folha de Pagamento */}
      <Dialog open={modalFolhaAberto} onOpenChange={setModalFolhaAberto}>
        <DialogContent className="max-w-3xl bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-400" />
              Detalhes da Folha de Pagamento
            </DialogTitle>
            {folhaSelecionada && (
              <DialogDescription className="text-slate-400">
                {new Date(folhaSelecionada.mesReferencia).toLocaleDateString("pt-AO", {
                  month: "long",
                  year: "numeric",
                })}
              </DialogDescription>
            )}
          </DialogHeader>
          {folhaSelecionada && (
            <div className="space-y-6">
              {/* Informações do Funcionário */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Informações do Funcionário</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-cyan-400" />
                    <div>
                      <p className="text-xs text-slate-400">Nome</p>
                      <p className="text-white font-semibold">{funcionario.nome}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-cyan-400" />
                    <div>
                      <p className="text-xs text-slate-400">Cargo</p>
                      <p className="text-white font-semibold">{funcionario.cargo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-cyan-400" />
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-white font-semibold">{funcionario.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    <div>
                      <p className="text-xs text-slate-400">Data de Admissão</p>
                      <p className="text-white font-semibold">{formatDate(funcionario.dataAdmissao)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vencimentos */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Vencimentos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Salário Base</span>
                    <span className="font-semibold text-white">{formatCurrency(folhaSelecionada.salarioBase)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Horas Extras</span>
                    <span className="font-semibold text-white">{formatCurrency(folhaSelecionada.horasExtras)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Bônus</span>
                    <span className="font-semibold text-white">{formatCurrency(folhaSelecionada.bonus)}</span>
                  </div>
                  <div className="border-t border-slate-600 pt-3 flex justify-between items-center">
                    <span className="font-bold text-white">Total de Vencimentos</span>
                    <span className="font-bold text-green-400 text-lg">
                      {formatCurrency(folhaSelecionada.totalVencimentos)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Descontos */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Descontos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">INSS</span>
                    <span className="font-semibold text-white">{formatCurrency(folhaSelecionada.inss)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">IRRF</span>
                    <span className="font-semibold text-white">{formatCurrency(folhaSelecionada.irrf)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Empréstimos</span>
                    <span className="font-semibold text-white">{formatCurrency(folhaSelecionada.emprestimos)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Adiantamentos</span>
                    <span className="font-semibold text-white">{formatCurrency(folhaSelecionada.adiantamentos)}</span>
                  </div>
                  <div className="border-t border-slate-600 pt-3 flex justify-between items-center">
                    <span className="font-bold text-white">Total de Descontos</span>
                    <span className="font-bold text-red-400 text-lg">
                      {formatCurrency(folhaSelecionada.totalDescontos)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Salário Líquido */}
              <Card className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-500/30">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-slate-300 text-lg">Salário Líquido</p>
                      {folhaSelecionada.dataPagamento && (
                        <p className="text-sm text-slate-400">Pago em {formatDate(folhaSelecionada.dataPagamento)}</p>
                      )}
                    </div>
                    <p className="text-4xl font-bold text-cyan-400">
                      {formatCurrency(folhaSelecionada.salarioLiquido)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 bg-transparent"
              onClick={() => setModalFolhaAberto(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PainelFuncionarioPage
