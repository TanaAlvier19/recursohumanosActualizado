'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Swal from "sweetalert2"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { 
  DollarSign, Users, Banknote, Calendar, CheckCircle, AlertCircle, FileText, 
  Clock, Download, Send, Plus, X, Edit, Trash2, Eye, Search, Filter,
  Building, Mail, Phone, MapPin, UserCheck, TrendingUp
} from "lucide-react"
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

// Tipos de dados expandidos
type Pagamento = {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  salario_bruto: number;
  salario_liquido: number;
  mes_referencia: string;
  status: 'pago' | 'pendente' | 'atrasado';
  data_pagamento?: string;
  beneficios: number;
  descontos: number;
  horas_extras: number;
  inadimplencia: number;
};

type Funcionario = {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  data_admissao: string;
  salario_base: number;
  status: 'ativo' | 'afastado' | 'ferias' | 'desligado';
};

type Departamento = {
  id: string;
  nome: string;
  orcamento: number;
  funcionarios_count: number;
  custo_total: number;
};

type Beneficio = {
  id: string;
  nome: string;
  tipo: 'saude' | 'alimentacao' | 'transporte' | 'educacao' | 'outros';
  valor: number;
  ativo: boolean;
};

const FolhaPagamento = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  // Estados principais
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de resumo expandidos
  const [resumo, setResumo] = useState({
    total_folha: 0,
    funcionarios: 0,
    funcionarios_ativos: 0,
    media_salarial: 0,
    proximo_pagamento: '',
    total_beneficios: 0,
    total_descontos: 0,
    folha_pendente: 0
  });

  const [historico, setHistorico] = useState<any[]>([]);
  const [relatorioMensal, setRelatorioMensal] = useState({
    funcionarios_pagos: 0,
    impostos_pagos: 0,
    total_beneficios: 0,
    total_horas_extras: 0
  });

  // Estados para modais e filtros
  const [mesReferencia, setMesReferencia] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [departamentoFilter, setDepartamentoFilter] = useState('todos');
  const [modalNovoFuncionario, setModalNovoFuncionario] = useState(false);
  const [modalAjusteSalarial, setModalAjusteSalarial] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario | null>(null);

  // Estados para formulários
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: '',
    email: '',
    cargo: '',
    departamento: '',
    salario_base: 0,
    data_admissao: ''
  });

  const [ajusteSalarial, setAjusteSalarial] = useState({
    funcionario_id: '',
    novo_salario: 0,
    motivo: '',
    data_efetivacao: ''
  });

  // Buscar dados da API
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Pagamentos
      const pagamentosRes = await fetch("http://localhost:8000/pagamentos/", { credentials: "include" });
      const pagamentosData = await pagamentosRes.json();
      setPagamentos(Array.isArray(pagamentosData) ? pagamentosData : []);
      
      // Funcionários
      const funcionariosRes = await fetch("http://localhost:8000/funcionarios/", { credentials: "include" });
      const funcionariosData = await funcionariosRes.json();
      setFuncionarios(Array.isArray(funcionariosData) ? funcionariosData : []);
      
      // Departamentos
      const departamentosRes = await fetch("http://localhost:8000/departamentos/", { credentials: "include" });
      const departamentosData = await departamentosRes.json();
      setDepartamentos(Array.isArray(departamentosData) ? departamentosData : []);
      
      // Benefícios
      const beneficiosRes = await fetch("http://localhost:8000/beneficios/", { credentials: "include" });
      const beneficiosData = await beneficiosRes.json();
      setBeneficios(Array.isArray(beneficiosData) ? beneficiosData : []);
      
      // Resumo expandido
      const resumoRes = await fetch("http://localhost:8000/resumo-folha-completo/", { credentials: "include" });
      const resumoData = await resumoRes.json();
      setResumo(resumoData);
      
      // Histórico
      const historicoRes = await fetch("http://localhost:8000/historico-folha/", { credentials: "include" });
      const historicoData = await historicoRes.json();
      setHistorico(historicoData);
      
      // Relatório Mensal expandido
      const relatorioRes = await fetch("http://localhost:8000/relatorio-mensal-completo/", { 
        credentials: "include" 
      });
      const relatorioData = await relatorioRes.json();
      setRelatorioMensal(relatorioData);
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do sistema",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtros
  const pagamentosFiltrados = pagamentos.filter(pagamento => {
    const matchesSearch = pagamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pagamento.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || pagamento.status === statusFilter;
    const matchesDepartamento = departamentoFilter === 'todos' || pagamento.departamento === departamentoFilter;
    
    return matchesSearch && matchesStatus && matchesDepartamento;
  });

  const funcionariosAtivos = funcionarios.filter(f => f.status === 'ativo');

  // Processamento automático da folha de pagamento
  const processarFolha = async () => {
    if (!mesReferencia) {
      Swal.fire("Atenção", "Por favor, selecione um mês de referência.", "warning");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/folha-pagamento/processar/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mes_referencia: `${mesReferencia}-01`,
          incluir_beneficios: true,
          calcular_impostos: true
        }),
      });

      if (res.ok) {
        Swal.fire({
          title: "Sucesso!",
          text: "Folha de pagamento processada com sucesso.",
          icon: "success",
          confirmButtonColor: "#4f46e5",
        });
        fetchData();
      } else {
        const error = await res.json();
        throw new Error(error.detail || "Erro ao processar a folha de pagamento.");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Erro!",
        text: error.message || "Falha no processamento.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // Aprovação da folha de pagamento
  const aprovarFolha = async () => {
    if (!mesReferencia) {
      Swal.fire("Atenção", "Por favor, selecione um mês de referência para aprovação.", "warning");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/folha-pagamento/aprovar/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mes_referencia: `${mesReferencia}`,
          aprovador: "user@empresa.com" // Em um sistema real, pegar do contexto de autenticação
        }),
      });

      if (res.ok) {
        Swal.fire({
          title: "Aprovado!",
          text: "Folha de pagamento aprovada e pronta para pagamento.",
          icon: "success",
          confirmButtonColor: "#4f46e5",
        });
        fetchData();
      } else {
        const error = await res.json();
        throw new Error(error.detail || "Erro ao aprovar a folha de pagamento.");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Erro!",
        text: error.message || "Falha na aprovação.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // Adicionar novo funcionário
  const adicionarFuncionario = async () => {
    try {
      const res = await fetch("http://localhost:8000/funcionarios/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoFuncionario),
      });

      if (res.ok) {
        toast({
          title: "Sucesso",
          description: "Funcionário adicionado com sucesso",
        });
        setModalNovoFuncionario(false);
        setNovoFuncionario({
          nome: '',
          email: '',
          cargo: '',
          departamento: '',
          salario_base: 0,
          data_admissao: ''
        });
        fetchData();
      } else {
        throw new Error("Erro ao adicionar funcionário");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar funcionário",
        variant: "destructive"
      });
    }
  };

  // Ajuste salarial
  const aplicarAjusteSalarial = async () => {
    try {
      const res = await fetch("http://localhost:8000/ajustes-salariais/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ajusteSalarial),
      });

      if (res.ok) {
        toast({
          title: "Sucesso",
          description: "Ajuste salarial aplicado com sucesso",
        });
        setModalAjusteSalarial(false);
        setAjusteSalarial({
          funcionario_id: '',
          novo_salario: 0,
          motivo: '',
          data_efetivacao: ''
        });
        fetchData();
      } else {
        throw new Error("Erro ao aplicar ajuste salarial");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao aplicar ajuste salarial",
        variant: "destructive"
      });
    }
  };

  // Dados para gráficos
  const chartData = historico.map(item => ({
    mes: item.mes.split('-')[1] + '/' + item.mes.split('-')[0].slice(2),
    folha: item.folha,
    impostos: item.impostos,
    beneficios: item.beneficios || 0
  }));

  const dataDistribuicaoDepartamentos = departamentos.map(depto => ({
    name: depto.nome,
    value: depto.custo_total
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Função para gerar o PDF expandido
  const gerarPDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const margin = 20;
    let yPos = margin + 20;

    // Título do relatório
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório Completo de Folha de Pagamento', margin, yPos);
    yPos += 40;

    // Data de emissão
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Emitido em: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPos);
    yPos += 30;

    // Seção de resumo expandido
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Financeiro Detalhado', margin, yPos);
    yPos += 30;

    autoTable(doc, {
      startY: yPos,
      head: [['Total Folha', 'Funcionários', 'Média Salarial', 'Próximo Pagamento', 'Total Benefícios']],
      body: [
        [
          `R$ ${resumo.total_folha.toLocaleString('pt-BR')}`, 
          `${resumo.funcionarios_ativos}/${resumo.funcionarios}`,
          `R$ ${resumo.media_salarial.toLocaleString('pt-BR')}`,
          resumo.proximo_pagamento,
          `R$ ${resumo.total_beneficios.toLocaleString('pt-BR')}`
        ]
      ],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 5, halign: 'center' },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
    });
    yPos = (doc as any).lastAutoTable.finalY + 20;

    // Seção de distribuição por departamento
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Distribuição por Departamento', margin, yPos);
    yPos += 30;

    const departamentosData = departamentos.map(d => [
      d.nome,
      d.funcionarios_count.toString(),
      `R$ ${d.custo_total.toLocaleString('pt-BR')}`,
      `R$ ${Math.round(d.custo_total / d.funcionarios_count).toLocaleString('pt-BR')}`
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Departamento', 'Funcionários', 'Custo Total', 'Custo Médio']],
      body: departamentosData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
    });
    yPos = (doc as any).lastAutoTable.finalY + 20;

    // ... (continuar com outras seções do PDF)

    doc.save('relatorio-folha-pagamento-completo.pdf');
  };

  if (loading) {
    return (
      <div className="bg-gray-50 p-6 space-y-8">
        {/* Loading skeleton */}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Folha de Pagamento
          </h1>
          <p className="text-gray-600 mt-2">Gestão completa de remunerações e benefícios</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={gerarPDF}>
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={() => setModalNovoFuncionario(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Funcionário
          </Button>
        </div>
      </div>

      {/* Cartões de Métricas Expandidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Folha</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {resumo.total_folha.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">
              {resumo.folha_pendente > 0 ? `R$ ${resumo.folha_pendente.toLocaleString('pt-BR')} pendente` : 'Todos pagamentos em dia'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumo.funcionarios_ativos}/{resumo.funcionarios}</div>
            <p className="text-xs text-muted-foreground">{funcionariosAtivos.length} ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Média Salarial</CardTitle>
            <Banknote className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {resumo.media_salarial.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">Base: {funcionariosAtivos.length} funcionários</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Benefícios</CardTitle>
            <UserCheck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {resumo.total_beneficios.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">{beneficios.filter(b => b.ativo).length} benefícios ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolução da Folha de Pagamento</CardTitle>
              <CardDescription>Últimos 12 meses</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Valor']}
                  />
                  <Legend />
                  <Bar dataKey="folha" name="Folha (R$)" fill="#8884d8" />
                  <Bar dataKey="impostos" name="Impostos (R$)" fill="#82ca9d" />
                  <Bar dataKey="beneficios" name="Benefícios (R$)" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pagamentos do Mês</CardTitle>
                <CardDescription>Detalhamento completo dos pagamentos</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    className="pl-8 w-48"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="atrasado">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={departamentoFilter} onValueChange={setDepartamentoFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {departamentos.map(depto => (
                      <SelectItem key={depto.id} value={depto.nome}>
                        {depto.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Bruto</TableHead>
                    <TableHead>Líquido</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentosFiltrados.map((pagamento) => (
                    <TableRow key={pagamento.id}>
                      <TableCell className="font-medium">{pagamento.nome}</TableCell>
                      <TableCell>{pagamento.cargo}</TableCell>
                      <TableCell>{pagamento.departamento}</TableCell>
                      <TableCell>R$ {pagamento.salario_bruto.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>R$ {pagamento.salario_liquido.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge variant={
                          pagamento.status === 'pago' ? 'default' :
                          pagamento.status === 'pendente' ? 'secondary' : 'destructive'
                        }>
                          {pagamento.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar de Ações e Estatísticas */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Folha</CardTitle>
              <CardDescription>Ações automatizadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mês de Referência</Label>
                <Input
                  type="month"
                  value={mesReferencia}
                  onChange={(e) => setMesReferencia(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={processarFolha}
                disabled={!mesReferencia}
              >
                <Plus className="mr-2 h-4 w-4" />
                Processar Folha
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={aprovarFolha}
                disabled={!mesReferencia}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprovar Pagamentos
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setModalAjusteSalarial(true)}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Ajuste Salarial
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataDistribuicaoDepartamentos}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dataDistribuicaoDepartamentos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Custo']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Folha do Mês</span>
                <Badge variant={mesReferencia ? "default" : "destructive"}>
                  {mesReferencia ? "Processada" : "Pendente"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Aprovação</span>
                <Badge variant="secondary">Pendente</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Próximo Pagamento</span>
                <Badge variant="default">{resumo.proximo_pagamento}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Novo Funcionário */}
      <Dialog open={modalNovoFuncionario} onOpenChange={setModalNovoFuncionario}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo colaborador
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={novoFuncionario.nome}
                  onChange={(e) => setNovoFuncionario({...novoFuncionario, nome: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={novoFuncionario.email}
                  onChange={(e) => setNovoFuncionario({...novoFuncionario, email: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  value={novoFuncionario.cargo}
                  onChange={(e) => setNovoFuncionario({...novoFuncionario, cargo: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento</Label>
                <Select
                  value={novoFuncionario.departamento}
                  onValueChange={(value) => setNovoFuncionario({...novoFuncionario, departamento: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map(depto => (
                      <SelectItem key={depto.id} value={depto.nome}>
                        {depto.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salario">Salário Base</Label>
                <Input
                  id="salario"
                  type="number"
                  value={novoFuncionario.salario_base}
                  onChange={(e) => setNovoFuncionario({...novoFuncionario, salario_base: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_admissao">Data de Admissão</Label>
                <Input
                  id="data_admissao"
                  type="date"
                  value={novoFuncionario.data_admissao}
                  onChange={(e) => setNovoFuncionario({...novoFuncionario, data_admissao: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalNovoFuncionario(false)}>
              Cancelar
            </Button>
            <Button onClick={adicionarFuncionario}>
              Adicionar Funcionário
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Ajuste Salarial */}
      <Dialog open={modalAjusteSalarial} onOpenChange={setModalAjusteSalarial}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajuste Salarial</DialogTitle>
            <DialogDescription>
              Ajuste de remuneração para funcionário
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="funcionario">Funcionário</Label>
              <Select
                value={ajusteSalarial.funcionario_id}
                onValueChange={(value) => setAjusteSalarial({...ajusteSalarial, funcionario_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {funcionariosAtivos.map(func => (
                    <SelectItem key={func.id} value={func.id}>
                      {func.nome} - {func.cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="novo_salario">Novo Salário</Label>
              <Input
                id="novo_salario"
                type="number"
                value={ajusteSalarial.novo_salario}
                onChange={(e) => setAjusteSalarial({...ajusteSalarial, novo_salario: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo do Ajuste</Label>
              <Textarea
                id="motivo"
                value={ajusteSalarial.motivo}
                onChange={(e) => setAjusteSalarial({...ajusteSalarial, motivo: e.target.value})}
                placeholder="Descreva o motivo do ajuste salarial..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_efetivacao">Data de Efetivação</Label>
              <Input
                id="data_efetivacao"
                type="date"
                value={ajusteSalarial.data_efetivacao}
                onChange={(e) => setAjusteSalarial({...ajusteSalarial, data_efetivacao: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalAjusteSalarial(false)}>
              Cancelar
            </Button>
            <Button onClick={aplicarAjusteSalarial}>
              Aplicar Ajuste
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FolhaPagamento;