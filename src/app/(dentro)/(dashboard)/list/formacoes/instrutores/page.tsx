"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Star, Mail, Phone, Award, BookOpen, Users } from "lucide-react"

export default function InstrutoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState("todos")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const instrutores = [
    {
      id: 1,
      nome: "Dr. Carlos Silva",
      tipo: "Interno",
      especialidade: "Liderança e Gestão",
      email: "carlos.silva@empresa.com",
      telefone: "(11) 98765-4321",
      avaliacaoMedia: 4.8,
      totalFormacoes: 24,
      totalAlunos: 340,
      certificacoes: ["MBA em Gestão", "Coach Executivo", "PMP"],
      status: "Ativo",
      foto: "/instrutor.jpg",
    },
    {
      id: 2,
      nome: "Profa. Ana Costa",
      tipo: "Externo",
      especialidade: "Tecnologia e Inovação",
      email: "ana.costa@consultoria.com",
      telefone: "(11) 91234-5678",
      avaliacaoMedia: 4.9,
      totalFormacoes: 18,
      totalAlunos: 280,
      certificacoes: ["PhD em Ciência da Computação", "Scrum Master", "AWS Certified"],
      status: "Ativo",
      foto: "/instrutora.jpg",
    },
    {
      id: 3,
      nome: "Roberto Mendes",
      tipo: "Interno",
      especialidade: "Vendas e Negociação",
      email: "roberto.mendes@empresa.com",
      telefone: "(11) 99876-5432",
      avaliacaoMedia: 4.7,
      totalFormacoes: 32,
      totalAlunos: 450,
      certificacoes: ["Especialista em Vendas", "Negociação Avançada"],
      status: "Ativo",
      foto: "/instrutor-vendas.jpg",
    },
    {
      id: 4,
      nome: "Dra. Mariana Oliveira",
      tipo: "Externo",
      especialidade: "Desenvolvimento Pessoal",
      email: "mariana@coaching.com",
      telefone: "(11) 97654-3210",
      avaliacaoMedia: 5.0,
      totalFormacoes: 15,
      totalAlunos: 200,
      certificacoes: ["Psicóloga", "Coach ICC", "Mentora Executiva"],
      status: "Ativo",
      foto: "/instrutora-coach.jpg",
    },
  ]

  const filteredInstrutores = instrutores.filter((instrutor) => {
    const matchesSearch =
      instrutor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instrutor.especialidade.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filterTipo === "todos" || instrutor.tipo.toLowerCase() === filterTipo.toLowerCase()
    return matchesSearch && matchesTipo
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestão de Instrutores</h1>
            <p className="text-slate-400">Gerencie instrutores internos e externos</p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Instrutor
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Instrutor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <Input className="bg-slate-700 border-slate-600" placeholder="Nome do instrutor" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="interno">Interno</SelectItem>
                        <SelectItem value="externo">Externo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Especialidade</Label>
                  <Input className="bg-slate-700 border-slate-600" placeholder="Área de especialização" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" className="bg-slate-700 border-slate-600" placeholder="email@exemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input className="bg-slate-700 border-slate-600" placeholder="(00) 00000-0000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Certificações</Label>
                  <Textarea
                    className="bg-slate-700 border-slate-600"
                    placeholder="Liste as certificações (uma por linha)"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Biografia</Label>
                  <Textarea
                    className="bg-slate-700 border-slate-600"
                    placeholder="Breve descrição profissional"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    Salvar Instrutor
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
                  <p className="text-3xl font-bold text-white mt-1">24</p>
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
                  <p className="text-3xl font-bold text-white mt-1">16</p>
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
                  <p className="text-3xl font-bold text-white mt-1">8</p>
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
                  <p className="text-3xl font-bold text-white mt-1">4.8</p>
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
                />
              </div>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Instrutores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInstrutores.map((instrutor) => (
            <Card
              key={instrutor.id}
              className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img
                    src={instrutor.foto || "/placeholder.svg"}
                    alt={instrutor.nome}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white">{instrutor.nome}</h3>
                        <p className="text-cyan-400 text-sm">{instrutor.especialidade}</p>
                      </div>
                      <Badge
                        className={
                          instrutor.tipo === "Interno"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-purple-500/20 text-purple-400"
                        }
                      >
                        {instrutor.tipo}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-semibold">{instrutor.avaliacaoMedia}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{instrutor.totalFormacoes} formações</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{instrutor.totalAlunos} alunos</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{instrutor.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{instrutor.telefone}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-slate-500 mb-1">Certificações:</p>
                      <div className="flex flex-wrap gap-1">
                        {instrutor.certificacoes.map((cert, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-slate-600 text-slate-300">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      >
                        Ver Perfil
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 bg-transparent">
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
