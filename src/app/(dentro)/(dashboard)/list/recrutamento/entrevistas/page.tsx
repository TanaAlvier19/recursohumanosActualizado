"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, Filter, Calendar as CalendarIcon, Clock, MapPin, User, Mail, Phone, 
  Video, PhoneCall, Users, CheckCircle, XCircle, MoreVertical, Edit, Trash2,
  Plus, MessageSquare, Star, Download
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Swal from "sweetalert2"
import Link from "next/link"
import { format, parseISO, isToday, isTomorrow, isAfter } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Candidato {
  id: string
  nome: string
  email: string
  telefone: string
  curriculo: string
  experiencia_anos: number
  formacao: string
}

interface Vaga {
  id: string
  titulo: string
}

interface Entrevista {
  id: string
  candidato: Candidato
  vaga: Vaga
  tipo: 'TELEFONE' | 'VIDEO' | 'PRESENCIAL'
  entrevistador: string
  data_hora: string
  duracao_minutos: number
  local: string
  status: 'AGENDADA' | 'REALIZADA' | 'CANCELADA'
  feedback: string
  nota: number | null
  criado_em: string
  atualizado_em: string
}

interface Aplicacao {
  id: string
  candidato: Candidato
  vaga: Vaga
  status: string
}

export default function EntrevistasPage() {
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([])
  const [aplicacoes, setAplicacoes] = useState<Aplicacao[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("todas")
  const [selectedTipo, setSelectedTipo] = useState("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEntrevista, setSelectedEntrevista] = useState<Entrevista | null>(null)
  const [novaEntrevista, setNovaEntrevista] = useState({
    aplicacao_id: "",
    tipo: "VIDEO" as 'TELEFONE' | 'VIDEO' | 'PRESENCIAL',
    entrevistador: "",
    data_hora: "",
    duracao_minutos: 60,
    local: "",
    observacoes: ""
  })

  // Buscar entrevistas e aplicações ao carregar
  useEffect(() => {
    fetchEntrevistas()
    fetchAplicacoes()
  }, [])

  const fetchEntrevistas = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://recursohumanosactualizado.onrender.com/entrevistas/", {
        credentials: "include"
      })
      
      if (!response.ok) throw new Error("Erro ao buscar entrevistas")
      
      const data = await response.json()
      setEntrevistas(data)
    } catch (error) {
      console.error("Erro ao buscar entrevistas:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível carregar as entrevistas",
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
      const response = await fetch("https://recursohumanosactualizado.onrender.com/aplicacoes/?status=ENTREVISTA", {
        credentials: "include"
      })
      
      if (!response.ok) throw new Error("Erro ao buscar aplicações")
      
      const data = await response.json()
      setAplicacoes(data)
    } catch (error) {
      console.error("Erro ao buscar aplicações:", error)
    }
  }

  const handleAgendarEntrevista = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("https://recursohumanosactualizado.onrender.com/entrevistas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(novaEntrevista)
      })

      if (response.ok) {
        Swal.fire({
          title: "Sucesso!",
          text: "Entrevista agendada com sucesso",
          icon: "success",
          background: "#1e293b",
          color: "white",
        })
        setIsDialogOpen(false)
        setNovaEntrevista({
          aplicacao_id: "",
          tipo: "VIDEO",
          entrevistador: "",
          data_hora: "",
          duracao_minutos: 60,
          local: "",
          observacoes: ""
        })
        fetchEntrevistas()
      } else {
        throw new Error("Erro ao agendar entrevista")
      }
    } catch (error) {
      console.error("Erro ao agendar entrevista:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível agendar a entrevista",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    }
  }

  const handleConcluirEntrevista = async (entrevistaId: string, feedback: string, nota: number) => {
    try {
      const response = await fetch(`https://recursohumanosactualizado.onrender.com/entrevistas/${entrevistaId}/concluir/`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          feedback,
          nota
        })
      })

      if (response.ok) {
        Swal.fire({
          title: "Sucesso!",
          text: "Entrevista concluída com sucesso",
          icon: "success",
          background: "#1e293b",
          color: "white",
        })
        fetchEntrevistas()
      } else {
        throw new Error("Erro ao concluir entrevista")
      }
    } catch (error) {
      console.error("Erro ao concluir entrevista:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível concluir a entrevista",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    }
  }

  const handleCancelarEntrevista = async (entrevistaId: string) => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: "Esta ação não pode ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sim, cancelar!",
      cancelButtonText: "Voltar",
      background: "#1e293b",
      color: "white",
    })

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://recursohumanosactualizado.onrender.com/entrevistas/${entrevistaId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: "CANCELADA"
          })
        })

        if (response.ok) {
          Swal.fire({
            title: "Cancelada!",
            text: "Entrevista cancelada com sucesso",
            icon: "success",
            background: "#1e293b",
            color: "white",
          })
          fetchEntrevistas()
        } else {
          throw new Error("Erro ao cancelar entrevista")
        }
      } catch (error) {
        console.error("Erro ao cancelar entrevista:", error)
        Swal.fire({
          title: "Erro",
          text: "Não foi possível cancelar a entrevista",
          icon: "error",
          background: "#1e293b",
          color: "white",
        })
      }
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'AGENDADA': "bg-blue-500/10 text-blue-400 border-blue-500/20",
      'REALIZADA': "bg-green-500/10 text-green-400 border-green-500/20",
      'CANCELADA': "bg-red-500/10 text-red-400 border-red-500/20",
    }
    return colors[status] || "bg-slate-500/10 text-slate-400 border-slate-500/20"
  }

  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, any> = {
      'TELEFONE': PhoneCall,
      'VIDEO': Video,
      'PRESENCIAL': Users,
    }
    const IconComponent = icons[tipo] || Users
    return <IconComponent className="w-4 h-4" />
  }

  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      'TELEFONE': "bg-purple-500/10 text-purple-400",
      'VIDEO': "bg-cyan-500/10 text-cyan-400",
      'PRESENCIAL': "bg-orange-500/10 text-orange-400",
    }
    return colors[tipo] || "bg-slate-500/10 text-slate-400"
  }

  const getDataStatus = (dataHora: string) => {
    const data = parseISO(dataHora)
    const agora = new Date()
    
    if (isToday(data)) return "today"
    if (isTomorrow(data)) return "tomorrow"
    if (isAfter(data, agora)) return "upcoming"
    return "past"
  }

  const filteredEntrevistas = entrevistas.filter((entrevista) => {
    const matchesSearch =
      entrevista.candidato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrevista.vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrevista.entrevistador.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === "todas" || entrevista.status === selectedStatus
    const matchesTipo = selectedTipo === "todos" || entrevista.tipo === selectedTipo
    
    return matchesSearch && matchesStatus && matchesTipo
  })

  // Estatísticas
  const estatisticas = {
    total: entrevistas.length,
    agendadas: entrevistas.filter(e => e.status === 'AGENDADA').length,
    realizadas: entrevistas.filter(e => e.status === 'REALIZADA').length,
    canceladas: entrevistas.filter(e => e.status === 'CANCELADA').length,
    hoje: entrevistas.filter(e => isToday(parseISO(e.data_hora))).length,
  }

  // Próximas entrevistas (próximos 7 dias)
  const proximasEntrevistas = entrevistas
    .filter(e => e.status === 'AGENDADA' && isAfter(parseISO(e.data_hora), new Date()))
    .sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-20 w-full bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 bg-slate-800" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 bg-slate-800" />
            <Skeleton className="h-96 bg-slate-800 col-span-2" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/recrutamento" className="text-sm text-slate-400 hover:text-cyan-400 mb-2 inline-block">
              ← Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Gestão de Entrevistas</h1>
            <p className="text-slate-400">Agende e acompanhe todas as entrevistas do processo seletivo</p>
          </div>
          <Button
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agendar Entrevista
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total de Entrevistas</p>
                  <p className="text-2xl font-bold text-white mt-1">{estatisticas.total}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Agendadas</p>
                  <p className="text-2xl font-bold text-white mt-1">{estatisticas.agendadas}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Realizadas</p>
                  <p className="text-2xl font-bold text-white mt-1">{estatisticas.realizadas}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Para Hoje</p>
                  <p className="text-2xl font-bold text-white mt-1">{estatisticas.hoje}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Próximas Entrevistas */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Próximas Entrevistas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {proximasEntrevistas.length === 0 ? (
                <p className="text-slate-400 text-center py-4">Nenhuma entrevista agendada</p>
              ) : (
                proximasEntrevistas.map((entrevista) => (
                  <div key={entrevista.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm">
                            {entrevista.candidato.nome.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-semibold text-sm">{entrevista.candidato.nome}</p>
                          <p className="text-slate-400 text-xs">{entrevista.vaga.titulo}</p>
                        </div>
                      </div>
                      <Badge className={getTipoColor(entrevista.tipo)}>
                        {getTipoIcon(entrevista.tipo)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-3 h-3" />
                        {format(parseISO(entrevista.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {entrevista.duracao_minutos} minutos
                      </div>
                      {entrevista.local && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {entrevista.local}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Lista de Entrevistas */}
          <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-white">Todas as Entrevistas</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar entrevistas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white w-full sm:w-64"
                    />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-full sm:w-32">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="todas">Todos</SelectItem>
                      <SelectItem value="AGENDADA">Agendadas</SelectItem>
                      <SelectItem value="REALIZADA">Realizadas</SelectItem>
                      <SelectItem value="CANCELADA">Canceladas</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-full sm:w-32">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="TELEFONE">Telefone</SelectItem>
                      <SelectItem value="VIDEO">Vídeo</SelectItem>
                      <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEntrevistas.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p>Nenhuma entrevista encontrada</p>
                  </div>
                ) : (
                  filteredEntrevistas.map((entrevista) => (
                    <div key={entrevista.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-cyan-500/50 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                              {entrevista.candidato.nome.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-white font-semibold">{entrevista.candidato.nome}</h3>
                                <p className="text-slate-400 text-sm">{entrevista.vaga.titulo}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(entrevista.status)}>
                                  {entrevista.status === 'AGENDADA' ? 'Agendada' : 
                                   entrevista.status === 'REALIZADA' ? 'Realizada' : 'Cancelada'}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="bg-slate-800 border-slate-700">
                                    {entrevista.status === 'AGENDADA' && (
                                      <>
                                        <DropdownMenuItem className="text-slate-300">
                                          <Edit className="w-4 h-4 mr-2" />
                                          Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          className="text-green-400"
                                          onClick={() => {
                                            setSelectedEntrevista(entrevista)
                                            // Abrir modal de conclusão
                                            Swal.fire({
                                              title: 'Concluir Entrevista',
                                              html: `
                                                <textarea id="feedback" class="swal2-textarea" placeholder="Feedback da entrevista..." rows="4"></textarea>
                                                <input id="nota" type="number" min="0" max="10" step="0.5" class="swal2-input" placeholder="Nota (0-10)">
                                              `,
                                              focusConfirm: false,
                                              showCancelButton: true,
                                              confirmButtonText: 'Concluir',
                                              cancelButtonText: 'Cancelar',
                                              background: '#1e293b',
                                              color: 'white',
                                              preConfirm: () => {
                                                const feedback = (document.getElementById('feedback') as HTMLTextAreaElement).value
                                                const nota = parseFloat((document.getElementById('nota') as HTMLInputElement).value)
                                                if (!feedback) {
                                                  Swal.showValidationMessage('Por favor, preencha o feedback')
                                                  return false
                                                }
                                                return { feedback, nota }
                                              }
                                            }).then((result) => {
                                              if (result.isConfirmed) {
                                                handleConcluirEntrevista(entrevista.id, result.value.feedback, result.value.nota)
                                              }
                                            })
                                          }}
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Concluir
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                    <DropdownMenuItem 
                                      className="text-red-400"
                                      onClick={() => handleCancelarEntrevista(entrevista.id)}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Cancelar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-slate-300 text-sm">
                                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                                  {format(parseISO(entrevista.data_hora), "EEEE, dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </div>
                                <div className="flex items-center gap-2 text-slate-300 text-sm">
                                  <Clock className="w-4 h-4 text-slate-400" />
                                  {entrevista.duracao_minutos} minutos
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-slate-300 text-sm">
                                  {getTipoIcon(entrevista.tipo)}
                                  <span className="capitalize">{entrevista.tipo.toLowerCase()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300 text-sm">
                                  <User className="w-4 h-4 text-slate-400" />
                                  {entrevista.entrevistador}
                                </div>
                              </div>
                            </div>

                            {entrevista.local && (
                              <div className="flex items-center gap-2 text-slate-300 text-sm mt-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                {entrevista.local}
                              </div>
                            )}

                            {entrevista.status === 'REALIZADA' && entrevista.feedback && (
                              <div className="mt-3 p-3 bg-slate-600/50 rounded-lg">
                                <p className="text-slate-400 text-sm mb-1">Feedback:</p>
                                <p className="text-slate-300 text-sm">{entrevista.feedback}</p>
                                {entrevista.nota && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-slate-300 text-sm">Nota: {entrevista.nota}/10</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal Agendar Entrevista */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Agendar Nova Entrevista</DialogTitle>
              <DialogDescription className="text-slate-400">
                Preencha os dados para agendar uma nova entrevista
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAgendarEntrevista} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Candidato e Vaga</label>
                  <Select 
                    value={novaEntrevista.aplicacao_id} 
                    onValueChange={(value) => setNovaEntrevista({...novaEntrevista, aplicacao_id: value})}
                    required
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Selecione o candidato" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {aplicacoes.map((aplicacao) => (
                        <SelectItem key={aplicacao.id} value={aplicacao.id}>
                          {aplicacao.candidato.nome} - {aplicacao.vaga.titulo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Tipo de Entrevista</label>
                  <Select 
                    value={novaEntrevista.tipo} 
                    onValueChange={(value: 'TELEFONE' | 'VIDEO' | 'PRESENCIAL') => 
                      setNovaEntrevista({...novaEntrevista, tipo: value})}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="TELEFONE">Telefone</SelectItem>
                      <SelectItem value="VIDEO">Vídeo</SelectItem>
                      <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Entrevistador</label>
                  <Input
                    value={novaEntrevista.entrevistador}
                    onChange={(e) => setNovaEntrevista({...novaEntrevista, entrevistador: e.target.value})}
                    placeholder="Nome do entrevistador"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Duração (minutos)</label>
                  <Input
                    type="number"
                    value={novaEntrevista.duracao_minutos}
                    onChange={(e) => setNovaEntrevista({...novaEntrevista, duracao_minutos: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                    min="15"
                    max="240"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Data e Hora</label>
                  <Input
                    type="datetime-local"
                    value={novaEntrevista.data_hora}
                    onChange={(e) => setNovaEntrevista({...novaEntrevista, data_hora: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Local/Link {novaEntrevista.tipo !== 'PRESENCIAL' && '(Opcional)'}
                  </label>
                  <Input
                    value={novaEntrevista.local}
                    onChange={(e) => setNovaEntrevista({...novaEntrevista, local: e.target.value})}
                    placeholder={
                      novaEntrevista.tipo === 'TELEFONE' ? 'Número de telefone (opcional)' :
                      novaEntrevista.tipo === 'VIDEO' ? 'Link da reunião (opcional)' :
                      'Local da entrevista'
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required={novaEntrevista.tipo === 'PRESENCIAL'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Observações</label>
                <Textarea
                  value={novaEntrevista.observacoes}
                  onChange={(e) => setNovaEntrevista({...novaEntrevista, observacoes: e.target.value})}
                  placeholder="Observações adicionais sobre a entrevista..."
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Agendar Entrevista
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}