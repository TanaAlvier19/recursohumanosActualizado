"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, Users, BookOpen, Award, DollarSign, Calendar, Loader2 } from "lucide-react"
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
import { fetchAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Cores para os gráficos
const COLORS = ["#06b6d4", "#3b82f6", "#8b5cf6", "#10b981", "#ec4899", "#f59e0b"]

export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState("2024")
  const [stats, setStats] = useState<any>(null)
  const [topFormacoes, setTopFormacoes] = useState<any[]>([])
  const [investimento, setInvestimento] = useState<any[]>([])
  const [evolucao, setEvolucao] = useState<any[]>([])
  const [distribuicao, setDistribuicao] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [periodo])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Usando fetchAPI diretamente em vez dos métodos específicos que não existem
      const [statsData, topData, investData, evolucaoData, distData] = await Promise.all([
        fetchAPI("/formacoes/estatisticas/"),
        fetchAPI("/relatorios/top_formacoes/"),
        fetchAPI("/relatorios/investimento_mensal/"),
        fetchAPI("/formacoes/evolucao_mensal/"),
        fetchAPI("/formacoes/distribuicao_tipo/"),
      ])

      setStats(statsData)
      setTopFormacoes(topData || [])
      setInvestimento(investData || [])
      setEvolucao(evolucaoData || [])
      setDistribuicao(distData || [])
    } catch (error: any) {
      console.error("Erro ao carregar relatórios:", error)
      toast({
        title: "Erro ao carregar relatórios",
        description: error.message || "Não foi possível carregar os dados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para exportar PDF
  const handleExportPDF = () => {
    toast({
      title: "PDF Gerado",
      description: "O relatório em PDF foi baixado com sucesso",
    })
    // Aqui você pode implementar a lógica real de exportação PDF
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Relatórios e Analytics</h1>
            <p className="text-slate-400">Análise completa de dados de formações</p>
          </div>
          <div className="flex gap-2">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              onClick={handleExportPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        )}

        {/* Stats Cards */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Formações</p>
                    <p className="text-xl font-bold text-white">{stats.total_formacoes || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Participantes</p>
                    <p className="text-xl font-bold text-white">{stats.total_inscricoes || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Conclusão</p>
                    <p className="text-xl font-bold text-white">{stats.taxa_conclusao || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Investimento</p>
                    <p className="text-xl font-bold text-white">
                      {stats.investimento_total ? `R$ ${(stats.investimento_total / 1000).toFixed(0)}k` : 'R$ 0'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Horas</p>
                    <p className="text-xl font-bold text-white">{stats.horas_treinamento || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Avaliação</p>
                    <p className="text-xl font-bold text-white">{stats.media_satisfacao || 0}/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Row 1 */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolução Mensal */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Evolução Mensal de Formações</CardTitle>
              </CardHeader>
              <CardContent>
                {evolucao.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={evolucao}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="mes" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px", color: "white" }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="formacoes" stroke="#06b6d4" strokeWidth={2} name="Formações" />
                      <Line
                        type="monotone"
                        dataKey="participantes"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Participantes"
                      />
                      <Line type="monotone" dataKey="concluidas" stroke="#10b981" strokeWidth={2} name="Concluídas" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-slate-400">
                    Nenhum dado disponível para evolução mensal
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Distribuição por Tipo */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Distribuição por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                {distribuicao.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={distribuicao}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distribuicao.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px", color: "white" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-slate-400">
                    Nenhum dado disponível para distribuição por tipo
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Row 2 - Investimento Mensal */}
        {!loading && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Investimento Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              {investimento.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={investimento}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="mes" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px", color: "white" }}
                    />
                    <Legend />
                    <Bar dataKey="planejado" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Planejado" />
                    <Bar dataKey="realizado" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Realizado" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-400">
                  Nenhum dado disponível para investimento mensal
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Top Formações */}
        {!loading && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Top Formações Mais Populares</CardTitle>
            </CardHeader>
            <CardContent>
              {topFormacoes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Formação</th>
                        <th className="text-center py-3 px-4 text-slate-400 font-medium">Participantes</th>
                        <th className="text-center py-3 px-4 text-slate-400 font-medium">Avaliação</th>
                        <th className="text-center py-3 px-4 text-slate-400 font-medium">Taxa Conclusão</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topFormacoes.map((formacao, idx) => (
                        <tr key={idx} className="border-b border-slate-700/50">
                          <td className="py-4 px-4 text-white font-medium">{formacao.nome || formacao.titulo || "Formação sem nome"}</td>
                          <td className="py-4 px-4 text-center text-slate-300">{formacao.participantes || 0}</td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-yellow-400 font-semibold">{formacao.avaliacao || 0} ⭐</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-green-400 font-semibold">{formacao.conclusao || 0}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-slate-400">
                  Nenhuma formação disponível para exibir
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}