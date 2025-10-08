"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Users, Search, Filter, Eye, Mail, Phone, MapPin, Briefcase, Calendar, 
  FileText, GraduationCap, Target, Clock, CheckCircle, XCircle, 
  MessageSquare, TestTube, UserCheck, DollarSign, Download,
  File
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Swal from "sweetalert2"
import Link from "next/link"

interface Vaga {
  id: string
  titulo: string
  descricao?: string
  // ... outras propriedades da vaga
}

interface Candidato {
  id: string
  nome: string
  email: string
  telefone: string
  linkedin: string
  curriculo: string
  experiencia_anos: number
  formacao: string
  habilidades: string
  pretensao_salarial: string | null
  disponibilidade: string
  observacoes: string
  fonte: string
  criado_em: string
  atualizado_em: string
  empresa: string
  vaga: string | Vaga // Pode ser string ID ou objeto Vaga completo
  vaga_nome?: string
  empresa_nome?: string
}

interface Aplicacao {
  id: string
  vaga: string | Vaga // Pode ser string ID ou objeto Vaga completo
  candidato: Candidato
  status: 'NOVO' | 'TRIAGEM' | 'TESTE' | 'ENTREVISTA' | 'PROPOSTA' | 'APROVADO' | 'REJEITADO'
  pontuacao: number | null
  observacoes: string
  data_aplicacao: string
  data_atualizacao: string
  avaliacoes: Avaliacao[]
  testes: Teste[]
  entrevistas: Entrevista[]
}

interface Avaliacao {
  id: string
  tipo: 'TRIAGEM' | 'TECNICA' | 'COMPORTAMENTAL' | 'FINAL'
  avaliador: string
  nota: number
  comentarios: string
  criterios: Record<string, number>
  data_avaliacao: string
}

interface Teste {
  id: string
  tipo: 'TECNICO' | 'LOGICA' | 'IDIOMA' | 'PERSONALIDADE'
  titulo: string
  descricao: string
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'EXPIRADO'
  nota: number | null
  data_envio: string
  data_conclusao: string | null
  prazo: string | null
}

interface Entrevista {
  id: string
  tipo: 'TELEFONE' | 'VIDEO' | 'PRESENCIAL'
  entrevistador: string
  data_hora: string
  duracao_minutos: number
  local: string
  status: 'AGENDADA' | 'REALIZADA' | 'CANCELADA'
  feedback: string
  nota: number | null
}

// Funções auxiliares para lidar com dados aninhados
const getVagaNome = (vaga: string | Vaga): string => {
  if (typeof vaga === 'string') {
    return vaga
  }
  return vaga?.titulo || "Vaga não encontrada"
}

const getVagaTitulo = (candidato: Candidato): string => {
  if (candidato.vaga_nome) {
    return candidato.vaga_nome
  }
  return getVagaNome(candidato.vaga)
}

export default function CandidatosPage() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([])
  const [aplicacoes, setAplicacoes] = useState<Aplicacao[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("todos")
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null)
  const [selectedAplicacao, setSelectedAplicacao] = useState<Aplicacao | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)

  useEffect(() => {
    fetchCandidatos()
    fetchAplicacoes()
  }, [])

  const fetchCandidatos = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://avdserver.up.railway.app/candidatos/", {
        credentials: "include"
      })
      if (!response.ok) throw new Error("Erro ao buscar candidatos")
      const data = await response.json()
      
      // Log para debug - remover depois
      console.log("Dados dos candidatos:", data)
      
      setCandidatos(data)
    } catch (error) {
      console.error("Erro ao buscar candidatos:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível carregar os candidatos",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAplicacoes = async () => {
    try {
      const response = await fetch("https://avdserver.up.railway.app/aplicacoes/", {
        credentials: "include"
      })
      if (!response.ok) throw new Error("Erro ao buscar aplicações")
      const data = await response.json()
      
      // Log para debug - remover depois
      console.log("Dados das aplicações:", data)
      
      setAplicacoes(data)
    } catch (error) {
      console.error("Erro ao buscar aplicações:", error)
    }
  }

  const getAplicacoesByCandidato = (candidatoId: string) => {
    return aplicacoes.filter(app => app.candidato.id === candidatoId)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'NOVO': "bg-blue-500/10 text-blue-400 border-blue-500/20",
      'TRIAGEM': "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      'TESTE': "bg-purple-500/10 text-purple-400 border-purple-500/20",
      'ENTREVISTA': "bg-orange-500/10 text-orange-400 border-orange-500/20",
      'PROPOSTA': "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      'APROVADO': "bg-green-500/10 text-green-400 border-green-500/20",
      'REJEITADO': "bg-red-500/10 text-red-400 border-red-500/20",
    }
    return colors[status] || "bg-slate-500/10 text-slate-400 border-slate-500/20"
  }

  const getTipoTesteColor = (tipo: string) => {
    const colors: Record<string, string> = {
      'TECNICO': "bg-blue-500/10 text-blue-400",
      'LOGICA': "bg-purple-500/10 text-purple-400",
      'IDIOMA': "bg-green-500/10 text-green-400",
      'PERSONALIDADE': "bg-orange-500/10 text-orange-400",
    }
    return colors[tipo] || "bg-slate-500/10 text-slate-400"
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      'NOVO': Clock,
      'TRIAGEM': Filter,
      'TESTE': TestTube,
      'ENTREVISTA': MessageSquare,
      'PROPOSTA': DollarSign,
      'APROVADO': CheckCircle,
      'REJEITADO': XCircle,
    }
    const IconComponent = icons[status] || Users
    return <IconComponent className="w-4 h-4" />
  }

  const handleDownloadCurriculo = async (curriculoUrl: string, nomeCandidato: string) => {
    try {
      const fullUrl = curriculoUrl.startsWith('http') 
        ? curriculoUrl 
        : `https://avdserver.up.railway.app${curriculoUrl}`
      
      const response = await fetch(fullUrl, {
        credentials: "include"
      })
      
      if (!response.ok) throw new Error("Erro ao baixar currículo")
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      
      const fileName = `${nomeCandidato.replace(/\s+/g, '_')}_curriculo.pdf`
      a.download = fileName
      
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      Swal.fire({
        title: "Sucesso!",
        text: "Currículo baixado com sucesso",
        icon: "success",
        background: "#1e293b",
        color: "white",
      })
    } catch (error) {
      console.error("Erro ao baixar currículo:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível baixar o currículo",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    }
  }

  const handleViewDetails = (candidato: Candidato) => {
    setSelectedCandidato(candidato)
    const aplicacoesCandidato = getAplicacoesByCandidato(candidato.id)
    setSelectedAplicacao(aplicacoesCandidato[0] || null)
    setIsDetailModalOpen(true)
  }

  const handleViewProcess = (candidato: Candidato) => {
    setSelectedCandidato(candidato)
    const aplicacoesCandidato = getAplicacoesByCandidato(candidato.id)
    setSelectedAplicacao(aplicacoesCandidato[0] || null)
    setIsProcessModalOpen(true)
  }

  const moverStatusAplicacao = async (aplicacaoId: string, novoStatus: string) => {
    try {
      const response = await fetch(`https://avdserver.up.railway.app/aplicacoes/${aplicacaoId}/mover_status/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: novoStatus })
      })

      if (response.ok) {
        fetchAplicacoes()
        Swal.fire({
          title: "Sucesso!",
          text: "Status atualizado com sucesso",
          icon: "success",
          background: "#1e293b",
          color: "white",
        })
      }
    } catch (error) {
      console.error("Erro ao mover status:", error)
    }
  }

  const filteredCandidatos = candidatos.filter((candidato) => {
    const matchesSearch =
      candidato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidato.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidato.formacao.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedStatus === "todos") return matchesSearch
    
    const aplicacoesCandidato = getAplicacoesByCandidato(candidato.id)
    return matchesSearch && aplicacoesCandidato.some(app => app.status === selectedStatus)
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-20 w-full bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full bg-slate-800" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link href="/admin/recrutamento" className="text-sm text-slate-400 hover:text-cyan-400 mb-2 inline-block">
            ← Voltar ao Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Candidatos e Processo Seletivo</h1>
          <p className="text-slate-400">Gerencie todos os candidatos e acompanhe o processo seletivo</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total de Candidatos</p>
                <p className="text-2xl font-bold text-white mt-1">{candidatos.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Em Processo</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {aplicacoes.filter(app => 
                    ['NOVO', 'TRIAGEM', 'TESTE', 'ENTREVISTA', 'PROPOSTA'].includes(app.status)
                  ).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Aprovados</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {aplicacoes.filter(app => app.status === 'APROVADO').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Com Currículo</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {candidatos.filter(c => c.curriculo).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-400" />
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
                placeholder="Buscar por nome, email ou formação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[200px] bg-slate-700 border-slate-600">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status Processo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="NOVO">Novo</SelectItem>
                <SelectItem value="TRIAGEM">Triagem</SelectItem>
                <SelectItem value="TESTE">Teste</SelectItem>
                <SelectItem value="ENTREVISTA">Entrevista</SelectItem>
                <SelectItem value="PROPOSTA">Proposta</SelectItem>
                <SelectItem value="APROVADO">Aprovado</SelectItem>
                <SelectItem value="REJEITADO">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Candidatos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCandidatos.map((candidato) => {
            const aplicacoesCandidato = getAplicacoesByCandidato(candidato.id)
            const ultimaAplicacao = aplicacoesCandidato[0]
            
            return (
              <Card
                key={candidato.id}
                className="bg-slate-800/50 border-slate-700 p-6 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                      {candidato.nome
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{candidato.nome}</h3>
                      <p className="text-slate-400 text-sm">{candidato.formacao || "Formação não especificada"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {ultimaAplicacao && (
                      <Badge className={getStatusColor(ultimaAplicacao.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(ultimaAplicacao.status)}
                          {ultimaAplicacao.status}
                        </div>
                      </Badge>
                    )}
                    {candidato.curriculo && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                        <FileText className="w-3 h-3 mr-1" />
                        Currículo
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {candidato.email}
                  </div>
                  {candidato.telefone && (
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {candidato.telefone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    {candidato.experiencia_anos} anos de experiência
                  </div>
                  {candidato.pretensao_salarial && (
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      Pretensão: {candidato.pretensao_salarial}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-900/50 rounded-lg text-sm">
                  <div>
                    <p className="text-slate-400 text-xs">Formação</p>
                    <p className="text-white font-medium truncate">{candidato.formacao || "Não informada"}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Vaga Aplicada</p>
                    <p className="text-white font-medium truncate">
                      {getVagaTitulo(candidato)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Aplicações</p>
                    <p className="text-white font-medium">{aplicacoesCandidato.length}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    onClick={() => handleViewDetails(candidato)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Perfil
                  </Button>
                  
                  {candidato.curriculo && (
                    <Button
                      variant="outline"
                      className="border-green-500 text-green-400 hover:bg-green-500/10"
                      onClick={() => handleDownloadCurriculo(candidato.curriculo, candidato.nome)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {ultimaAplicacao && (
                    <Button
                      variant="outline"
                      className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                      onClick={() => handleViewProcess(candidato)}
                    >
                      <Target className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {filteredCandidatos.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Nenhum candidato encontrado</p>
          </Card>
        )}

        {/* Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedCandidato?.nome}</DialogTitle>
              <DialogDescription className="text-slate-400">
                {selectedCandidato?.formacao} • {selectedCandidato?.experiencia_anos} anos de experiência
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Ações Rápidas */}
              {selectedCandidato && (
                <div className="flex gap-2">
                  {selectedCandidato.curriculo && (
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleDownloadCurriculo(selectedCandidato.curriculo, selectedCandidato.nome)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Currículo
                    </Button>
                  )}
                  {selectedCandidato.linkedin && (
                    <Button variant="outline" asChild>
                      <a href={selectedCandidato.linkedin} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              )}

              {/* Informações de Contato */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Informações de Contato</h3>
                <Card className="bg-slate-900/50 border-slate-700 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">{selectedCandidato?.email}</span>
                  </div>
                  {selectedCandidato?.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{selectedCandidato.telefone}</span>
                    </div>
                  )}
                  {selectedCandidato?.linkedin && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <a href={selectedCandidato.linkedin} target="_blank" className="text-cyan-400 hover:text-cyan-300">
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {selectedCandidato?.curriculo && (
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">Currículo disponível para download</span>
                    </div>
                  )}
                </Card>
              </div>

              {/* Informações Profissionais */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Informações Profissionais</h3>
                <Card className="bg-slate-900/50 border-slate-700 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Experiência</p>
                      <p className="text-white font-medium">{selectedCandidato?.experiencia_anos} anos</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Formação</p>
                      <p className="text-white font-medium">{selectedCandidato?.formacao || "Não informada"}</p>
                    </div>
                    {selectedCandidato?.pretensao_salarial && (
                      <div>
                        <p className="text-slate-400 text-sm">Pretensão Salarial</p>
                        <p className="text-white font-medium">{selectedCandidato.pretensao_salarial}</p>
                      </div>
                    )}
                    {selectedCandidato?.disponibilidade && (
                      <div>
                        <p className="text-slate-400 text-sm">Disponibilidade</p>
                        <p className="text-white font-medium">{selectedCandidato.disponibilidade}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedCandidato?.habilidades && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Habilidades</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidato.habilidades.split(',').map((habilidade, index) => (
                          <Badge key={index} variant="secondary" className="bg-slate-700 text-slate-300">
                            {habilidade.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCandidato?.observacoes && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Observações</p>
                      <p className="text-slate-300 text-sm">{selectedCandidato.observacoes}</p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Histórico de Aplicações */}
              {selectedCandidato && getAplicacoesByCandidato(selectedCandidato.id).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Histórico de Aplicações</h3>
                  <Card className="bg-slate-900/50 border-slate-700 p-4">
                    <div className="space-y-3">
                      {getAplicacoesByCandidato(selectedCandidato.id).map((aplicacao) => (
                        <div key={aplicacao.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div>
                            <p className="text-white font-medium">
                              {getVagaNome(aplicacao.vaga)}
                            </p>
                            <p className="text-slate-400 text-sm">
                              Aplicado em: {new Date(aplicacao.data_aplicacao).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <Badge className={getStatusColor(aplicacao.status)}>
                            {aplicacao.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Process Modal */}
        <Dialog open={isProcessModalOpen} onOpenChange={setIsProcessModalOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Processo Seletivo - {selectedCandidato?.nome}</DialogTitle>
              <DialogDescription className="text-slate-400">
                Acompanhe e gerencie todo o processo do candidato
              </DialogDescription>
            </DialogHeader>

            {selectedAplicacao && (
              <div className="space-y-6">
                {/* Pipeline de Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Progresso do Processo</h3>
                  <Card className="bg-slate-900/50 border-slate-700 p-4">
                    <div className="flex justify-between items-center mb-4">
                      {['NOVO', 'TRIAGEM', 'TESTE', 'ENTREVISTA', 'PROPOSTA', 'APROVADO', 'REJEITADO'].map((status, index) => (
                        <div key={status} className="flex items-center">
                          <div className={`flex flex-col items-center ${index > 0 ? 'flex-1' : ''}`}>
                            {index > 0 && (
                              <div className={`h-1 w-full ${
                                ['APROVADO', 'REJEITADO'].includes(selectedAplicacao.status) 
                                  ? status === selectedAplicacao.status 
                                    ? 'bg-cyan-500' 
                                    : 'bg-slate-600'
                                  : ['NOVO', 'TRIAGEM', 'TESTE', 'ENTREVISTA', 'PROPOSTA'].indexOf(selectedAplicacao.status) >= 
                                    ['NOVO', 'TRIAGEM', 'TESTE', 'ENTREVISTA', 'PROPOSTA'].indexOf(status)
                                    ? 'bg-cyan-500'
                                    : 'bg-slate-600'
                              }`} />
                            )}
                            <Button
                              variant="ghost"
                              className={`rounded-full w-12 h-12 p-0 ${
                                selectedAplicacao.status === status
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-slate-700 text-slate-400'
                              }`}
                              onClick={() => moverStatusAplicacao(selectedAplicacao.id, status)}
                            >
                              {getStatusIcon(status)}
                            </Button>
                            <span className="text-xs mt-1 text-slate-400 capitalize">
                              {status.toLowerCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Avaliações */}
                {selectedAplicacao.avaliacoes && selectedAplicacao.avaliacoes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Avaliações</h3>
                    <Card className="bg-slate-900/50 border-slate-700 p-4">
                      <div className="space-y-3">
                        {selectedAplicacao.avaliacoes.map((avaliacao) => (
                          <div key={avaliacao.id} className="p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-white font-medium capitalize">{avaliacao.tipo.toLowerCase()}</p>
                                <p className="text-slate-400 text-sm">Avaliador: {avaliacao.avaliador}</p>
                              </div>
                              <Badge className={avaliacao.nota >= 70 ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}>
                                Nota: {avaliacao.nota}/100
                              </Badge>
                            </div>
                            {avaliacao.comentarios && (
                              <p className="text-slate-300 text-sm">{avaliacao.comentarios}</p>
                            )}
                            {avaliacao.criterios && Object.keys(avaliacao.criterios).length > 0 && (
                              <div className="mt-2">
                                <p className="text-slate-400 text-sm mb-1">Critérios:</p>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(avaliacao.criterios).map(([criterio, nota]) => (
                                    <Badge key={criterio} variant="outline" className="bg-slate-700/50">
                                      {criterio}: {nota}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {/* Testes */}
                {selectedAplicacao.testes && selectedAplicacao.testes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Testes</h3>
                    <Card className="bg-slate-900/50 border-slate-700 p-4">
                      <div className="space-y-3">
                        {selectedAplicacao.testes.map((teste) => (
                          <div key={teste.id} className="p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-white font-medium">{teste.titulo}</p>
                                <p className="text-slate-400 text-sm capitalize">{teste.tipo.toLowerCase()}</p>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={getTipoTesteColor(teste.tipo)}>
                                  {teste.tipo}
                                </Badge>
                                <Badge className={
                                  teste.status === 'CONCLUIDO' ? "bg-green-500/10 text-green-400" :
                                  teste.status === 'EM_ANDAMENTO' ? "bg-blue-500/10 text-blue-400" :
                                  teste.status === 'EXPIRADO' ? "bg-red-500/10 text-red-400" :
                                  "bg-yellow-500/10 text-yellow-400"
                                }>
                                  {teste.status}
                                </Badge>
                              </div>
                            </div>
                            {teste.descricao && (
                              <p className="text-slate-300 text-sm mb-2">{teste.descricao}</p>
                            )}
                            <div className="flex justify-between items-center text-sm text-slate-400">
                              <span>Enviado: {new Date(teste.data_envio).toLocaleDateString('pt-BR')}</span>
                              {teste.nota && (
                                <span className="text-white">Nota: {teste.nota}/100</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {/* Entrevistas */}
                {selectedAplicacao.entrevistas && selectedAplicacao.entrevistas.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Entrevistas</h3>
                    <Card className="bg-slate-900/50 border-slate-700 p-4">
                      <div className="space-y-3">
                        {selectedAplicacao.entrevistas.map((entrevista) => (
                          <div key={entrevista.id} className="p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-white font-medium capitalize">{entrevista.tipo.toLowerCase()} • {entrevista.entrevistador}</p>
                                <p className="text-slate-400 text-sm">
                                  {new Date(entrevista.data_hora).toLocaleString('pt-BR')} • {entrevista.duracao_minutos}min
                                </p>
                              </div>
                              <Badge className={
                                entrevista.status === 'REALIZADA' ? "bg-green-500/10 text-green-400" :
                                entrevista.status === 'CANCELADA' ? "bg-red-500/10 text-red-400" :
                                "bg-blue-500/10 text-blue-400"
                              }>
                                {entrevista.status}
                              </Badge>
                            </div>
                            {entrevista.local && (
                              <p className="text-slate-300 text-sm mb-2">Local: {entrevista.local}</p>
                            )}
                            {entrevista.feedback && (
                              <div>
                                <p className="text-slate-400 text-sm mb-1">Feedback:</p>
                                <p className="text-slate-300 text-sm">{entrevista.feedback}</p>
                              </div>
                            )}
                            {entrevista.nota && (
                              <div className="mt-2">
                                <Badge variant="outline" className="bg-slate-700/50">
                                  Avaliação: {entrevista.nota}/10
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}