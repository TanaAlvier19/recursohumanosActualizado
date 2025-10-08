"use client"

import { useState, useEffect } from "react"
import { Search, Plus, MoreVertical, User, Calendar, Mail, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import Swal from "sweetalert2"
import Link from "next/link"

interface Candidato {
  id: number
  nome: string
  vaga: string
  avatar?: string
  score: number
  dias: number
  email?: string
  telefone?: string
  data_aplicacao: string
}

interface Etapa {
  id: string
  nome: string
  cor: string
  candidatos: Candidato[]
}

interface Vaga {
  id: string
  titulo: string
}

interface Aplicacao {
  id: number
  candidato_nome: string
  vaga_titulo: string
  status: string
  data_aplicacao: string
  candidato_email?: string
  candidato_telefone?: string
  score?: number
}

export default function PipelinePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [etapas, setEtapas] = useState<Etapa[]>([])
  const [loading, setLoading] = useState(true)
  const [vagas, setVagas] = useState<Vaga[]>([])
  const [selectedVaga, setSelectedVaga] = useState<string>("")

  // Buscar vagas ao carregar o componente
  useEffect(() => {
    fetchVagas()
  }, [])

  // Buscar pipeline quando uma vaga é selecionada
  useEffect(() => {
    if (selectedVaga && selectedVaga !== "todas") {
      fetchPipeline()
    } else if (selectedVaga === "todas") {
      // Se selecionar "todas", buscar todas as aplicações
      fetchTodasAplicacoes()
    }
  }, [selectedVaga])

  const fetchVagas = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://recursohumanosactualizado.onrender.com/vagas/", {
        credentials: "include"
      })
      
      if (!response.ok) throw new Error("Erro ao buscar vagas")
      
      const data = await response.json()
      setVagas(data)
      
      if (data.length > 0) {
        setSelectedVaga(data[0].id.toString())
      }
    } catch (error) {
      console.error("[Pipeline] Erro ao buscar vagas:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível carregar as vagas",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPipeline = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `https://recursohumanosactualizado.onrender.com/aplicacoes/pipeline/?vaga_id=${selectedVaga}`,
        {
          credentials: "include"
        }
      )

      if (!response.ok) throw new Error("Erro ao buscar pipeline")

      const data = await response.json()
      formatarPipelineData(data)
    } catch (error) {
      console.error("[Pipeline] Erro ao buscar pipeline:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível carregar o pipeline",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTodasAplicacoes = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://recursohumanosactualizado.onrender.com/aplicacoes/", {
        credentials: "include"
      })

      if (!response.ok) throw new Error("Erro ao buscar aplicações")

      const data = await response.json()
      formatarTodasAplicacoes(data)
    } catch (error) {
      console.error("[Pipeline] Erro ao buscar aplicações:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível carregar as aplicações",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatarPipelineData = (data: any) => {
    const etapasFormatadas: Etapa[] = [
      {
        id: "NOVO",
        nome: "Triagem",
        cor: "from-blue-500 to-blue-600",
        candidatos: data.NOVO?.map((app: Aplicacao) => formatarCandidato(app)) || [],
      },
      {
        id: "TRIAGEM",
        nome: "Entrevista RH",
        cor: "from-purple-500 to-purple-600",
        candidatos: data.TRIAGEM?.map((app: Aplicacao) => formatarCandidato(app)) || [],
      },
      {
        id: "TESTE",
        nome: "Teste Técnico",
        cor: "from-cyan-500 to-cyan-600",
        candidatos: data.TESTE?.map((app: Aplicacao) => formatarCandidato(app)) || [],
      },
      {
        id: "ENTREVISTA",
        nome: "Entrevista Técnica",
        cor: "from-yellow-500 to-yellow-600",
        candidatos: data.ENTREVISTA?.map((app: Aplicacao) => formatarCandidato(app)) || [],
      },
      {
        id: "PROPOSTA",
        nome: "Proposta",
        cor: "from-green-500 to-green-600",
        candidatos: data.PROPOSTA?.map((app: Aplicacao) => formatarCandidato(app)) || [],
      },
      {
        id: "APROVADO",
        nome: "Aprovado",
        cor: "from-green-600 to-green-700",
        candidatos: data.APROVADO?.map((app: Aplicacao) => formatarCandidato(app)) || [],
      },
      {
        id: "REJEITADO",
        nome: "Reprovado",
        cor: "from-red-500 to-red-600",
        candidatos: data.REJEITADO?.map((app: Aplicacao) => formatarCandidato(app)) || [],
      },
    ]

    setEtapas(etapasFormatadas)
  }

  const formatarTodasAplicacoes = (aplicacoes: Aplicacao[]) => {
    // Agrupar aplicações por status
    const aplicacoesPorStatus: { [key: string]: Aplicacao[] } = {}
    
    aplicacoes.forEach(app => {
      if (!aplicacoesPorStatus[app.status]) {
        aplicacoesPorStatus[app.status] = []
      }
      aplicacoesPorStatus[app.status].push(app)
    })

    const etapasFormatadas: Etapa[] = [
      {
        id: "NOVO",
        nome: "Triagem",
        cor: "from-blue-500 to-blue-600",
        candidatos: aplicacoesPorStatus["NOVO"]?.map((app: Aplicacao) => formatarCandidato(app)) || [],
      },
      {
        id: "TRIAGEM",
        nome: "Entrevista RH",
        cor: "from-purple-500 to-purple-600",
        candidatos: aplicacoesPorStatus["TRIAGEM"]?.map((app: Aplicacao) => formatarCandidato(app)) || [],
      },
      {
        id: "TESTE",
        nome: "Teste Técnico",
        cor: "from-cyan-500 to-cyan-600",
        candidatos: aplicacoesPorStatus["TESTE"]?.map((app: Aplicacao) => formatarCandidato(app)) || [],
      },
      {
        id: "ENTREVISTA",
        nome: "Entrevista Técnica",
        cor: "from-yellow-500 to-yellow-600",
        candidatos: aplicacoesPorStatus["ENTREVISTA"]?.map((app: Aplicacao) => formatarCandidato(app)) || [],
      },
      {
        id: "PROPOSTA",
        nome: "Proposta",
        cor: "from-green-500 to-green-600",
        candidatos: aplicacoesPorStatus["PROPOSTA"]?.map((app: Aplicacao) => formatarCandidato(app)) || [],
      },
      {
        id: "APROVADO",
        nome: "Aprovado",
        cor: "from-green-600 to-green-700",
        candidatos: aplicacoesPorStatus["APROVADO"]?.map((app: Aplicacao) => formatarCandidato(app)) || [],
      },
      {
        id: "REJEITADO",
        nome: "Reprovado",
        cor: "from-red-500 to-red-600",
        candidatos: aplicacoesPorStatus["REJEITADO"]?.map((app: Aplicacao) => formatarCandidato(app)) || [],
      },
    ]

    setEtapas(etapasFormatadas)
  }

  const formatarCandidato = (app: Aplicacao): Candidato => {
    const dias = Math.floor(
      (new Date().getTime() - new Date(app.data_aplicacao).getTime()) / (1000 * 60 * 60 * 24)
    )

    return {
      id: app.id,
      nome: app.candidato_nome || "Candidato",
      vaga: app.vaga_titulo || "Vaga",
      score: app.score || Math.floor(Math.random() * 30) + 70, // Score entre 70-100
      dias: dias < 0 ? 0 : dias,
      email: app.candidato_email,
      telefone: app.candidato_telefone,
      data_aplicacao: app.data_aplicacao
    }
  }

  const handleMoverStatus = async (aplicacaoId: number, novoStatus: string) => {
    try {
      const response = await fetch(`https://recursohumanosactualizado.onrender.com/aplicacoes/${aplicacaoId}/mover_status/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: novoStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao mover candidato")
      }

      Swal.fire({
        title: "Sucesso!",
        text: "Candidato movido com sucesso",
        icon: "success",
        background: "#1e293b",
        color: "white",
        timer: 2000,
        showConfirmButton: false,
      })

      // Recarregar o pipeline
      if (selectedVaga === "todas") {
        fetchTodasAplicacoes()
      } else {
        fetchPipeline()
      }
    } catch (error: any) {
      console.error("[Pipeline] Erro ao mover candidato:", error)
      Swal.fire({
        title: "Erro",
        text: error.message || "Não foi possível mover o candidato",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    }
  }

  const getProximoStatus = (statusAtual: string): string | null => {
    const ordemStatus = ["NOVO", "TRIAGEM", "TESTE", "ENTREVISTA", "PROPOSTA", "APROVADO"]
    const indexAtual = ordemStatus.indexOf(statusAtual)
    
    if (indexAtual < ordemStatus.length - 1) {
      return ordemStatus[indexAtual + 1]
    }
    return null
  }

  const getStatusAnterior = (statusAtual: string): string | null => {
    const ordemStatus = ["NOVO", "TRIAGEM", "TESTE", "ENTREVISTA", "PROPOSTA", "APROVADO"]
    const indexAtual = ordemStatus.indexOf(statusAtual)
    
    if (indexAtual > 0) {
      return ordemStatus[indexAtual - 1]
    }
    return null
  }

  // Filtrar candidatos baseado na busca
  const etapasFiltradas = etapas.map(etapa => ({
    ...etapa,
    candidatos: etapa.candidatos.filter(candidato =>
      candidato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidato.vaga.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }))

  if (loading && etapas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <Skeleton className="h-20 w-full bg-slate-800" />
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full bg-slate-800" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/list/recrutamento" className="text-sm text-slate-400 hover:text-cyan-400 mb-2 inline-block">
              ← Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Pipeline de Recrutamento
            </h1>
            <p className="text-slate-400 mt-1">Visualização Kanban do processo seletivo</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedVaga} onValueChange={setSelectedVaga}>
              <SelectTrigger className="w-[300px] bg-slate-800/50 border-slate-700 text-slate-100">
                <SelectValue placeholder="Selecione uma vaga" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="todas">Todas as Vagas</SelectItem>
                {vagas.map((vaga) => (
                  <SelectItem key={vaga.id} value={vaga.id.toString()}>
                    {vaga.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        <div className="grid grid-cols-7 gap-4">
          {etapasFiltradas.map((etapa) => (
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
        <div className="grid grid-cols-7 gap-4 overflow-x-auto pb-4">
          {etapasFiltradas.map((etapa, etapaIndex) => (
            <div key={etapa.id} className="min-w-[280px]">
              <Card className="bg-slate-800/50 border-slate-700 h-full">
                <CardHeader className={`bg-gradient-to-r ${etapa.cor} rounded-t-lg p-4`}>
                  <CardTitle className="text-white flex items-center justify-between text-sm">
                    <span>{etapa.nome}</span>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {etapa.candidatos.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  {etapa.candidatos.map((candidato) => {
                    const proximoStatus = getProximoStatus(etapa.id)
                    const statusAnterior = getStatusAnterior(etapa.id)

                    return (
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
                                <DropdownMenuItem className="text-slate-300">
                                  <User className="w-4 h-4 mr-2" />
                                  Ver Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-slate-300">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Agendar Entrevista
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-slate-300">
                                  <Mail className="w-4 h-4 mr-2" />
                                  Enviar Email
                                </DropdownMenuItem>
                                
                                {statusAnterior && (
                                  <DropdownMenuItem
                                    className="text-yellow-400"
                                    onClick={() => handleMoverStatus(candidato.id, statusAnterior)}
                                  >
                                    <ArrowRight className="w-4 h-4 mr-2 transform rotate-180" />
                                    Voltar para {etapas.find(e => e.id === statusAnterior)?.nome}
                                  </DropdownMenuItem>
                                )}

                                {proximoStatus && (
                                  <DropdownMenuItem
                                    className="text-green-400"
                                    onClick={() => handleMoverStatus(candidato.id, proximoStatus)}
                                  >
                                    <ArrowRight className="w-4 h-4 mr-2" />
                                    Avançar para {etapas.find(e => e.id === proximoStatus)?.nome}
                                  </DropdownMenuItem>
                                )}

                                {(etapa.id === "APROVADO" || etapa.id === "REJEITADO") && (
                                  <DropdownMenuItem
                                    className="text-red-400"
                                    onClick={() => handleMoverStatus(candidato.id, "REJEITADO")}
                                  >
                                    <User className="w-4 h-4 mr-2" />
                                    {etapa.id === "APROVADO" ? "Reprovar" : "Reativar"}
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
                              onClick={() => window.open(`mailto:${candidato.email}`)}
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
                    )
                  })}

                  {etapa.candidatos.length === 0 && (
                    <div className="text-center text-slate-500 text-sm py-4">
                      Nenhum candidato nesta etapa
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}