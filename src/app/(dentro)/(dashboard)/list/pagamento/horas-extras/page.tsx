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
import { Clock, DollarSign, CheckCircle, XCircle, AlertCircle, Search } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

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
  const [horaExtraSelecionada, setHoraExtraSelecionada] = useState<HoraExtra | null>(null)
  const [acao, setAcao] = useState<"aprovar" | "rejeitar" | null>(null)
  const [observacao, setObservacao] = useState("")

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      const [horasRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/horas-extras/`, { credentials: "include" }),
        fetch(`${API_URL}/horas-extras/estatisticas/`, { credentials: "include" }),
      ])

      if (horasRes.ok) {
        const horasData = await horasRes.json()
        setHorasExtras(horasData)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setEstatisticas(statsData)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
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
        await carregarDados()
        setModalAberto(false)
        setHoraExtraSelecionada(null)
        setAcao(null)
        setObservacao("")
      }
    } catch (error) {
      console.error("Erro ao processar ação:", error)
    }
  }

  const horasFiltradas = horasExtras.filter((hora) => {
    const matchStatus = filtroStatus === "todos" || hora.status === filtroStatus
    const matchBusca = hora.funcionario.nome.toLowerCase().includes(filtroBusca.toLowerCase())
    return matchStatus && matchBusca
  })

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando horas extras...</p>
        </div>
      </div>
    )
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(estatisticas.valor_total_mes)}
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
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(hora.valor_hora)}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(hora.valor_total)}
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
              <Input
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Digite uma observação..."
                className="bg-slate-900/50 border-slate-700 text-white"
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
              disabled={acao === "rejeitar" && !observacao}
            >
              {acao === "aprovar" ? "Aprovar" : "Rejeitar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
