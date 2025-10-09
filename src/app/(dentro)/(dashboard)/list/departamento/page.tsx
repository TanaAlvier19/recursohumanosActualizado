"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import Swal from "sweetalert2"
import { MetricCard } from "@/components/metrcCard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Building,
  DollarSign,
  TrendingUp,
  Search,
  Plus,
  Edit,
  Eye,
  MoreVertical,
  Download,
  Filter,
  MapPin,
  Settings,
  Briefcase,
  BarChart3,
  AlertCircle,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { fetchAPI } from "@/lib/api"

interface Departamento {
  id: string
  nome: string
  codigo: string
  descricao: string
  responsavel: string
  empresa: string
  local: string
  status: boolean
  data_criacao: string
  orcamento: number
  totalFuncionarios?: number
  vagasAbertas?: number
}

interface MetricasDepartamentos {
  totalDepartamentos: number
  totalFuncionarios: number
  orcamentoTotal: number
  orcamentoUtilizado: number
  departamentosAtivos: number
  custoMedioPorFuncionario: number
}

const useDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDepartamentos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [depResponse, funcResponse, vagasResponse] = await Promise.all([
        fetchAPI("/departamentos/"),
        fetchAPI("/valores/"),
        fetchAPI("/vagas/"),
      ])

      if (!depResponse.ok) throw new Error(`Erro ${depResponse.status}`)

      const departamentosData = await depResponse.json()
      const funcionariosData = await funcResponse.json()
      const vagasData = await vagasResponse.json()
      console.log(vagasData)
      const vagasPorDep: Record<string, number> = {}
      vagasData.forEach((vaga: any) => {
        const depNome = vaga.departamento_nome
        if (depNome) {
          vagasPorDep[depNome] = (vagasPorDep[depNome] || 0) + 1
        }})
      const funcionariosPorDep: Record<string, number> = {}
      funcionariosData.forEach((func: any) => {
        const depNome = func.departamento
        if (depNome) {
          funcionariosPorDep[depNome] = (funcionariosPorDep[depNome] || 0) + 1
        }
      })

      const departamentosFormatados: Departamento[] = departamentosData.map((dep: any) => ({
        id: dep.id.toString(),
        nome: dep.nome || "Sem nome",
        codigo: dep.codigo || "N/A",
        descricao: dep.descricao || "",
        responsavel: dep.responsavel || "Não definido",
        empresa: dep.empresa?.toString() || "",
        local: dep.local || "Não especificado",
        status: dep.status || false,
        data_criacao: dep.data_criacao || new Date().toISOString(),
        orcamento: Number.parseFloat(dep.orcamento) || 0,
        totalFuncionarios: funcionariosPorDep[dep.nome] || 0,
        vagasAbertas: vagasPorDep[dep.nome] || 0,
      }))
      console.log(vagasPorDep)
      setDepartamentos(departamentosFormatados)
    } 
    catch (error) {
      console.error("Erro ao buscar departamentos:", error)
      setError("Falha ao carregar departamentos")
      Swal.fire({
        title: "Erro",
        text: "Falha ao carregar departamentos. Verifique se o backend está rodando.",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDepartamentos()
  }, [fetchDepartamentos])

  return { departamentos, loading, error, refetchDepartamentos: fetchDepartamentos }
}

const useMetricasDepartamentos = (departamentos: Departamento[]): MetricasDepartamentos => {
  return useMemo(() => {
    if (!departamentos || departamentos.length === 0) {
      return {
        totalDepartamentos: 0,
        totalFuncionarios: 0,
        orcamentoTotal: 0,
        orcamentoUtilizado: 0,
        departamentosAtivos: 0,
        custoMedioPorFuncionario: 0,
      }
    }

    const totalFuncionarios = departamentos.reduce((acc, dep) => acc + (dep.totalFuncionarios || 0), 0)
    const orcamentoTotal = departamentos.reduce((acc, dep) => acc + (dep.orcamento || 0), 0)
    const orcamentoUtilizado = departamentos.reduce((acc, dep) => acc + (dep.orcamento || 0) * 0.75, 0)

    return {
      totalDepartamentos: departamentos.length,
      totalFuncionarios,
      orcamentoTotal,
      orcamentoUtilizado,
      departamentosAtivos: departamentos.filter((dep) => dep.status === true).length,
      custoMedioPorFuncionario: totalFuncionarios > 0 ? orcamentoTotal / totalFuncionarios : 0,
    }
  }, [departamentos])
}

const formatCurrency = (value: number | undefined | null, currency = "AOA") => {
  if (value === undefined || value === null || isNaN(value)) return "AOA 0"
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(value)
}

const formatDate = (dateString: string | undefined | null) => {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return "Data inválida"
  }
  return new Date(dateString).toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export default function DepartamentosDashboard() {
  const { departamentos, loading, refetchDepartamentos } = useDepartamentos()
  const metricas = useMetricasDepartamentos(departamentos)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("TODOS")
  const [sortField, setSortField] = useState<string>("nome")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [modalDepartamentoAberto, setModalDepartamentoAberto] = useState(false)
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false)
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState<Departamento | null>(null)

  const [nomeDepartamento, setNomeDepartamento] = useState("")
  const [codigoDepartamento, setCodigoDepartamento] = useState("")
  const [descricaoDepartamento, setDescricaoDepartamento] = useState("")
  const [responsavelDepartamento, setResponsavelDepartamento] = useState("")
  const [orcamentoDepartamento, setOrcamentoDepartamento] = useState("")
  const [localizacaoDepartamento, setLocalizacaoDepartamento] = useState("")
  const [statusDepartamento, setStatusDepartamento] = useState(true)

  const departamentosFiltrados = useMemo(() => {
    const filtered = departamentos.filter((dep) => {
      const matchesSearch =
        dep.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dep.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dep.responsavel.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === "TODOS" ||
        (statusFilter === "ATIVO" && dep.status) ||
        (statusFilter === "INATIVO" && !dep.status)

      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      const aValue: any = a[sortField as keyof Departamento]
      const bValue: any = b[sortField as keyof Departamento]

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [departamentos, searchTerm, statusFilter, sortField, sortDirection])

  const dadosGraficoFuncionarios = useMemo(() => {
    return departamentos.slice(0, 6).map((dep) => ({
      nome: dep.codigo,
      funcionarios: dep.totalFuncionarios || 0,
      vagas: dep.vagasAbertas || 0,
    }))
  }, [departamentos])

  const dadosGraficoOrcamento = useMemo(() => {
    return departamentos.slice(0, 6).map((dep) => ({
      nome: dep.codigo,
      utilizado: dep.orcamento * 0.75,
      disponivel: dep.orcamento * 0.25,
    }))
  }, [departamentos])

  const dadosGraficoPizza = useMemo(() => {
    return departamentos.map((dep) => ({
      name: dep.nome,
      value: dep.totalFuncionarios || 0,
    }))
  }, [departamentos])

  const PIE_COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#06b6d4"]

  const getStatusConfig = (status: boolean) => {
    return status
      ? { label: "Ativo", color: "bg-green-500/20 text-green-400 border-green-500/30" }
      : { label: "Inativo", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const criarDepartamento = async () => {
    try {
      if (!nomeDepartamento || !codigoDepartamento || !responsavelDepartamento || !orcamentoDepartamento) {
        Swal.fire({
          title: "Campos obrigatórios",
          text: "Preencha todos os campos obrigatórios",
          icon: "warning",
          background: "#1e293b",
          color: "white",
        })
        return
      }

      const novoDepartamento = {
        nome: nomeDepartamento,
        codigo: codigoDepartamento,
        descricao: descricaoDepartamento,
        responsavel: responsavelDepartamento,
        local: localizacaoDepartamento,
        orcamento: Number(orcamentoDepartamento),
        status: statusDepartamento,
      }

      const response = await fetchAPI("/departamentos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoDepartamento),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `Erro ${response.status}`)
      }

      Swal.fire({
        title: "Sucesso",
        text: "Departamento criado com sucesso",
        icon: "success",
        background: "#1e293b",
        color: "white",
      })

      setModalDepartamentoAberto(false)
      resetForm()
      refetchDepartamentos()
    } catch (error: any) {
      console.error("Erro ao criar departamento:", error)
      Swal.fire({
        title: "Erro",
        text: error.message || "Falha ao criar departamento",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    }
  }

  const resetForm = () => {
    setNomeDepartamento("")
    setCodigoDepartamento("")
    setDescricaoDepartamento("")
    setResponsavelDepartamento("")
    setOrcamentoDepartamento("")
    setLocalizacaoDepartamento("")
    setStatusDepartamento(true)
  }

  const visualizarDetalhes = (departamento: Departamento) => {
    setDepartamentoSelecionado(departamento)
    setModalDetalhesAberto(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-slate-700" />
          ))}
        </div>
        <Skeleton className="h-[500px] w-full rounded-xl bg-slate-700" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Gestão de Departamentos
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Visão completa de todos os departamentos, equipes e orçamentos
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto gap-2 border-slate-600 text-cyan-400 hover:bg-slate-700 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Exportar Relatório
            </Button>
            <Button
              onClick={() => setModalDepartamentoAberto(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Departamento
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Departamentos"
            value={metricas.totalDepartamentos.toString()}
            icon={Building}
            description={`${metricas.departamentosAtivos} ativos`}
            trend={{ value: 0, isPositive: true }}
          />
          <MetricCard
            title="Total Funcionários"
            value={metricas.totalFuncionarios.toString()}
            icon={Users}
            description="Colaboradores ativos"
            trend={{ value: 5.2, isPositive: true }}
          />
          <MetricCard
            title="Orçamento Total"
            value={formatCurrency(metricas.orcamentoTotal)}
            icon={DollarSign}
            description={`${((metricas.orcamentoUtilizado / metricas.orcamentoTotal) * 100 || 0).toFixed(0)}% utilizado`}
            trend={{ value: -3.1, isPositive: false }}
          />
          <MetricCard
            title="Custo Médio"
            value={formatCurrency(metricas.custoMedioPorFuncionario)}
            icon={TrendingUp}
            description="Por funcionário"
            trend={{ value: 2.8, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <CardTitle className="text-white">Lista de Departamentos</CardTitle>
                    <CardDescription className="text-slate-400">
                      {departamentosFiltrados.length} departamentos encontrados
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar departamentos..."
                        className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-40 bg-slate-700 border-slate-600 text-white">
                        <Filter className="h-4 w-4 mr-2 text-slate-400" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600 text-white">
                        <SelectItem value="TODOS">Todos</SelectItem>
                        <SelectItem value="ATIVO">Ativos</SelectItem>
                        <SelectItem value="INATIVO">Inativos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-slate-600">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-600 hover:bg-slate-700/50">
                        <TableHead className="w-[250px] text-slate-300">Departamento</TableHead>
                        <TableHead className="text-slate-300">Responsável</TableHead>
                        <TableHead className="text-slate-300">Funcionários</TableHead>
                        <TableHead className="text-slate-300">Orçamento</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-right text-slate-300">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departamentosFiltrados.map((departamento) => {
                        const statusInfo = getStatusConfig(departamento.status)
                        return (
                          <TableRow
                            key={departamento.id}
                            className="border-slate-600 hover:bg-slate-700/50 transition-colors"
                          >
                            <TableCell className="font-medium">
                              <div className="space-y-1">
                                <p className="font-semibold text-white">{departamento.nome}</p>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                                    {departamento.codigo}
                                  </Badge>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {departamento.local}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold text-xs">
                                  {departamento.responsavel.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">{departamento.responsavel}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-slate-400" />
                                <span className="font-semibold text-white">{departamento.totalFuncionarios}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <span className="font-semibold text-white">
                                  {formatCurrency(departamento.orcamento)}
                                </span>
                                <Progress value={75} className="h-1" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`w-fit ${statusInfo.color}`}>{statusInfo.label}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-600">
                                  <DropdownMenuItem
                                    className="text-slate-300 hover:bg-slate-700"
                                    onClick={() => visualizarDetalhes(departamento)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver Detalhes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                                    <Users className="h-4 w-4 mr-2" />
                                    Ver Funcionários
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-slate-600" />
                                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Configurações
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>

                  {departamentosFiltrados.length === 0 && (
                    <div className="text-center py-12">
                      <Building className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Nenhum departamento encontrado</h3>
                      <p className="text-slate-400 mb-6">
                        {searchTerm || statusFilter !== "TODOS"
                          ? "Tente ajustar os filtros de pesquisa"
                          : "Comece criando seu primeiro departamento"}
                      </p>
                      <Button
                        onClick={() => setModalDepartamentoAberto(true)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeiro Departamento
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-6 w-6 text-cyan-400" />
                  Analytics de Departamentos
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Métricas de desempenho e distribuição de recursos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="funcionarios" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                    <TabsTrigger value="funcionarios" className="text-slate-300 data-[state=active]:bg-slate-600">
                      Funcionários
                    </TabsTrigger>
                    <TabsTrigger value="orcamento" className="text-slate-300 data-[state=active]:bg-slate-600">
                      Orçamento
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="funcionarios" className="space-y-6 mt-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dadosGraficoFuncionarios}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                          <XAxis dataKey="nome" stroke="#cbd5e1" />
                          <YAxis stroke="#cbd5e1" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #475569",
                              borderRadius: "8px",
                              color: "white",
                            }}
                          />
                          <Legend />
                          <Bar dataKey="funcionarios" name="Funcionários" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="vagas" name="Vagas Abertas" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="orcamento" className="space-y-6 mt-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dadosGraficoOrcamento}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                          <XAxis dataKey="nome" stroke="#cbd5e1" />
                          <YAxis stroke="#cbd5e1" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #475569",
                              borderRadius: "8px",
                              color: "white",
                            }}
                            formatter={(value: number) => formatCurrency(value)}
                          />
                          <Legend />
                          <Bar dataKey="utilizado" name="Utilizado" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="disponivel" name="Disponível" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Distribuição</CardTitle>
                <CardDescription className="text-slate-400">Funcionários por departamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosGraficoPizza}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dadosGraficoPizza.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Top Departamentos</CardTitle>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    Top 3
                  </Badge>
                </div>
                <CardDescription className="text-slate-400">Maiores equipes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {departamentos
                  .sort((a, b) => (b.totalFuncionarios || 0) - (a.totalFuncionarios || 0))
                  .slice(0, 3)
                  .map((dep, index) => (
                    <div
                      key={dep.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-white">{dep.nome}</p>
                          <p className="text-xs text-slate-400">{dep.codigo}</p>
                        </div>
                      </div>
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        {dep.totalFuncionarios} funcionários
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Estatísticas Rápidas</CardTitle>
                <CardDescription className="text-slate-400">Visão geral do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Orçamento Disponível</span>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    {formatCurrency(metricas.orcamentoTotal - metricas.orcamentoUtilizado)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Custo/Funcionário</span>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {formatCurrency(metricas.custoMedioPorFuncionario)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Departamentos Ativos</span>
                  <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                    {metricas.departamentosAtivos}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 border-l-4 border-l-yellow-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-white text-base">Alerta de Orçamento</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300 mb-3">
                  {((metricas.orcamentoUtilizado / metricas.orcamentoTotal) * 100).toFixed(0)}% do orçamento total
                  utilizado
                </p>
                <Progress value={(metricas.orcamentoUtilizado / metricas.orcamentoTotal) * 100} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal Novo Departamento */}
        <Dialog open={modalDepartamentoAberto} onOpenChange={setModalDepartamentoAberto}>
          <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-600 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Criar Novo Departamento</DialogTitle>
              <DialogDescription className="text-slate-400">
                Preencha as informações do novo departamento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-slate-300">
                    Nome do Departamento *
                  </Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Tecnologia & Inovação"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={nomeDepartamento}
                    onChange={(e) => setNomeDepartamento(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigo" className="text-slate-300">
                    Código *
                  </Label>
                  <Input
                    id="codigo"
                    placeholder="Ex: TI"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={codigoDepartamento}
                    onChange={(e) => setCodigoDepartamento(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-slate-300">
                  Descrição
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva as responsabilidades e objetivos do departamento..."
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                  value={descricaoDepartamento}
                  onChange={(e) => setDescricaoDepartamento(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsavel" className="text-slate-300">
                    Responsável *
                  </Label>
                  <Input
                    id="responsavel"
                    placeholder="Ex: Carlos Silva"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={responsavelDepartamento}
                    onChange={(e) => setResponsavelDepartamento(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localizacao" className="text-slate-300">
                    Localização *
                  </Label>
                  <Input
                    id="localizacao"
                    placeholder="Ex: Luanda, Angola"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={localizacaoDepartamento}
                    onChange={(e) => setLocalizacaoDepartamento(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orcamento" className="text-slate-300">
                  Orçamento Anual (AOA) *
                </Label>
                <Input
                  id="orcamento"
                  type="number"
                  placeholder="Ex: 2500000"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={orcamentoDepartamento}
                  onChange={(e) => setOrcamentoDepartamento(e.target.value)}
                />
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ativo" className="text-slate-300">
                    Departamento Ativo
                  </Label>
                  <Switch id="ativo" checked={statusDepartamento} onCheckedChange={setStatusDepartamento} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setModalDepartamentoAberto(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={criarDepartamento}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                Criar Departamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Detalhes do Departamento */}
        <Dialog open={modalDetalhesAberto} onOpenChange={setModalDetalhesAberto}>
          <DialogContent className="sm:max-w-[700px] bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl">{departamentoSelecionado?.nome}</DialogTitle>
              <DialogDescription className="text-slate-400">Informações detalhadas do departamento</DialogDescription>
            </DialogHeader>
            {departamentoSelecionado && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm text-slate-400">Funcionários</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{departamentoSelecionado.totalFuncionarios}</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-slate-400">Vagas Abertas</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{departamentoSelecionado.vagasAbertas}</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-slate-400">Orçamento</span>
                    </div>
                    <p className="text-xl font-bold text-white">{formatCurrency(departamentoSelecionado.orcamento)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-slate-400">Descrição</Label>
                    <p className="text-white mt-1">{departamentoSelecionado.descricao || "Sem descrição"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-400">Responsável</Label>
                      <p className="text-white mt-1">{departamentoSelecionado.responsavel}</p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Localização</Label>
                      <p className="text-white mt-1">{departamentoSelecionado.local}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-400">Código</Label>
                      <p className="text-white mt-1">{departamentoSelecionado.codigo}</p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Data de Criação</Label>
                      <p className="text-white mt-1">{formatDate(departamentoSelecionado.data_criacao)}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-400">Status</Label>
                    <div className="mt-1">
                      <Badge className={`${getStatusConfig(departamentoSelecionado.status).color}`}>
                        {getStatusConfig(departamentoSelecionado.status).label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setModalDetalhesAberto(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Fechar
              </Button>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Editar Departamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
