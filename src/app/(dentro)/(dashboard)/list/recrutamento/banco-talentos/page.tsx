"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  Search,
  Filter,
  Star,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Eye,
  Send,
  Tag,
  Calendar,
  Award,
  TrendingUp,
  Loader2,
} from "lucide-react"

interface Talento {
  id: number
  nome: string
  cargo: string
  localizacao: string
  email: string
  telefone: string
  experiencia_anos: number
  rating: number
  skills: string[]
  disponibilidade: string
  pretensao_salarial: string
  ultimo_contato: string
  fonte: string
  status: string
  tags: string[]
  curriculo?: string
}

interface Estatisticas {
  total_talentos: number
  talentos_ativos: number
  rating_medio: number
  contratados: number
}

export default function BancoTalentosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTalento, setSelectedTalento] = useState<Talento | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [talentos, setTalentos] = useState<Talento[]>([])
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    total_talentos: 0,
    talentos_ativos: 0,
    rating_medio: 0,
    contratados: 0
  })
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroExperiencia, setFiltroExperiencia] = useState("todos")
  const [filtroDisponibilidade, setFiltroDisponibilidade] = useState("todos")

  const fetchTalentos = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://recursohumanosactualizado.onrender.com/candidatos/banco_talentos/',{
        credentials:"include"
      })
      if (response.ok) {
        const data = await response.json()
        setTalentos(data)
      }
    } catch (error) {
      console.error('Erro ao buscar talentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEstatisticas = async () => {
    try {
      const response = await fetch('https://recursohumanosactualizado.onrender.com/candidatos/estatisticas_banco_talentos/',{
        credentials:"include"
      })
      if (response.ok) {
        const data = await response.json()
        setEstatisticas(data)
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    }
  }

  useEffect(() => {
    fetchTalentos()
    fetchEstatisticas()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ATIVO":
        case "EM_PROCESSO":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "INATIVO":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const handleViewDetails = (talento: Talento) => {
    setSelectedTalento(talento)
    setIsDetailModalOpen(true)
  }

  const handleEnviarMensagem = async (talento: Talento) => {
    try {
      // Implementar lógica de envio de mensagem
      console.log('Enviando mensagem para:', talento.email)
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    }
  }

  // Filtrar talentos baseado nos filtros
  const talentosFiltrados = talentos.filter(talento => {
    const matchesSearch = searchTerm === "" || 
      talento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talento.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talento.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = filtroStatus === "todos" || talento.status === filtroStatus.toUpperCase()
    
    const matchesExperiencia = filtroExperiencia === "todos" || 
      (filtroExperiencia === "junior" && talento.experiencia_anos <= 2) ||
      (filtroExperiencia === "pleno" && talento.experiencia_anos > 2 && talento.experiencia_anos <= 5) ||
      (filtroExperiencia === "senior" && talento.experiencia_anos > 5)
    
    const matchesDisponibilidade = filtroDisponibilidade === "todos" || 
      talento.disponibilidade.toLowerCase().includes(filtroDisponibilidade)

    return matchesSearch && matchesStatus && matchesExperiencia && matchesDisponibilidade
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-slate-400">Carregando talentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Banco de Talentos</h1>
          <p className="text-slate-400">Gerencie seu pool de candidatos qualificados</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total de Talentos</p>
                <p className="text-2xl font-bold text-white mt-1">{estatisticas.total_talentos}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Talentos Ativos</p>
                <p className="text-2xl font-bold text-white mt-1">{estatisticas.talentos_ativos}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Rating Médio</p>
                <p className="text-2xl font-bold text-white mt-1">{estatisticas.rating_medio}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Contratados</p>
                <p className="text-2xl font-bold text-white mt-1">{estatisticas.contratados}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-400" />
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
                placeholder="Buscar por nome, cargo ou skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full md:w-[200px] bg-slate-700 border-slate-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="em_processo">Em Processo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroExperiencia} onValueChange={setFiltroExperiencia}>
              <SelectTrigger className="w-full md:w-[200px] bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Experiência" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="junior">Júnior (0-2 anos)</SelectItem>
                <SelectItem value="pleno">Pleno (3-5 anos)</SelectItem>
                <SelectItem value="senior">Sênior (6+ anos)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroDisponibilidade} onValueChange={setFiltroDisponibilidade}>
              <SelectTrigger className="w-full md:w-[200px] bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Disponibilidade" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="imediato">Imediato</SelectItem>
                <SelectItem value="30 dias">Até 30 dias</SelectItem>
                <SelectItem value="60 dias">Até 60 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Talentos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {talentosFiltrados.map((talento) => (
            <Card
              key={talento.id}
              className="bg-slate-800/50 border-slate-700 p-6 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {talento.nome
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{talento.nome}</h3>
                    <p className="text-slate-400 text-sm">{talento.cargo}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 text-sm font-medium">{talento.rating}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(talento.status)}>
                  {talento.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {talento.localizacao}
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  {talento.experiencia_anos} anos de experiência
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {talento.email}
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {talento.telefone}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-slate-400 text-xs mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {talento.skills.map((skill, idx) => (
                    <Badge key={idx} className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-slate-400 text-xs mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {talento.tags.map((tag, idx) => (
                    <Badge key={idx} className="bg-slate-700 text-slate-300 border-slate-600">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-900/50 rounded-lg text-sm">
                <div>
                  <p className="text-slate-400 text-xs">Disponibilidade</p>
                  <p className="text-white font-medium">{talento.disponibilidade}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Pretensão</p>
                  <p className="text-white font-medium">{talento.pretensao_salarial}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Último Contato</p>
                  <p className="text-white font-medium">
                    {new Date(talento.ultimo_contato).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Fonte</p>
                  <p className="text-white font-medium">{talento.fonte}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  onClick={() => handleViewDetails(talento)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Perfil
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-600 hover:bg-slate-700 bg-transparent"
                  onClick={() => handleEnviarMensagem(talento)}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {talentosFiltrados.length === 0 && !loading && (
          <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Nenhum talento encontrado</h3>
            <p className="text-slate-400">
              {searchTerm ? "Tente ajustar os termos de busca ou filtros." : "Não há talentos disponíveis no momento."}
            </p>
          </Card>
        )}

        {/* Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedTalento?.nome}</DialogTitle>
              <DialogDescription className="text-slate-400">{selectedTalento?.cargo}</DialogDescription>
            </DialogHeader>

            {selectedTalento && (
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Informações de Contato</h3>
                  <Card className="bg-slate-900/50 border-slate-700 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{selectedTalento.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{selectedTalento.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{selectedTalento.localizacao}</span>
                    </div>
                  </Card>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Competências</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTalento.skills.map((skill: string, idx: number) => (
                      <Badge key={idx} className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Histórico */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Histórico de Interações</h3>
                  <Card className="bg-slate-900/50 border-slate-700 p-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-cyan-400 mt-1" />
                        <div>
                          <p className="text-white font-medium">Último Contato</p>
                          <p className="text-slate-400 text-sm">
                            {new Date(selectedTalento.ultimo_contato).toLocaleDateString("pt-BR")} - {selectedTalento.fonte}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    <Send className="w-4 h-4 mr-2" />
                    Entrar em Contato
                  </Button>
                  <Button variant="outline" className="border-slate-600 hover:bg-slate-700">
                    Download CV
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}