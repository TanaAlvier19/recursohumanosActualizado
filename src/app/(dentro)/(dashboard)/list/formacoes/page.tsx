"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Users,
  Calendar,
  Award,
  Plus,
  Edit,
  Eye,
  Search,
  Filter,
  Download,
  Clock,
  Target,
  BarChart3,
  GraduationCap,
  FileText,
  CheckCircle,
  Star,
  MapPin,
  Video,
  UserCheck,
  ArrowRight,
  Settings,
} from "lucide-react"
import { Input } from "@/components/ui/input"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number
    }
  }
}

type Formacao = {
  id: string
  titulo: string
  descricao: string
  categoria: "tecnica" | "comportamental" | "lideranca" | "compliance" | "idiomas" | "certificacao"
  tipo: "presencial" | "online" | "hibrido" | "ead"
  instrutor: string
  carga_horaria: number
  data_inicio: string
  data_fim: string
  vagas_totais: number
  vagas_disponiveis: number
  status: "planejada" | "inscricoes_abertas" | "em_andamento" | "concluida" | "cancelada"
  obrigatoria: boolean
  custo: number
  local?: string
  plataforma?: string
  nivel: "basico" | "intermediario" | "avancado"
  certificado: boolean
  nota_minima_aprovacao: number
}

type Inscricao = {
  id: string
  formacao_id: string
  formacao_titulo: string
  funcionario_id: string
  funcionario_nome: string
  funcionario_cargo: string
  departamento: string
  data_inscricao: string
  status: "pendente" | "aprovada" | "reprovada" | "em_andamento" | "concluida" | "cancelada"
  presenca: number
  nota_final?: number
  feedback?: string
  certificado_emitido: boolean
  aprovado_por?: string
}

type Instrutor = {
  id: string
  nome: string
  especialidade: string
  email: string
  telefone: string
  tipo: "interno" | "externo"
  avaliacao_media: number
  total_formacoes: number
  ativo: boolean
}

type Certificado = {
  id: string
  funcionario_id: string
  funcionario_nome: string
  formacao_id: string
  formacao_titulo: string
  data_emissao: string
  data_validade?: string
  codigo_verificacao: string
  carga_horaria: number
  nota_final: number
}

type MatrizCompetencia = {
  competencia: string
  nivel_atual: number
  nivel_desejado: number
  gap: number
  formacoes_recomendadas: number
}

type PlanoDesenvolvimento = {
  id: string
  funcionario_id: string
  funcionario_nome: string
  cargo: string
  competencias_alvo: string[]
  formacoes_planejadas: string[]
  prazo: string
  status: "em_elaboracao" | "aprovado" | "em_andamento" | "concluido"
  progresso: number
}

const GestaoFormacoes = () => {
  const { toast } = useToast()

  const [formacoes, setFormacoes] = useState<Formacao[]>([])
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [instrutores, setInstrutores] = useState<Instrutor[]>([])
  const [certificados, setCertificados] = useState<Certificado[]>([])
  const [planosDesenvolvimento, setPlanosDesenvolvimento] = useState<PlanoDesenvolvimento[]>([])
  const [loading, setLoading] = useState(true)

  const [resumo, setResumo] = useState({
    total_formacoes: 0,
    formacoes_ativas: 0,
    total_inscricoes: 0,
    taxa_conclusao: 0,
    horas_treinamento: 0,
    investimento_total: 0,
    certificados_emitidos: 0,
    media_satisfacao: 0,
  })

  const [matrizCompetencias, setMatrizCompetencias] = useState<MatrizCompetencia[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("todas")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [tipoFilter, setTipoFilter] = useState("todos")

  const [modalNovaFormacao, setModalNovaFormacao] = useState(false)
  const [modalInscricao, setModalInscricao] = useState(false)
  const [modalNovoInstrutor, setModalNovoInstrutor] = useState(false)
  const [modalPlanoDesenvolvimento, setModalPlanoDesenvolvimento] = useState(false)
  const [modalAvaliacaoFormacao, setModalAvaliacaoFormacao] = useState(false)

  const [formacaoSelecionada, setFormacaoSelecionada] = useState<Formacao | null>(null)
  const [inscricaoSelecionada, setInscricaoSelecionada] = useState<Inscricao | null>(null)

  const [novaFormacao, setNovaFormacao] = useState({
    titulo: "",
    descricao: "",
    categoria: "tecnica" as const,
    tipo: "presencial" as const,
    instrutor: "",
    carga_horaria: 0,
    data_inicio: "",
    data_fim: "",
    vagas_totais: 0,
    obrigatoria: false,
    custo: 0,
    local: "",
    plataforma: "",
    nivel: "basico" as const,
    certificado: true,
    nota_minima_aprovacao: 70,
  })

  const [novaInscricao, setNovaInscricao] = useState({
    formacao_id: "",
    funcionario_id: "",
    justificativa: "",
  })

  const [novoInstrutor, setNovoInstrutor] = useState({
    nome: "",
    especialidade: "",
    email: "",
    telefone: "",
    tipo: "interno" as const,
  })

  const [novoPlano, setNovoPlano] = useState({
    funcionario_id: "",
    competencias_alvo: [] as string[],
    formacoes_planejadas: [] as string[],
    prazo: "",
  })

  const [avaliacaoFormacao, setAvaliacaoFormacao] = useState({
    inscricao_id: "",
    nota_final: 0,
    presenca: 0,
    feedback: "",
    aprovado: false,
  })

  const fetchData = async () => {
    try {
      setLoading(true)

      // Simulando dados - em produção, fazer chamadas reais à API
      const formacoesData: Formacao[] = [
        {
          id: "1",
          titulo: "Liderança e Gestão de Equipes",
          descricao: "Desenvolvimento de habilidades de liderança e gestão de pessoas",
          categoria: "lideranca",
          tipo: "hibrido",
          instrutor: "Maria Silva",
          carga_horaria: 40,
          data_inicio: "2025-04-01",
          data_fim: "2025-04-30",
          vagas_totais: 25,
          vagas_disponiveis: 8,
          status: "inscricoes_abertas",
          obrigatoria: false,
          custo: 3500,
          local: "Sala de Treinamento A",
          nivel: "intermediario",
          certificado: true,
          nota_minima_aprovacao: 70,
        },
        {
          id: "2",
          titulo: "Segurança da Informação - LGPD",
          descricao: "Compliance e boas práticas em proteção de dados",
          categoria: "compliance",
          tipo: "online",
          instrutor: "João Santos",
          carga_horaria: 16,
          data_inicio: "2025-03-15",
          data_fim: "2025-03-20",
          vagas_totais: 100,
          vagas_disponiveis: 45,
          status: "inscricoes_abertas",
          obrigatoria: true,
          custo: 0,
          plataforma: "Microsoft Teams",
          nivel: "basico",
          certificado: true,
          nota_minima_aprovacao: 80,
        },
        {
          id: "3",
          titulo: "Python para Análise de Dados",
          descricao: "Programação Python aplicada à análise e visualização de dados",
          categoria: "tecnica",
          tipo: "ead",
          instrutor: "Carlos Oliveira",
          carga_horaria: 60,
          data_inicio: "2025-03-01",
          data_fim: "2025-05-31",
          vagas_totais: 50,
          vagas_disponiveis: 12,
          status: "em_andamento",
          obrigatoria: false,
          custo: 2800,
          plataforma: "Udemy Business",
          nivel: "intermediario",
          certificado: true,
          nota_minima_aprovacao: 70,
        },
        {
          id: "4",
          titulo: "Comunicação Assertiva",
          descricao: "Técnicas de comunicação eficaz no ambiente corporativo",
          categoria: "comportamental",
          tipo: "presencial",
          instrutor: "Ana Paula Costa",
          carga_horaria: 24,
          data_inicio: "2025-02-10",
          data_fim: "2025-02-28",
          vagas_totais: 30,
          vagas_disponiveis: 0,
          status: "concluida",
          obrigatoria: false,
          custo: 1800,
          local: "Auditório Principal",
          nivel: "basico",
          certificado: true,
          nota_minima_aprovacao: 70,
        },
        {
          id: "5",
          titulo: "Inglês Corporativo - Nível Avançado",
          descricao: "Inglês para negócios e comunicação internacional",
          categoria: "idiomas",
          tipo: "hibrido",
          instrutor: "Robert Johnson",
          carga_horaria: 80,
          data_inicio: "2025-04-15",
          data_fim: "2025-07-15",
          vagas_totais: 20,
          vagas_disponiveis: 5,
          status: "planejada",
          obrigatoria: false,
          custo: 5200,
          local: "Sala de Idiomas",
          nivel: "avancado",
          certificado: true,
          nota_minima_aprovacao: 75,
        },
        {
          id: "6",
          titulo: "Certificação PMP - Project Management",
          descricao: "Preparação para certificação PMP do PMI",
          categoria: "certificacao",
          tipo: "online",
          instrutor: "Ricardo Mendes",
          carga_horaria: 120,
          data_inicio: "2025-05-01",
          data_fim: "2025-08-31",
          vagas_totais: 15,
          vagas_disponiveis: 15,
          status: "planejada",
          obrigatoria: false,
          custo: 8500,
          plataforma: "Zoom",
          nivel: "avancado",
          certificado: true,
          nota_minima_aprovacao: 80,
        },
      ]

      const inscricoesData: Inscricao[] = [
        {
          id: "1",
          formacao_id: "1",
          formacao_titulo: "Liderança e Gestão de Equipes",
          funcionario_id: "F001",
          funcionario_nome: "Pedro Almeida",
          funcionario_cargo: "Coordenador",
          departamento: "Operações",
          data_inscricao: "2025-03-01",
          status: "aprovada",
          presenca: 0,
          certificado_emitido: false,
          aprovado_por: "Maria RH",
        },
        {
          id: "2",
          formacao_id: "2",
          formacao_titulo: "Segurança da Informação - LGPD",
          funcionario_id: "F002",
          funcionario_nome: "Julia Ferreira",
          funcionario_cargo: "Analista TI",
          departamento: "Tecnologia",
          data_inscricao: "2025-03-05",
          status: "em_andamento",
          presenca: 75,
          certificado_emitido: false,
        },
        {
          id: "3",
          formacao_id: "3",
          formacao_titulo: "Python para Análise de Dados",
          funcionario_id: "F003",
          funcionario_nome: "Lucas Martins",
          funcionario_cargo: "Analista de Dados",
          departamento: "Business Intelligence",
          data_inscricao: "2025-02-28",
          status: "em_andamento",
          presenca: 60,
          certificado_emitido: false,
        },
        {
          id: "4",
          formacao_id: "4",
          formacao_titulo: "Comunicação Assertiva",
          funcionario_id: "F004",
          funcionario_nome: "Fernanda Lima",
          funcionario_cargo: "Gerente Comercial",
          departamento: "Vendas",
          data_inscricao: "2025-02-01",
          status: "concluida",
          presenca: 100,
          nota_final: 92,
          feedback: "Excelente treinamento, muito aplicável ao dia a dia",
          certificado_emitido: true,
          aprovado_por: "Maria RH",
        },
        {
          id: "5",
          formacao_id: "1",
          formacao_titulo: "Liderança e Gestão de Equipes",
          funcionario_id: "F005",
          funcionario_nome: "Roberto Santos",
          funcionario_cargo: "Supervisor",
          departamento: "Produção",
          data_inscricao: "2025-03-02",
          status: "pendente",
          presenca: 0,
          certificado_emitido: false,
        },
      ]

      const instrutoresData: Instrutor[] = [
        {
          id: "1",
          nome: "Maria Silva",
          especialidade: "Liderança e Desenvolvimento Humano",
          email: "maria.silva@empresa.com",
          telefone: "(11) 98765-4321",
          tipo: "interno",
          avaliacao_media: 4.8,
          total_formacoes: 24,
          ativo: true,
        },
        {
          id: "2",
          nome: "João Santos",
          especialidade: "Segurança da Informação e Compliance",
          email: "joao.santos@consultoria.com",
          telefone: "(11) 97654-3210",
          tipo: "externo",
          avaliacao_media: 4.6,
          total_formacoes: 18,
          ativo: true,
        },
        {
          id: "3",
          nome: "Carlos Oliveira",
          especialidade: "Tecnologia e Programação",
          email: "carlos.oliveira@empresa.com",
          telefone: "(11) 96543-2109",
          tipo: "interno",
          avaliacao_media: 4.9,
          total_formacoes: 32,
          ativo: true,
        },
        {
          id: "4",
          nome: "Ana Paula Costa",
          especialidade: "Comunicação e Soft Skills",
          email: "ana.costa@treinamentos.com",
          telefone: "(11) 95432-1098",
          tipo: "externo",
          avaliacao_media: 4.7,
          total_formacoes: 28,
          ativo: true,
        },
      ]

      const certificadosData: Certificado[] = [
        {
          id: "1",
          funcionario_id: "F004",
          funcionario_nome: "Fernanda Lima",
          formacao_id: "4",
          formacao_titulo: "Comunicação Assertiva",
          data_emissao: "2025-03-01",
          codigo_verificacao: "CERT-2025-001-F004",
          carga_horaria: 24,
          nota_final: 92,
        },
        {
          id: "2",
          funcionario_id: "F006",
          funcionario_nome: "Marcos Pereira",
          formacao_id: "2",
          formacao_titulo: "Segurança da Informação - LGPD",
          data_emissao: "2025-02-15",
          data_validade: "2027-02-15",
          codigo_verificacao: "CERT-2025-002-F006",
          carga_horaria: 16,
          nota_final: 88,
        },
      ]

      const matrizData: MatrizCompetencia[] = [
        { competencia: "Liderança", nivel_atual: 3, nivel_desejado: 5, gap: 2, formacoes_recomendadas: 3 },
        { competencia: "Comunicação", nivel_atual: 4, nivel_desejado: 5, gap: 1, formacoes_recomendadas: 2 },
        { competencia: "Tecnologia", nivel_atual: 2, nivel_desejado: 4, gap: 2, formacoes_recomendadas: 4 },
        { competencia: "Gestão de Projetos", nivel_atual: 3, nivel_desejado: 5, gap: 2, formacoes_recomendadas: 2 },
        { competencia: "Idiomas", nivel_atual: 2, nivel_desejado: 4, gap: 2, formacoes_recomendadas: 3 },
      ]

      const planosData: PlanoDesenvolvimento[] = [
        {
          id: "1",
          funcionario_id: "F001",
          funcionario_nome: "Pedro Almeida",
          cargo: "Coordenador",
          competencias_alvo: ["Liderança", "Gestão de Projetos"],
          formacoes_planejadas: ["Liderança e Gestão de Equipes", "Certificação PMP"],
          prazo: "2025-12-31",
          status: "em_andamento",
          progresso: 35,
        },
        {
          id: "2",
          funcionario_id: "F003",
          funcionario_nome: "Lucas Martins",
          cargo: "Analista de Dados",
          competencias_alvo: ["Tecnologia", "Análise de Dados"],
          formacoes_planejadas: ["Python para Análise de Dados", "Machine Learning Básico"],
          prazo: "2025-08-31",
          status: "em_andamento",
          progresso: 60,
        },
      ]

      setFormacoes(formacoesData)
      setInscricoes(inscricoesData)
      setInstrutores(instrutoresData)
      setCertificados(certificadosData)
      setMatrizCompetencias(matrizData)
      setPlanosDesenvolvimento(planosData)

      setResumo({
        total_formacoes: formacoesData.length,
        formacoes_ativas: formacoesData.filter((f) => f.status === "inscricoes_abertas" || f.status === "em_andamento")
          .length,
        total_inscricoes: inscricoesData.length,
        taxa_conclusao: 78.5,
        horas_treinamento: 2840,
        investimento_total: 125000,
        certificados_emitidos: certificadosData.length,
        media_satisfacao: 4.7,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do sistema",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formacoesFiltradas = formacoes.filter((formacao) => {
    const matchesSearch =
      formacao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formacao.instrutor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = categoriaFilter === "todas" || formacao.categoria === categoriaFilter
    const matchesStatus = statusFilter === "todos" || formacao.status === statusFilter
    const matchesTipo = tipoFilter === "todos" || formacao.tipo === tipoFilter

    return matchesSearch && matchesCategoria && matchesStatus && matchesTipo
  })

  const criarFormacao = async () => {
    try {
      // Simulação - em produção fazer POST real
      toast({
        title: "Sucesso",
        description: "Formação criada com sucesso",
      })
      setModalNovaFormacao(false)
      setNovaFormacao({
        titulo: "",
        descricao: "",
        categoria: "tecnica",
        tipo: "presencial",
        instrutor: "",
        carga_horaria: 0,
        data_inicio: "",
        data_fim: "",
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
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar formação",
        variant: "destructive",
      })
    }
  }

  const realizarInscricao = async () => {
    try {
      toast({
        title: "Sucesso",
        description: "Inscrição realizada com sucesso",
      })
      setModalInscricao(false)
      setNovaInscricao({
        formacao_id: "",
        funcionario_id: "",
        justificativa: "",
      })
      fetchData()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao realizar inscrição",
        variant: "destructive",
      })
    }
  }

  const adicionarInstrutor = async () => {
    try {
      toast({
        title: "Sucesso",
        description: "Instrutor adicionado com sucesso",
      })
      setModalNovoInstrutor(false)
      setNovoInstrutor({
        nome: "",
        especialidade: "",
        email: "",
        telefone: "",
        tipo: "interno",
      })
      fetchData()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar instrutor",
        variant: "destructive",
      })
    }
  }

  const criarPlanoDesenvolvimento = async () => {
    try {
      toast({
        title: "Sucesso",
        description: "Plano de desenvolvimento criado com sucesso",
      })
      setModalPlanoDesenvolvimento(false)
      setNovoPlano({
        funcionario_id: "",
        competencias_alvo: [],
        formacoes_planejadas: [],
        prazo: "",
      })
      fetchData()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar plano de desenvolvimento",
        variant: "destructive",
      })
    }
  }

  const avaliarFormacao = async () => {
    try {
      toast({
        title: "Sucesso",
        description: "Avaliação registrada com sucesso",
      })
      setModalAvaliacaoFormacao(false)
      setAvaliacaoFormacao({
        inscricao_id: "",
        nota_final: 0,
        presenca: 0,
        feedback: "",
        aprovado: false,
      })
      fetchData()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao registrar avaliação",
        variant: "destructive",
      })
    }
  }

  const gerarPDF = () => {
    const doc = new jsPDF("p", "pt", "a4")
    const margin = 20
    let yPos = margin + 20

    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Relatório Completo de Gestão de Formações", margin, yPos)
    yPos += 40

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Emitido em: ${new Date().toLocaleDateString("pt-BR")}`, margin, yPos)
    yPos += 30

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Resumo Geral", margin, yPos)
    yPos += 30

    autoTable(doc, {
      startY: yPos,
      head: [["Total Formações", "Formações Ativas", "Taxa Conclusão", "Horas Treinamento", "Certificados"]],
      body: [
        [
          resumo.total_formacoes.toString(),
          resumo.formacoes_ativas.toString(),
          `${resumo.taxa_conclusao}%`,
          `${resumo.horas_treinamento}h`,
          resumo.certificados_emitidos.toString(),
        ],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 5, halign: "center" },
      headStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: "bold" },
    })
    yPos = (doc as any).lastAutoTable.finalY + 20

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Formações Cadastradas", margin, yPos)
    yPos += 30

    const formacoesData = formacoes.map((f) => [
      f.titulo,
      f.categoria,
      f.tipo,
      `${f.carga_horaria}h`,
      f.status,
      `${f.vagas_disponiveis}/${f.vagas_totais}`,
    ])

    autoTable(doc, {
      startY: yPos,
      head: [["Título", "Categoria", "Tipo", "Carga Horária", "Status", "Vagas"]],
      body: formacoesData,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: "bold" },
    })

    doc.save("relatorio-gestao-formacoes.pdf")
  }

  const getStatusConfig = (status: "planejada" | "inscricoes_abertas" | "em_andamento" | "concluida" | "cancelada") => {
    const config = {
      planejada: { label: "Planejada", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      inscricoes_abertas: { label: "Inscrições Abertas", color: "bg-green-500/20 text-green-400 border-green-500/30" },
      em_andamento: { label: "Em Andamento", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      concluida: { label: "Concluída", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
      cancelada: { label: "Cancelada", color: "bg-red-500/20 text-red-400 border-red-500/30" },
    }
    return config[status]
  }

  const getCategoriaConfig = (
    categoria: "tecnica" | "comportamental" | "lideranca" | "compliance" | "idiomas" | "certificacao",
  ) => {
    const config = {
      tecnica: { label: "Técnica", icon: Settings, color: "text-cyan-400" },
      comportamental: { label: "Comportamental", icon: Users, color: "text-purple-400" },
      lideranca: { label: "Liderança", icon: Target, color: "text-orange-400" },
      compliance: { label: "Compliance", icon: CheckCircle, color: "text-green-400" },
      idiomas: { label: "Idiomas", icon: BookOpen, color: "text-blue-400" },
      certificacao: { label: "Certificação", icon: Award, color: "text-yellow-400" },
    }
    return config[categoria]
  }

  const chartInscricoesPorMes = [
    { mes: "Jan", inscricoes: 45, conclusoes: 38 },
    { mes: "Fev", inscricoes: 52, conclusoes: 41 },
    { mes: "Mar", inscricoes: 68, conclusoes: 55 },
    { mes: "Abr", inscricoes: 58, conclusoes: 48 },
    { mes: "Mai", inscricoes: 72, conclusoes: 62 },
    { mes: "Jun", inscricoes: 65, conclusoes: 58 },
  ]

  const chartDistribuicaoCategoria = [
    { name: "Técnica", value: 35 },
    { name: "Comportamental", value: 25 },
    { name: "Liderança", value: 20 },
    { name: "Compliance", value: 10 },
    { name: "Idiomas", value: 7 },
    { name: "Certificação", value: 3 },
  ]

  const COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#3b82f6", "#eab308"]

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
            onClick={gerarPDF}
            className="w-full sm:w-auto gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button
            onClick={() => setModalNovaFormacao(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Formação
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Formações"
          value={resumo.total_formacoes.toString()}
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
          value={resumo.certificados_emitidos.toString()}
          icon={Award}
          description={`Satisfação média: ${resumo.media_satisfacao}/5`}
          trend={{ value: 8.7, isPositive: true }}
        />
      </div>

      {/* Módulos do Sistema */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
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

            <Link href="/list/formacoes/minhas-inscricoes">
              <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                      <UserCheck className="h-6 w-6 text-purple-400" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Minhas Inscrições</h3>
                  <p className="text-sm text-slate-400">Acompanhe suas formações em andamento e concluídas</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/list/formacoes/certificados">
              <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30">
                      <Award className="h-6 w-6 text-yellow-400" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-yellow-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Meus Certificados</h3>
                  <p className="text-sm text-slate-400">Visualize e baixe seus certificados de conclusão</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/list/formacoes/calendario">
              <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
                      <Calendar className="h-6 w-6 text-green-400" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-green-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Calendário de Formações</h3>
                  <p className="text-sm text-slate-400">Visualize cronograma e próximas turmas disponíveis</p>
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

            <Link href="/list/formacoes/planos-desenvolvimento">
              <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
                      <Target className="h-6 w-6 text-blue-400" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Planos de Desenvolvimento</h3>
                  <p className="text-sm text-slate-400">Crie e acompanhe PDIs individuais e de equipe</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/list/formacoes/matriz-competencias">
              <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30">
                      <BarChart3 className="h-6 w-6 text-pink-400" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-pink-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Matriz de Competências</h3>
                  <p className="text-sm text-slate-400">Mapeie gaps de competências e formações necessárias</p>
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
                  <p className="text-sm text-slate-400">Análises detalhadas de ROI e efetividade de treinamentos</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Analytics e Tabela */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-8">
          {/* Analytics */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-2xl text-white">
                    <BarChart3 className="h-6 w-6 text-cyan-400" />
                    Analytics de Formações
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Evolução de inscrições, conclusões e distribuição por categoria
                  </CardDescription>
                </div>
                <Select defaultValue="6meses">
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    <SelectItem value="3meses">3 meses</SelectItem>
                    <SelectItem value="6meses">6 meses</SelectItem>
                    <SelectItem value="12meses">12 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="evolucao" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                  <TabsTrigger value="evolucao" className="text-slate-300 data-[state=active]:bg-slate-600">
                    Evolução
                  </TabsTrigger>
                  <TabsTrigger value="distribuicao" className="text-slate-300 data-[state=active]:bg-slate-600">
                    Distribuição
                  </TabsTrigger>
                  <TabsTrigger value="competencias" className="text-slate-300 data-[state=active]:bg-slate-600">
                    Competências
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="evolucao" className="mt-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartInscricoesPorMes}>
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
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="inscricoes"
                          name="Inscrições"
                          stroke="#0ea5e9"
                          strokeWidth={2}
                          dot={{ fill: "#0ea5e9", r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="conclusoes"
                          name="Conclusões"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ fill: "#10b981", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="distribuicao" className="mt-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartDistribuicaoCategoria}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartDistribuicaoCategoria.map((entry, index) => (
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
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="competencias" className="mt-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={matrizCompetencias}>
                        <PolarGrid stroke="#475569" />
                        <PolarAngleAxis dataKey="competencia" stroke="#cbd5e1" />
                        <PolarRadiusAxis stroke="#cbd5e1" />
                        <Radar
                          name="Nível Atual"
                          dataKey="nivel_atual"
                          stroke="#0ea5e9"
                          fill="#0ea5e9"
                          fillOpacity={0.3}
                        />
                        <Radar
                          name="Nível Desejado"
                          dataKey="nivel_desejado"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.3}
                        />
                        <Legend />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #475569",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Tabela de Formações */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <CardTitle className="text-white">Formações Disponíveis</CardTitle>
                  <CardDescription className="text-slate-400">
                    {formacoesFiltradas.length} formações encontradas
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 lg:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar formação..."
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                    <SelectTrigger className="w-full sm:w-40 bg-slate-700 border-slate-600 text-white">
                      <Filter className="h-4 w-4 mr-2 text-slate-400" />
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="tecnica">Técnica</SelectItem>
                      <SelectItem value="comportamental">Comportamental</SelectItem>
                      <SelectItem value="lideranca">Liderança</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="idiomas">Idiomas</SelectItem>
                      <SelectItem value="certificacao">Certificação</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-32 bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="planejada">Planejada</SelectItem>
                      <SelectItem value="inscricoes_abertas">Inscrições Abertas</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formacoesFiltradas.map((formacao) => {
                  const statusInfo = getStatusConfig(formacao.status)
                  const categoriaInfo = getCategoriaConfig(formacao.categoria)
                  const IconeCategoria = categoriaInfo.icon

                  return (
                    <Card
                      key={formacao.id}
                      className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div
                                  className={`p-2 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 border border-slate-500`}
                                >
                                  <IconeCategoria className={`h-5 w-5 ${categoriaInfo.color}`} />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-white mb-1">{formacao.titulo}</h3>
                                  <p className="text-sm text-slate-400 line-clamp-2">{formacao.descricao}</p>
                                </div>
                              </div>
                              <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-slate-400" />
                                <span>{formacao.instrutor}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-slate-400" />
                                <span>{formacao.carga_horaria}h</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span>
                                  {new Date(formacao.data_inicio).toLocaleDateString("pt-BR")} -{" "}
                                  {new Date(formacao.data_fim).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                              {formacao.tipo === "presencial" && formacao.local && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-slate-400" />
                                  <span>{formacao.local}</span>
                                </div>
                              )}
                              {(formacao.tipo === "online" || formacao.tipo === "ead") && formacao.plataforma && (
                                <div className="flex items-center gap-1">
                                  <Video className="h-4 w-4 text-slate-400" />
                                  <span>{formacao.plataforma}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="bg-slate-600 text-slate-300">
                                {categoriaInfo.label}
                              </Badge>
                              <Badge variant="secondary" className="bg-slate-600 text-slate-300">
                                {formacao.tipo.charAt(0).toUpperCase() + formacao.tipo.slice(1)}
                              </Badge>
                              <Badge variant="secondary" className="bg-slate-600 text-slate-300">
                                Nível: {formacao.nivel.charAt(0).toUpperCase() + formacao.nivel.slice(1)}
                              </Badge>
                              {formacao.obrigatoria && (
                                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Obrigatória</Badge>
                              )}
                              {formacao.certificado && (
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                  <Award className="h-3 w-3 mr-1" />
                                  Certificado
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col justify-between items-end gap-3 min-w-[180px]">
                            <div className="text-right">
                              <div className="text-sm text-slate-400 mb-1">Vagas Disponíveis</div>
                              <div className="text-2xl font-bold text-white">
                                {formacao.vagas_disponiveis}/{formacao.vagas_totais}
                              </div>
                              <Progress
                                value={
                                  ((formacao.vagas_totais - formacao.vagas_disponiveis) / formacao.vagas_totais) * 100
                                }
                                className="h-2 mt-2"
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                                onClick={() => {
                                  setFormacaoSelecionada(formacao)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {formacao.status === "inscricoes_abertas" && formacao.vagas_disponiveis > 0 && (
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                                  onClick={() => {
                                    setNovaInscricao({ ...novaInscricao, formacao_id: formacao.id })
                                    setModalInscricao(true)
                                  }}
                                >
                                  Inscrever
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {formacoesFiltradas.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Nenhuma formação encontrada</h3>
                    <p className="text-slate-400">Tente ajustar os filtros de pesquisa</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Ações Rápidas */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Ações Rápidas</CardTitle>
              <CardDescription className="text-slate-400">Gestão de formações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={() => setModalNovaFormacao(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Formação
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                onClick={() => setModalInscricao(true)}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Inscrever Funcionário
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                onClick={() => setModalNovoInstrutor(true)}
              >
                <Users className="mr-2 h-4 w-4" />
                Adicionar Instrutor
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                onClick={() => setModalPlanoDesenvolvimento(true)}
              >
                <Target className="mr-2 h-4 w-4" />
                Criar PDI
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                onClick={() => setModalAvaliacaoFormacao(true)}
              >
                <Star className="mr-2 h-4 w-4" />
                Avaliar Formação
              </Button>
            </CardContent>
          </Card>

          {/* Próximas Formações */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Próximas Formações</CardTitle>
              <CardDescription className="text-slate-400">Agenda dos próximos 30 dias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formacoes
                .filter((f) => f.status === "inscricoes_abertas" || f.status === "planejada")
                .slice(0, 3)
                .map((formacao) => (
                  <div key={formacao.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/50">
                    <div className="p-2 rounded bg-cyan-500/20">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{formacao.titulo}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(formacao.data_inicio).toLocaleDateString("pt-BR")}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs bg-slate-600 text-slate-300">
                          {formacao.vagas_disponiveis} vagas
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Instrutores em Destaque */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Instrutores em Destaque</CardTitle>
              <CardDescription className="text-slate-400">Melhor avaliados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {instrutores
                .sort((a, b) => b.avaliacao_media - a.avaliacao_media)
                .slice(0, 3)
                .map((instrutor) => (
                  <div key={instrutor.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50">
                    <div className="p-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                      <Users className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{instrutor.nome}</h4>
                      <p className="text-xs text-slate-400 truncate">{instrutor.especialidade}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-slate-300">{instrutor.avaliacao_media.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-400">{instrutor.total_formacoes} formações</span>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Planos de Desenvolvimento */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">PDIs em Andamento</CardTitle>
              <CardDescription className="text-slate-400">Planos de desenvolvimento ativos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {planosDesenvolvimento.map((plano) => (
                <div key={plano.id} className="p-3 rounded-lg bg-slate-700/50 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{plano.funcionario_nome}</h4>
                      <p className="text-xs text-slate-400">{plano.cargo}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        plano.status === "em_andamento"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }
                    >
                      {plano.progresso}%
                    </Badge>
                  </div>
                  <Progress value={plano.progresso} className="h-2" />
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Target className="h-3 w-3" />
                    <span>{plano.competencias_alvo.length} competências</span>
                    <span>•</span>
                    <span>{plano.formacoes_planejadas.length} formações</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Investimento em Formações */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Investimento</CardTitle>
              <CardDescription className="text-slate-400">Orçamento de formações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Investido</span>
                  <span className="font-semibold text-white">
                    R$ {resumo.investimento_total.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Orçamento Anual</span>
                  <span className="font-semibold text-white">R$ 250.000</span>
                </div>
                <Progress value={(resumo.investimento_total / 250000) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>50% utilizado</span>
                  <span>R$ 125.000 disponível</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-600 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Custo por Funcionário</span>
                  <span className="font-semibold text-white">R$ 2.840</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">ROI Estimado</span>
                  <span className="font-semibold text-green-400">+18.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Nova Formação */}
      <Dialog open={modalNovaFormacao} onOpenChange={setModalNovaFormacao}>
        <DialogContent className="sm:max-w-[700px] bg-slate-800 border-slate-600 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Criar Nova Formação</DialogTitle>
            <DialogDescription className="text-slate-400">Preencha os dados da nova formação</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo" className="text-slate-300">
                Título da Formação *
              </Label>
              <Input
                id="titulo"
                value={novaFormacao.titulo}
                onChange={(e) => setNovaFormacao({ ...novaFormacao, titulo: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Ex: Liderança e Gestão de Equipes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-slate-300">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                value={novaFormacao.descricao}
                onChange={(e) => setNovaFormacao({ ...novaFormacao, descricao: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="Descreva os objetivos e conteúdo da formação..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria" className="text-slate-300">
                  Categoria *
                </Label>
                <Select
                  value={novaFormacao.categoria}
                  onValueChange={(value: any) => setNovaFormacao({ ...novaFormacao, categoria: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    <SelectItem value="tecnica">Técnica</SelectItem>
                    <SelectItem value="comportamental">Comportamental</SelectItem>
                    <SelectItem value="lideranca">Liderança</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="idiomas">Idiomas</SelectItem>
                    <SelectItem value="certificacao">Certificação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-slate-300">
                  Tipo *
                </Label>
                <Select
                  value={novaFormacao.tipo}
                  onValueChange={(value: any) => setNovaFormacao({ ...novaFormacao, tipo: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                    <SelectItem value="ead">EAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instrutor" className="text-slate-300">
                  Instrutor *
                </Label>
                <Select
                  value={novaFormacao.instrutor}
                  onValueChange={(value) => setNovaFormacao({ ...novaFormacao, instrutor: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    {instrutores.map((inst) => (
                      <SelectItem key={inst.id} value={inst.nome}>
                        {inst.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nivel" className="text-slate-300">
                  Nível
                </Label>
                <Select
                  value={novaFormacao.nivel}
                  onValueChange={(value: any) => setNovaFormacao({ ...novaFormacao, nivel: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    <SelectItem value="basico">Básico</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="avancado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carga_horaria" className="text-slate-300">
                  Carga Horária (h) *
                </Label>
                <Input
                  id="carga_horaria"
                  type="number"
                  value={novaFormacao.carga_horaria}
                  onChange={(e) => setNovaFormacao({ ...novaFormacao, carga_horaria: Number(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vagas" className="text-slate-300">
                  Vagas *
                </Label>
                <Input
                  id="vagas"
                  type="number"
                  value={novaFormacao.vagas_totais}
                  onChange={(e) => setNovaFormacao({ ...novaFormacao, vagas_totais: Number(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custo" className="text-slate-300">
                  Custo (KZ)
                </Label>
                <Input
                  id="custo"
                  type="number"
                  value={novaFormacao.custo}
                  onChange={(e) => setNovaFormacao({ ...novaFormacao, custo: Number(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_inicio" className="text-slate-300">
                  Data de Início *
                </Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={novaFormacao.data_inicio}
                  onChange={(e) => setNovaFormacao({ ...novaFormacao, data_inicio: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_fim" className="text-slate-300">
                  Data de Término *
                </Label>
                <Input
                  id="data_fim"
                  type="date"
                  value={novaFormacao.data_fim}
                  onChange={(e) => setNovaFormacao({ ...novaFormacao, data_fim: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            {(novaFormacao.tipo === "presencial" || novaFormacao.tipo === "hibrido") && (
              <div className="space-y-2">
                <Label htmlFor="local" className="text-slate-300">
                  Local
                </Label>
                <Input
                  id="local"
                  value={novaFormacao.local}
                  onChange={(e) => setNovaFormacao({ ...novaFormacao, local: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Ex: Sala de Treinamento A"
                />
              </div>
            )}

           {/*  {(novaFormacao.tipo === "online" || novaFormacao.tipo === "ead" || novaFormacao.tipo === "hibrido") && (
              <div className="space-y-2">
                <Label htmlFor="plataforma" className="text-slate-300">
                  Plataforma
                </Label>
                <Input
                  id="plataforma"
                  value={novaFormacao.plataforma}
                  onChange={(e) => setNovaFormacao({ ...novaFormacao, plataforma: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Ex: Microsoft Teams, Zoom, Udemy"
                />
              </div>
            )} */}

            <div className="space-y-2">
              <Label htmlFor="nota_minima" className="text-slate-300">
                Nota Mínima para Aprovação (%)
              </Label>
              <Input
                id="nota_minima"
                type="number"
                min="0"
                max="100"
                value={novaFormacao.nota_minima_aprovacao}
                onChange={(e) => setNovaFormacao({ ...novaFormacao, nota_minima_aprovacao: Number(e.target.value) })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50">
              <div className="space-y-1">
                <Label htmlFor="obrigatoria" className="text-slate-300">
                  Formação Obrigatória
                </Label>
                <p className="text-xs text-slate-400">Todos os funcionários devem realizar</p>
              </div>
              <Switch
                id="obrigatoria"
                checked={novaFormacao.obrigatoria}
                onCheckedChange={(checked) => setNovaFormacao({ ...novaFormacao, obrigatoria: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50">
              <div className="space-y-1">
                <Label htmlFor="certificado" className="text-slate-300">
                  Emitir Certificado
                </Label>
                <p className="text-xs text-slate-400">Certificado digital ao concluir</p>
              </div>
              <Switch
                id="certificado"
                checked={novaFormacao.certificado}
                onCheckedChange={(checked) => setNovaFormacao({ ...novaFormacao, certificado: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setModalNovaFormacao(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={criarFormacao}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Criar Formação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Inscrição */}
      <Dialog open={modalInscricao} onOpenChange={setModalInscricao}>
        <DialogContent className="sm:max-w-[500px] bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-white">Inscrever Funcionário</DialogTitle>
            <DialogDescription className="text-slate-400">Realize a inscrição em uma formação</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="formacao" className="text-slate-300">
                Formação *
              </Label>
              <Select
                value={novaInscricao.formacao_id}
                onValueChange={(value) => setNovaInscricao({ ...novaInscricao, formacao_id: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione a formação" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  {formacoes
                    .filter((f) => f.status === "inscricoes_abertas" && f.vagas_disponiveis > 0)
                    .map((formacao) => (
                      <SelectItem key={formacao.id} value={formacao.id}>
                        {formacao.titulo} ({formacao.vagas_disponiveis} vagas)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="funcionario" className="text-slate-300">
                Funcionário *
              </Label>
              <Input
                id="funcionario"
                value={novaInscricao.funcionario_id}
                onChange={(e) => setNovaInscricao({ ...novaInscricao, funcionario_id: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="ID ou nome do funcionário"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="justificativa" className="text-slate-300">
                Justificativa
              </Label>
              <Textarea
                id="justificativa"
                value={novaInscricao.justificativa}
                onChange={(e) => setNovaInscricao({ ...novaInscricao, justificativa: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="Motivo da inscrição e objetivos de desenvolvimento..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setModalInscricao(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={realizarInscricao}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Confirmar Inscrição
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Novo Instrutor */}
      <Dialog open={modalNovoInstrutor} onOpenChange={setModalNovoInstrutor}>
        <DialogContent className="sm:max-w-[500px] bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-white">Adicionar Instrutor</DialogTitle>
            <DialogDescription className="text-slate-400">Cadastre um novo instrutor</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome_instrutor" className="text-slate-300">
                Nome Completo *
              </Label>
              <Input
                id="nome_instrutor"
                value={novoInstrutor.nome}
                onChange={(e) => setNovoInstrutor({ ...novoInstrutor, nome: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="especialidade" className="text-slate-300">
                Especialidade *
              </Label>
              <Input
                id="especialidade"
                value={novoInstrutor.especialidade}
                onChange={(e) => setNovoInstrutor({ ...novoInstrutor, especialidade: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Ex: Liderança e Desenvolvimento Humano"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email_instrutor" className="text-slate-300">
                  E-mail *
                </Label>
                <Input
                  id="email_instrutor"
                  type="email"
                  value={novoInstrutor.email}
                  onChange={(e) => setNovoInstrutor({ ...novoInstrutor, email: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-slate-300">
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  value={novoInstrutor.telefone}
                  onChange={(e) => setNovoInstrutor({ ...novoInstrutor, telefone: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="(11) 98765-4321"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_instrutor" className="text-slate-300">
                Tipo *
              </Label>
              <Select
                value={novoInstrutor.tipo}
                onValueChange={(value: any) => setNovoInstrutor({ ...novoInstrutor, tipo: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setModalNovoInstrutor(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={adicionarInstrutor}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Adicionar Instrutor
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Plano de Desenvolvimento */}
      <Dialog open={modalPlanoDesenvolvimento} onOpenChange={setModalPlanoDesenvolvimento}>
        <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-white">Criar Plano de Desenvolvimento Individual (PDI)</DialogTitle>
            <DialogDescription className="text-slate-400">
              Defina competências e formações para desenvolvimento do colaborador
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="funcionario_pdi" className="text-slate-300">
                Funcionário *
              </Label>
              <Input
                id="funcionario_pdi"
                value={novoPlano.funcionario_id}
                onChange={(e) => setNovoPlano({ ...novoPlano, funcionario_id: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="ID ou nome do funcionário"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Competências Alvo</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Liderança", "Comunicação", "Tecnologia", "Gestão de Projetos", "Idiomas", "Análise de Dados"].map(
                  (comp) => (
                    <div key={comp} className="flex items-center space-x-2 p-2 rounded bg-slate-700/50">
                      <input
                        type="checkbox"
                        id={`comp-${comp}`}
                        checked={novoPlano.competencias_alvo.includes(comp)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNovoPlano({
                              ...novoPlano,
                              competencias_alvo: [...novoPlano.competencias_alvo, comp],
                            })
                          } else {
                            setNovoPlano({
                              ...novoPlano,
                              competencias_alvo: novoPlano.competencias_alvo.filter((c) => c !== comp),
                            })
                          }
                        }}
                        className="rounded border-slate-600"
                      />
                      <label htmlFor={`comp-${comp}`} className="text-sm text-slate-300">
                        {comp}
                      </label>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Formações Planejadas</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {formacoes.slice(0, 6).map((formacao) => (
                  <div key={formacao.id} className="flex items-center space-x-2 p-2 rounded bg-slate-700/50">
                    <input
                      type="checkbox"
                      id={`form-${formacao.id}`}
                      checked={novoPlano.formacoes_planejadas.includes(formacao.titulo)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNovoPlano({
                            ...novoPlano,
                            formacoes_planejadas: [...novoPlano.formacoes_planejadas, formacao.titulo],
                          })
                        } else {
                          setNovoPlano({
                            ...novoPlano,
                            formacoes_planejadas: novoPlano.formacoes_planejadas.filter((f) => f !== formacao.titulo),
                          })
                        }
                      }}
                      className="rounded border-slate-600"
                    />
                    <label htmlFor={`form-${formacao.id}`} className="text-sm text-slate-300 flex-1">
                      {formacao.titulo}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prazo_pdi" className="text-slate-300">
                Prazo para Conclusão *
              </Label>
              <Input
                id="prazo_pdi"
                type="date"
                value={novoPlano.prazo}
                onChange={(e) => setNovoPlano({ ...novoPlano, prazo: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setModalPlanoDesenvolvimento(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={criarPlanoDesenvolvimento}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Criar PDI
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Avaliação de Formação */}
      <Dialog open={modalAvaliacaoFormacao} onOpenChange={setModalAvaliacaoFormacao}>
        <DialogContent className="sm:max-w-[500px] bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-white">Avaliar Formação</DialogTitle>
            <DialogDescription className="text-slate-400">Registre a avaliação final do participante</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="inscricao_avaliacao" className="text-slate-300">
                Inscrição *
              </Label>
              <Select
                value={avaliacaoFormacao.inscricao_id}
                onValueChange={(value) => setAvaliacaoFormacao({ ...avaliacaoFormacao, inscricao_id: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione a inscrição" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  {inscricoes
                    .filter((i) => i.status === "em_andamento")
                    .map((inscricao) => (
                      <SelectItem key={inscricao.id} value={inscricao.id}>
                        {inscricao.funcionario_nome} - {inscricao.formacao_titulo}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nota_final_avaliacao" className="text-slate-300">
                  Nota Final (0-100) *
                </Label>
                <Input
                  id="nota_final_avaliacao"
                  type="number"
                  min="0"
                  max="100"
                  value={avaliacaoFormacao.nota_final}
                  onChange={(e) => setAvaliacaoFormacao({ ...avaliacaoFormacao, nota_final: Number(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="presenca_avaliacao" className="text-slate-300">
                  Presença (%) *
                </Label>
                <Input
                  id="presenca_avaliacao"
                  type="number"
                  min="0"
                  max="100"
                  value={avaliacaoFormacao.presenca}
                  onChange={(e) => setAvaliacaoFormacao({ ...avaliacaoFormacao, presenca: Number(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback_avaliacao" className="text-slate-300">
                Feedback do Participante
              </Label>
              <Textarea
                id="feedback_avaliacao"
                value={avaliacaoFormacao.feedback}
                onChange={(e) => setAvaliacaoFormacao({ ...avaliacaoFormacao, feedback: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="Comentários sobre a formação..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50">
              <div className="space-y-1">
                <Label htmlFor="aprovado" className="text-slate-300">
                  Participante Aprovado
                </Label>
                <p className="text-xs text-slate-400">Atingiu os critérios de aprovação</p>
              </div>
              <Switch
                id="aprovado"
                checked={avaliacaoFormacao.aprovado}
                onCheckedChange={(checked) => setAvaliacaoFormacao({ ...avaliacaoFormacao, aprovado: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setModalAvaliacaoFormacao(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={avaliarFormacao}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Salvar Avaliação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GestaoFormacoes
