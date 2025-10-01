'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { MetricCard } from "@/components/metrcCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  FileText,
  Briefcase,
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Mail,
  Calendar,
  ArrowUpDown,
  Plus,
  Edit,
  Filter,
  Download,
  MoreVertical,
  TrendingUp,
  Eye,
  Send,
  BarChart3,
  MapPin,
  DollarSign,
  Building,
  Target,
  Zap,
  CalendarDays,
  UserCheck,
  FileCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from 'next/link';

type VagaStatus = 'ABERTA' | 'PAUSADA' | 'FECHADA' | 'RASCUNHO' | 'EXPIRADA';
type PrioridadeVaga = 'URGENTE' | 'ALTA' | 'MEDIA' | 'BAIXA';
type EtapaCandidato = 'TRIAGEM' | 'ENTREVISTA_INICIAL' | 'TESTE_TECNICO' | 'ENTREVISTA_FINAL' | 'AVALIACAO' | 'APROVADO' | 'REJEITADO' | 'CONTRATADO';
type TipoContrato = 'EFETIVO' | 'TEMPORARIO' | 'ESTAGIO' | 'PJ' | 'FREELANCE';
type NivelExperiencia = 'ESTAGIARIO' | 'JUNIOR' | 'PLENO' | 'SENIOR' | 'ESPECIALISTA' | 'COORDENADOR';

interface Vaga {
  id: string;
  codigo: string;
  titulo: string;
  departamento: Departamento;
  candidatos: number;
  status: VagaStatus;
  dataAbertura: string;
  dataFim: string;
  prioridade: PrioridadeVaga;
  tipoContrato: TipoContrato;
  nivel: NivelExperiencia;
  salarioBase: number;
  salarioMaximo?: number;
  localTrabalho: 'PRESENCIAL' | 'HIBRIDO' | 'REMOTO';
  localizacao: string;
  descricao: string;
  requisitos: string[];
  beneficios: string[];
  habilidades: string[];
  metrica: {
    views: number;
    candidaturas: number;
    taxaConversao: number;
    tempoMedioContratacao: number;
  };
  criadoPor: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

interface Candidato {
  id: string;
  codigo: string;
  nome: string;
  email: string;
  telefone: string;
  vaga: Vaga;
  etapa: EtapaCandidato;
  dataInscricao: string;
  score: number;
  status: 'ATIVO' | 'INATIVO' | 'ARQUIVADO';
  ultimaAtualizacao: string;
  origem: 'SITE' | 'LINKEDIN' | 'INDEED' | 'GLASSDOOR' | 'INDICACAO' | 'OUTRO';
  curriculoUrl: string;
  entrevistas: Entrevista[];
  notas: string;
}

interface Departamento {
  id: string;
  nome: string;
  codigo: string;
  gerente: string;
  orcamento: number;
  quantidadeVagas: number;
  metaContratacoes: number;
}

interface MetricasRecrutamento {
  vagasAtivas: number;
  totalCandidatos: number;
  taxaConversao: number;
  tempoMedioContratacao: number;
  candidatosHoje: number;
  entrevistasAgendadas: number;
  contratacoesMes: number;
  vagasPreenchidas: number;
  custoPorContratacao: number;
  satisfacaoRecrutamento: number;
}

interface VagaMensal {
  mes: string;
  vagas: number;
  contratacoes: number;
  candidatos: number;
  entrevistas: number;
  taxaSucesso: number;
}

interface Entrevista {
  id: string;
  candidato: Candidato;
  vaga: Vaga;
  dataHora: string;
  duracao: number;
  local: string;
  tipo: 'PRESENCIAL' | 'VIRTUAL' | 'TELEFONICA';
  link?: string;
  descricao: string;
  status: 'AGENDADA' | 'CONFIRMADA' | 'REALIZADA' | 'CANCELADA' | 'REAGENDADA';
  entrevistadores: string[];
  feedback?: string;
  avaliacao?: number;
}

const useRecruitmentMetrics = () => {
  const [metrics, setMetrics] = useState<MetricasRecrutamento>({
    vagasAtivas: 0,
    totalCandidatos: 0,
    taxaConversao: 0,
    tempoMedioContratacao: 0,
    candidatosHoje: 0,
    entrevistasAgendadas: 0,
    contratacoesMes: 0,
    vagasPreenchidas: 0,
    custoPorContratacao: 0,
    satisfacaoRecrutamento: 0
  });

  const fetchMetrics = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setMetrics({
        vagasAtivas: 15,
        totalCandidatos: 342,
        taxaConversao: 32,
        tempoMedioContratacao: 21,
        candidatosHoje: 12,
        entrevistasAgendadas: 8,
        contratacoesMes: 6,
        vagasPreenchidas: 9,
        custoPorContratacao: 12500,
        satisfacaoRecrutamento: 87
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, refetchMetrics: fetchMetrics };
};

const useVagas = () => {
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState<string>('')
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [vagamensal, setVagamensal] = useState<VagaMensal[]>([]);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [vagasAbertas, setVagasAbertas] = useState(0)
  const [tipoVaga, setTipoVaga] = useState('')
  const [titulo, setTitulo] = useState('')
  
  const [empresaNome, setEmpresaNome] = useState('')

  const [loading, setLoading] = useState(true);
   
  const fetchVagas = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockVagas: Vaga[] = [
        {
          id: '1',
          codigo: 'DEV-FRONT-2024-001',
          titulo: 'Desenvolvedor Frontend Sênior - React/TypeScript',
          departamento: {
            id: '1',
            nome: 'Tecnologia & Inovação',
            codigo: 'TI',
            gerente: 'Carlos Silva',
            orcamento: 2500000,
            quantidadeVagas: 8,
            metaContratacoes: 5
          },
          candidatos: 28,
          status: 'ABERTA',
          dataAbertura: '2024-01-15',
          dataFim: '2024-03-15',
          prioridade: 'ALTA',
          tipoContrato: 'EFETIVO',
          nivel: 'SENIOR',
          salarioBase: 950000,
          salarioMaximo: 1300000,
          localTrabalho: 'HIBRIDO',
          localizacao: 'Luanda, Angola',
          descricao: 'Buscamos desenvolvedor frontend sênior para atuar em projetos inovadores...',
          requisitos: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Jest'],
          beneficios: ['Plano de Saúde', 'Vale Alimentação', 'Seguro de Vida', 'GymPass'],
          habilidades: ['React', 'TypeScript', 'UI/UX', 'Performance'],
          metrica: {
            views: 1247,
            candidaturas: 28,
            taxaConversao: 2.2,
            tempoMedioContratacao: 18
          },
          criadoPor: 'Ana Rodrigues',
          dataCriacao: '2024-01-10',
          dataAtualizacao: '2024-01-28'
        }
      ];
      
      setVagas(mockVagas);
    } catch (error) {
      console.error('Error fetching vagas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVagas();
  }, [fetchVagas]);

  return { vagas, loading, refetchVagas: fetchVagas };
};

// Utility Functions
const formatCurrency = (value: number, currency: string = 'AOA') => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getDaysUntil = (dateString: string) => {
  const today = new Date();
  const targetDate = new Date(dateString);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Color Constants matching the menu
const COLORS = {
  primary: {
    bg: 'bg-slate-900',
    text: 'text-slate-900',
    border: 'border-slate-900',
    from: 'from-slate-900',
    to: 'to-slate-800'
  },
  accent: {
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-500',
      border: 'border-blue-500',
      from: 'from-blue-500',
      to: 'to-cyan-500'
    },
    cyan: {
      bg: 'bg-cyan-500',
      text: 'text-cyan-500',
      border: 'border-cyan-500',
      from: 'from-cyan-500',
      to: 'to-blue-600'
    }
  },
  status: {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }
};

const RecrutamentoDashboard = () => {
  const router = useRouter();
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [candidatoRecentes, setCandidatoRecentes] = useState<Candidato[]>([])
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [departamentoFilter, setDepartamentoFilter] = useState<string>('TODOS');
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>('TODOS');
  const [sortField, setSortField] = useState<string>('dataAbertura');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState<string>('')
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [vagamensal, setVagamensal] = useState<VagaMensal[]>([]);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [vagasAbertas, setVagasAbertas] = useState(0)
  const [descricao, setdescricao]=useState('')
  const [tipoVaga, setTipoVaga] = useState('')
  const [titulo, setTitulo] = useState('')
  const { metrics } = useRecruitmentMetrics();
  const [tipoContrato, setTipoContrato] = useState("");
const [nivel, setNivel] = useState("");
const [modalidade, setModalidade] = useState("");
const [vagasDisponiveis, setVagasDisponiveis] = useState(1);
const [cidade, setCidade] = useState("");
const [salarioMin, setSalarioMin] = useState("");
const [salarioMax, setSalarioMax] = useState("");
const [requisitosObrigatorios, setRequisitosObrigatorios] = useState("");
const [requisitosDesejaveis, setRequisitosDesejaveis] = useState("");
const [prazoInscricao, setPrazoInscricao] = useState("");
const [previsaoInicio, setPrevisaoInicio] = useState("");
const [etapasProcesso, setEtapasProcesso] = useState("");

  const [contrato, setcontrato]=useState('')
  const [loading,setLoading]=useState(false)
  /* const { vagas, loading } = useVagas(); */

  const [modalVagaAberto, setModalVagaAberto] = useState(false);
  const [modalEntrevistaAberto, setModalEntrevistaAberto] = useState(false);
  const [modalTesteAberto, setModalTesteAberto] = useState(false);
  const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false);
  const fetchDashboardData = async () => {
    try {
      const [vagasRes, departamentosRes, candidatosRes] = await Promise.all([
        fetch("http://localhost:8000/vaga/", { credentials: "include" }),
        fetch("http://localhost:8000/departamentos/", { credentials: "include" }),
        fetch("http://localhost:8000/Candidatos/", { credentials: "include" })
      ]);

      const vagasData = await vagasRes.json();
      const departamentosData = await departamentosRes.json();
      const candidatosData = await candidatosRes.json();

      if (vagasRes.ok) {
        setVagasAbertas(vagasData.Aberta);
        setVagamensal(vagasData.vagas);
        /* setCandidatoTotal(vagasData.candidato); */
        setVagas(vagasData.destaque);
        setCandidatoRecentes(vagasData.ultimaHoras);
        /* setEmpresaNome(vagasData.empresa.nome); */
      }

      if (departamentosRes.ok) {
        setDepartamentos(departamentosData.dados);
      }

      if (candidatosRes.ok) {
        /* setCandidatura(candidatosData.dados); */
        setCandidatos(candidatosData.dados);
        /* setHoje(candidatosData.candidatoshoje.length); */
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
       setLoading(false); 
    }
  };
  useEffect(() => {
    fetchDashboardData()
  }, []);
  const vagasFiltradas = useMemo(() => {
    let filtered = vagas.filter(vaga => {
      const matchesSearch = vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vaga.departamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vaga.codigo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'TODOS' || vaga.status === statusFilter;
      const matchesDepartamento = departamentoFilter === 'TODOS' || vaga.departamento.id === departamentoFilter;
      const matchesPrioridade = prioridadeFilter === 'TODOS' || vaga.prioridade === prioridadeFilter;
      
      return matchesSearch && matchesStatus && matchesDepartamento && matchesPrioridade;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof Vaga];
      let bValue: any = b[sortField as keyof Vaga];

      if (sortField === 'departamento') {
        aValue = a.departamento.nome;
        bValue = b.departamento.nome;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [vagas, searchTerm, statusFilter, departamentoFilter, prioridadeFilter, sortField, sortDirection]);

  const candidatosRecentes = useMemo(() => {
    return [
      {
        id: '1',
        codigo: 'CAND-2024-001',
        nome: 'Maria Silva',
        email: 'maria.silva@email.com',
        telefone: '+244 923 456 789',
        vaga: vagas[0],
        etapa: 'ENTREVISTA_INICIAL',
        dataInscricao: '2024-01-28',
        score: 85,
        status: 'ATIVO',
        ultimaAtualizacao: '2024-01-29',
        origem: 'SITE',
        curriculoUrl: '/curriculos/maria-silva.pdf',
        entrevistas: [],
        avaliacoes: [],
        notas: 'Candidata com excelente perfil técnico'
      }
    ];
  }, [vagas]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusConfig = (status: VagaStatus) => {
    const config = {
      ABERTA: { label: 'Aberta', variant: 'default' as const, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      PAUSADA: { label: 'Pausada', variant: 'secondary' as const, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      FECHADA: { label: 'Fechada', variant: 'secondary' as const, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
      EXPIRADA: { label: 'Expirada', variant: 'destructive' as const, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      RASCUNHO: { label: 'Rascunho', variant: 'outline' as const, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
    };
    return config[status];
  };

  const getPrioridadeConfig = (prioridade: PrioridadeVaga) => {
    const config = {
      URGENTE: { label: 'Urgente', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      ALTA: { label: 'Alta', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
      MEDIA: { label: 'Média', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      BAIXA: { label: 'Baixa', color: 'bg-green-500/20 text-green-400 border-green-500/30' }
    };
    return config[prioridade];
  };

  const getEtapaConfig = (etapa: EtapaCandidato) => {
    const config = {
      TRIAGEM: { label: 'Triagem', color: 'bg-blue-500/20 text-blue-400' },
      ENTREVISTA_INICIAL: { label: 'Entrevista Inicial', color: 'bg-purple-500/20 text-purple-400' },
      TESTE_TECNICO: { label: 'Teste Técnico', color: 'bg-orange-500/20 text-orange-400' },
      ENTREVISTA_FINAL: { label: 'Entrevista Final', color: 'bg-indigo-500/20 text-indigo-400' },
      AVALIACAO: { label: 'Avaliação', color: 'bg-cyan-500/20 text-cyan-400' },
      APROVADO: { label: 'Aprovado', color: 'bg-green-500/20 text-green-400' },
      REJEITADO: { label: 'Rejeitado', color: 'bg-red-500/20 text-red-400' },
      CONTRATADO: { label: 'Contratado', color: 'bg-emerald-500/20 text-emerald-400' }
    };
    return config[etapa];
  };

  const criarVaga = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Swal.fire({
        title: 'Sucesso!',
        text: 'Vaga criada com sucesso',
        icon: 'success',
        confirmButtonText: 'Continuar',
        background: '#1e293b',
        color: 'white'
      });
      
      setModalVagaAberto(false);
    } catch (error) {
      Swal.fire('Erro', 'Falha ao criar vaga', 'error');
    }
  };

  const exportarRelatorio = async (tipo: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Swal.fire({
        title: 'Relatório Exportado!',
        text: `Relatório de ${tipo} gerado com sucesso`,
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#1e293b',
        color: 'white'
      });
      
    } catch (error) {
      Swal.fire('Erro', 'Falha ao exportar relatório', 'error');
    }
  };

  
  const dadosGraficoBarras = [
    { mes: 'Jan', vagas: 8, contratacoes: 3, candidatos: 45 },
    { mes: 'Fev', vagas: 12, contratacoes: 5, candidatos: 67 },
    { mes: 'Mar', vagas: 10, contratacoes: 4, candidatos: 52 },
    { mes: 'Abr', vagas: 15, contratacoes: 6, candidatos: 89 },
    { mes: 'Mai', vagas: 18, contratacoes: 8, candidatos: 112 },
    { mes: 'Jun', vagas: 22, contratacoes: 10, candidatos: 145 }
  ];

  const dadosGraficoPizza = [
    { name: 'Triagem', value: 35 },
    { name: 'Entrevista', value: 25 },
    { name: 'Teste Técnico', value: 20 },
    { name: 'Aprovados', value: 12 },
    { name: 'Rejeitados', value: 8 }
  ];

  const PIE_COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen  p-6 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Recrutamento e Seleção 
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Gerencie todo o ciclo de recrutamento e seleção com ferramentas inteligentes
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto gap-2 border-slate-600 text-cyan-700 hover:bg-slate-700"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics Avançado
            </Button>
            <Button 
              onClick={() => setModalVagaAberto(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Nova Oportunidade
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <MetricCard 
            title="Vagas Ativas" 
            value={metrics.vagasAtivas.toString()} 
            icon={Briefcase}
            description={`${metrics.vagasPreenchidas} preenchidas`}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard 
            title="Candidatos" 
            value={metrics.totalCandidatos.toString()} 
            icon={Users}
            description={`${metrics.candidatosHoje} hoje`}
            trend={{ value: 8, isPositive: true }}
           />
          <MetricCard 
            title="Taxa de Conversão" 
            value={`${metrics.taxaConversao}%`} 
            icon={TrendingUp}
            description="Eficiência do processo"
            trend={{ value: 5.2, isPositive: true }}
          />
          <MetricCard 
            title="Tempo Médio" 
            value={`${metrics.tempoMedioContratacao}d`} 
            icon={Clock}
            description="Até contratação"
            trend={{ value: -2.1, isPositive: false }}
          />
          
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-8">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-2xl text-white">
                      <Target className="h-6 w-6 text-cyan-400" />
                      Performance Analytics
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Métricas de desempenho e eficiência do processo de recrutamento
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="6meses">
                      <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600 text-white">
                        <SelectItem value="7dias">7 dias</SelectItem>
                        <SelectItem value="30dias">30 dias</SelectItem>
                        <SelectItem value="3meses">3 meses</SelectItem>
                        <SelectItem value="6meses">6 meses</SelectItem>
                        <SelectItem value="1ano">1 ano</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-700">
                      <Download className="h-4 w-4" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                    <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:bg-slate-600">Visão Geral</TabsTrigger>
                    <TabsTrigger value="candidates" className="text-slate-300 data-[state=active]:bg-slate-600">Candidatos</TabsTrigger>
                    <TabsTrigger value="efficiency" className="text-slate-300 data-[state=active]:bg-slate-600">Eficiência</TabsTrigger>
                    <TabsTrigger value="sources" className="text-slate-300 data-[state=active]:bg-slate-600">Fontes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6 mt-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dadosGraficoBarras}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                          <XAxis dataKey="mes" stroke="#cbd5e1" />
                          <YAxis stroke="#cbd5e1" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid #475569',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                          <Legend />
                          <Bar 
                            dataKey="vagas" 
                            name="Vagas Abertas" 
                            fill="#0ea5e9" 
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar 
                            dataKey="candidatos" 
                            name="Candidatos" 
                            fill="#8b5cf6" 
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar 
                            dataKey="contratacoes" 
                            name="Contratações" 
                            fill="#10b981" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="candidates" className="mt-4">
                    <div className="h-80 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dadosGraficoPizza}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {dadosGraficoPizza.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid #475569',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Lista de Vagas */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <CardTitle className="text-white">Vagas em Andamento</CardTitle>
                    <CardDescription className="text-slate-400">
                      {vagasFiltradas.length} vagas encontradas
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar vagas..."
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
                        <SelectItem value="ABERTA">Abertas</SelectItem>
                        <SelectItem value="PAUSADA">Pausadas</SelectItem>
                        <SelectItem value="FECHADA">Fechadas</SelectItem>
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
                        <TableHead className="w-[300px] text-slate-300">Vaga</TableHead>
                        <TableHead className="text-slate-300">Departamento</TableHead>
                        <TableHead className="text-slate-300">Candidatos</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-right text-slate-300">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vagasFiltradas.map((vaga) => {
                        const statusInfo = getStatusConfig(vaga.status);
                        const prioridadeInfo = getPrioridadeConfig(vaga.prioridade);
                        
                        return (
                          <TableRow key={vaga.id} className="border-slate-600 hover:bg-slate-700/50 transition-colors">
                            <TableCell className="font-medium">
                              <div className="space-y-1">
                                <p className="font-semibold text-white">{vaga.titulo}</p>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                                    {vaga.nivel}
                                  </Badge>
                                  <span>•</span>
                                  <span>{vaga.tipoContrato}</span>
                                  <span>•</span>
                                  <span>{vaga.localTrabalho}</span>
                                </div>
                                <p className="text-sm text-slate-400">
                                  {formatDate(vaga.dataAbertura)} - {formatDate(vaga.dataFim)}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="font-medium bg-slate-700 text-slate-300">
                                {vaga.departamento.nome}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-slate-400" />
                                <span className="font-semibold text-white">{vaga.candidatos}</span>
                                <span className="text-sm text-slate-400">candidatos</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-2">
                                <Badge className={`w-fit ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </Badge>
                                <Badge variant="outline" className={`w-fit text-xs ${prioridadeInfo.color}`}>
                                  {prioridadeInfo.label}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-600">
                                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver Detalhes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                                    <Users className="h-4 w-4 mr-2" />
                                    Ver Candidatos
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-slate-600" />
                                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar Vaga
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-orange-400 hover:bg-slate-700">
                                    <Send className="h-4 w-4 mr-2" />
                                    Reabrir Vaga
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  
                  {vagasFiltradas.length === 0 && (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Nenhuma vaga encontrada
                      </h3>
                      <p className="text-slate-400 mb-6">
                        {searchTerm || statusFilter !== 'TODOS' 
                          ? 'Tente ajustar os filtros de pesquisa'
                          : 'Comece criando sua primeira vaga'
                        }
                      </p>
                      <Button 
                        onClick={() => setModalVagaAberto(true)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeira Vaga
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Candidatos Recentes */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Candidatos Recentes</CardTitle>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">{candidatosRecentes.length}</Badge>
                </div>
                <CardDescription className="text-slate-400">Últimas 24 horas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidatosRecentes.map((candidato) => {
                  
                  return (
                    <div 
                      key={candidato.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors group"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                          {candidato.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate text-white">
                            {candidato.nome}
                          </p>
                          {/* <p className="text-xs text-slate-400 truncate">
                            {candidato.vaga.titulo}
                          </p> */}
                          {/* <Badge 
                            variant="outline" 
                            className={`text-xs mt-1 ${etapaInfo.color} border-slate-600`}
                          >
                            {etapaInfo.label}
                          </Badge>
                         */}</div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
                
                {/* {candidatosRecentes.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-slate-500 mb-3" />
                    <p className="text-slate-400 text-sm">Nenhum candidato recente</p>
                  </div>
                )} */}
                
                <Button variant="outline" className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-slate-300 hover:bg-slate-700" asChild>
                  <Link href="/recrutamento/candidatos">
                    Ver Todos os Candidatos
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Ações Rápidas</CardTitle>
                <CardDescription className="text-slate-400">Ferramentas essenciais</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start h-12 px-4 border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => setModalEntrevistaAberto(true)}
                >
                  <Calendar className="mr-3 h-5 w-5 text-cyan-400" />
                  <div className="text-left">
                    <p className="font-medium text-cyan-700">Agendar Entrevista</p>
                    <p className="text-xs text-slate-400">Marcar nova entrevista</p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start h-12 px-4 border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => setModalTesteAberto(true)}
                >
                  <FileText className="mr-3 h-5 w-5 text-green-400" />
                  <div className="text-left">
                    <p className="font-medium text-cyan-700">Teste Técnico</p>
                    <p className="text-xs text-slate-400">Enviar para candidato</p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start h-12 px-4 border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => setModalRelatorioAberto(true)}
                >
                  <Download className="mr-3 h-5 w-5 text-purple-400" />
                  <div className="text-left">
                    <p className="font-medium text-cyan-700">Gerar Relatório</p>
                    <p className="text-xs text-slate-400">Exportar dados</p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Estatísticas do Processo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Taxa de Conversão</span>
                  <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                    {metrics.taxaConversao}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Tempo Médio</span>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {metrics.tempoMedioContratacao} dias
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Candidatos/Vaga</span>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    {Math.round(metrics.totalCandidatos / metrics.vagasAtivas)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal Nova Vaga */}
        <Dialog open={modalRelatorioAberto} onOpenChange={setModalRelatorioAberto}>
          <DialogContent className="sm:max-w-[500px] bg-slate-800 border-slate-600">
            <DialogHeader>
              <DialogTitle className="text-white">Gerar Relatório</DialogTitle>
              <DialogDescription className="text-slate-400">
                Selecione o tipo de relatório desejado
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-slate-300">Tipo de Relatório</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => exportarRelatorio('candidatos')}
                  >
                    <Users className="h-6 w-6 mb-2 text-cyan-400" />
                    <span className="text-sm">Candidatos</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => exportarRelatorio('vagas')}
                  >
                    <Briefcase className="h-6 w-6 mb-2 text-green-400" />
                    <span className="text-sm">Vagas</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => exportarRelatorio('entrevistas')}
                  >
                    <Calendar className="h-6 w-6 mb-2 text-purple-400" />
                    <span className="text-sm">Entrevistas</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => exportarRelatorio('desempenho')}
                  >
                    <TrendingUp className="h-6 w-6 mb-2 text-orange-400" />
                    <span className="text-sm">Desempenho</span>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Relatório */}
        <Dialog open={modalRelatorioAberto} onOpenChange={setModalRelatorioAberto}>
          <DialogContent className="sm:max-w-[500px] bg-slate-800 border-slate-600">
            <DialogHeader>
              <DialogTitle className="text-white">Gerar Relatório</DialogTitle>
              <DialogDescription className="text-slate-400">
                Selecione o tipo de relatório desejado
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-slate-300">Tipo de Relatório</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => exportarRelatorio('candidatos')}
                  >
                    <Users className="h-6 w-6 mb-2 text-cyan-400" />
                    <span className="text-sm">Candidatos</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => exportarRelatorio('vagas')}
                  >
                    <Briefcase className="h-6 w-6 mb-2 text-green-400" />
                    <span className="text-sm">Vagas</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => exportarRelatorio('entrevistas')}
                  >
                    <Calendar className="h-6 w-6 mb-2 text-purple-400" />
                    <span className="text-sm">Entrevistas</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => exportarRelatorio('desempenho')}
                  >
                    <TrendingUp className="h-6 w-6 mb-2 text-orange-400" />
                    <span className="text-sm">Desempenho</span>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

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
    
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
      <div className="xl:col-span-3 space-y-8">
        <Skeleton className="h-80 rounded-lg bg-slate-700" />
        <Skeleton className="h-96 rounded-lg bg-slate-700" />
      </div>
      <div className="space-y-8">
        <Skeleton className="h-80 rounded-lg bg-slate-700" />
        <Skeleton className="h-64 rounded-lg bg-slate-700" />
      </div>
    </div>
  </div>
);

export default RecrutamentoDashboard;
