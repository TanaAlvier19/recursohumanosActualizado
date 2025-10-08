"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"
import Swal from "sweetalert2"

interface Vaga {
  id: number
  titulo: string
  departamento: string
  localizacao: string
  tipo: string
  nivel: string
  salario: string
  candidatos: number
  status: string
  prioridade: string
  dataAbertura: string
  dataFechamento: string
  descricao: string
  requisitos: string[]
  vagas: number
}

interface Departamento {
  id: string  // UUID como string
  nome: string
  descricao?: string
}

const useVagas = () => {
  const [vagas, setVagas] = useState<Vaga[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVagas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("https://avdserver.up.railway.app/vagas/", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`)
      }

      const data = await response.json()

      const vagasFormatadas: Vaga[] = data.map((vaga: any) => ({
        id: vaga.id,
        titulo: vaga.titulo || "Sem título",
        departamento: vaga.departamento_nome || "Não especificado",
        localizacao: vaga.localizacao || "Remoto",
        tipo: vaga.tipo_contrato || "CLT",
        nivel: vaga.nivel || "Pleno",
        salario: vaga.salario_min && vaga.salario_max 
          ? `KZ ${vaga.salario_min} - KZ ${vaga.salario_max}`
          : "A combinar",
        candidatos: vaga.total_candidatos || 0,
        status: vaga.status === "ABERTA" ? "Ativa" : vaga.status === "FECHADA" ? "Fechada" : "Em Análise",
        prioridade: vaga.prioridade || "Média",
        dataAbertura: vaga.data_abertura || new Date().toISOString(),
        dataFechamento: vaga.data_fechamento || "",
        descricao: vaga.descricao || "",
        requisitos: vaga.requisitos ? vaga.requisitos.split(",") : [],
        vagas: vaga.vagas_disponiveis || 1,
      }))

      setVagas(vagasFormatadas)
    } catch (error) {
      console.error("Erro ao buscar vagas:", error)
      setError("Falha ao carregar vagas")
      Swal.fire({
        title: "Erro",
        text: "Falha ao carregar vagas. Verifique se o backend está rodando.",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVagas()
  }, [fetchVagas])

  return { vagas, loading, error, refetchVagas: fetchVagas }
}

// Hook para buscar departamentos
const useDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDepartamentos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("https://avdserver.up.railway.app/departamentos/", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`)
      }

      const data = await response.json()
      
      // Ajuste para diferentes estruturas de resposta
      let departamentosData: Departamento[] = []
      
      if (Array.isArray(data)) {
        departamentosData = data
      } else if (data.dados && Array.isArray(data.dados)) {
        departamentosData = data.dados
      } else if (data.data && Array.isArray(data.data)) {
        departamentosData = data.data
      } else {
        console.warn("Estrutura de dados inesperada:", data)
        departamentosData = []
      }

      setDepartamentos(departamentosData)
    } catch (error) {
      console.error("Erro ao buscar departamentos:", error)
      setError("Falha ao carregar departamentos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDepartamentos()
  }, [fetchDepartamentos])

  return { departamentos, loading, error, refetchDepartamentos: fetchDepartamentos }
}

// Hook para buscar dados da empresa (para obter o ID da empresa)
const useEmpresa = () => {
  const [empresa, setEmpresa] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchEmpresa = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("https://avdserver.up.railway.app/usuariologado/", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setEmpresa(data.empresa)
        console.log(data.empresa)
      }
    } catch (error) {
      console.error("Erro ao buscar empresa:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmpresa()
  }, [fetchEmpresa])

  return { empresa, loading }
}

export default function VagasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedDepartamento, setSelectedDepartamento] = useState("todos")
  const [selectedStatus, setSelectedStatus] = useState("todos")

  const [formData, setFormData] = useState({
    titulo: "",
    departamento: "", // Agora será o ID do departamento
    nivel: "",
    tipo: "",
    vagas_disponiveis: "1",
    localizacao: "",
    salario_min: "",
    salario_max: "",
    prioridade: "",
    data_fechamento: "",
    descricao: "",
    requisitos: "",
    beneficios: "",
  })

  const { vagas, loading, refetchVagas } = useVagas()
  const { departamentos, loading: loadingDepartamentos } = useDepartamentos()
  const { empresa } = useEmpresa()

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

  // Obter lista única de departamentos das vagas para o filtro
  const departamentosUnicos = useMemo(() => {
    const departamentosDasVagas = [...new Set(vagas.map(vaga => vaga.departamento))].filter(Boolean)
    return departamentosDasVagas
  }, [vagas])

  const filteredVagas = useMemo(() => {
    return vagas.filter((vaga) => {
      const matchesSearch =
        vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaga.departamento.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartamento = selectedDepartamento === "todos" || vaga.departamento === selectedDepartamento
      const matchesStatus = selectedStatus === "todos" || vaga.status === selectedStatus
      return matchesSearch && matchesDepartamento && matchesStatus
    })
  }, [vagas, searchTerm, selectedDepartamento, selectedStatus])

  const handleCreateVaga = async () => {
    try {
      if (!formData.titulo || !formData.departamento || !formData.nivel || !formData.tipo) {
        Swal.fire({
          title: "Campos obrigatórios",
          text: "Preencha todos os campos obrigatórios",
          icon: "warning",
          background: "#1e293b",
          color: "white",
        })
        return
      }

      // Preparar dados para enviar
      const novaVaga = {
        titulo: formData.titulo,
        departamento: formData.departamento, // ID do departamento
        nivel: formData.nivel,
        tipo_contrato: formData.tipo,
        vagas_disponiveis: parseInt(formData.vagas_disponiveis),
        localizacao: formData.localizacao,
        salario_min: formData.salario_min ? parseFloat(formData.salario_min) : null,
        salario_max: formData.salario_max ? parseFloat(formData.salario_max) : null,
        prioridade: formData.prioridade,
        data_fechamento: formData.data_fechamento || null,
        descricao: formData.descricao,
        requisitos: formData.requisitos,
        beneficios: formData.beneficios,
        status: "ABERTA",
        empresa: empresa?.id 
      }

      console.log("Enviando dados:", novaVaga)

      const response = await fetch("https://avdserver.up.railway.app/vagas/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(novaVaga),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Erro detalhado:", errorData)
        throw new Error(errorData.detail || errorData.message || `Erro ${response.status}`)
      }

      const result = await response.json()

      Swal.fire({
        title: "Sucesso",
        text: "Vaga criada com sucesso",
        icon: "success",
        background: "#1e293b",
        color: "white",
      })

      setIsCreateModalOpen(false)
      resetForm()
      refetchVagas()
    } catch (error: any) {
      console.error("Erro ao criar vaga:", error)
      Swal.fire({
        title: "Erro",
        text: error.message || "Falha ao criar vaga",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    }
  }

  const handleDeleteVaga = async (vagaId: number) => {
    const result = await Swal.fire({
      title: "Confirmar exclusão",
      text: "Tem certeza que deseja excluir esta vaga?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      background: "#1e293b",
      color: "white",
    })

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://avdserver.up.railway.app/vagas/${vagaId}/`, {
          method: "DELETE",
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`Erro ${response.status}`)
        }

        Swal.fire({
          title: "Sucesso",
          text: "Vaga excluída com sucesso",
          icon: "success",
          background: "#1e293b",
          color: "white",
        })

        refetchVagas()
      } catch (error) {
        console.error("Erro ao excluir vaga:", error)
        Swal.fire({
          title: "Erro",
          text: "Falha ao excluir vaga",
          icon: "error",
          background: "#1e293b",
          color: "white",
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      departamento: "",
      nivel: "",
      tipo: "",
      vagas_disponiveis: "1",
      localizacao: "",
      salario_min: "",
      salario_max: "",
      prioridade: "",
      data_fechamento: "",
      descricao: "",
      requisitos: "",
      beneficios: "",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="h-20 w-full bg-slate-800" />
          <Skeleton className="h-24 w-full bg-slate-800" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full bg-slate-800" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
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
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departamento" className="text-slate-200">
                        Departamento *
                      </Label>
                      <Select
                        value={formData.departamento}
                        onValueChange={(value) => setFormData({ ...formData, departamento: value })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {loadingDepartamentos ? (
                            <SelectItem value="loading" disabled>
                              Carregando departamentos...
                            </SelectItem>
                          ) : (
                            departamentos.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.nome}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="nivel" className="text-slate-200">
                        Nível *
                      </Label>
                      <Select
                        value={formData.nivel}
                        onValueChange={(value) => setFormData({ ...formData, nivel: value })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="Junior">Júnior</SelectItem>
                          <SelectItem value="Pleno">Pleno</SelectItem>
                          <SelectItem value="Senior">Sênior</SelectItem>
                          <SelectItem value="Especialista">Especialista</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo" className="text-slate-200">
                        Tipo de Contrato *
                      </Label>
                      <Select
                        value={formData.tipo}
                        onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="PJ">Efectivo</SelectItem>
                          <SelectItem value="ESTAGIO">Estágio</SelectItem>
                          <SelectItem value="TEMPORARIO">Temporário</SelectItem>
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
                        value={formData.vagas_disponiveis}
                        onChange={(e) => setFormData({ ...formData, vagas_disponiveis: e.target.value })}
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
                        placeholder="Ex: Maianga"
                        className="bg-slate-800 border-slate-700 text-slate-100"
                        value={formData.localizacao}
                        onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salario_min" className="text-slate-200">
                        Salário Mínimo (KZ)
                      </Label>
                      <Input
                        id="salario_min"
                        type="number"
                        step="0.01"
                        placeholder="Ex: 5000.00"
                        className="bg-slate-800 border-slate-700 text-slate-100"
                        value={formData.salario_min}
                        onChange={(e) => setFormData({ ...formData, salario_min: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="salario_max" className="text-slate-200">
                        Salário Máximo (KZ)
                      </Label>
                      <Input
                        id="salario_max"
                        type="number"
                        step="0.01"
                        placeholder="Ex: 8000.00"
                        className="bg-slate-800 border-slate-700 text-slate-100"
                        value={formData.salario_max}
                        onChange={(e) => setFormData({ ...formData, salario_max: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prioridade" className="text-slate-200">
                        Prioridade *
                      </Label>
                      <Select
                        value={formData.prioridade}
                        onValueChange={(value) => setFormData({ ...formData, prioridade: value })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Média">Média</SelectItem>
                          <SelectItem value="Baixa">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data_fechamento" className="text-slate-200">
                      Data de Fechamento
                    </Label>
                    <Input
                      id="data_fechamento"
                      type="date"
                      className="bg-slate-800 border-slate-700 text-slate-100"
                      value={formData.data_fechamento}
                      onChange={(e) => setFormData({ ...formData, data_fechamento: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao" className="text-slate-200">
                      Descrição da Vaga *
                    </Label>
                    <Textarea
                      id="descricao"
                      placeholder="Descreva as responsabilidades e o que esperamos do candidato..."
                      className="bg-slate-800 border-slate-700 text-slate-100 min-h-[100px]"
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requisitos" className="text-slate-200">
                      Requisitos *
                    </Label>
                    <Textarea
                      id="requisitos"
                      placeholder="Liste os requisitos necessários (separados por vírgula)"
                      className="bg-slate-800 border-slate-700 text-slate-100 min-h-[100px]"
                      value={formData.requisitos}
                      onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="beneficios" className="text-slate-200">
                      Benefícios
                    </Label>
                    <Textarea
                      id="beneficios"
                      placeholder="Liste os benefícios oferecidos (separados por vírgula)"
                      className="bg-slate-800 border-slate-700 text-slate-100 min-h-[80px]"
                      value={formData.beneficios}
                      onChange={(e) => setFormData({ ...formData, beneficios: e.target.value })}
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
                    <Button
                      onClick={handleCreateVaga}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    >
                      Criar Vaga
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

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
                  {departamentosUnicos.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
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
                        <DropdownMenuItem
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteVaga(vaga.id)}
                        >
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