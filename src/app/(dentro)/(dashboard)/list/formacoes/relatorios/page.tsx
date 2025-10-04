"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, Users, BookOpen, Award, DollarSign, Calendar } from "lucide-react"
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

export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState("2024")
  const [tipoDado, setTipoDado] = useState("geral")

  const evolucaoMensal = [
    { mes: "Jan", formacoes: 12, participantes: 145, concluidas: 10 },
    { mes: "Fev", formacoes: 15, participantes: 178, concluidas: 13 },
    { mes: "Mar", formacoes: 18, participantes: 210, concluidas: 16 },
    { mes: "Abr", formacoes: 14, participantes: 165, concluidas: 12 },
    { mes: "Mai", formacoes: 20, participantes: 235, concluidas: 18 },
    { mes: "Jun", formacoes: 22, participantes: 260, concluidas: 20 },
  ]

  const distribuicaoPorDepartamento = [
    { departamento: "TI", total: 45, percentual: 28 },
    { departamento: "Vendas", total: 38, percentual: 24 },
    { departamento: "RH", total: 25, percentual: 16 },
    { departamento: "Marketing", total: 22, percentual: 14 },
    { departamento: "Financeiro", total: 18, percentual: 11 },
    { departamento: "Outros", total: 12, percentual: 7 },
  ]

  const distribuicaoPorTipo = [
    { tipo: "Presencial", valor: 45, cor: "#06b6d4" },
    { tipo: "Online", valor: 35, cor: "#3b82f6" },
    { tipo: "Híbrido", valor: 15, cor: "#8b5cf6" },
    { tipo: "EAD", valor: 5, cor: "#ec4899" },
  ]

  const topFormacoes = [
    { nome: "Liderança Estratégica", participantes: 85, avaliacao: 4.8, conclusao: 92 },
    { nome: "Excel Avançado", participantes: 72, avaliacao: 4.6, conclusao: 88 },
    { nome: "Técnicas de Negociação", participantes: 68, avaliacao: 4.9, conclusao: 95 },
    { nome: "Marketing Digital", participantes: 65, avaliacao: 4.7, conclusao: 90 },
    { nome: "Gestão de Projetos", participantes: 58, avaliacao: 4.5, conclusao: 85 },
  ]

  const investimentoMensal = [
    { mes: "Jan", planejado: 45000, realizado: 42000 },
    { mes: "Fev", planejado: 50000, realizado: 48000 },
    { mes: "Mar", planejado: 55000, realizado: 53000 },
    { mes: "Abr", planejado: 48000, realizado: 45000 },
    { mes: "Mai", planejado: 60000, realizado: 58000 },
    { mes: "Jun", planejado: 65000, realizado: 62000 },
  ]

  const stats = {
    totalFormacoes: 124,
    totalParticipantes: 1248,
    taxaConclusao: 89,
    investimentoTotal: 308000,
    horasTreinamento: 4560,
    avaliacaoMedia: 4.7,
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
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Formações</p>
                  <p className="text-xl font-bold text-white">{stats.totalFormacoes}</p>
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
                  <p className="text-xl font-bold text-white">{stats.totalParticipantes}</p>
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
                  <p className="text-xl font-bold text-white">{stats.taxaConclusao}%</p>
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
                  <p className="text-xl font-bold text-white">{(stats.investimentoTotal / 1000).toFixed(0)}k</p>
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
                  <p className="text-xl font-bold text-white">{stats.horasTreinamento}</p>
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
                  <p className="text-xl font-bold text-white">{stats.avaliacaoMedia}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Evolução Mensal de Formações</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucaoMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="mes" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="formacoes" stroke="#06b6d4" strokeWidth={2} name="Formações" />
                  <Line type="monotone" dataKey="participantes" stroke="#3b82f6" strokeWidth={2} name="Participantes" />
                  <Line type="monotone" dataKey="concluidas" stroke="#10b981" strokeWidth={2} name="Concluídas" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Distribuição por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribuicaoPorTipo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ tipo, valor }) => `${tipo}: ${valor}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {distribuicaoPorTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Participantes por Departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distribuicaoPorDepartamento}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="departamento" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                  />
                  <Bar dataKey="total" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Investimento Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={investimentoMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="mes" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                  />
                  <Legend />
                  <Bar dataKey="planejado" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Planejado" />
                  <Bar dataKey="realizado" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Realizado" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Formações */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Top 5 Formações Mais Populares</CardTitle>
          </CardHeader>
          <CardContent>
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
                      <td className="py-4 px-4 text-white font-medium">{formacao.nome}</td>
                      <td className="py-4 px-4 text-center text-slate-300">{formacao.participantes}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-yellow-400 font-semibold">{formacao.avaliacao} ⭐</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-green-400 font-semibold">{formacao.conclusao}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
