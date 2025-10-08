"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Clock, DollarSign, CheckCircle, XCircle, AlertCircle, Search, Plus, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://recursohumanosactualizado.onrender.com"

interface HoraExtra {
  id: number
  funcionario: {
    id: number
    nome: string
    cargo: string
  }
  data: string
  horas: number
  tipo: "normal" | "noturna" | "feriado" | "domingo"
  valor_hora: number
  valor_total: number
  status: "pendente" | "aprovada" | "rejeitada"
  observacao?: string
  aprovado_por?: string
  data_aprovacao?: string
}

interface Estatisticas {
  total_pendentes: number
  total_aprovadas: number
  total_rejeitadas: number
  valor_total_mes: number
  horas_totais_mes: number
}

export default function HorasExtrasPage() {
  const { toast } = useToast()
  const [horasExtras, setHorasExtras] = useState<HoraExtra[]>([])
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    total_pendentes: 0,
    total_aprovadas: 0,
    total_rejeitadas: 0,
    valor_total_mes: 0,
    horas_totais_mes: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [filtroBusca, setFiltroBusca] = useState("")
  const [modalAberto, setModalAberto] = useState(false)
  const [modalNovaHora, setModalNovaHora] = useState(false)
  const [horaExtraSelecionada, setHoraExtraSelecionada] = useState<HoraExtra | null>(null)
  const [acao, setAcao] = useState<"aprovar" | "rejeitar" | null>(null)
  const [observacao, setObservacao] = useState("")

  const [novaHoraExtra, setNovaHoraExtra] = useState({
    funcionario_id: "",
    data: "",
    horas: 0,
    tipo: "normal" as "normal" | "noturna" | "feriado" | "domingo",
    observacao: ""
  })

  

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true)
      
      const [horasRes] = await Promise.all([
        fetch(`${API_URL}/horas-extras/`, { credentials: "include" })
      ])

      let horasData: HoraExtra[] = []

      if (horasRes.ok) {
        horasData = await horasRes.json()
        setHorasExtras(Array.isArray(horasData) ? horasData : [])
      } else {
        horasData = await carregarDadosMockHoras()
        setHorasExtras(horasData)
      }

      calcularEstatisticas(horasData)

    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do sistema",
        variant: "destructive",
      })
      const horasMock = await carregarDadosMockHoras()
      setHorasExtras(horasMock)
      calcularEstatisticas(horasMock)
    } finally {
      setLoading(false)
    }
  }, [toast])
useEffect(() => {
    carregarDados()
  }, [carregarDados])
  const carregarDadosMockHoras = async (): Promise<HoraExtra[]> => {
    return [
      {
        id: 1,
        funcionario: { id: 1, nome: "João Silva", cargo: "Desenvolvedor" },
        data: "2024-01-15",
        horas: 4,
        tipo: "normal",
        valor_hora: 12500,
        valor_total: 50000,
        status: "pendente",
        observacao: "Projeto urgente"
      },
      {
        id: 2,
        funcionario: { id: 2, nome: "Maria Santos", cargo: "Designer" },
        data: "2024-01-14",
        horas: 2,
        tipo: "noturna",
        valor_hora: 15000,
        valor_total: 30000,
        status: "aprovada",
        observacao: "Reunião com cliente",
        aprovado_por: "admin",
        data_aprovacao: "2024-01-15"
      },
      {
        id: 3,
        funcionario: { id: 3, nome: "Pedro Costa", cargo: "Analista" },
        data: "2024-01-13",
        horas: 6,
        tipo: "feriado",
        valor_hora: 25000,
        valor_total: 150000,
        status: "rejeitada",
        observacao: "Não autorizado pelo gestor"
      }
    ]
  }

  const calcularEstatisticas = (horasData: HoraExtra[]) => {
    const total_pendentes = horasData.filter(h => h.status === "pendente").length
    const total_aprovadas = horasData.filter(h => h.status === "aprovada").length
    const total_rejeitadas = horasData.filter(h => h.status === "rejeitada").length
    const valor_total_mes = horasData
      .filter(h => h.status === "aprovada")
      .reduce((sum, h) => sum + h.valor_total, 0)
    const horas_totais_mes = horasData
      .filter(h => h.status === "aprovada")
      .reduce((sum, h) => sum + h.horas, 0)

    setEstatisticas({
      total_pendentes,
      total_aprovadas,
      total_rejeitadas,
      valor_total_mes,
      horas_totais_mes,
    })
  }

  const abrirModalAcao = (hora: HoraExtra, acaoTipo: "aprovar" | "rejeitar") => {
    setHoraExtraSelecionada(hora)
    setAcao(acaoTipo)
    setObservacao("")
    setModalAberto(true)
  }

  const processarAcao = async () => {
    if (!horaExtraSelecionada || !acao) return

    try {
      const endpoint = acao === "aprovar" ? "aprovar" : "rejeitar"
      const response = await fetch(`${API_URL}/horas-extras/${horaExtraSelecionada.id}/${endpoint}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ observacao }),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Hora extra ${acao === "aprovar" ? "aprovada" : "rejeitada"} com sucesso!`,
        })
        await carregarDados()
        setModalAberto(false)
        setHoraExtraSelecionada(null)
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

  const solicitarNovaHoraExtra = async () => {
    try {
      const response = await fetch(`${API_URL}/horas-extras/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(novaHoraExtra),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Hora extra solicitada com sucesso!",
        })
        setModalNovaHora(false)
        setNovaHoraExtra({
          funcionario_id: "",
          data: "",
          horas: 0,
          tipo: "normal",
          observacao: ""
        })
        await carregarDados()
      } else {
        throw new Error("Erro ao solicitar hora extra")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao solicitar hora extra",
        variant: "destructive",
      })
    }
  }

  const horasFiltradas = horasExtras.filter((hora) => {
    const matchStatus = filtroStatus === "todos" || hora.status === filtroStatus
    const matchBusca = hora.funcionario.nome.toLowerCase().includes(filtroBusca.toLowerCase())
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
    const variants = {
      pendente: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      aprovada: "bg-green-500/10 text-green-500 border-green-500/20",
      rejeitada: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    const labels = {
      pendente: "Pendente",
      aprovada: "Aprovada",
      rejeitada: "Rejeitada",
    }
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getTipoLabel = (tipo: string) => {
    const labels = {
      normal: "Normal (50%)",
      noturna: "Noturna (20%)",
      feriado: "Feriado (100%)",
      domingo: "Domingo (100%)",
    }
    return labels[tipo as keyof typeof labels] || tipo
  }

  const calcularValorHora = (tipo: string, horas: number) => {
    const valorBase = 10000 // Valor base por hora
    const multiplicadores = {
      normal: 1.5,    // 50% adicional
      noturna: 1.2,   // 20% adicional
      feriado: 2.0,   // 100% adicional
      domingo: 2.0,   // 100% adicional
    }
    const multiplicador = multiplicadores[tipo as keyof typeof multiplicadores] || 1.5
    return {
      valorHora: valorBase * multiplicador,
      valorTotal: (valorBase * multiplicador) * horas
    }
  }

  // Atualizar cálculo quando tipo ou horas mudarem
  useEffect(() => {
    if (novaHoraExtra.horas > 0) {
      const { valorHora, valorTotal } = calcularValorHora(novaHoraExtra.tipo, novaHoraExtra.horas)
      // Você pode usar esses valores para mostrar um preview
    }
  }, [novaHoraExtra.tipo, novaHoraExtra.horas])

  if (loading) {
    return <LoadingSkeletonHoras />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Horas Extras</h1>
            <p className="text-slate-400">Gerencie as solicitações de horas extras</p>
          </div>
          <Button
            onClick={() => setModalNovaHora(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Hora Extra
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-white">{estatisticas.total_pendentes}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Aprovadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-white">{estatisticas.total_aprovadas}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Rejeitadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold text-white">{estatisticas.total_rejeitadas}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Horas Totais (Mês)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-white">{estatisticas.horas_totais_mes}h</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Valor Total (Mês)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-white">
                  {formatCurrency(estatisticas.valor_total_mes)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-slate-800/50 border-slate-700">
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
                  <SelectItem value="aprovada">Aprovadas</SelectItem>
                  <SelectItem value="rejeitada">Rejeitadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Solicitações de Horas Extras</CardTitle>
            <CardDescription className="text-slate-400">
              {horasFiltradas.length} solicitação(ões) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-slate-300">Funcionário</TableHead>
                    <TableHead className="text-slate-300">Data</TableHead>
                    <TableHead className="text-slate-300">Horas</TableHead>
                    <TableHead className="text-slate-300">Tipo</TableHead>
                    <TableHead className="text-slate-300">Valor/Hora</TableHead>
                    <TableHead className="text-slate-300">Valor Total</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {horasFiltradas.map((hora) => (
                    <TableRow key={hora.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{hora.funcionario.nome}</div>
                          <div className="text-sm text-slate-400">{hora.funcionario.cargo}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(hora.data).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-slate-300">{hora.horas}h</TableCell>
                      <TableCell className="text-slate-300">{getTipoLabel(hora.tipo)}</TableCell>
                      <TableCell className="text-slate-300">
                        {formatCurrency(hora.valor_hora)}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {formatCurrency(hora.valor_total)}
                      </TableCell>
                      <TableCell>{getStatusBadge(hora.status)}</TableCell>
                      <TableCell className="text-right">
                        {hora.status === "pendente" && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                              onClick={() => abrirModalAcao(hora, "aprovar")}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              onClick={() => abrirModalAcao(hora, "rejeitar")}
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
              {horasFiltradas.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Nenhuma hora extra encontrada</h3>
                  <p className="text-slate-400">Tente ajustar os filtros de pesquisa</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Ação */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{acao === "aprovar" ? "Aprovar" : "Rejeitar"} Hora Extra</DialogTitle>
            <DialogDescription className="text-slate-400">
              {horaExtraSelecionada && (
                <>
                  Funcionário: {horaExtraSelecionada.funcionario.nome} - {horaExtraSelecionada.horas}h em{" "}
                  {new Date(horaExtraSelecionada.data).toLocaleDateString("pt-BR")}
                </>
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
              className={acao === "aprovar" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              disabled={acao === "rejeitar" && !observacao.trim()}
            >
              {acao === "aprovar" ? "Aprovar" : "Rejeitar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Nova Hora Extra */}
      <Dialog open={modalNovaHora} onOpenChange={setModalNovaHora}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Solicitar Nova Hora Extra</DialogTitle>
            <DialogDescription className="text-slate-400">
              Preencha os dados para solicitar horas extras
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="funcionario" className="text-slate-300">
                Funcionário
              </Label>
              <Select
                value={novaHoraExtra.funcionario_id}
                onValueChange={(value) => setNovaHoraExtra({...novaHoraExtra, funcionario_id: value})}
              >
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue placeholder="Selecione o funcionário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">João Silva - Desenvolvedor</SelectItem>
                  <SelectItem value="2">Maria Santos - Designer</SelectItem>
                  <SelectItem value="3">Pedro Costa - Analista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data" className="text-slate-300">
                  Data
                </Label>
                <Input
                  id="data"
                  type="date"
                  value={novaHoraExtra.data}
                  onChange={(e) => setNovaHoraExtra({...novaHoraExtra, data: e.target.value})}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horas" className="text-slate-300">
                  Horas
                </Label>
                <Input
                  id="horas"
                  type="number"
                  min="1"
                  max="12"
                  value={novaHoraExtra.horas}
                  onChange={(e) => setNovaHoraExtra({...novaHoraExtra, horas: Number(e.target.value)})}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-slate-300">
                Tipo de Hora Extra
              </Label>
              <Select
                value={novaHoraExtra.tipo}
                onValueChange={(value: "normal" | "noturna" | "feriado" | "domingo") => 
                  setNovaHoraExtra({...novaHoraExtra, tipo: value})
                }
              >
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (50% adicional)</SelectItem>
                  <SelectItem value="noturna">Noturna (20% adicional)</SelectItem>
                  <SelectItem value="feriado">Feriado (100% adicional)</SelectItem>
                  <SelectItem value="domingo">Domingo (100% adicional)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacao" className="text-slate-300">
                Justificativa
              </Label>
              <Textarea
                id="observacao"
                value={novaHoraExtra.observacao}
                onChange={(e) => setNovaHoraExtra({...novaHoraExtra, observacao: e.target.value})}
                placeholder="Descreva a justificativa para as horas extras..."
                className="bg-slate-900/50 border-slate-700 text-white min-h-[80px]"
              />
            </div>
            {novaHoraExtra.horas > 0 && (
              <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Valor estimado:</span>
                  <span className="font-bold text-green-400">
                    {formatCurrency(calcularValorHora(novaHoraExtra.tipo, novaHoraExtra.horas).valorTotal)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalNovaHora(false)} className="border-slate-700">
              Cancelar
            </Button>
            <Button
              onClick={solicitarNovaHoraExtra}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              disabled={!novaHoraExtra.funcionario_id || !novaHoraExtra.data || novaHoraExtra.horas <= 0}
            >
              <Clock className="w-4 h-4 mr-2" />
              Solicitar Hora Extra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente de Loading para Horas Extras
const LoadingSkeletonHoras = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-10 w-80 mb-2 bg-slate-700" />
          <Skeleton className="h-4 w-96 bg-slate-700" />
        </div>
        <Skeleton className="h-10 w-40 bg-slate-700" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg bg-slate-700" />
        ))}
      </div>
    </div>
  </div>
)