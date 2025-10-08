"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import {
  DollarSign,
  Users,
  Banknote,
  CheckCircle,
  Download,
  Plus,
  Eye,
  Search,
  Filter,
  UserCheck,
  TrendingUp,
  Activity,
  FileText,
  Calculator,
  CreditCard,
  Clock,
  BarChart3,
  Receipt,
  Percent,
  Calendar,
  PiggyBank,
  ArrowRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import jsPDF from "jspdf"
import "jspdf-autotable"
import autoTable from "jspdf-autotable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MetricCard } from "@/components/metrcCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number
    }
  }
}

type Recibo = {
  id: string
  funcionario: {
    id: string
    valores: {
      nome: string
      cargo?: string
    }
  }
  departamento?: string
  salario_bruto: number
  salario_liquido: number
  mes_referencia: number
  ano_referencia: number
  status: "PAGO" | "PENDENTE" | "VISUALIZADO" | "BAIXADO"
  data_pagamento?: string
  total_vencimentos: number
  total_descontos: number
  horas_extras?: number
}

type Funcionario = {
  id: string
  valores: {
    nome: string
    email?: string
    cargo?: string
  }
  departamento?: string
  data_criacao: string
  salario_bruto: number
  status?: string
}

type Departamento = {
  id: string
  nome: string
  orcamento?: number
  funcionarios_count?: number
  custo_total?: number
}

type Beneficio = {
  id: string
  tipo: string
  descricao: string
  valor: number
  status: "ativo" | "inativo"
  recorrente: boolean
}

const FolhaPagamento = () => {
  const router = useRouter()
  const { toast } = useToast()

  const [recibos, setRecibos] = useState<Recibo[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [beneficios, setBeneficios] = useState<Beneficio[]>([])
  const [loading, setLoading] = useState(true)

  const [resumo, setResumo] = useState({
    total_folha: 0,
    funcionarios: 0,
    funcionarios_ativos: 0,
    media_salarial: 0,
    proximo_pagamento: "",
    total_beneficios: 0,
    total_descontos: 0,
    folha_pendente: 0,
  })

  const [historico, setHistorico] = useState<any[]>([])
  const [relatorioMensal, setRelatorioMensal] = useState({
    funcionarios_pagos: 0,
    impostos_pagos: 0,
    total_beneficios: 0,
    total_horas_extras: 0,
  })

  const [mesReferencia, setMesReferencia] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [departamentoFilter, setDepartamentoFilter] = useState("todos")
  const [modalNovoFuncionario, setModalNovoFuncionario] = useState(false)
  const [modalAjusteSalarial, setModalAjusteSalarial] = useState(false)
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario | null>(null)

  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: "",
    email: "",
    cargo: "",
    departamento: "",
    salario_base: 0,
    data_admissao: "",
  })

  const [ajusteSalarial, setAjusteSalarial] = useState({
    funcionario_id: "",
    novo_salario: 0,
    motivo: "",
    data_efetivacao: "",
  })

  const fetchData = async () => {
    try {
      setLoading(true)

      // Buscar dados básicos em paralelo
      const [funcionariosRes, departamentosRes, beneficiosRes, recibosRes] = await Promise.all([
        fetch("https://avdserver.up.railway.app/valores/", { credentials: "include" }),
        fetch("https://avdserver.up.railway.app/departamentos/", { credentials: "include" }),
        fetch("https://avdserver.up.railway.app/beneficios/", { credentials: "include" }),
        fetch("https://avdserver.up.railway.app/recibos/", { credentials: "include" }),
      ])

      if (funcionariosRes.ok) {
        const funcionariosData = await funcionariosRes.json()
        setFuncionarios(Array.isArray(funcionariosData) ? funcionariosData : [])
      }

      if (departamentosRes.ok) {
        const departamentosData = await departamentosRes.json()
        setDepartamentos(Array.isArray(departamentosData) ? departamentosData : [])
      }

      if (beneficiosRes.ok) {
        const beneficiosData = await beneficiosRes.json()
        setBeneficios(Array.isArray(beneficiosData) ? beneficiosData : [])
      }

      if (recibosRes.ok) {
        const recibosData = await recibosRes.json()
        setRecibos(Array.isArray(recibosData) ? recibosData : [])
      }

      try {
        const resumoRes = await fetch("https://avdserver.up.railway.app/resumo-folha-completo/", {
          credentials: "include",
        })
        if (resumoRes.ok) {
          const resumoData = await resumoRes.json()
          setResumo(resumoData)
        } else {
          calcularResumoLocal()
        }
      } catch (error) {
        console.log("Resumo não disponível, calculando localmente")
        calcularResumoLocal()
      }

      // Buscar histórico
      try {
        const historicoRes = await fetch("https://avdserver.up.railway.app/historico-folha/", {
          credentials: "include",
        })
        if (historicoRes.ok) {
          const historicoData = await historicoRes.json()
          setHistorico(Array.isArray(historicoData) ? historicoData : [])
        }
      } catch (error) {
        console.log("Histórico não disponível")
      }

      // Buscar relatório mensal
      try {
        const relatorioRes = await fetch("https://avdserver.up.railway.app/relatorio-mensal-completo/", {
          credentials: "include",
        })
        if (relatorioRes.ok) {
          const relatorioData = await relatorioRes.json()
          setRelatorioMensal(relatorioData)
        }
      } catch (error) {
        console.log("Relatório mensal não disponível")
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do sistema",
        variant: "destructive",
      })
      calcularResumoLocal()
    } finally {
      setLoading(false)
    }
  }

  const calcularResumoLocal = () => {
    const funcionariosAtivos = funcionarios.filter((f) => !f.status || f.status === "ativo")
    const beneficiosAtivos = beneficios.filter((b) => b.status === "ativo")

    const totalFolha = funcionariosAtivos.reduce((sum, func) => sum + (func.salario_bruto || 0), 0)
    const totalBeneficios = beneficiosAtivos.reduce((sum, benef) => sum + (benef.valor || 0), 0)
    const mediaSalarial = funcionariosAtivos.length > 0 ? totalFolha / funcionariosAtivos.length : 0

    const hoje = new Date()
    const proximoPagamento = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 5)

    // Calcular folha pendente dos recibos
    const folhaPendente = recibos
      .filter((r) => r.status === "PENDENTE")
      .reduce((sum, r) => sum + (r.salario_liquido || 0), 0)

    setResumo({
      total_folha: totalFolha,
      funcionarios: funcionarios.length,
      funcionarios_ativos: funcionariosAtivos.length,
      media_salarial: mediaSalarial,
      proximo_pagamento: proximoPagamento.toLocaleDateString("pt-BR"),
      total_beneficios: totalBeneficios,
      total_descontos: totalFolha * 0.15,
      folha_pendente: folhaPendente,
    })

    // Calcular relatório mensal dos recibos
    const hoje_mes = hoje.getMonth() + 1
    const hoje_ano = hoje.getFullYear()
    const recibosMesAtual = recibos.filter((r) => r.mes_referencia === hoje_mes && r.ano_referencia === hoje_ano)

    setRelatorioMensal({
      funcionarios_pagos: recibosMesAtual.filter((r) => r.status === "PAGO").length,
      impostos_pagos: recibosMesAtual.reduce((sum, r) => sum + (r.total_descontos || 0), 0),
      total_beneficios: totalBeneficios,
      total_horas_extras: recibosMesAtual.reduce((sum, r) => sum + (r.horas_extras || 0), 0),
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const recibosFiltrados = recibos.filter((recibo) => {
    const nome = recibo.funcionario?.valores?.nome || ""
    const cargo = recibo.funcionario?.valores?.cargo || ""

    const matchesSearch =
      nome.toLowerCase().includes(searchTerm.toLowerCase()) || cargo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || recibo.status === statusFilter.toUpperCase()
    const matchesDepartamento = departamentoFilter === "todos" || recibo.departamento === departamentoFilter

    return matchesSearch && matchesStatus && matchesDepartamento
  })

  const funcionariosAtivos = funcionarios.filter((f) => !f.status || f.status === "ativo")

  const processarFolha = async () => {
    if (!mesReferencia) {
      Swal.fire("Atenção", "Por favor, selecione um mês de referência.", "warning")
      return
    }

    try {
      const res = await fetch("https://avdserver.up.railway.app/folha-pagamento/processar/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mes_referencia: `${mesReferencia}-01`,
          incluir_beneficios: true,
          calcular_impostos: true,
        }),
      })

      if (res.ok) {
        Swal.fire({
          title: "Sucesso!",
          text: "Folha de pagamento processada com sucesso.",
          icon: "success",
          confirmButtonColor: "#0ea5e9",
          background: "#1e293b",
          color: "white",
        })
        fetchData()
      } else {
        const error = await res.json()
        throw new Error(error.detail || "Erro ao processar a folha de pagamento.")
      }
    } catch (error: any) {
      Swal.fire({
        title: "Erro!",
        text: error.message || "Falha no processamento.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#1e293b",
        color: "white",
      })
    }
  }

  const aprovarFolha = async () => {
    if (!mesReferencia) {
      Swal.fire("Atenção", "Por favor, selecione um mês de referência para aprovação.", "warning")
      return
    }

    try {
      const res = await fetch("https://avdserver.up.railway.app/folha-pagamento/aprovar/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mes_referencia: `${mesReferencia}`,
          aprovador: "user@empresa.com",
        }),
      })

      if (res.ok) {
        Swal.fire({
          title: "Aprovado!",
          text: "Folha de pagamento aprovada e pronta para pagamento.",
          icon: "success",
          confirmButtonColor: "#0ea5e9",
          background: "#1e293b",
          color: "white",
        })
        fetchData()
      } else {
        const error = await res.json()
        throw new Error(error.detail || "Erro ao aprovar a folha de pagamento.")
      }
    } catch (error: any) {
      Swal.fire({
        title: "Erro!",
        text: error.message || "Falha na aprovação.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#1e293b",
        color: "white",
      })
    }
  }

  const adicionarFuncionario = async () => {
    try {
      const res = await fetch("https://avdserver.up.railway.app/valores/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valores: {
            nome: novoFuncionario.nome,
            email: novoFuncionario.email,
            cargo: novoFuncionario.cargo,
          },
          departamento: novoFuncionario.departamento,
          salario_bruto: novoFuncionario.salario_base,
          data_admissao: novoFuncionario.data_admissao,
        }),
      })

      if (res.ok) {
        toast({
          title: "Sucesso",
          description: "Funcionário adicionado com sucesso",
        })
        setModalNovoFuncionario(false)
        setNovoFuncionario({
          nome: "",
          email: "",
          cargo: "",
          departamento: "",
          salario_base: 0,
          data_admissao: "",
        })
        fetchData()
      } else {
        throw new Error("Erro ao adicionar funcionário")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar funcionário",
        variant: "destructive",
      })
    }
  }

  const aplicarAjusteSalarial = async () => {
    try {
      const res = await fetch(`https://avdserver.up.railway.app/valores/${ajusteSalarial.funcionario_id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salario_bruto: ajusteSalarial.novo_salario,
          observacoes: ajusteSalarial.motivo,
        }),
      })

      if (res.ok) {
        toast({
          title: "Sucesso",
          description: "Ajuste salarial aplicado com sucesso",
        })
        setModalAjusteSalarial(false)
        setAjusteSalarial({
          funcionario_id: "",
          novo_salario: 0,
          motivo: "",
          data_efetivacao: "",
        })
        fetchData()
      } else {
        throw new Error("Erro ao aplicar ajuste salarial")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao aplicar ajuste salarial",
        variant: "destructive",
      })
    }
  }

  const chartData = Array.isArray(historico)
    ? historico.map((item) => ({
        mes: item.mes ? item.mes.split("-")[1] + "/" + item.mes.split("-")[0].slice(2) : "",
        folha: item.folha || 0,
        impostos: item.impostos || 0,
        beneficios: item.beneficios || 0,
      }))
    : []

  const dataDistribuicaoDepartamentos = departamentos
    .map((depto) => {
      const funcionariosDepto = funcionarios.filter((f) => f.departamento === depto.id)
      const custoTotal = funcionariosDepto.reduce((sum, f) => sum + (f.salario_bruto || 0), 0)

      return {
        name: depto.nome,
        value: custoTotal,
      }
    })
    .filter((d) => d.value > 0)

  const COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#06b6d4"]

  const gerarPDF = () => {
    const doc = new jsPDF("p", "pt", "a4")
    const margin = 20
    let yPos = margin + 20

    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Relatório Completo de Folha de Pagamento", margin, yPos)
    yPos += 40

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Emitido em: ${new Date().toLocaleDateString("pt-BR")}`, margin, yPos)
    yPos += 30

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Resumo Financeiro Detalhado", margin, yPos)
    yPos += 30

    autoTable(doc, {
      startY: yPos,
      head: [["Total Folha", "Funcionários", "Média Salarial", "Próximo Pagamento", "Total Benefícios"]],
      body: [
        [
          `KZ ${(resumo.total_folha || 0).toLocaleString("pt-BR")}`,
          `${resumo.funcionarios_ativos || 0}/${resumo.funcionarios || 0}`,
          `KZ ${(resumo.media_salarial || 0).toLocaleString("pt-BR")}`,
          resumo.proximo_pagamento || "N/A",
          `KZ ${(resumo.total_beneficios || 0).toLocaleString("pt-BR")}`,
        ],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 5, halign: "center" },
      headStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: "bold" },
    })
    yPos = (doc as any).lastAutoTable.finalY + 20

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Distribuição por Departamento", margin, yPos)
    yPos += 30

    const departamentosData = departamentos.map((d) => {
      const funcionariosDepto = funcionarios.filter((f) => f.departamento === d.id)
      const custoTotal = funcionariosDepto.reduce((sum, f) => sum + (f.salario_bruto || 0), 0)
      const custoMedio = funcionariosDepto.length > 0 ? custoTotal / funcionariosDepto.length : 0

      return [
        d.nome,
        funcionariosDepto.length.toString(),
        `KZ ${custoTotal.toLocaleString("pt-BR")}`,
        `KZ ${Math.round(custoMedio).toLocaleString("pt-BR")}`,
      ]
    })

    autoTable(doc, {
      startY: yPos,
      head: [["Departamento", "Funcionários", "Custo Total", "Custo Médio"]],
      body: departamentosData,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: "bold" },
    })

    doc.save("relatorio-folha-pagamento-completo.pdf")
  }

  const getStatusConfig = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      PAGO: { label: "Pago", color: "bg-green-500/20 text-green-400 border-green-500/30" },
      PENDENTE: { label: "Pendente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      VISUALIZADO: { label: "Visualizado", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      BAIXADO: { label: "Baixado", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    }
    return config[status] || config.PENDENTE
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-10 w-80 mb-2 bg-slate-700" />
            <Skeleton className="h-4 w-96 bg-slate-700" />
          </div>
          <Skeleton className="h-10 w-40 bg-slate-700" />
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Folha de Pagamento
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Gestão completa de remunerações, benefícios e processamento de folha
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Button
            variant="outline"
            onClick={gerarPDF}
            className="w-full sm:w-auto gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button
            onClick={() => setModalNovoFuncionario(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Funcionário
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Folha"
          value={`KZ ${(resumo.total_folha || 0).toLocaleString("pt-BR")}`}
          icon={DollarSign}
          description={
            (resumo.folha_pendente || 0) > 0
              ? `KZ ${(resumo.folha_pendente || 0).toLocaleString("pt-BR")} pendente`
              : "Todos pagamentos em dia"
          }
          trend={{ value: 8.2, isPositive: true }}
        />
        <MetricCard
          title="Funcionários Ativos"
          value={`${resumo.funcionarios_ativos || 0}/${resumo.funcionarios || 0}`}
          icon={Users}
          description={`${funcionariosAtivos.length} colaboradores ativos`}
          trend={{ value: 3.1, isPositive: true }}
        />
        <MetricCard
          title="Média Salarial"
          value={`KZ ${(resumo.media_salarial || 0).toLocaleString("pt-BR")}`}
          icon={Banknote}
          description={`Base: ${funcionariosAtivos.length} funcionários`}
          trend={{ value: 5.4, isPositive: true }}
        />
        <MetricCard
          title="Total Benefícios"
          value={`KZ ${(resumo.total_beneficios || 0).toLocaleString("pt-BR")}`}
          icon={UserCheck}
          description={`${beneficios.filter((b) => b.status === "ativo").length} benefícios ativos`}
          trend={{ value: 2.3, isPositive: true }}
        />
      </div>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl text-white">
                <BarChart3 className="h-6 w-6 text-cyan-400" />
                Módulos do Sistema
              </CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                Acesso rápido a todas as funcionalidades de folha de pagamento
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/list/pagamento/recibos">
              <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                      <Receipt className="h-6 w-6 text-cyan-400" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Recibos de Pagamento</h3>
                  <p className="text-sm text-slate-400">
                    Visualize, gere e envie recibos de pagamento para funcionários
                  </p>
                  <Badge className="mt-3 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    {recibos.length} recibos
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            <Link href="/list/pagamento/descontos-beneficios">
              <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                      <Percent className="h-6 w-6 text-purple-400" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Descontos e Benefícios</h3>
                  <p className="text-sm text-slate-400">
                    Configure descontos obrigatórios e benefícios para funcionários
                  </p>
                  <Badge className="mt-3 bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {beneficios.filter((b) => b.status === "ativo").length} ativos
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            <Link href="/list/pagamento/ferias-decimo">
              <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
                      <Calendar className="h-6 w-6 text-green-400" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-green-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Férias e 13º Salário</h3>
                  <p className="text-sm text-slate-400">
                    Calcule e gerencie férias, períodos aquisitivos e décimo terceiro
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/list/pagamento/emprestimos">
              <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30">
                      <CreditCard className="h-6 w-6 text-orange-400" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Empréstimos e Adiantamentos</h3>
                  <p className="text-sm text-slate-400">Gerencie empréstimos consignados e adiantamentos salariais</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/list/pagamento/horas-extras">
              <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
                      <Clock className="h-6 w-6 text-blue-400" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Horas Extras e Adicionais</h3>
                  <p className="text-sm text-slate-400">Registre horas extras, adicional noturno e periculosidade</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/list/pagamento/relatorios">
              <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30">
                      <FileText className="h-6 w-6 text-yellow-400" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-yellow-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Relatórios Fiscais</h3>
                  <p className="text-sm text-slate-400">Gere relatórios fiscais e contábeis (IRT, INSS, AGT)</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/list/pagamento/simuladores">
              <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30">
                      <Calculator className="h-6 w-6 text-pink-400" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-pink-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Simuladores</h3>
                  <p className="text-sm text-slate-400">Simule folha, rescisão, reajustes e custos de contratação</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 border-slate-600 hover:border-cyan-500/50 transition-all cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-4">
                  <PiggyBank className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Mais Módulos</h3>
                <p className="text-sm text-slate-400">Novos recursos em desenvolvimento</p>
                <Badge className="mt-3 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Em breve</Badge>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-8">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-2xl text-white">
                    <Activity className="h-6 w-6 text-cyan-400" />
                    Analytics Financeiro
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Evolução e distribuição da folha de pagamento
                  </CardDescription>
                </div>
                <Select defaultValue="12meses">
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    <SelectItem value="6meses">6 meses</SelectItem>
                    <SelectItem value="12meses">12 meses</SelectItem>
                    <SelectItem value="24meses">24 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="evolucao" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                  <TabsTrigger value="evolucao" className="text-slate-300 data-[state=active]:bg-slate-600">
                    Evolução Temporal
                  </TabsTrigger>
                  <TabsTrigger value="distribuicao" className="text-slate-300 data-[state=active]:bg-slate-600">
                    Distribuição
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="evolucao" className="mt-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="mes" stroke="#cbd5e1" />
                        <YAxis stroke="#cbd5e1" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #475569",
                            borderRadius: "8px",
                            color: "white",
                          }}
                          formatter={(value) => [`KZ ${Number(value).toLocaleString("pt-BR")}`, "Valor"]}
                        />
                        <Legend />
                        <Bar dataKey="folha" name="Folha (KZ)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="impostos" name="Impostos (KZ)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="beneficios" name="Benefícios (KZ)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="distribuicao" className="mt-6">
                  <div className="h-80">
                    {dataDistribuicaoDepartamentos.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dataDistribuicaoDepartamentos}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {dataDistribuicaoDepartamentos.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #475569",
                              borderRadius: "8px",
                              color: "white",
                            }}
                            formatter={(value) => [`KZ ${Number(value).toLocaleString("pt-BR")}`, "Custo"]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-slate-400">Nenhum dado disponível para exibir</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <CardTitle className="text-white">Recibos de Pagamento</CardTitle>
                  <CardDescription className="text-slate-400">
                    {recibosFiltrados.length} recibos encontrados
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 lg:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar funcionário..."
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
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="visualizado">Visualizado</SelectItem>
                      <SelectItem value="baixado">Baixado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={departamentoFilter} onValueChange={setDepartamentoFilter}>
                    <SelectTrigger className="w-full sm:w-40 bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="todos">Todos</SelectItem>
                      {departamentos.map((depto) => (
                        <SelectItem key={depto.id} value={depto.id}>
                          {depto.nome}
                        </SelectItem>
                      ))}
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
                      <TableHead className="text-slate-300">Colaborador</TableHead>
                      <TableHead className="text-slate-300">Cargo</TableHead>
                      <TableHead className="text-slate-300">Mês/Ano</TableHead>
                      <TableHead className="text-slate-300">Bruto</TableHead>
                      <TableHead className="text-slate-300">Líquido</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-right text-slate-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recibosFiltrados.map((recibo) => {
                      const statusInfo = getStatusConfig(recibo.status)
                      const nome = recibo.funcionario?.valores?.nome || "N/A"
                      const cargo = recibo.funcionario?.valores?.cargo || "N/A"

                      return (
                        <TableRow key={recibo.id} className="border-slate-600 hover:bg-slate-700/50 transition-colors">
                          <TableCell className="font-medium text-white">{nome}</TableCell>
                          <TableCell className="text-slate-300">{cargo}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                              {recibo.mes_referencia}/{recibo.ano_referencia}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            KZ {(recibo.salario_bruto || 0).toLocaleString("pt-BR")}
                          </TableCell>
                          <TableCell className="font-semibold text-white">
                            KZ {(recibo.salario_liquido || 0).toLocaleString("pt-BR")}
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
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white hover:bg-slate-700"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                {recibosFiltrados.length === 0 && (
                  <div className="text-center py-12">
                    <Receipt className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Nenhum recibo encontrado</h3>
                    <p className="text-slate-400">Tente ajustar os filtros de pesquisa</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Gestão de Folha</CardTitle>
              <CardDescription className="text-slate-400">Ações automatizadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Mês de Referência</Label>
                <Input
                  type="month"
                  value={mesReferencia}
                  onChange={(e) => setMesReferencia(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={processarFolha}
                disabled={!mesReferencia}
              >
                <Plus className="mr-2 h-4 w-4" />
                Processar Folha
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                onClick={aprovarFolha}
                disabled={!mesReferencia}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprovar Pagamentos
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                onClick={() => setModalAjusteSalarial(true)}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Ajuste Salarial
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Recibos Gerados</span>
                <Badge className="bg-green-500/20 text-green-400">{recibos.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Pagos</span>
                <Badge className="bg-green-500/20 text-green-400">
                  {recibos.filter((r) => r.status === "PAGO").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Pendentes</span>
                <Badge className="bg-yellow-500/20 text-yellow-400">
                  {recibos.filter((r) => r.status === "PENDENTE").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Próximo Pagamento</span>
                <Badge className="bg-blue-500/20 text-blue-400">{resumo.proximo_pagamento}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Benefícios Ativos</span>
                <Badge className="bg-purple-500/20 text-purple-400">
                  {beneficios.filter((b) => b.status === "ativo").length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Resumo Mensal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Funcionários Pagos</span>
                  <span className="font-semibold text-white">{relatorioMensal.funcionarios_pagos}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Impostos Pagos</span>
                  <span className="font-semibold text-white">
                    KZ {(relatorioMensal.impostos_pagos || 0).toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Benefícios</span>
                  <span className="font-semibold text-white">
                    KZ {(relatorioMensal.total_beneficios || 0).toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Horas Extras</span>
                  <span className="font-semibold text-white">{relatorioMensal.total_horas_extras}h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={modalNovoFuncionario} onOpenChange={setModalNovoFuncionario}>
        <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-white">Adicionar Novo Funcionário</DialogTitle>
            <DialogDescription className="text-slate-400">Preencha os dados do novo colaborador</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-slate-300">
                  Nome Completo
                </Label>
                <Input
                  id="nome"
                  value={novoFuncionario.nome}
                  onChange={(e) => setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={novoFuncionario.email}
                  onChange={(e) => setNovoFuncionario({ ...novoFuncionario, email: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cargo" className="text-slate-300">
                  Cargo
                </Label>
                <Input
                  id="cargo"
                  value={novoFuncionario.cargo}
                  onChange={(e) => setNovoFuncionario({ ...novoFuncionario, cargo: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamento" className="text-slate-300">
                  Departamento
                </Label>
                <Select
                  value={novoFuncionario.departamento}
                  onValueChange={(value) => setNovoFuncionario({ ...novoFuncionario, departamento: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    {departamentos.map((depto) => (
                      <SelectItem key={depto.id} value={depto.id}>
                        {depto.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salario" className="text-slate-300">
                  Salário Base
                </Label>
                <Input
                  id="salario"
                  type="number"
                  value={novoFuncionario.salario_base}
                  onChange={(e) => setNovoFuncionario({ ...novoFuncionario, salario_base: Number(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_admissao" className="text-slate-300">
                  Data de Admissão
                </Label>
                <Input
                  id="data_admissao"
                  type="date"
                  value={novoFuncionario.data_admissao}
                  onChange={(e) => setNovoFuncionario({ ...novoFuncionario, data_admissao: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setModalNovoFuncionario(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={adicionarFuncionario}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Adicionar Funcionário
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modalAjusteSalarial} onOpenChange={setModalAjusteSalarial}>
        <DialogContent className="sm:max-w-[500px] bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-white">Ajuste Salarial</DialogTitle>
            <DialogDescription className="text-slate-400">Ajuste de remuneração para funcionário</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="funcionario" className="text-slate-300">
                Funcionário
              </Label>
              <Select
                value={ajusteSalarial.funcionario_id}
                onValueChange={(value) => setAjusteSalarial({ ...ajusteSalarial, funcionario_id: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione o funcionário" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  {funcionariosAtivos.map((func) => (
                    <SelectItem key={func.id} value={func.id}>
                      {func.valores.nome} - {func.valores.cargo || "N/A"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="novo_salario" className="text-slate-300">
                Novo Salário
              </Label>
              <Input
                id="novo_salario"
                type="number"
                value={ajusteSalarial.novo_salario}
                onChange={(e) => setAjusteSalarial({ ...ajusteSalarial, novo_salario: Number(e.target.value) })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivo" className="text-slate-300">
                Motivo do Ajuste
              </Label>
              <Textarea
                id="motivo"
                value={ajusteSalarial.motivo}
                onChange={(e) => setAjusteSalarial({ ...ajusteSalarial, motivo: e.target.value })}
                placeholder="Descreva o motivo do ajuste salarial..."
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_efetivacao" className="text-slate-300">
                Data de Efetivação
              </Label>
              <Input
                id="data_efetivacao"
                type="date"
                value={ajusteSalarial.data_efetivacao}
                onChange={(e) => setAjusteSalarial({ ...ajusteSalarial, data_efetivacao: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setModalAjusteSalarial(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={aplicarAjusteSalarial}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Aplicar Ajuste
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FolhaPagamento
