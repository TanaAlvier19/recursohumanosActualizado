"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, CheckCircle, XCircle, Clock, Users, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { inscricaoAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function InscricoesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [inscricoes, setInscricoes] = useState<any[]>([])
  const [selectedInscricao, setSelectedInscricao] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadInscricoes()
  }, [filterStatus])

  const loadInscricoes = async () => {
    try {
      setLoading(true)
      const filters: any = {}
      if (filterStatus !== "todos") filters.status = filterStatus

      const data = await inscricaoAPI.list(filters)
      setInscricoes(data)
    } catch (error: any) {
      toast({
        title: "Erro ao carregar inscrições",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAprovar = async (id: number) => {
    try {
      await inscricaoAPI.update(id, { status: "APROVADA" })
      toast({
        title: "Sucesso",
        description: "Inscrição aprovada com sucesso!",
      })
      loadInscricoes()
    } catch (error: any) {
      toast({
        title: "Erro ao aprovar inscrição",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleReprovar = async (id: number) => {
    try {
      await inscricaoAPI.update(id, { status: "REPROVADA" })
      toast({
        title: "Sucesso",
        description: "Inscrição reprovada.",
      })
      loadInscricoes()
    } catch (error: any) {
      toast({
        title: "Erro ao reprovar inscrição",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const filteredInscricoes = inscricoes.filter((inscricao) => {
    const matchesSearch =
      inscricao.funcionario?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscricao.formacao?.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APROVADA":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "REPROVADA":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "PENDENTE":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "CONCLUIDA":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
    }
  }

  const stats = {
    total: inscricoes.length,
    pendentes: inscricoes.filter((i) => i.status === "PENDENTE").length,
    aprovadas: inscricoes.filter((i) => i.status === "APROVADA").length,
    reprovadas: inscricoes.filter((i) => i.status === "REPROVADA").length,
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
                  placeholder="Buscar por funcionário ou formação..."
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
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="APROVADA">Aprovada</SelectItem>
                  <SelectItem value="REPROVADA">Reprovada</SelectItem>
                  <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        )}

        {/* Inscrições Table */}
        {!loading && (
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
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Data Inscrição</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInscricoes.map((inscricao) => (
                      <tr key={inscricao.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-4 px-4">
                          <p className="text-white font-medium">{inscricao.funcionario?.nome || "N/A"}</p>
                        </td>
                        <td className="py-4 px-4 text-slate-300">{inscricao.formacao?.titulo || "N/A"}</td>
                        <td className="py-4 px-4 text-slate-300">
                          {inscricao.data_inscricao
                            ? new Date(inscricao.data_inscricao).toLocaleDateString("pt-BR")
                            : "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(inscricao.status)}>{inscricao.status || "N/A"}</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            {inscricao.status === "PENDENTE" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleAprovar(inscricao.id)}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleReprovar(inscricao.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
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
                                        <p className="text-white font-medium">
                                          {selectedInscricao.funcionario?.nome || "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-slate-400 text-sm">Formação</p>
                                        <p className="text-white font-medium">
                                          {selectedInscricao.formacao?.titulo || "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-slate-400 text-sm">Data de Inscrição</p>
                                        <p className="text-white font-medium">
                                          {selectedInscricao.data_inscricao
                                            ? new Date(selectedInscricao.data_inscricao).toLocaleDateString("pt-BR")
                                            : "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-slate-400 text-sm">Status</p>
                                        <Badge className={getStatusColor(selectedInscricao.status)}>
                                          {selectedInscricao.status || "N/A"}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && filteredInscricoes.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-12 text-center">
              <p className="text-slate-400">Nenhuma inscrição encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
