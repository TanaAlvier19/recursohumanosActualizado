"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Clock,
  Target,
  Download,
  DollarSign,
  Award,
  UserCheck,
} from "lucide-react"

const COLORS = ["#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

export default function RelatoriosRecrutamento() {
  const [periodo, setPeriodo] = useState("ultimo-mes")
  const [departamento, setDepartamento] = useState("todos")

  // Dados para gráficos
  const evolucaoMensal = [
    { mes: "Jan", candidatos: 145, contratacoes: 12, entrevistas: 45 },
    { mes: "Fev", candidatos: 178, contratacoes: 15, entrevistas: 52 },
    { mes: "Mar", candidatos: 203, contratacoes: 18, entrevistas: 61 },
    { mes: "Abr", candidatos: 189, contratacoes: 14, entrevistas: 58 },
    { mes: "Mai", candidatos: 234, contratacoes: 21, entrevistas: 73 },
    { mes: "Jun", candidatos: 267, contratacoes: 24, entrevistas: 82 },
  ]

  const funnelData = [
    { etapa: "Candidaturas", valor: 1247, taxa: 100 },
    { etapa: "Triagem", valor: 523, taxa: 42 },
    { etapa: "Entrevista RH", valor: 234, taxa: 19 },
    { etapa: "Teste Técnico", valor: 156, taxa: 13 },
    { etapa: "Entrevista Técnica", valor: 89, taxa: 7 },
    { etapa: "Proposta", valor: 45, taxa: 4 },
    { etapa: "Contratação", valor: 38, taxa: 3 },
  ]

  const fontesRecrutamento = [
    { nome: "LinkedIn", candidatos: 456, contratacoes: 18 },
    { nome: "Indeed", candidatos: 312, contratacoes: 12 },
    { nome: "Site Carreira", candidatos: 289, contratacoes: 15 },
    { nome: "Indicação", candidatos: 178, contratacoes: 22 },
    { nome: "Universidades", candidatos: 134, contratacoes: 8 },
    { nome: "Outros", candidatos: 98, contratacoes: 5 },
  ]

  const tempoMedioPorEtapa = [
    { etapa: "Triagem", dias: 2.5 },
    { etapa: "Entrevista RH", dias: 5.2 },
    { etapa: "Teste Técnico", dias: 3.8 },
    { etapa: "Entrevista Técnica", dias: 7.1 },
    { etapa: "Proposta", dias: 4.3 },
  ]

  const departamentosData = [
    { nome: "Tecnologia", vagas: 45, candidatos: 523, contratacoes: 18 },
    { nome: "Vendas", vagas: 23, candidatos: 312, contratacoes: 12 },
    { nome: "Marketing", vagas: 15, candidatos: 234, contratacoes: 8 },
    { nome: "Operações", vagas: 18, candidatos: 189, contratacoes: 10 },
    { nome: "Financeiro", vagas: 12, candidatos: 145, contratacoes: 6 },
  ]

  const performanceRecrutadores = [
    { nome: "Ana Silva", vagas: 12, candidatos: 156, entrevistas: 45, contratacoes: 8, satisfacao: 4.8 },
    { nome: "Carlos Santos", vagas: 10, candidatos: 134, entrevistas: 38, contratacoes: 7, satisfacao: 4.6 },
    { nome: "Maria Oliveira", vagas: 15, candidatos: 189, entrevistas: 52, contratacoes: 10, satisfacao: 4.9 },
    { nome: "João Costa", vagas: 8, candidatos: 98, entrevistas: 28, contratacoes: 5, satisfacao: 4.5 },
  ]

  const custosPorVaga = [
    { categoria: "Anúncios", valor: 45000 },
    { categoria: "Plataformas", valor: 28000 },
    { categoria: "Eventos", valor: 15000 },
    { categoria: "Agências", valor: 62000 },
    { categoria: "Outros", valor: 8000 },
  ]

  const metricas = [
    {
      titulo: "Taxa de Conversão",
      valor: "3.05%",
      descricao: "Candidatos → Contratações",
      icone: Target,
      tendencia: "+0.3%",
      positivo: true,
    },
    {
      titulo: "Tempo Médio",
      valor: "23 dias",
      descricao: "Candidatura → Contratação",
      icone: Clock,
      tendencia: "-2 dias",
      positivo: true,
    },
    {
      titulo: "Custo por Contratação",
      valor: "R$ 4.158",
      descricao: "Investimento médio",
      icone: DollarSign,
      tendencia: "+R$ 245",
      positivo: false,
    },
    {
      titulo: "Qualidade de Contratação",
      valor: "4.7/5.0",
      descricao: "Avaliação gestores",
      icone: Award,
      tendencia: "+0.2",
      positivo: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Relatórios e Analytics
            </h1>
            <p className="text-slate-400 mt-1">Análise completa do processo de recrutamento</p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        {/* Filtros */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-slate-300">Período</Label>
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ultima-semana">Última Semana</SelectItem>
                    <SelectItem value="ultimo-mes">Último Mês</SelectItem>
                    <SelectItem value="ultimo-trimestre">Último Trimestre</SelectItem>
                    <SelectItem value="ultimo-ano">Último Ano</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">Departamento</Label>
                <Select value={departamento} onValueChange={setDepartamento}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="vendas">Vendas</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operacoes">Operações</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">Data Início</Label>
                <Input type="date" className="bg-slate-900 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-slate-300">Data Fim</Label>
                <Input type="date" className="bg-slate-900 border-slate-700 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricas.map((metrica, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{metrica.titulo}</p>
                    <p className="text-2xl font-bold text-white mt-1">{metrica.valor}</p>
                    <p className="text-slate-500 text-xs mt-1">{metrica.descricao}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
                    <metrica.icone className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  {metrica.positivo ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={metrica.positivo ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
                    {metrica.tendencia}
                  </span>
                  <span className="text-slate-500 text-sm">vs período anterior</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs de Relatórios */}
        <Tabs defaultValue="visao-geral" className="space-y-4">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="funil">Funil de Conversão</TabsTrigger>
            <TabsTrigger value="fontes">Fontes</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="custos">Custos</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="visao-geral" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Evolução Mensal</CardTitle>
                  <CardDescription>Candidatos, entrevistas e contratações</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={evolucaoMensal}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="mes" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} />
                      <Legend />
                      <Line type="monotone" dataKey="candidatos" stroke="#06b6d4" strokeWidth={2} />
                      <Line type="monotone" dataKey="entrevistas" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="contratacoes" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Tempo Médio por Etapa</CardTitle>
                  <CardDescription>Dias em cada fase do processo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={tempoMedioPorEtapa} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis type="number" stroke="#94a3b8" />
                      <YAxis dataKey="etapa" type="category" stroke="#94a3b8" width={120} />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} />
                      <Bar dataKey="dias" fill="#06b6d4" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Performance por Departamento</CardTitle>
                <CardDescription>Vagas, candidatos e contratações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departamentosData.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white font-medium">{dept.nome}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-slate-400">
                            <Briefcase className="w-4 h-4 inline mr-1" />
                            {dept.vagas} vagas
                          </span>
                          <span className="text-slate-400">
                            <Users className="w-4 h-4 inline mr-1" />
                            {dept.candidatos} candidatos
                          </span>
                          <span className="text-green-400">
                            <UserCheck className="w-4 h-4 inline mr-1" />
                            {dept.contratacoes} contratações
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-400">
                          {((dept.contratacoes / dept.candidatos) * 100).toFixed(1)}%
                        </p>
                        <p className="text-slate-500 text-sm">Taxa conversão</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Funil de Conversão */}
          <TabsContent value="funil" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Funil de Recrutamento</CardTitle>
                <CardDescription>Conversão em cada etapa do processo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {funnelData.map((etapa, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{etapa.etapa}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-cyan-400 font-bold">{etapa.valor}</span>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {etapa.taxa}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all"
                          style={{ width: `${etapa.taxa}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fontes de Recrutamento */}
          <TabsContent value="fontes" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Candidatos por Fonte</CardTitle>
                  <CardDescription>Distribuição de candidaturas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={fontesRecrutamento}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="candidatos"
                      >
                        {fontesRecrutamento.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">ROI por Fonte</CardTitle>
                  <CardDescription>Efetividade de cada canal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fontesRecrutamento.map((fonte, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{fonte.nome}</p>
                          <p className="text-slate-400 text-sm">{fonte.candidatos} candidatos</p>
                        </div>
                        <div className="text-right">
                          <p className="text-cyan-400 font-bold">{fonte.contratacoes}</p>
                          <p className="text-slate-500 text-sm">contratações</p>
                        </div>
                        <Badge variant="outline" className="border-green-500/50 text-green-400">
                          {((fonte.contratacoes / fonte.candidatos) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Recrutadores */}
          <TabsContent value="performance" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Performance dos Recrutadores</CardTitle>
                <CardDescription>Métricas individuais da equipe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceRecrutadores.map((recrutador, index) => (
                    <div key={index} className="p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white font-medium">{recrutador.nome}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Award className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm">{recrutador.satisfacao}</span>
                            <span className="text-slate-500 text-sm">satisfação</span>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600">
                          {recrutador.contratacoes} contratações
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-cyan-400">{recrutador.vagas}</p>
                          <p className="text-slate-500 text-sm">Vagas</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-400">{recrutador.candidatos}</p>
                          <p className="text-slate-500 text-sm">Candidatos</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-400">{recrutador.entrevistas}</p>
                          <p className="text-slate-500 text-sm">Entrevistas</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custos */}
          <TabsContent value="custos" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Distribuição de Custos</CardTitle>
                  <CardDescription>Investimento por categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={custosPorVaga}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="valor"
                      >
                        {custosPorVaga.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
                        formatter={(value: number) => `R$ ${value.toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Resumo Financeiro</CardTitle>
                  <CardDescription>Análise de investimentos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                      <p className="text-slate-400 text-sm">Investimento Total</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        R$ {custosPorVaga.reduce((acc, item) => acc + item.valor, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {custosPorVaga.map((custo, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                          <span className="text-white">{custo.categoria}</span>
                          <span className="text-cyan-400 font-bold">R$ {custo.valor.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
