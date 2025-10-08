"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Users,
  Award,
  Plus,
  Download,
  Clock,
  GraduationCap,
  FileText,
  CheckCircle,
  ArrowRight,
  UserCheck,
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { MetricCard } from "@/components/metrcCard"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// ---------- Tipos ----------

type Resumo = {
  total_formacoes: number
  formacoes_ativas: number
  total_inscricoes: number
  taxa_conclusao: number
  horas_treinamento: number
  investimento_total: number
  certificados_emitidos: number
  media_satisfacao: number
}

type EvolucaoMensalItem = {
  mes: string
  formacoes: number
  participantes: number
  concluidas: number
}

type DistribuicaoTipoItem = {
  name: string
  value: number
}

type TopFormacaoItem = {
  id: string
  nome: string
  participantes: number
  avaliacao: number
  conclusao: number
}

type InvestimentoMensalItem = {
  mes: string
  planejado: number
  realizado: number
}

type DistribuicaoDepartamentoItem = {
  departamento: string
  total: number
}

// Formulários (tipos mais restritos)
type NovaFormacaoState = {
  titulo: string
  descricao: string
  categoria: "tecnica" | "comportamental" | "lideranca" | "compliance" | "idiomas" | "certificacao"
  tipo: "PRESENCIAL" | "ONLINE" | "HIBRIDO" | "EAD"
  instrutor_id: string
  carga_horaria: number
  data_inicio: string
  data_fim: string
  horario: string
  vagas_totais: number
  obrigatoria: boolean
  custo: number
  local: string
  plataforma: string
  nivel: "basico" | "intermediario" | "avancado"
  certificado: boolean
  nota_minima_aprovacao: number
}

type NovaInscricaoState = {
  funcionario_id: string
  formacao_id: string
}

type NovoInstrutorState = {
  nome: string
  especialidade: string
  email: string
  telefone: string
  tipo: "interno" | "externo"
}

type NovoPlanoState = {
  funcionario_id: string
  competencias_alvo: string[]
  formacoes_planejadas: string[]
  prazo: string
}

// ---------- Config ----------

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://recursohumanosactualizado.onrender.com"
const COLORS = ["#06b6d4", "#3b82f6", "#8b5cf6", "#10b981", "#ec4899", "#f59e0b"]

// ---------- Helpers ----------

const safeParseInt = (v: string | number | undefined, fallback = 0) => {
  if (typeof v === "number") return Math.trunc(v)
  if (!v) return fallback
  const n = Number.parseInt(String(v), 10)
  return Number.isNaN(n) ? fallback : n
}

const safeParseFloat = (v: string | number | undefined, fallback = 0) => {
  if (typeof v === "number") return v
  if (!v) return fallback
  const n = Number.parseFloat(String(v))
  return Number.isNaN(n) ? fallback : n
}

// ---------- Componente ----------

const GestaoFormacoes: React.FC = () => {
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(true)

  // resumo
  const [resumo, setResumo] = useState<Resumo>({
    total_formacoes: 0,
    formacoes_ativas: 0,
    total_inscricoes: 0,
    taxa_conclusao: 0,
    horas_treinamento: 0,
    investimento_total: 0,
    certificados_emitidos: 0,
    media_satisfacao: 0,
  })

  // gráficos / listas
  const [evolucaoMensal, setEvolucaoMensal] = useState<EvolucaoMensalItem[]>([])
  const [distribuicaoTipo, setDistribuicaoTipo] = useState<DistribuicaoTipoItem[]>([])
  const [topFormacoes, setTopFormacoes] = useState<TopFormacaoItem[]>([])
  const [investimentoMensal, setInvestimentoMensal] = useState<InvestimentoMensalItem[]>([])
  const [distribuicaoDepartamento, setDistribuicaoDepartamento] = useState<DistribuicaoDepartamentoItem[]>([])

  // selects / listas
  const [instrutores, setInstrutores] = useState<any[]>([])
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [formacoes, setFormacoes] = useState<any[]>([])

  // modals
  const [novaFormacaoOpen, setNovaFormacaoOpen] = useState(false)
  const [inscreverFuncionarioOpen, setInscreverFuncionarioOpen] = useState(false)
  const [novoInstrutorOpen, setNovoInstrutorOpen] = useState(false)
  const [novoPlanoOpen, setNovoPlanoOpen] = useState(false)

  // formulários
  const [novaFormacao, setNovaFormacao] = useState<NovaFormacaoState>({
    titulo: "",
    descricao: "",
    categoria: "tecnica",
    tipo: "PRESENCIAL",
    instrutor_id: "",
    carga_horaria: 0,
    data_inicio: "",
    data_fim: "",
    horario: "09:00 - 18:00",
    vagas_totais: 0,
    obrigatoria: false,
    custo: 0,
    local: "",
    plataforma: "",
    nivel: "basico",
    certificado: true,
    nota_minima_aprovacao: 70,
  })

  const [novaInscricao, setNovaInscricao] = useState<NovaInscricaoState>({
    funcionario_id: "",
    formacao_id: "",
  })

  const [novoInstrutor, setNovoInstrutor] = useState<NovoInstrutorState>({
    nome: "",
    especialidade: "",
    email: "",
    telefone: "",
    tipo: "interno",
  })

  const [novoPlano, setNovoPlano] = useState<NovoPlanoState>({
    funcionario_id: "",
    competencias_alvo: [],
    formacoes_planejadas: [],
    prazo: "",
  })

  // submitting states
  const [isCreatingFormacao, setIsCreatingFormacao] = useState(false)
  const [isInscrevendo, setIsInscrevendo] = useState(false)
  const [isCreatingInstrutor, setIsCreatingInstrutor] = useState(false)
  const [isCreatingPlano, setIsCreatingPlano] = useState(false)

  // ---------- Fetch & mapping ----------

  const mapEvolucao = (raw: any[]): EvolucaoMensalItem[] => {
    return raw.map((r) => ({
      mes: r.mes ?? r.month ?? String(r.mes_label ?? ""),
      formacoes: safeParseInt(r.formacoes ?? r.total_formacoes ?? r.formations ?? 0),
      participantes: safeParseInt(r.participantes ?? r.participants ?? r.total_participantes ?? 0),
      concluidas: safeParseInt(r.concluidas ?? r.concluded ?? r.total_concluded ?? 0),
    }))
  }

  const mapDistribuicaoTipo = (raw: any[]): DistribuicaoTipoItem[] => {
    return raw.map((r) => ({
      name: r.tipo ?? r.name ?? r.label ?? "Outro",
      value: safeParseInt(r.total ?? r.count ?? r.value ?? 0),
    }))
  }

  const mapTopFormacoes = (raw: any[]): TopFormacaoItem[] => {
    return raw.map((r) => ({
      id: String(r.id ?? r.pk ?? r._id ?? `${Math.random()}`),
      nome: r.titulo ?? r.nome ?? r.name ?? "Sem título",
      participantes: safeParseInt(r.participantes ?? r.participants ?? r.inscritos ?? 0),
      avaliacao: safeParseFloat(r.avaliacao ?? r.rating ?? r.media ?? 0),
      conclusao: safeParseFloat(r.conclusao ?? r.completion ?? r.percent ?? 0),
    }))
  }

  const mapInvestimento = (raw: any[]): InvestimentoMensalItem[] => {
    return raw.map((r) => ({
      mes: r.mes ?? r.month ?? "",
      planejado: safeParseFloat(r.planejado ?? r.planned ?? 0),
      realizado: safeParseFloat(r.realizado ?? r.actual ?? 0),
    }))
  }

  const mapDistribuicaoDepartamento = (raw: any[]): DistribuicaoDepartamentoItem[] => {
    return raw.map((r) => ({
      departamento: r.departamento ?? r.department ?? r.name ?? "Geral",
      total: safeParseInt(r.total ?? r.count ?? r.participantes ?? 0),
    }))
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const endpoints = [
        { key: "resumo", url: `${API_BASE_URL}/formacoes/estatisticas/` },
        { key: "evolucao", url: `${API_BASE_URL}/formacoes/evolucao_mensal/` },
        { key: "distribuicaoTipo", url: `${API_BASE_URL}/formacoes/distribuicao_tipo/` },
        { key: "topFormacoes", url: `${API_BASE_URL}/relatorios/top_formacoes/` },
        { key: "investimento", url: `${API_BASE_URL}/relatorios/investimento_mensal/` },
        { key: "departamento", url: `${API_BASE_URL}/formacoes/distribuicao_departamento/` },
      ]

      const promises = endpoints.map((ep) => fetch(ep.url, { credentials: "include" }).then((r) => ({ key: ep.key, res: r })))
      const results = await Promise.allSettled(promises)

      for (const p of results) {
        if (p.status === "fulfilled") {
          const { key, res } = p.value
          if (!res.ok) {
            toast({ title: `Erro (${key})`, description: `Falha ao buscar ${key}`, variant: "destructive" })
            continue
          }
          const data = await res.json()
          switch (key) {
            case "resumo":
              setResumo((prev) => ({ ...prev, ...data }))
              break
            case "evolucao":
              setEvolucaoMensal(mapEvolucao(Array.isArray(data) ? data : data?.results ?? []))
              break
            case "distribuicaoTipo":
              setDistribuicaoTipo(mapDistribuicaoTipo(Array.isArray(data) ? data : data?.results ?? []))
              break
            case "topFormacoes":
              setTopFormacoes(mapTopFormacoes(Array.isArray(data) ? data : data?.results ?? []))
              break
            case "investimento":
              setInvestimentoMensal(mapInvestimento(Array.isArray(data) ? data : data?.results ?? []))
              break
            case "departamento":
              setDistribuicaoDepartamento(
                mapDistribuicaoDepartamento(Array.isArray(data) ? data : data?.results ?? [])
              )
              break
            default:
              break
          }
        } else {
          // promise itself falhou (fetch lançou)
          toast({ title: "Erro de rede", description: "Falha ao buscar dados", variant: "destructive" })
        }
      }
    } catch (err) {
      console.error("Erro fetchData:", err)
      toast({ title: "Erro", description: "Erro ao carregar dados do sistema", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchInstrutores = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/instrutores/`, {
        credentials: "include"
      })
      if (!res.ok) throw new Error("Erro ao buscar instrutores")
      const data = await res.json()
      setInstrutores(Array.isArray(data) ? data : data?.results ?? [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchFuncionarios = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/usuario/`, {
        credentials: "include"
      })
      if (!res.ok) throw new Error("Erro ao buscar funcionários")
      const data = await res.json()
      setFuncionarios(Array.isArray(data) ? data : data?.results ?? [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchFormacoes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/formacoes/`, {
        credentials: "include"
      })
      if (!res.ok) throw new Error("Erro ao buscar formações")
      const data = await res.json()
      setFormacoes(Array.isArray(data) ? data : data?.results ?? [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
    fetchInstrutores()
    fetchFuncionarios()
    fetchFormacoes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------- Actions (POSTs) ----------

  const handleCreateFormacao = async () => {
    setIsCreatingFormacao(true)
    try {
      // Sanitizar e converter valores
      const payload = {
        titulo: novaFormacao.titulo,
        descricao: novaFormacao.descricao,
        categoria: novaFormacao.categoria,
        tipo: novaFormacao.tipo,
        instrutor: novaFormacao.instrutor_id || null,
        carga_horaria: safeParseInt(novaFormacao.carga_horaria, 0),
        data_inicio: novaFormacao.data_inicio || null,
        data_fim: novaFormacao.data_fim || null,
        vagas: safeParseInt(novaFormacao.vagas_totais, 0),
        vagas_disponiveis: safeParseInt(novaFormacao.vagas_totais, 0),
        horario: novaFormacao.horario || "09:00 - 18:00",
        local: novaFormacao.local || "",
        link_online: novaFormacao.plataforma || "",
        custo: safeParseFloat(novaFormacao.custo, 0),
        status: "PLANEJADA",
        avaliacao_media: 0,
        total_avaliacoes: 0,
      }

      console.log("Payload enviado:", payload)

      const res = await fetch(`${API_BASE_URL}/formacoes/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Erro detalhado:", errorText)
        throw new Error(errorText || "Erro ao criar formação")
      }

      toast({ title: "Sucesso", description: "Formação criada com sucesso!" })
      setNovaFormacaoOpen(false)
      
      // Reset form
      setNovaFormacao({
        titulo: "",
        descricao: "",
        categoria: "tecnica",
        tipo: "PRESENCIAL",
        instrutor_id: "",
        carga_horaria: 0,
        data_inicio: "",
        data_fim: "",
        horario: "09:00 - 18:00",
        vagas_totais: 0,
        obrigatoria: false,
        custo: 0,
        local: "",
        plataforma: "",
        nivel: "basico",
        certificado: true,
        nota_minima_aprovacao: 70,
      })
      
      fetchData()
      fetchFormacoes()
    } catch (err) {
      console.error("Erro criar formação:", err)
      toast({ 
        title: "Erro", 
        description: "Falha ao criar formação. Verifique os dados e tente novamente.", 
        variant: "destructive" 
      })
    } finally {
      setIsCreatingFormacao(false)
    }
  }

  const handleInscreverFuncionario = async () => {
    setIsInscrevendo(true)
    try {
      if (!novaInscricao.funcionario_id || !novaInscricao.formacao_id) {
        toast({ title: "Atenção", description: "Selecione funcionário e formação", variant: "destructive" })
        return
      }
      const res = await fetch(`${API_BASE_URL}/inscricoes/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaInscricao),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Erro ao inscrever funcionário")
      }
      toast({ title: "Sucesso", description: "Funcionário inscrito com sucesso!" })
      setInscreverFuncionarioOpen(false)
      fetchData()
    } catch (err) {
      console.error("Erro inscrever:", err)
      toast({ title: "Erro", description: "Falha ao inscrever funcionário", variant: "destructive" })
    } finally {
      setIsInscrevendo(false)
    }
  }

  const handleCreateInstrutor = async () => {
    setIsCreatingInstrutor(true)
    try {
      const payload = { ...novoInstrutor }
      const res = await fetch(`${API_BASE_URL}/instrutores/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Erro ao criar instrutor")
      }
      toast({ title: "Sucesso", description: "Instrutor criado com sucesso!" })
      setNovoInstrutorOpen(false)
      fetchInstrutores()
    } catch (err) {
      console.error("Erro criar instrutor:", err)
      toast({ title: "Erro", description: "Falha ao criar instrutor", variant: "destructive" })
    } finally {
      setIsCreatingInstrutor(false)
    }
  }

  const handleCreatePlano = async () => {
    setIsCreatingPlano(true)
    try {
      const payload = { ...novoPlano }
      const res = await fetch(`${API_BASE_URL}/planos-desenvolvimento/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Erro ao criar plano")
      }
      toast({ title: "Sucesso", description: "Plano criado com sucesso!" })
      setNovoPlanoOpen(false)
    } catch (err) {
      console.error("Erro criar plano:", err)
      toast({ title: "Erro", description: "Falha ao criar plano", variant: "destructive" })
    } finally {
      setIsCreatingPlano(false)
    }
  }

  // ---------- Export PDF (exemplo simples) ----------

  const handleExportPdf = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    })

    doc.text("Relatório - Gestão de Formações", 40, 50)

    const tableData = topFormacoes.map((t) => [
      t.nome,
      String(t.participantes),
      String(t.avaliacao),
      `${t.conclusao}%`,
    ])

    // @ts-ignore (autotable attach)
    doc.autoTable({
      head: [["Formação", "Participantes", "Avaliação", "Conclusão"]],
      body: tableData,
      startY: 80,
    })

    doc.save("relatorio_formacoes.pdf")
  }

  // ---------- Render ----------

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
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Gestão de Formações
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Sistema completo de treinamento, desenvolvimento e certificação profissional
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            onClick={handleExportPdf}
            aria-label="Exportar PDF"
          >
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button
            onClick={() => setNovaFormacaoOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Formação
          </Button>
          <Button
            onClick={() => setInscreverFuncionarioOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 gap-2"
          >
            <UserCheck className="h-4 w-4" />
            Inscrever Funcionário
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Formações"
          value={String(resumo.total_formacoes)}
          icon={BookOpen}
          description={`${resumo.formacoes_ativas} formações ativas`}
          trend={{ value: 12.5, isPositive: true }}
        />
        <MetricCard
          title="Taxa de Conclusão"
          value={`${resumo.taxa_conclusao}%`}
          icon={CheckCircle}
          description={`${resumo.total_inscricoes} inscrições totais`}
          trend={{ value: 5.2, isPositive: true }}
        />
        <MetricCard
          title="Horas de Treinamento"
          value={`${resumo.horas_treinamento}h`}
          icon={Clock}
          description="Acumulado no ano"
          trend={{ value: 18.3, isPositive: true }}
        />
        <MetricCard
          title="Certificados Emitidos"
          value={String(resumo.certificados_emitidos)}
          icon={Award}
          description={`Satisfação média: ${resumo.media_satisfacao}/5`}
          trend={{ value: 8.7, isPositive: true }}
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Evolução Mensal */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Evolução Mensal</CardTitle>
            <CardDescription className="text-slate-400">Formações, participantes e conclusões</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolucaoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="mes" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="formacoes" stroke={COLORS[0]} strokeWidth={2} name="Formações" />
                <Line type="monotone" dataKey="participantes" stroke={COLORS[1]} strokeWidth={2} name="Participantes" />
                <Line type="monotone" dataKey="concluidas" stroke={COLORS[3]} strokeWidth={2} name="Concluídas" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Tipo */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Distribuição por Tipo</CardTitle>
            <CardDescription className="text-slate-400">Modalidades de formação</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribuicaoTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distribuicaoTipo.map((entry, index) => (
                    <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Participantes por Departamento */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Participantes por Departamento</CardTitle>
            <CardDescription className="text-slate-400">Distribuição por áreas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribuicaoDepartamento}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="departamento" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Bar dataKey="total" fill={COLORS[0]} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Investimento Mensal */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Investimento Mensal</CardTitle>
            <CardDescription className="text-slate-400">Planejado vs Realizado</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={investimentoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="mes" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Legend />
                <Bar dataKey="planejado" fill={COLORS[2]} radius={[8, 8, 0, 0]} name="Planejado" />
                <Bar dataKey="realizado" fill={COLORS[0]} radius={[8, 8, 0, 0]} name="Realizado" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Formações */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Top 5 Formações Mais Populares</CardTitle>
          <CardDescription className="text-slate-400">Formações com maior participação e avaliação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topFormacoes.map((formacao) => (
              <div key={formacao.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">#</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{formacao.nome}</h4>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                      <span>{formacao.participantes} participantes</span>
                      <span>⭐ {formacao.avaliacao}</span>
                      <span>{formacao.conclusao}% conclusão</span>
                    </div>
                  </div>
                </div>
                <Progress value={formacao.conclusao} className="w-32" />
              </div>
            ))}
            {topFormacoes.length === 0 && <div className="text-slate-400">Sem dados para mostrar.</div>}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl text-white">
                <GraduationCap className="h-6 w-6 text-cyan-400" />
                Módulos de Formação
              </CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                Acesso rápido a todas as funcionalidades de treinamento e desenvolvimento
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/list/formacoes/catalogo">
                <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                        <BookOpen className="h-6 w-6 text-cyan-400" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Catálogo de Formações</h3>
                    <p className="text-sm text-slate-400">Explore e inscreva-se em treinamentos disponíveis</p>
                  </CardContent>
                </Card>
            </Link>

            <Link href="/list/formacoes/instrutores">
                <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30">
                        <Users className="h-6 w-6 text-orange-400" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-orange-400 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Gestão de Instrutores</h3>
                    <p className="text-sm text-slate-400">Cadastre e gerencie instrutores internos e externos</p>
                  </CardContent>
                </Card>
            </Link>

            <Link href="/list/formacoes/avaliacoes">
                <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30">
                        <Award className="h-6 w-6 text-yellow-400" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-yellow-400 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Avaliações e Certificados</h3>
                    <p className="text-sm text-slate-400">Gerencie avaliações de desempenho e certificados</p>
                  </CardContent>
                </Card>
            </Link>

            <Link href="/list/formacoes/relatorios">
                <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30">
                        <FileText className="h-6 w-6 text-teal-400" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-teal-400 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Relatórios e Analytics</h3>
                    <p className="text-sm text-slate-400">Análises detalhadas de ROI e efetividade</p>
                  </CardContent>
                </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* ---------- Modals ---------- */}

      <Dialog open={novaFormacaoOpen} onOpenChange={setNovaFormacaoOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Formação</DialogTitle>
            <DialogDescription className="text-slate-400">Cadastre uma nova formação no sistema</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={novaFormacao.titulo}
                onChange={(e) => setNovaFormacao((s) => ({ ...s, titulo: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={novaFormacao.descricao}
                onChange={(e) => setNovaFormacao((s) => ({ ...s, descricao: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={novaFormacao.categoria}
                  onValueChange={(value) =>
                    setNovaFormacao((s) => ({ ...s, categoria: value as NovaFormacaoState["categoria"] }))
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    <SelectItem value="tecnica">Técnica</SelectItem>
                    <SelectItem value="comportamental">Comportamental</SelectItem>
                    <SelectItem value="lideranca">Liderança</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="idiomas">Idiomas</SelectItem>
                    <SelectItem value="certificacao">Certificação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={novaFormacao.tipo}
                  onValueChange={(value) => setNovaFormacao((s) => ({ ...s, tipo: value as NovaFormacaoState["tipo"] }))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="HIBRIDO">Híbrido</SelectItem>
                    <SelectItem value="EAD">EAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="instrutor">Instrutor</Label>
              <Select
                value={novaFormacao.instrutor_id}
                onValueChange={(value) => setNovaFormacao((s) => ({ ...s, instrutor_id: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione um instrutor" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  {instrutores.map((instrutor) => (
                    <SelectItem key={instrutor.id ?? instrutor.pk ?? instrutor._id} value={String(instrutor.id ?? instrutor.pk ?? instrutor._id)}>
                      {instrutor.nome ?? instrutor.nome_completo ?? instrutor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="carga_horaria">Carga Horária (horas)</Label>
                <Input
                  id="carga_horaria"
                  type="number"
                  value={novaFormacao.carga_horaria}
                  onChange={(e) =>
                    setNovaFormacao((s) => ({ ...s, carga_horaria: safeParseInt(e.target.value, 0) }))
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="vagas_totais">Vagas Totais</Label>
                <Input
                  id="vagas_totais"
                  type="number"
                  value={novaFormacao.vagas_totais}
                  onChange={(e) => setNovaFormacao((s) => ({ ...s, vagas_totais: safeParseInt(e.target.value, 0) }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data_inicio">Data Início</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={novaFormacao.data_inicio}
                  onChange={(e) => setNovaFormacao((s) => ({ ...s, data_inicio: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="data_fim">Data Fim</Label>
                <Input
                  id="data_fim"
                  type="date"
                  value={novaFormacao.data_fim}
                  onChange={(e) => setNovaFormacao((s) => ({ ...s, data_fim: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="custo">Custo</Label>
                <Input
                  id="custo"
                  type="number"
                  value={novaFormacao.custo}
                  onChange={(e) => setNovaFormacao((s) => ({ ...s, custo: safeParseFloat(e.target.value, 0) }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="nivel">Nível</Label>
                <Select
                  value={novaFormacao.nivel}
                  onValueChange={(value) => setNovaFormacao((s) => ({ ...s, nivel: value as NovaFormacaoState["nivel"] }))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    <SelectItem value="basico">Básico</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="avancado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="local">Local</Label>
              <Input
                id="local"
                value={novaFormacao.local}
                onChange={(e) => setNovaFormacao((s) => ({ ...s, local: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Ex: Sala 101, Auditório Principal"
              />
            </div>

            <div>
              <Label htmlFor="horario">Horário</Label>
              <Input
                id="horario"
                value={novaFormacao.horario}
                onChange={(e) => setNovaFormacao((s) => ({ ...s, horario: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Ex: 09:00 - 18:00"
              />
            </div>

            <div>
              <Label htmlFor="plataforma">Plataforma (para online/EAD)</Label>
              <Input
                id="plataforma"
                value={novaFormacao.plataforma}
                onChange={(e) => setNovaFormacao((s) => ({ ...s, plataforma: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Ex: Zoom, Teams, Moodle"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="obrigatoria"
                checked={novaFormacao.obrigatoria}
                onCheckedChange={(checked) => setNovaFormacao((s) => ({ ...s, obrigatoria: !!checked }))}
              />
              <Label htmlFor="obrigatoria">Formação Obrigatória</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="certificado"
                checked={novaFormacao.certificado}
                onCheckedChange={(checked) => setNovaFormacao((s) => ({ ...s, certificado: !!checked }))}
              />
              <Label htmlFor="certificado">Emite Certificado</Label>
            </div>

            <div>
              <Label htmlFor="nota_minima">Nota Mínima para Aprovação (%)</Label>
              <Input
                id="nota_minima"
                type="number"
                value={novaFormacao.nota_minima_aprovacao}
                onChange={(e) =>
                  setNovaFormacao((s) => ({ ...s, nota_minima_aprovacao: safeParseInt(e.target.value, 70) }))
                }
                className="bg-slate-700 border-slate-600 text-white"
                min={0}
                max={100}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setNovaFormacaoOpen(false)} className="border-slate-600">
              Cancelar
            </Button>
            <Button onClick={handleCreateFormacao} disabled={isCreatingFormacao} className="bg-cyan-600 hover:bg-cyan-700">
              {isCreatingFormacao ? "Salvando..." : "Criar Formação"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inscrever Funcionário */}
      <Dialog open={inscreverFuncionarioOpen} onOpenChange={setInscreverFuncionarioOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Inscrever Funcionário</DialogTitle>
            <DialogDescription className="text-slate-400">Inscreva um funcionário em uma formação disponível</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="funcionario">Funcionário</Label>
              <Select
                value={novaInscricao.funcionario_id}
                onValueChange={(value) => setNovaInscricao((s) => ({ ...s, funcionario_id: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  {funcionarios.map((func) => (
                    <SelectItem key={func.id ?? func.pk} value={String(func.id ?? func.pk)}>
                      {func.nome ?? func.name} {func.cargo ? `- ${func.cargo}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="formacao">Formação</Label>
              <Select
                value={novaInscricao.formacao_id}
                onValueChange={(value) => setNovaInscricao((s) => ({ ...s, formacao_id: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione uma formação" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  {formacoes.map((f) => (
                    <SelectItem key={f.id ?? f.pk} value={String(f.id ?? f.pk)}>
                      {f.titulo ?? f.nome} {f.data_inicio ? `- ${f.data_inicio}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setInscreverFuncionarioOpen(false)} className="border-slate-600">
              Cancelar
            </Button>
            <Button onClick={handleInscreverFuncionario} disabled={isInscrevendo} className="bg-green-600 hover:bg-green-700">
              {isInscrevendo ? "Inscrevendo..." : "Inscrever"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Novo Instrutor */}
      <Dialog open={novoInstrutorOpen} onOpenChange={setNovoInstrutorOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Novo Instrutor</DialogTitle>
            <DialogDescription className="text-slate-400">Cadastre um novo instrutor no sistema</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nome_instrutor">Nome</Label>
              <Input
                id="nome_instrutor"
                value={novoInstrutor.nome}
                onChange={(e) => setNovoInstrutor((s) => ({ ...s, nome: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="especialidade">Especialidade</Label>
              <Input
                id="especialidade"
                value={novoInstrutor.especialidade}
                onChange={(e) => setNovoInstrutor((s) => ({ ...s, especialidade: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="email_instrutor">Email</Label>
              <Input
                id="email_instrutor"
                type="email"
                value={novoInstrutor.email}
                onChange={(e) => setNovoInstrutor((s) => ({ ...s, email: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="telefone_instrutor">Telefone</Label>
              <Input
                id="telefone_instrutor"
                value={novoInstrutor.telefone}
                onChange={(e) => setNovoInstrutor((s) => ({ ...s, telefone: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="tipo_instrutor">Tipo</Label>
              <Select
                value={novoInstrutor.tipo}
                onValueChange={(value) => setNovoInstrutor((s) => ({ ...s, tipo: value as "interno" | "externo" }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setNovoInstrutorOpen(false)} className="border-slate-600">
              Cancelar
            </Button>
            <Button onClick={handleCreateInstrutor} disabled={isCreatingInstrutor} className="bg-orange-600 hover:bg-orange-700">
              {isCreatingInstrutor ? "Salvando..." : "Criar Instrutor"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Novo Plano */}
      <Dialog open={novoPlanoOpen} onOpenChange={setNovoPlanoOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Novo Plano de Desenvolvimento</DialogTitle>
            <DialogDescription className="text-slate-400">Crie um plano de desenvolvimento individual para um funcionário</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="funcionario_plano">Funcionário</Label>
              <Select
                value={novoPlano.funcionario_id}
                onValueChange={(value) => setNovoPlano((s) => ({ ...s, funcionario_id: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  {funcionarios.map((func) => (
                    <SelectItem key={func.id ?? func.pk} value={String(func.id ?? func.pk)}>
                      {func.nome ?? func.name} {func.cargo ? `- ${func.cargo}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="prazo_plano">Prazo</Label>
              <Input
                id="prazo_plano"
                type="date"
                value={novoPlano.prazo}
                onChange={(e) => setNovoPlano((s) => ({ ...s, prazo: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setNovoPlanoOpen(false)} className="border-slate-600">
              Cancelar
            </Button>
            <Button onClick={handleCreatePlano} disabled={isCreatingPlano} className="bg-purple-600 hover:bg-purple-700">
              {isCreatingPlano ? "Salvando..." : "Criar Plano"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GestaoFormacoes