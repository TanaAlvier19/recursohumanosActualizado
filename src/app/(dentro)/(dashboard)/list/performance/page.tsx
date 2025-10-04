"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Target, Plus, Eye, Edit, CheckCircle2, Clock, Star } from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts"

export default function PerformancePage() {
  const [selectedDepartment, setSelectedDepartment] = useState("todos")
  const [selectedPeriod, setSelectedPeriod] = useState("2024")
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false)

  const metricsCards = [
    {
      title: "Avaliações Concluídas",
      value: "156",
      change: "+23%",
      trend: "up",
      icon: CheckCircle2,
      description: "Este período",
    },
    {
      title: "Média Geral",
      value: "8.4",
      change: "+0.3",
      trend: "up",
      icon: Star,
      description: "De 10 pontos",
    },
    {
      title: "Pendentes",
      value: "24",
      change: "-12",
      trend: "up",
      icon: Clock,
      description: "Aguardando avaliação",
    },
    {
      title: "Planos de Ação",
      value: "45",
      change: "+8",
      trend: "up",
      icon: Target,
      description: "Em andamento",
    },
  ]

  const avaliacoes = [
    {
      id: 1,
      funcionario: "Ana Silva",
      cargo: "Desenvolvedora Senior",
      departamento: "TI",
      avaliador: "Carlos Santos",
      periodo: "2024 - 1º Semestre",
      status: "concluida",
      notaFinal: 9.2,
      dataAvaliacao: "2024-01-10",
      competencias: {
        tecnica: 9.5,
        comunicacao: 8.8,
        lideranca: 9.0,
        trabalhoEquipe: 9.3,
        inovacao: 9.5,
      },
    },
    {
      id: 2,
      funcionario: "Bruno Costa",
      cargo: "Analista de Marketing",
      departamento: "Marketing",
      avaliador: "Maria Oliveira",
      periodo: "2024 - 1º Semestre",
      status: "concluida",
      notaFinal: 8.5,
      dataAvaliacao: "2024-01-09",
      competencias: {
        tecnica: 8.5,
        comunicacao: 9.0,
        lideranca: 7.8,
        trabalhoEquipe: 8.7,
        inovacao: 8.5,
      },
    },
    {
      id: 3,
      funcionario: "Carla Mendes",
      cargo: "Gerente de Vendas",
      departamento: "Comercial",
      avaliador: "João Pereira",
      periodo: "2024 - 1º Semestre",
      status: "pendente",
      notaFinal: null,
      dataAvaliacao: null,
      competencias: null,
    },
    {
      id: 4,
      funcionario: "Daniel Souza",
      cargo: "Designer UX",
      departamento: "Produto",
      avaliador: "Paula Lima",
      periodo: "2024 - 1º Semestre",
      status: "em_andamento",
      notaFinal: null,
      dataAvaliacao: null,
      competencias: null,
    },
  ]

  const competenciasData = [
    { competencia: "Técnica", value: 8.5 },
    { competencia: "Comunicação", value: 8.8 },
    { competencia: "Liderança", value: 7.9 },
    { competencia: "Trabalho em Equipe", value: 8.6 },
    { competencia: "Inovação", value: 8.3 },
  ]

  const evolucaoDesempenho = [
    { periodo: "2023 Q1", media: 7.8 },
    { periodo: "2023 Q2", media: 8.0 },
    { periodo: "2023 Q3", media: 8.2 },
    { periodo: "2023 Q4", media: 8.3 },
    { periodo: "2024 Q1", media: 8.4 },
  ]

  const desempenhoPorDepartamento = [
    { departamento: "TI", media: 8.9, total: 45 },
    { departamento: "Marketing", media: 8.5, total: 32 },
    { departamento: "Comercial", media: 8.3, total: 38 },
    { departamento: "Produto", media: 8.7, total: 28 },
    { departamento: "RH", media: 8.6, total: 15 },
  ]

  const getStatusBadge = (status: string) => {
    const badges = {
      concluida: { label: "Concluída", className: "bg-green-500/10 text-green-400 border-green-500/20" },
      pendente: { label: "Pendente", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
      em_andamento: { label: "Em Andamento", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    }
    return badges[status as keyof typeof badges] || badges.pendente
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestão de Performance</h1>
            <p className="text-slate-400">Avaliações de desempenho e desenvolvimento de colaboradores</p>
          </div>
          <Dialog open={showAvaliacaoModal} onOpenChange={setShowAvaliacaoModal}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Nova Avaliação
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Avaliação de Performance</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Preencha os dados para criar uma nova avaliação
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Funcionário</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1">Ana Silva</SelectItem>
                        <SelectItem value="2">Bruno Costa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Avaliador</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1">Carlos Santos</SelectItem>
                        <SelectItem value="2">Maria Oliveira</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Período de Avaliação</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="2024-1">2024 - 1º Semestre</SelectItem>
                      <SelectItem value="2024-2">2024 - 2º Semestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Competências (0-10)</Label>
                  {["Técnica", "Comunicação", "Liderança", "Trabalho em Equipe", "Inovação"].map((comp) => (
                    <div key={comp} className="flex items-center gap-4">
                      <Label className="w-40 text-slate-300">{comp}</Label>
                      <Input type="number" min="0" max="10" step="0.1" className="bg-slate-800 border-slate-700" />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Pontos Fortes</Label>
                  <Textarea
                    className="bg-slate-800 border-slate-700 min-h-[80px]"
                    placeholder="Descreva os pontos fortes..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pontos de Melhoria</Label>
                  <Textarea
                    className="bg-slate-800 border-slate-700 min-h-[80px]"
                    placeholder="Descreva os pontos de melhoria..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Plano de Desenvolvimento</Label>
                  <Textarea
                    className="bg-slate-800 border-slate-700 min-h-[80px]"
                    placeholder="Defina ações de desenvolvimento..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    Salvar Avaliação
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-700 bg-transparent"
                    onClick={() => setShowAvaliacaoModal(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricsCards.map((metric, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                    <metric.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                    {metric.change}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
                <p className="text-sm text-slate-400">{metric.title}</p>
                <p className="text-xs text-slate-500 mt-1">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filtros */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Departamento</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ti">TI</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="produto">Produto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Período</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Buscar</Label>
                <Input placeholder="Nome do funcionário..." className="bg-slate-900 border-slate-700 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="avaliacoes" className="space-y-4">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger
              value="avaliacoes"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
            >
              Avaliações
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Avaliações */}
          <TabsContent value="avaliacoes" className="space-y-4">
            {avaliacoes.map((avaliacao) => {
              const statusBadge = getStatusBadge(avaliacao.status)
              return (
                <Card
                  key={avaliacao.id}
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-white">{avaliacao.funcionario}</h3>
                          <Badge variant="secondary" className={statusBadge.className}>
                            {statusBadge.label}
                          </Badge>
                          {avaliacao.notaFinal && (
                            <Badge
                              variant="secondary"
                              className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/20"
                            >
                              <Star className="w-3 h-3 mr-1" />
                              {avaliacao.notaFinal}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400">
                          <div>
                            <span className="text-slate-500">Cargo:</span> {avaliacao.cargo}
                          </div>
                          <div>
                            <span className="text-slate-500">Departamento:</span> {avaliacao.departamento}
                          </div>
                          <div>
                            <span className="text-slate-500">Avaliador:</span> {avaliacao.avaliador}
                          </div>
                          <div>
                            <span className="text-slate-500">Período:</span> {avaliacao.periodo}
                          </div>
                        </div>
                        {avaliacao.dataAvaliacao && (
                          <div className="text-sm text-slate-500 mt-2">Avaliado em: {avaliacao.dataAvaliacao}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-700 text-slate-300 hover:bg-slate-700 bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-700 text-slate-300 hover:bg-slate-700 bg-transparent"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Competências Médias */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Competências Médias</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={competenciasData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="competencia" stroke="#94a3b8" />
                      <PolarRadiusAxis stroke="#94a3b8" />
                      <Radar name="Média" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Evolução do Desempenho */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Evolução do Desempenho</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={evolucaoDesempenho}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="periodo" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" domain={[0, 10]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Line type="monotone" dataKey="media" stroke="#06b6d4" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Desempenho por Departamento */}
              <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Desempenho por Departamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={desempenhoPorDepartamento}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="departamento" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" domain={[0, 10]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Bar dataKey="media" fill="#06b6d4" name="Média" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
