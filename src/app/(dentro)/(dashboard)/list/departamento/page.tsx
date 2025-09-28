'use client'

import React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import { 
  Users, DollarSign, Building, Plus, Search, Edit3, Trash2, 
  TrendingUp, Users2, FileText, Download, Filter, Mail, Phone,
  MapPin, Calendar, Target, BarChart3, Settings, UserCheck,
  Clock, Award, PieChart as PieChartIcon, Network, Shield,
  DownloadCloud, UploadCloud, Eye, MoreVertical, Star,
  MessageSquare, History, ClipboardList, Building2, X
} from "lucide-react"

// Types
interface Departamento {
  id: number
  nome: string
  descricao: string
  responsavel: string
  email: string
  telefone: string
  localizacao: string
  orcamento: number
  orcamento_utilizado: number
  funcionarios: number
  capacidade_maxima: number
  status: 'ativo' | 'inativo' | 'reestruturacao'
  data_criacao: string
  data_atualizacao: string
  cor: string
  metas: Meta[]
  kpis: KPI[]
  funcionariosList?: FuncionarioDepartamento[]
}

interface Meta {
  id: number
  titulo: string
  descricao: string
  tipo: 'orcamentaria' | 'pessoal' | 'performance' | 'estrategica'
  valor_alvo: number
  valor_atual: number
  data_limite: string
  progresso: number
  status: 'em_andamento' | 'concluida' | 'atrasada' | 'cancelada'
}

interface KPI {
  id: number
  nome: string
  valor: number
  variacao: number
  tendencia: 'alta' | 'baixa' | 'estavel'
  unidade: string
}

interface FuncionarioDepartamento {
  id: number
  nome: string
  cargo: string
  email: string
  data_admissao: string
  status: 'ativo' | 'ferias' | 'licenca' | 'desligado'
  performance: number
  departamento_id: number
}

interface DashboardStats {
  totalDepartamentos: number
  departamentosAtivos: number
  totalFuncionarios: number
  orcamentoTotal: number
  orcamentoUtilizado: number
  taxaOcupacao: number
  departamentosComMeta: number
  proximasRenovacoes: number
}

// Constants
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
const STATUS_CONFIG = {
  ativo: { label: 'Ativo', color: 'bg-green-100 text-green-800 border-green-200' },
  inativo: { label: 'Inativo', color: 'bg-red-100 text-red-800 border-red-200' },
  reestruturacao: { label: 'Reestruturação', color: 'bg-amber-100 text-amber-800 border-amber-200' }
}

// Mock Data
const mockDepartamentos: Departamento[] = [
  {
    id: 1,
    nome: 'Recursos Humanos',
    descricao: 'Gestão de talentos e desenvolvimento organizacional',
    responsavel: 'Maria Silva',
    email: 'rh@empresa.com',
    telefone: '+244 923 456 789',
    localizacao: 'Edifício A - 3º Andar',
    orcamento: 5000000,
    orcamento_utilizado: 3200000,
    funcionarios: 15,
    capacidade_maxima: 20,
    status: 'ativo',
    data_criacao: '2023-01-15',
    data_atualizacao: '2024-01-20',
    cor: '#3B82F6',
    metas: [
      {
        id: 1,
        titulo: 'Reduzir turnover em 15%',
        descricao: 'Implementar programas de retenção',
        tipo: 'performance',
        valor_alvo: 15,
        valor_atual: 8,
        data_limite: '2024-06-30',
        progresso: 53,
        status: 'em_andamento'
      }
    ],
    kpis: [
      { id: 1, nome: 'Satisfação Funcional', valor: 85, variacao: 5, tendencia: 'alta', unidade: '%' },
      { id: 2, nome: 'Taxa de Turnover', valor: 12, variacao: -2, tendencia: 'baixa', unidade: '%' }
    ]
  },
  {
    id: 2,
    nome: 'Tecnologia da Informação',
    descricao: 'Desenvolvimento e manutenção de sistemas',
    responsavel: 'João Santos',
    email: 'ti@empresa.com',
    telefone: '+244 923 789 456',
    localizacao: 'Edifício B - 2º Andar',
    orcamento: 8000000,
    orcamento_utilizado: 6400000,
    funcionarios: 25,
    capacidade_maxima: 30,
    status: 'ativo',
    data_criacao: '2022-03-10',
    data_atualizacao: '2024-01-15',
    cor: '#10B981',
    metas: [
      {
        id: 2,
        titulo: 'Automatizar 80% dos processos',
        descricao: 'Implementar soluções de automação',
        tipo: 'estrategica',
        valor_alvo: 80,
        valor_atual: 65,
        data_limite: '2024-09-30',
        progresso: 81,
        status: 'em_andamento'
      }
    ],
    kpis: [
      { id: 3, nome: 'Uptime Sistema', valor: 99.8, variacao: 0.2, tendencia: 'alta', unidade: '%' },
      { id: 4, nome: 'Projetos Entregues', valor: 18, variacao: 3, tendencia: 'alta', unidade: 'un' }
    ]
  },
  {
    id: 3,
    nome: 'Financeiro',
    descricao: 'Gestão financeira e controle orçamental',
    responsavel: 'Ana Costa',
    email: 'financeiro@empresa.com',
    telefone: '+244 923 321 654',
    localizacao: 'Edifício A - 1º Andar',
    orcamento: 3000000,
    orcamento_utilizado: 2100000,
    funcionarios: 12,
    capacidade_maxima: 15,
    status: 'ativo',
    data_criacao: '2022-01-05',
    data_atualizacao: '2024-01-22',
    cor: '#F59E0B',
    metas: [],
    kpis: [
      { id: 5, nome: 'Margem de Lucro', valor: 22, variacao: 1.5, tendencia: 'alta', unidade: '%' },
      { id: 6, nome: 'Prazo Médio Cobrança', valor: 35, variacao: -5, tendencia: 'baixa', unidade: 'dias' }
    ]
  }
]

const mockFuncionarios: FuncionarioDepartamento[] = [
  { id: 1, nome: 'Pedro Oliveira', cargo: 'Analista RH', email: 'pedro@empresa.com', data_admissao: '2023-03-15', status: 'ativo', performance: 88, departamento_id: 1 },
  { id: 2, nome: 'Carla Mendes', cargo: 'Desenvolvedora Senior', email: 'carla@empresa.com', data_admissao: '2022-05-20', status: 'ativo', performance: 92, departamento_id: 2 },
  { id: 3, nome: 'Rafael Torres', cargo: 'Contador', email: 'rafael@empresa.com', data_admissao: '2023-01-10', status: 'ativo', performance: 85, departamento_id: 3 }
]

// Utility Functions
const calcularEstatisticas = (departamentos: Departamento[]): DashboardStats => {
  const totalDepartamentos = departamentos.length
  const departamentosAtivos = departamentos.filter(d => d.status === 'ativo').length
  const totalFuncionarios = departamentos.reduce((acc, d) => acc + d.funcionarios, 0)
  const orcamentoTotal = departamentos.reduce((acc, d) => acc + d.orcamento, 0)
  const orcamentoUtilizado = departamentos.reduce((acc, d) => acc + d.orcamento_utilizado, 0)
  const capacidadeTotal = departamentos.reduce((acc, d) => acc + d.capacidade_maxima, 0)
  const taxaOcupacao = capacidadeTotal > 0 ? (totalFuncionarios / capacidadeTotal) * 100 : 0
  const departamentosComMeta = departamentos.filter(d => d.metas.length > 0).length

  return {
    totalDepartamentos,
    departamentosAtivos,
    totalFuncionarios,
    orcamentoTotal,
    orcamentoUtilizado,
    taxaOcupacao,
    departamentosComMeta,
    proximasRenovacoes: 3
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0
  }).format(value)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-AO').format(value)
}

// Components
type ButtonVariant = 'default' | 'outline';
type ButtonSize = 'default' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const Button = ({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}: ButtonProps) => {
  const baseClass = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variants: Record<ButtonVariant, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground border-gray-300 hover:bg-gray-50"
  };
  const sizes: Record<ButtonSize, string> = {
    default: "h-10 py-2 px-4",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = '', ...props }: any) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${className}`}
    {...props}
  />
)

const Badge = ({ children, className = '' }: any) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </span>
)

const Card = ({ children, className = '' }: any) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-gray-200 ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = '' }: any) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '' }: any) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
)

const CardDescription = ({ children, className = '' }: any) => (
  <p className={`text-sm text-muted-foreground text-gray-600 ${className}`}>
    {children}
  </p>
)

const CardContent = ({ children, className = '' }: any) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
)

const Table = ({ children, className = '' }: any) => (
  <div className="w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className}`}>
      {children}
    </table>
  </div>
)

const TableHeader = ({ children }: any) => (
  <thead className="[&_tr]:border-b">
    {children}
  </thead>
)

const TableBody = ({ children }: any) => (
  <tbody className="[&_tr:last-child]:border-0">
    {children}
  </tbody>
)

const TableHead = ({ children, className = '' }: any) => (
  <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-gray-600 ${className}`}>
    {children}
  </th>
)

const TableRow = ({ children, className = '', onClick }: any) => (
  <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted hover:bg-gray-50 ${className}`} onClick={onClick}>
    {children}
  </tr>
)

const TableCell = ({ children, className = '' }: any) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>
    {children}
  </td>
)

const Progress = ({ value, className = '' }: any) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-secondary bg-gray-200 ${className}`}>
    <div 
      className="h-full w-full flex-1 bg-primary transition-all bg-blue-600" 
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
)

const Tabs = ({ children, value, onValueChange }: any) => (
  <div data-state={value}>
    {children}
  </div>
)

const TabsList = ({ children, className = '' }: any) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground bg-gray-100 ${className}`}>
    {children}
  </div>
)

const TabsTrigger = ({ children, value, className = '' }: any) => {
  const [activeTab, setActiveTab] = useState('overview')
  
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${activeTab === value ? 'bg-white shadow' : 'hover:bg-gray-200'} ${className}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ children, value, className = '' }: any) => {
  const [activeTab] = useState('overview')
  
  if (activeTab !== value) return null
  
  return (
    <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}>
      {children}
    </div>
  )
}

const DropdownMenu = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative inline-block text-left" onBlur={() => setTimeout(() => setIsOpen(false), 100)}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  )
}

const DropdownMenuTrigger = ({ children, asChild, isOpen, setIsOpen }: any) => (
  <div onClick={() => setIsOpen(!isOpen)}>
    {children}
  </div>
)

const DropdownMenuContent = ({ children, align = 'right', isOpen }: any) => {
  if (!isOpen) return null
  
  const alignClass = align === 'right' ? 'right-0' : 'left-0'
  
  return (
    <div className={`absolute ${alignClass} mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}>
      <div className="py-1">
        {children}
      </div>
    </div>
  )
}

const DropdownMenuItem = ({ children, onClick, className = '' }: any) => (
  <button
    className={`group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
)

const DropdownMenuLabel = ({ children }: any) => (
  <div className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50">
    {children}
  </div>
)

const DropdownMenuSeparator = () => (
  <div className="h-px bg-gray-200 my-1" />
)

type MetricCardColor = 'blue' | 'green' | 'yellow' | 'red';

const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: string;
  color: MetricCardColor;
}) => {
  const colorClasses: Record<MetricCardColor, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(value)}</p>
            {trend && (
              <p className="text-sm text-gray-500 mt-1">{trend}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatusBadge = ({ status }: { status: keyof typeof STATUS_CONFIG }) => {
  const config = STATUS_CONFIG[status]
  return (
    <Badge className={config.color}>
      {config.label}
    </Badge>
  )
}

const DashboardStats = ({ stats }: { stats: DashboardStats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <MetricCard 
      title="Total Departamentos" 
      value={stats.totalDepartamentos} 
      icon={Building}
      trend="+2 este mês"
      color="blue"
    />
    <MetricCard 
      title="Departamentos Ativos" 
      value={stats.departamentosAtivos} 
      icon={UserCheck}
      trend="98% disponibilidade"
      color="green"
    />
    <MetricCard 
      title="Total Funcionários" 
      value={stats.totalFuncionarios} 
      icon={Users}
      trend={`${stats.taxaOcupacao.toFixed(1)}% ocupação`}
      color="yellow"
    />
    <MetricCard 
      title="Orçamento Utilizado" 
      value={stats.orcamentoUtilizado} 
      icon={DollarSign}
      trend={`${((stats.orcamentoUtilizado / stats.orcamentoTotal) * 100).toFixed(1)}% do total`}
      color="red"
    />
  </div>
)

const ExportMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="gap-2">
        <Download className="w-4 h-4" />
        Exportar
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>
        <FileText className="w-4 h-4 mr-2" />
        Relatório Completo
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Users className="w-4 h-4 mr-2" />
        Estrutura Organizacional
      </DropdownMenuItem>
      <DropdownMenuItem>
        <DollarSign className="w-4 h-4 mr-2" />
        Análise Orçamental
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

// Tab Components
const OverviewTab = ({ departamentos, chartData, kpiData }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Distribuição de Funcionários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="funcionarios" name="Atual" fill="#3B82F6" />
                <Bar dataKey="capacidade" name="Capacidade" fill="#94A3B8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-green-600" />
            Utilização de Orçamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="utilizado"
                  nameKey="name"
                  label
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${formatNumber(Number(value))} mil AOA`, 'Utilizado']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>KPIs dos Departamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.slice(0, 8).map((kpi: any, index: number) => (
            <div key={index} className="bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-slate-700">{kpi.kpi}</span>
                <Badge className={kpi.tendencia === 'alta' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {kpi.tendencia}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {kpi.valor}{kpi.unidade}
              </div>
              <div className="text-xs text-slate-500 mt-1">{kpi.departamento}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

const DepartmentsTab = ({ departamentos, onEdit, onDelete, onSelect }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Lista de Departamentos</CardTitle>
      <CardDescription>
        {departamentos.length} departamentos encontrados
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Departamento</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead className="text-right">Funcionários</TableHead>
            <TableHead className="text-right">Orçamento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departamentos.map((dept: Departamento) => (
            <TableRow key={dept.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => onSelect(dept)}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: dept.cor }}
                  >
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">{dept.nome}</div>
                    <div className="text-sm text-slate-500">{dept.descricao}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{dept.responsavel}</div>
                  <div className="text-sm text-slate-500">{dept.email}</div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium">{dept.funcionarios}/{dept.capacidade_maxima}</span>
                  <Progress value={(dept.funcionarios / dept.capacidade_maxima) * 100} className="w-20 mt-1" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div>
                  <div className="font-medium">{formatCurrency(dept.orcamento_utilizado)}</div>
                  <div className="text-sm text-slate-500">de {formatCurrency(dept.orcamento)}</div>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={dept.status} />
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onSelect(dept)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(dept)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(dept.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)

