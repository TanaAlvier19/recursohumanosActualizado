"use client"

import { useState, useEffect, useCallback } from "react"
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
  Trash2,
  Download,
  User,
  Calendar,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Swal from "sweetalert2"

interface Teste {
  id: string
  aplicacao: string
  aplicacao_nome?: string
  tipo: string
  titulo: string
  descricao: string
  link: string
  status: string
  nota: number | null
  data_envio: string
  data_conclusao: string | null
  prazo: string | null
}

interface Aplicacao {
  id: string
  candidato_nome: string
  vaga_titulo: string
  status: string
}

interface ResultadoTeste {
  id: string
  candidato: string
  vaga: string
  teste: string
  score: number
  status: string
  tempo: number
  dataRealizacao: string
}

export default function TestesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState("todos")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
  const [selectedTeste, setSelectedTeste] = useState<Teste | null>(null)
  const [loading, setLoading] = useState(true)
  const [testes, setTestes] = useState<Teste[]>([])
  const [aplicacoes, setAplicacoes] = useState<Aplicacao[]>([])
  const [resultados, setResultados] = useState<ResultadoTeste[]>([])

  const [formData, setFormData] = useState({
    aplicacao: "",
    tipo: "TECNICO",
    titulo: "",
    descricao: "",
    link: "",
    prazo: "",
  })

  const [sendFormData, setSendFormData] = useState({
    teste: "",
    aplicacoes: [] as string[],
    mensagem: "",
  })

  const fetchTestes = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("https://avdserver.up.railway.app/testes/", {
        credentials: "include"
      })

      if (!response.ok) throw new Error("Erro ao buscar testes")

      const data = await response.json()
      setTestes(data)
    } catch (error) {
      console.error("Erro ao buscar testes:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível carregar os testes",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAplicacoes = useCallback(async () => {
    try {
      const response = await fetch("https://avdserver.up.railway.app/aplicacoes/", {
        credentials: "include"
      })

      if (response.ok) {
        const data = await response.json()
        setAplicacoes(data)
      }
    } catch (error) {
      console.error("Erro ao buscar aplicações:", error)
    }
  }, [])

  const fetchResultados = useCallback(async () => {
    try {
      const response = await fetch("https://avdserver.up.railway.app/testes/?status=CONCLUIDO", {
        credentials: "include"
      })

      if (response.ok) {
        const data = await response.json()
        const resultadosFormatados: ResultadoTeste[] = data.map((teste: Teste) => ({
          id: teste.id,
          candidato: teste.aplicacao_nome || "Candidato",
          vaga: "Vaga", // Você pode ajustar para buscar da aplicação
          teste: teste.titulo,
          score: teste.nota || 0,
          status: teste.nota && teste.nota >= 7 ? "Aprovado" : "Reprovado",
          tempo: 60, // Tempo padrão ou você pode calcular
          dataRealizacao: teste.data_conclusao || teste.data_envio,
        }))
        setResultados(resultadosFormatados)
      }
    } catch (error) {
      console.error("Erro ao buscar resultados:", error)
    }
  }, [])

  useEffect(() => {
    fetchTestes()
    fetchAplicacoes()
  }, [fetchTestes, fetchAplicacoes])

  const handleCreateTeste = async () => {
    try {
      if (!formData.titulo || !formData.aplicacao) {
        Swal.fire({
          title: "Campos obrigatórios",
          text: "Preencha título e selecione uma aplicação",
          icon: "warning",
          background: "#1e293b",
          color: "white",
        })
        return
      }

      const testeData = {
        ...formData,
        status: "PENDENTE",
        prazo: formData.prazo || null,
      }

      const response = await fetch("https://avdserver.up.railway.app/testes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(testeData),
      })

      if (!response.ok) throw new Error("Erro ao criar teste")

      Swal.fire({
        title: "Sucesso!",
        text: "Teste criado com sucesso",
        icon: "success",
        background: "#1e293b",
        color: "white",
        timer: 2000,
        showConfirmButton: false,
      })

      setIsCreateModalOpen(false)
      resetForm()
      fetchTestes()
    } catch (error) {
      console.error("Erro ao criar teste:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível criar o teste",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    }
  }

  const handleSendTeste = async () => {
    try {
      if (!sendFormData.teste || sendFormData.aplicacoes.length === 0) {
        Swal.fire({
          title: "Campos obrigatórios",
          text: "Selecione um teste e pelo menos uma aplicação",
          icon: "warning",
          background: "#1e293b",
          color: "white",
        })
        return
      }

      const promises = sendFormData.aplicacoes.map(aplicacaoId =>
        fetch("https://avdserver.up.railway.app/testes/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            aplicacao: aplicacaoId,
            tipo: testes.find(t => t.id === sendFormData.teste)?.tipo,
            titulo: testes.find(t => t.id === sendFormData.teste)?.titulo,
            descricao: testes.find(t => t.id === sendFormData.teste)?.descricao,
            link: testes.find(t => t.id === sendFormData.teste)?.link,
            status: "PENDENTE",
          }),
        })
      )

      await Promise.all(promises)

      Swal.fire({
        title: "Sucesso!",
        text: `Teste enviado para ${sendFormData.aplicacoes.length} candidatos`,
        icon: "success",
        background: "#1e293b",
        color: "white",
        timer: 2000,
        showConfirmButton: false,
      })

      setIsSendModalOpen(false)
      resetSendForm()
      fetchTestes()
    } catch (error) {
      console.error("Erro ao enviar teste:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível enviar o teste",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    }
  }

  const handleConcluirTeste = async (testeId: string, nota: number) => {
    try {
      const response = await fetch(`https://avdserver.up.railway.app/testes/${testeId}/concluir/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ nota }),
      })

      if (!response.ok) throw new Error("Erro ao concluir teste")

      Swal.fire({
        title: "Sucesso!",
        text: "Teste concluído com sucesso",
        icon: "success",
        background: "#1e293b",
        color: "white",
        timer: 2000,
        showConfirmButton: false,
      })

      fetchTestes()
      fetchResultados()
    } catch (error) {
      console.error("Erro ao concluir teste:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível concluir o teste",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    }
  }

  const handleDeleteTeste = async (testeId: string) => {
    const result = await Swal.fire({
      title: "Confirmar exclusão",
      text: "Tem certeza que deseja excluir este teste?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      background: "#1e293b",
      color: "white",
    })

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://avdserver.up.railway.app/testes/${testeId}/`, {
          method: "DELETE",
          credentials: "include",
        })

        if (!response.ok) throw new Error("Erro ao excluir teste")

        Swal.fire({
          title: "Sucesso!",
          text: "Teste excluído com sucesso",
          icon: "success",
          background: "#1e293b",
          color: "white",
          timer: 2000,
          showConfirmButton: false,
        })

        fetchTestes()
      } catch (error) {
        console.error("Erro ao excluir teste:", error)
        Swal.fire({
          title: "Erro",
          text: "Não foi possível excluir o teste",
          icon: "error",
          background: "#1e293b",
          color: "white",
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      aplicacao: "",
      tipo: "TECNICO",
      titulo: "",
      descricao: "",
      link: "",
      prazo: "",
    })
  }

  const resetSendForm = () => {
    setSendFormData({
      teste: "",
      aplicacoes: [],
      mensagem: "",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "EM_ANDAMENTO":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "CONCLUIDO":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "EXPIRADO":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "TECNICO":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
      case "LOGICA":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "IDIOMA":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "PERSONALIDADE":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "TECNICO":
        return Code
      case "LOGICA":
        return Brain
      case "IDIOMA":
        return Languages
      case "PERSONALIDADE":
        return User
      default:
        return FileText
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "TECNICO":
        return "Técnico"
      case "LOGICA":
        return "Lógica"
      case "IDIOMA":
        return "Idioma"
      case "PERSONALIDADE":
        return "Personalidade"
      default:
        return tipo
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "Pendente"
      case "EM_ANDAMENTO":
        return "Em Andamento"
      case "CONCLUIDO":
        return "Concluído"
      case "EXPIRADO":
        return "Expirado"
      default:
        return status
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

  // Filtrar testes
  const filteredTestes = testes.filter((teste) => {
    const matchesSearch = teste.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filterTipo === "todos" || teste.tipo === filterTipo
    const matchesStatus = filterStatus === "todos" || teste.status === filterStatus
    return matchesSearch && matchesTipo && matchesStatus
  })

  // Estatísticas
  const stats = {
    totalTestes: testes.length,
    testesEnviados: testes.filter(t => t.status !== "PENDENTE").length,
    testesConcluidos: testes.filter(t => t.status === "CONCLUIDO").length,
    mediaGeral: testes.filter(t => t.nota).reduce((acc, t) => acc + (t.nota || 0), 0) / (testes.filter(t => t.nota).length || 1),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-20 w-full bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full bg-slate-800" />
            ))}
          </div>
          <Skeleton className="h-96 w-full bg-slate-800" />
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
            <h1 className="text-3xl font-bold text-white mb-2">Testes Técnicos</h1>
            <p className="text-slate-400">Gerencie testes e avalie resultados dos candidatos</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isSendModalOpen} onOpenChange={setIsSendModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-slate-600 hover:bg-slate-700 bg-transparent">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Teste
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Enviar Teste para Candidatos</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Selecione o teste e os candidatos que receberão o teste
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Teste</Label>
                    <Select value={sendFormData.teste} onValueChange={(value) => setSendFormData({ ...sendFormData, teste: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Selecione um teste" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {testes.map((teste) => (
                          <SelectItem key={teste.id} value={teste.id}>
                            {teste.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Candidatos</Label>
                    <Select
                      value={sendFormData.aplicacoes[0] || ""}
                      onValueChange={(value) => {
                        if (!sendFormData.aplicacoes.includes(value)) {
                          setSendFormData({
                            ...sendFormData,
                            aplicacoes: [...sendFormData.aplicacoes, value]
                          })
                        }
                      }}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Selecione os candidatos" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {aplicacoes.map((app) => (
                          <SelectItem key={app.id} value={app.id}>
                            {app.candidato_nome} - {app.vaga_titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {sendFormData.aplicacoes.map(appId => {
                        const app = aplicacoes.find(a => a.id === appId)
                        return app ? (
                          <Badge key={appId} className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                            {app.candidato_nome}
                            <button
                              onClick={() => setSendFormData({
                                ...sendFormData,
                                aplicacoes: sendFormData.aplicacoes.filter(id => id !== appId)
                              })}
                              className="ml-1 hover:text-cyan-300"
                            >
                              ×
                            </button>
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                  <div>
                    <Label>Mensagem (Opcional)</Label>
                    <Textarea
                      placeholder="Instruções ou mensagem personalizada para os candidatos..."
                      className="bg-slate-700 border-slate-600 min-h-[100px]"
                      value={sendFormData.mensagem}
                      onChange={(e) => setSendFormData({ ...sendFormData, mensagem: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsSendModalOpen(false)}
                      className="border-slate-600 hover:bg-slate-700"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      onClick={handleSendTeste}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Testes
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

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
                    <Label>Título do Teste *</Label>
                    <Input 
                      placeholder="Ex: Teste de Lógica de Programação" 
                      className="bg-slate-700 border-slate-600"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo *</Label>
                      <Select 
                        value={formData.tipo} 
                        onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="TECNICO">Técnico</SelectItem>
                          <SelectItem value="LOGICA">Lógica</SelectItem>
                          <SelectItem value="IDIOMA">Idioma</SelectItem>
                          <SelectItem value="PERSONALIDADE">Personalidade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Aplicação *</Label>
                      <Select 
                        value={formData.aplicacao} 
                        onValueChange={(value) => setFormData({ ...formData, aplicacao: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue placeholder="Selecione a aplicação" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {aplicacoes.map((app) => (
                            <SelectItem key={app.id} value={app.id}>
                              {app.candidato_nome} - {app.vaga_titulo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Link do Teste</Label>
                      <Input 
                        placeholder="https://exemplo.com/teste" 
                        className="bg-slate-700 border-slate-600"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Prazo</Label>
                      <Input 
                        type="datetime-local"
                        className="bg-slate-700 border-slate-600"
                        value={formData.prazo}
                        onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      placeholder="Descreva o objetivo e conteúdo do teste..."
                      className="bg-slate-700 border-slate-600 min-h-[100px]"
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
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
                    <Button 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      onClick={handleCreateTeste}
                    >
                      Criar Teste
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Testes Totais</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalTestes}</p>
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
                <p className="text-2xl font-bold text-white mt-1">{stats.testesEnviados}</p>
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
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.totalTestes > 0 ? Math.round((stats.testesConcluidos / stats.totalTestes) * 100) : 0}%
                </p>
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
                <p className="text-2xl font-bold text-white mt-1">{stats.mediaGeral.toFixed(1)}</p>
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
                    <SelectItem value="TECNICO">Técnico</SelectItem>
                    <SelectItem value="LOGICA">Lógica</SelectItem>
                    <SelectItem value="IDIOMA">Idioma</SelectItem>
                    <SelectItem value="PERSONALIDADE">Personalidade</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[200px] bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                    <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                    <SelectItem value="EXPIRADO">Expirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Testes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTestes.map((teste) => {
                const Icon = getTipoIcon(teste.tipo)
                return (
                  <Card
                    key={teste.id}
                    className="bg-slate-800/50 border-slate-700 p-6 hover:border-cyan-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{teste.titulo}</h3>
                          <p className="text-slate-400 text-sm">{teste.aplicacao_nome || "Candidato"}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Badge className={getTipoColor(teste.tipo)}>{getTipoLabel(teste.tipo)}</Badge>
                        <Badge className={getStatusColor(teste.status)}>{getStatusLabel(teste.status)}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-slate-400 text-xs">Data Envio</p>
                        <p className="text-white text-sm font-medium">
                          {new Date(teste.data_envio).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Prazo</p>
                        <p className="text-white text-sm font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {teste.prazo ? new Date(teste.prazo).toLocaleDateString("pt-BR") : "Sem prazo"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Nota</p>
                        <p className="text-white text-sm font-medium">
                          {teste.nota ? `${teste.nota}/10` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Link</p>
                        <p className="text-white text-sm font-medium truncate">
                          {teste.link ? (
                            <a href={teste.link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                              Acessar
                            </a>
                          ) : "N/A"}
                        </p>
                      </div>
                    </div>

                    {teste.descricao && (
                      <div className="mb-4">
                        <p className="text-slate-400 text-xs mb-1">Descrição</p>
                        <p className="text-slate-300 text-sm line-clamp-2">{teste.descricao}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 hover:bg-slate-700 bg-transparent"
                        onClick={() => setSelectedTeste(teste)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detalhes
                      </Button>
                      {teste.status === "CONCLUIDO" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 hover:bg-slate-700 bg-transparent"
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(teste))}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 hover:bg-slate-700 bg-transparent"
                          onClick={() => {
                            const nota = prompt("Digite a nota do teste (0-10):")
                            if (nota && !isNaN(parseFloat(nota))) {
                              handleConcluirTeste(teste.id, parseFloat(nota))
                            }
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:bg-slate-700 bg-transparent"
                        onClick={() => handleDeleteTeste(teste.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>

            {filteredTestes.length === 0 && (
              <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Nenhum teste encontrado</p>
              </Card>
            )}
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
                <Button variant="outline" className="border-slate-600 hover:bg-slate-700 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
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
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 hover:bg-slate-700 bg-transparent"
                            >
                              <Download className="w-4 h-4" />
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

      {/* Modal de Detalhes do Teste */}
      <Dialog open={!!selectedTeste} onOpenChange={() => setSelectedTeste(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Teste</DialogTitle>
            <DialogDescription className="text-slate-400">
              Informações completas sobre o teste
            </DialogDescription>
          </DialogHeader>
          {selectedTeste && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Título</Label>
                  <p className="text-white font-medium">{selectedTeste.titulo}</p>
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Badge className={getTipoColor(selectedTeste.tipo)}>{getTipoLabel(selectedTeste.tipo)}</Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedTeste.status)}>{getStatusLabel(selectedTeste.status)}</Badge>
                </div>
                <div>
                  <Label>Nota</Label>
                  <p className="text-white font-medium">{selectedTeste.nota ? `${selectedTeste.nota}/10` : "N/A"}</p>
                </div>
                <div>
                  <Label>Data de Envio</Label>
                  <p className="text-white">{new Date(selectedTeste.data_envio).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <Label>Data de Conclusão</Label>
                  <p className="text-white">
                    {selectedTeste.data_conclusao 
                      ? new Date(selectedTeste.data_conclusao).toLocaleDateString("pt-BR")
                      : "N/A"
                    }
                  </p>
                </div>
              </div>
              {selectedTeste.descricao && (
                <div>
                  <Label>Descrição</Label>
                  <p className="text-slate-300 mt-1">{selectedTeste.descricao}</p>
                </div>
              )}
              {selectedTeste.link && (
                <div>
                  <Label>Link do Teste</Label>
                  <a 
                    href={selectedTeste.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 block mt-1"
                  >
                    {selectedTeste.link}
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}