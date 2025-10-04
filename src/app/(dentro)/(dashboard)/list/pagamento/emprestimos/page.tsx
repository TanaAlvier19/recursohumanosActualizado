"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Progress } from "@/components/ui/progress"
import { DollarSign, CheckCircle, XCircle, AlertCircle, Search, TrendingUp } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Emprestimo {
  id: number
  funcionario: {
    id: number
    nome: string
    cargo: string
  }
  valor_total: number
  valor_parcela: number
  numero_parcelas: number
  parcelas_pagas: number
  taxa_juros: number
  data_solicitacao: string
  data_aprovacao?: string
  status: "pendente" | "aprovado" | "rejeitado" | "ativo" | "quitado"
  observacao?: string
}

interface Estatisticas {
  total_pendentes: number
  total_ativos: number
  total_quitados: number
  valor_total_emprestado: number
  valor_total_receber: number
}

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    total_pendentes: 0,
    total_ativos: 0,
    total_quitados: 0,
    valor_total_emprestado: 0,
    valor_total_receber: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [filtroBusca, setFiltroBusca] = useState("")
  const [modalAberto, setModalAberto] = useState(false)
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState<Emprestimo | null>(null)
  const [acao, setAcao] = useState<"aprovar" | "rejeitar" | null>(null)
  const [observacao, setObservacao] = useState("")

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      const [emprestimosRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/emprestimos/`, { credentials: "include" }),
        fetch(`${API_URL}/emprestimos/estatisticas/`, { credentials: "include" }),
      ])

      if (emprestimosRes.ok) {
        const emprestimosData = await emprestimosRes.json()
        setEmprestimos(emprestimosData)
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

  const abrirModalAcao = (emprestimo: Emprestimo, acaoTipo: "aprovar" | "rejeitar") => {
    setEmprestimoSelecionado(emprestimo)
    setAcao(acaoTipo)
    setObservacao("")
    setModalAberto(true)
  }

  const processarAcao = async () => {
    if (!emprestimoSelecionado || !acao) return

    try {
      const endpoint = acao === "aprovar" ? "aprovar" : "rejeitar"
      const response = await fetch(`${API_URL}/emprestimos/${emprestimoSelecionado.id}/${endpoint}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ observacao }),
      })

      if (response.ok) {
        await carregarDados()
        setModalAberto(false)
        setEmprestimoSelecionado(null)
        setAcao(null)
        setObservacao("")
      }
    } catch (error) {
      console.error("Erro ao processar ação:", error)
    }
  }

  const emprestimosFiltrados = emprestimos.filter((emp) => {
    const matchStatus = filtroStatus === "todos" || emp.status === filtroStatus
    const matchBusca = emp.funcionario.nome.toLowerCase().includes(filtroBusca.toLowerCase())
    return matchStatus && matchBusca
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pendente: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      aprovado: "bg-green-500/10 text-green-500 border-green-500/20",
      rejeitado: "bg-red-500/10 text-red-500 border-red-500/20",
      ativo: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      quitado: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    }
    const labels: Record<string, string> = {
      pendente: "Pendente",
      aprovado: "Aprovado",
      rejeitado: "Rejeitado",
      ativo: "Ativo",
      quitado: "Quitado",
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
          <p className="text-slate-400">Carregando empréstimos...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">Empréstimos</h1>
            <p className="text-slate-400">Gerencie os empréstimos dos funcionários</p>
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
              <CardTitle className="text-sm font-medium text-slate-400">Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-white">{estatisticas.total_ativos}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Quitados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-white">{estatisticas.total_quitados}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Total Emprestado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-white">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                  }).format(estatisticas.valor_total_emprestado)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">A Receber</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-white">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                  }).format(estatisticas.valor_total_receber)}
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
                  <SelectItem value="aprovado">Aprovados</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="quitado">Quitados</SelectItem>
                  <SelectItem value="rejeitado">Rejeitados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Empréstimos</CardTitle>
            <CardDescription className="text-slate-400">
              {emprestimosFiltrados.length} empréstimo(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-slate-300">Funcionário</TableHead>
                    <TableHead className="text-slate-300">Valor Total</TableHead>
                    <TableHead className="text-slate-300">Parcelas</TableHead>
                    <TableHead className="text-slate-300">Valor Parcela</TableHead>
                    <TableHead className="text-slate-300">Progresso</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emprestimosFiltrados.map((emp) => (
                    <TableRow key={emp.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{emp.funcionario.nome}</div>
                          <div className="text-sm text-slate-400">{emp.funcionario.cargo}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(emp.valor_total)}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {emp.parcelas_pagas}/{emp.numero_parcelas}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(emp.valor_parcela)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={(emp.parcelas_pagas / emp.numero_parcelas) * 100} className="h-2" />
                          <span className="text-xs text-slate-400">
                            {Math.round((emp.parcelas_pagas / emp.numero_parcelas) * 100)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(emp.status)}</TableCell>
                      <TableCell className="text-right">
                        {emp.status === "pendente" && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                              onClick={() => abrirModalAcao(emp, "aprovar")}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              onClick={() => abrirModalAcao(emp, "rejeitar")}
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
            <DialogTitle>{acao === "aprovar" ? "Aprovar" : "Rejeitar"} Empréstimo</DialogTitle>
            <DialogDescription className="text-slate-400">
              {emprestimoSelecionado && (
                <>
                  Funcionário: {emprestimoSelecionado.funcionario.nome} - Valor:{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(emprestimoSelecionado.valor_total)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="observacao" className="text-slate-300 text-sm">
                Observação {acao === "rejeitar" && "(obrigatória)"}
              </label>
              <Input
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Digite uma observação..."
                className="bg-slate-900/50 border-slate-700 text-white mt-2"
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
