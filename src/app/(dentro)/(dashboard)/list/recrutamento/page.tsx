"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  Users,
  TrendingUp,
  Clock,
  Calendar,
  Target,
  Database,
  Plus,
  BarChart3,
  UserCheck,
  ClipboardList,
  Download,
  Eye,
  Edit,
  ArrowRight,
} from "lucide-react"
import { MetricCard } from "@/components/metrcCard"
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
} from "recharts"
import Link from "next/link"

export default function RecrutamentoDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  // Dados de métricas
  const metrics = [
    {
      title: "Vagas Ativas",
      value: "24",
      icon: Briefcase,
      description: "8 urgentes",
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Candidatos Ativos",
      value: "342",
      icon: Users,
      description: "156 novos este mês",
      trend: { value: 23, isPositive: true },
    },
    {
      title: "Taxa de Conversão",
      value: "18.5%",
      icon: TrendingUp,
      description: "Candidato → Contratado",
      trend: { value: 3.2, isPositive: true },
    },
    {
      title: "Tempo Médio",
      value: "28 dias",
      icon: Clock,
      description: "Para fechamento",
      trend: { value: 5, isPositive: false },
    },
  ]

  // Dados de vagas recentes
  const vagasRecentes = [
    {
      id: 1,
      titulo: "Desenvolvedor Full Stack Senior",
      departamento: "Tecnologia",
      candidatos: 45,
      status: "Ativa",
      prioridade: "Alta",
      dataAbertura: "2024-01-15",
      localizacao: "Remoto",
    },
    {
      id: 2,
      titulo: "Analista de Marketing Digital",
      departamento: "Marketing",
      candidatos: 32,
      status: "Ativa",
      prioridade: "Média",
      dataAbertura: "2024-01-18",
      localizacao: "São Paulo",
    },
    {
      id: 3,
      titulo: "Gerente de Vendas",
      departamento: "Comercial",
      candidatos: 28,
      status: "Em Análise",
      prioridade: "Alta",
      dataAbertura: "2024-01-20",
      localizacao: "Híbrido",
    },
    {
      id: 4,
      titulo: "Designer UX/UI",
      departamento: "Produto",
      candidatos: 56,
      status: "Ativa",
      prioridade: "Média",
      dataAbertura: "2024-01-22",
      localizacao: "Remoto",
    },
  ]

  // Dados de candidatos recentes
  const candidatosRecentes = [
    {
      id: 1,
      nome: "Ana Silva",
      vaga: "Desenvolvedor Full Stack",
      etapa: "Entrevista Técnica",
      score: 92,
      dataAplicacao: "2024-01-25",
    },
    {
      id: 2,
      nome: "Carlos Santos",
      vaga: "Analista de Marketing",
      etapa: "Triagem",
      score: 85,
      dataAplicacao: "2024-01-26",
    },
    {
      id: 3,
      nome: "Mariana Costa",
      vaga: "Designer UX/UI",
      etapa: "Entrevista RH",
      score: 88,
      dataAplicacao: "2024-01-26",
    },
  ]

  // Dados do funil de recrutamento
  const funnelData = [
    { etapa: "Candidaturas", quantidade: 342, cor: "#06b6d4" },
    { etapa: "Triagem", quantidade: 156, cor: "#3b82f6" },
    { etapa: "Entrevista RH", quantidade: 89, cor: "#8b5cf6" },
    { etapa: "Teste Técnico", quantidade: 45, cor: "#ec4899" },
    { etapa: "Entrevista Final", quantidade: 23, cor: "#f59e0b" },
    { etapa: "Proposta", quantidade: 12, cor: "#10b981" },
  ]

  // Dados de vagas por departamento
  const vagasPorDepartamento = [
    { departamento: "Tecnologia", vagas: 8, cor: "#06b6d4" },
    { departamento: "Comercial", vagas: 6, cor: "#3b82f6" },
    { departamento: "Marketing", vagas: 4, cor: "#8b5cf6" },
    { departamento: "Produto", vagas: 3, cor: "#ec4899" },
    { departamento: "Operações", vagas: 3, cor: "#f59e0b" },
  ]

  // Dados de evolução mensal
  const evolucaoMensal = [
    { mes: "Ago", candidaturas: 245, contratacoes: 12 },
    { mes: "Set", candidaturas: 289, contratacoes: 15 },
    { mes: "Out", candidaturas: 312, contratacoes: 18 },
    { mes: "Nov", candidaturas: 298, contratacoes: 14 },
    { mes: "Dez", candidaturas: 334, contratacoes: 16 },
    { mes: "Jan", candidaturas: 342, contratacoes: 19 },
  ]

  const acessoRapido = [
    {
      titulo: "Gestão de Vagas",
      descricao: "Criar e gerenciar vagas",
      icon: Briefcase,
      href: "/list/recrutamento/vagas",
      cor: "from-cyan-500 to-blue-500",
    },
    {
      titulo: "Candidatos",
      descricao: "Visualizar candidatos",
      icon: Users,
      href: "/list/recrutamento/candidatos",
      cor: "from-blue-500 to-purple-500",
    },
    {
      titulo: "Pipeline",
      descricao: "Acompanhar processos",
      icon: Target,
      href: "/list/recrutamento/pipeline",
      cor: "from-purple-500 to-pink-500",
    },
    {
      titulo: "Entrevistas",
      descricao: "Agendar entrevistas",
      icon: Calendar,
      href: "/list/recrutamento/entrevistas",
      cor: "from-pink-500 to-orange-500",
    },
    {
      titulo: "Testes",
      descricao: "Gerenciar testes",
      icon: ClipboardList,
      href: "/list/recrutamento/testes",
      cor: "from-orange-500 to-yellow-500",
    },
    {
      titulo: "Avaliações",
      descricao: "Sistema de scoring",
      icon: UserCheck,
      href: "/list/recrutamento/avaliacoes",
      cor: "from-yellow-500 to-green-500",
    },
    {
      titulo: "Banco de Talentos",
      descricao: "Pool de candidatos",
      icon: Database,
      href: "/list/recrutamento/banco-talentos",
      cor: "from-green-500 to-cyan-500",
    },
    {
      titulo: "Relatórios",
      descricao: "Analytics avançado",
      icon: BarChart3,
      href: "/list/recrutamento/relatorios",
      cor: "from-cyan-500 to-blue-500",
    },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Ativa: "bg-green-500/10 text-green-400 border-green-500/20",
      "Em Análise": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      Pausada: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      Fechada: "bg-red-500/10 text-red-400 border-red-500/20",
    }
    return colors[status] || colors.Ativa
  }

  const getPrioridadeColor = (prioridade: string) => {
    const colors: Record<string, string> = {
      Alta: "bg-red-500/10 text-red-400 border-red-500/20",
      Média: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      Baixa: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    }
    return colors[prioridade] || colors.Média
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Recrutamento & Seleção
            </h1>
            <p className="text-slate-400 mt-1">Gestão completa do processo de recrutamento</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-slate-800">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Link href="/list/recrutamento/vagas">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                <Plus className="mr-2 h-4 w-4" />
                Nova Vaga
              </Button>
            </Link>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Acesso Rápido */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-slate-100">Acesso Rápido</CardTitle>
            <CardDescription className="text-slate-400">Principais funcionalidades do módulo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {acessoRapido.map((item, index) => (
                <Link key={index} href={item.href}>
                  <Card className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-all cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${item.cor}`}>
                          <item.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
                            {item.titulo}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1">{item.descricao}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Funil de Recrutamento */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-slate-100">Funil de Recrutamento</CardTitle>
              <CardDescription className="text-slate-400">Distribuição de candidatos por etapa</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="etapa" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Bar dataKey="quantidade" radius={[8, 8, 0, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Vagas por Departamento */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-slate-100">Vagas por Departamento</CardTitle>
              <CardDescription className="text-slate-400">Distribuição de vagas abertas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vagasPorDepartamento}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ departamento, vagas }) => `${departamento}: ${vagas}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="vagas"
                  >
                    {vagasPorDepartamento.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Evolução Mensal */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-slate-100">Evolução Mensal</CardTitle>
            <CardDescription className="text-slate-400">Candidaturas vs Contratações</CardDescription>
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
                    color: "#f1f5f9",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="candidaturas" stroke="#06b6d4" strokeWidth={2} name="Candidaturas" />
                <Line type="monotone" dataKey="contratacoes" stroke="#10b981" strokeWidth={2} name="Contratações" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Vagas Recentes */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100">Vagas Recentes</CardTitle>
                  <CardDescription className="text-slate-400">Últimas vagas abertas</CardDescription>
                </div>
                <Link href="/admin/recrutamento/vagas">
                  <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                    Ver todas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vagasRecentes.map((vaga) => (
                  <div
                    key={vaga.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-100">{vaga.titulo}</h3>
                        <Badge className={getPrioridadeColor(vaga.prioridade)}>{vaga.prioridade}</Badge>
                        <Badge className={getStatusColor(vaga.status)}>{vaga.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {vaga.departamento}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {vaga.candidatos} candidatos
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(vaga.dataAbertura).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Candidatos Recentes */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-slate-100">Candidatos Recentes</CardTitle>
              <CardDescription className="text-slate-400">Últimas candidaturas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidatosRecentes.map((candidato) => (
                  <div
                    key={candidato.id}
                    className="p-4 rounded-lg border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-100">{candidato.nome}</h4>
                        <p className="text-sm text-slate-400">{candidato.vaga}</p>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                        <span className="text-xs font-semibold text-cyan-400">{candidato.score}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">{candidato.etapa}</Badge>
                      <span className="text-slate-500">
                        {new Date(candidato.dataAplicacao).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
