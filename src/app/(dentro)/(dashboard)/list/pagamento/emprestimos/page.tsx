"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  FileText, 
  CheckCircle, 
  XCircle,
  Clock,
  Calendar,
  Plus,
  Eye,
  Percent
} from "lucide-react"

// Interfaces baseadas nos modelos Django
interface Emprestimo {
  id: number
  funcionario: number
  valor_solicitado: string
  valor_aprovado: string | null
  numero_parcelas: number
  valor_parcela: string
  taxa_juros: string
  valor_total: string
  parcelas_pagas: number
  valor_pago: string
  saldo_devedor: string
  data_solicitacao: string
  data_aprovacao: string | null
  data_primeira_parcela: string | null
  status: 'SOLICITADO' | 'APROVADO' | 'REJEITADO' | 'EM_PAGAMENTO' | 'QUITADO' | 'CANCELADO'
  motivo: string
  aprovado_por: number | null
  observacoes: string
}

interface ParcelaEmprestimo {
  id: number
  emprestimo: number
  numero_parcela: number
  valor: string
  data_vencimento: string
  data_pagamento: string | null
  status: 'PENDENTE' | 'PAGA' | 'ATRASADA'
  recibo: number | null
}

interface Funcionario {
  id: number
  nome: string
  email: string
}

const EmprestimosPage = () => {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
  const [parcelas, setParcelas] = useState<ParcelaEmprestimo[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [loading, setLoading] = useState(false)
  const [solicitando, setSolicitando] = useState(false)
  const [aprovando, setAprovando] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [aprovacaoDialogOpen, setAprovacaoDialogOpen] = useState(false)
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false)
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState<Emprestimo | null>(null)
  const [motivoRejeicao, setMotivoRejeicao] = useState("")
  const [valorAprovado, setValorAprovado] = useState("")
  const [taxaJuros, setTaxaJuros] = useState("0")
  const [userRole, setUserRole] = useState<'admin' | 'funcionario'>('funcionario')
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  
  // Form data
  const [valorSolicitado, setValorSolicitado] = useState("")
  const [numeroParcelas, setNumeroParcelas] = useState("12")
  const [motivo, setMotivo] = useState("")

  const { toast } = useToast()

  // Carregar dados iniciais
  useEffect(() => {
    carregarDadosIniciais()
  }, [])

  const carregarDadosIniciais = async () => {
    setLoading(true)
    try {
      // Em produção, essas chamadas seriam para a API real
      await Promise.all([
        carregarEmprestimos(),
        carregarFuncionarios(),
        carregarParcelas()
      ])
      
      // Simular dados do usuário atual
      setCurrentUserId(1) // Em produção, viria do contexto de autenticação
      setUserRole('admin') // Em produção, viria do contexto de autenticação
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const carregarEmprestimos = async () => {
    try {
      // Simular chamada API - GET /emprestimos/
      const token = localStorage.getItem('token')
      const response = await fetch('/api/emprestimos/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setEmprestimos(data)
      } else {
        // Fallback para dados mock
        const mockEmprestimos: Emprestimo[] = [
          {
            id: 1,
            funcionario: 1,
            valor_solicitado: "1000000",
            valor_aprovado: "1000000",
            numero_parcelas: 12,
            valor_parcela: "91666.67",
            taxa_juros: "0",
            valor_total: "1100000",
            parcelas_pagas: 2,
            valor_pago: "183333.34",
            saldo_devedor: "916666.66",
            data_solicitacao: "2024-01-15",
            data_aprovacao: "2024-01-18",
            data_primeira_parcela: "2024-02-15",
            status: 'EM_PAGAMENTO',
            motivo: "Empréstimo para reforma da casa",
            aprovado_por: 1,
            observacoes: ""
          },
          {
            id: 2,
            funcionario: 2,
            valor_solicitado: "500000",
            valor_aprovado: null,
            numero_parcelas: 6,
            valor_parcela: "0",
            taxa_juros: "0",
            valor_total: "0",
            parcelas_pagas: 0,
            valor_pago: "0",
            saldo_devedor: "0",
            data_solicitacao: "2024-01-20",
            data_aprovacao: null,
            data_primeira_parcela: null,
            status: 'SOLICITADO',
            motivo: "Empréstimo emergencial para saúde",
            aprovado_por: null,
            observacoes: ""
          }
        ]
        setEmprestimos(mockEmprestimos)
      }
    } catch (error) {
      console.error('Erro ao carregar empréstimos:', error)
    }
  }

  const carregarFuncionarios = async () => {
    try {
      // Simular chamada API
      const mockFuncionarios: Funcionario[] = [
        { id: 1, nome: "João Silva", email: "joao@empresa.com" },
        { id: 2, nome: "Maria Santos", email: "maria@empresa.com" },
        { id: 3, nome: "Pedro Oliveira", email: "pedro@empresa.com" }
      ]
      setFuncionarios(mockFuncionarios)
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error)
    }
  }

  const carregarParcelas = async (emprestimoId?: number) => {
    try {
      // Simular chamada API - GET /parcelas-emprestimo/
      const mockParcelas: ParcelaEmprestimo[] = [
        {
          id: 1,
          emprestimo: 1,
          numero_parcela: 1,
          valor: "91666.67",
          data_vencimento: "2024-02-15",
          data_pagamento: "2024-02-14",
          status: 'PAGA',
          recibo: 1
        },
        {
          id: 2,
          emprestimo: 1,
          numero_parcela: 2,
          valor: "91666.67",
          data_vencimento: "2024-03-15",
          data_pagamento: "2024-03-14",
          status: 'PAGA',
          recibo: 2
        },
        {
          id: 3,
          emprestimo: 1,
          numero_parcela: 3,
          valor: "91666.67",
          data_vencimento: "2024-04-15",
          data_pagamento: null,
          status: 'PENDENTE',
          recibo: null
        }
      ]
      setParcelas(emprestimoId ? mockParcelas.filter(p => p.emprestimo === emprestimoId) : mockParcelas)
    } catch (error) {
      console.error('Erro ao carregar parcelas:', error)
    }
  }

  const solicitarEmprestimo = async () => {
    if (!valorSolicitado || !numeroParcelas || !motivo) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    setSolicitando(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/emprestimos/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          valor_solicitado: valorSolicitado,
          numero_parcelas: parseInt(numeroParcelas),
          motivo: motivo
        })
      })

      if (response.ok) {
        const novoEmprestimo = await response.json()
        setEmprestimos(prev => [novoEmprestimo, ...prev])
        setDialogOpen(false)
        
        // Limpar formulário
        setValorSolicitado("")
        setNumeroParcelas("12")
        setMotivo("")

        toast({
          title: "Sucesso",
          description: "Solicitação de empréstimo enviada com sucesso!",
        })
      } else {
        throw new Error('Erro na solicitação')
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao solicitar empréstimo",
        variant: "destructive"
      })
    } finally {
      setSolicitando(false)
    }
  }

  const aprovarEmprestimo = async (aprovado: boolean) => {
    if (!emprestimoSelecionado) return

    setAprovando(true)
    try {
      const token = localStorage.getItem('token')
      const url = `/api/emprestimos/${emprestimoSelecionado.id}/aprovar/`
      
      const bodyData: any = {
        acao: aprovado ? 'aprovar' : 'rejeitar'
      }

      if (aprovado) {
        bodyData.valor_aprovado = valorAprovado || emprestimoSelecionado.valor_solicitado
        bodyData.taxa_juros = taxaJuros
      } else {
        bodyData.motivo = motivoRejeicao
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      })

      if (response.ok) {
        const emprestimoAtualizado = await response.json()
        
        // Atualizar lista local
        setEmprestimos(prev => prev.map(emp => 
          emp.id === emprestimoSelecionado.id ? emprestimoAtualizado : emp
        ))

        setAprovacaoDialogOpen(false)
        setEmprestimoSelecionado(null)
        setMotivoRejeicao("")
        setValorAprovado("")
        setTaxaJuros("0")

        toast({
          title: "Sucesso",
          description: `Empréstimo ${aprovado ? 'aprovado' : 'rejeitado'} com sucesso!`,
        })
      } else {
        throw new Error('Erro na aprovação')
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao ${aprovado ? 'aprovar' : 'rejeitar'} empréstimo`,
        variant: "destructive"
      })
    } finally {
      setAprovando(false)
    }
  }

  const marcarParcelaPaga = async (parcelaId: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/parcelas-emprestimo/${parcelaId}/pagar/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const parcelaAtualizada = await response.json()
        setParcelas(prev => prev.map(p => 
          p.id === parcelaId ? parcelaAtualizada : p
        ))
        
        toast({
          title: "Sucesso",
          description: "Parcela marcada como paga!",
        })
      } else {
        throw new Error('Erro ao marcar parcela como paga')
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao marcar parcela como paga",
        variant: "destructive"
      })
    }
  }

  const calcularValorParcela = (valorTotal: string, parcelas: string, taxaJuros: string = "0") => {
    const total = parseFloat(valorTotal) || 0
    const numParcelas = parseInt(parcelas) || 1
    const taxa = parseFloat(taxaJuros) || 0
    
    if (taxa > 0) {
      // Cálculo com juros (sistema price)
      const taxaMensal = taxa / 100
      const valorParcela = (total * taxaMensal * Math.pow(1 + taxaMensal, numParcelas)) / 
                          (Math.pow(1 + taxaMensal, numParcelas) - 1)
      return valorParcela
    } else {
      // Sem juros
      return total / numParcelas
    }
  }

  const calcularValorTotal = (valorParcela: number, parcelas: number) => {
    return valorParcela * parcelas
  }

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 2,
    }).format(numValue)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO')
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      SOLICITADO: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      APROVADO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      REJEITADO: "bg-red-500/20 text-red-400 border-red-500/30",
      EM_PAGAMENTO: "bg-green-500/20 text-green-400 border-green-500/30",
      QUITADO: "bg-green-500/20 text-green-400 border-green-500/30",
      CANCELADO: "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
    
    const labels = {
      SOLICITADO: "Solicitado",
      APROVADO: "Aprovado",
      REJEITADO: "Rejeitado",
      EM_PAGAMENTO: "Em Pagamento",
      QUITADO: "Quitado",
      CANCELADO: "Cancelado"
    }

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getFuncionarioNome = (funcionarioId: number) => {
    const funcionario = funcionarios.find(f => f.id === funcionarioId)
    return funcionario ? funcionario.nome : `Funcionário ${funcionarioId}`
  }

  const emprestimosPendentes = emprestimos.filter(emp => emp.status === 'SOLICITADO')
  const parcelasVencidas = parcelas.filter(p => 
    p.status === 'PENDENTE' && new Date(p.data_vencimento) < new Date()
  )

  const meusEmprestimos = userRole === 'funcionario' && currentUserId 
    ? emprestimos.filter(emp => emp.funcionario === currentUserId)
    : emprestimos

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Gestão de Empréstimos
          </h1>
          <p className="text-lg text-slate-300">
            Solicite e gerencie empréstimos da empresa
          </p>
        </div>
        
        {userRole === 'funcionario' && (
          <Button 
            onClick={() => setDialogOpen(true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Solicitar Empréstimo
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total de Empréstimos</p>
                <p className="text-2xl font-bold text-white">{emprestimos.length}</p>
              </div>
              <DollarSign className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-400">{emprestimosPendentes.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Parcelas Vencidas</p>
                <p className="text-2xl font-bold text-red-400">{parcelasVencidas.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Valor em Aberto</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(parcelas.filter(p => p.status === 'PENDENTE').reduce((acc, p) => acc + parseFloat(p.valor), 0))}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="meus-emprestimos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
          <TabsTrigger value="meus-emprestimos" className="text-slate-300 data-[state=active]:bg-slate-700">
            <FileText className="h-4 w-4 mr-2" />
            {userRole === 'admin' ? 'Todos Empréstimos' : 'Meus Empréstimos'}
          </TabsTrigger>
          <TabsTrigger value="parcelas" className="text-slate-300 data-[state=active]:bg-slate-700">
            <Calendar className="h-4 w-4 mr-2" />
            Minhas Parcelas
          </TabsTrigger>
          {userRole === 'admin' && (
            <TabsTrigger value="administrar" className="text-slate-300 data-[state=active]:bg-slate-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Administrar
            </TabsTrigger>
          )}
        </TabsList>

        {/* Meus Empréstimos Tab */}
        <TabsContent value="meus-emprestimos" className="mt-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                {userRole === 'admin' ? 'Todos os Empréstimos' : 'Meus Empréstimos'}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {userRole === 'admin' 
                  ? 'Histórico completo de empréstimos da empresa' 
                  : 'Histórico de todas as suas solicitações de empréstimo'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {meusEmprestimos.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">
                    {userRole === 'admin' ? 'Nenhum empréstimo encontrado' : 'Nenhum empréstimo solicitado'}
                  </p>
                  {userRole === 'funcionario' && (
                    <Button 
                      onClick={() => setDialogOpen(true)}
                      className="mt-4 bg-cyan-600 hover:bg-cyan-700"
                    >
                      Solicitar Primeiro Empréstimo
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      {userRole === 'admin' && <TableHead className="text-slate-300">Funcionário</TableHead>}
                      <TableHead className="text-slate-300">Valor Solicitado</TableHead>
                      <TableHead className="text-slate-300">Valor Aprovado</TableHead>
                      <TableHead className="text-slate-300">Parcelas</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Data Solicitação</TableHead>
                      <TableHead className="text-slate-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meusEmprestimos.map((emprestimo) => (
                      <TableRow key={emprestimo.id} className="border-slate-700">
                        {userRole === 'admin' && (
                          <TableCell className="text-slate-300">
                            {getFuncionarioNome(emprestimo.funcionario)}
                          </TableCell>
                        )}
                        <TableCell className="font-medium text-white">
                          {formatCurrency(emprestimo.valor_solicitado)}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {emprestimo.valor_aprovado ? formatCurrency(emprestimo.valor_aprovado) : '-'}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {emprestimo.numero_parcelas}x
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(emprestimo.status)}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {formatDate(emprestimo.data_solicitacao)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                              onClick={() => {
                                setEmprestimoSelecionado(emprestimo)
                                carregarParcelas(emprestimo.id)
                                setDetalhesDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {userRole === 'admin' && emprestimo.status === 'SOLICITADO' && (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => {
                                  setEmprestimoSelecionado(emprestimo)
                                  setValorAprovado(emprestimo.valor_solicitado)
                                  setAprovacaoDialogOpen(true)
                                }}
                              >
                                Analisar
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parcelas Tab */}
        <TabsContent value="parcelas" className="mt-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Minhas Parcelas</CardTitle>
              <CardDescription className="text-slate-400">
                Acompanhe o pagamento das parcelas dos seus empréstimos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {parcelas.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Nenhuma parcela encontrada</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Empréstimo</TableHead>
                      <TableHead className="text-slate-300">Parcela</TableHead>
                      <TableHead className="text-slate-300">Valor</TableHead>
                      <TableHead className="text-slate-300">Vencimento</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Pagamento</TableHead>
                      {userRole === 'admin' && <TableHead className="text-slate-300">Ações</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parcelas.map((parcela) => (
                      <TableRow key={parcela.id} className="border-slate-700">
                        <TableCell className="text-slate-300">
                          Empréstimo #{parcela.emprestimo}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {parcela.numero_parcela}/{parcelas.filter(p => p.emprestimo === parcela.emprestimo).length}
                        </TableCell>
                        <TableCell className="font-medium text-white">
                          {formatCurrency(parcela.valor)}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {formatDate(parcela.data_vencimento)}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            parcela.status === 'PAGA' 
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : parcela.status === 'ATRASADA'
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }>
                            {parcela.status === 'PAGA' ? 'Paga' : parcela.status === 'ATRASADA' ? 'Atrasada' : 'Pendente'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {parcela.data_pagamento ? formatDate(parcela.data_pagamento) : '-'}
                        </TableCell>
                        {userRole === 'admin' && parcela.status === 'PENDENTE' && (
                          <TableCell>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => marcarParcelaPaga(parcela.id)}
                            >
                              Marcar Paga
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Administrar Tab (Apenas Admin) */}
        {userRole === 'admin' && (
          <TabsContent value="administrar" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Empréstimos Pendentes */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-400" />
                    Empréstimos Pendentes
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Solicitações aguardando aprovação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {emprestimosPendentes.length === 0 ? (
                    <div className="text-center py-4">
                      <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <p className="text-slate-400">Nenhum empréstimo pendente</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {emprestimosPendentes.map((emprestimo) => (
                        <div key={emprestimo.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-white text-lg">
                                {getFuncionarioNome(emprestimo.funcionario)}
                              </h4>
                              <p className="text-slate-400 text-sm">{emprestimo.motivo}</p>
                              <p className="text-slate-300 text-sm mt-1">
                                Valor: {formatCurrency(emprestimo.valor_solicitado)} | {emprestimo.numero_parcelas}x parcelas
                              </p>
                            </div>
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              Pendente
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm">
                              Solicitado em {formatDate(emprestimo.data_solicitacao)}
                            </span>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => {
                                setEmprestimoSelecionado(emprestimo)
                                setValorAprovado(emprestimo.valor_solicitado)
                                setAprovacaoDialogOpen(true)
                              }}
                            >
                              Analisar Solicitação
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Parcelas Vencidas */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    Parcelas Vencidas
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Parcelas com pagamento em atraso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {parcelasVencidas.length === 0 ? (
                    <div className="text-center py-4">
                      <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <p className="text-slate-400">Nenhuma parcela vencida</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {parcelasVencidas.map((parcela) => (
                        <div key={parcela.id} className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-white">
                                Parcela {parcela.numero_parcela} - {formatCurrency(parcela.valor)}
                              </p>
                              <p className="text-red-400 text-sm">
                                Empréstimo #{parcela.emprestimo} | Vencida em {formatDate(parcela.data_vencimento)}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => marcarParcelaPaga(parcela.id)}
                            >
                              Marcar Paga
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Dialog de Solicitação de Empréstimo */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Solicitar Empréstimo</DialogTitle>
            <DialogDescription className="text-slate-400">
              Preencha os dados para solicitar um novo empréstimo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Valor Solicitado (AOA)</Label>
              <Input
                type="number"
                placeholder="Ex: 1000000"
                className="bg-slate-700 border-slate-600 text-white"
                value={valorSolicitado}
                onChange={(e) => setValorSolicitado(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Número de Parcelas</Label>
              <Select value={numeroParcelas} onValueChange={setNumeroParcelas}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="6">6 parcelas</SelectItem>
                  <SelectItem value="12">12 parcelas</SelectItem>
                  <SelectItem value="18">18 parcelas</SelectItem>
                  <SelectItem value="24">24 parcelas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Motivo do Empréstimo</Label>
              <Textarea
                placeholder="Descreva o motivo do empréstimo..."
                className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
            </div>

            {valorSolicitado && numeroParcelas && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Valor Solicitado:</span>
                      <span className="font-semibold text-white">
                        {formatCurrency(valorSolicitado)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Número de Parcelas:</span>
                      <span className="font-semibold text-white">{numeroParcelas}x</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-slate-600 text-slate-300"
            >
              Cancelar
            </Button>
            <Button 
              onClick={solicitarEmprestimo}
              disabled={solicitando}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {solicitando ? "Enviando..." : "Solicitar Empréstimo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Aprovação/Rejeição */}
      <Dialog open={aprovacaoDialogOpen} onOpenChange={setAprovacaoDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">
              Analisar Empréstimo - {emprestimoSelecionado && getFuncionarioNome(emprestimoSelecionado.funcionario)}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Aprove ou rejeite a solicitação de empréstimo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <p className="text-slate-300 mb-2">
                <strong>Motivo:</strong> {emprestimoSelecionado?.motivo}
              </p>
              <p className="text-slate-300 mb-2">
                <strong>Valor Solicitado:</strong> {emprestimoSelecionado && formatCurrency(emprestimoSelecionado.valor_solicitado)}
              </p>
              <p className="text-slate-300">
                <strong>Parcelas Solicitadas:</strong> {emprestimoSelecionado?.numero_parcelas}x
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Valor Aprovado (AOA)</Label>
              <Input
                type="number"
                placeholder="Valor a ser aprovado"
                className="bg-slate-700 border-slate-600 text-white"
                value={valorAprovado}
                onChange={(e) => setValorAprovado(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Taxa de Juros Mensal (%)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="Ex: 1.5"
                className="bg-slate-700 border-slate-600 text-white"
                value={taxaJuros}
                onChange={(e) => setTaxaJuros(e.target.value)}
              />
            </div>

            {valorAprovado && numeroParcelas && taxaJuros && (
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Valor da Parcela:</span>
                      <span className="font-semibold text-white">
                        {formatCurrency(calcularValorParcela(valorAprovado, numeroParcelas, taxaJuros))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Total a Pagar:</span>
                      <span className="font-semibold text-white">
                        {formatCurrency(calcularValorTotal(
                          calcularValorParcela(valorAprovado, numeroParcelas, taxaJuros),
                          parseInt(numeroParcelas)
                        ))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label className="text-slate-300">Motivo da Rejeição (opcional)</Label>
              <Textarea
                placeholder="Caso rejeite, informe o motivo..."
                className="bg-slate-700 border-slate-600 text-white"
                value={motivoRejeicao}
                onChange={(e) => setMotivoRejeicao(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setAprovacaoDialogOpen(false)
                setMotivoRejeicao("")
                setValorAprovado("")
                setTaxaJuros("0")
              }}
              className="border-slate-600 text-slate-300 flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => aprovarEmprestimo(false)}
              disabled={aprovando}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600/20 flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeitar
            </Button>
            <Button 
              onClick={() => aprovarEmprestimo(true)}
              disabled={aprovando || !valorAprovado}
              className="bg-green-600 hover:bg-green-700 flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Detalhes do Empréstimo */}
      <Dialog open={detalhesDialogOpen} onOpenChange={setDetalhesDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">
              Detalhes do Empréstimo
            </DialogTitle>
          </DialogHeader>
          
          {emprestimoSelecionado && (
            <div className="space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Valor Solicitado</Label>
                  <p className="text-white font-semibold">{formatCurrency(emprestimoSelecionado.valor_solicitado)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Valor Aprovado</Label>
                  <p className="text-white font-semibold">
                    {emprestimoSelecionado.valor_aprovado ? formatCurrency(emprestimoSelecionado.valor_aprovado) : '-'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Parcelas</Label>
                  <p className="text-white font-semibold">{emprestimoSelecionado.numero_parcelas}x</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Taxa de Juros</Label>
                  <p className="text-white font-semibold">{emprestimoSelecionado.taxa_juros}%</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Status</Label>
                  <div>{getStatusBadge(emprestimoSelecionado.status)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Data Solicitação</Label>
                  <p className="text-white font-semibold">{formatDate(emprestimoSelecionado.data_solicitacao)}</p>
                </div>
              </div>

              {/* Resumo Financeiro */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Valor Total:</span>
                    <span className="font-semibold text-white">{formatCurrency(emprestimoSelecionado.valor_total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Valor Pago:</span>
                    <span className="font-semibold text-green-400">{formatCurrency(emprestimoSelecionado.valor_pago)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Saldo Devedor:</span>
                    <span className="font-semibold text-red-400">{formatCurrency(emprestimoSelecionado.saldo_devedor)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Parcelas Pagas:</span>
                    <span className="font-semibold text-white">
                      {emprestimoSelecionado.parcelas_pagas}/{emprestimoSelecionado.numero_parcelas}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Parcelas */}
              <div>
                <Label className="text-slate-400 mb-3 block">Parcelas</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {parcelas.filter(p => p.emprestimo === emprestimoSelecionado.id).map((parcela) => (
                    <div key={parcela.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-white">Parcela {parcela.numero_parcela}</span>
                          <span className="text-slate-400 text-sm ml-2">
                            - {formatCurrency(parcela.valor)} | Vencimento: {formatDate(parcela.data_vencimento)}
                          </span>
                        </div>
                        <Badge className={
                          parcela.status === 'PAGA' 
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : parcela.status === 'ATRASADA'
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }>
                          {parcela.status === 'PAGA' ? 'Paga' : parcela.status === 'ATRASADA' ? 'Atrasada' : 'Pendente'}
                        </Badge>
                      </div>
                      {parcela.data_pagamento && (
                        <p className="text-slate-400 text-sm mt-1">
                          Pago em: {formatDate(parcela.data_pagamento)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EmprestimosPage