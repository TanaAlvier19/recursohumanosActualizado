"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
  Tag,
  Send,
  Paperclip,
  TrendingUp,
} from "lucide-react"
import { MetricCard } from "@/components/metrcCard"

export default function SuporteAdmin() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [prioridadeFilter, setPrioridadeFilter] = useState("todas")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [resposta, setResposta] = useState("")

  const tickets = [
    {
      id: "TK-001",
      titulo: "Erro ao gerar folha de pagamento",
      descricao: "Sistema apresenta erro ao tentar processar folha de março",
      funcionario: "João Silva",
      departamento: "Financeiro",
      categoria: "Folha de Pagamento",
      prioridade: "alta",
      status: "aberto",
      dataAbertura: "2024-03-15",
      ultimaAtualizacao: "2024-03-15 14:30",
      respostas: 0,
    },
    {
      id: "TK-002",
      titulo: "Dúvida sobre férias",
      descricao: "Como solicitar férias pelo sistema?",
      funcionario: "Maria Santos",
      departamento: "Comercial",
      categoria: "Assiduidade",
      prioridade: "baixa",
      status: "em_andamento",
      dataAbertura: "2024-03-14",
      ultimaAtualizacao: "2024-03-15 10:15",
      respostas: 2,
    },
    {
      id: "TK-003",
      titulo: "Certificado de formação não disponível",
      descricao: "Concluí o curso mas não consigo baixar o certificado",
      funcionario: "Pedro Costa",
      departamento: "TI",
      categoria: "Formações",
      prioridade: "media",
      status: "aberto",
      dataAbertura: "2024-03-15",
      ultimaAtualizacao: "2024-03-15 09:00",
      respostas: 1,
    },
    {
      id: "TK-004",
      titulo: "Atualização de dados cadastrais",
      descricao: "Preciso atualizar meu endereço no sistema",
      funcionario: "Ana Oliveira",
      departamento: "RH",
      categoria: "Cadastro",
      prioridade: "baixa",
      status: "resolvido",
      dataAbertura: "2024-03-13",
      ultimaAtualizacao: "2024-03-14 16:45",
      respostas: 3,
    },
    {
      id: "TK-005",
      titulo: "Problema no acesso ao sistema",
      descricao: "Não consigo fazer login, senha não funciona",
      funcionario: "Carlos Mendes",
      departamento: "Operações",
      categoria: "Acesso",
      prioridade: "alta",
      status: "em_andamento",
      dataAbertura: "2024-03-15",
      ultimaAtualizacao: "2024-03-15 11:20",
      respostas: 1,
    },
  ]

  const metricas = {
    ticketsAbertos: 15,
    emAndamento: 8,
    resolvidos: 142,
    tempoMedioResposta: "2.5h",
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      aberto: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      em_andamento: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      resolvido: "bg-green-500/20 text-green-400 border-green-500/30",
      fechado: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    }
    const labels = {
      aberto: "Aberto",
      em_andamento: "Em Andamento",
      resolvido: "Resolvido",
      fechado: "Fechado",
    }
    return <Badge className={styles[status as keyof typeof styles]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getPrioridadeBadge = (prioridade: string) => {
    const styles = {
      baixa: "bg-slate-500/20 text-slate-400 border-slate-500/30",
      media: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      alta: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    const labels = {
      baixa: "Baixa",
      media: "Média",
      alta: "Alta",
    }
    return (
      <Badge className={styles[prioridade as keyof typeof styles]}>{labels[prioridade as keyof typeof labels]}</Badge>
    )
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch =
      ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.funcionario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "todos" || ticket.status === statusFilter
    const matchPrioridade = prioridadeFilter === "todas" || ticket.prioridade === prioridadeFilter
    return matchSearch && matchStatus && matchPrioridade
  })

  const handleResponder = () => {
    console.log("Resposta enviada:", resposta)
    setResposta("")
    setShowDetails(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Suporte e Tickets
            </h1>
            <p className="text-slate-400 mt-1">Gerencie solicitações e tickets de suporte</p>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Tickets Abertos"
            value={metricas.ticketsAbertos.toString()}
            icon={AlertCircle}
            description="Aguardando atendimento"
            trend={{ value: 12, isPositive: false }}
          />
          <MetricCard
            title="Em Andamento"
            value={metricas.emAndamento.toString()}
            icon={Clock}
            description="Sendo processados"
            trend={{ value: 5, isPositive: true }}
          />
          <MetricCard
            title="Resolvidos"
            value={metricas.resolvidos.toString()}
            icon={CheckCircle2}
            description="Este mês"
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Tempo Médio"
            value={metricas.tempoMedioResposta}
            icon={TrendingUp}
            description="Tempo de resposta"
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Filtros */}
        <Card className="bg-slate-800/50 border-slate-700 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar por ticket, funcionário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-700 text-slate-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-900/50 border-slate-700 text-slate-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="resolvido">Resolvido</SelectItem>
                <SelectItem value="fechado">Fechado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-900/50 border-slate-700 text-slate-200">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas Prioridades</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Lista de Tickets */}
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer"
              onClick={() => {
                setSelectedTicket(ticket)
                setShowDetails(true)
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-cyan-400">{ticket.id}</span>
                      {getStatusBadge(ticket.status)}
                      {getPrioridadeBadge(ticket.prioridade)}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">{ticket.titulo}</h3>
                    <p className="text-slate-400 text-sm mb-3">{ticket.descricao}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6 text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{ticket.funcionario}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>{ticket.categoria}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{ticket.dataAbertura}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>{ticket.respostas} respostas</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal de Detalhes */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Detalhes do Ticket
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Visualize e responda ao ticket de suporte
              </DialogDescription>
            </DialogHeader>

            {selectedTicket && (
              <div className="space-y-6">
                {/* Informações do Ticket */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-cyan-400">{selectedTicket.id}</span>
                    {getStatusBadge(selectedTicket.status)}
                    {getPrioridadeBadge(selectedTicket.prioridade)}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-200 mb-2">{selectedTicket.titulo}</h3>
                    <p className="text-slate-400">{selectedTicket.descricao}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div>
                      <p className="text-sm text-slate-400">Funcionário</p>
                      <p className="text-slate-200 font-medium">{selectedTicket.funcionario}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Departamento</p>
                      <p className="text-slate-200 font-medium">{selectedTicket.departamento}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Categoria</p>
                      <p className="text-slate-200 font-medium">{selectedTicket.categoria}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Data de Abertura</p>
                      <p className="text-slate-200 font-medium">{selectedTicket.dataAbertura}</p>
                    </div>
                  </div>
                </div>

                {/* Histórico de Respostas */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-200">Histórico de Respostas</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-cyan-400">{selectedTicket.funcionario}</span>
                        <span className="text-xs text-slate-400">{selectedTicket.dataAbertura} 14:30</span>
                      </div>
                      <p className="text-slate-300 text-sm">{selectedTicket.descricao}</p>
                    </div>
                  </div>
                </div>

                {/* Responder */}
                <div className="space-y-3">
                  <Label className="text-slate-200">Responder Ticket</Label>
                  <Textarea
                    placeholder="Digite sua resposta..."
                    value={resposta}
                    onChange={(e) => setResposta(e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-slate-200 min-h-32"
                  />
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleResponder}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Resposta
                    </Button>
                    <Button variant="outline" className="border-slate-700 text-slate-300 bg-transparent">
                      <Paperclip className="w-4 h-4 mr-2" />
                      Anexar Arquivo
                    </Button>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                  <Select defaultValue={selectedTicket.status}>
                    <SelectTrigger className="w-48 bg-slate-900/50 border-slate-700 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="resolvido">Resolvido</SelectItem>
                      <SelectItem value="fechado">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="border-slate-700 text-slate-300 bg-transparent">
                    Atualizar Status
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
