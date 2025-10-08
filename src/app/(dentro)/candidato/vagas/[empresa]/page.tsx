"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Briefcase, Clock, Heart, Share2, Building2, Calendar, Users, BookOpen, CheckCircle, X, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Swal from "sweetalert2"

interface Vaga {
  id: string
  titulo: string
  empresa: string
  empresa_nome: string
  departamento_nome: string
  requisitos: string
  data_fechamento: string
  status: 'aberta' | 'fechada'
  data_abertura: string
  localizacao: string
  salario_min?:string |null
  salario_max?:string |null
  tipo_contrato: string
  descricao?: string
  tipoVaga:string
  beneficios?: string
  responsabilidades?: string
  qualificacoes?: string
}

interface EmpresaInfo {
  id: string
  nome: string
  descricao?: string
  endereco?: string
  website?: string
}

interface CandidaturaForm {
  nome: string
  email: string
  telefone: string
  linkedin: string
  experiencia: string
  formacao: string
  habilidades: string
  pretensaoSalarial: string
  disponibilidade: string
  fonte: string
  observacoes: string
  curriculo: File | null
}

export default function VagasEmpresaPage() {
  const params = useParams()
  const empresaSlug = params.empresa as string

  // Estados de dados
  const [empresaInfo, setEmpresaInfo] = useState<EmpresaInfo | null>(null)
  const [vagas, setVagas] = useState<Vaga[]>([])
  const [loading, setLoading] = useState(true)

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    busca: "",
    departamento: "todos",
    tipo: "todos",
    localizacao: "todos"
  })

  // Estados de candidatura
  const [candidatura, setCandidatura] = useState<CandidaturaForm>({
    nome: '',
    email: '',
    telefone: '',
    linkedin: '',
    experiencia: '',
    formacao: '',
    habilidades: '',
    pretensaoSalarial: '',
    disponibilidade: '',
    fonte: 'Site da Empresa',
    observacoes: '',
    curriculo: null
  })
  const [modalCandidaturaAberto, setModalCandidaturaAberto] = useState(false)
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null)

  // Estados de detalhes
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false)
  const [vagaDetalhes, setVagaDetalhes] = useState<Vaga | null>(null)

  // Buscar dados da empresa e vagas
  useEffect(() => {
    async function fetchEmpresaEVagas() {
      try {
        setLoading(true)
        
        const empresaResponse = await fetch(`https://recursohumanosactualizado.onrender.com/empresas/?slug=${empresaSlug}`, {
          credentials: "include"
        })
        
        if (empresaResponse.ok) {
          const empresaData = await empresaResponse.json()
          if (empresaData.length > 0) {
            setEmpresaInfo(empresaData[0])
            console.log(empresaData[0])
            // Buscar vagas da empresa específica
            const vagasResponse = await fetch(`https://recursohumanosactualizado.onrender.com/vagas/?empresa=${empresaData[0].id}`, {
              credentials: "include"
            })
            
            if (vagasResponse.ok) {
              const vagasData = await vagasResponse.json()
              setVagas(vagasData)
              console.log(vagasData)
            } else {
              throw new Error("Erro ao buscar vagas")
            }
          } else {
            throw new Error("Empresa não encontrada")
          }
        } else {
          throw new Error("Erro ao buscar empresa")
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        Swal.fire("Erro", "Não foi possível carregar as vagas desta empresa", "error")
      } finally {
        setLoading(false)
      }
    }

    if (empresaSlug) {
      fetchEmpresaEVagas()
    }
  }, [empresaSlug])

  // Handlers para filtros
  const handleFiltroChange = (key: keyof typeof filtros, value: string) => {
    setFiltros(prev => ({ ...prev, [key]: value }))
  }

  const limparFiltros = () => {
    setFiltros({
      busca: "",
      departamento: "todos",
      tipo: "todos",
      localizacao: "todos"
    })
  }

  // Handlers para candidatura
  const handleCandidaturaChange = (key: keyof CandidaturaForm, value: string | File | null) => {
    setCandidatura(prev => ({ ...prev, [key]: value }))
  }

  const abrirModalCandidatura = (vaga: Vaga) => {
    setVagaSelecionada(vaga)
    setModalCandidaturaAberto(true)
  }

  const fecharModalCandidatura = () => {
    setModalCandidaturaAberto(false)
    setVagaSelecionada(null)
    // Limpar formulário
    setCandidatura({
      nome: '',
      email: '',
      telefone: '',
      linkedin: '',
      experiencia: '',
      formacao: '',
      habilidades: '',
      pretensaoSalarial: '',
      disponibilidade: '',
      fonte: 'Site da Empresa',
      observacoes: '',
      curriculo: null
    })
  }

  // Handlers para detalhes
  const abrirModalDetalhes = (vaga: Vaga) => {
    setVagaDetalhes(vaga)
    setModalDetalhesAberto(true)
  }

  const fecharModalDetalhes = () => {
    setModalDetalhesAberto(false)
    setVagaDetalhes(null)
  }

  const enviarCandidatura = async () => {
    try {
      // Validação básica
      if (!candidatura.nome || !candidatura.email || !candidatura.telefone || !candidatura.curriculo) {
        Swal.fire("Atenção", "Por favor, preencha todos os campos obrigatórios", "warning")
        return
      }

      const formData = new FormData()
      
      formData.append('nome', candidatura.nome)
      formData.append('telefone', candidatura.telefone)
      formData.append('email', candidatura.email)
      formData.append('vaga', vagaSelecionada!.id)
      formData.append('empresa', empresaInfo!.id)
      if (candidatura.observacoes) formData.append('observacoes', candidatura.observacoes)
      if (candidatura.linkedin) formData.append('linkedin', candidatura.linkedin)
      if (candidatura.experiencia) formData.append('experiencia_anos', parseInt(candidatura.experiencia).toString())
      if (candidatura.formacao) formData.append('formacao', candidatura.formacao)
      if (candidatura.habilidades) formData.append('habilidades', candidatura.habilidades)
      if (candidatura.pretensaoSalarial) { const valorDecimal = parseFloat(candidatura.pretensaoSalarial).toFixed(2);
  formData.append('pretensao_salarial', valorDecimal);}
      if (candidatura.disponibilidade) formData.append('disponibilidade', candidatura.disponibilidade)
      if (candidatura.fonte) formData.append('fonte', candidatura.fonte)
      
      if (candidatura.curriculo) {
        formData.append('curriculo', candidatura.curriculo)
      }

      const response = await fetch("https://recursohumanosactualizado.onrender.com/candidatos/", {
        method: "POST",
        body: formData,
        credentials: "include"
      })
      console.log(formData)
      if (response.ok) {
        Swal.fire("Candidatura Feita", "Serás Notificado em Breve sobre a Candidatura", "success")
        fecharModalCandidatura()
      } else {

        const errorData = await response.json()
        Swal.fire("Erro", errorData.detalhe || "Erro ao enviar candidatura", "error")
      }
    } catch (err) {
      console.error('Erro na candidatura:', err)
      Swal.fire("Erro", "Erro de conexão. Tente novamente.", "error")
    }
  }

  // Funções auxiliares
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberta':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aberta</Badge>
      case 'fechada':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Fechada</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'Tempo Integral':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Tempo Integral</Badge>
      case 'Meio Periodo':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Meio Período</Badge>
      case 'Remoto':
        return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Remoto</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{tipo}</Badge>
    }
  }

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const calcularDiasDesdePublicacao = (dataPublicacao: string) => {
    const publicacao = new Date(dataPublicacao)
    const hoje = new Date()
    const diffTime = Math.abs(hoje.getTime() - publicacao.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Hoje"
    if (diffDays === 1) return "1 dia atrás"
    if (diffDays < 7) return `${diffDays} dias atrás`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''} atrás`
    return `${Math.floor(diffDays / 30)} mês${Math.floor(diffDays / 30) > 1 ? 'es' : ''} atrás`
  }

  const formatarRequisitos = (requisitos: string) => {
    return requisitos.split('\n').filter(item => item.trim() !== '')
  }

  // Obter opções únicas para filtros
  const departamentosUnicos = Array.from(new Set(vagas.map(vaga => vaga.departamento_nome))).filter(Boolean)
  const tiposUnicos = Array.from(new Set(vagas.map(vaga => vaga.tipoVaga))).filter(Boolean)
  const localizacoesUnicas = Array.from(new Set(vagas.map(vaga => vaga.localizacao))).filter(Boolean)

  // Filtrar vagas
  const vagasFiltradas = vagas.filter((vaga) => {
    const matchBusca =
      vaga.titulo.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      vaga.descricao?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      vaga.requisitos.toLowerCase().includes(filtros.busca.toLowerCase())

    const matchDepartamento = filtros.departamento === "todos" || vaga.departamento_nome === filtros.departamento
    const matchTipo = filtros.tipo === "todos" || vaga.tipoVaga === filtros.tipo
    const matchLocalizacao = filtros.localizacao === "todos" || vaga.localizacao === filtros.localizacao

    return matchBusca && matchDepartamento && matchTipo && matchLocalizacao
  })

  // Renderização de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-700 rounded-lg">
                      <Briefcase className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                      <div className="h-4 bg-slate-700 rounded w-full"></div>
                      <div className="h-4 bg-slate-700 rounded w-4/5"></div>
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

  // Renderização de empresa não encontrada
  if (!empresaInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <Building2 className="mx-auto h-16 w-16 text-slate-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Empresa não encontrada</h1>
          <p className="text-slate-400">A empresa que você está procurando não existe ou não está mais disponível.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header da Empresa */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
                <Building2 className="w-12 h-12 text-cyan-400" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{empresaInfo.nome}</h1>
                <p className="text-slate-300 mb-4">
                  {empresaInfo.descricao || "Empresa inovadora buscando talentos excepcionais"}
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {empresaInfo.endereco && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>{empresaInfo.endereco}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-400">
                    <Briefcase className="w-4 h-4" />
                    <span>{vagas.length} vagas disponíveis</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Busca e Filtros */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder={`Buscar vagas em ${empresaInfo.nome}...`}
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={filtros.departamento} onValueChange={(value) => handleFiltroChange('departamento', value)}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue placeholder="Departamento" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="todos">Todos os Departamentos</SelectItem>
                    {departamentosUnicos.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filtros.tipo} onValueChange={(value) => handleFiltroChange('tipo', value)}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue placeholder="Tipo de Vaga" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    {tiposUnicos.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filtros.localizacao} onValueChange={(value) => handleFiltroChange('localizacao', value)}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue placeholder="Localização" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="todos">Todas as Localizações</SelectItem>
                    {localizacoesUnicas.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="flex items-center justify-between">
          <p className="text-slate-400">
            {vagasFiltradas.length} {vagasFiltradas.length === 1 ? "vaga encontrada" : "vagas encontradas"} em {empresaInfo.nome}
          </p>
          {(filtros.busca || filtros.departamento !== "todos" || filtros.tipo !== "todos" || filtros.localizacao !== "todos") && (
            <Button 
              onClick={limparFiltros}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Lista de Vagas */}
        <div className="grid grid-cols-1 gap-4">
          {vagasFiltradas.map((vaga) => (
            <Card key={vaga.id} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
                        <Briefcase className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-white">{vaga.titulo}</h3>
                            <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {vaga.localizacao}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {calcularDiasDesdePublicacao(vaga.data_abertura)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Encerra em {formatarData(vaga.data_fechamento)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {getStatusBadge(vaga.status)}
                            {getTipoBadge(vaga.tipoVaga)}
                          </div>
                        </div>

                        <p className="text-slate-300 mt-3">
                          {vaga.descricao || "Venha fazer parte do nosso time de profissionais!"}
                        </p>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Requisitos:</h4>
                          <p className="text-slate-400 text-sm line-clamp-2">{vaga.requisitos}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-700">
                          <div>
                            <p className="text-slate-500 text-xs">Departamento</p>
                            <p className="text-white font-medium">{vaga.departamento_nome}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Tipo de Vaga</p>
                            <p className="text-white font-medium">{vaga.tipoVaga}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Tipo de Contrato</p>
                            <p className="text-white font-medium">{vaga.tipo_contrato}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Salário</p>
                            <p className="text-cyan-400 font-medium">
                            {vaga.salario_min && vaga.salario_max 
                              ? `${Number.parseInt(vaga.salario_min)} KZ-${Number.parseInt(vaga.salario_max)} KZ`
                              : vaga.salario_min 
                                ? `A partir de ${vaga.salario_min}KZ`
                                : vaga.salario_max
                                  ? `Até ${vaga.salario_max}KZ`
                                  : "Não especificado"
                            }
                          </p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Localização</p>
                            <p className="text-cyan-400 font-medium">{vaga.localizacao}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Status</p>
                            <div className="mt-1">
                              {getStatusBadge(vaga.status)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                          <Button
                            onClick={() => abrirModalCandidatura(vaga)}
                            disabled={vaga.status === 'fechada'}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {vaga.status === 'fechada' ? 'Vaga Fechada' : 'Candidatar-se'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => abrirModalDetalhes(vaga)}
                            className="border-slate-600 text-slate-300 bg-transparent hover:bg-slate-700"
                          >
                            Ver Detalhes
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400">
                            <Heart className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-cyan-400">
                            <Share2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nenhuma vaga encontrada */}
        {vagasFiltradas.length === 0 && !loading && (
          <Card className="bg-slate-800/50 border-slate-700 text-center py-12">
            <CardContent>
              <Briefcase className="mx-auto h-12 w-12 text-slate-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-slate-400 mb-6">
                Não encontramos vagas correspondentes aos seus filtros em {empresaInfo.nome}.
              </p>
              <Button 
                onClick={limparFiltros}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                Limpar todos os filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Detalhes da Vaga */}
      <Dialog open={modalDetalhesAberto} onOpenChange={setModalDetalhesAberto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
          {vagaDetalhes && (
            <>
              <DialogHeader className="border-b border-slate-700 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-2xl text-white flex items-center gap-2">
                      <Briefcase className="w-6 h-6 text-cyan-400" />
                      {vagaDetalhes.titulo}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 mt-2">
                      {vagaDetalhes.empresa_nome || empresaInfo.nome} • {vagaDetalhes.departamento_nome}
                    </DialogDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(vagaDetalhes.status)}
                    {getTipoBadge(vagaDetalhes.tipoVaga)}
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Informações Rápidas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-center">
                    <MapPin className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Localização</p>
                    <p className="text-white font-medium">{vagaDetalhes.localizacao}</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Publicada</p>
                    <p className="text-white font-medium">{calcularDiasDesdePublicacao(vagaDetalhes.data_abertura)}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Encerra em</p>
                    <p className="text-white font-medium">{formatarData(vagaDetalhes.data_fechamento)}</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Tipo</p>
                    <p className="text-white font-medium">{vagaDetalhes.tipoVaga}</p>
                  </div>
                </div>

                <Tabs defaultValue="descricao" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                    <TabsTrigger value="descricao" className="text-slate-300 data-[state=active]:bg-slate-600">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Descrição
                    </TabsTrigger>
                    <TabsTrigger value="requisitos" className="text-slate-300 data-[state=active]:bg-slate-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Requisitos
                    </TabsTrigger>
                    <TabsTrigger value="beneficios" className="text-slate-300 data-[state=active]:bg-slate-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      Empresa
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="descricao" className="space-y-4 mt-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Sobre a Vaga</h3>
                      <p className="text-slate-300 leading-relaxed">
                        {vagaDetalhes.descricao || "Esta é uma oportunidade única para fazer parte de uma equipe inovadora e crescer profissionalmente em um ambiente dinâmico e desafiador."}
                      </p>
                    </div>

                    {vagaDetalhes.responsabilidades && (
                      <div>
                        <h4 className="text-md font-semibold text-white mb-2">Responsabilidades</h4>
                        <div className="space-y-2">
                          {formatarRequisitos(vagaDetalhes.responsabilidades).map((responsabilidade, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-slate-300">{responsabilidade}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="requisitos" className="space-y-4 mt-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Requisitos e Qualificações</h3>
                      <div className="space-y-3">
                        {formatarRequisitos(vagaDetalhes.requisitos).map((requisito, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-slate-300">{requisito}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {vagaDetalhes.qualificacoes && (
                      <div>
                        <h4 className="text-md font-semibold text-white mb-2">Qualificações Desejadas</h4>
                        <div className="space-y-2">
                          {formatarRequisitos(vagaDetalhes.qualificacoes).map((qualificacao, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-slate-300">{qualificacao}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="beneficios" className="space-y-4 mt-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Sobre a {empresaInfo.nome}</h3>
                      <p className="text-slate-300 leading-relaxed">
                        {empresaInfo.descricao || "Empresa inovadora comprometida com o desenvolvimento de talentos e a criação de um ambiente de trabalho inspirador."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-md font-semibold text-white mb-2">Informações da Empresa</h4>
                        <div className="space-y-2 text-slate-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                            <span>{empresaInfo.endereco || "Localização não especificada"}</span>
                          </div>
                          {empresaInfo.website && (
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-cyan-400" />
                              <a href={empresaInfo.website} className="text-cyan-400 hover:underline">
                                {empresaInfo.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {vagaDetalhes.beneficios && (
                        <div>
                          <h4 className="text-md font-semibold text-white mb-2">Benefícios</h4>
                          <div className="space-y-2">
                            {formatarRequisitos(vagaDetalhes.beneficios).map((beneficio, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                                <p className="text-slate-300">{beneficio}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <Button
                  onClick={() => {
                    fecharModalDetalhes()
                    abrirModalCandidatura(vagaDetalhes)
                  }}
                  disabled={vagaDetalhes.status === 'fechada'}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {vagaDetalhes.status === 'fechada' ? 'Vaga Fechada' : 'Candidatar-se Agora'}
                </Button>
                <Button
                  variant="outline"
                  onClick={fecharModalDetalhes}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Fechar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={modalCandidaturaAberto} onOpenChange={setModalCandidaturaAberto}>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
    <DialogHeader className="border-b border-slate-700 pb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
          <Briefcase className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <DialogTitle className="text-2xl text-white">
            Candidatar-se na {empresaInfo.nome}
          </DialogTitle>
          <DialogDescription className="text-slate-400 mt-1">
            Preencha os dados abaixo para se candidatar à vaga
            {vagaSelecionada && `: ${vagaSelecionada.titulo}`}
          </DialogDescription>
        </div>
      </div>
    </DialogHeader>

    <div className="space-y-6 py-4">
      {/* Dados Pessoais */}
      <div className="space-y-4 p-4 bg-slate-700/30 rounded-lg">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          Dados Pessoais
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className='flex flex-col gap-2'>
            <Label className="text-slate-300">Nome Completo <span className="text-red-400">*</span></Label>
            <Input 
              type="text"
              value={candidatura.nome}
              onChange={(e) => handleCandidaturaChange('nome', e.target.value)}
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label className="text-slate-300">Email <span className="text-red-400">*</span></Label>
            <Input 
              type="email"
              value={candidatura.email}
              onChange={(e) => handleCandidaturaChange('email', e.target.value)}
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              placeholder="seu.email@exemplo.com"
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label className="text-slate-300">Telefone <span className="text-red-400">*</span></Label>
            <Input 
              type="tel"
              value={candidatura.telefone}
              onChange={(e) => handleCandidaturaChange('telefone', e.target.value)}
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              placeholder="(+244) 900 000 000"
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label className="text-slate-300">LinkedIn</Label>
            <Input 
              type="url"
              value={candidatura.linkedin}
              onChange={(e) => handleCandidaturaChange('linkedin', e.target.value)}
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              placeholder="https://linkedin.com/in/seu-perfil"
            />
          </div>
        </div>
      </div>

      {/* Informações Profissionais */}
      <div className="space-y-4 p-4 bg-slate-700/30 rounded-lg">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Informações Profissionais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className='flex flex-col gap-2'>
            <Label className="text-slate-300">Experiência (anos)</Label>
            <Input 
              type="number"
              value={candidatura.experiencia}
              onChange={(e) => handleCandidaturaChange('experiencia', e.target.value)}
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              placeholder="0"
              min="0"
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label className="text-slate-300">Formação Acadêmica</Label>
            <Input 
              type="text"
              value={candidatura.formacao}
              onChange={(e) => handleCandidaturaChange('formacao', e.target.value)}
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              placeholder="Ex: Engenharia de Software"
            />
          </div>

          <div className='flex flex-col gap-2 md:col-span-2'>
            <Label className="text-slate-300">Habilidades</Label>
            <Textarea 
              value={candidatura.habilidades}
              onChange={(e) => handleCandidaturaChange('habilidades', e.target.value)}
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 min-h-[80px]"
              placeholder="Liste suas principais habilidades técnicas e comportamentais..."
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label className="text-slate-300">Pretensão Salarial (AOA)</Label>
            <Input 
              type="number"
              value={candidatura.pretensaoSalarial}
              onChange={(e) => handleCandidaturaChange('pretensaoSalarial', e.target.value)}
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              placeholder="Ex: 250000"
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label className="text-slate-300">Disponibilidade</Label>
            <Select value={candidatura.disponibilidade} onValueChange={(value) => handleCandidaturaChange('disponibilidade', value)}>
              <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                <SelectValue placeholder="Selecione sua disponibilidade" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="Imediata" className="text-slate-300 hover:bg-slate-700">Imediata</SelectItem>
                <SelectItem value="15 dias" className="text-slate-300 hover:bg-slate-700">15 dias</SelectItem>
                <SelectItem value="30 dias" className="text-slate-300 hover:bg-slate-700">30 dias</SelectItem>
                <SelectItem value="60 dias" className="text-slate-300 hover:bg-slate-700">60 dias</SelectItem>
                <SelectItem value="A combinar" className="text-slate-300 hover:bg-slate-700">A combinar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 bg-slate-700/30 rounded-lg">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-400" />
          Documentos e Informações Adicionais
        </h3>

        <div className="space-y-4">
          <div className='flex flex-col gap-2'>
            <Label className="text-slate-300">Currículo (PDF/DOC) <span className="text-red-400">*</span></Label>
            <Input 
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                if(e.target.files && e.target.files[0]) {
                  handleCandidaturaChange('curriculo', e.target.files[0])
                }
              }}
              className="bg-slate-900 border-slate-600 text-white file:text-slate-300 file:bg-slate-800 file:border-0 file:rounded-md file:px-3 file:py-2"
              required
            />
            {candidatura.curriculo && (
              <p className="text-sm text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Arquivo selecionado: {candidatura.curriculo.name}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <Label className="text-slate-300">Como ficou a saber desta vaga?</Label>
            <Select value={candidatura.fonte} onValueChange={(value) => handleCandidaturaChange('fonte', value)}>
              <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                <SelectValue placeholder="Selecione a fonte" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="Site da Empresa" className="text-slate-300 hover:bg-slate-700">Site da Empresa</SelectItem>
                <SelectItem value="LinkedIn" className="text-slate-300 hover:bg-slate-700">LinkedIn</SelectItem>
                <SelectItem value="Indicação" className="text-slate-300 hover:bg-slate-700">Indicação</SelectItem>
                <SelectItem value="Outro" className="text-slate-300 hover:bg-slate-700">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label className="text-slate-300">Observações Adicionais</Label>
            <Textarea 
              value={candidatura.observacoes}
              onChange={(e) => handleCandidaturaChange('observacoes', e.target.value)}
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 min-h-[100px]"
              placeholder="Conte-nos mais sobre você, suas experiências e por que se interessa por esta vaga e empresa..."
            />
          </div>
        </div>
      </div>
    </div>

    <div className="flex gap-3 pt-4 border-t border-slate-700">
      <Button 
        onClick={enviarCandidatura}
        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 font-semibold"
      >
        <CheckCircle className="w-5 h-5 mr-2" />
        Enviar Candidatura
      </Button>
      <Button 
        variant="outline"
        onClick={fecharModalCandidatura}
        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white py-3"
      >
        <X className="w-5 h-5 mr-2" />
        Cancelar
      </Button>
    </div>
  </DialogContent>
</Dialog>
    </div>
  )
}