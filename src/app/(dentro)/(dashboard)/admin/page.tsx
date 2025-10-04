"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Briefcase,
  GraduationCap,
  DollarSign,
  Calendar,
  Building2,
  AlertCircle,
  UserCheck,
  Settings,
  Bell,
  ArrowRight,
  Activity,
} from "lucide-react"
import {
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
} from "recharts"

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Dados consolidados de todos os módulos
  const overallMetrics = [
    {
      title: "Total de Funcionários",
      value: "1.247",
      change: "+12",
      trend: "up",
      icon: Users,
      color: "cyan",
    },
    {
      title: "Folha de Pagamento Mensal",
      value: "R$ 2.8M",
      change: "+5.2%",
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Taxa de Assiduidade",
      value: "96.8%",
      change: "+2.1%",
      trend: "up",
      icon: UserCheck,
      color: "blue",
    },
    {
      title: "Vagas Abertas",
      value: "23",
      change: "-5",
      trend: "down",
      icon: Briefcase,
      color: "purple",
    },
  ]

  const modules = [
    {
      name: "Folha de Pagamento",
      icon: DollarSign,
      description: "Gestão de salários e benefícios",
      href: "/list/folha-pagamento",
      stats: { active: "1.247 funcionários", pending: "12 pendências" },
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Assiduidade",
      icon: Calendar,
      description: "Controle de presenças e faltas",
      href: "/admin/assiduidade",
      stats: { active: "96.8% presença", pending: "8 justificativas" },
      color: "from-blue-500 to-cyan-600",
    },
    {
      name: "Departamentos",
      icon: Building2,
      description: "Gestão de departamentos",
      href: "/admin/departamentos",
      stats: { active: "18 departamentos", pending: "3 reestruturações" },
      color: "from-purple-500 to-pink-600",
    },
    {
      name: "Formações",
      icon: GraduationCap,
      description: "Treinamentos e desenvolvimento",
      href: "/admin/formacoes",
      stats: { active: "45 formações ativas", pending: "67 inscrições" },
      color: "from-cyan-500 to-blue-600",
    },
    {
      name: "Recrutamento",
      icon: Users,
      description: "Processos seletivos",
      href: "/admin/recrutamento",
      stats: { active: "23 vagas abertas", pending: "156 candidatos" },
      color: "from-orange-500 to-red-600",
    },
  ]

  const alerts = [
    {
      type: "urgent",
      module: "Folha de Pagamento",
      message: "Fechamento da folha em 3 dias",
      time: "Hoje",
    },
    {
      type: "warning",
      module: "Assiduidade",
      message: "8 justificativas de falta pendentes",
      time: "Há 2 horas",
    },
    {
      type: "info",
      module: "Formações",
      message: "67 novas inscrições para aprovação",
      time: "Há 5 horas",
    },
    {
      type: "info",
      module: "Recrutamento",
      message: "15 entrevistas agendadas esta semana",
      time: "Ontem",
    },
  ]

  const evolutionData = [
    { month: "Jan", funcionarios: 1180, folha: 2.4, formacoes: 32 },
    { month: "Fev", funcionarios: 1195, folha: 2.5, formacoes: 38 },
    { month: "Mar", funcionarios: 1210, folha: 2.6, formacoes: 41 },
    { month: "Abr", funcionarios: 1225, folha: 2.7, formacoes: 43 },
    { month: "Mai", funcionarios: 1247, folha: 2.8, formacoes: 45 },
  ]

  const departmentData = [
    { name: "TI", value: 245, color: "#06b6d4" },
    { name: "Vendas", value: 312, color: "#3b82f6" },
    { name: "Marketing", value: 156, color: "#8b5cf6" },
    { name: "RH", value: 89, color: "#ec4899" },
    { name: "Financeiro", value: 134, color: "#10b981" },
    { name: "Operações", value: 311, color: "#f59e0b" },
  ]

  const recentActivities = [
    {
      user: "Ana Silva",
      action: "aprovou folha de pagamento",
      module: "Folha de Pagamento",
      time: "Há 15 min",
    },
    {
      user: "Carlos Santos",
      action: "agendou entrevista",
      module: "Recrutamento",
      time: "Há 1 hora",
    },
    {
      user: "Maria Oliveira",
      action: "criou nova formação",
      module: "Formações",
      time: "Há 2 horas",
    },
    {
      user: "João Costa",
      action: "aprovou justificativa",
      module: "Assiduidade",
      time: "Há 3 horas",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Administrativo</h1>
            <p className="text-slate-400">Visão geral de todos os módulos do sistema de RH</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
              <Badge className="ml-2 bg-red-500">4</Badge>
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overallMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-slate-400 mb-1">{metric.title}</p>
                      <p className="text-2xl font-bold text-white mb-2">{metric.value}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`${
                            metric.trend === "up"
                              ? "border-green-500/50 text-green-400"
                              : "border-red-500/50 text-red-400"
                          }`}
                        >
                          {metric.change}
                        </Badge>
                        <span className="text-xs text-slate-500">vs mês anterior</span>
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br from-${metric.color}-500/20 to-${metric.color}-600/20`}
                    >
                      <Icon className={`w-6 h-6 text-${metric.color}-400`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Alertas e Notificações */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  Alertas e Pendências
                </CardTitle>
                <CardDescription className="text-slate-400">Itens que requerem sua atenção</CardDescription>
              </div>
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        alert.type === "urgent"
                          ? "bg-red-500"
                          : alert.type === "warning"
                            ? "bg-orange-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div>
                      <p className="text-white font-medium">{alert.message}</p>
                      <p className="text-sm text-slate-400">
                        {alert.module} • {alert.time}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Módulos do Sistema */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Módulos do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => {
              const Icon = module.icon
              return (
                <Link key={index} href={module.href}>
                  <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 hover:border-cyan-500/50 transition-all cursor-pointer group h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${module.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                            {module.name}
                          </h3>
                          <p className="text-sm text-slate-400 mb-3">{module.description}</p>
                          <div className="space-y-1">
                            <p className="text-xs text-slate-500">
                              <span className="text-cyan-400 font-medium">{module.stats.active}</span>
                            </p>
                            <p className="text-xs text-slate-500">
                              <span className="text-orange-400 font-medium">{module.stats.pending}</span>
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Gráficos e Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evolução Geral */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Evolução Geral</CardTitle>
              <CardDescription className="text-slate-400">Crescimento dos principais indicadores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="funcionarios" stroke="#06b6d4" strokeWidth={2} name="Funcionários" />
                  <Line type="monotone" dataKey="formacoes" stroke="#3b82f6" strokeWidth={2} name="Formações" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por Departamento */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Distribuição por Departamento</CardTitle>
              <CardDescription className="text-slate-400">Total de funcionários por área</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Atividades Recentes */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Atividades Recentes
                </CardTitle>
                <CardDescription className="text-slate-400">Últimas ações realizadas no sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <p className="text-white">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-sm text-slate-400">
                      {activity.module} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
