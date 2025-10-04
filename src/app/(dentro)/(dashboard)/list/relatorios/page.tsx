"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Download,
  Calendar,
  Filter,
  PieChart,
  LineChart,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import {
  LineChart as RechartsLine,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function RelatoriosPage() {
  const [selectedModule, setSelectedModule] = useState("todos")
  const [selectedPeriod, setSelectedPeriod] = useState("mes")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  // Dados para relatórios consolidados
  const modulosData = [
    { name: "Folha Pagamento", value: 450000, color: "#06b6d4" },
    { name: "Formações", value: 85000, color: "#3b82f6" },
    { name: "Recrutamento", value: 120000, color: "#8b5cf6" },
    { name: "Assiduidade", value: 35000, color: "#10b981" },
  ]

  const evolucaoMensal = [
    { mes: "Jan", folha: 420000, formacoes: 75000, recrutamento: 95000, assiduidade: 30000 },
    { mes: "Fev", folha: 425000, formacoes: 78000, recrutamento: 105000, assiduidade: 32000 },
    { mes: "Mar", folha: 435000, formacoes: 82000, recrutamento: 115000, assiduidade: 33000 },
    { mes: "Abr", folha: 440000, formacoes: 80000, recrutamento: 110000, assiduidade: 34000 },
    { mes: "Mai", folha: 445000, formacoes: 83000, recrutamento: 118000, assiduidade: 34500 },
    { mes: "Jun", folha: 450000, formacoes: 85000, recrutamento: 120000, assiduidade: 35000 },
  ]

  const relatoriosDisponiveis = [
    {
      id: 1,
      nome: "Relatório Consolidado de RH",
      descricao: "Visão completa de todos os módulos do sistema",
      modulo: "Todos",
      tipo: "Consolidado",
      formato: "PDF",
      ultimaGeracao: "2024-01-15",
      status: "disponivel",
    },
    {
      id: 2,
      nome: "Análise de Custos com Pessoal",
      descricao: "Folha de pagamento, benefícios e encargos",
      modulo: "Folha de Pagamento",
      tipo: "Financeiro",
      formato: "Excel",
      ultimaGeracao: "2024-01-14",
      status: "disponivel",
    },
    {
      id: 3,
      nome: "Efetividade de Formações",
      descricao: "ROI e impacto das formações realizadas",
      modulo: "Formações",
      tipo: "Analítico",
      formato: "PDF",
      ultimaGeracao: "2024-01-13",
      status: "disponivel",
    },
    {
      id: 4,
      nome: "Funil de Recrutamento",
      descricao: "Análise completa do processo seletivo",
      modulo: "Recrutamento",
      tipo: "Operacional",
      formato: "PDF",
      ultimaGeracao: "2024-01-12",
      status: "processando",
    },
    {
      id: 5,
      nome: "Índices de Assiduidade",
      descricao: "Faltas, atrasos e justificativas",
      modulo: "Assiduidade",
      tipo: "Operacional",
      formato: "Excel",
      ultimaGeracao: "2024-01-11",
      status: "disponivel",
    },
    {
      id: 6,
      nome: "Performance por Departamento",
      descricao: "Avaliações e indicadores de desempenho",
      modulo: "Performance",
      tipo: "Analítico",
      formato: "PDF",
      ultimaGeracao: "2024-01-10",
      status: "disponivel",
    },
  ]

  const relatoriosAgendados = [
    {
      id: 1,
      nome: "Relatório Mensal de RH",
      frequencia: "Mensal",
      proximaGeracao: "2024-02-01",
      destinatarios: ["diretoria@empresa.com", "rh@empresa.com"],
      ativo: true,
    },
    {
      id: 2,
      nome: "Análise Semanal de Recrutamento",
      frequencia: "Semanal",
      proximaGeracao: "2024-01-22",
      destinatarios: ["recrutamento@empresa.com"],
      ativo: true,
    },
    {
      id: 3,
      nome: "Relatório Trimestral de Custos",
      frequencia: "Trimestral",
      proximaGeracao: "2024-04-01",
      destinatarios: ["financeiro@empresa.com", "diretoria@empresa.com"],
      ativo: true,
    },
  ]

  const metricsCards = [
    {
      title: "Relatórios Gerados",
      value: "248",
      change: "+12%",
      trend: "up",
      icon: FileText,
      description: "Este mês",
    },
    {
      title: "Downloads",
      value: "1.2K",
      change: "+8%",
      trend: "up",
      icon: Download,
      description: "Total de downloads",
    },
    {
      title: "Agendamentos Ativos",
      value: "15",
      change: "+3",
      trend: "up",
      icon: Calendar,
      description: "Relatórios automáticos",
    },
    {
      title: "Tempo Médio",
      value: "2.5min",
      change: "-15%",
      trend: "up",
      icon: Clock,
      description: "Geração de relatórios",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Relatórios</h1>
            <p className="text-slate-400">Gere e agende relatórios consolidados do sistema de RH</p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            <FileText className="w-4 h-4 mr-2" />
            Novo Relatório
          </Button>
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
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-cyan-400" />
              Filtros de Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Módulo</Label>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="todos">Todos os Módulos</SelectItem>
                    <SelectItem value="folha">Folha de Pagamento</SelectItem>
                    <SelectItem value="formacoes">Formações</SelectItem>
                    <SelectItem value="recrutamento">Recrutamento</SelectItem>
                    <SelectItem value="assiduidade">Assiduidade</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
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
                    <SelectItem value="semana">Última Semana</SelectItem>
                    <SelectItem value="mes">Último Mês</SelectItem>
                    <SelectItem value="trimestre">Último Trimestre</SelectItem>
                    <SelectItem value="ano">Último Ano</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Data Início</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Data Fim</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="disponiveis" className="space-y-4">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger
              value="disponiveis"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
            >
              Relatórios Disponíveis
            </TabsTrigger>
            <TabsTrigger
              value="agendados"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
            >
              Agendamentos
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Relatórios Disponíveis */}
          <TabsContent value="disponiveis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatoriosDisponiveis.map((relatorio) => (
                <Card
                  key={relatorio.id}
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2">{relatorio.nome}</CardTitle>
                        <CardDescription className="text-slate-400">{relatorio.descricao}</CardDescription>
                      </div>
                      {relatorio.status === "disponivel" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                          {relatorio.modulo}
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {relatorio.tipo}
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                          {relatorio.formato}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="w-4 h-4" />
                        Última geração: {relatorio.ultimaGeracao}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                          disabled={relatorio.status === "processando"}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-700 text-slate-300 hover:bg-slate-700 bg-transparent"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Agendamentos */}
          <TabsContent value="agendados" className="space-y-4">
            {relatoriosAgendados.map((agendamento) => (
              <Card key={agendamento.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{agendamento.nome}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {agendamento.frequencia}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Próxima: {agendamento.proximaGeracao}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {agendamento.destinatarios.length} destinatários
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {agendamento.destinatarios.map((email, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-slate-700 text-slate-300">
                            {email}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={
                          agendamento.ativo
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }
                      >
                        {agendamento.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-700 bg-transparent"
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Distribuição por Módulo */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-cyan-400" />
                    Distribuição por Módulo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={modulosData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {modulosData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Evolução Mensal */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-cyan-400" />
                    Evolução Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLine data={evolucaoMensal}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="mes" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="folha" stroke="#06b6d4" name="Folha" />
                      <Line type="monotone" dataKey="formacoes" stroke="#3b82f6" name="Formações" />
                      <Line type="monotone" dataKey="recrutamento" stroke="#8b5cf6" name="Recrutamento" />
                      <Line type="monotone" dataKey="assiduidade" stroke="#10b981" name="Assiduidade" />
                    </RechartsLine>
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
