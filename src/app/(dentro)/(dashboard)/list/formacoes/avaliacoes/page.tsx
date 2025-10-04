"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Award, Download, Eye, TrendingUp, BookOpen } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

export default function AvaliacoesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFormacao, setFilterFormacao] = useState("todas")

  const avaliacoes = [
    {
      id: 1,
      funcionario: "João Silva",
      formacao: "Liderança Estratégica",
      instrutor: "Dr. Carlos Silva",
      dataInicio: "2024-01-15",
      dataConclusao: "2024-02-15",
      notaFinal: 9.5,
      presenca: 100,
      avaliacaoInstrutor: 5,
      avaliacaoConteudo: 5,
      avaliacaoInfraestrutura: 4,
      feedback: "Excelente formação, conteúdo muito relevante para minha função.",
      certificadoEmitido: true,
      status: "Concluída",
    },
    {
      id: 2,
      funcionario: "Maria Costa",
      formacao: "Técnicas de Negociação",
      instrutor: "Roberto Mendes",
      dataInicio: "2024-01-20",
      dataConclusao: "2024-02-20",
      notaFinal: 8.7,
      presenca: 95,
      avaliacaoInstrutor: 5,
      avaliacaoConteudo: 4,
      avaliacaoInfraestrutura: 5,
      feedback: "Muito prático e aplicável ao dia a dia.",
      certificadoEmitido: true,
      status: "Concluída",
    },
    {
      id: 3,
      funcionario: "Pedro Santos",
      formacao: "Excel Avançado",
      instrutor: "Profa. Ana Costa",
      dataInicio: "2024-02-01",
      dataConclusao: null,
      notaFinal: null,
      presenca: 80,
      avaliacaoInstrutor: null,
      avaliacaoConteudo: null,
      avaliacaoInfraestrutura: null,
      feedback: null,
      certificadoEmitido: false,
      status: "Em Andamento",
    },
    {
      id: 4,
      funcionario: "Ana Oliveira",
      formacao: "Marketing Digital",
      instrutor: "Dra. Mariana Oliveira",
      dataInicio: "2024-01-10",
      dataConclusao: "2024-02-10",
      notaFinal: 9.2,
      presenca: 100,
      avaliacaoInstrutor: 5,
      avaliacaoConteudo: 5,
      avaliacaoInfraestrutura: 5,
      feedback: "Instrutora excepcional, metodologia muito eficaz.",
      certificadoEmitido: true,
      status: "Concluída",
    },
  ]

  const stats = {
    totalAvaliacoes: 156,
    mediaGeral: 8.9,
    certificadosEmitidos: 142,
    taxaConclusao: 91,
  }

  const filteredAvaliacoes = avaliacoes.filter((avaliacao) => {
    const matchesSearch =
      avaliacao.funcionario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      avaliacao.formacao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFormacao = filterFormacao === "todas" || avaliacao.formacao === filterFormacao
    return matchesSearch && matchesFormacao
  })

  const renderStars = (rating: number | null) => {
    if (rating === null) return <span className="text-slate-500">Pendente</span>
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Avaliações e Certificados</h1>
            <p className="text-slate-400">Gerencie avaliações de desempenho e emissão de certificados</p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Avaliações</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.totalAvaliacoes}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Média Geral</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.mediaGeral}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Certificados</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.certificadosEmitidos}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Taxa Conclusão</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.taxaConclusao}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por funcionário ou formação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Select value={filterFormacao} onValueChange={setFilterFormacao}>
                <SelectTrigger className="w-full md:w-64 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="todas">Todas as Formações</SelectItem>
                  <SelectItem value="Liderança Estratégica">Liderança Estratégica</SelectItem>
                  <SelectItem value="Técnicas de Negociação">Técnicas de Negociação</SelectItem>
                  <SelectItem value="Excel Avançado">Excel Avançado</SelectItem>
                  <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Avaliações List */}
        <div className="space-y-4">
          {filteredAvaliacoes.map((avaliacao) => (
            <Card
              key={avaliacao.id}
              className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{avaliacao.funcionario}</h3>
                        <p className="text-cyan-400">{avaliacao.formacao}</p>
                        <p className="text-slate-400 text-sm">Instrutor: {avaliacao.instrutor}</p>
                      </div>
                      <Badge
                        className={
                          avaliacao.status === "Concluída"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }
                      >
                        {avaliacao.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-slate-400 text-sm">Nota Final</p>
                        <p className="text-2xl font-bold text-white">
                          {avaliacao.notaFinal ? avaliacao.notaFinal.toFixed(1) : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Presença</p>
                        <div className="flex items-center gap-2">
                          <Progress value={avaliacao.presenca} className="h-2" />
                          <span className="text-white font-semibold">{avaliacao.presenca}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Instrutor</p>
                        {renderStars(avaliacao.avaliacaoInstrutor)}
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Conteúdo</p>
                        {renderStars(avaliacao.avaliacaoConteudo)}
                      </div>
                    </div>

                    {avaliacao.feedback && (
                      <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700">
                        <p className="text-slate-400 text-sm mb-1">Feedback do Participante:</p>
                        <p className="text-slate-300 text-sm italic">{avaliacao.feedback}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 lg:w-48">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-slate-600 w-full bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Avaliação Completa</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-slate-400 text-sm">Funcionário</p>
                              <p className="text-white font-medium">{avaliacao.funcionario}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm">Formação</p>
                              <p className="text-white font-medium">{avaliacao.formacao}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm">Instrutor</p>
                              <p className="text-white font-medium">{avaliacao.instrutor}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm">Status</p>
                              <Badge
                                className={
                                  avaliacao.status === "Concluída"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }
                              >
                                {avaliacao.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-700/30 rounded-lg">
                            <div className="text-center">
                              <p className="text-slate-400 text-sm mb-2">Nota Final</p>
                              <p className="text-3xl font-bold text-cyan-400">
                                {avaliacao.notaFinal ? avaliacao.notaFinal.toFixed(1) : "-"}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-slate-400 text-sm mb-2">Presença</p>
                              <p className="text-3xl font-bold text-green-400">{avaliacao.presenca}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-slate-400 text-sm mb-2">Certificado</p>
                              <p className="text-3xl">{avaliacao.certificadoEmitido ? "✓" : "✗"}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-semibold text-white">Avaliações</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                <span className="text-slate-300">Instrutor</span>
                                {renderStars(avaliacao.avaliacaoInstrutor)}
                              </div>
                              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                <span className="text-slate-300">Conteúdo</span>
                                {renderStars(avaliacao.avaliacaoConteudo)}
                              </div>
                              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                <span className="text-slate-300">Infraestrutura</span>
                                {renderStars(avaliacao.avaliacaoInfraestrutura)}
                              </div>
                            </div>
                          </div>

                          {avaliacao.feedback && (
                            <div>
                              <h4 className="font-semibold text-white mb-2">Feedback</h4>
                              <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700">
                                <p className="text-slate-300 italic">{avaliacao.feedback}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {avaliacao.certificadoEmitido && (
                      <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 w-full">
                        <Award className="w-4 h-4 mr-2" />
                        Certificado
                      </Button>
                    )}

                    {!avaliacao.certificadoEmitido && avaliacao.status === "Concluída" && (
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 w-full">
                        <Award className="w-4 h-4 mr-2" />
                        Emitir Certificado
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
