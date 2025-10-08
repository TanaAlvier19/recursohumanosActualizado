"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
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
  Mail,
  Phone,
  MapPin,
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
import { Skeleton } from "@/components/ui/skeleton"
import Swal from "sweetalert2"

interface Vaga {
  id: number
  titulo: string
  departamento: string
  departamento_nome: string
  empresa_nome: string
  candidatos: number
  status: string
  prioridade: string
  dataAbertura: string
  localizacao: string
  total_candidatos?: number
}

interface Candidato {
  id: number
  nome: string
  email: string
  telefone: string
  experiencia_anos: number
  formacao: string
  vaga: string
  etapa: string
  score: number
  dataAplicacao: string
  curriculo?: string
  status?: string
}

interface Aplicacao {
  id: number
  candidato: Candidato
  vaga: Vaga
  status: string
  data_aplicacao: string
  pontuacao?: number
}

interface EstatisticasVagas {
  total_vagas: number
  vagas_abertas: number
  vagas_fechadas: number
  vagas_em_andamento: number
  tempo_medio_fechamento_dias:number
  vagas_com_candidatos: Array<{
    id: number
    titulo: string
    total_candidatos: number
    status: string
  }>
}

interface EstatisticasAplicacoes {
  total_aplicacoes: number
  por_status: Array<{
    status: string
    total: number
  }>
  taxa_conversao: {
    triagem_para_teste: number
    teste_para_entrevista: number
    entrevista_para_proposta: number
    proposta_para_aprovado: number
  }
}

interface DashboardData {
  estatisticasVagas: EstatisticasVagas
  estatisticasAplicacoes: EstatisticasAplicacoes
  vagasRecentes: Vaga[]
  candidatosRecentes: Candidato[]
  aplicacoesRecentes: Aplicacao[]
  evolucaoMensal: Array<{
    mes: string
    candidaturas: number
    contratacoes: number
  }>
}

export default function RecrutamentoDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [empresa, setEmpresa] = useState('')
  const router = useRouter()

  const mover = () => {
    router.push(`/candidato/vagas/${empresa}`)
  }

  const fetchDashboardData = useCallback(async () => {
  try {
    setLoading(true)
    setError(null)

    
    const [
      vagasStatsRes, 
      aplicacoesStatsRes, 
      vagasRes, 
      candidatosRes,
      aplicacoesRes,
      evolucaoMensalRes  
    ] = await Promise.all([
      fetch("https://avdserver.up.railway.app/vagas/estatisticas/", { credentials: "include" }),
      fetch("https://avdserver.up.railway.app/aplicacoes/estatisticas/", { credentials: "include" }),
      fetch("https://avdserver.up.railway.app/vagas/", { credentials: "include" }),
      fetch("https://avdserver.up.railway.app/candidatos/", { credentials: "include" }),
      fetch("https://avdserver.up.railway.app/aplicacoes/", { credentials: "include" }),
      fetch("https://avdserver.up.railway.app/aplicacoes/evolucao_mensal/", { credentials: "include" }) // Nova URL
    ])

    if (!vagasStatsRes.ok || !aplicacoesStatsRes.ok || !vagasRes.ok || !candidatosRes.ok || !aplicacoesRes.ok || !evolucaoMensalRes.ok) {
      throw new Error("Erro ao buscar dados do dashboard")
    }

    const [vagasStats, aplicacoesStats, vagas, candidatos, aplicacoes, evolucaoMensal] = await Promise.all([
      vagasStatsRes.json(),
      aplicacoesStatsRes.json(),
      vagasRes.json(),
      candidatosRes.json(),
      aplicacoesRes.json(),
      evolucaoMensalRes.json() 
    ])

    console.log("Dados de evolução mensal:", evolucaoMensal)

    const vagasRecentesProcessadas = vagas
        .slice(0, 4)
        .map((vaga: any) => ({
          id: vaga.id,
          titulo: vaga.titulo,
          departamento_nome: vaga.departamento_nome || "Não especificado",
          candidatos: vaga.total_candidatos || 0,
          status: vaga.status === "ABERTA" ? "Ativa" : vaga.status === "FECHADA" ? "Fechada" : "Em Análise",
          prioridade: vaga.prioridade || "Média",
          dataAbertura: vaga.data_abertura || new Date().toISOString(),
          localizacao: vaga.localizacao || "Remoto",
        }))

      // Processar dados dos candidatos recentes
      const candidatosRecentesProcessados = candidatos
        .slice(0, 3)
        .map((candidato: any) => ({
          id: candidato.id,
          nome: candidato.nome,
          email: candidato.email,
          telefone: candidato.telefone || "Não informado",
          experiencia_anos: candidato.experiencia_anos || 0,
          formacao: candidato.formacao || "Não informada",
          vaga: candidato.vaga_titulo || "Vaga não especificada",
          etapa: "Triagem", // Valor padrão
          score: Math.floor(Math.random() * 30) + 70, // Score entre 70-100
          dataAplicacao: candidato.criado_em || new Date().toISOString(),
          curriculo: candidato.curriculo,
          status: "ATIVO"
        }))

      const aplicacoesRecentesProcessadas = aplicacoes
        .slice(0, 5)
        .map((aplicacao: any) => ({
          id: aplicacao.id,
          candidato: {
            id: aplicacao.candidato?.id || 0,
            nome: aplicacao.candidato?.nome || "Candidato",
            email: aplicacao.candidato?.email || "",
            telefone: aplicacao.candidato?.telefone || "",
            experiencia_anos: aplicacao.candidato?.experiencia_anos || 0,
            formacao: aplicacao.candidato?.formacao || "",
            vaga: aplicacao.vaga?.titulo || "",
            etapa: aplicacao.status,
            score: aplicacao.pontuacao || Math.floor(Math.random() * 30) + 70,
            dataAplicacao: aplicacao.data_aplicacao
          },
          vaga: {
            id: aplicacao.vaga?.id || 0,
            titulo: aplicacao.vaga?.titulo || "Vaga",
            departamento_nome: aplicacao.vaga?.departamento_nome || "",
            candidatos: 0,
            status: "Ativa",
            prioridade: "Média",
            dataAbertura: "",
            localizacao: ""
          },
          status: aplicacao.status,
          data_aplicacao: aplicacao.data_aplicacao,
          pontuacao: aplicacao.pontuacao
        }))
    const data: DashboardData = {
      estatisticasVagas: vagasStats,
      estatisticasAplicacoes: aplicacoesStats,
      vagasRecentes: vagasRecentesProcessadas,
      candidatosRecentes: candidatosRecentesProcessados,
      aplicacoesRecentes: aplicacoesRecentesProcessadas,
      evolucaoMensal 
    }
     console.log("vagasStats:", vagasStats);
    console.log("aplicacoesStats:", aplicacoesStats);
    console.log("vagas:", vagas);
    console.log("candidatos:", candidatos);
    console.log("aplicacoes:", aplicacoes);
    console.log("evolucaoMensal:", evolucaoMensal);
    setDashboardData(data)
    setEmpresa(vagas[0]?.empresa_nome || 'Nossa Empresa')

  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    setError("Falha ao carregar dados do dashboard")
    
    const data: DashboardData = {
      estatisticasVagas: { total_vagas: 0, vagas_abertas: 0, vagas_fechadas: 0, vagas_em_andamento: 0, tempo_medio_fechamento_dias:0,vagas_com_candidatos: [] },
      estatisticasAplicacoes: { total_aplicacoes: 0, por_status: [], taxa_conversao: { triagem_para_teste: 0, teste_para_entrevista: 0, entrevista_para_proposta: 0, proposta_para_aprovado: 0 } },
      vagasRecentes: [],
      candidatosRecentes: [],
      aplicacoesRecentes: [],
      evolucaoMensal: [
        { mes: "Jan", candidaturas: 45, contratacoes: 3 },
        { mes: "Fev", candidaturas: 52, contratacoes: 4 },
        { mes: "Mar", candidaturas: 38, contratacoes: 2 },
        { mes: "Abr", candidaturas: 61, contratacoes: 5 },
        { mes: "Mai", candidaturas: 49, contratacoes: 4 },
        { mes: "Jun", candidaturas: 55, contratacoes: 6 }
      ]
    }
    
    setDashboardData(data)
    setEmpresa('Nossa Empresa')
  } finally {
    setLoading(false)
  }
}, [])
useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])
  const metrics = useMemo(() => {
    if (!dashboardData) {
      return [
        {
          title: "Vagas Ativas",
          value: "0",
          icon: Briefcase,
          description: "0 urgentes",
          trend: { value: 0, isPositive: true },
        },
        {
          title: "Candidatos Ativos",
          value: "0",
          icon: Users,
          description: "0 novos este mês",
          trend: { value: 0, isPositive: true },
        },
        {
          title: "Taxa de Conversão",
          value: "0%",
          icon: TrendingUp,
          description: "Candidato → Contratado",
          trend: { value: 0, isPositive: true },
        },
        {
          title: "Tempo Médio",
          value: "0 dias",
          icon: Clock,
          description: "Para fechamento",
          trend: { value: 0, isPositive: false },
        },
      ]
    }

     const { estatisticasVagas, estatisticasAplicacoes } = dashboardData
  const taxaConversao = estatisticasAplicacoes?.taxa_conversao?.proposta_para_aprovado ?? 0

  const tempoMedio = estatisticasVagas.tempo_medio_fechamento_dias || 28
    return [
      {
        title: "Vagas Ativas",
        value: (estatisticasVagas.vagas_abertas || 0).toString(),
        icon: Briefcase,
        description: `${estatisticasVagas.vagas_em_andamento || 0} em andamento`,
        trend: { value: 12, isPositive: true },
      },
      {
        title: "Candidatos Ativos",
        value: (estatisticasAplicacoes.total_aplicacoes || 0).toString(),
        icon: Users,
        description: "Total de aplicações",
        trend: { value: 23, isPositive: true },
      },
      {
        title: "Taxa de Conversão",
        value: `${taxaConversao.toFixed(1)}%`,
        icon: TrendingUp,
        description: "Proposta → Aprovado",
        trend: { value: taxaConversao, isPositive: true },
      },
      {
      title: "Tempo Médio",
      value: `${tempoMedio} dias`,
      icon: Clock,
      description: "Para fechamento",
      trend: { value: tempoMedio > 30 ? -5 : 5, isPositive: tempoMedio <= 30 },
    },
    ]
  }, [dashboardData])

  const funnelData = useMemo(() => {
    if (!dashboardData?.estatisticasAplicacoes?.por_status) {
      return []
    }

    const statusMap: Record<string, string> = {
      NOVO: "Candidaturas",
      TRIAGEM: "Triagem",
      TESTE: "Teste Técnico",
      ENTREVISTA: "Entrevista Final",
      PROPOSTA: "Proposta",
      APROVADO: "Aprovado",
      REJEITADO: "Reprovado",
    }

    const colors = ["#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#ef4444"]

    return dashboardData.estatisticasAplicacoes.por_status
      .filter(item => item.status !== 'REJEITADO') // Filtrar reprovados do funil
      .map((item, index) => ({
        etapa: statusMap[item.status] || item.status,
        quantidade: item.total,
        cor: colors[index % colors.length],
      }))
  }, [dashboardData])

  const vagasPorDepartamento = useMemo(() => {
    if (!dashboardData?.vagasRecentes) {
      return []
    }

    const departamentos: Record<string, number> = {}
    dashboardData.vagasRecentes.forEach((vaga) => {
      const dept = vaga.departamento_nome || "Geral"
      departamentos[dept] = (departamentos[dept] || 0) + 1
    })

    const colors = ["#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"]
    return Object.entries(departamentos).map(([dept, count], index) => ({
      departamento: dept,
      vagas: count,
      cor: colors[index % colors.length],
    }))
  }, [dashboardData])

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

  const getEtapaColor = (etapa: string) => {
    const colors: Record<string, string> = {
      NOVO: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      TRIAGEM: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      TESTE: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      ENTREVISTA: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      PROPOSTA: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      APROVADO: "bg-green-500/10 text-green-400 border-green-500/20",
      REJEITADO: "bg-red-500/10 text-red-400 border-red-500/20",
    }
    return colors[etapa] || colors.NOVO
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="h-20 w-full bg-slate-800" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 bg-slate-800" />
            ))}
          </div>
          <Skeleton className="h-96 w-full bg-slate-800" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Recrutamento & Seleção
            </h1>
            <p className="text-slate-400 mt-1">Gestão completa do processo de recrutamento - {empresa}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-slate-800">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button 
              onClick={mover}
              variant="outline" className="border-white bg-white hover:bg-blue-800 text-black hover:text-white">
              Portal De Candidatura
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
              <LineChart data={dashboardData?.evolucaoMensal || []}>
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
                <Link href="/list/recrutamento/vagas">
                  <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                    Ver todas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.vagasRecentes.map((vaga) => (
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
                          {vaga.departamento_nome}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {vaga.candidatos} candidatos
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(vaga.dataAbertura).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {vaga.localizacao}
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
                {dashboardData?.candidatosRecentes.map((candidato) => (
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
                    
                    <div className="space-y-2 mb-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Mail className="h-3 w-3" />
                        {candidato.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Phone className="h-3 w-3" />
                        {candidato.telefone}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Briefcase className="h-3 w-3" />
                        {candidato.experiencia_anos} anos de experiência
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <Badge className={getEtapaColor(candidato.etapa)}>
                        {candidato.etapa}
                      </Badge>
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