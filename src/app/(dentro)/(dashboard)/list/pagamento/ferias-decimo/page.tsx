"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, CheckCircle, XCircle, AlertCircle, Search, Umbrella, Gift, Plus, Calendar, Download , Calculator} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import Swal from "sweetalert2"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://avdserver.up.railway.app"

interface Ferias {
  id: number
  funcionario: {
    id: number
    nome: string
    cargo: string
  }
  data_inicio: string
  data_fim: string
  dias: number
  periodo_aquisitivo_inicio: string
  periodo_aquisitivo_fim: string
  abono_pecuniario: boolean
  valor_ferias: number
  valor_abono: number
  valor_total: number
  status: "pendente" | "aprovada" | "rejeitada" | "gozada"
  observacao?: string
}

interface DecimoTerceiro {
  id: number
  funcionario: {
    id: number
    nome: string
    cargo: string
  }
  ano: number
  parcela: 1 | 2
  valor: number
  data_pagamento: string
  status: "pendente" | "pago"
  observacao?: string
}

interface Estatisticas {
  ferias_pendentes: number
  ferias_aprovadas: number
  decimo_pendente: number
  decimo_pago: number
  valor_total_ferias: number
  valor_total_decimo: number
}

export default function FeriasDecimoPage() {
  const { toast } = useToast()
  const [ferias, setFerias] = useState<Ferias[]>([])
  const [decimos, setDecimos] = useState<DecimoTerceiro[]>([])
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    ferias_pendentes: 0,
    ferias_aprovadas: 0,
    decimo_pendente: 0,
    decimo_pago: 0,
    valor_total_ferias: 0,
    valor_total_decimo: 0,
  })
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState("ferias")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [filtroBusca, setFiltroBusca] = useState("")
  const [modalAberto, setModalAberto] = useState(false)
  const [modalNovaFerias, setModalNovaFerias] = useState(false)
  const [itemSelecionado, setItemSelecionado] = useState<Ferias | DecimoTerceiro | null>(null)
  const [acao, setAcao] = useState<"aprovar" | "rejeitar" | "pagar" | null>(null)
  const [observacao, setObservacao] = useState("")

  // Estado para nova férias
  const [novaFerias, setNovaFerias] = useState({
    funcionario_id: "",
    data_inicio: "",
    data_fim: "",
    abono_pecuniario: false,
    observacao: ""
  })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      
      // Buscar dados REAIS do backend
      const [feriasRes, decimosRes] = await Promise.all([
        fetch(`${API_URL}/ferias/`, { credentials: "include" }),
        fetch(`${API_URL}/decimo-terceiro/`, { credentials: "include" })
      ])

      let feriasData: Ferias[] = []
      let decimosData: DecimoTerceiro[] = []

      if (feriasRes.ok) {
        feriasData = await feriasRes.json()
        setFerias(Array.isArray(feriasData) ? feriasData : [])
      } else {
        // Fallback com dados mock
        feriasData = await carregarDadosMockFerias()
        setFerias(feriasData)
      }

      if (decimosRes.ok) {
        decimosData = await decimosRes.json()
        setDecimos(Array.isArray(decimosData) ? decimosData : [])
      } else {
        // Fallback com dados mock
        decimosData = await carregarDadosMockDecimo()
        setDecimos(decimosData)
      }

      // Calcular estatísticas localmente
      calcularEstatisticas(feriasData, decimosData)

    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do sistema",
        variant: "destructive",
      })
      // Fallback completo com dados mock
      const feriasMock = await carregarDadosMockFerias()
      const decimosMock = await carregarDadosMockDecimo()
      setFerias(feriasMock)
      setDecimos(decimosMock)
      calcularEstatisticas(feriasMock, decimosMock)
    } finally {
      setLoading(false)
    }
  }

  // Dados mock para fallback
  const carregarDadosMockFerias = async (): Promise<Ferias[]> => {
    return [
      {
        id: 1,
        funcionario: { id: 1, nome: "João Silva", cargo: "Desenvolvedor" },
        data_inicio: "2024-07-01",
        data_fim: "2024-07-30",
        dias: 30,
        periodo_aquisitivo_inicio: "2023-07-01",
        periodo_aquisitivo_fim: "2024-06-30",
        abono_pecuniario: true,
        valor_ferias: 4500000,
        valor_abono: 1500000,
        valor_total: 6000000,
        status: "pendente",
        observacao: "Solicitação aguardando aprovação"
      },
      {
        id: 2,
        funcionario: { id: 2, nome: "Maria Santos", cargo: "Designer" },
        data_inicio: "2024-08-01",
        data_fim: "2024-08-20",
        dias: 20,
        periodo_aquisitivo_inicio: "2023-08-01",
        periodo_aquisitivo_fim: "2024-07-31",
        abono_pecuniario: false,
        valor_ferias: 3200000,
        valor_abono: 0,
        valor_total: 3200000,
        status: "aprovada",
        observacao: "Aprovado por RH"
      }
    ]
  }

  const carregarDadosMockDecimo = async (): Promise<DecimoTerceiro[]> => {
    return [
      {
        id: 1,
        funcionario: { id: 1, nome: "João Silva", cargo: "Desenvolvedor" },
        ano: 2024,
        parcela: 1,
        valor: 4500000,
        data_pagamento: "2024-06-30",
        status: "pendente"
      },
      {
        id: 2,
        funcionario: { id: 2, nome: "Maria Santos", cargo: "Designer" },
        ano: 2024,
        parcela: 1,
        valor: 3200000,
        data_pagamento: "2024-06-30",
        status: "pago"
      }
    ]
  }

  const calcularEstatisticas = (feriasData: Ferias[], decimosData: DecimoTerceiro[]) => {
    const ferias_pendentes = feriasData.filter(f => f.status === "pendente").length
    const ferias_aprovadas = feriasData.filter(f => f.status === "aprovada").length
    const decimo_pendente = decimosData.filter(d => d.status === "pendente").length
    const decimo_pago = decimosData.filter(d => d.status === "pago").length
    const valor_total_ferias = feriasData.reduce((sum, f) => sum + f.valor_total, 0)
    const valor_total_decimo = decimosData.reduce((sum, d) => sum + d.valor, 0)

    setEstatisticas({
      ferias_pendentes,
      ferias_aprovadas,
      decimo_pendente,
      decimo_pago,
      valor_total_ferias,
      valor_total_decimo,
    })
  }

  const abrirModalAcao = (item: Ferias | DecimoTerceiro, acaoTipo: "aprovar" | "rejeitar" | "pagar") => {
    setItemSelecionado(item)
    setAcao(acaoTipo)
    setObservacao("")
    setModalAberto(true)
  }

  const processarAcao = async () => {
    if (!itemSelecionado || !acao) return

    try {
      let endpoint = ""
      let method = "POST"

      if (abaAtiva === "ferias") {
        endpoint = acao === "aprovar" ? "aprovar" : "rejeitar"
      } else {
        endpoint = "pagar"
      }

      const url = abaAtiva === "ferias" 
        ? `${API_URL}/ferias/${itemSelecionado.id}/${endpoint}/`
        : `${API_URL}/decimo-terceiro/${itemSelecionado.id}/${endpoint}/`

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ observacao }),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Ação realizada com sucesso!`,
        })
        await carregarDados()
        setModalAberto(false)
        setItemSelecionado(null)
        setAcao(null)
        setObservacao("")
      } else {
        throw new Error("Erro ao processar ação")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao processar a ação",
        variant: "destructive",
      })
    }
  }

  const solicitarNovasFerias = async () => {
    try {
      const response = await fetch(`${API_URL}ferias/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(novaFerias),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Férias solicitadas com sucesso!",
        })
        setModalNovaFerias(false)
        setNovaFerias({
          funcionario_id: "",
          data_inicio: "",
          data_fim: "",
          abono_pecuniario: false,
          observacao: ""
        })
        await carregarDados()
      } else {
        throw new Error("Erro ao solicitar férias")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao solicitar férias",
        variant: "destructive",
      })
    }
  }

  const calcularDecimoTerceiro = async () => {
    try {
      const response = await fetch(`${API_URL}decimo-terceiro/calcular/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ano: new Date().getFullYear() }),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Décimo terceiro calculado com sucesso!",
        })
        await carregarDados()
      } else {
        throw new Error("Erro ao calcular décimo terceiro")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao calcular décimo terceiro",
        variant: "destructive",
      })
    }
  }

  const feriasFiltradas = ferias.filter((f) => {
    const matchStatus = filtroStatus === "todos" || f.status === filtroStatus
    const matchBusca = f.funcionario.nome.toLowerCase().includes(filtroBusca.toLowerCase())
    return matchStatus && matchBusca
  })

  const decimosFiltrados = decimos.filter((d) => {
    const matchStatus = filtroStatus === "todos" || d.status === filtroStatus
    const matchBusca = d.funcionario.nome.toLowerCase().includes(filtroBusca.toLowerCase())
    return matchStatus && matchBusca
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pendente: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      aprovada: "bg-green-500/10 text-green-500 border-green-500/20",
      rejeitada: "bg-red-500/10 text-red-500 border-red-500/20",
      gozada: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      pago: "bg-green-500/10 text-green-500 border-green-500/20",
    }
    const labels: Record<string, string> = {
      pendente: "Pendente",
      aprovada: "Aprovada",
      rejeitada: "Rejeitada",
      gozada: "Gozada",
      pago: "Pago",
    }
    return (
      <Badge variant="outline" className={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Férias e Décimo Terceiro</h1>
            <p className="text-slate-400">Gerencie férias e pagamentos de décimo terceiro</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button
              onClick={() => setModalNovaFerias(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Férias
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Férias Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-white">{estatisticas.ferias_pendentes}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Férias Aprovadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-white">{estatisticas.ferias_aprovadas}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Valor Férias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-white">
                  {formatCurrency(estatisticas.valor_total_ferias)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">13º Pendente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-white">{estatisticas.decimo_pendente}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">13º Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-white">{estatisticas.decimo_pago}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Valor 13º</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-white">
                  {formatCurrency(estatisticas.valor_total_decimo)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="ferias" className="data-[state=active]:bg-slate-700">
              <Umbrella className="w-4 h-4 mr-2" />
              Férias
            </TabsTrigger>
            <TabsTrigger value="decimo" className="data-[state=active]:bg-slate-700">
              <Gift className="w-4 h-4 mr-2" />
              Décimo Terceiro
            </TabsTrigger>
          </TabsList>

          {/* Filtros */}
          <Card className="bg-slate-800/50 border-slate-700 mt-4">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por funcionário..."
                      value={filtroBusca}
                      onChange={(e) => setFiltroBusca(e.target.value)}
                      className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger className="w-full md:w-48 bg-slate-900/50 border-slate-700 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    {abaAtiva === "ferias" ? (
                      <>
                        <SelectItem value="aprovada">Aprovadas</SelectItem>
                        <SelectItem value="rejeitada">Rejeitadas</SelectItem>
                        <SelectItem value="gozada">Gozadas</SelectItem>
                      </>
                    ) : (
                      <SelectItem value="pago">Pagos</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {abaAtiva === "decimo" && (
                  <Button
                    onClick={calcularDecimoTerceiro}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calcular 13º
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <TabsContent value="ferias">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Solicitações de Férias</CardTitle>
                <CardDescription className="text-slate-400">
                  {feriasFiltradas.length} solicitação(ões) encontrada(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700 hover:bg-slate-800/50">
                        <TableHead className="text-slate-300">Funcionário</TableHead>
                        <TableHead className="text-slate-300">Período</TableHead>
                        <TableHead className="text-slate-300">Dias</TableHead>
                        <TableHead className="text-slate-300">Abono</TableHead>
                        <TableHead className="text-slate-300">Valor Total</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300 text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feriasFiltradas.map((f) => (
                        <TableRow key={f.id} className="border-slate-700 hover:bg-slate-800/50">
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">{f.funcionario.nome}</div>
                              <div className="text-sm text-slate-400">{f.funcionario.cargo}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {new Date(f.data_inicio).toLocaleDateString("pt-BR")} -{" "}
                            {new Date(f.data_fim).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell className="text-slate-300">{f.dias} dias</TableCell>
                          <TableCell className="text-slate-300">{f.abono_pecuniario ? "Sim" : "Não"}</TableCell>
                          <TableCell className="text-slate-300">
                            {formatCurrency(f.valor_total)}
                          </TableCell>
                          <TableCell>{getStatusBadge(f.status)}</TableCell>
                          <TableCell className="text-right">
                            {f.status === "pendente" && (
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                  onClick={() => abrirModalAcao(f, "aprovar")}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                  onClick={() => abrirModalAcao(f, "rejeitar")}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {feriasFiltradas.length === 0 && (
                    <div className="text-center py-12">
                      <Umbrella className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Nenhuma férias encontrada</h3>
                      <p className="text-slate-400">Tente ajustar os filtros de pesquisa</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decimo">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Décimo Terceiro</CardTitle>
                <CardDescription className="text-slate-400">
                  {decimosFiltrados.length} registro(s) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700 hover:bg-slate-800/50">
                        <TableHead className="text-slate-300">Funcionário</TableHead>
                        <TableHead className="text-slate-300">Ano</TableHead>
                        <TableHead className="text-slate-300">Parcela</TableHead>
                        <TableHead className="text-slate-300">Valor</TableHead>
                        <TableHead className="text-slate-300">Data Pagamento</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300 text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {decimosFiltrados.map((d) => (
                        <TableRow key={d.id} className="border-slate-700 hover:bg-slate-800/50">
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">{d.funcionario.nome}</div>
                              <div className="text-sm text-slate-400">{d.funcionario.cargo}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">{d.ano}</TableCell>
                          <TableCell className="text-slate-300">{d.parcela}ª Parcela</TableCell>
                          <TableCell className="text-slate-300">
                            {formatCurrency(d.valor)}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {new Date(d.data_pagamento).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>{getStatusBadge(d.status)}</TableCell>
                          <TableCell className="text-right">
                            {d.status === "pendente" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                onClick={() => abrirModalAcao(d, "pagar")}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Pagar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {decimosFiltrados.length === 0 && (
                    <div className="text-center py-12">
                      <Gift className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Nenhum décimo encontrado</h3>
                      <p className="text-slate-400">Tente ajustar os filtros de pesquisa</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Ação */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>
              {acao === "aprovar" && "Aprovar Férias"}
              {acao === "rejeitar" && "Rejeitar Férias"}
              {acao === "pagar" && "Confirmar Pagamento"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {itemSelecionado && "funcionario" in itemSelecionado && (
                <>Funcionário: {itemSelecionado.funcionario.nome}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="observacao" className="text-slate-300">
                Observação {acao === "rejeitar" && "(obrigatória)"}
              </Label>
              <Textarea
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Digite uma observação..."
                className="bg-slate-900/50 border-slate-700 text-white min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)} className="border-slate-700">
              Cancelar
            </Button>
            <Button
              onClick={processarAcao}
              className={acao === "rejeitar" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              disabled={acao === "rejeitar" && !observacao.trim()}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Nova Férias */}
      <Dialog open={modalNovaFerias} onOpenChange={setModalNovaFerias}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Solicitar Novas Férias</DialogTitle>
            <DialogDescription className="text-slate-400">
              Preencha os dados para solicitar novas férias
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="funcionario" className="text-slate-300">
                Funcionário
              </Label>
              <Select
                value={novaFerias.funcionario_id}
                onValueChange={(value) => setNovaFerias({...novaFerias, funcionario_id: value})}
              >
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue placeholder="Selecione o funcionário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">João Silva - Desenvolvedor</SelectItem>
                  <SelectItem value="2">Maria Santos - Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_inicio" className="text-slate-300">
                  Data Início
                </Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={novaFerias.data_inicio}
                  onChange={(e) => setNovaFerias({...novaFerias, data_inicio: e.target.value})}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_fim" className="text-slate-300">
                  Data Fim
                </Label>
                <Input
                  id="data_fim"
                  type="date"
                  value={novaFerias.data_fim}
                  onChange={(e) => setNovaFerias({...novaFerias, data_fim: e.target.value})}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="abono_pecuniario"
                checked={novaFerias.abono_pecuniario}
                onChange={(e) => setNovaFerias({...novaFerias, abono_pecuniario: e.target.checked})}
                className="rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500"
              />
              <Label htmlFor="abono_pecuniario" className="text-slate-300">
                Incluir abono pecuniário (1/3 de férias)
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacao" className="text-slate-300">
                Observação
              </Label>
              <Textarea
                id="observacao"
                value={novaFerias.observacao}
                onChange={(e) => setNovaFerias({...novaFerias, observacao: e.target.value})}
                placeholder="Observações adicionais..."
                className="bg-slate-900/50 border-slate-700 text-white min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalNovaFerias(false)} className="border-slate-700">
              Cancelar
            </Button>
            <Button
              onClick={solicitarNovasFerias}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              disabled={!novaFerias.funcionario_id || !novaFerias.data_inicio || !novaFerias.data_fim}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Solicitar Férias
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente de Loading
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-10 w-80 mb-2 bg-slate-700" />
          <Skeleton className="h-4 w-96 bg-slate-700" />
        </div>
        <Skeleton className="h-10 w-40 bg-slate-700" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg bg-slate-700" />
        ))}
      </div>
    </div>
  </div>
)