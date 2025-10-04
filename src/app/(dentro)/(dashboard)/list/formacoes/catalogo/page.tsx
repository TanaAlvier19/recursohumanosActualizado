"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MetricCard } from "@/components/metrcCard"
import {
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Award,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  GraduationCap,
  Target,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
import Link from "next/link"

export default function AdminFormacoesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Dados de exemplo
  const metrics = {
    totalFormacoes: 156,
    formacoesAtivas: 42,
    totalParticipantes: 1248,
    taxaConclusao: 87,
    investimentoTotal: 450000,
    horasFormacao: 3240,
    certificadosEmitidos: 892,
    avaliacaoMedia: 4.6,
  }

  const formacoesRecentes = [
    {
      id: 1,
      titulo: "Liderança e Gestão de Equipes",
      tipo: "Presencial",
      instrutor: "Maria Silva",
      dataInicio: "2025-03-15",
      vagas: 20,
      inscritos: 18,
      status: "Em andamento",
      progresso: 65,
    },
    {
      id: 2,
      titulo: "Excel Avançado para Análise de Dados",
      tipo: "Online",
      instrutor: "João Santos",
      dataInicio: "2025-03-20",
      vagas: 30,
      inscritos: 30,
      status: "Inscrições encerradas",
      progresso: 0,
    },
    {
      id: 3,
      titulo: "Comunicação Assertiva",
      tipo: "Híbrido",
      instrutor: "Ana Costa",
      dataInicio: "2025-03-10",
      vagas: 25,
      inscritos: 22,
      status: "Em andamento",
      progresso: 80,
    },
    {
      id: 4,
      titulo: "Gestão de Projetos Ágeis",
      tipo: "EAD",
      instrutor: "Carlos Oliveira",
      dataInicio: "2025-03-25",
      vagas: 50,
      inscritos: 35,
      status: "Inscrições abertas",
      progresso: 0,
    },
  ]

  const evolucaoMensal = [
    { mes: "Set", formacoes: 12, participantes: 180, conclusoes: 156 },
    { mes: "Out", formacoes: 15, participantes: 225, conclusoes: 198 },
    { mes: "Nov", formacoes: 18, participantes: 270, conclusoes: 234 },
    { mes: "Dez", formacoes: 14, participantes: 210, conclusoes: 189 },
    { mes: "Jan", formacoes: 20, participantes: 300, conclusoes: 267 },
    { mes: "Fev", formacoes: 22, participantes: 330, conclusoes: 291 },
  ]

  const distribuicaoTipo = [
    { name: "Presencial", value: 35, color: "#06b6d4" },
    { name: "Online", value: 28, color: "#3b82f6" },
    { name: "Híbrido", value: 22, color: "#8b5cf6" },
    { name: "EAD", value: 15, color: "#10b981" },
  ]

  const topCategorias = [
    { categoria: "Liderança", total: 45, concluidos: 39 },
    { categoria: "Tecnologia", total: 38, concluidos: 32 },
    { categoria: "Comunicação", total: 32, concluidos: 28 },
    { categoria: "Gestão", total: 28, concluidos: 25 },
    { categoria: "Vendas", total: 24, concluidos: 21 },
  ]

  const proximasFormacoes = [
    { titulo: "Power BI para Gestores", data: "2025-03-18", inscritos: 15, vagas: 20 },
    { titulo: "Inteligência Emocional", data: "2025-03-22", inscritos: 25, vagas: 25 },
    { titulo: "Marketing Digital", data: "2025-03-25", inscritos: 18, vagas: 30 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em andamento":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Inscrições abertas":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Inscrições encerradas":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Presencial":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
      case "Online":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Híbrido":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "EAD":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestão de Formações - Admin</h1>
            <p className="text-slate-400">Painel administrativo completo do módulo de formações</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
              <BarChart3 className="w-4 h-4 mr-2" />
              Relatórios
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Nova Formação
            </Button>
          </div>
        </div>

        {/* Quick Access Navigation */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Acesso Rápido</CardTitle>
            <CardDescription className="text-slate-400">Navegue pelas principais áreas do módulo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <Link href="/admin/formacoes/catalogo">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4 border-slate-700 hover:bg-slate-700/50 bg-transparent"
                >
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                  <span className="text-sm text-slate-300">Catálogo</span>
                </Button>
              </Link>
              <Link href="/admin/formacoes/instrutores">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4 border-slate-700 hover:bg-slate-700/50 bg-transparent"
                >
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                  <span className="text-sm text-slate-300">Instrutores</span>
                </Button>
              </Link>
              <Link href="/admin/formacoes/inscricoes">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4 border-slate-700 hover:bg-slate-700/50 bg-transparent"
                >
                  <Users className="w-6 h-6 text-purple-400" />
                  <span className="text-sm text-slate-300">Inscrições</span>
                </Button>
              </Link>
              <Link href="/admin/formacoes/avaliacoes">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4 border-slate-700 hover:bg-slate-700/50 bg-transparent"
                >
                  <Award className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-slate-300">Avaliações</span>
                </Button>
              </Link>
              <Link href="/admin/formacoes/pdi">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4 border-slate-700 hover:bg-slate-700/50 bg-transparent"
                >
                  <Target className="w-6 h-6 text-orange-400" />
                  <span className="text-sm text-slate-300">PDI</span>
                </Button>
              </Link>
              <Link href="/admin/formacoes/competencias">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4 border-slate-700 hover:bg-slate-700/50 bg-transparent"
                >
                  <CheckCircle2 className="w-6 h-6 text-teal-400" />
                  <span className="text-sm text-slate-300">Competências</span>
                </Button>
              </Link>
              <Link href="/admin/formacoes/relatorios">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4 border-slate-700 hover:bg-slate-700/50 bg-transparent"
                >
                  <BarChart3 className="w-6 h-6 text-pink-400" />
                  <span className="text-sm text-slate-300">Relatórios</span>
                </Button>
              </Link>
              <Link href="/admin/formacoes/orcamento">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4 border-slate-700 hover:bg-slate-700/50 bg-transparent"
                >
                  <DollarSign className="w-6 h-6 text-yellow-400" />
                  <span className="text-sm text-slate-300">Orçamento</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total de Formações"
            value={metrics.totalFormacoes.toString()}
            icon={BookOpen}
            description="Catálogo completo"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Formações Ativas"
            value={metrics.formacoesAtivas.toString()}
            icon={Calendar}
            description="Em andamento"
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Total Participantes"
            value={metrics.totalParticipantes.toLocaleString()}
            icon={Users}
            description="Inscritos ativos"
            trend={{ value: 15, isPositive: true }}
          />
          <MetricCard
            title="Taxa de Conclusão"
            value={`${metrics.taxaConclusao}%`}
            icon={TrendingUp}
            description="Média geral"
            trend={{ value: 5, isPositive: true }}
          />
          <MetricCard
            title="Investimento Total"
            value={`R$ ${(metrics.investimentoTotal / 1000).toFixed(0)}k`}
            icon={DollarSign}
            description="Orçamento utilizado"
            trend={{ value: 10, isPositive: false }}
          />
          <MetricCard
            title="Horas de Formação"
            value={metrics.horasFormacao.toLocaleString()}
            icon={Clock}
            description="Total acumulado"
            trend={{ value: 18, isPositive: true }}
          />
          <MetricCard
            title="Certificados Emitidos"
            value={metrics.certificadosEmitidos.toString()}
            icon={Award}
            description="Conclusões certificadas"
            trend={{ value: 22, isPositive: true }}
          />
          <MetricCard
            title="Avaliação Média"
            value={metrics.avaliacaoMedia.toFixed(1)}
            icon={CheckCircle2}
            description="Satisfação geral"
            trend={{ value: 0.3, isPositive: true }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evolução Mensal */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Evolução Mensal</CardTitle>
              <CardDescription className="text-slate-400">Formações, participantes e conclusões</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucaoMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="mes" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="formacoes" stroke="#06b6d4" strokeWidth={2} name="Formações" />
                  <Line type="monotone" dataKey="participantes" stroke="#3b82f6" strokeWidth={2} name="Participantes" />
                  <Line type="monotone" dataKey="conclusoes" stroke="#10b981" strokeWidth={2} name="Conclusões" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por Tipo */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Distribuição por Tipo</CardTitle>
              <CardDescription className="text-slate-400">Modalidades de formação</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribuicaoTipo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distribuicaoTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Categorias */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Top Categorias</CardTitle>
            <CardDescription className="text-slate-400">Categorias mais populares</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCategorias}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="categoria" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="total" fill="#06b6d4" name="Total" />
                <Bar dataKey="concluidos" fill="#10b981" name="Concluídos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Formações Recentes e Próximas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formações Recentes */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Formações Recentes</CardTitle>
              <CardDescription className="text-slate-400">Últimas formações cadastradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formacoesRecentes.map((formacao) => (
                  <div
                    key={formacao.id}
                    className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg hover:bg-slate-900/70 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{formacao.titulo}</h3>
                        <p className="text-sm text-slate-400">Instrutor: {formacao.instrutor}</p>
                      </div>
                      <Badge className={getTipoColor(formacao.tipo)}>{formacao.tipo}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(formacao.dataInicio).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {formacao.inscritos}/{formacao.vagas} vagas
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <Badge className={getStatusColor(formacao.status)}>{formacao.status}</Badge>
                        <span className="text-slate-400">{formacao.progresso}%</span>
                      </div>
                      <Progress value={formacao.progresso} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Próximas Formações */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Próximas Formações</CardTitle>
              <CardDescription className="text-slate-400">Agenda dos próximos dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proximasFormacoes.map((formacao, index) => (
                  <div key={index} className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <h4 className="text-white font-medium mb-2 text-sm">{formacao.titulo}</h4>
                    <div className="space-y-1 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(formacao.data).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {formacao.inscritos}/{formacao.vagas} inscritos
                      </div>
                    </div>
                    <Progress value={(formacao.inscritos / formacao.vagas) * 100} className="h-1 mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas e Notificações */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              Alertas e Ações Necessárias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-white font-medium">5 avaliações pendentes</p>
                    <p className="text-sm text-slate-400">Formações aguardando avaliação final</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-orange-500/20 text-orange-400 hover:bg-orange-500/10 bg-transparent"
                >
                  Ver Detalhes
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">3 formações iniciando esta semana</p>
                    <p className="text-sm text-slate-400">Confirmar presença dos instrutores</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                >
                  Verificar
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">12 certificados prontos para emissão</p>
                    <p className="text-sm text-slate-400">Formações concluídas com sucesso</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-500/20 text-green-400 hover:bg-green-500/10 bg-transparent"
                >
                  Emitir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
