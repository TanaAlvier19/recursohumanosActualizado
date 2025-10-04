"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Eye,
  Edit,
  Copy,
  Send,
  Code,
  Brain,
  Languages,
  Calculator,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TestesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState("todos")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const testes = [
    {
      id: 1,
      titulo: "Teste de Lógica de Programação",
      tipo: "Técnico",
      categoria: "Desenvolvimento",
      duracao: 60,
      questoes: 15,
      dificuldade: "Intermediário",
      status: "Ativo",
      enviados: 45,
      concluidos: 38,
      mediaScore: 7.8,
      icon: Code,
      color: "cyan",
    },
    {
      id: 2,
      titulo: "Avaliação de Raciocínio Lógico",
      tipo: "Cognitivo",
      categoria: "Geral",
      duracao: 45,
      questoes: 20,
      dificuldade: "Fácil",
      status: "Ativo",
      enviados: 120,
      concluidos: 105,
      mediaScore: 8.2,
      icon: Brain,
      color: "blue",
    },
    {
      id: 3,
      titulo: "Teste de Inglês Técnico",
      tipo: "Idioma",
      categoria: "Comunicação",
      duracao: 30,
      questoes: 25,
      dificuldade: "Intermediário",
      status: "Ativo",
      enviados: 67,
      concluidos: 62,
      mediaScore: 6.9,
      icon: Languages,
      color: "purple",
    },
    {
      id: 4,
      titulo: "Análise Financeira Básica",
      tipo: "Técnico",
      categoria: "Finanças",
      duracao: 90,
      questoes: 12,
      dificuldade: "Avançado",
      status: "Rascunho",
      enviados: 0,
      concluidos: 0,
      mediaScore: 0,
      icon: Calculator,
      color: "green",
    },
  ]

  const resultados = [
    {
      id: 1,
      candidato: "Ana Silva",
      vaga: "Desenvolvedor Full Stack",
      teste: "Teste de Lógica de Programação",
      score: 8.5,
      status: "Aprovado",
      tempo: 52,
      dataRealizacao: "2024-01-15",
    },
    {
      id: 2,
      candidato: "Carlos Santos",
      vaga: "Analista de Dados",
      teste: "Avaliação de Raciocínio Lógico",
      score: 9.2,
      status: "Aprovado",
      tempo: 38,
      dataRealizacao: "2024-01-15",
    },
    {
      id: 3,
      candidato: "Maria Oliveira",
      vaga: "Desenvolvedor Frontend",
      teste: "Teste de Lógica de Programação",
      score: 5.8,
      status: "Reprovado",
      tempo: 60,
      dataRealizacao: "2024-01-14",
    },
    {
      id: 4,
      candidato: "João Costa",
      vaga: "Suporte Técnico Internacional",
      teste: "Teste de Inglês Técnico",
      score: 7.5,
      status: "Aprovado",
      tempo: 28,
      dataRealizacao: "2024-01-14",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Rascunho":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "Arquivado":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case "Fácil":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Intermediário":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "Avançado":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getResultadoColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Reprovado":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "Pendente":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Testes Técnicos</h1>
            <p className="text-slate-400">Gerencie testes e avalie resultados dos candidatos</p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Criar Teste
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Teste</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Preencha as informações do teste técnico
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Título do Teste</Label>
                  <Input placeholder="Ex: Teste de Lógica de Programação" className="bg-slate-700 border-slate-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="tecnico">Técnico</SelectItem>
                        <SelectItem value="cognitivo">Cognitivo</SelectItem>
                        <SelectItem value="idioma">Idioma</SelectItem>
                        <SelectItem value="comportamental">Comportamental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Input placeholder="Ex: Desenvolvimento" className="bg-slate-700 border-slate-600" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Duração (min)</Label>
                    <Input type="number" placeholder="60" className="bg-slate-700 border-slate-600" />
                  </div>
                  <div>
                    <Label>Questões</Label>
                    <Input type="number" placeholder="15" className="bg-slate-700 border-slate-600" />
                  </div>
                  <div>
                    <Label>Dificuldade</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="facil">Fácil</SelectItem>
                        <SelectItem value="intermediario">Intermediário</SelectItem>
                        <SelectItem value="avancado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    placeholder="Descreva o objetivo e conteúdo do teste..."
                    className="bg-slate-700 border-slate-600 min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="border-slate-600 hover:bg-slate-700"
                  >
                    Cancelar
                  </Button>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">Criar Teste</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Testes Ativos</p>
                <p className="text-2xl font-bold text-white mt-1">12</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Testes Enviados</p>
                <p className="text-2xl font-bold text-white mt-1">232</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Taxa Conclusão</p>
                <p className="text-2xl font-bold text-white mt-1">88.4%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Média Geral</p>
                <p className="text-2xl font-bold text-white mt-1">7.6</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="testes" className="space-y-4">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="testes">Biblioteca de Testes</TabsTrigger>
            <TabsTrigger value="resultados">Resultados</TabsTrigger>
          </TabsList>

          <TabsContent value="testes" className="space-y-4">
            {/* Filters */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar testes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600"
                  />
                </div>
                <Select value={filterTipo} onValueChange={setFilterTipo}>
                  <SelectTrigger className="w-full md:w-[200px] bg-slate-700 border-slate-600">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="cognitivo">Cognitivo</SelectItem>
                    <SelectItem value="idioma">Idioma</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[200px] bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Testes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testes.map((teste) => {
                const Icon = teste.icon
                return (
                  <Card
                    key={teste.id}
                    className="bg-slate-800/50 border-slate-700 p-6 hover:border-cyan-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${teste.color}-500/20 to-${teste.color}-600/20 flex items-center justify-center`}
                        >
                          <Icon className={`w-6 h-6 text-${teste.color}-400`} />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{teste.titulo}</h3>
                          <p className="text-slate-400 text-sm">{teste.categoria}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(teste.status)}>{teste.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-slate-400 text-xs">Tipo</p>
                        <p className="text-white text-sm font-medium">{teste.tipo}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Dificuldade</p>
                        <Badge className={getDificuldadeColor(teste.dificuldade)}>{teste.dificuldade}</Badge>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Duração</p>
                        <p className="text-white text-sm font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {teste.duracao} min
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Questões</p>
                        <p className="text-white text-sm font-medium">{teste.questoes}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-slate-900/50 rounded-lg">
                      <div className="text-center">
                        <p className="text-slate-400 text-xs">Enviados</p>
                        <p className="text-white font-semibold">{teste.enviados}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400 text-xs">Concluídos</p>
                        <p className="text-white font-semibold">{teste.concluidos}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400 text-xs">Média</p>
                        <p className="text-white font-semibold">{teste.mediaScore.toFixed(1)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 hover:bg-slate-700 bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:bg-slate-700 bg-transparent"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:bg-slate-700 bg-transparent"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:bg-slate-700 bg-transparent"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="resultados" className="space-y-4">
            {/* Filters */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por candidato ou vaga..."
                    className="pl-10 bg-slate-700 border-slate-600"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full md:w-[200px] bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="reprovado">Reprovado</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Resultados Table */}
            <Card className="bg-slate-800/50 border-slate-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-4 text-slate-400 font-medium">Candidato</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Vaga</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Teste</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Score</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Tempo</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Data</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((resultado) => (
                      <tr key={resultado.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-4">
                          <p className="text-white font-medium">{resultado.candidato}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-300 text-sm">{resultado.vaga}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-300 text-sm">{resultado.teste}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                style={{ width: `${resultado.score * 10}%` }}
                              />
                            </div>
                            <span className="text-white font-semibold">{resultado.score.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-300 text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {resultado.tempo} min
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-300 text-sm">
                            {new Date(resultado.dataRealizacao).toLocaleDateString("pt-BR")}
                          </p>
                        </td>
                        <td className="p-4">
                          <Badge className={getResultadoColor(resultado.status)}>{resultado.status}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 hover:bg-slate-700 bg-transparent"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
