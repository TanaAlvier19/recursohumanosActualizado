"use client"

import { useState } from "react"
import {
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Candidatura = {
  id: string
  vagaId: string
  vagaTitulo: string
  empresa: string
  departamento: string
  dataCandidatura: string
  status:
    | "em_analise"
    | "triagem"
    | "entrevista_rh"
    | "teste_tecnico"
    | "entrevista_tecnica"
    | "proposta"
    | "aprovado"
    | "reprovado"
  etapaAtual: string
  progresso: number
  proximoPasso: string
  feedback?: string
  dataUltimaAtualizacao: string
}

export default function MinhasCandidaturasPage() {
  const [candidaturas] = useState<Candidatura[]>([
    {
      id: "1",
      vagaId: "1",
      vagaTitulo: "Desenvolvedor Full Stack Senior",
      empresa: "Tech Solutions",
      departamento: "Tecnologia",
      dataCandidatura: "2024-01-20",
      status: "entrevista_tecnica",
      etapaAtual: "Entrevista Técnica",
      progresso: 75,
      proximoPasso: "Aguardando agendamento da entrevista técnica",
      dataUltimaAtualizacao: "2024-01-25",
    },
    {
      id: "2",
      vagaId: "2",
      vagaTitulo: "Designer UX/UI",
      empresa: "Creative Agency",
      departamento: "Design",
      dataCandidatura: "2024-01-18",
      status: "teste_tecnico",
      etapaAtual: "Teste Técnico",
      progresso: 50,
      proximoPasso: "Realizar teste de design até 30/01/2024",
      dataUltimaAtualizacao: "2024-01-23",
    },
    {
      id: "3",
      vagaId: "3",
      vagaTitulo: "Analista de Marketing Digital",
      empresa: "Marketing Pro",
      departamento: "Marketing",
      dataCandidatura: "2024-01-15",
      status: "aprovado",
      etapaAtual: "Aprovado",
      progresso: 100,
      proximoPasso: "Aguardando envio da proposta",
      feedback: "Parabéns! Você foi aprovado no processo seletivo.",
      dataUltimaAtualizacao: "2024-01-26",
    },
    {
      id: "4",
      vagaId: "4",
      vagaTitulo: "Desenvolvedor Frontend",
      empresa: "StartupXYZ",
      departamento: "Tecnologia",
      dataCandidatura: "2024-01-10",
      status: "reprovado",
      etapaAtual: "Reprovado",
      progresso: 25,
      proximoPasso: "-",
      feedback: "Infelizmente não seguiremos com sua candidatura neste momento. Agradecemos seu interesse.",
      dataUltimaAtualizacao: "2024-01-22",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [candidaturaSelecionada, setCandidaturaSelecionada] = useState<Candidatura | null>(null)
  const [modalDetalhes, setModalDetalhes] = useState(false)

  const getStatusInfo = (status: string) => {
    const statusMap = {
      em_analise: {
        label: "Em Análise",
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        icon: AlertCircle,
      },
      triagem: { label: "Triagem", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Clock },
      entrevista_rh: {
        label: "Entrevista RH",
        color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        icon: MessageSquare,
      },
      teste_tecnico: {
        label: "Teste Técnico",
        color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
        icon: FileText,
      },
      entrevista_tecnica: {
        label: "Entrevista Técnica",
        color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
        icon: MessageSquare,
      },
      proposta: { label: "Proposta", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
      aprovado: { label: "Aprovado", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
      reprovado: { label: "Reprovado", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
    }
    return statusMap[status as keyof typeof statusMap] || statusMap.em_analise
  }

  const abrirDetalhes = (candidatura: Candidatura) => {
    setCandidaturaSelecionada(candidatura)
    setModalDetalhes(true)
  }

  const candidaturasAtivas = candidaturas.filter((c) => !["aprovado", "reprovado"].includes(c.status))
  const candidaturasFinalizadas = candidaturas.filter((c) => ["aprovado", "reprovado"].includes(c.status))

  const renderCandidaturaCard = (candidatura: Candidatura) => {
    const statusInfo = getStatusInfo(candidatura.status)
    const StatusIcon = statusInfo.icon

    return (
      <Card
        key={candidatura.id}
        className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300"
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <CardTitle className="text-lg text-slate-100 mb-1">{candidatura.vagaTitulo}</CardTitle>
              <CardDescription className="text-slate-400">
                {candidatura.empresa} • {candidatura.departamento}
              </CardDescription>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 ${statusInfo.color}`}>
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Progresso</span>
              <span className="text-slate-300 font-medium">{candidatura.progresso}%</span>
            </div>
            <Progress value={candidatura.progresso} className="h-2" />
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-slate-400">Etapa atual:</p>
                <p className="text-slate-200 font-medium">{candidatura.etapaAtual}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-cyan-400 mt-0.5" />
              <div>
                <p className="text-slate-400">Próximo passo:</p>
                <p className="text-slate-200">{candidatura.proximoPasso}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-700">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Candidatura: {new Date(candidatura.dataCandidatura).toLocaleDateString("pt-BR")}
            </div>
            <div>Atualizado: {new Date(candidatura.dataUltimaAtualizacao).toLocaleDateString("pt-BR")}</div>
          </div>

          <Button
            onClick={() => abrirDetalhes(candidatura)}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver detalhes
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Minhas Candidaturas
          </h1>
          <p className="text-slate-400 text-lg">Acompanhe o status de todas as suas candidaturas em um só lugar</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total</p>
                  <p className="text-3xl font-bold text-slate-100">{candidaturas.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Em Andamento</p>
                  <p className="text-3xl font-bold text-blue-400">{candidaturasAtivas.length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Aprovadas</p>
                  <p className="text-3xl font-bold text-green-400">
                    {candidaturas.filter((c) => c.status === "aprovado").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Taxa de Sucesso</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {Math.round(
                      (candidaturas.filter((c) => c.status === "aprovado").length / candidaturas.length) * 100,
                    )}
                    %
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ativas" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="ativas" className="data-[state=active]:bg-slate-700">
              Em Andamento ({candidaturasAtivas.length})
            </TabsTrigger>
            <TabsTrigger value="finalizadas" className="data-[state=active]:bg-slate-700">
              Finalizadas ({candidaturasFinalizadas.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ativas" className="space-y-6">
            {candidaturasAtivas.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Nenhuma candidatura ativa</h3>
                <p className="text-slate-400 mb-6">Você não possui candidaturas em andamento no momento.</p>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  Explorar vagas
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidaturasAtivas.map(renderCandidaturaCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="finalizadas" className="space-y-6">
            {candidaturasFinalizadas.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Nenhuma candidatura finalizada</h3>
                <p className="text-slate-400">Suas candidaturas finalizadas aparecerão aqui.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidaturasFinalizadas.map(renderCandidaturaCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={modalDetalhes} onOpenChange={setModalDetalhes}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {candidaturaSelecionada?.vagaTitulo}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {candidaturaSelecionada?.empresa} • {candidaturaSelecionada?.departamento}
            </DialogDescription>
          </DialogHeader>

          {candidaturaSelecionada && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status atual:</span>
                <span
                  className={`text-sm px-3 py-1 rounded-full border ${getStatusInfo(candidaturaSelecionada.status).color}`}
                >
                  {getStatusInfo(candidaturaSelecionada.status).label}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Progresso no processo</span>
                  <span className="text-slate-300 font-medium">{candidaturaSelecionada.progresso}%</span>
                </div>
                <Progress value={candidaturaSelecionada.progresso} className="h-3" />
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Etapa atual</p>
                  <p className="text-slate-100 font-medium">{candidaturaSelecionada.etapaAtual}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Próximo passo</p>
                  <p className="text-slate-100">{candidaturaSelecionada.proximoPasso}</p>
                </div>
              </div>

              {candidaturaSelecionada.feedback && (
                <div className="bg-slate-900/50 p-4 rounded-lg border-l-4 border-cyan-500">
                  <p className="text-slate-400 text-sm mb-2">Feedback do recrutador</p>
                  <p className="text-slate-100">{candidaturaSelecionada.feedback}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Data da candidatura</p>
                  <p className="text-slate-100">
                    {new Date(candidaturaSelecionada.dataCandidatura).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Última atualização</p>
                  <p className="text-slate-100">
                    {new Date(candidaturaSelecionada.dataUltimaAtualizacao).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar mensagem
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setModalDetalhes(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
