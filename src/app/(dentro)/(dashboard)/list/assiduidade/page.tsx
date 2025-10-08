"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MetricCard } from "@/components/metrcCard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Fingerprint,
  FileText,
  BarChart3,
  Timer,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react"
import {
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
import { fetchApi, getApiUrl } from "@/lib/api-config"

interface EstatisticasAssiduidade {
  presentes_hoje: number
  total_funcionarios: number
  taxa_presenca: number
  atrasos_hoje: number
  ausencias: number
  evolucao_mensal: Array<{
    mes: string
    presentes: number
    ausentes: number
    atrasados: number
  }>
}

interface RegistroRecente {
  id: number
  funcionario: string
  departamento: string
  entrada: string
  saida: string
  status: string
}

function useAssiduidadeData() {
  const [estatisticas, setEstatisticas] = useState<EstatisticasAssiduidade | null>(null)
  const [registrosRecentes, setRegistrosRecentes] = useState<RegistroRecente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [estatisticasRes, registrosRes] = await Promise.all([
          fetch("http://localhost:8000/registros-ponto/estatisticas/",{
            credentials:"include"
          }),
          fetch("http://localhost:8000/registros-ponto/recentes/",{
            credentials:"include"
          }),
        ])

        const estatisticasData = await estatisticasRes.json()
        const registrosData = await registrosRes.json()

        setEstatisticas(estatisticasData)
        setRegistrosRecentes(registrosData.registros || [])
      } catch (error) {
        console.error("[v0] Erro ao buscar dados de assiduidade:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { estatisticas, registrosRecentes, loading }
}

export default function AssiduidadePage() {
  const { estatisticas, registrosRecentes, loading } = useAssiduidadeData()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
      </div>
    )
  }

  const distribuicaoData = [
    { name: "Presentes", value: estatisticas?.presentes_hoje || 0, color: "#10b981" },
    { name: "Ausentes", value: estatisticas?.ausencias || 0, color: "#ef4444" },
    { name: "Atrasados", value: estatisticas?.atrasos_hoje || 0, color: "#f59e0b" },
  ]

  const departamentoData = [
    { nome: "TI", taxa: 98.5 },
    { nome: "RH", taxa: 97.2 },
    { nome: "Vendas", taxa: 95.8 },
    { nome: "Financeiro", taxa: 99.1 },
    { nome: "Operações", taxa: 94.3 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
              Assiduidade e Ponto
            </h1>
            <p className="mt-2 text-slate-400">Sistema de controle de frequência com biometria</p>
          </div>
          <div className="flex gap-3">
            <Link href="/list/assiduidade/registro-ponto">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700">
                <Fingerprint className="mr-2 h-4 w-4" />
                Registrar Ponto
              </Button>
            </Link>
            <Link href="/list/assiduidade/relatorios">
              <Button variant="outline" className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700">
                <FileText className="mr-2 h-4 w-4" />
                Exportar Relatório
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Presentes Hoje"
            value={estatisticas?.presentes_hoje.toString() || "0"}
            subtitle={`de ${estatisticas?.total_funcionarios || 0} funcionários`}
            icon={CheckCircle2}
            trend={{ value: 2.5, isPositive: true }}
            className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent"
          />
          <MetricCard
            title="Taxa de Presença"
            value={`${estatisticas?.taxa_presenca.toFixed(1) || "0"}%`}
            subtitle="média mensal"
            icon={TrendingUp}
            trend={{ value: 1.2, isPositive: true }}
            className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent"
          />
          <MetricCard
            title="Atrasos Hoje"
            value={estatisticas?.atrasos_hoje.toString() || "0"}
            subtitle="funcionários"
            icon={Clock}
            trend={{ value: 3, isPositive: false }}
            className="border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent"
          />
          <MetricCard
            title="Ausências"
            value={estatisticas?.ausencias.toString() || "0"}
            subtitle="não justificadas"
            icon={AlertTriangle}
            trend={{ value: 1, isPositive: false }}
            className="border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent"
          />
        </div>

        <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <h2 className="mb-6 text-xl font-semibold text-white">Módulos do Sistema</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/list/assiduidade/registro-ponto"
              className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-cyan-500/50 hover:bg-slate-700/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <Fingerprint className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">Registro de Ponto</h3>
                  <p className="text-sm text-slate-400">Marcação biométrica de entrada, saída e intervalos</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 transition-colors group-hover:text-cyan-400" />
              </div>
            </Link>

            <Link
              href="/list/assiduidade/horarios-escalas"
              className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-blue-500/50 hover:bg-slate-700/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                    <Calendar className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">Horários e Escalas</h3>
                  <p className="text-sm text-slate-400">Gestão de turnos, escalas e horários flexíveis</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 transition-colors group-hover:text-blue-400" />
              </div>
            </Link>

            <Link
              href="/list/assiduidade/justificativas"
              className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-purple-500/50 hover:bg-slate-700/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <FileText className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">Justificativas e Abonos</h3>
                  <p className="text-sm text-slate-400">Sistema de justificativas com aprovação e documentos</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 transition-colors group-hover:text-purple-400" />
              </div>
            </Link>

            <Link
              href="/list/assiduidade/banco-horas"
              className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-green-500/50 hover:bg-slate-700/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <Timer className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">Banco de Horas</h3>
                  <p className="text-sm text-slate-400">Saldo de horas extras, devidas e compensações</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 transition-colors group-hover:text-green-400" />
              </div>
            </Link>

            <Link
              href="/list/assiduidade/relatorios"
              className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-amber-500/50 hover:bg-slate-700/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                    <BarChart3 className="h-6 w-6 text-amber-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">Relatórios de Frequência</h3>
                  <p className="text-sm text-slate-400">Espelho de ponto, relatórios individuais e consolidados</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 transition-colors group-hover:text-amber-400" />
              </div>
            </Link>

            <Link
              href="/list/assiduidade/alertas"
              className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-red-500/50 hover:bg-slate-700/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-rose-500/20">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">Alertas e Inconsistências</h3>
                  <p className="text-sm text-slate-400">Detecção de problemas e notificações automáticas</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 transition-colors group-hover:text-red-400" />
              </div>
            </Link>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-white">Evolução de Presença</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estatisticas?.evolucao_mensal || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="mes" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="presentes" fill="#10b981" name="Presentes" />
                <Bar dataKey="ausentes" fill="#ef4444" name="Ausentes" />
                <Bar dataKey="atrasados" fill="#f59e0b" name="Atrasados" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-white">Distribuição Hoje</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribuicaoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distribuicaoData.map((entry, index) => (
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
          </Card>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-lg font-semibold text-white">Taxa de Presença por Departamento</h3>
          <div className="space-y-4">
            {departamentoData.map((dept) => (
              <div key={dept.nome}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">{dept.nome}</span>
                  <span className="text-sm font-semibold text-cyan-400">{dept.taxa}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${dept.taxa}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Registros Recentes</h3>
            <Link href="/list/assiduidade/registro-ponto">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700"
              >
                Ver Todos
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">Funcionário</th>
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">Departamento</th>
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">Entrada</th>
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">Saída</th>
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {registrosRecentes.map((registro) => (
                  <tr
                    key={registro.id}
                    className="border-b border-slate-700/50 transition-colors hover:bg-slate-700/30"
                  >
                    <td className="py-3 text-sm text-white">{registro.funcionario}</td>
                    <td className="py-3 text-sm text-slate-300">{registro.departamento}</td>
                    <td className="py-3 text-sm text-slate-300">{registro.entrada}</td>
                    <td className="py-3 text-sm text-slate-300">{registro.saida}</td>
                    <td className="py-3">
                      {registro.status === "normal" && (
                        <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">Normal</Badge>
                      )}
                      {registro.status === "atraso" && (
                        <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">Atraso</Badge>
                      )}
                      {registro.status === "trabalhando" && (
                        <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">Trabalhando</Badge>
                      )}
                      {registro.status === "ausente" && (
                        <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">Ausente</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
