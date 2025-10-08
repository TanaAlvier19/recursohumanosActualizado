"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
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

interface MetricasGerais {
  total_funcionarios: number
  folha_mensal: number
  taxa_assiduidade: number
  vagas_abertas: number
}

interface Alerta {
  type: string
  module: string
  message: string
  time: string
}

interface EvolucaoMes {
  month: string
  funcionarios: number
  folha: number
  formacoes: number
}

interface Atividade {
  user: string
  action: string
  module: string
  time: string
}

interface EstatisticasRecrutamento {
  total_vagas: number
  vagas_abertas: number
  vagas_fechadas: number
  vagas_em_andamento: number
  tempo_medio_fechamento_dias: number
}

interface EstatisticasFormacoes {
  total_formacoes: number
  formacoes_ativas: number
  total_inscricoes: number
  taxa_conclusao: number
  horas_treinamento: number
  investimento_total: number
  certificados_emitidos: number
  media_satisfacao: number
}

interface EvolucaoRecrutamento {
  mes: string
  candidaturas: number
  contratacoes: number
}

interface EvolucaoFormacoes {
  mes: string
  formacoes: number
  participantes: number
  conclusoes: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://avdserver.up.railway.app"

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [funcionarios, setFuncionarios] = useState<number>(0)
  const [metricasGerais, setMetricasGerais] = useState<MetricasGerais | null>(null)
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [evolucaoData, setEvolucaoData] = useState<EvolucaoMes[]>([])
  const [atividadesRecentes, setAtividadesRecentes] = useState<Atividade[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [loading, setLoading] = useState(true)

  const [estatisticasRecrutamento, setEstatisticasRecrutamento] = useState<EstatisticasRecrutamento | null>(null)
  const [estatisticasFormacoes, setEstatisticasFormacoes] = useState<EstatisticasFormacoes | null>(null)
  const [evolucaoRecrutamento, setEvolucaoRecrutamento] = useState<EvolucaoRecrutamento[]>([])
  const [evolucaoFormacoes, setEvolucaoFormacoes] = useState<EvolucaoFormacoes[]>([])

  const fetchDepartamentos = useCallback(async () => {
    try {
      const [depResponse, funcResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/departamentos/`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/valores/`, { credentials: "include" }),
      ])

      if (!depResponse.ok) throw new Error(`Erro ${depResponse.status}`)

      const departamentosData = await depResponse.json()
      const funcionariosData = await funcResponse.json()
      setFuncionarios(funcionariosData.length)

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
        vagasAbertas: 0,
      }))

      setDepartamentos(departamentosFormatados)
    } catch (error) {
      console.error("Erro ao buscar departamentos:", error)
    }
  }, [])

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/metricas-gerais/`, {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setMetricasGerais(data)
        }
      } catch (error) {
        console.error("Erro ao buscar métricas:", error)
      }
    }

    fetchMetricas()
  }, [])

  useEffect(() => {
    const fetchEstatisticasRecrutamento = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/vagas/estatisticas/`, {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setEstatisticasRecrutamento(data)
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas de recrutamento:", error)
      }
    }

    fetchEstatisticasRecrutamento()
  }, [])

  useEffect(() => {
    const fetchEstatisticasFormacoes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/formacoes/estatisticas/`, {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setEstatisticasFormacoes(data)
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas de formações:", error)
      }
    }

    fetchEstatisticasFormacoes()
  }, [])

  useEffect(() => {
    const fetchEvolucaoRecrutamento = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/aplicacoes/evolucao_mensal/`, {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setEvolucaoRecrutamento(data)
        }
      } catch (error) {
        console.error("Erro ao buscar evolução de recrutamento:", error)
      }
    }

    fetchEvolucaoRecrutamento()
  }, [])

  useEffect(() => {
    const fetchEvolucaoFormacoes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/formacoes/evolucao_mensal/`, {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setEvolucaoFormacoes(data)
        }
      } catch (error) {
        console.error("Erro ao buscar evolução de formações:", error)
      }
    }

    fetchEvolucaoFormacoes()
  }, [])

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard/alertas_pendencias/`, {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setAlertas(data)
        } else {
          console.log("[v0] Endpoint de alertas não disponível, usando dados de fallback")
          // Fallback: gerar alertas baseados em dados existentes
          const alertasFallback: Alerta[] = []

          if (estatisticasRecrutamento && estatisticasRecrutamento.vagas_abertas > 0) {
            alertasFallback.push({
              type: "info",
              module: "Recrutamento",
              message: `${estatisticasRecrutamento.vagas_abertas} vagas abertas aguardando candidatos`,
              time: "hoje",
            })
          }

          if (estatisticasFormacoes && estatisticasFormacoes.formacoes_ativas > 0) {
            alertasFallback.push({
              type: "info",
              module: "Formações",
              message: `${estatisticasFormacoes.formacoes_ativas} formações ativas em andamento`,
              time: "hoje",
            })
          }

          setAlertas(alertasFallback)
        }
      } catch (error) {
        console.error("[v0] Erro ao buscar alertas:", error)
        setAlertas([])
      }
    }

    fetchAlertas()
  }, [estatisticasRecrutamento, estatisticasFormacoes])

  useEffect(() => {
    const fetchEvolucao = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard/evolucao_geral/`, {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setEvolucaoData(data)
        } else {
          console.log("[v0] Endpoint de evolução geral não disponível, combinando dados de recrutamento e formações")
          // Fallback: combinar dados de recrutamento e formações
          const mesesMap = new Map<string, any>()

          evolucaoRecrutamento.forEach((item) => {
            mesesMap.set(item.mes, {
              month: item.mes,
              candidaturas: item.candidaturas,
              contratacoes: item.contratacoes,
              funcionarios: item.contratacoes, // Usar contratações como proxy para novos funcionários
              formacoes: 0,
            })
          })

          evolucaoFormacoes.forEach((item) => {
            const existing = mesesMap.get(item.mes) || {
              month: item.mes,
              candidaturas: 0,
              contratacoes: 0,
              funcionarios: 0,
            }
            mesesMap.set(item.mes, {
              ...existing,
              formacoes: item.formacoes,
              participantes: item.participantes,
            })
          })

          setEvolucaoData(Array.from(mesesMap.values()))
        }
      } catch (error) {
        console.error("[v0] Erro ao buscar evolução:", error)
      }
    }

    // Só executar quando tivermos dados de recrutamento e formações
    if (evolucaoRecrutamento.length > 0 || evolucaoFormacoes.length > 0) {
      fetchEvolucao()
    }
  }, [evolucaoRecrutamento, evolucaoFormacoes])

  useEffect(() => {
    const fetchAtividades = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard/atividades_recentes/`, {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setAtividadesRecentes(data)
        } else {
          console.log("[v0] Endpoint de atividades não disponível, usando dados de fallback")
          // Fallback: gerar atividades baseadas em dados existentes
          const atividadesFallback: Atividade[] = []

          if (estatisticasRecrutamento) {
            atividadesFallback.push({
              user: "Sistema",
              action: `registrou ${estatisticasRecrutamento.vagas_abertas} vagas abertas`,
              module: "Recrutamento",
              time: "hoje",
            })
          }

          if (estatisticasFormacoes) {
            atividadesFallback.push({
              user: "Sistema",
              action: `processou ${estatisticasFormacoes.total_inscricoes} inscrições em formações`,
              module: "Formações",
              time: "hoje",
            })
          }

          if (metricasGerais) {
            atividadesFallback.push({
              user: "Sistema",
              action: `atualizou dados de ${metricasGerais.total_funcionarios} funcionários`,
              module: "Recursos Humanos",
              time: "hoje",
            })
          }

          setAtividadesRecentes(atividadesFallback)
        }
      } catch (error) {
        console.error("[v0] Erro ao buscar atividades:", error)
        setAtividadesRecentes([])
      }
    }

    fetchAtividades()
  }, [estatisticasRecrutamento, estatisticasFormacoes, metricasGerais])

  useEffect(() => {
    fetchDepartamentos()
  }, [fetchDepartamentos])

  const overallMetrics = useMemo(() => {
    return [
      {
        title: "Total de Funcionários",
        value: metricasGerais?.total_funcionarios.toString() || funcionarios.toString(),
        change: "+12",
        trend: "up" as const,
        icon: Users,
        color: "cyan",
      },
      {
        title: "Folha de Pagamento Mensal",
        value: metricasGerais ? `KZ ${(metricasGerais.folha_mensal / 1000000).toFixed(1)}M` : "Carregando...",
        change: "+5.2%",
        trend: "up" as const,
        icon: DollarSign,
        color: "green",
      },
      {
        title: "Taxa de Assiduidade",
        value: metricasGerais ? `${metricasGerais.taxa_assiduidade}%` : "Carregando...",
        change: "+2.1%",
        trend: "up" as const,
        icon: UserCheck,
        color: "blue",
      },
      {
        title: "Vagas Abertas",
        value:
          estatisticasRecrutamento?.vagas_abertas.toString() ||
          metricasGerais?.vagas_abertas.toString() ||
          "Carregando...",
        change: "-5",
        trend: "down" as const,
        icon: Briefcase,
        color: "purple",
      },
    ]
  }, [metricasGerais, funcionarios, estatisticasRecrutamento])

  const modules = useMemo(
    () => [
      {
        name: "Folha de Pagamento",
        icon: DollarSign,
        description: "Gestão de salários e benefícios",
        href: "/folha-pagamento",
        stats: {
          active: `${funcionarios} funcionários`,
          pending: metricasGerais
            ? `KZ ${(metricasGerais.folha_mensal / 1000000).toFixed(1)}M mensal`
            : "Carregando...",
        },
        color: "from-green-500 to-emerald-600",
      },
      {
        name: "Assiduidade",
        icon: Calendar,
        description: "Controle de presenças e faltas",
        href: "/admin/assiduidade",
        stats: {
          active: metricasGerais ? `${metricasGerais.taxa_assiduidade}% presença` : "Carregando...",
          pending: "8 justificativas",
        },
        color: "from-blue-500 to-cyan-600",
      },
      {
        name: "Departamentos",
        icon: Building2,
        description: "Gestão de departamentos",
        href: "/departamentos-dashboard",
        stats: {
          active: `${departamentos.length} departamentos`,
          pending: `${funcionarios} funcionários`,
        },
        color: "from-purple-500 to-pink-600",
      },
      {
        name: "Formações",
        icon: GraduationCap,
        description: "Treinamentos e desenvolvimento",
        href: "/admin/formacoes",
        stats: {
          active: estatisticasFormacoes
            ? `${estatisticasFormacoes.formacoes_ativas} formações ativas`
            : "Carregando...",
          pending: estatisticasFormacoes ? `${estatisticasFormacoes.total_inscricoes} inscrições` : "Carregando...",
        },
        color: "from-cyan-500 to-blue-600",
      },
      {
        name: "Recrutamento",
        icon: Users,
        description: "Processos seletivos",
        href: "/list/recrutamento",
        stats: {
          active: estatisticasRecrutamento
            ? `${estatisticasRecrutamento.vagas_abertas} vagas abertas`
            : "Carregando...",
          pending: estatisticasRecrutamento
            ? `${estatisticasRecrutamento.tempo_medio_fechamento_dias} dias médio`
            : "Carregando...",
        },
        color: "from-orange-500 to-red-600",
      },
    ],
    [funcionarios, metricasGerais, departamentos, estatisticasFormacoes, estatisticasRecrutamento],
  )

  const PIE_COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#06b6d4"]

  const dadosGraficoPizza = useMemo(() => {
    return departamentos.map((dep) => ({
      name: dep.nome,
      value: dep.totalFuncionarios || 0,
    }))
  }, [departamentos])

  const dadosEvolucaoCombinados = useMemo(() => {
    if (evolucaoData.length > 0) {
      return evolucaoData
    }

    // Fallback: combinar dados de recrutamento e formações
    const mesesMap = new Map<string, any>()

    evolucaoRecrutamento.forEach((item) => {
      mesesMap.set(item.mes, {
        month: item.mes,
        candidaturas: item.candidaturas,
        contratacoes: item.contratacoes,
        funcionarios: item.contratacoes, // Usar contratações como proxy para novos funcionários
        formacoes: 0,
      })
    })

    evolucaoFormacoes.forEach((item) => {
      const existing = mesesMap.get(item.mes) || { month: item.mes, candidaturas: 0, contratacoes: 0 }
      mesesMap.set(item.mes, {
        ...existing,
        formacoes: item.formacoes,
        participantes: item.participantes,
      })
    })

    return Array.from(mesesMap.values())
  }, [evolucaoData, evolucaoRecrutamento, evolucaoFormacoes])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Administrativo</h1>
            <p className="text-slate-400">Visão geral de todos os módulos do sistema de RH</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
              <Badge className="ml-2 bg-red-500">{alertas.length}</Badge>
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

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
              {alertas.length > 0 ? (
                alertas.map((alert, index) => (
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
                ))
              ) : (
                <p className="text-slate-400 text-center py-4">Nenhum alerta no momento</p>
              )}
            </div>
          </CardContent>
        </Card>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Evolução Geral</CardTitle>
              <CardDescription className="text-slate-400">Crescimento dos principais indicadores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosEvolucaoCombinados}>
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
                  {dadosEvolucaoCombinados.some((d) => "funcionarios" in d) && (
                    <Line type="monotone" dataKey="funcionarios" stroke="#06b6d4" strokeWidth={2} name="Funcionários" />
                  )}
                  {dadosEvolucaoCombinados.some((d) => "formacoes" in d) && (
                    <Line type="monotone" dataKey="formacoes" stroke="#3b82f6" strokeWidth={2} name="Formações" />
                  )}
                  {dadosEvolucaoCombinados.some((d) => "candidaturas" in d) && (
                    <Line type="monotone" dataKey="candidaturas" stroke="#8b5cf6" strokeWidth={2} name="Candidaturas" />
                  )}
                  {dadosEvolucaoCombinados.some((d) => "contratacoes" in d) && (
                    <Line type="monotone" dataKey="contratacoes" stroke="#10b981" strokeWidth={2} name="Contratações" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Distribuição por Departamento</CardTitle>
              <CardDescription className="text-slate-400">Funcionários por departamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                {dadosGraficoPizza.length > 0 ? (
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
                ) : (
                  <p className="text-slate-400">Carregando dados...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

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
              {atividadesRecentes.length > 0 ? (
                atividadesRecentes.map((activity, index) => (
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
                ))
              ) : (
                <p className="text-slate-400 text-center py-4">Nenhuma atividade recente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
