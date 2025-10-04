"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import Swal from "sweetalert2"
import { MetricCard } from "@/components/metrcCard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Briefcase,
  Building,
  DollarSign,
  TrendingUp,
  Search,
  Plus,
  Edit,
  Eye,
  MoreVertical,
  Download,
  Filter,
  Target,
  UserCheck,
  AlertCircle,
  BarChart3,
  MapPin,
  Clock,
  CheckCircle,
  Settings,
} from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { TooltipProvider } from "@/components/ui/tooltip"

// Types
interface Funcionario {
  id: string
  nome: string
  cargo: string
  email: string
  telefone: string
  dataAdmissao: string
  salario: number
  status: "ATIVO" | "FERIAS" | "AFASTADO" | "DESLIGADO"
  foto?: string
}

interface Vaga {
  id: string
  titulo: string
  status: "ABERTA" | "PAUSADA" | "FECHADA"
  candidatos: number
  dataAbertura: string
  prioridade: "URGENTE" | "ALTA" | "MEDIA" | "BAIXA"
}

// CORRIJA a interface Departamento - está faltando campos
interface Departamento {
  id: string
  nome: string
  codigo: string
  descricao: string
  responsavel: string
  empresa: string
  local: string
  status: boolean
  data_criacao: string  // Mantenha snake_case para corresponder ao backend
  orcamento: number
  
  totalFuncionarios?: number
  vagasAbertas?: number
  funcionarios?: Funcionario[]
  vagas?: Vaga[]
  custos?: {
    folhaPagamento: number
    beneficios: number
    treinamento: number
    outros: number
    total: number
  }
  metaContratacoes?: number
  contratacoesMes?: number
  taxaRotatividade?: number
  satisfacaoEquipe?: number
  produtividade?: number
  kpis?: {
    metasCumpridas: number
    projetosAtivos: number
    horasExtras: number
    absenteismo: number
  }
}

interface MetricasDepartamentos {
  totalDepartamentos: number
  totalFuncionarios: number
  orcamentoTotal: number
  orcamentoUtilizado: number
  vagasAbertas: number
  taxaRotatividadeMedia: number
  satisfacaoMedia: number
  produtividadeMedia: number
  departamentosAtivos: number
  custoMedioPorFuncionario: number
}

const useDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const fetchDepartamentos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/departamentos/', {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Dados recebidos do backend:", data);
        const funcResponse = await fetch('http://localhost:8000/valores/', {
        credentials: "include"
      })
      const funcionariosData = await funcResponse.json()
      const departamentosFormatados: Departamento[] = data.map((dep: any) => ({
        id: dep.id.toString(),
        nome: dep.nome || "Sem nome",
        codigo: dep.codigo || "N/A",
        descricao: dep.descricao || "",
        responsavel: dep.responsavel || "Não definido",
        empresa: dep.empresa?.toString() || "",
        local: dep.local || "Não especificado",
        status: dep.status || false,
        data_criacao: dep.data_criacao || new Date().toISOString(),
        orcamento: parseFloat(dep.orcamento) || 0,
        
        totalFuncionarios: dep.totalFuncionarios || 0,
        vagasAbertas: 0,
        funcionarios: [],
        vagas: [],
        custos: {
          folhaPagamento: 0,
          beneficios: 0,
          treinamento: 0,
          outros: 0,
          total: 0
        },
        metaContratacoes: 0,
        contratacoesMes: 0,
        taxaRotatividade: 0,
        satisfacaoEquipe: 0,
        produtividade: 0,
        kpis: {
          metasCumpridas: 0,
          projetosAtivos: 0,
          horasExtras: 0,
          absenteismo: 0
        }
      }));

      setDepartamentos(departamentosFormatados);
      
    } catch (error) {
      console.error("Erro ao buscar departamentos:", error);
      setError("Falha ao carregar departamentos");
      
      Swal.fire({
        title: "Erro",
        text: "Falha ao carregar departamentos",
        icon: "error",
        background: "#1e293b",
        color: "white",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartamentos();
  }, [fetchDepartamentos]);

  return { departamentos, loading, error, refetchDepartamentos: fetchDepartamentos };
};
/* const useDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDepartamentos = useCallback(async () => {
    try {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data - substituir pela API real
      const mockDepartamentos: Departamento[] = [
        {
          id: "1",
          nome: "Tecnologia & Inovação",
          codigo: "TI",
          descricao: "Responsável pelo desenvolvimento e manutenção de sistemas e infraestrutura tecnológica",
          gerente: {
            id: "1",
            nome: "Carlos Silva",
            email: "carlos.silva@empresa.com",
          },
          funcionarios: [],
          totalFuncionarios: 45,
          vagas: [],
          vagasAbertas: 8,
          orcamento: {
            total: 2500000,
            utilizado: 1875000,
            disponivel: 625000,
            percentualUtilizado: 75,
          },
          custos: {
            folhaPagamento: 1500000,
            beneficios: 250000,
            treinamento: 75000,
            outros: 50000,
            total: 1875000,
          },
          metaContratacoes: 10,
          contratacoesMes: 3,
          taxaRotatividade: 8.5,
          satisfacaoEquipe: 87,
          produtividade: 92,
          localizacao: "Luanda, Angola",
          dataCriacao: "2020-01-15",
          status: "ATIVO",
          kpis: {
            metasCumpridas: 85,
            projetosAtivos: 12,
            horasExtras: 120,
            absenteismo: 3.2,
          },
        },
        {
          id: "2",
          nome: "Recursos Humanos",
          codigo: "RH",
          descricao: "Gestão de pessoas, recrutamento, treinamento e desenvolvimento organizacional",
          gerente: {
            id: "2",
            nome: "Ana Rodrigues",
            email: "ana.rodrigues@empresa.com",
          },
          funcionarios: [],
          totalFuncionarios: 18,
          vagas: [],
          vagasAbertas: 2,
          orcamento: {
            total: 950000,
            utilizado: 760000,
            disponivel: 190000,
            percentualUtilizado: 80,
          },
          custos: {
            folhaPagamento: 600000,
            beneficios: 100000,
            treinamento: 40000,
            outros: 20000,
            total: 760000,
          },
          metaContratacoes: 5,
          contratacoesMes: 2,
          taxaRotatividade: 5.2,
          satisfacaoEquipe: 91,
          produtividade: 88,
          localizacao: "Luanda, Angola",
          dataCriacao: "2020-01-15",
          status: "ATIVO",
          kpis: {
            metasCumpridas: 92,
            projetosAtivos: 8,
            horasExtras: 45,
            absenteismo: 2.1,
          },
        },
        {
          id: "3",
          nome: "Comercial & Vendas",
          codigo: "COM",
          descricao: "Estratégias comerciais, vendas, relacionamento com clientes e expansão de mercado",
          gerente: {
            id: "3",
            nome: "Pedro Santos",
            email: "pedro.santos@empresa.com",
          },
          funcionarios: [],
          totalFuncionarios: 32,
          vagas: [],
          vagasAbertas: 5,
          orcamento: {
            total: 1800000,
            utilizado: 1440000,
            disponivel: 360000,
            percentualUtilizado: 80,
          },
          custos: {
            folhaPagamento: 1100000,
            beneficios: 220000,
            treinamento: 80000,
            outros: 40000,
            total: 1440000,
          },
          metaContratacoes: 8,
          contratacoesMes: 4,
          taxaRotatividade: 12.3,
          satisfacaoEquipe: 82,
          produtividade: 95,
          localizacao: "Luanda, Angola",
          dataCriacao: "2020-01-15",
          status: "ATIVO",
          kpis: {
            metasCumpridas: 88,
            projetosAtivos: 15,
            horasExtras: 180,
            absenteismo: 4.5,
          },
        },
        {
          id: "4",
          nome: "Financeiro",
          codigo: "FIN",
          descricao: "Gestão financeira, contabilidade, planejamento orçamentário e controles internos",
          gerente: {
            id: "4",
            nome: "Maria Costa",
            email: "maria.costa@empresa.com",
          },
          funcionarios: [],
          totalFuncionarios: 22,
          vagas: [],
          vagasAbertas: 3,
          orcamento: {
            total: 1200000,
            utilizado: 900000,
            disponivel: 300000,
            percentualUtilizado: 75,
          },
          custos: {
            folhaPagamento: 750000,
            beneficios: 100000,
            treinamento: 30000,
            outros: 20000,
            total: 900000,
          },
          metaContratacoes: 4,
          contratacoesMes: 1,
          taxaRotatividade: 6.8,
          satisfacaoEquipe: 89,
          produtividade: 90,
          localizacao: "Luanda, Angola",
          dataCriacao: "2020-01-15",
          status: "ATIVO",
          kpis: {
            metasCumpridas: 94,
            projetosAtivos: 6,
            horasExtras: 90,
            absenteismo: 2.8,
          },
        },
        {
          id: "5",
          nome: "Marketing & Comunicação",
          codigo: "MKT",
          descricao: "Estratégias de marketing, branding, comunicação corporativa e mídias digitais",
          gerente: {
            id: "5",
            nome: "João Ferreira",
            email: "joao.ferreira@empresa.com",
          },
          funcionarios: [],
          totalFuncionarios: 15,
          vagas: [],
          vagasAbertas: 4,
          orcamento: {
            total: 850000,
            utilizado: 680000,
            disponivel: 170000,
            percentualUtilizado: 80,
          },
          custos: {
            folhaPagamento: 500000,
            beneficios: 100000,
            treinamento: 50000,
            outros: 30000,
            total: 680000,
          },
          metaContratacoes: 6,
          contratacoesMes: 2,
          taxaRotatividade: 10.5,
          satisfacaoEquipe: 85,
          produtividade: 87,
          localizacao: "Luanda, Angola",
          dataCriacao: "2020-01-15",
          status: "ATIVO",
          kpis: {
            metasCumpridas: 82,
            projetosAtivos: 18,
            horasExtras: 150,
            absenteismo: 3.8,
          },
        },
        {
          id: "6",
          nome: "Operações & Logística",
          codigo: "OPS",
          descricao: "Gestão operacional, logística, cadeia de suprimentos e processos",
          gerente: {
            id: "6",
            nome: "Ricardo Alves",
            email: "ricardo.alves@empresa.com",
          },
          funcionarios: [],
          totalFuncionarios: 38,
          vagas: [],
          vagasAbertas: 6,
          orcamento: {
            total: 1600000,
            utilizado: 1280000,
            disponivel: 320000,
            percentualUtilizado: 80,
          },
          custos: {
            folhaPagamento: 950000,
            beneficios: 200000,
            treinamento: 80000,
            outros: 50000,
            total: 1280000,
          },
          metaContratacoes: 7,
          contratacoesMes: 3,
          taxaRotatividade: 9.2,
          satisfacaoEquipe: 84,
          produtividade: 91,
          localizacao: "Luanda, Angola",
          dataCriacao: "2020-01-15",
          status: "ATIVO",
          kpis: {
            metasCumpridas: 87,
            projetosAtivos: 10,
            horasExtras: 200,
            absenteismo: 4.2,
          },
        },
      ]

      setDepartamentos(mockDepartamentos)
    } catch (error) {
      console.error("Erro ao buscar departamentos:", error)
      Swal.fire({
        title: "Erro",
        text: "Falha ao carregar departamentos",
        icon: "error",
        background: "#1e293b",
        color: "white",
      })
    } finally {
      setLoading(false)
    }
  }, [])
 */



const useMetricasDepartamentos = (departamentos: Departamento[]) => {
  return useMemo(() => {
    // Proteção contra dados undefined
    if (!departamentos || departamentos.length === 0) {
      return {
        totalDepartamentos: 0,
        totalFuncionarios: 0,
        orcamentoTotal: 0,
        orcamentoUtilizado: 0,
        vagasAbertas: 0,
        taxaRotatividadeMedia: 0,
        satisfacaoMedia: 0,
        produtividadeMedia: 0,
        departamentosAtivos: 0,
        custoMedioPorFuncionario: 0,
      };
    }

    const metricas: MetricasDepartamentos = {
      totalDepartamentos: departamentos.length,
      totalFuncionarios: departamentos.reduce((acc, dep) => acc + (dep.totalFuncionarios || 0), 0),
      orcamentoTotal: departamentos.reduce((acc, dep) => acc + (dep.orcamento || 0), 0),
      orcamentoUtilizado: departamentos.reduce((acc, dep) => {
        // Se tiver custos, usa o total, senão estima 75% do orçamento
        return acc + (dep.custos?.total || (dep.orcamento || 0) * 0.75);
      }, 0),
      vagasAbertas: departamentos.reduce((acc, dep) => acc + (dep.vagasAbertas || 0), 0),
      taxaRotatividadeMedia: departamentos.reduce((acc, dep) => acc + (dep.taxaRotatividade || 0), 0) / departamentos.length,
      satisfacaoMedia: departamentos.reduce((acc, dep) => acc + (dep.satisfacaoEquipe || 0), 0) / departamentos.length,
      produtividadeMedia: departamentos.reduce((acc, dep) => acc + (dep.produtividade || 0), 0) / departamentos.length,
      departamentosAtivos: departamentos.filter((dep) => dep.status === true).length,
      custoMedioPorFuncionario: 0,
    };

    metricas.custoMedioPorFuncionario =
      metricas.totalFuncionarios > 0 ? metricas.orcamentoUtilizado / metricas.totalFuncionarios : 0;

    return metricas;
  }, [departamentos]);
};

const formatCurrency = (value: number | undefined | null, currency = "AOA") => {
  if (value === undefined || value === null || isNaN(value)) {
    return "AOA 0";
  }
return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(value);
}
const formatDate = (dateString: string | undefined | null) => {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return "Data inválida";
  }
  
  return new Date(dateString).toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const formatPercentage = (value: number | undefined | null) => {
  if (value === undefined || value === null || isNaN(value)) {
    return "0.0%";
  }
  
  return `${value.toFixed(1)}%`;
}

const DepartamentosDashboard = () => {
  const router = useRouter()
  const { departamentos, loading, refetchDepartamentos } = useDepartamentos()
  const metricas = useMetricasDepartamentos(departamentos)

  // State
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("TODOS")
  const [sortField, setSortField] = useState<string>("nome")
  
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [modalDepartamentoAberto, setModalDepartamentoAberto] = useState(false)
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false)
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState<Departamento | null>(null)

  const [nomeDepartamento, setNomeDepartamento] = useState("")
  const [codigoDepartamento, setCodigoDepartamento] = useState("")
  
  const [descricaoDepartamento, setDescricaoDepartamento] = useState("")
  const [responsavelDepartamento, setResponsavelDepartamento] = useState("")
  const [orcamentoDepartamento, setOrcamentoDepartamento] = useState("")
  const [localizacaoDepartamento, setLocalizacaoDepartamento] = useState("")
  const [statusDepartamento, setStatusDepartamento] = useState(true) 
 
  const departamentosFiltrados = useMemo(() => {
    const filtered = departamentos.filter((dep) => {
    const matchesSearch =
      dep.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.responsavel.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = 
      statusFilter === "TODOS" || 
      (statusFilter === "ATIVO" && dep.status) || 
      (statusFilter === "INATIVO" && !dep.status)

    return matchesSearch && matchesStatus
  })

    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof Departamento]
      let bValue: any = b[sortField as keyof Departamento]

      if (sortField === "gerente") {
        aValue = a.responsavel
        bValue = b.responsavel
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [departamentos, searchTerm, statusFilter, sortField, sortDirection])

  // Chart data
  const dadosGraficoFuncionarios = useMemo(() => {
    return departamentos.map((dep) => ({
      nome: dep.codigo,
      funcionarios: dep.totalFuncionarios,
      vagas: dep.vagasAbertas,
    }))
  }, [departamentos])

  const dadosGraficoOrcamento = useMemo(() => {
    return departamentos.map((dep) => ({
      nome: dep.codigo,
      utilizado: dep.orcamento,
      disponivel: dep.orcamento,
    }))
  }, [departamentos])

  const dadosGraficoPizza = useMemo(() => {
    return departamentos.map((dep) => ({
      name: dep.nome,
      value: dep.totalFuncionarios,
    }))
  }, [departamentos])

const dadosGraficoPerformance = useMemo(() => {
  return departamentos.slice(0, 6).map((dep) => ({
    departamento: dep.codigo,
    satisfacao: dep.satisfacaoEquipe || 0, 
    produtividade: dep.produtividade || 0,
    metasCumpridas: dep.kpis?.metasCumpridas || 0,
  }))
}, [departamentos])

  const PIE_COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#06b6d4"]

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusConfig = (status: boolean) => {
  return status 
    ? { label: "Ativo", color: "bg-green-500/20 text-green-400 border-green-500/30" }
    : { label: "Inativo", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" }
}

  const criarDepartamento = async () => {
  try {
    
    if (!nomeDepartamento || !codigoDepartamento || !responsavelDepartamento || !orcamentoDepartamento) {
      Swal.fire({
        title: "Campos obrigatórios",
        text: "Preencha todos os campos obrigatórios",
        icon: "warning",
        background: "#1e293b",
        color: "white",
      });
      return;
    }

    const novoDepartamento = {
      nome: nomeDepartamento,
      codigo: codigoDepartamento,
      descricao: descricaoDepartamento,
      responsavel: responsavelDepartamento,
      local: localizacaoDepartamento,
      orcamento: Number(orcamentoDepartamento),
      status:statusDepartamento
    };

    const response = await fetch('http://localhost:8000/departamentos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:"include",
      body: JSON.stringify(novoDepartamento),
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

  const departamentoCriado = await response.json();

    if(departamentoCriado) {
      Swal.fire({
        title: "Sucesso",
        text: "Departamento criado com sucesso",
        icon: "success",
        background: "#1e293b",
        color: "white",
      });
    }

    setModalDepartamentoAberto(false);
    resetForm();
    refetchDepartamentos();
    
  } catch (error) {
    console.error("Erro ao criar departamento:", error);
    Swal.fire({
      title: "Erro",
      text: "Falha ao criar departamento",
      icon: "error",
      background: "#1e293b",
      color: "white",
    });
  }
};

const resetForm = () => {
  setNomeDepartamento("");
  setCodigoDepartamento("");
  setDescricaoDepartamento("");
  setResponsavelDepartamento("");
  setOrcamentoDepartamento("");
  setLocalizacaoDepartamento("");
};

  const visualizarDetalhes = (departamento: Departamento) => {
    setDepartamentoSelecionado(departamento)
    setModalDetalhesAberto(true)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Gestão de Departamentos
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Visão completa de todos os departamentos, equipes, orçamentos e performance
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto gap-2 border-slate-600 text-cyan-400 hover:bg-slate-700 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Exportar Relatório
            </Button>
            <Button
              onClick={() => setModalDepartamentoAberto(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Departamento
            </Button>
          </div>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <MetricCard
            title="Departamentos"
            value={metricas.totalDepartamentos.toString()}
            icon={Building}
            description={`${metricas.departamentosAtivos} ativos`}
            trend={{ value: 0, isPositive: true }}
          />
          <MetricCard
            title="Total Funcionários"
            value={metricas.totalFuncionarios.toString()}
            icon={Users}
            description="Colaboradores ativos"
            trend={{ value: 5.2, isPositive: true }}
          />
          <MetricCard
            title="Vagas Abertas"
            value={metricas.vagasAbertas.toString()}
            icon={Briefcase}
            description="Posições disponíveis"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Orçamento Total"
            value={formatCurrency(metricas.orcamentoTotal)}
            icon={DollarSign}
            description={`${((metricas.orcamentoUtilizado / metricas.orcamentoTotal) * 100).toFixed(0)}% utilizado`}
            trend={{ value: -3.1, isPositive: false }}
          />
          {/* <MetricCard
            title="Satisfação Média"
            value={`${metricas.satisfacaoMedia.toFixed(0)}%`}
            icon={TrendingUp}
            description="Índice de satisfação"
            trend={{ value: 2.8, isPositive: true }}
          /> */}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="xl:col-span-2 space-y-8">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <CardTitle className="text-white">Lista de Departamentos</CardTitle>
                    <CardDescription className="text-slate-400">
                      {departamentosFiltrados.length} departamentos encontrados
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar departamentos..."
                        className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-40 bg-slate-700 border-slate-600 text-white">
                        <Filter className="h-4 w-4 mr-2 text-slate-400" />
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
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-slate-600">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-600 hover:bg-slate-700/50">
                        <TableHead className="w-[250px] text-slate-300">Departamento</TableHead>
                        <TableHead className="text-slate-300">Gerente</TableHead>
                        <TableHead className="text-slate-300">Funcionários</TableHead>
                        <TableHead className="text-slate-300">Orçamento</TableHead>
                        <TableHead className="text-slate-300">Performance</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-right text-slate-300">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departamentosFiltrados.map((departamento) => {
                        const statusInfo = getStatusConfig(departamento.status)
                        return (
                          <TableRow
                            key={departamento.id}
                            className="border-slate-600 hover:bg-slate-700/50 transition-colors"
                          >
                            <TableCell className="font-medium">
                              <div className="space-y-1">
                                <p className="font-semibold text-white">{departamento.nome}</p>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                                    {departamento.codigo}
                                  </Badge>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {departamento.local}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold text-xs">
                                  {departamento.responsavel.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">{departamento.responsavel}</p>
                                  {/* <p className="text-xs text-slate-400">{departamento.gerente.email}</p> */}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-slate-400" />
                                  <span className="font-semibold text-white">{departamento.totalFuncionarios}</span>
                                </div>
                                {departamento.vagasAbertas > 0 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-green-500/20 text-green-400 border-green-500/30"
                                  >
                                    {departamento.vagasAbertas} vagas
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-slate-400">Total:</span>
                                  <span className="font-semibold text-white">
                                    {formatCurrency(departamento.orcamento)}
                                  </span>
                                </div>
{/*                                 <Progress value={departamento.orcamento.percentualUtilizado} className="h-2" /> */}
                                <p className="text-xs text-slate-400">
                            {/*       {departamento.orcamento.percentualUtilizado}% utilizado */}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-green-400" />
                                  <span className="text-sm text-white">{departamento.satisfacaoEquipe}%</span>
                                </div>
                                <p className="text-xs text-slate-400">Satisfação</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`w-fit ${statusInfo.color}`}>{statusInfo.label}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-600">
                                  <DropdownMenuItem
                                    className="text-slate-300 hover:bg-slate-700"
                                    onClick={() => visualizarDetalhes(departamento)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver Detalhes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                                    <Users className="h-4 w-4 mr-2" />
                                    Ver Funcionários
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                                    <Briefcase className="h-4 w-4 mr-2" />
                                    Ver Vagas
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-slate-600" />
                                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Configurações
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>

                  {departamentosFiltrados.length === 0 && (
                    <div className="text-center py-12">
                      <Building className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Nenhum departamento encontrado</h3>
                      <p className="text-slate-400 mb-6">
                        {searchTerm || statusFilter !== "TODOS"
                          ? "Tente ajustar os filtros de pesquisa"
                          : "Comece criando seu primeiro departamento"}
                      </p>
                      <Button
                        onClick={() => setModalDepartamentoAberto(true)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeiro Departamento
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-2xl text-white">
                      <BarChart3 className="h-6 w-6 text-cyan-400" />
                      Analytics de Departamentos
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Métricas de desempenho e distribuição de recursos
                    </CardDescription>
                  </div>
                  <Select defaultValue="todos">
                    <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="ativos">Ativos</SelectItem>
                      <SelectItem value="inativos">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="funcionarios" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                    <TabsTrigger value="funcionarios" className="text-slate-300 data-[state=active]:bg-slate-600">
                      Funcionários
                    </TabsTrigger>
                    <TabsTrigger value="orcamento" className="text-slate-300 data-[state=active]:bg-slate-600">
                      Orçamento
                    </TabsTrigger>
                    <TabsTrigger value="distribuicao" className="text-slate-300 data-[state=active]:bg-slate-600">
                      Distribuição
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="text-slate-300 data-[state=active]:bg-slate-600">
                      Performance
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="funcionarios" className="space-y-6 mt-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dadosGraficoFuncionarios}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                          <XAxis dataKey="nome" stroke="#cbd5e1" />
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
                          <Bar dataKey="funcionarios" name="Funcionários" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="vagas" name="Vagas Abertas" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="orcamento" className="space-y-6 mt-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dadosGraficoOrcamento}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                          <XAxis dataKey="nome" stroke="#cbd5e1" />
                          <YAxis stroke="#cbd5e1" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #475569",
                              borderRadius: "8px",
                              color: "white",
                            }}
                            formatter={(value: number) => formatCurrency(value)}
                          />
                          <Legend />
                          <Bar dataKey="utilizado" name="Utilizado" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="disponivel" name="Disponível" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="distribuicao" className="mt-6">
                    <div className="h-80 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dadosGraficoPizza}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {dadosGraficoPizza.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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

                  <TabsContent value="performance" className="space-y-6 mt-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dadosGraficoPerformance}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                          <XAxis dataKey="departamento" stroke="#cbd5e1" />
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
                          <Bar dataKey="satisfacao" name="Satisfação" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="produtividade" name="Produtividade" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="metasCumpridas" name="Metas Cumpridas" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            
            
          </div>

          
          <div className="space-y-8">
            
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Estatísticas Rápidas</CardTitle>
                <CardDescription className="text-slate-400">Visão geral do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Taxa Rotatividade</span>
                  <Badge variant="default" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    {formatPercentage(metricas.taxaRotatividadeMedia)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Produtividade Média</span>
                  <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                    {formatPercentage(metricas.produtividadeMedia)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Custo/Funcionário</span>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {formatCurrency(metricas.custoMedioPorFuncionario)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Orçamento Disponível</span>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    {formatCurrency(metricas.orcamentoTotal - metricas.orcamentoUtilizado)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Top Performance</CardTitle>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    Top 3
                  </Badge>
                </div>
                <CardDescription className="text-slate-400">Departamentos com melhor desempenho</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {departamentos
                  .sort((a, b) => b.satisfacaoEquipe - a.satisfacaoEquipe)
                  .slice(0, 3)
                  .map((dep, index) => (
                    <div
                      key={dep.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-white">{dep.nome}</p>
                          <p className="text-xs text-slate-400">{dep.codigo}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {dep.satisfacaoEquipe}%
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Ações Rápidas</CardTitle>
                <CardDescription className="text-slate-400">Ferramentas essenciais</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button
                  variant="outline"
                  className="justify-start h-12 px-4 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  <Users className="mr-3 h-5 w-5 text-cyan-400" />
                  <div className="text-left">
                    <p className="font-medium text-cyan-400">Gestão de Equipes</p>
                    <p className="text-xs text-slate-400">Gerenciar funcionários</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-12 px-4 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  <DollarSign className="mr-3 h-5 w-5 text-green-400" />
                  <div className="text-left">
                    <p className="font-medium text-cyan-400">Orçamentos</p>
                    <p className="text-xs text-slate-400">Controle financeiro</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-12 px-4 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  <BarChart3 className="mr-3 h-5 w-5 text-purple-400" />
                  <div className="text-left">
                    <p className="font-medium text-cyan-400">Relatórios</p>
                    <p className="text-xs text-slate-400">Analytics detalhado</p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Budget Alert */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 border-l-4 border-l-yellow-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-white text-base">Alerta de Orçamento</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {/* <p className="text-sm text-slate-300 mb-3">
                  {departamentos.filter((d) => d.orcamento.percentualUtilizado > 80).length} departamentos com mais de
                  80% do orçamento utilizado
                </p> */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
                >
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal Novo Departamento */}
        <Dialog open={modalDepartamentoAberto} onOpenChange={setModalDepartamentoAberto}>
          <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-600 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Criar Novo Departamento</DialogTitle>
              <DialogDescription className="text-slate-400">
                Preencha as informações do novo departamento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-slate-300">
                    Nome do Departamento *
                  </Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Tecnologia & Inovação"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={nomeDepartamento}
                    onChange={(e) => setNomeDepartamento(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigo" className="text-slate-300">
                    Código *
                  </Label>
                  <Input
                    id="codigo"
                    placeholder="Ex: TI"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={codigoDepartamento}
                    onChange={(e) => setCodigoDepartamento(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-slate-300">
                  Descrição
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva as responsabilidades e objetivos do departamento..."
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                  value={descricaoDepartamento}
                  onChange={(e) => setDescricaoDepartamento(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="responsavel" className="text-slate-300">
                  Responsável * {/* CORRIGIDO: era Gerente Responsável */}
                </Label>
                <Input
                  id="responsavel"
                  placeholder="Ex: Carlos Silva"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={responsavelDepartamento} // CORRIGIDO
                  onChange={(e) => setResponsavelDepartamento(e.target.value)} // CORRIGIDO
                />
              </div>
                <div className="space-y-2">
                  <Label htmlFor="localizacao" className="text-slate-300">
                    Localização *
                  </Label>
                  <Input
                    id="localizacao"
                    placeholder="Ex: Luanda, Angola"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={localizacaoDepartamento}
                    onChange={(e) => setLocalizacaoDepartamento(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orcamento" className="text-slate-300">
                  Orçamento Anual (AOA) *
                </Label>
                <Input
                  id="orcamento"
                  type="number"
                  placeholder="Ex: 2500000"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={orcamentoDepartamento}
                  onChange={(e) => setOrcamentoDepartamento(e.target.value)}
                />
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                <h4 className="text-sm font-medium text-white mb-3">Configurações Adicionais</h4>
                <div className="space-y-3">
                <div className="flex items-center justify-between">
                <Label htmlFor="ativo" className="text-slate-300">
                  Departamento Ativo
                </Label>
                <Switch 
                  id="ativo" 
                  checked={statusDepartamento} 
                  onCheckedChange={setStatusDepartamento}
                />
              </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notificacoes" className="text-slate-300">
                      Notificações de Orçamento
                    </Label>
                    <Switch id="notificacoes" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setModalDepartamentoAberto(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={criarDepartamento}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                Criar Departamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Detalhes do Departamento */}
        <Dialog open={modalDetalhesAberto} onOpenChange={setModalDetalhesAberto}>
          <DialogContent className="sm:max-w-[800px] bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl">{departamentoSelecionado?.nome}</DialogTitle>
              <DialogDescription className="text-slate-400">Informações detalhadas do departamento</DialogDescription>
            </DialogHeader>
            {departamentoSelecionado && (
              <div className="space-y-6 py-4">
                {/* Header Info */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm text-slate-400">Funcionários</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{departamentoSelecionado.totalFuncionarios}</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-slate-400">Vagas Abertas</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{departamentoSelecionado.vagasAbertas}</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-slate-400">Satisfação</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{departamentoSelecionado.satisfacaoEquipe}%</p>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                    <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:bg-slate-600">
                      Visão Geral
                    </TabsTrigger>
                    <TabsTrigger value="orcamento" className="text-slate-300 data-[state=active]:bg-slate-600">
                      Orçamento
                    </TabsTrigger>
                    <TabsTrigger value="equipe" className="text-slate-300 data-[state=active]:bg-slate-600">
                      Equipe
                    </TabsTrigger>
                    <TabsTrigger value="kpis" className="text-slate-300 data-[state=active]:bg-slate-600">
                      KPIs
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-slate-400">Descrição</Label>
                        <p className="text-white mt-1">{departamentoSelecionado.descricao}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-400">Gerente</Label>
                          <p className="text-white mt-1">{departamentoSelecionado.responsavel}</p>
                          {/* <p className="text-sm text-slate-400">{departamentoSelecionado.gerente.email}</p> */}
                        </div>
                        <div>
                          <Label className="text-slate-400">Localização</Label>
                          <p className="text-white mt-1">{departamentoSelecionado.local}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-400">Taxa de Rotatividade</Label>
                          <p className="text-white mt-1">
                            {formatPercentage(departamentoSelecionado.taxaRotatividade)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-slate-400">Produtividade</Label>
                          <p className="text-white mt-1">{departamentoSelecionado.produtividade}%</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="orcamento" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-400">Orçamento Total</span>
                          <span className="text-xl font-bold text-white">
                            {formatCurrency(departamentoSelecionado.orcamento)}
                          </span>
                        </div>
{/*                         <Progress value={departamentoSelecionado.orcamento.percentualUtilizado} className="h-3" /> */}
                        <div className="flex justify-between mt-2 text-sm">
                          <span className="text-slate-400">
                           {/*  Utilizado: {formatCurrency(departamentoSelecionado.orcamento.utilizado)} */}
                          </span>
                          <span className="text-green-400">
                            {/* Disponível: {formatCurrency(departamentoSelecionado.orcamento.disponivel)} */}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-white">Distribuição de Custos</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                            <span className="text-slate-300">Folha de Pagamento</span>
                            <span className="font-semibold text-white">
                              {formatCurrency(departamentoSelecionado.custos.folhaPagamento)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                            <span className="text-slate-300">Benefícios</span>
                            <span className="font-semibold text-white">
                              {formatCurrency(departamentoSelecionado.custos.beneficios)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                            <span className="text-slate-300">Treinamento</span>
                            <span className="font-semibold text-white">
                              {formatCurrency(departamentoSelecionado.custos.treinamento)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                            <span className="text-slate-300">Outros</span>
                            <span className="font-semibold text-white">
                              {formatCurrency(departamentoSelecionado.custos.outros)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="equipe" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-white">Informações da Equipe</h4>
                        <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                          Ver Todos
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                          <div className="flex items-center gap-2 mb-2">
                            <UserCheck className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-slate-400">Contratações (Mês)</span>
                          </div>
                          <p className="text-xl font-bold text-white">
                            {departamentoSelecionado.contratacoesMes} / {departamentoSelecionado.metaContratacoes}
                          </p>
                          <Progress
                            value={
                              (departamentoSelecionado.contratacoesMes / departamentoSelecionado.metaContratacoes) * 100
                            }
                            className="h-2 mt-2"
                          />
                        </div>
                        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-orange-400" />
                            <span className="text-sm text-slate-400">Horas Extras</span>
                          </div>
                          <p className="text-xl font-bold text-white">{departamentoSelecionado.kpis.horasExtras}h</p>
                        </div>
                      </div>
                      <div className="bg-slate-700/30 p-4 rounded-lg">
                        <p className="text-sm text-slate-400 mb-2">Taxa de Absenteísmo</p>
                        <div className="flex items-center gap-3">
                          <Progress value={departamentoSelecionado.kpis.absenteismo * 10} className="flex-1" />
                          <span className="text-white font-semibold">
                            {formatPercentage(departamentoSelecionado.kpis.absenteismo)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="kpis" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-slate-400">Metas Cumpridas</span>
                        </div>
                        <p className="text-2xl font-bold text-white mb-2">
                          {departamentoSelecionado.kpis.metasCumpridas}%
                        </p>
                        <Progress value={departamentoSelecionado.kpis.metasCumpridas} className="h-2" />
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-slate-400">Projetos Ativos</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{departamentoSelecionado.kpis.projetosAtivos}</p>
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-purple-400" />
                          <span className="text-sm text-slate-400">Produtividade</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{departamentoSelecionado.produtividade}%</p>
                        <Progress value={departamentoSelecionado.produtividade} className="h-2 mt-2" />
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-cyan-400" />
                          <span className="text-sm text-slate-400">Satisfação</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{departamentoSelecionado.satisfacaoEquipe}%</p>
                        <Progress value={departamentoSelecionado.satisfacaoEquipe} className="h-2 mt-2" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setModalDetalhesAberto(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Fechar
              </Button>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Editar Departamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

// Skeleton Component
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 space-y-8">
    <div className="flex justify-between items-center">
      <div>
        <Skeleton className="h-8 w-64 mb-2 bg-slate-700" />
        <Skeleton className="h-4 w-96 bg-slate-700" />
      </div>
      <Skeleton className="h-10 w-40 bg-slate-700" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-lg bg-slate-700" />
      ))}
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-8">
        <Skeleton className="h-96 rounded-lg bg-slate-700" />
        <Skeleton className="h-96 rounded-lg bg-slate-700" />
      </div>
      <div className="space-y-8">
        <Skeleton className="h-64 rounded-lg bg-slate-700" />
        <Skeleton className="h-64 rounded-lg bg-slate-700" />
      </div>
    </div>
  </div>
)

export default DepartamentosDashboard
