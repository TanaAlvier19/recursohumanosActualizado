"use client"

import { useState } from "react"
import { Search, Plus, MoreVertical, User, Calendar, Mail, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function PipelinePage() {
  const [searchTerm, setSearchTerm] = useState("")

  const etapas = [
    {
      id: "triagem",
      nome: "Triagem",
      cor: "from-blue-500 to-blue-600",
      candidatos: [
        {
          id: 1,
          nome: "Roberto Lima",
          vaga: "Desenvolvedor Backend",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 75,
          dias: 2,
        },
        {
          id: 2,
          nome: "Fernanda Costa",
          vaga: "Analista de QA",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 82,
          dias: 1,
        },
      ],
    },
    {
      id: "entrevista-rh",
      nome: "Entrevista RH",
      cor: "from-purple-500 to-purple-600",
      candidatos: [
        {
          id: 3,
          nome: "Lucas Martins",
          vaga: "Product Manager",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 88,
          dias: 3,
        },
        {
          id: 4,
          nome: "Patricia Souza",
          vaga: "Designer UX",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 91,
          dias: 2,
        },
        {
          id: 5,
          nome: "Ricardo Alves",
          vaga: "Desenvolvedor Frontend",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 79,
          dias: 4,
        },
      ],
    },
    {
      id: "teste-tecnico",
      nome: "Teste Técnico",
      cor: "from-cyan-500 to-cyan-600",
      candidatos: [
        {
          id: 6,
          nome: "Ana Silva",
          vaga: "Desenvolvedor Full Stack",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 85,
          dias: 5,
        },
        {
          id: 7,
          nome: "Carlos Santos",
          vaga: "Analista de Dados",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 78,
          dias: 3,
        },
      ],
    },
    {
      id: "entrevista-tecnica",
      nome: "Entrevista Técnica",
      cor: "from-yellow-500 to-yellow-600",
      candidatos: [
        {
          id: 8,
          nome: "Mariana Costa",
          vaga: "Tech Lead",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 92,
          dias: 6,
        },
      ],
    },
    {
      id: "proposta",
      nome: "Proposta",
      cor: "from-green-500 to-green-600",
      candidatos: [
        {
          id: 9,
          nome: "Pedro Oliveira",
          vaga: "Engenheiro de Software",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 94,
          dias: 8,
        },
        {
          id: 10,
          nome: "Julia Ferreira",
          vaga: "Scrum Master",
          avatar: "/placeholder.svg?height=40&width=40",
          score: 89,
          dias: 7,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Pipeline de Recrutamento
            </h1>
            <p className="text-slate-400 mt-1">Visualização Kanban do processo seletivo</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar candidato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-slate-100 w-64"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          {etapas.map((etapa) => (
            <Card key={etapa.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{etapa.nome}</p>
                    <p className="text-2xl font-bold text-slate-100">{etapa.candidatos.length}</p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${etapa.cor} flex items-center justify-center`}
                  >
                    <User className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
          {etapas.map((etapa, etapaIndex) => (
            <div key={etapa.id} className="min-w-[280px]">
              <Card className="bg-slate-800/50 border-slate-700 h-full">
                <CardHeader className={`bg-gradient-to-r ${etapa.cor} rounded-t-lg`}>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{etapa.nome}</span>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {etapa.candidatos.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {etapa.candidatos.map((candidato) => (
                    <Card
                      key={candidato.id}
                      className="bg-slate-900/50 border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer group"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={candidato.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm">
                                {candidato.nome
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-slate-100 text-sm">{candidato.nome}</h4>
                              <p className="text-slate-400 text-xs">{candidato.vaga}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-800 border-slate-700">
                              <DropdownMenuItem className="text-slate-300">Ver Perfil</DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-300">Agendar Entrevista</DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-300">Enviar Email</DropdownMenuItem>
                              {etapaIndex < etapas.length - 1 && (
                                <DropdownMenuItem className="text-green-400">
                                  <ArrowRight className="w-4 h-4 mr-2" />
                                  Avançar para {etapas[etapaIndex + 1].nome}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-slate-300 font-semibold">{candidato.score}</span>
                          </div>
                          <span className="text-slate-400">{candidato.dias} dias</span>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs border-slate-600 bg-transparent"
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs border-slate-600 bg-transparent"
                          >
                            <Calendar className="w-3 h-3 mr-1" />
                            Agendar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full border-dashed border-slate-600 hover:border-cyan-500 text-slate-400 hover:text-cyan-400 bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Candidato
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
