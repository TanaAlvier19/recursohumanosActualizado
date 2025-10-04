"use client"

import { useState } from "react"
import {
  Search,
  Download,
  Mail,
  Phone,
  Calendar,
  FileText,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  MoreVertical,
  Eye,
  UserCheck,
  UserX,
  Archive,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function CandidatosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("todos")
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)

  const candidatos = [
    {
      id: 1,
      nome: "Ana Silva",
      email: "ana.silva@email.com",
      telefone: "(11) 98765-4321",
      vaga: "Desenvolvedor Full Stack",
      status: "entrevista",
      etapa: "Entrevista Técnica",
      score: 85,
      localizacao: "São Paulo, SP",
      experiencia: "5 anos",
      formacao: "Ciência da Computação",
      salarioPretendido: "R$ 8.000",
      disponibilidade: "Imediato",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
      dataAplicacao: "2024-01-15",
      ultimaInteracao: "2024-01-20",
    },
    {
      id: 2,
      nome: "Carlos Santos",
      email: "carlos.santos@email.com",
      telefone: "(11) 98765-4322",
      vaga: "Analista de Marketing",
      status: "novo",
      etapa: "Triagem",
      score: 72,
      localizacao: "Rio de Janeiro, RJ",
      experiencia: "3 anos",
      formacao: "Marketing",
      salarioPretendido: "R$ 5.500",
      disponibilidade: "30 dias",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["SEO", "Google Ads", "Analytics", "Social Media"],
      dataAplicacao: "2024-01-18",
      ultimaInteracao: "2024-01-18",
    },
    {
      id: 3,
      nome: "Mariana Costa",
      email: "mariana.costa@email.com",
      telefone: "(11) 98765-4323",
      vaga: "Designer UX/UI",
      status: "aprovado",
      etapa: "Proposta Enviada",
      score: 92,
      localizacao: "Belo Horizonte, MG",
      experiencia: "4 anos",
      formacao: "Design Gráfico",
      salarioPretendido: "R$ 7.000",
      disponibilidade: "15 dias",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      dataAplicacao: "2024-01-10",
      ultimaInteracao: "2024-01-22",
    },
    {
      id: 4,
      nome: "Pedro Oliveira",
      email: "pedro.oliveira@email.com",
      telefone: "(11) 98765-4324",
      vaga: "Analista de Dados",
      status: "teste",
      etapa: "Teste Técnico",
      score: 78,
      localizacao: "Curitiba, PR",
      experiencia: "2 anos",
      formacao: "Estatística",
      salarioPretendido: "R$ 6.000",
      disponibilidade: "Imediato",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Python", "SQL", "Power BI", "Machine Learning"],
      dataAplicacao: "2024-01-16",
      ultimaInteracao: "2024-01-19",
    },
    {
      id: 5,
      nome: "Julia Ferreira",
      email: "julia.ferreira@email.com",
      telefone: "(11) 98765-4325",
      vaga: "Gerente de Projetos",
      status: "reprovado",
      etapa: "Finalizado",
      score: 58,
      localizacao: "Porto Alegre, RS",
      experiencia: "6 anos",
      formacao: "Administração",
      salarioPretendido: "R$ 10.000",
      disponibilidade: "60 dias",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Scrum", "Jira", "MS Project", "Liderança"],
      dataAplicacao: "2024-01-12",
      ultimaInteracao: "2024-01-21",
    },
  ]

  const statusColors: Record<string, string> = {
    novo: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    triagem: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    entrevista: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    teste: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    aprovado: "bg-green-500/10 text-green-400 border-green-500/20",
    reprovado: "bg-red-500/10 text-red-400 border-red-500/20",
  }

  const statusLabels: Record<string, string> = {
    novo: "Novo",
    triagem: "Triagem",
    entrevista: "Entrevista",
    teste: "Teste",
    aprovado: "Aprovado",
    reprovado: "Reprovado",
  }

  const filteredCandidatos = candidatos.filter((candidato) => {
    const matchesSearch =
      candidato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidato.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidato.vaga.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "todos" || candidato.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Gestão de Candidatos
            </h1>
            <p className="text-slate-400 mt-1">Gerencie todos os candidatos do processo seletivo</p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Exportar Lista
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, email ou vaga..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedStatus === "todos" ? "default" : "outline"}
                  onClick={() => setSelectedStatus("todos")}
                  className={
                    selectedStatus === "todos" ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "border-slate-700"
                  }
                >
                  Todos
                </Button>
                <Button
                  variant={selectedStatus === "novo" ? "default" : "outline"}
                  onClick={() => setSelectedStatus("novo")}
                  className={
                    selectedStatus === "novo" ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "border-slate-700"
                  }
                >
                  Novos
                </Button>
                <Button
                  variant={selectedStatus === "entrevista" ? "default" : "outline"}
                  onClick={() => setSelectedStatus("entrevista")}
                  className={
                    selectedStatus === "entrevista" ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "border-slate-700"
                  }
                >
                  Entrevista
                </Button>
                <Button
                  variant={selectedStatus === "aprovado" ? "default" : "outline"}
                  onClick={() => setSelectedStatus("aprovado")}
                  className={
                    selectedStatus === "aprovado" ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "border-slate-700"
                  }
                >
                  Aprovados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidatos List */}
        <div className="grid gap-4">
          {filteredCandidatos.map((candidato) => (
            <Card
              key={candidato.id}
              className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={candidato.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                        {candidato.nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-100">{candidato.nome}</h3>
                          <p className="text-slate-400 text-sm">{candidato.vaga}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={statusColors[candidato.status]}>{statusLabels[candidato.status]}</Badge>
                          <div className="flex items-center gap-1 bg-slate-900/50 px-3 py-1 rounded-full">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-slate-100 font-semibold">{candidato.score}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{candidato.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{candidato.telefone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{candidato.localizacao}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{candidato.experiencia}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {candidato.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                        <div className="flex gap-4 text-sm text-slate-400">
                          <span>Aplicação: {candidato.dataAplicacao}</span>
                          <span>Última interação: {candidato.ultimaInteracao}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 hover:border-cyan-500 bg-transparent"
                            onClick={() => setSelectedCandidate(candidato)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline" className="border-slate-600 bg-transparent">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-800 border-slate-700">
                              <DropdownMenuItem className="text-slate-300">
                                <Calendar className="w-4 h-4 mr-2" />
                                Agendar Entrevista
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-300">
                                <FileText className="w-4 h-4 mr-2" />
                                Enviar Teste
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-green-400">
                                <UserCheck className="w-4 h-4 mr-2" />
                                Aprovar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400">
                                <UserX className="w-4 h-4 mr-2" />
                                Reprovar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-300">
                                <Archive className="w-4 h-4 mr-2" />
                                Arquivar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Candidate Details Modal */}
      <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-100">Perfil do Candidato</DialogTitle>
          </DialogHeader>

          {selectedCandidate && (
            <Tabs defaultValue="geral" className="w-full">
              <TabsList className="bg-slate-900/50 border-slate-700">
                <TabsTrigger value="geral">Geral</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
              </TabsList>

              <TabsContent value="geral" className="space-y-6">
                <div className="flex items-start gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={selectedCandidate.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-2xl">
                      {selectedCandidate.nome
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-100">{selectedCandidate.nome}</h3>
                    <p className="text-slate-400">{selectedCandidate.vaga}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={statusColors[selectedCandidate.status]}>
                        {statusLabels[selectedCandidate.status]}
                      </Badge>
                      <div className="flex items-center gap-1 bg-slate-900/50 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-slate-100 font-semibold">{selectedCandidate.score}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-cyan-400" />
                        <div>
                          <p className="text-xs text-slate-400">Email</p>
                          <p className="text-slate-100">{selectedCandidate.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-cyan-400" />
                        <div>
                          <p className="text-xs text-slate-400">Telefone</p>
                          <p className="text-slate-100">{selectedCandidate.telefone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        <div>
                          <p className="text-xs text-slate-400">Localização</p>
                          <p className="text-slate-100">{selectedCandidate.localizacao}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-xs text-slate-400">Experiência</p>
                          <p className="text-slate-100">{selectedCandidate.experiencia}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-xs text-slate-400">Formação</p>
                          <p className="text-slate-100">{selectedCandidate.formacao}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-xs text-slate-400">Salário Pretendido</p>
                          <p className="text-slate-100">{selectedCandidate.salarioPretendido}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Habilidades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map((skill: string, index: number) => (
                        <Badge
                          key={index}
                          className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <div className="space-y-4">
                  {[
                    { data: "22/01/2024", evento: "Proposta enviada", tipo: "success" },
                    { data: "20/01/2024", evento: "Entrevista técnica realizada", tipo: "info" },
                    { data: "18/01/2024", evento: "Teste técnico aprovado", tipo: "success" },
                    { data: "16/01/2024", evento: "Teste técnico enviado", tipo: "info" },
                    { data: "15/01/2024", evento: "Candidatura recebida", tipo: "info" },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${item.tipo === "success" ? "bg-green-500" : "bg-cyan-500"}`}
                        />
                        {index < 4 && <div className="w-0.5 h-12 bg-slate-700" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-slate-100 font-medium">{item.evento}</p>
                        <p className="text-slate-400 text-sm">{item.data}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="avaliacoes" className="space-y-4">
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Avaliação Técnica</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300">Conhecimento Técnico</span>
                        <span className="text-cyan-400 font-semibold">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300">Comunicação</span>
                        <span className="text-cyan-400 font-semibold">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300">Resolução de Problemas</span>
                        <span className="text-cyan-400 font-semibold">88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documentos" className="space-y-4">
                <div className="space-y-2">
                  {[
                    { nome: "Currículo.pdf", tamanho: "245 KB", data: "15/01/2024" },
                    { nome: "Carta de Apresentação.pdf", tamanho: "128 KB", data: "15/01/2024" },
                    { nome: "Certificados.pdf", tamanho: "892 KB", data: "15/01/2024" },
                  ].map((doc, index) => (
                    <Card
                      key={index}
                      className="bg-slate-900/50 border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer"
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-cyan-400" />
                          <div>
                            <p className="text-slate-100 font-medium">{doc.nome}</p>
                            <p className="text-slate-400 text-sm">
                              {doc.tamanho} • {doc.data}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-slate-600 bg-transparent">
                          <Download className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
