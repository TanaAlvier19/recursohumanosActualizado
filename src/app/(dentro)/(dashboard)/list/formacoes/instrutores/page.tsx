"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Star, Mail, Phone, Award, BookOpen, Users } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { fetchAPI } from "@/lib/api"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

type Instrutor = {
  id: string | number
  nome: string
  tipo: string
  especialidade?: string
  email?: string
  telefone?: string
  avaliacaoMedia?: number
  totalFormacoes?: number
  totalAlunos?: number
  certificacoes?: string[]
  status?: string
  foto?: string
  bio?: string
}

export default function InstrutoresPage(): JSX.Element {
  const { toast } = useToast()

  // UI states
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterTipo, setFilterTipo] = useState<string>("todos")
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [instrutores, setInstrutores] = useState<Instrutor[]>([])

  const [novoInstrutorForm, setNovoInstrutorForm] = useState({
    nome: "",
    tipo: "INTERNO",
    especialidade: "",
    email: "",
    telefone: "",
    certificacoesTexto: "",
    bio: "",
    fotoUrl: "",
  })

  const MOCK_INSTRUTORES: Instrutor[] = [
    {
      id: 1,
      nome: "Dr. Carlos Silva",
      tipo: "INTERNO",
      especialidade: "Liderança e Gestão",
      email: "carlos.silva@empresa.com",
      telefone: "(11) 98765-4321",
      avaliacaoMedia: 4.8,
      totalFormacoes: 24,
      totalAlunos: 340,
      certificacoes: ["MBA em Gestão", "Coach Executivo", "PMP"],
      status: "Ativo",
      foto: "/professional-instructor.png",
    },
    {
      id: 2,
      nome: "Profa. Ana Costa",
      tipo: "EXTERNO",
      especialidade: "Tecnologia e Inovação",
      email: "ana.costa@consultoria.com",
      telefone: "(11) 91234-5678",
      avaliacaoMedia: 4.9,
      totalFormacoes: 18,
      totalAlunos: 280,
      certificacoes: ["PhD em Ciência da Computação", "Scrum Master", "AWS Certified"],
      status: "Ativo",
      foto: "/female-instructor.png",
    },
  ]

  const fetchInstrutores = async () => {
    setIsLoading(true)
    try {
      const data = await fetchAPI(`/instrutores/`, {
        method: "GET",
      })

      // Normaliza formato (pode vir em data.results ou data)
      const list: any[] = Array.isArray(data) ? data : (data?.results ?? [])
      const mapped: Instrutor[] = list.map((i: any) => ({
        id: i.id ?? i.pk ?? i._id,
        nome: i.nome ?? i.name ?? i.titulo ?? "Sem nome",
        tipo: i.tipo ?? "INTERNO",
        especialidade: i.especialidade ?? i.specialty ?? "",
        email: i.email ?? "",
        telefone: i.telefone ?? i.phone ?? "",
        avaliacaoMedia: Number(i.avaliacao_media ?? i.rating ?? 0),
        totalFormacoes: Number(i.total_formacoes ?? i.courses ?? 0),
        totalAlunos: Number(i.total_alunos ?? i.students ?? 0),
        certificacoes: i.certificacoes ?? i.certificates ?? [],
        status: i.status ?? "Ativo",
        foto: i.foto ?? i.avatar ?? "",
        bio: i.bio ?? i.descricao ?? "",
      }))
      setInstrutores(mapped)
    } catch (err) {
      console.error("Erro ao buscar instrutores:", err)
      toast({
        title: "Erro",
        description: "Não foi possível carregar instrutores. Usando dados locais.",
        variant: "destructive",
      })
      setInstrutores(MOCK_INSTRUTORES)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInstrutores()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filtragem
  const filteredInstrutores = instrutores.filter((instrutor) => {
    const q = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !q || instrutor.nome.toLowerCase().includes(q) || (instrutor.especialidade ?? "").toLowerCase().includes(q)
    const matchesTipo = filterTipo === "todos" || instrutor.tipo.toUpperCase() === filterTipo.toUpperCase()
    return matchesSearch && matchesTipo
  })

  // Helpers: valida email
  const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email)

  const handleSalvarInstrutor = async () => {
    if (!novoInstrutorForm.nome.trim()) {
      toast({ title: "Preencha o nome", variant: "destructive" })
      return
    }
    if (!novoInstrutorForm.tipo) {
      toast({ title: "Selecione o tipo", variant: "destructive" })
      return
    }
    if (novoInstrutorForm.email && !isValidEmail(novoInstrutorForm.email)) {
      toast({ title: "Email inválido", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        nome: novoInstrutorForm.nome.trim(),
        tipo: novoInstrutorForm.tipo,
        especialidade: novoInstrutorForm.especialidade.trim() || null,
        email: novoInstrutorForm.email.trim() || null,
        telefone: novoInstrutorForm.telefone.trim() || null,
        certificacoes: novoInstrutorForm.certificacoesTexto
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        bio: novoInstrutorForm.bio.trim() || null,
        foto: novoInstrutorForm.fotoUrl || null,
      }

      await fetchAPI(`/instrutores/`, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      // sucesso
      toast({ title: "Sucesso", description: "Instrutor criado com sucesso!" })
      setIsAddModalOpen(false)
      // limpa formulário
      setNovoInstrutorForm({
        nome: "",
        tipo: "INTERNO",
        especialidade: "",
        email: "",
        telefone: "",
        certificacoesTexto: "",
        bio: "",
        fotoUrl: "",
      })
      // refetch
      await fetchInstrutores()
    } catch (err) {
      console.error("Erro ao criar instrutor:", err)
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Falha ao criar instrutor.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestão de Instrutores</h1>
            <p className="text-slate-400">Gerencie instrutores internos e externos</p>
          </div>

          <div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              aria-label="Adicionar Instrutor"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Instrutor
            </Button>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Instrutor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={novoInstrutorForm.nome}
                      onChange={(e) => setNovoInstrutorForm((s) => ({ ...s, nome: e.target.value }))}
                      className="bg-slate-700 border-slate-600"
                      placeholder="Nome do instrutor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select
                      value={novoInstrutorForm.tipo}
                      onValueChange={(value) => setNovoInstrutorForm((s) => ({ ...s, tipo: value }))}
                    >
                      <SelectTrigger id="tipo" className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="INTERNO">Interno</SelectItem>
                        <SelectItem value="EXTERNO">Externo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="especialidade">Especialidade</Label>
                  <Input
                    id="especialidade"
                    value={novoInstrutorForm.especialidade}
                    onChange={(e) => setNovoInstrutorForm((s) => ({ ...s, especialidade: e.target.value }))}
                    className="bg-slate-700 border-slate-600"
                    placeholder="Área de especialização"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={novoInstrutorForm.email}
                      onChange={(e) => setNovoInstrutorForm((s) => ({ ...s, email: e.target.value }))}
                      className="bg-slate-700 border-slate-600"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={novoInstrutorForm.telefone}
                      onChange={(e) => setNovoInstrutorForm((s) => ({ ...s, telefone: e.target.value }))}
                      className="bg-slate-700 border-slate-600"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificacoes">Certificações</Label>
                  <Textarea
                    id="certificacoes"
                    value={novoInstrutorForm.certificacoesTexto}
                    onChange={(e) => setNovoInstrutorForm((s) => ({ ...s, certificacoesTexto: e.target.value }))}
                    className="bg-slate-700 border-slate-600"
                    placeholder="Liste as certificações (uma por linha)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={novoInstrutorForm.bio}
                    onChange={(e) => setNovoInstrutorForm((s) => ({ ...s, bio: e.target.value }))}
                    className="bg-slate-700 border-slate-600"
                    placeholder="Breve descrição profissional"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fotoUrl">URL da Foto (opcional)</Label>
                  <Input
                    id="fotoUrl"
                    value={novoInstrutorForm.fotoUrl}
                    onChange={(e) => setNovoInstrutorForm((s) => ({ ...s, fotoUrl: e.target.value }))}
                    className="bg-slate-700 border-slate-600"
                    placeholder="/imagens/meu-instrutor.jpg ou https://..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    onClick={handleSalvarInstrutor}
                    disabled={isSubmitting}
                    aria-label="Salvar Instrutor"
                  >
                    {isSubmitting ? "Salvando..." : "Salvar Instrutor"}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsAddModalOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Instrutores</p>
                  <p className="text-3xl font-bold text-white mt-1">{instrutores.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Internos</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {instrutores.filter((i) => i.tipo.toUpperCase() === "INTERNO").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Externos</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {instrutores.filter((i) => i.tipo.toUpperCase() === "EXTERNO").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avaliação Média</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {(
                      instrutores.reduce((acc, cur) => acc + (Number(cur.avaliacaoMedia) || 0), 0) /
                      Math.max(1, instrutores.length)
                    ).toFixed(1)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou especialidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                  aria-label="Buscar instrutor"
                />
              </div>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="INTERNO">Interno</SelectItem>
                  <SelectItem value="EXTERNO">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Instrutores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading && instrutores.length === 0 ? (
            <div className="text-slate-400 p-6">Carregando instrutores...</div>
          ) : filteredInstrutores.length === 0 ? (
            <div className="text-slate-400 p-6">Nenhum instrutor encontrado.</div>
          ) : (
            filteredInstrutores.map((instrutor) => (
              <Card
                key={instrutor.id}
                className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={instrutor.foto || "/placeholder.svg?height=96&width=96&query=instructor"}
                        alt={instrutor.nome}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-bold text-white truncate">{instrutor.nome}</h3>
                          <p className="text-cyan-400 text-sm truncate">{instrutor.especialidade}</p>
                        </div>
                        <Badge
                          className={
                            instrutor.tipo.toUpperCase() === "INTERNO"
                              ? "bg-green-500/20 text-green-400 ml-2 flex-shrink-0"
                              : "bg-purple-500/20 text-purple-400 ml-2 flex-shrink-0"
                          }
                        >
                          {instrutor.tipo}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          <span className="text-white font-semibold">{instrutor.avaliacaoMedia ?? "-"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4 flex-shrink-0" />
                          <span>{instrutor.totalFormacoes ?? 0} formações</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 flex-shrink-0" />
                          <span>{instrutor.totalAlunos ?? 0} alunos</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-400 mb-3 flex-wrap">
                        {instrutor.email && (
                          <div className="flex items-center gap-1 min-w-0">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{instrutor.email}</span>
                          </div>
                        )}
                        {instrutor.telefone && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Phone className="w-4 h-4" />
                            <span>{instrutor.telefone}</span>
                          </div>
                        )}
                      </div>

                      {instrutor.certificacoes && instrutor.certificacoes.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-slate-500 mb-1">Certificações:</p>
                          <div className="flex flex-wrap gap-1">
                            {instrutor.certificacoes.map((cert, idx) => (
                              <Badge
                                key={`${instrutor.id}-cert-${idx}`}
                                variant="outline"
                                className="text-xs border-slate-600 text-slate-300"
                              >
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                          onClick={() => {
                            toast({ title: "Ver perfil", description: `Abrir perfil de ${instrutor.nome}` })
                          }}
                        >
                          Ver Perfil
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 bg-transparent"
                          onClick={() => {
                            setNovoInstrutorForm({
                              nome: instrutor.nome ?? "",
                              tipo: instrutor.tipo?.toUpperCase() === "INTERNO" ? "INTERNO" : "EXTERNO",
                              especialidade: instrutor.especialidade ?? "",
                              email: instrutor.email ?? "",
                              telefone: instrutor.telefone ?? "",
                              certificacoesTexto: (instrutor.certificacoes ?? []).join("\n"),
                              bio: instrutor.bio ?? "",
                              fotoUrl: instrutor.foto ?? "",
                            })
                            setIsAddModalOpen(true)
                          }}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
