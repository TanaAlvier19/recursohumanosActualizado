"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Target, TrendingUp, AlertCircle, CheckCircle, Plus } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts"

export default function CompetenciasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartamento, setFilterDepartamento] = useState("todos")

  const funcionarios = [
    {
      id: 1,
      nome: "João Silva",
      cargo: "Analista de TI",
      departamento: "Tecnologia",
      competencias: [
        { nome: "Liderança", nivelAtual: 7, nivelDesejado: 9, gap: 2 },
        { nome: "Técnicas", nivelAtual: 8, nivelDesejado: 9, gap: 1 },
        { nome: "Comunicação", nivelAtual: 6, nivelDesejado: 8, gap: 2 },
        { nome: "Gestão de Projetos", nivelAtual: 5, nivelDesejado: 8, gap: 3 },
        { nome: "Inovação", nivelAtual: 7, nivelDesejado: 8, gap: 1 },
      ],
      mediaAtual: 6.6,
      mediaDesejada: 8.4,
      gapMedio: 1.8,
    },
    {
      id: 2,
      nome: "Maria Costa",
      cargo: "Gerente de Vendas",
      departamento: "Comercial",
      competencias: [
        { nome: "Liderança", nivelAtual: 9, nivelDesejado: 10, gap: 1 },
        { nome: "Negociação", nivelAtual: 9, nivelDesejado: 10, gap: 1 },
        { nome: "Comunicação", nivelAtual: 8, nivelDesejado: 9, gap: 1 },
        { nome: "Análise de Dados", nivelAtual: 6, nivelDesejado: 8, gap: 2 },
        { nome: "Gestão de Equipes", nivelAtual: 8, nivelDesejado: 9, gap: 1 },
      ],
      mediaAtual: 8.0,
      mediaDesejada: 9.2,
      gapMedio: 1.2,
    },
    {
      id: 3,
      nome: "Pedro Santos",
      cargo: "Analista de RH",
      departamento: "Recursos Humanos",
      competencias: [
        { nome: "Gestão de Pessoas", nivelAtual: 6, nivelDesejado: 8, gap: 2 },
        { nome: "Recrutamento", nivelAtual: 5, nivelDesejado: 8, gap: 3 },
        { nome: "Comunicação", nivelAtual: 7, nivelDesejado: 8, gap: 1 },
        { nome: "Legislação", nivelAtual: 4, nivelDesejado: 7, gap: 3 },
        { nome: "Análise", nivelAtual: 6, nivelDesejado: 8, gap: 2 },
      ],
      mediaAtual: 5.6,
      mediaDesejada: 7.8,
      gapMedio: 2.2,
    },
  ]

  const stats = {
    totalFuncionarios: 87,
    gapCritico: 23,
    emDesenvolvimento: 54,
    competentesCompletos: 10,
  }

  const filteredFuncionarios = funcionarios.filter((func) => {
    const matchesSearch =
      func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartamento = filterDepartamento === "todos" || func.departamento === filterDepartamento
    return matchesSearch && matchesDepartamento
  })

  const getGapColor = (gap: number) => {
    if (gap >= 3) return "text-red-400"
    if (gap >= 2) return "text-yellow-400"
    return "text-green-400"
  }

  const getGapBadgeColor = (gap: number) => {
    if (gap >= 3) return "bg-red-500/20 text-red-400 border-red-500/50"
    if (gap >= 2) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
    return "bg-green-500/20 text-green-400 border-green-500/50"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Matriz de Competências</h1>
            <p className="text-slate-400">Análise de gaps e desenvolvimento de competências</p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Nova Avaliação
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Avaliados</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.totalFuncionarios}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Gap Crítico</p>
                  <p className="text-3xl font-bold text-red-400 mt-1">{stats.gapCritico}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Em Desenvolvimento</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.emDesenvolvimento}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Competentes</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">{stats.competentesCompletos}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por funcionário ou cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Select value={filterDepartamento} onValueChange={setFilterDepartamento}>
                <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="todos">Todos Departamentos</SelectItem>
                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Competências List */}
        <div className="space-y-6">
          {filteredFuncionarios.map((funcionario) => {
            const radarData = funcionario.competencias.map((comp) => ({
              competencia: comp.nome,
              atual: comp.nivelAtual,
              desejado: comp.nivelDesejado,
            }))

            return (
              <Card key={funcionario.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side - Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{funcionario.nome}</h3>
                        <p className="text-cyan-400">{funcionario.cargo}</p>
                        <p className="text-slate-400 text-sm">{funcionario.departamento}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-700/30 rounded-lg">
                        <div>
                          <p className="text-slate-400 text-sm">Média Atual</p>
                          <p className="text-2xl font-bold text-white">{funcionario.mediaAtual.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Meta</p>
                          <p className="text-2xl font-bold text-cyan-400">{funcionario.mediaDesejada.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Gap Médio</p>
                          <p className={`text-2xl font-bold ${getGapColor(funcionario.gapMedio)}`}>
                            {funcionario.gapMedio.toFixed(1)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-white font-semibold">Competências Detalhadas</h4>
                        {funcionario.competencias.map((comp, idx) => (
                          <div key={idx} className="p-3 bg-slate-700/30 rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300 font-medium">{comp.nome}</span>
                              <Badge className={getGapBadgeColor(comp.gap)}>Gap: {comp.gap}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                  <span className="text-slate-400">Atual</span>
                                  <span className="text-white font-semibold">{comp.nivelAtual}/10</span>
                                </div>
                                <Progress value={comp.nivelAtual * 10} className="h-2" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                  <span className="text-slate-400">Meta</span>
                                  <span className="text-cyan-400 font-semibold">{comp.nivelDesejado}/10</span>
                                </div>
                                <Progress value={comp.nivelDesejado * 10} className="h-2" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Side - Radar Chart */}
                    <div className="flex flex-col items-center justify-center">
                      <h4 className="text-white font-semibold mb-4">Mapa de Competências</h4>
                      <ResponsiveContainer width="100%" height={400}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#475569" />
                          <PolarAngleAxis dataKey="competencia" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                          <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: "#94a3b8" }} />
                          <Radar name="Nível Atual" dataKey="atual" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                          <Radar
                            name="Nível Desejado"
                            dataKey="desejado"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.3}
                          />
                          <Legend wrapperStyle={{ color: "#fff" }} />
                        </RadarChart>
                      </ResponsiveContainer>
                      <Button className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                        Gerar Plano de Desenvolvimento
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
