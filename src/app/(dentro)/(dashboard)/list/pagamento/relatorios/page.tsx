"use client"

import { useState, useEffect,useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MetricCard } from "@/components/metrcCard"
import { FileText, Download, TrendingUp, DollarSign, Users, BarChart3, FileSpreadsheet, FileCheck, Search, Filter, Plus, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import Swal from "sweetalert2"
import jsPDF from "jspdf"
import "jspdf-autotable"
import autoTable from "jspdf-autotable"

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number
    }
  }
}

interface RelatorioFiscal {
  id: string
  tipo: "RELATÓRIO_INSS" | "DECLARAÇÃO_IRT" | "RELATÓRIO_SGRP" | "MAPA_OBRIGAÇÕES" | "RELATÓRIO_UNIFICADO"
  periodo: string
  dataGeracao: string
  status: "GERADO" | "ENVIADO" | "PROCESSANDO"
  totalFuncionarios: number
  totalRemuneracao: number
  totalEncargos: number
}

interface RelatorioContabil {
  id: string
  tipo: "FOLHA_ANALITICA" | "FOLHA_SINTETICA" | "PROVISOES" | "ENCARGOS"
  periodo: string
  dataGeracao: string
  totalBruto: number
  totalDescontos: number
  totalLiquido: number
  totalEncargos: number
}

const RelatoriosPage = () => {
  const { toast } = useToast()
  const [periodoSelecionado, setPeriodoSelecionado] = useState("2024-01")
  const [tipoRelatorioFiscal, setTipoRelatorioFiscal] = useState("RELATÓRIO_INSS")
  const [tipoRelatorioContabil, setTipoRelatorioContabil] = useState("FOLHA_ANALITICA")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  // Estados para dados reais
  const [relatoriosFiscais, setRelatoriosFiscais] = useState<RelatorioFiscal[]>([])
  const [relatoriosContabeis, setRelatoriosContabeis] = useState<RelatorioContabil[]>([])
  const [stats, setStats] = useState({
    totalFolha: 0,
    totalEncargos: 0,
    totalFuncionarios: 0,
    custoMedio: 0,
  })

  // Buscar dados reais do backend
  const fetchData =useCallback( async () => {
    try {
      setLoading(true)

      // Buscar relatórios fiscais
      const fiscaisRes = await fetch("https://recursohumanosactualizado.onrender.com/relatorios-fiscais/", { 
        credentials: "include" 
      })
      if (fiscaisRes.ok) {
        const fiscaisData = await fiscaisRes.json()
        setRelatoriosFiscais(Array.isArray(fiscaisData) ? fiscaisData : [])
      }

      // Buscar relatórios contábeis
      const contabeisRes = await fetch("https://recursohumanosactualizado.onrender.com/relatorios-contabeis/", { 
        credentials: "include" 
      })
      if (contabeisRes.ok) {
        const contabeisData = await contabeisRes.json()
        setRelatoriosContabeis(Array.isArray(contabeisData) ? contabeisData : [])
      }

      // Buscar estatísticas
      const statsRes = await fetch("https://recursohumanosactualizado.onrender.com/resumo-folha-completo/", { 
        credentials: "include" 
      })
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats({
          totalFolha: statsData.total_folha || 0,
          totalEncargos: statsData.total_descontos || 0,
          totalFuncionarios: statsData.funcionarios_ativos || 0,
          custoMedio: statsData.media_salarial || 0,
        })
      }

    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do sistema",
        variant: "destructive",
      })
      // Fallback para dados mock em caso de erro
      carregarDadosMock()
    } finally {
      setLoading(false)
    }
  },[toast])

  // Dados mock como fallback
  const carregarDadosMock = () => {
    const mockFiscais: RelatorioFiscal[] = [
      {
        id: "1",
        tipo: "RELATÓRIO_INSS",
        periodo: "2024-01",
        dataGeracao: "2024-02-05",
        status: "ENVIADO",
        totalFuncionarios: 150,
        totalRemuneracao: 125000000,
        totalEncargos: 15000000,
      },
      {
        id: "2",
        tipo: "DECLARAÇÃO_IRT",
        periodo: "2023",
        dataGeracao: "2024-03-31",
        status: "GERADO",
        totalFuncionarios: 150,
        totalRemuneracao: 1500000000,
        totalEncargos: 225000000,
      },
    ]

    const mockContabeis: RelatorioContabil[] = [
      {
        id: "1",
        tipo: "FOLHA_ANALITICA",
        periodo: "2024-01",
        dataGeracao: "2024-02-05",
        totalBruto: 125000000,
        totalDescontos: 37500000,
        totalLiquido: 87500000,
        totalEncargos: 10000000,
      },
      {
        id: "2",
        tipo: "PROVISOES",
        periodo: "2024-01",
        dataGeracao: "2024-02-05",
        totalBruto: 125000000,
        totalDescontos: 0,
        totalLiquido: 0,
        totalEncargos: 18750000,
      },
    ]

    setRelatoriosFiscais(mockFiscais)
    setRelatoriosContabeis(mockContabeis)
    setStats({
      totalFolha: 125000000,
      totalEncargos: 25000000,
      totalFuncionarios: 150,
      custoMedio: 833333,
    })
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      GERADO: { label: "Gerado", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      ENVIADO: { label: "Enviado", color: "bg-green-500/20 text-green-400 border-green-500/30" },
      PROCESSANDO: { label: "Processando", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    }
    return configs[status as keyof typeof configs] || { label: status, color: "bg-gray-500/20 text-gray-400" }
  }

  const gerarRelatorioFiscal = async () => {
    try {
      const res = await fetch("https://recursohumanosactualizado.onrender.com/relatorios-fiscais/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: tipoRelatorioFiscal,
          periodo: periodoSelecionado,
          formato: "PDF"
        }),
      })

      if (res.ok) {
        Swal.fire({
          title: "Sucesso!",
          text: "Relatório fiscal gerado com sucesso.",
          icon: "success",
          confirmButtonColor: "#0ea5e9",
          background: "#1e293b",
          color: "white",
        })
        fetchData()
      } else {
        throw new Error("Erro ao gerar relatório fiscal")
      }
    } catch (error: any) {
      Swal.fire({
        title: "Erro!",
        text: error.message || "Falha na geração do relatório.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#1e293b",
        color: "white",
      })
    }
  }

  const gerarRelatorioContabil = async () => {
    try {
      const res = await fetch("https://recursohumanosactualizado.onrender.com/relatorios-contabeis/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: tipoRelatorioContabil,
          periodo: periodoSelecionado,
          formato: "EXCEL"
        }),
      })

      if (res.ok) {
        Swal.fire({
          title: "Sucesso!",
          text: "Relatório contábil gerado com sucesso.",
          icon: "success",
          confirmButtonColor: "#0ea5e9",
          background: "#1e293b",
          color: "white",
        })
        fetchData()
      } else {
        throw new Error("Erro ao gerar relatório contábil")
      }
    } catch (error: any) {
      Swal.fire({
        title: "Erro!",
        text: error.message || "Falha na geração do relatório.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#1e293b",
        color: "white",
      })
    }
  }

  const exportarRelatorio = async (id: string, formato: "PDF" | "EXCEL" | "CSV") => {
    try {
      const res = await fetch(`https://recursohumanosactualizado.onrender.com/relatorios-fiscais/${id}/exportar/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formato }),
      })

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `relatorio-${id}.${formato.toLowerCase()}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Sucesso",
          description: "Relatório exportado com sucesso",
        })
      } else {
        throw new Error("Erro ao exportar relatório")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao exportar relatório",
        variant: "destructive",
      })
    }
  }

  const gerarPDFCompleto = () => {
    const doc = new jsPDF("p", "pt", "a4")
    const margin = 20
    let yPos = margin + 20

    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Relatório Fiscal e Contábil - Angola", margin, yPos)
    yPos += 40

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Emitido em: ${new Date().toLocaleDateString("pt-BR")}`, margin, yPos)
    yPos += 30

    // Estatísticas
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Estatísticas da Folha", margin, yPos)
    yPos += 30

    autoTable(doc, {
      startY: yPos,
      head: [["Total Folha", "Total Encargos", "Funcionários", "Custo Médio"]],
      body: [
        [
          formatCurrency(stats.totalFolha),
          formatCurrency(stats.totalEncargos),
          stats.totalFuncionarios.toString(),
          formatCurrency(stats.custoMedio),
        ],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 5, halign: "center" },
      headStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: "bold" },
    })
    yPos = (doc as any).lastAutoTable.finalY + 20

    // Relatórios Fiscais
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Relatórios Fiscais", margin, yPos)
    yPos += 30

    const fiscaisData = relatoriosFiscais.map(rel => [
      rel.tipo.replace(/_/g, " "),
      rel.periodo,
      formatDate(rel.dataGeracao),
      rel.totalFuncionarios.toString(),
      formatCurrency(rel.totalRemuneracao),
      rel.status
    ])

    autoTable(doc, {
      startY: yPos,
      head: [["Tipo", "Período", "Data", "Funcionários", "Remuneração", "Status"]],
      body: fiscaisData,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: "bold" },
    })

    doc.save("relatorio-fiscal-contabil-completo.pdf")
  }

  const relatoriosFiltrados = relatoriosFiscais.filter(relatorio =>
    relatorio.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    relatorio.periodo.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(relatorio =>
    statusFilter === "todos" || relatorio.status === statusFilter
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-10 w-80 mb-2 bg-slate-700" />
            <Skeleton className="h-4 w-96 bg-slate-700" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg bg-slate-700" />
          ))}
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
            Relatórios Fiscais e Contábeis - Angola
          </h1>
          <p className="text-lg text-slate-300">
            Gere relatórios para AGT, INSS e contabilidade da empresa
          </p>
        </div>
        <Button
          variant="outline"
          onClick={gerarPDFCompleto}
          className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
        >
          <Download className="h-4 w-4" />
          Exportar PDF Completo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total da Folha"
          value={formatCurrency(stats.totalFolha)}
          icon={DollarSign}
          description="Mês atual"
        />
        <MetricCard
          title="Total Encargos"
          value={formatCurrency(stats.totalEncargos)}
          icon={TrendingUp}
          description={`${((stats.totalEncargos / stats.totalFolha) * 100).toFixed(1)}% da folha`}
        />
        <MetricCard
          title="Total Funcionários"
          value={stats.totalFuncionarios.toString()}
          icon={Users}
          description="Ativos"
        />
        <MetricCard
          title="Custo Médio"
          value={formatCurrency(stats.custoMedio)}
          icon={BarChart3}
          description="Por funcionário"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="fiscais" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
          <TabsTrigger value="fiscais" className="text-slate-300 data-[state=active]:bg-slate-700">
            <FileCheck className="h-4 w-4 mr-2" />
            Relatórios Fiscais
          </TabsTrigger>
          <TabsTrigger value="contabeis" className="text-slate-300 data-[state=active]:bg-slate-700">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Relatórios Contábeis
          </TabsTrigger>
          <TabsTrigger value="gerar" className="text-slate-300 data-[state=active]:bg-slate-700">
            <FileText className="h-4 w-4 mr-2" />
            Gerar Relatórios
          </TabsTrigger>
        </TabsList>

        {/* Relatórios Fiscais Tab */}
        <TabsContent value="fiscais" className="mt-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <CardTitle className="text-white">Relatórios Fiscais Gerados</CardTitle>
                  <CardDescription className="text-slate-400">
                    Relatórios para AGT, INSS e outros órgãos governamentais
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 lg:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar relatório..."
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-32 bg-slate-700 border-slate-600 text-white">
                      <Filter className="h-4 w-4 mr-2 text-slate-400" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="GERADO">Gerado</SelectItem>
                      <SelectItem value="ENVIADO">Enviado</SelectItem>
                      <SelectItem value="PROCESSANDO">Processando</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-600">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-600 hover:bg-slate-700/50">
                      <TableHead className="text-slate-300">Tipo de Relatório</TableHead>
                      <TableHead className="text-slate-300">Período</TableHead>
                      <TableHead className="text-slate-300">Data Geração</TableHead>
                      <TableHead className="text-slate-300">Funcionários</TableHead>
                      <TableHead className="text-slate-300">Total Remuneração</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-right text-slate-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatoriosFiltrados.map((relatorio) => {
                      const statusInfo = getStatusConfig(relatorio.status)
                      return (
                        <TableRow key={relatorio.id} className="border-slate-600 hover:bg-slate-700/50">
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-semibold text-white">{relatorio.tipo.replace(/_/g, " ")}</p>
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                                Fiscal
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-white">
                              {relatorio.periodo.length === 4
                                ? relatorio.periodo
                                : new Date(relatorio.periodo).toLocaleDateString("pt-AO", {
                                    month: "long",
                                    year: "numeric",
                                  })}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-slate-300">{formatDate(relatorio.dataGeracao)}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-semibold text-white">{relatorio.totalFuncionarios}</p>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-bold text-green-400">{formatCurrency(relatorio.totalRemuneracao)}</p>
                              <p className="text-xs text-slate-400">
                                Encargos: {formatCurrency(relatorio.totalEncargos)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white hover:bg-slate-700"
                                onClick={() => exportarRelatorio(relatorio.id, "PDF")}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white hover:bg-slate-700"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                {relatoriosFiltrados.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Nenhum relatório encontrado</h3>
                    <p className="text-slate-400">Tente ajustar os filtros de pesquisa</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cards de Relatórios Disponíveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-cyan-500/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-cyan-400" />
                  INSS
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Relatório Mensal de Contribuições para a Segurança Social
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300 mb-4">
                  Relatório mensal obrigatório para recolhimento de contribuições para o INSS (8% patronal + 3% trabalhador).
                </p>
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">Período</Label>
                  <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="2024-01">Janeiro 2024</SelectItem>
                      <SelectItem value="2023-12">Dezembro 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 mt-4" 
                  size="sm"
                  onClick={() => {
                    setTipoRelatorioFiscal("RELATÓRIO_INSS")
                    gerarRelatorioFiscal()
                  }}
                >
                  Gerar INSS
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-cyan-500/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-cyan-400" />
                  DECLARAÇÃO IRT
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Declaração do Imposto sobre o Rendimento do Trabalho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300 mb-4">
                  Declaração mensal de valores de IRT retidos na fonte dos funcionários à AGT.
                </p>
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">Período</Label>
                  <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="2024-01">Janeiro 2024</SelectItem>
                      <SelectItem value="2023">Ano 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 mt-4" 
                  size="sm"
                  onClick={() => {
                    setTipoRelatorioFiscal("DECLARAÇÃO_IRT")
                    gerarRelatorioFiscal()
                  }}
                >
                  Gerar IRT
                </Button>
              </CardContent>
            </Card>

            {/* ... outros cards de relatórios fiscais com a mesma estrutura ... */}
          </div>
        </TabsContent>

        {/* Relatórios Contábeis Tab */}
        <TabsContent value="contabeis" className="mt-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Relatórios Contábeis Gerados</CardTitle>
              <CardDescription className="text-slate-400">
                Relatórios para contabilidade e gestão financeira
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-600">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-600 hover:bg-slate-700/50">
                      <TableHead className="text-slate-300">Tipo de Relatório</TableHead>
                      <TableHead className="text-slate-300">Período</TableHead>
                      <TableHead className="text-slate-300">Data Geração</TableHead>
                      <TableHead className="text-slate-300">Total Bruto</TableHead>
                      <TableHead className="text-slate-300">Total Líquido</TableHead>
                      <TableHead className="text-slate-300">Encargos</TableHead>
                      <TableHead className="text-right text-slate-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatoriosContabeis.map((relatorio) => (
                      <TableRow key={relatorio.id} className="border-slate-600 hover:bg-slate-700/50">
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-semibold text-white">
                              {relatorio.tipo.replace(/_/g, " ")}
                            </p>
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                              Contábil
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-white">
                            {new Date(relatorio.periodo).toLocaleDateString("pt-AO", {
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-slate-300">{formatDate(relatorio.dataGeracao)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-bold text-white">{formatCurrency(relatorio.totalBruto)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-bold text-green-400">{formatCurrency(relatorio.totalLiquido)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-bold text-orange-400">{formatCurrency(relatorio.totalEncargos)}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white hover:bg-slate-700"
                              onClick={() => exportarRelatorio(relatorio.id, "EXCEL")}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white hover:bg-slate-700"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Cards de Relatórios Contábeis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-cyan-500/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-cyan-400" />
                  Folha Analítica
                </CardTitle>
                <CardDescription className="text-slate-400">Detalhamento completo por funcionário</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300 mb-4">
                  Relatório detalhado com todos os vencimentos, descontos (INSS, IRT) e valores líquidos por funcionário.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600" 
                  size="sm"
                  onClick={() => {
                    setTipoRelatorioContabil("FOLHA_ANALITICA")
                    gerarRelatorioContabil()
                  }}
                >
                  Gerar Folha Analítica
                </Button>
              </CardContent>
            </Card>

            {/* ... outros cards de relatórios contábeis com a mesma estrutura ... */}
          </div>
        </TabsContent>

        {/* Gerar Relatórios Tab - Mantido igual ao original */}
        <TabsContent value="gerar" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gerar Relatório Fiscal */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Gerar Relatório Fiscal</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure e gere relatórios para AGT, INSS e outros órgãos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Tipo de Relatório</Label>
                  <Select value={tipoRelatorioFiscal} onValueChange={setTipoRelatorioFiscal}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="RELATÓRIO_INSS">Relatório INSS</SelectItem>
                      <SelectItem value="DECLARAÇÃO_IRT">Declaração IRT</SelectItem>
                      <SelectItem value="RELATÓRIO_SGRP">Relatório SGRP</SelectItem>
                      <SelectItem value="MAPA_OBRIGAÇÕES">Mapa de Obrigações</SelectItem>
                      <SelectItem value="RELATÓRIO_UNIFICADO">Relatório Unificado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Período</Label>
                  <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="2024-01">Janeiro 2024</SelectItem>
                      <SelectItem value="2023-12">Dezembro 2023</SelectItem>
                      <SelectItem value="2023">Ano 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Formato de Exportação</Label>
                  <Select defaultValue="PDF">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="EXCEL">Excel</SelectItem>
                      <SelectItem value="TXT">TXT (Layout Oficial)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  onClick={gerarRelatorioFiscal}
                >
                  <FileCheck className="h-4 w-4 mr-2" />
                  Gerar Relatório Fiscal
                </Button>
              </CardContent>
            </Card>

            {/* Gerar Relatório Contábil */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Gerar Relatório Contábil</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure e gere relatórios para contabilidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Tipo de Relatório</Label>
                  <Select value={tipoRelatorioContabil} onValueChange={setTipoRelatorioContabil}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="FOLHA_ANALITICA">Folha Analítica</SelectItem>
                      <SelectItem value="FOLHA_SINTETICA">Folha Sintética</SelectItem>
                      <SelectItem value="PROVISOES">Provisões</SelectItem>
                      <SelectItem value="ENCARGOS">Encargos Sociais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Período</Label>
                  <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="2024-01">Janeiro 2024</SelectItem>
                      <SelectItem value="2023-12">Dezembro 2023</SelectItem>
                      <SelectItem value="2023">Ano 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Formato de Exportação</Label>
                  <Select defaultValue="EXCEL">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="EXCEL">Excel</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  onClick={gerarRelatorioContabil}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Gerar Relatório Contábil
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resumo da Folha */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Resumo da Folha de Pagamento</CardTitle>
              <CardDescription className="text-slate-400">Período: Janeiro 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Total Bruto</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(125000000)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Total Descontos</p>
                  <p className="text-2xl font-bold text-red-400">{formatCurrency(37500000)}</p>
                  <p className="text-xs text-slate-400">(INSS 3% + IRT)</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Total Líquido</p>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(87500000)}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-600">
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Encargos Patronais (INSS 8%)</p>
                  <p className="text-xl font-bold text-orange-400">{formatCurrency(10000000)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Custo Total da Folha</p>
                  <p className="text-xl font-bold text-cyan-400">{formatCurrency(135000000)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RelatoriosPage