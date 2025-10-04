"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Download, RefreshCw, Target, Award } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("ano")

  const metricsCards = [
    {
      title: "Total de Colaboradores",
      value: "487",
      change: "+12%",
      trend: "up",
      icon: Users,
      description: "vs período anterior",
    },
    {
      title: "Custo Total com Pessoal",
      value: "€2.4M",
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      description: "Este ano",
    },
    {
      title: "Taxa de Retenção",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: Target,
      description: "Últimos 12 meses",
    },
    {
      title: "Satisfação Média",
      value: "8.6",
      change: "+0.4",
      trend: "up",
      icon: Award,
      description: "De 10 pontos",
    },
  ]

  // Dados de evolução de colaboradores
  const evolucaoColaboradores = [
    { mes: "Jan", ativos: 450, admissoes: 12, demissoes: 5 },
    { mes: "Fev", ativos: 457, admissoes: 15, demissoes: 8 },
    { mes: "Mar", ativos: 464, admissoes: 18, demissoes: 11 },
    { mes: "Abr", ativos: 471, admissoes: 14, demissoes: 7 },
    { mes: "Mai", ativos: 478, admissoes: 16, demissoes: 9 },
    { mes: "Jun", ativos: 485, admissoes: 13, demissoes: 6 },
    { mes: "Jul", ativos: 487, admissoes: 10, demissoes: 8 },
  ]

  // Distribuição por departamento
  const distribuicaoDepartamento = [
    { name: "TI", value: 125, color: "#06b6d4" },
    { name: "Comercial", value: 98, color: "#3b82f6" },
    { name: "Marketing", value: 67, color: "#8b5cf6" },
    { name: "Operações", value: 89, color: "#10b981" },
    { name: "Financeiro", value: 45, color: "#f59e0b" },
    { name: "RH", value: 32, color: "#ef4444" },
    { name: "Outros", value: 31, color: "#6b7280" },
  ]

  // Custos por categoria
  const custosPorCategoria = [
    { categoria: "Salários", valor: 1800000, percentual: 75 },
    { categoria: "Benefícios", valor: 360000, percentual: 15 },
    { categoria: "Formações", valor: 120000, percentual: 5 },
    { categoria: "Recrutamento", valor: 72000, percentual: 3 },
    { categoria: "Outros", valor: 48000, percentual: 2 },
  ]

  // Indicadores de assiduidade
  const assiduidadeData = [
    { mes: "Jan", presenca: 96.5, faltas: 2.1, atrasos: 1.4 },
    { mes: "Fev", presenca: 95.8, faltas: 2.5, atrasos: 1.7 },
    { mes: "Mar", presenca: 96.2, faltas: 2.3, atrasos: 1.5 },
    { mes: "Abr", presenca: 97.1, faltas: 1.8, atrasos: 1.1 },
    { mes: "Mai", presenca: 96.8, faltas: 2.0, atrasos: 1.2 },
    { mes: "Jun", presenca: 97.3, faltas: 1.7, atrasos: 1.0 },
  ]

  // Performance de recrutamento
  const recrutamentoData = [
    { mes: "Jan", vagas: 15, candidatos: 245, contratacoes: 12 },
    { mes: "Fev", vagas: 18, candidatos: 298, contratacoes: 15 },
    { mes: "Mar", vagas: 22, candidatos: 356, contratacoes: 18 },
    { mes: "Abr", vagas: 17, candidatos: 287, contratacoes: 14 },
    { mes: "Mai", vagas: 20, candidatos: 312, contratacoes: 16 },
    { mes: "Jun", vagas: 16, candidatos: 268, contratacoes: 13 },
  ]

  // Investimento em formações
  const formacoesData = [
    { mes: "Jan", investimento: 18000, participantes: 85, horas: 340 },
    { mes: "Fev", investimento: 22000, participantes: 102, horas: 408 },
    { mes: "Mar", investimento: 25000, participantes: 118, horas: 472 },
    { mes: "Abr", investimento: 20000, participantes: 95, horas: 380 },
    { mes: "Mai", investimento: 23000, participantes: 108, horas: 432 },
    { mes: "Jun", investimento: 21000, participantes: 98, horas: 392 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics & BI</h1>
            <p className="text-slate-400">Análise completa e inteligência de negócio do sistema de RH</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Período Selector */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-slate-300 font-medium">Período:</span>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48 bg-slate-900 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="semana">Última Semana</SelectItem>
                  <SelectItem value="mes">Último Mês</SelectItem>
                  <SelectItem value="trimestre">Último Trimestre</SelectItem>
                  <SelectItem value="semestre">Último Semestre</SelectItem>
                  <SelectItem value="ano">Último Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

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

        {/* Tabs */}
        <Tabs defaultValue="geral" className="space-y-4">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger
              value="geral"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="financeiro"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
            >
              Financeiro
            </TabsTrigger>
            <TabsTrigger
              value="operacional"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
            >
              Operacional
            </TabsTrigger>
            <TabsTrigger
              value="desenvolvimento"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
            >
              Desenvolvimento
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="geral" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Evolução de Colaboradores */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Evolução de Colaboradores</CardTitle>
                  <CardDescription className="text-slate-400">Admissões e demissões mensais</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={evolucaoColaboradores}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="mes" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="ativos"
                        stroke="#06b6d4"
                        fill="#06b6d4"
                        fillOpacity={0.6}
                        name="Ativos"
                      />
                      <Area
                        type="monotone"
                        dataKey="admissoes"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.4}
                        name="Admissões"
                      />
                      <Area
                        type="monotone"
                        dataKey="demissoes"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.4}
                        name="Demissões"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribuição por Departamento */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Distribuição por Departamento</CardTitle>
                  <CardDescription className="text-slate-400">Total de colaboradores por área</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={distribuicaoDepartamento}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distribuicaoDepartamento.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financeiro */}
          <TabsContent value="financeiro" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Custos por Categoria</CardTitle>
                <CardDescription className="text-slate-400">Distribuição de investimentos em RH</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={custosPorCategoria} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="categoria" type="category" stroke="#94a3b8" width={120} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                      labelStyle={{ color: "#fff" }}
                      formatter={(value: number) => `€${value.toLocaleString()}`}
                    />
                    <Bar dataKey="valor" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operacional */}
          <TabsContent value="operacional" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Assiduidade */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Indicadores de Assiduidade</CardTitle>
                  <CardDescription className="text-slate-400">Presença, faltas e atrasos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={assiduidadeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="mes" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="presenca" stroke="#10b981" name="Presença %" />
                      <Line type="monotone" dataKey="faltas" stroke="#ef4444" name="Faltas %" />
                      <Line type="monotone" dataKey="atrasos" stroke="#f59e0b" name="Atrasos %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recrutamento */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Performance de Recrutamento</CardTitle>
                  <CardDescription className="text-slate-400">Vagas, candidatos e contratações</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={recrutamentoData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="mes" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Bar dataKey="vagas" fill="#8b5cf6" name="Vagas" />
                      <Bar dataKey="contratacoes" fill="#06b6d4" name="Contratações" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Desenvolvimento */}
          <TabsContent value="desenvolvimento" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Investimento em Formações</CardTitle>
                <CardDescription className="text-slate-400">Custos, participantes e horas de formação</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={formacoesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="mes" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Bar dataKey="investimento" fill="#06b6d4" name="Investimento (€)" />
                    <Bar dataKey="participantes" fill="#3b82f6" name="Participantes" />
                    <Bar dataKey="horas" fill="#8b5cf6" name="Horas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
