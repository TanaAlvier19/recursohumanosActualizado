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
import { DollarSign, CheckCircle, XCircle, AlertCircle, Search, Umbrella, Gift } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

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
  const [itemSelecionado, setItemSelecionado] = useState<Ferias | DecimoTerceiro | null>(null)
  const [acao, setAcao] = useState<"aprovar" | "rejeitar" | "pagar" | null>(null)
  const [observacao, setObservacao] = useState("")

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      const [feriasRes, decimosRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/ferias/`, { credentials: "include" }),
        fetch(`${API_URL}/decimo-terceiro/`, { credentials: "include" }),
        fetch(`${API_URL}/ferias-decimo/estatisticas/`, { credentials: "include" }),
      ])

      if (feriasRes.ok) {
        const feriasData = await feriasRes.json()
        setFerias(feriasData)
      }

      if (decimosRes.ok) {
        const decimosData = await decimosRes.json()
        setDecimos(decimosData)
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

  const abrirModalAcao = (item: Ferias | DecimoTerceiro, acaoTipo: "aprovar" | "rejeitar" | "pagar") => {
    setItemSelecionado(item)
    setAcao(acaoTipo)
    setObservacao("")
    setModalAberto(true)
  }

  const processarAcao = async () => {
    if (!itemSelecionado || !acao) return

    try {
      const endpoint = abaAtiva === "ferias" ? "ferias" : "decimo-terceiro"
      const response = await fetch(`${API_URL}/${endpoint}/${itemSelecionado.id}/${acao}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ observacao }),
      })

      if (response.ok) {
        await carregarDados()
        setModalAberto(false)
        setItemSelecionado(null)
        setAcao(null)
        setObservacao("")
      }
    } catch (error) {
      console.error("Erro ao processar ação:", error)
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando dados...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">Férias e Décimo Terceiro</h1>
            <p className="text-slate-400">Gerencie férias e pagamentos de décimo terceiro</p>
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                  }).format(estatisticas.valor_total_ferias)}
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                  }).format(estatisticas.valor_total_decimo)}
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
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(f.valor_total)}
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
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(d.valor)}
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
              className={acao === "rejeitar" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              disabled={acao === "rejeitar" && !observacao}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
