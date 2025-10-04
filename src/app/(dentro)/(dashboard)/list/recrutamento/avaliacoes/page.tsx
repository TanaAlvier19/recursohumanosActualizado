"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Star,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
} from "lucide-react"

export default function AvaliacoesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAvaliacao, setSelectedAvaliacao] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const avaliacoes = [
    {
      id: 1,
      candidato: "Ana Silva",
      vaga: "Desenvolvedor Full Stack",
      etapa: "Entrevista Técnica",
      avaliador: "Carlos Mendes",
      data: "2024-01-15",
      notaTecnica: 9,
      notaComportamental: 8,
      notaGeral: 8.5,
      recomendacao: "Aprovado",
      pontosFortesCount: 5,
      pontosAtencaoCount: 2,
      status: "Concluída",
    },
    {
      id: 2,
      candidato: "João Costa",
      vaga: "Analista de Dados",
      etapa: "Entrevista RH",
      avaliador: "Maria Santos",
      data: "2024-01-15",
      notaTecnica: 7,
      notaComportamental: 9,
      notaGeral: 8.0,
      recomendacao: "Aprovado",
      pontosFortesCount: 4,
      pontosAtencaoCount: 1,
      status: "Concluída",
    },
    {
      id: 3,
      candidato: "Maria Oliveira",
      vaga: "Designer UX/UI",
      etapa: "Entrevista Técnica",
      avaliador: "Pedro Lima",
      data: "2024-01-14",
      notaTecnica: 6,
      notaComportamental: 7,
      notaGeral: 6.5,
      recomendacao: "Reprovado",
      pontosFortesCount: 3,
      pontosAtencaoCount: 4,
      status: "Concluída",
    },
    {
      id: 4,
      candidato: "Carlos Santos",
      vaga: "Gerente de Projetos",
      etapa: "Entrevista Final",
      avaliador: "Ana Paula",
      data: "2024-01-14",
      notaTecnica: 8,
      notaComportamental: 9,
      notaGeral: 8.5,
      recomendacao: "Aprovado",
      pontosFortesCount: 6,
      pontosAtencaoCount: 1,
      status: "Concluída",
    },
  ]

  const criterios = [
    {
      categoria: "Habilidades Técnicas",
      items: [
        { nome: "Conhecimento em React", nota: 9, peso: "Alto" },
        { nome: "Conhecimento em Node.js", nota: 8, peso: "Alto" },
        { nome: "Banco de Dados", nota: 9, peso: "Médio" },
        { nome: "DevOps", nota: 7, peso: "Baixo" },
      ],
    },
    {
      categoria: "Competências Comportamentais",
      items: [
        { nome: "Comunicação", nota: 8, peso: "Alto" },
        { nome: "Trabalho em Equipe", nota: 9, peso: "Alto" },
        { nome: "Proatividade", nota: 8, peso: "Médio" },
        { nome: "Adaptabilidade", nota: 7, peso: "Médio" },
      ],
    },
  ]

  const pontosFortesExemplo = [
    "Excelente domínio de React e ecossistema",
    "Ótima comunicação e clareza nas explicações",
    "Experiência sólida com arquitetura de software",
    "Demonstrou proatividade e interesse pela vaga",
    "Bom fit cultural com a equipe",
  ]

  const pontosAtencaoExemplo = ["Pouca experiência com DevOps", "Necessita desenvolver habilidades de liderança"]

  const getRecomendacaoColor = (recomendacao: string) => {
    switch (recomendacao) {
      case "Aprovado":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Reprovado":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "Em Análise":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getPesoColor = (peso: string) => {
    switch (peso) {
      case "Alto":
        return "text-red-400"
      case "Médio":
        return "text-yellow-400"
      case "Baixo":
        return "text-green-400"
      default:
        return "text-slate-400"
    }
  }

  const handleViewDetails = (avaliacao: any) => {
    setSelectedAvaliacao(avaliacao)
    setIsDetailModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sistema de Avaliações</h1>
          <p className="text-slate-400">Avalie candidatos e acompanhe recomendações</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avaliações Totais</p>
                <p className="text-2xl font-bold text-white mt-1">156</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Taxa Aprovação</p>
                <p className="text-2xl font-bold text-white mt-1">68%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Nota Média</p>
                <p className="text-2xl font-bold text-white mt-1">7.8</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pendentes</p>
                <p className="text-2xl font-bold text-white mt-1">8</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar por candidato ou vaga..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[200px] bg-slate-700 border-slate-600">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Etapa" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="todos">Todas as Etapas</SelectItem>
                <SelectItem value="rh">Entrevista RH</SelectItem>
                <SelectItem value="tecnica">Entrevista Técnica</SelectItem>
                <SelectItem value="final">Entrevista Final</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-[200px] bg-slate-700 border-slate-600">
                <SelectValue placeholder="Recomendação" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="reprovado">Reprovado</SelectItem>
                <SelectItem value="analise">Em Análise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Avaliacoes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {avaliacoes.map((avaliacao) => (
            <Card
              key={avaliacao.id}
              className="bg-slate-800/50 border-slate-700 p-6 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold text-lg">{avaliacao.candidato}</h3>
                  <p className="text-slate-400 text-sm">{avaliacao.vaga}</p>
                </div>
                <Badge className={getRecomendacaoColor(avaliacao.recomendacao)}>{avaliacao.recomendacao}</Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Etapa</span>
                  <span className="text-white text-sm font-medium">{avaliacao.etapa}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Avaliador</span>
                  <span className="text-white text-sm">{avaliacao.avaliador}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Data</span>
                  <span className="text-white text-sm">{new Date(avaliacao.data).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-slate-900/50 rounded-lg">
                <div className="text-center">
                  <p className="text-slate-400 text-xs mb-1">Técnica</p>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">{avaliacao.notaTecnica}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-xs mb-1">Comportamental</p>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">{avaliacao.notaComportamental}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-xs mb-1">Geral</p>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                    <span className="text-white font-semibold">{avaliacao.notaGeral}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center gap-2 text-green-400">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{avaliacao.pontosFortesCount} pontos fortes</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <ThumbsDown className="w-4 h-4" />
                  <span>{avaliacao.pontosAtencaoCount} atenção</span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                onClick={() => handleViewDetails(avaliacao)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Detalhes Completos
              </Button>
            </Card>
          ))}
        </div>

        {/* Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Avaliação Detalhada - {selectedAvaliacao?.candidato}</DialogTitle>
              <DialogDescription className="text-slate-400">
                {selectedAvaliacao?.vaga} • {selectedAvaliacao?.etapa}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Notas Gerais */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-cyan-400" />
                  Notas Gerais
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-slate-900/50 border-slate-700 p-4 text-center">
                    <p className="text-slate-400 text-sm mb-2">Nota Técnica</p>
                    <p className="text-3xl font-bold text-white">{selectedAvaliacao?.notaTecnica}</p>
                  </Card>
                  <Card className="bg-slate-900/50 border-slate-700 p-4 text-center">
                    <p className="text-slate-400 text-sm mb-2">Nota Comportamental</p>
                    <p className="text-3xl font-bold text-white">{selectedAvaliacao?.notaComportamental}</p>
                  </Card>
                  <Card className="bg-slate-900/50 border-slate-700 p-4 text-center">
                    <p className="text-slate-400 text-sm mb-2">Nota Geral</p>
                    <p className="text-3xl font-bold text-cyan-400">{selectedAvaliacao?.notaGeral}</p>
                  </Card>
                </div>
              </div>

              {/* Critérios Detalhados */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Critérios de Avaliação</h3>
                <div className="space-y-4">
                  {criterios.map((categoria, idx) => (
                    <Card key={idx} className="bg-slate-900/50 border-slate-700 p-4">
                      <h4 className="font-semibold mb-3 text-cyan-400">{categoria.categoria}</h4>
                      <div className="space-y-3">
                        {categoria.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-300">{item.nome}</span>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs ${getPesoColor(item.peso)}`}>{item.peso}</span>
                                <span className="text-white font-semibold">{item.nota}/10</span>
                              </div>
                            </div>
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                style={{ width: `${item.nota * 10}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Pontos Fortes */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  Pontos Fortes
                </h3>
                <Card className="bg-slate-900/50 border-slate-700 p-4">
                  <ul className="space-y-2">
                    {pontosFortesExemplo.map((ponto, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{ponto}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Pontos de Atenção */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-yellow-400">
                  <XCircle className="w-5 h-5" />
                  Pontos de Atenção
                </h3>
                <Card className="bg-slate-900/50 border-slate-700 p-4">
                  <ul className="space-y-2">
                    {pontosAtencaoExemplo.map((ponto, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{ponto}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Recomendação Final */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Recomendação Final</h3>
                <Card className="bg-slate-900/50 border-slate-700 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-400">Decisão:</span>
                    <Badge className={getRecomendacaoColor(selectedAvaliacao?.recomendacao)}>
                      {selectedAvaliacao?.recomendacao}
                    </Badge>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Candidato demonstrou excelente fit técnico e cultural. Recomendo fortemente a contratação para a
                    posição. Possui todas as competências necessárias e demonstrou grande potencial de crescimento.
                  </p>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
