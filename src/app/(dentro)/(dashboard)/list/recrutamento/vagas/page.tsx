"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Briefcase,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  MapPin,
  DollarSign,
  Target,
  MoreVertical,
  Copy,
  Archive,
  Share2,
  Download,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function VagasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedDepartamento, setSelectedDepartamento] = useState("todos")
  const [selectedStatus, setSelectedStatus] = useState("todos")

  const vagas = [
    {
      id: 1,
      titulo: "Desenvolvedor Full Stack Senior",
      departamento: "Tecnologia",
      localizacao: "Remoto",
      tipo: "CLT",
      nivel: "Senior",
      salario: "R$ 12.000 - R$ 18.000",
      candidatos: 45,
      status: "Ativa",
      prioridade: "Alta",
      dataAbertura: "2024-01-15",
      dataFechamento: "2024-02-15",
      descricao: "Buscamos desenvolvedor full stack com experiência em React e Node.js",
      requisitos: ["React", "Node.js", "TypeScript", "PostgreSQL"],
      vagas: 2,
    },
    {
      id: 2,
      titulo: "Analista de Marketing Digital",
      departamento: "Marketing",
      localizacao: "São Paulo - SP",
      tipo: "CLT",
      nivel: "Pleno",
      salario: "R$ 6.000 - R$ 9.000",
      candidatos: 32,
      status: "Ativa",
      prioridade: "Média",
      dataAbertura: "2024-01-18",
      dataFechamento: "2024-02-18",
      descricao: "Profissional para gerenciar campanhas digitais e redes sociais",
      requisitos: ["Google Ads", "Facebook Ads", "SEO", "Analytics"],
      vagas: 1,
    },
    {
      id: 3,
      titulo: "Gerente de Vendas",
      departamento: "Comercial",
      localizacao: "Híbrido - SP",
      tipo: "CLT",
      nivel: "Senior",
      salario: "R$ 10.000 - R$ 15.000",
      candidatos: 28,
      status: "Em Análise",
      prioridade: "Alta",
      dataAbertura: "2024-01-20",
      dataFechamento: "2024-02-20",
      descricao: "Liderar equipe de vendas e desenvolver estratégias comerciais",
      requisitos: ["Gestão de Equipes", "Vendas B2B", "CRM", "Negociação"],
      vagas: 1,
    },
    {
      id: 4,
      titulo: "Designer UX/UI",
      departamento: "Produto",
      localizacao: "Remoto",
      tipo: "PJ",
      nivel: "Pleno",
      salario: "R$ 8.000 - R$ 12.000",
      candidatos: 56,
      status: "Ativa",
      prioridade: "Média",
      dataAbertura: "2024-01-22",
      dataFechamento: "2024-02-22",
      descricao: "Criar interfaces intuitivas e experiências memoráveis",
      requisitos: ["Figma", "Design System", "Prototipagem", "User Research"],
      vagas: 1,
    },
    {
      id: 5,
      titulo: "Analista de Dados",
      departamento: "Tecnologia",
      localizacao: "São Paulo - SP",
      tipo: "CLT",
      nivel: "Pleno",
      salario: "R$ 7.000 - R$ 11.000",
      candidatos: 38,
      status: "Ativa",
      prioridade: "Baixa",
      dataAbertura: "2024-01-25",
      dataFechamento: "2024-02-25",
      descricao: "Análise de dados e criação de dashboards estratégicos",
      requisitos: ["SQL", "Python", "Power BI", "Estatística"],
      vagas: 1,
    },
    {
      id: 6,
      titulo: "Coordenador de RH",
      departamento: "Recursos Humanos",
      localizacao: "Híbrido - SP",
      tipo: "CLT",
      nivel: "Pleno",
      salario: "R$ 6.500 - R$ 9.500",
      candidatos: 24,
      status: "Pausada",
      prioridade: "Baixa",
      dataAbertura: "2024-01-10",
      dataFechamento: "2024-02-10",
      descricao: "Coordenar processos de recrutamento e desenvolvimento",
      requisitos: ["Recrutamento", "Treinamento", "Gestão de Pessoas", "Excel"],
      vagas: 1,
    },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Ativa: "bg-green-500/10 text-green-400 border-green-500/20",
      "Em Análise": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      Pausada: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      Fechada: "bg-red-500/10 text-red-400 border-red-500/20",
    }
    return colors[status] || colors.Ativa
  }

  const getPrioridadeColor = (prioridade: string) => {
    const colors: Record<string, string> = {
      Alta: "bg-red-500/10 text-red-400 border-red-500/20",
      Média: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      Baixa: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    }
    return colors[prioridade] || colors.Média
  }

  const filteredVagas = vagas.filter((vaga) => {
    const matchesSearch =
      vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaga.departamento.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartamento = selectedDepartamento === "todos" || vaga.departamento === selectedDepartamento
    const matchesStatus = selectedStatus === "todos" || vaga.status === selectedStatus
    return matchesSearch && matchesDepartamento && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/recrutamento" className="text-sm text-slate-400 hover:text-cyan-400 mb-2 inline-block">
              ← Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Gestão de Vagas
            </h1>
            <p className="text-slate-400 mt-1">Criar e gerenciar vagas de emprego</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-slate-800">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Vaga
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-slate-100">Criar Nova Vaga</DialogTitle>
                  <DialogDescription className="text-slate-400">Preencha as informações da vaga</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="titulo" className="text-slate-200">
                        Título da Vaga *
                      </Label>
                      <Input
                        id="titulo"
                        placeholder="Ex: Desenvolvedor Full Stack"
                        className="bg-slate-800 border-slate-700 text-slate-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departamento" className="text-slate-200">
                        Departamento *
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="tecnologia">Tecnologia</SelectItem>
                          <SelectItem value="comercial">Comercial</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="rh">Recursos Humanos</SelectItem>
                          <SelectItem value="produto">Produto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="nivel" className="text-slate-200">
                        Nível *
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="junior">Júnior</SelectItem>
                          <SelectItem value="pleno">Pleno</SelectItem>
                          <SelectItem value="senior">Sênior</SelectItem>
                          <SelectItem value="especialista">Especialista</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo" className="text-slate-200">
                        Tipo de Contrato *
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="clt">CLT</SelectItem>
                          <SelectItem value="pj">PJ</SelectItem>
                          <SelectItem value="estagio">Estágio</SelectItem>
                          <SelectItem value="temporario">Temporário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vagas" className="text-slate-200">
                        Nº de Vagas *
                      </Label>
                      <Input
                        id="vagas"
                        type="number"
                        placeholder="1"
                        className="bg-slate-800 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="localizacao" className="text-slate-200">
                        Localização *
                      </Label>
                      <Input
                        id="localizacao"
                        placeholder="Ex: São Paulo - SP"
                        className="bg-slate-800 border-slate-700 text-slate-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salario" className="text-slate-200">
                        Faixa Salarial
                      </Label>
                      <Input
                        id="salario"
                        placeholder="Ex: R$ 5.000 - R$ 8.000"
                        className="bg-slate-800 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="prioridade" className="text-slate-200">
                        Prioridade *
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="baixa">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataFechamento" className="text-slate-200">
                        Data de Fechamento
                      </Label>
                      <Input id="dataFechamento" type="date" className="bg-slate-800 border-slate-700 text-slate-100" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao" className="text-slate-200">
                      Descrição da Vaga *
                    </Label>
                    <Textarea
                      id="descricao"
                      placeholder="Descreva as responsabilidades e o que esperamos do candidato..."
                      className="bg-slate-800 border-slate-700 text-slate-100 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requisitos" className="text-slate-200">
                      Requisitos *
                    </Label>
                    <Textarea
                      id="requisitos"
                      placeholder="Liste os requisitos necessários (um por linha)"
                      className="bg-slate-800 border-slate-700 text-slate-100 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="beneficios" className="text-slate-200">
                      Benefícios
                    </Label>
                    <Textarea
                      id="beneficios"
                      placeholder="Liste os benefícios oferecidos (um por linha)"
                      className="bg-slate-800 border-slate-700 text-slate-100 min-h-[80px]"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                    >
                      Cancelar
                    </Button>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                      Criar Vaga
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filtros */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar vagas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>
              </div>
              <Select value={selectedDepartamento} onValueChange={setSelectedDepartamento}>
                <SelectTrigger className="w-full md:w-[200px] bg-slate-800 border-slate-700 text-slate-100">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Recursos Humanos">RH</SelectItem>
                  <SelectItem value="Produto">Produto</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[200px] bg-slate-800 border-slate-700 text-slate-100">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Ativa">Ativa</SelectItem>
                  <SelectItem value="Em Análise">Em Análise</SelectItem>
                  <SelectItem value="Pausada">Pausada</SelectItem>
                  <SelectItem value="Fechada">Fechada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Vagas */}
        <div className="grid gap-4">
          {filteredVagas.map((vaga) => (
            <Card
              key={vaga.id}
              className="border-slate-800 bg-slate-900/50 backdrop-blur hover:bg-slate-900/70 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                        <Briefcase className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-100">{vaga.titulo}</h3>
                        <p className="text-sm text-slate-400">{vaga.departamento}</p>
                      </div>
                      <Badge className={getPrioridadeColor(vaga.prioridade)}>{vaga.prioridade}</Badge>
                      <Badge className={getStatusColor(vaga.status)}>{vaga.status}</Badge>
                    </div>

                    <p className="text-slate-300 mb-4">{vaga.descricao}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                        <span>{vaga.localizacao}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span>{vaga.salario}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span>{vaga.candidatos} candidatos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Target className="h-4 w-4 text-purple-400" />
                        <span>
                          {vaga.vagas} {vaga.vagas === 1 ? "vaga" : "vagas"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {vaga.requisitos.map((req, index) => (
                        <Badge key={index} variant="outline" className="border-slate-700 text-slate-300">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Link href={`/admin/recrutamento/vagas/${vaga.id}`}>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-300">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem className="text-slate-300 hover:text-cyan-400">
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-slate-300 hover:text-blue-400">
                          <Share2 className="mr-2 h-4 w-4" />
                          Compartilhar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-slate-300 hover:text-yellow-400">
                          <Archive className="mr-2 h-4 w-4" />
                          Arquivar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:text-red-300">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVagas.length === 0 && (
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-slate-600 mb-4" />
              <p className="text-slate-400 text-center">Nenhuma vaga encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
