"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { 
  Search, Plus, Edit, Trash2, Gift, TrendingDown, Filter,
  Loader2, Users, Building, Briefcase 
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Desconto {
  id: string
  nome: string
  descricao: string
  tipo: "FIXO" | "PERCENTUAL" | "VARIAVEL"
  categoria: "OBRIGATORIO" | "OPCIONAL" | "JUDICIAL" | "EMPRESTIMO" | "ADIANTO" | "OUTROS"
  aplicavel_a: "TODOS" | "DEPARTAMENTO" | "CARGO" | "INDIVIDUAL"
  valor_fixo: number
  percentual: number
  valor_minimo: number
  valor_maximo: number
  data_inicio: string
  data_fim?: string
  recorrente: boolean
  status: "ATIVO" | "INATIVO" | "SUSPENSO" | "EXPIRADO"
  ativo: boolean
  funcionario?: string
  departamento_alvo: string
  cargo_alvo: string
  criado_em: string
  atualizado_em: string
}

interface Beneficio {
  id: string
  nome: string
  descricao: string
  tipo: "FIXO" | "PERCENTUAL" | "VARIAVEL"
  categoria: "ALIMENTACAO" | "TRANSPORTE" | "SAUDE" | "EDUCACAO" | "MORADIA" | "OUTROS"
  aplicavel_a: "TODOS" | "DEPARTAMENTO" | "CARGO" | "INDIVIDUAL"
  valor_fixo: number
  percentual: number
  valor_minimo: number
  valor_maximo: number
  descontavel_ir: boolean
  descontavel_inss: boolean
  tributavel: boolean
  data_inicio: string
  data_fim?: string
  recorrente: boolean
  status: "ATIVO" | "INATIVO" | "SUSPENSO" | "EXPIRADO"
  ativo: boolean
  funcionario?: string
  departamento_alvo: string
  cargo_alvo: string
  criado_em: string
  atualizado_em: string
}

const DescontosBeneficiosPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState("TODOS")
  const [categoriaFilter, setCategoriaFilter] = useState("TODOS")
  const [statusFilter, setStatusFilter] = useState("TODOS")
  const [modalDescontoAberto, setModalDescontoAberto] = useState(false)
  const [modalBeneficioAberto, setModalBeneficioAberto] = useState(false)
  const [itemSelecionado, setItemSelecionado] = useState<Desconto | Beneficio | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)
  
  // Estados de loading separados para melhor UX
  const [loadingDescontos, setLoadingDescontos] = useState(false)
  const [loadingBeneficios, setLoadingBeneficios] = useState(false)
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(false)
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Data states
  const [descontos, setDescontos] = useState<Desconto[]>([])
  const [beneficios, setBeneficios] = useState<Beneficio[]>([])
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [departamentos, setDepartamentos] = useState<any[]>([])

  // Form states
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [tipo, setTipo] = useState<"FIXO" | "PERCENTUAL" | "VARIAVEL">("FIXO")
  const [categoria, setCategoria] = useState("")
  const [aplicavelA, setAplicavelA] = useState<"TODOS" | "DEPARTAMENTO" | "CARGO" | "INDIVIDUAL">("TODOS")
  const [valorFixo, setValorFixo] = useState("")
  const [percentual, setPercentual] = useState("")
  const [valorMinimo, setValorMinimo] = useState("")
  const [valorMaximo, setValorMaximo] = useState("")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [recorrente, setRecorrente] = useState(true)
  const [ativo, setAtivo] = useState(true)
  const [funcionarioId, setFuncionarioId] = useState("")
  const [departamentoAlvo, setDepartamentoAlvo] = useState("")
  const [cargoAlvo, setCargoAlvo] = useState("")
  
  // Benefício specific
  const [descontavelIR, setDescontavelIR] = useState(false)
  const [descontavelINSS, setDescontavelINSS] = useState(false)
  const [tributavel, setTributavel] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    fetchDescontos()
    fetchBeneficios()
    fetchFuncionarios()
    fetchDepartamentos()
  }, [])

  const fetchDescontos = async () => {
    try {
      setLoadingDescontos(true)
      const response = await fetch(`${API_URL}/descontos/`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Erro ao carregar descontos")
      const data = await response.json()
      setDescontos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar descontos")
      toast({
        title: "Erro",
        description: "Erro ao carregar descontos",
        variant: "destructive"
      })
    } finally {
      setLoadingDescontos(false)
    }
  }

  const fetchBeneficios = async () => {
    try {
      setLoadingBeneficios(true)
      const response = await fetch(`${API_URL}/beneficios/`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Erro ao carregar benefícios")
      const data = await response.json()
      setBeneficios(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar benefícios")
      toast({
        title: "Erro",
        description: "Erro ao carregar benefícios",
        variant: "destructive"
      })
    } finally {
      setLoadingBeneficios(false)
    }
  }

  const fetchFuncionarios = async () => {
    try {
      setLoadingFuncionarios(true)
      const response = await fetch(`${API_URL}/funcionarios/`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setFuncionarios(data)
      }
    } catch (err) {
      console.error("Erro ao carregar funcionários:", err)
    } finally {
      setLoadingFuncionarios(false)
    }
  }

  const fetchDepartamentos = async () => {
    try {
      setLoadingDepartamentos(true)
      const response = await fetch(`${API_URL}/departamentos/`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setDepartamentos(data)
      }
    } catch (err) {
      console.error("Erro ao carregar departamentos:", err)
    } finally {
      setLoadingDepartamentos(false)
    }
  }

  // Função auxiliar para converter valores numéricos de forma segura
  const parseNumber = (value: string): number => {
    if (!value || value === '') return 0
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }

  const stats = {
    totalDescontos: descontos.length,
    descontosAtivos: descontos.filter((d) => d.ativo && d.status === 'ATIVO').length,
    totalBeneficios: beneficios.length,
    beneficiosAtivos: beneficios.filter((b) => b.ativo && b.status === 'ATIVO').length,
    valorTotalDescontos: descontos.reduce((acc, d) => acc + (d.valor_fixo || 0), 0),
    valorTotalBeneficios: beneficios.reduce((acc, b) => acc + (b.valor_fixo || 0), 0),
  }

  const descontosFiltrados = useMemo(() => {
    return descontos.filter((desconto) => {
      const matchesSearch = desconto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           desconto.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTipo = tipoFilter === "TODOS" || desconto.tipo === tipoFilter
      const matchesCategoria = categoriaFilter === "TODOS" || desconto.categoria === categoriaFilter
      const matchesStatus = statusFilter === "TODOS" || 
                           (statusFilter === "ATIVO" ? desconto.ativo && desconto.status === 'ATIVO' : 
                            statusFilter === "INATIVO" ? !desconto.ativo || desconto.status !== 'ATIVO' : true)
      return matchesSearch && matchesTipo && matchesCategoria && matchesStatus
    })
  }, [descontos, searchTerm, tipoFilter, categoriaFilter, statusFilter])

  const beneficiosFiltrados = useMemo(() => {
    return beneficios.filter((beneficio) => {
      const matchesSearch = beneficio.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           beneficio.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTipo = tipoFilter === "TODOS" || beneficio.tipo === tipoFilter
      const matchesCategoria = categoriaFilter === "TODOS" || beneficio.categoria === categoriaFilter
      const matchesStatus = statusFilter === "TODOS" || 
                           (statusFilter === "ATIVO" ? beneficio.ativo && beneficio.status === 'ATIVO' : 
                            statusFilter === "INATIVO" ? !beneficio.ativo || beneficio.status !== 'ATIVO' : true)
      return matchesSearch && matchesTipo && matchesCategoria && matchesStatus
    })
  }, [beneficios, searchTerm, tipoFilter, categoriaFilter, statusFilter])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO')
  }

  const getStatusBadge = (item: Desconto | Beneficio) => {
    if (!item.ativo) {
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Inativo</Badge>
    }
    
    switch (item.status) {
      case 'ATIVO':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>
      case 'SUSPENSO':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Suspenso</Badge>
      case 'EXPIRADO':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Expirado</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Inativo</Badge>
    }
  }

  const getCategoriaBadge = (categoria: string, tipo: string) => {
    const colors: { [key: string]: string } = {
      'OBRIGATORIO': 'bg-red-500/20 text-red-400 border-red-500/30',
      'OPCIONAL': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'JUDICIAL': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'EMPRESTIMO': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'ADIANTO': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'ALIMENTACAO': 'bg-green-500/20 text-green-400 border-green-500/30',
      'TRANSPORTE': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'SAUDE': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      'EDUCACAO': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      'MORADIA': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    }
    
    return <Badge className={colors[categoria] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
      {tipo === 'DESCONTO' ? categoria : categoria}
    </Badge>
  }

  // Função melhorada para buscar nome do funcionário
  const getFuncionarioNome = (funcionarioId: string) => {
    if (!funcionarioId) return 'N/A'
    
    const funcionario = funcionarios.find(f => f.id === funcionarioId)
    if (!funcionario) return 'N/A'
    
    // Tenta diferentes estruturas de dados possíveis
    return funcionario.nome || 
           funcionario.valores?.nome || 
           funcionario.nome_completo || 
           `Funcionário ${funcionarioId}`
  }

  const abrirModalDesconto = (desconto?: Desconto) => {
    if (desconto) {
      setItemSelecionado(desconto)
      setNome(desconto.nome)
      setDescricao(desconto.descricao)
      setTipo(desconto.tipo)
      setCategoria(desconto.categoria)
      setAplicavelA(desconto.aplicavel_a)
      setValorFixo(desconto.valor_fixo?.toString() || "")
      setPercentual(desconto.percentual?.toString() || "")
      setValorMinimo(desconto.valor_minimo?.toString() || "")
      setValorMaximo(desconto.valor_maximo?.toString() || "")
      setDataInicio(desconto.data_inicio.split('T')[0]) // Remove time part if exists
      setDataFim(desconto.data_fim ? desconto.data_fim.split('T')[0] : "")
      setRecorrente(desconto.recorrente)
      setAtivo(desconto.ativo)
      setFuncionarioId(desconto.funcionario || "")
      setDepartamentoAlvo(desconto.departamento_alvo)
      setCargoAlvo(desconto.cargo_alvo)
      setModoEdicao(true)
    } else {
      limparFormulario()
      setModoEdicao(false)
    }
    setModalDescontoAberto(true)
  }

  const abrirModalBeneficio = (beneficio?: Beneficio) => {
    if (beneficio) {
      setItemSelecionado(beneficio)
      setNome(beneficio.nome)
      setDescricao(beneficio.descricao)
      setTipo(beneficio.tipo)
      setCategoria(beneficio.categoria)
      setAplicavelA(beneficio.aplicavel_a)
      setValorFixo(beneficio.valor_fixo?.toString() || "")
      setPercentual(beneficio.percentual?.toString() || "")
      setValorMinimo(beneficio.valor_minimo?.toString() || "")
      setValorMaximo(beneficio.valor_maximo?.toString() || "")
      setDataInicio(beneficio.data_inicio.split('T')[0])
      setDataFim(beneficio.data_fim ? beneficio.data_fim.split('T')[0] : "")
      setRecorrente(beneficio.recorrente)
      setAtivo(beneficio.ativo)
      setFuncionarioId(beneficio.funcionario || "")
      setDepartamentoAlvo(beneficio.departamento_alvo)
      setCargoAlvo(beneficio.cargo_alvo)
      setDescontavelIR(beneficio.descontavel_ir)
      setDescontavelINSS(beneficio.descontavel_inss)
      setTributavel(beneficio.tributavel)
      setModoEdicao(true)
    } else {
      limparFormulario()
      setModoEdicao(false)
    }
    setModalBeneficioAberto(true)
  }

  const limparFormulario = () => {
    setNome("")
    setDescricao("")
    setTipo("FIXO")
    setCategoria("")
    setAplicavelA("TODOS")
    setValorFixo("")
    setPercentual("")
    setValorMinimo("")
    setValorMaximo("")
    setDataInicio("")
    setDataFim("")
    setRecorrente(true)
    setAtivo(true)
    setFuncionarioId("")
    setDepartamentoAlvo("")
    setCargoAlvo("")
    setDescontavelIR(false)
    setDescontavelINSS(false)
    setTributavel(false)
    setItemSelecionado(null)
  }

  // Validação melhorada do formulário
  const validarFormulario = (): boolean => {
    if (!nome.trim()) {
      toast({
        title: "Erro de Validação",
        description: "Nome é obrigatório",
        variant: "destructive"
      })
      return false
    }

    if (!dataInicio) {
      toast({
        title: "Erro de Validação",
        description: "Data de início é obrigatória",
        variant: "destructive"
      })
      return false
    }

    if (tipo === "FIXO" && !valorFixo) {
      toast({
        title: "Erro de Validação",
        description: "Valor fixo é obrigatório para tipo FIXO",
        variant: "destructive"
      })
      return false
    }

    if (tipo === "PERCENTUAL" && !percentual) {
      toast({
        title: "Erro de Validação",
        description: "Percentual é obrigatório para tipo PERCENTUAL",
        variant: "destructive"
      })
      return false
    }

    if (aplicavelA === "INDIVIDUAL" && !funcionarioId) {
      toast({
        title: "Erro de Validação",
        description: "Funcionário é obrigatório para aplicação individual",
        variant: "destructive"
      })
      return false
    }

    if (aplicavelA === "DEPARTAMENTO" && !departamentoAlvo) {
      toast({
        title: "Erro de Validação",
        description: "Departamento é obrigatório para aplicação por departamento",
        variant: "destructive"
      })
      return false
    }

    if (aplicavelA === "CARGO" && !cargoAlvo) {
      toast({
        title: "Erro de Validação",
        description: "Cargo é obrigatório para aplicação por cargo",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const salvarDesconto = async () => {
    if (!validarFormulario()) return

    try {
      setLoadingSubmit(true)
      
      // Usar a função parseNumber para conversão segura
      const payload = {
        nome: nome.trim(),
        descricao: descricao.trim(),
        tipo,
        categoria,
        aplicavel_a: aplicavelA,
        valor_fixo: tipo === 'FIXO' ? parseNumber(valorFixo) : 0,
        percentual: tipo === 'PERCENTUAL' ? parseNumber(percentual) : 0,
        valor_minimo: parseNumber(valorMinimo),
        valor_maximo: parseNumber(valorMaximo),
        data_inicio: dataInicio,
        data_fim: dataFim || null,
        recorrente,
        status: ativo ? 'ATIVO' : 'INATIVO',
        ativo,
        funcionario: aplicavelA === 'INDIVIDUAL' ? funcionarioId : null,
        departamento_alvo: aplicavelA === 'DEPARTAMENTO' ? departamentoAlvo : '',
        cargo_alvo: aplicavelA === 'CARGO' ? cargoAlvo : '',
      }

      const url = modoEdicao ? `${API_URL}/descontos/${itemSelecionado?.id}/` : `${API_URL}/descontos/`
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `Erro ${response.status} ao salvar desconto`)
      }

      await fetchDescontos()
      setModalDescontoAberto(false)
      limparFormulario()
      
      toast({
        title: "Sucesso",
        description: `Desconto ${modoEdicao ? 'atualizado' : 'criado'} com sucesso!`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoadingSubmit(false)
    }
  }

  const salvarBeneficio = async () => {
    if (!validarFormulario()) return

    try {
      setLoadingSubmit(true)
      
      const payload = {
        nome: nome.trim(),
        descricao: descricao.trim(),
        tipo,
        categoria,
        aplicavel_a: aplicavelA,
        valor_fixo: tipo === 'FIXO' ? parseNumber(valorFixo) : 0,
        percentual: tipo === 'PERCENTUAL' ? parseNumber(percentual) : 0,
        valor_minimo: parseNumber(valorMinimo),
        valor_maximo: parseNumber(valorMaximo),
        descontavel_ir: descontavelIR,
        descontavel_inss: descontavelINSS,
        tributavel,
        data_inicio: dataInicio,
        data_fim: dataFim || null,
        recorrente,
        status: ativo ? 'ATIVO' : 'INATIVO',
        ativo,
        funcionario: aplicavelA === 'INDIVIDUAL' ? funcionarioId : null,
        departamento_alvo: aplicavelA === 'DEPARTAMENTO' ? departamentoAlvo : '',
        cargo_alvo: aplicavelA === 'CARGO' ? cargoAlvo : '',
      }

      const url = modoEdicao ? `${API_URL}/beneficios/${itemSelecionado?.id}/` : `${API_URL}/beneficios/`
      const method = modoEdicao ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `Erro ${response.status} ao salvar benefício`)
      }

      await fetchBeneficios()
      setModalBeneficioAberto(false)
      limparFormulario()
      
      toast({
        title: "Sucesso",
        description: `Benefício ${modoEdicao ? 'atualizado' : 'criado'} com sucesso!`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoadingSubmit(false)
    }
  }

  const excluirItem = async (id: string, tipoItem: "desconto" | "beneficio") => {
    if (!confirm(`Tem certeza que deseja excluir este ${tipoItem}?`)) return

    try {
      setLoadingSubmit(true)
      const url = tipoItem === "desconto" ? `${API_URL}/descontos/${id}/` : `${API_URL}/beneficios/${id}/`

      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) throw new Error(`Erro ao excluir ${tipoItem}`)

      if (tipoItem === "desconto") {
        await fetchDescontos()
      } else {
        await fetchBeneficios()
      }

      toast({
        title: "Sucesso",
        description: `${tipoItem === 'desconto' ? 'Desconto' : 'Benefício'} excluído com sucesso!`,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      toast({
        title: "Erro",
        description: `Erro ao excluir ${tipoItem}`,
        variant: "destructive"
      })
    } finally {
      setLoadingSubmit(false)
    }
  }

  // Loading state mais específico
  if (loadingDescontos && loadingBeneficios && descontos.length === 0 && beneficios.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-white text-xl">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Gestão de Descontos e Benefícios
          </h1>
          <p className="text-lg text-slate-300">Configure descontos e benefícios aplicados na folha de pagamento</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Descontos</p>
                <p className="text-2xl font-bold text-white">{stats.totalDescontos}</p>
                <p className="text-sm text-slate-400">{stats.descontosAtivos} ativos</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Valor em Descontos</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.valorTotalDescontos)}</p>
                <p className="text-sm text-slate-400">Mensal</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Benefícios</p>
                <p className="text-2xl font-bold text-white">{stats.totalBeneficios}</p>
                <p className="text-sm text-slate-400">{stats.beneficiosAtivos} ativos</p>
              </div>
              <Gift className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Valor em Benefícios</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.valorTotalBeneficios)}</p>
                <p className="text-sm text-slate-400">Mensal</p>
              </div>
              <Gift className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou descrição..."
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="TODOS">Todos Tipos</SelectItem>
                  <SelectItem value="FIXO">Fixo</SelectItem>
                  <SelectItem value="PERCENTUAL">Percentual</SelectItem>
                  <SelectItem value="VARIAVEL">Variável</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="TODOS">Todos</SelectItem>
                  <SelectItem value="ATIVO">Ativos</SelectItem>
                  <SelectItem value="INATIVO">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Tabs with tables */}
      <Tabs defaultValue="descontos" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
          <TabsTrigger value="descontos" className="text-slate-300 data-[state=active]:bg-slate-700">
            <TrendingDown className="h-4 w-4 mr-2" />
            Descontos ({descontos.length})
          </TabsTrigger>
          <TabsTrigger value="beneficios" className="text-slate-300 data-[state=active]:bg-slate-700">
            <Gift className="h-4 w-4 mr-2" />
            Benefícios ({beneficios.length})
          </TabsTrigger>
        </TabsList>

        {/* Descontos Tab */}
        <TabsContent value="descontos" className="mt-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <CardTitle className="text-white">Descontos Configurados</CardTitle>
                  <CardDescription className="text-slate-400">
                    {descontosFiltrados.length} descontos encontrados
                  </CardDescription>
                </div>
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 gap-2"
                  onClick={() => abrirModalDesconto()}
                >
                  <Plus className="h-4 w-4" />
                  Novo Desconto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-600">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-600 hover:bg-slate-700/50">
                      <TableHead className="text-slate-300">Nome</TableHead>
                      <TableHead className="text-slate-300">Tipo/Valor</TableHead>
                      <TableHead className="text-slate-300">Categoria</TableHead>
                      <TableHead className="text-slate-300">Aplicação</TableHead>
                      <TableHead className="text-slate-300">Vigência</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-right text-slate-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {descontosFiltrados.map((desconto) => (
                      <TableRow key={desconto.id} className="border-slate-600 hover:bg-slate-700/50">
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-semibold text-white">{desconto.nome}</p>
                            <p className="text-sm text-slate-400">{desconto.descricao}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                              {desconto.tipo}
                            </Badge>
                            <p className="text-sm font-semibold text-white">
                              {desconto.tipo === "PERCENTUAL" ? 
                                `${desconto.percentual}%` : 
                                formatCurrency(desconto.valor_fixo)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getCategoriaBadge(desconto.categoria, 'DESCONTO')}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                              {desconto.aplicavel_a}
                            </Badge>
                            {desconto.aplicavel_a === 'INDIVIDUAL' && desconto.funcionario && (
                              <p className="text-xs text-slate-400">
                                {getFuncionarioNome(desconto.funcionario)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm text-slate-300">
                              {formatDate(desconto.data_inicio)}
                            </p>
                            {desconto.data_fim && (
                              <p className="text-xs text-slate-400">
                                até {formatDate(desconto.data_fim)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(desconto)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white"
                              onClick={() => abrirModalDesconto(desconto)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => excluirItem(desconto.id, "desconto")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {descontosFiltrados.length === 0 && (
                  <div className="text-center py-8">
                    <TrendingDown className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Nenhum desconto encontrado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefícios Tab */}
        <TabsContent value="beneficios" className="mt-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <CardTitle className="text-white">Benefícios Configurados</CardTitle>
                  <CardDescription className="text-slate-400">
                    {beneficiosFiltrados.length} benefícios encontrados
                  </CardDescription>
                </div>
                <Button
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 gap-2"
                  onClick={() => abrirModalBeneficio()}
                >
                  <Plus className="h-4 w-4" />
                  Novo Benefício
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-600">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-600 hover:bg-slate-700/50">
                      <TableHead className="text-slate-300">Nome</TableHead>
                      <TableHead className="text-slate-300">Tipo/Valor</TableHead>
                      <TableHead className="text-slate-300">Categoria</TableHead>
                      <TableHead className="text-slate-300">Aplicação</TableHead>
                      <TableHead className="text-slate-300">Aspectos Fiscais</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-right text-slate-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beneficiosFiltrados.map((beneficio) => (
                      <TableRow key={beneficio.id} className="border-slate-600 hover:bg-slate-700/50">
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-semibold text-white">{beneficio.nome}</p>
                            <p className="text-sm text-slate-400">{beneficio.descricao}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                              {beneficio.tipo}
                            </Badge>
                            <p className="text-sm font-semibold text-white">
                              {beneficio.tipo === "PERCENTUAL" ? 
                                `${beneficio.percentual}%` : 
                                formatCurrency(beneficio.valor_fixo)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getCategoriaBadge(beneficio.categoria, 'BENEFICIO')}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                              {beneficio.aplicavel_a}
                            </Badge>
                            {beneficio.aplicavel_a === 'INDIVIDUAL' && beneficio.funcionario && (
                              <p className="text-xs text-slate-400">
                                {getFuncionarioNome(beneficio.funcionario)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {beneficio.descontavel_ir && (
                              <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                                IR
                              </Badge>
                            )}
                            {beneficio.descontavel_inss && (
                              <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs">
                                INSS
                              </Badge>
                            )}
                            {beneficio.tributavel && (
                              <Badge variant="outline" className="border-red-500/30 text-red-400 text-xs">
                                Trib
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(beneficio)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white"
                              onClick={() => abrirModalBeneficio(beneficio)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => excluirItem(beneficio.id, "beneficio")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {beneficiosFiltrados.length === 0 && (
                  <div className="text-center py-8">
                    <Gift className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Nenhum benefício encontrado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Desconto */}
      <Dialog open={modalDescontoAberto} onOpenChange={setModalDescontoAberto}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">
              {modoEdicao ? "Editar Desconto" : "Novo Desconto"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Configure os detalhes do desconto
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Nome do Desconto *</Label>
              <Input
                className="bg-slate-700 border-slate-600 text-white"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Desconto de Vale Transporte"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Tipo *</Label>
              <Select value={tipo} onValueChange={(value: "FIXO" | "PERCENTUAL" | "VARIAVEL") => setTipo(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="FIXO">Valor Fixo</SelectItem>
                  <SelectItem value="PERCENTUAL">Percentual</SelectItem>
                  <SelectItem value="VARIAVEL">Variável</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Categoria *</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="OBRIGATORIO">Obrigatório</SelectItem>
                  <SelectItem value="OPCIONAL">Opcional</SelectItem>
                  <SelectItem value="JUDICIAL">Judicial</SelectItem>
                  <SelectItem value="EMPRESTIMO">Empréstimo</SelectItem>
                  <SelectItem value="ADIANTO">Adiantamento</SelectItem>
                  <SelectItem value="OUTROS">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Aplicável a *</Label>
              <Select value={aplicavelA} onValueChange={(value: "TODOS" | "DEPARTAMENTO" | "CARGO" | "INDIVIDUAL") => setAplicavelA(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="TODOS">Todos os Funcionários</SelectItem>
                  <SelectItem value="DEPARTAMENTO">Por Departamento</SelectItem>
                  <SelectItem value="CARGO">Por Cargo</SelectItem>
                  <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tipo === 'FIXO' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Valor Fixo (AOA) *</Label>
                <Input
                  type="number"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={valorFixo}
                  onChange={(e) => setValorFixo(e.target.value)}
                  placeholder="Ex: 50000"
                />
              </div>
            )}

            {tipo === 'PERCENTUAL' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Percentual (%) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={percentual}
                  onChange={(e) => setPercentual(e.target.value)}
                  placeholder="Ex: 5.5"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-slate-300">Valor Mínimo (AOA)</Label>
              <Input
                type="number"
                className="bg-slate-700 border-slate-600 text-white"
                value={valorMinimo}
                onChange={(e) => setValorMinimo(e.target.value)}
                placeholder="Ex: 10000"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Valor Máximo (AOA)</Label>
              <Input
                type="number"
                className="bg-slate-700 border-slate-600 text-white"
                value={valorMaximo}
                onChange={(e) => setValorMaximo(e.target.value)}
                placeholder="Ex: 100000"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Data de Início *</Label>
              <Input
                type="date"
                className="bg-slate-700 border-slate-600 text-white"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Data de Fim (Opcional)</Label>
              <Input
                type="date"
                className="bg-slate-700 border-slate-600 text-white"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>

            {aplicavelA === 'INDIVIDUAL' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Funcionário *</Label>
                <Select value={funcionarioId} onValueChange={setFuncionarioId}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    {funcionarios.map((func) => (
                      <SelectItem key={func.id} value={func.id}>
                        {func.nome || func.valores?.nome || func.nome_completo || `Funcionário ${func.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {aplicavelA === 'DEPARTAMENTO' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Departamento Alvo *</Label>
                <Select value={departamentoAlvo} onValueChange={setDepartamentoAlvo}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    {departamentos.map((dept) => (
                      <SelectItem key={dept.id} value={dept.nome}>
                        {dept.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {aplicavelA === 'CARGO' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Cargo Alvo *</Label>
                <Input
                  className="bg-slate-700 border-slate-600 text-white"
                  value={cargoAlvo}
                  onChange={(e) => setCargoAlvo(e.target.value)}
                  placeholder="Ex: Gerente, Analista, etc."
                />
              </div>
            )}

            <div className="md:col-span-2 space-y-2">
              <Label className="text-slate-300">Descrição</Label>
              <Textarea
                className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o propósito e detalhes do desconto..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={recorrente}
                onCheckedChange={setRecorrente}
              />
              <Label className="text-slate-300">Desconto Recorrente</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={ativo}
                onCheckedChange={setAtivo}
              />
              <Label className="text-slate-300">Ativo</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalDescontoAberto(false)}
              className="border-slate-600 text-slate-300"
            >
              Cancelar
            </Button>
            <Button 
              onClick={salvarDesconto}
              disabled={loadingSubmit || !nome || !tipo || !categoria || !dataInicio}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {loadingSubmit && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {loadingSubmit ? "Salvando..." : modoEdicao ? "Atualizar" : "Criar"} Desconto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Benefício */}
      <Dialog open={modalBeneficioAberto} onOpenChange={setModalBeneficioAberto}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-green-400">
              {modoEdicao ? "Editar Benefício" : "Novo Benefício"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Configure os detalhes do benefício
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Nome do Benefício *</Label>
              <Input
                className="bg-slate-700 border-slate-600 text-white"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Vale Alimentação"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Tipo *</Label>
              <Select value={tipo} onValueChange={(value: "FIXO" | "PERCENTUAL" | "VARIAVEL") => setTipo(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="FIXO">Valor Fixo</SelectItem>
                  <SelectItem value="PERCENTUAL">Percentual</SelectItem>
                  <SelectItem value="VARIAVEL">Variável</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Categoria *</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="ALIMENTACAO">Alimentação</SelectItem>
                  <SelectItem value="TRANSPORTE">Transporte</SelectItem>
                  <SelectItem value="SAUDE">Saúde</SelectItem>
                  <SelectItem value="EDUCACAO">Educação</SelectItem>
                  <SelectItem value="MORADIA">Moradia</SelectItem>
                  <SelectItem value="OUTROS">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Aplicável a *</Label>
              <Select value={aplicavelA} onValueChange={(value: "TODOS" | "DEPARTAMENTO" | "CARGO" | "INDIVIDUAL") => setAplicavelA(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="TODOS">Todos os Funcionários</SelectItem>
                  <SelectItem value="DEPARTAMENTO">Por Departamento</SelectItem>
                  <SelectItem value="CARGO">Por Cargo</SelectItem>
                  <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tipo === 'FIXO' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Valor Fixo (AOA) *</Label>
                <Input
                  type="number"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={valorFixo}
                  onChange={(e) => setValorFixo(e.target.value)}
                  placeholder="Ex: 75000"
                />
              </div>
            )}

            {tipo === 'PERCENTUAL' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Percentual (%) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={percentual}
                  onChange={(e) => setPercentual(e.target.value)}
                  placeholder="Ex: 8.5"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-slate-300">Valor Mínimo (AOA)</Label>
              <Input
                type="number"
                className="bg-slate-700 border-slate-600 text-white"
                value={valorMinimo}
                onChange={(e) => setValorMinimo(e.target.value)}
                placeholder="Ex: 20000"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Valor Máximo (AOA)</Label>
              <Input
                type="number"
                className="bg-slate-700 border-slate-600 text-white"
                value={valorMaximo}
                onChange={(e) => setValorMaximo(e.target.value)}
                placeholder="Ex: 150000"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Data de Início *</Label>
              <Input
                type="date"
                className="bg-slate-700 border-slate-600 text-white"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Data de Fim (Opcional)</Label>
              <Input
                type="date"
                className="bg-slate-700 border-slate-600 text-white"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>

            {aplicavelA === 'INDIVIDUAL' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Funcionário *</Label>
                <Select value={funcionarioId} onValueChange={setFuncionarioId}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    {funcionarios.map((func) => (
                      <SelectItem key={func.id} value={func.id}>
                        {func.nome || func.valores?.nome || func.nome_completo || `Funcionário ${func.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {aplicavelA === 'DEPARTAMENTO' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Departamento Alvo *</Label>
                <Select value={departamentoAlvo} onValueChange={setDepartamentoAlvo}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    {departamentos.map((dept) => (
                      <SelectItem key={dept.id} value={dept.nome}>
                        {dept.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {aplicavelA === 'CARGO' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Cargo Alvo *</Label>
                <Input
                  className="bg-slate-700 border-slate-600 text-white"
                  value={cargoAlvo}
                  onChange={(e) => setCargoAlvo(e.target.value)}
                  placeholder="Ex: Gerente, Analista, etc."
                />
              </div>
            )}

            <div className="md:col-span-2 space-y-2">
              <Label className="text-slate-300">Descrição</Label>
              <Textarea
                className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o propósito e detalhes do benefício..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={descontavelIR}
                onCheckedChange={setDescontavelIR}
              />
              <Label className="text-slate-300">Descontável do IR</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={descontavelINSS}
                onCheckedChange={setDescontavelINSS}
              />
              <Label className="text-slate-300">Descontável do INSS</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={tributavel}
                onCheckedChange={setTributavel}
              />
              <Label className="text-slate-300">Tributável</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={recorrente}
                onCheckedChange={setRecorrente}
              />
              <Label className="text-slate-300">Benefício Recorrente</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={ativo}
                onCheckedChange={setAtivo}
              />
              <Label className="text-slate-300">Ativo</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalBeneficioAberto(false)}
              className="border-slate-600 text-slate-300"
            >
              Cancelar
            </Button>
            <Button 
              onClick={salvarBeneficio}
              disabled={loadingSubmit || !nome || !tipo || !categoria || !dataInicio}
              className="bg-green-600 hover:bg-green-700"
            >
              {loadingSubmit && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {loadingSubmit ? "Salvando..." : modoEdicao ? "Atualizar" : "Criar"} Benefício
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DescontosBeneficiosPage