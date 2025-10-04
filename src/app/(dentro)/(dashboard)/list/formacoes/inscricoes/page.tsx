"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, CheckCircle, XCircle, Clock, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function InscricoesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [selectedInscricao, setSelectedInscricao] = useState<any>(null)

  const inscricoes = [
    {
      id: 1,
      funcionario: "João Silva",
      matricula: "F001",
      departamento: "TI",
      formacao: "Liderança Estratégica",
      dataInscricao: "2024-01-15",
      dataInicio: "2024-02-01",
      status: "Pendente",
      prioridade: "Alta",
      justificativa: "Necessário para assumir cargo de gestão",
      aprovador: "Maria Santos",
    },
    {
      id: 2,
      funcionario: "Maria Costa",
      matricula: "F002",
      departamento: "Vendas",
      formacao: "Técnicas de Negociação",
      dataInscricao: "2024-01-14",
      dataInicio: "2024-01-25",
      status: "Aprovada",
      prioridade: "Média",
      justificativa: "Desenvolvimento de habilidades comerciais",
      aprovador: "Carlos Lima",
    },
    {
      id: 3,
      funcionario: "Pedro Santos",
      matricula: "F003",
      departamento: "RH",
      formacao: "Gestão de Pessoas",
      dataInscricao: "2024-01-13",
      dataInicio: "2024-02-10",
      status: "Reprovada",
      prioridade: "Baixa",
      justificativa: "Interesse pessoal em desenvolvimento",
      aprovador: "Ana Paula",
      motivoReprovacao: "Orçamento insuficiente no período",
    },
    {
      id: 4,
      funcionario: "Ana Oliveira",
      matricula: "F004",
      departamento: "Marketing",
      formacao: "Marketing Digital Avançado",
      dataInscricao: "2024-01-16",
      dataInicio: "2024-02-05",
      status: "Pendente",
      prioridade: "Alta",
      justificativa: "Alinhamento com estratégia digital da empresa",
      aprovador: "Roberto Mendes",
    },
    {
      id: 5,
      funcionario: "Carlos Ferreira",
      matricula: "F005",
      departamento: "Financeiro",
      formacao: "Excel Avançado",
      dataInscricao: "2024-01-12",
      dataInicio: "2024-01-30",
      status: "Aprovada",
      prioridade: "Média",
      justificativa: "Otimização de processos financeiros",
      aprovador: "Juliana Costa",
    },
  ]

  const stats = {
    total: 156,
    pendentes: 42,
    aprovadas: 98,
    reprovadas: 16,
  }

  const filteredInscricoes = inscricoes.filter((inscricao) => {
    const matchesSearch =
      inscricao.funcionario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscricao.formacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscricao.departamento.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "todos" || inscricao.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprovada":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "reprovada":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "pendente":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
    }
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade.toLowerCase()) {
      case "alta":
        return "bg-red-500/20 text-red-400"
      case "média":
        return "bg-yellow-500/20 text-yellow-400"
      case "baixa":
        return "bg-blue-500/20 text-blue-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestão de Inscrições</h1>
          <p className="text-slate-400">Aprove ou reprove solicitações de inscrição em formações</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Inscrições</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pendentes</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.pendentes}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Aprovadas</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">{stats.aprovadas}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Reprovadas</p>
                  <p className="text-3xl font-bold text-red-400 mt-1">{stats.reprovadas}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por funcionário, formação ou departamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovada">Aprovada</SelectItem>
                  <SelectItem value="reprovada">Reprovada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inscrições Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Solicitações de Inscrição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Funcionário</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Formação</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Departamento</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Data Inscrição</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Prioridade</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInscricoes.map((inscricao) => (
                    <tr key={inscricao.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white font-medium">{inscricao.funcionario}</p>
                          <p className="text-slate-400 text-sm">{inscricao.matricula}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{inscricao.formacao}</td>
                      <td className="py-4 px-4 text-slate-300">{inscricao.departamento}</td>
                      <td className="py-4 px-4 text-slate-300">
                        {new Date(inscricao.dataInscricao).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getPrioridadeColor(inscricao.prioridade)}>{inscricao.prioridade}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(inscricao.status)}>{inscricao.status}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 bg-transparent"
                              onClick={() => setSelectedInscricao(inscricao)}
                            >
                              Detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Inscrição</DialogTitle>
                            </DialogHeader>
                            {selectedInscricao && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-slate-400 text-sm">Funcionário</p>
                                    <p className="text-white font-medium">{selectedInscricao.funcionario}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-400 text-sm">Matrícula</p>
                                    <p className="text-white font-medium">{selectedInscricao.matricula}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-400 text-sm">Departamento</p>
                                    <p className="text-white font-medium">{selectedInscricao.departamento}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-400 text-sm">Formação</p>
                                    <p className="text-white font-medium">{selectedInscricao.formacao}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-400 text-sm">Data de Inscrição</p>
                                    <p className="text-white font-medium">
                                      {new Date(selectedInscricao.dataInscricao).toLocaleDateString("pt-BR")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-slate-400 text-sm">Data de Início</p>
                                    <p className="text-white font-medium">
                                      {new Date(selectedInscricao.dataInicio).toLocaleDateString("pt-BR")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-slate-400 text-sm">Prioridade</p>
                                    <Badge className={getPrioridadeColor(selectedInscricao.prioridade)}>
                                      {selectedInscricao.prioridade}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-slate-400 text-sm">Status</p>
                                    <Badge className={getStatusColor(selectedInscricao.status)}>
                                      {selectedInscricao.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-slate-400 text-sm mb-1">Justificativa</p>
                                  <p className="text-white bg-slate-700/50 p-3 rounded-lg">
                                    {selectedInscricao.justificativa}
                                  </p>
                                </div>
                                {selectedInscricao.motivoReprovacao && (
                                  <div>
                                    <p className="text-slate-400 text-sm mb-1">Motivo da Reprovação</p>
                                    <p className="text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                                      {selectedInscricao.motivoReprovacao}
                                    </p>
                                  </div>
                                )}
                                {selectedInscricao.status === "Pendente" && (
                                  <div className="space-y-3 pt-4 border-t border-slate-700">
                                    <Textarea
                                      placeholder="Adicione um comentário (opcional)..."
                                      className="bg-slate-700 border-slate-600"
                                      rows={3}
                                    />
                                    <div className="flex gap-2">
                                      <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Aprovar
                                      </Button>
                                      <Button className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reprovar
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
