'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import Swal from "sweetalert2"
import { MetricCard } from "@/components/metrcCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  MoreVertical
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';

type Vaga = {
  id: string;
  titulo: string;
  departamento: { id: string; nome: string; };
  candidatos: number;
  status: 'aberta' | 'pausada' | 'fechada';
  dataAbertura: string;
  dataFim: string;
  prioridade: 'alta' | 'media' | 'baixa';
};

type Candidato = {
  id: string;
  nome: string;
  email: string;
  vaga: { id: string; titulo: string; };
  etapa: 'triagem' | 'entrevista' | 'teste' | 'contratado' | 'rejeitado';
  dataInscricao: string;
  score: number;
};

type Departamento = {
  id: string;
  nome: string;
};

type Vagamensal = {
  mes: string,
  vagas: number,
  contratacoes: number
}

type Entrevista = {
  id?: string;
  candidato: string;
  vaga: string;
  dataHora: string;
  local: string;
  descricao: string;
}

type TesteTecnico = {
  candidato: string;
  vaga: string;
  link: string;
  dataLimite: string;
}

const RecrutamentoDashboard = () => {
  const router = useRouter();
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState<string>('')
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [vagamensal, setVagamensal] = useState<Vagamensal[]>([]);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [vagasAbertas, setVagasAbertas] = useState(0)
  const [tipoVaga, setTipoVaga] = useState('')
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState('')
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [requisitos, setRequisitos] = useState('')
  const [fimDavaga, setFimDavaga] = useState('')
  const [abrir, setAbrir] = useState(false)
  const [candidatoTotal, setCandidatoTotal] = useState(0)
  const [candidatura, setCandidatura] = useState<Candidato[]>([])
  const [candidatoRecentes, setCandidatoRecentes] = useState<Candidato[]>([])
  const [empresaNome, setEmpresaNome] = useState('')
  const [hoje, setHoje] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  
  const [agendarOpen, setAgendarOpen] = useState(false);
  const [testeOpen, setTesteOpen] = useState(false);
  const [relatorioOpen, setRelatorioOpen] = useState(false);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState('');
  const [vagaSelecionada, setVagaSelecionada] = useState('');
  const [entrevista, setEntrevista] = useState<Entrevista>({
    candidato: '',
    vaga: '',
    dataHora: '',
    local: '',
    descricao: ''
  });
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([]);
  const [testeTecnico, setTesteTecnico] = useState<TesteTecnico>({
    candidato: '',
    vaga: '',
    link: '',
    dataLimite: ''
  });
  const [tipoRelatorio, setTipoRelatorio] = useState('candidatos');
  const [periodoRelatorio, setPeriodoRelatorio] = useState('7dias');

  // Filtrar vagas
  const vagasFiltradas = vagas.filter(vaga => {
    const matchesSearch = vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vaga.departamento.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || vaga.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        setCandidatoTotal(vagasData.candidato);
        setVagas(vagasData.destaque);
        setCandidatoRecentes(vagasData.ultimaHoras);
        setEmpresaNome(vagasData.empresa.nome);
      }

      if (departamentosRes.ok) {
        setDepartamentos(departamentosData.dados);
      }

      if (candidatosRes.ok) {
        setCandidatura(candidatosData.dados);
        setCandidatos(candidatosData.dados);
        setHoje(candidatosData.candidatoshoje.length);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const buscarEntrevistas = async () => {
    try {
      const res = await fetch("http://localhost:8000/entrevistas/proximas/", {
        credentials: "include"
      });
      
      if (res.ok) {
        const data = await res.json();
        setEntrevistas(data);
      } else {
        console.error("Erro ao buscar entrevistas");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    buscarEntrevistas();
    
    const interval = setInterval(buscarEntrevistas, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatarDataEntrevista = (dataHora: string) => {
    const data = new Date(dataHora);
    
    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    
    let prefixo = '';
    if (data.toDateString() === hoje.toDateString()) {
      prefixo = 'Hoje, ';
    } else if (data.toDateString() === amanha.toDateString()) {
      prefixo = 'Amanhã, ';
    }
    
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    
    return `${prefixo}${horas}:${minutos}`;
  };

  const criarVaga = async () => {
    try {
      const hoje = new Date();
      const fimDate = new Date(fimDavaga);
      
      if (hoje > fimDate) {
        return Swal.fire("Atenção", "A data do Fim da Vaga não pode ser antes do dia atual", "warning");
      }

      const dados = {
        titulo: titulo,
        dataFim: fimDavaga,
        dataAbertura: hoje.toISOString().split("T")[0],
        departamento: departamentoSelecionado,
        tipoVaga: tipoVaga,
        requisitos
      };

      const res = await fetch("http://localhost:8000/vaga/", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(dados),
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        Swal.fire("Nova Vaga", `Vaga Adicionada Para ${titulo}`, "success");
        setAbrir(false);
        setTitulo('');
        setFimDavaga('');
        setTipoVaga('');
        setRequisitos('');
        setDepartamentoSelecionado('');
        fetchDashboardData();
      } else {
        const errorData = await res.json();
        Swal.fire("Erro", errorData.error || "Falha ao criar vaga", "error");
      }
    } catch (error) {
      console.error("Erro:", error);
      Swal.fire("Erro", "Ocorreu um erro inesperado", "error");
    }
  };

  const agendarEntrevista = async () => {
    try {
      const res = await fetch("http://localhost:8000/entrevistas/", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(entrevista),
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        Swal.fire("Sucesso", "Entrevista agendada com sucesso", "success");
        setAgendarOpen(false);
        setEntrevista({
          candidato: '',
          vaga: '',
          dataHora: '',
          local: '',
          descricao: ''
        });
        buscarEntrevistas();
      } else {
        const errorData = await res.json();
        Swal.fire("Erro", errorData.error || "Falha ao agendar entrevista", "error");
      }
    } catch (error) {
      console.error("Erro:", error);
      Swal.fire("Erro", "Ocorreu um erro inesperado", "error");
    }
  };

  const enviarTesteTecnico = async () => {
    try {
      const res = await fetch("http://localhost:8000/testes-tecnicos/", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(testeTecnico),
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        Swal.fire("Sucesso", "Teste técnico enviado com sucesso", "success");
        setTesteOpen(false);
        setTesteTecnico({
          candidato: '',
          vaga: '',
          link: '',
          dataLimite: ''
        });
      } else {
        const errorData = await res.json();
        Swal.fire("Erro", errorData.error || "Falha ao enviar teste técnico", "error");
      }
    } catch (error) {
      console.error("Erro:", error);
      Swal.fire("Erro", "Ocorreu um erro inesperado", "error");
    }
  };

  const gerarRelatorio = async () => {
    try {
      const url = `http://localhost:8000/relatorios/?tipo=${tipoRelatorio}&periodo=${periodoRelatorio}`;
      
      window.open(url, '_blank');
      
      Swal.fire("Sucesso", "Relatório gerado com sucesso", "success");
      setRelatorioOpen(false);
    } catch (error) {
      console.error("Erro:", error);
      Swal.fire("Erro", "Falha ao gerar relatório", "error");
    }
  };

  const chartData = vagamensal.map((item) => {
    const data = new Date(item.mes);
    const nomeMes = data.toLocaleDateString("pt-BR", { month: "short" });
    return {
      name: nomeMes,
      vagas: item.vagas,
      contratacoes: item.contratacoes
    }
  });

  const etapasCandidato = [
    { etapa: 'triagem', label: 'Triagem', cor: 'bg-yellow-100 text-yellow-800' },
    { etapa: 'entrevista', label: 'Entrevista', cor: 'bg-blue-100 text-blue-800' },
    { etapa: 'teste', label: 'Teste', cor: 'bg-purple-100 text-purple-800' },
    { etapa: 'contratado', label: 'Contratado', cor: 'bg-green-100 text-green-800' },
    { etapa: 'rejeitado', label: 'Rejeitado', cor: 'bg-red-100 text-red-800' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-extrabold text-purple-600 text-3xl">Recrutamento e Seleção</h1>
          <p className="text-gray-600 mt-1">Gerencie vagas, candidatos e processos seletivos</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <a href={`http://localhost:3000/empresa/${empresaNome}/`}>
            <Button variant="outline" className="w-full sm:w-auto">
              <Mail className="mr-2 h-4 w-4" />
              Página de Candidatura
            </Button>
          </a>
          <Button onClick={() => setAbrir(true)} className='bg-purple-600 hover:bg-purple-700 w-full sm:w-auto'>
            <UserPlus className="mr-2 h-4 w-4" />
            Nova Vaga
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Vagas Abertas" 
          value={vagasAbertas} 
          icon={Briefcase}
          /* trend={{ value: 12, isPositive: true }} */
        />
        <MetricCard 
          title="Candidatos Ativos" 
          value={candidatoTotal} 
          icon={Users}
          description={`${hoje} novos hoje`}
          /* trend={{ value: 8, isPositive: true }} */
        />
        <MetricCard 
          title="Taxa de Conversão" 
          value="28%" 
          icon={CheckCircle}
         /*  trend={{ "d", isPositive: true }} */
        />
        <MetricCard 
          title="Tempo Médio" 
          value="18 dias" 
          icon={Clock}
          description="Abertura até contratação"
          /* trend={{ value: -2, isPositive: false }} */
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico e Vagas */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gráfico */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Performance de Contratação</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="vagas" name="Vagas Abertas" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="contratacoes" name="Contratações" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Vagas */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Vagas em Destaque</CardTitle>
                  <CardDescription>Status atual das vagas</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar vagas..."
                      className="pl-10 w-full sm:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-32">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="aberta">Abertas</SelectItem>
                      <SelectItem value="pausada">Pausadas</SelectItem>
                      <SelectItem value="fechada">Fechadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Vaga</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Candidatos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vagasFiltradas.map((vaga) => (
                      <TableRow key={vaga.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold">{vaga.titulo}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(vaga.dataAbertura).toLocaleDateString('pt-BR')} - {new Date(vaga.dataFim).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{vaga.departamento.nome}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            {vaga.candidatos}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge 
                              variant={
                                vaga.status === 'aberta' ? 'default' :
                                vaga.status === 'pausada' ? 'secondary' : 'destructive'
                              }
                              className="w-fit"
                            >
                              {vaga.status === 'aberta' ? 'Aberta' : vaga.status === 'pausada' ? 'Pausada' : 'Fechada'}
                            </Badge>
                            {vaga.prioridade === 'alta' && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 w-fit">
                                Alta Prioridade
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Search className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="h-4 w-4 mr-2" />
                                Ver Candidatos
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {vagasFiltradas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma vaga encontrada com os filtros aplicados
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Candidatos Recentes */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span>Candidatos Recentes</span>
                <Badge variant="secondary">{candidatoRecentes.length}</Badge>
              </CardTitle>
              <CardDescription>Últimas 24 horas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidatoRecentes.length > 0 ? (
                candidatoRecentes.slice(0, 5).map((candidato) => {
                  const etapaInfo = etapasCandidato.find(e => e.etapa === candidato.etapa);
                  return (
                    <div key={candidato.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {candidato.nome.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{candidato.nome}</p>
                          <p className="text-xs text-gray-500 truncate">{candidato.vaga.titulo}</p>
                          {etapaInfo && (
                            <Badge variant="outline" className={`text-xs mt-1 ${etapaInfo.cor}`}>
                              {etapaInfo.label}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setCandidatoSelecionado(candidato.id);
                          setVagaSelecionada(candidato.vaga.id);
                          setEntrevista({
                            ...entrevista,
                            candidato: candidato.id,
                            vaga: candidato.vaga.id
                          });
                          setAgendarOpen(true);
                        }}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Nenhum candidato recente</p>
                </div>
              )}
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link href="/candidatos">
                  Ver todos os candidatos
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Próximas Entrevistas */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span>Próximas Entrevistas</span>
                <Badge variant="secondary">{entrevistas.length}</Badge>
              </CardTitle>
              <CardDescription>Agendadas para hoje e amanhã</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {entrevistas.length > 0 ? (
                entrevistas.map((entrevista) => {
                  const candidato = candidatos.find(c => c.id === entrevista.candidato);
                  const vaga = vagas.find(v => v.id === entrevista.vaga);
                  
                  return (
                    <div 
                      key={entrevista.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg ${
                            new Date(entrevista.dataHora).toDateString() === new Date().toDateString() 
                              ? "bg-blue-100 text-blue-600" 
                              : "bg-orange-100 text-orange-600"
                          }`}>
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {candidato ? candidato.nome : "Candidato não encontrado"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {vaga ? vaga.titulo : "Vaga não encontrada"}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEntrevista({
                              candidato: entrevista.candidato,
                              vaga: entrevista.vaga,
                              dataHora: entrevista.dataHora,
                              local: entrevista.local,
                              descricao: entrevista.descricao
                            });
                            setAgendarOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Horário:</span>
                          <span>{formatarDataEntrevista(entrevista.dataHora)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Local:</span>
                          <span>{entrevista.local || "Não informado"}</span>
                        </div>
                        {entrevista.descricao && (
                          <div>
                            <span className="font-medium">Detalhes:</span>
                            <p className="text-gray-600 text-xs mt-1">{entrevista.descricao}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 mb-4">Nenhuma entrevista agendada</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setAgendarOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Agendar Entrevista
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Ferramentas de recrutamento</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button 
                variant="outline" 
                className="justify-start h-12"
                onClick={() => setAgendarOpen(true)}
              >
                <Calendar className="mr-3 h-5 w-5 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium">Agendar Entrevista</p>
                  <p className="text-xs text-gray-500">Marcar nova entrevista</p>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start h-12"
                onClick={() => setTesteOpen(true)}
              >
                <FileText className="mr-3 h-5 w-5 text-green-500" />
                <div className="text-left">
                  <p className="font-medium">Teste Técnico</p>
                  <p className="text-xs text-gray-500">Enviar para candidato</p>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start h-12"
                onClick={() => setRelatorioOpen(true)}
              >
                <Download className="mr-3 h-5 w-5 text-purple-500" />
                <div className="text-left">
                  <p className="font-medium">Gerar Relatório</p>
                  <p className="text-xs text-gray-500">Exportar dados</p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modais */}
      <Dialog open={abrir} onOpenChange={setAbrir}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className='text-center text-2xl'>Criar Nova Vaga</DialogTitle>
            <DialogDescription className='text-center'>
              Preencha os detalhes da nova posição
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-6 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor="titulo">Nome da Vaga *</Label>
                <Input 
                  id="titulo"
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Desenvolvedor Front-end"
                />
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor="fimVaga">Data de Encerramento *</Label>
                <Input 
                  id="fimVaga"
                  type="date"
                  value={fimDavaga}
                  onChange={(e) => setFimDavaga(e.target.value)}
                />
              </div>
            </div>
            
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor="tipoVaga">Tipo de Vaga *</Label>
                <Select value={tipoVaga} onValueChange={setTipoVaga}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tempoIntegral">Tempo Integral</SelectItem>
                    <SelectItem value="meioPeriodo">Meio Período</SelectItem>
                    <SelectItem value="remoto">Remoto</SelectItem>
                    <SelectItem value="estagio">Estágio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor="departamento">Departamento *</Label>
                <Select value={departamentoSelecionado} onValueChange={setDepartamentoSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((departamento) => (
                      <SelectItem key={departamento.id} value={departamento.id}>
                        {departamento.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className='space-y-2'>
              <Label htmlFor="requisitos">Requisitos e Descrição *</Label>
              <Textarea
                id="requisitos"
                rows={6}
                value={requisitos}
                onChange={(e) => setRequisitos(e.target.value)}
                placeholder="Descreva os requisitos, responsabilidades e benefícios da vaga..."
                className="resize-none"
              />
            </div>
            
            <Button 
              className='bg-purple-600 hover:bg-purple-700 h-12 text-lg' 
              onClick={criarVaga}
              disabled={!titulo || !fimDavaga || !tipoVaga || !departamentoSelecionado || !requisitos}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Criar Vaga
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Agendar Entrevista */}
      <Dialog open={agendarOpen} onOpenChange={setAgendarOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agendar Entrevista</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da entrevista
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="candidato">Candidato *</Label>
              <Select 
                value={entrevista.candidato} 
                onValueChange={(value) => {
                  const candidatoSelecionado = candidatos.find(c => c.id === value);
                  if (candidatoSelecionado) {
                    setEntrevista({
                      ...entrevista,
                      candidato: value,
                      vaga: candidatoSelecionado.vaga.id
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um candidato" />
                </SelectTrigger>
                <SelectContent>
                  {candidatos.map(candidato => (
                    <SelectItem key={candidato.id} value={candidato.id}>
                      {candidato.nome} - {candidato.vaga.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vaga">Vaga *</Label>
              <Select 
                value={entrevista.vaga} 
                onValueChange={(value) => setEntrevista({...entrevista, vaga: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma vaga" />
                </SelectTrigger>
                <SelectContent>
                  {vagas.filter(v => v.status === 'aberta').map(vaga => (
                    <SelectItem key={vaga.id} value={vaga.id}>
                      {vaga.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataHora">Data e Hora *</Label>
              <Input
                id="dataHora"
                type="datetime-local"
                value={entrevista.dataHora}
                onChange={(e) => setEntrevista({...entrevista, dataHora: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="local">Local *</Label>
              <Input
                id="local"
                type="text"
                value={entrevista.local}
                onChange={(e) => setEntrevista({...entrevista, local: e.target.value})}
                placeholder="Sala de reunião 3 ou Link do Meet"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição e Observações</Label>
              <Textarea
                id="descricao"
                value={entrevista.descricao}
                onChange={(e) => setEntrevista({ ...entrevista, descricao: e.target.value })}
                placeholder="Detalhes da entrevista, pontos a serem abordados..."
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setAgendarOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={agendarEntrevista} disabled={!entrevista.candidato || !entrevista.vaga || !entrevista.dataHora || !entrevista.local}>
              Agendar Entrevista
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Teste Técnico */}
      <Dialog open={testeOpen} onOpenChange={setTesteOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enviar Teste Técnico</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do teste técnico
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="candidatoTeste">Candidato *</Label>
              <Select 
                value={testeTecnico.candidato} 
                onValueChange={(value) => setTesteTecnico({...testeTecnico, candidato: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um candidato" />
                </SelectTrigger>
                <SelectContent>
                  {candidatos.map(candidato => (
                    <SelectItem key={candidato.id} value={candidato.id}>
                      {candidato.nome} - {candidato.vaga.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vagaTeste">Vaga *</Label>
              <Select 
                value={testeTecnico.vaga} 
                onValueChange={(value) => setTesteTecnico({...testeTecnico, vaga: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma vaga" />
                </SelectTrigger>
                <SelectContent>
                  {vagas.filter(v => v.status === 'aberta').map(vaga => (
                    <SelectItem key={vaga.id} value={vaga.id}>
                      {vaga.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkTeste">Link do Teste *</Label>
              <Input
                id="linkTeste"
                type="url"
                value={testeTecnico.link}
                onChange={(e) => setTesteTecnico({...testeTecnico, link: e.target.value})}
                placeholder="https://exemplo.com/teste"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataLimite">Data Limite *</Label>
              <Input
                id="dataLimite"
                type="datetime-local"
                value={testeTecnico.dataLimite}
                onChange={(e) => setTesteTecnico({...testeTecnico, dataLimite: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setTesteOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={enviarTesteTecnico} disabled={!testeTecnico.candidato || !testeTecnico.vaga || !testeTecnico.link || !testeTecnico.dataLimite}>
              Enviar Teste
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Relatório */}
      <Dialog open={relatorioOpen} onOpenChange={setRelatorioOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Gerar Relatório</DialogTitle>
            <DialogDescription>
              Selecione o tipo de relatório e período desejado
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-3">
              <Label htmlFor="tipoRelatorio">Tipo de Relatório *</Label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidatos">Candidatos por Vaga</SelectItem>
                  <SelectItem value="entrevistas">Entrevistas Agendadas</SelectItem>
                  <SelectItem value="contratacoes">Contratações</SelectItem>
                  <SelectItem value="desempenho">Desempenho de Recrutamento</SelectItem>
                  <SelectItem value="vagas">Status das Vagas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="periodoRelatorio">Período *</Label>
              <Select value={periodoRelatorio} onValueChange={setPeriodoRelatorio}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="15dias">Últimos 15 dias</SelectItem>
                  <SelectItem value="1mes">Último mês</SelectItem>
                  <SelectItem value="3meses">Últimos 3 meses</SelectItem>
                  <SelectItem value="6meses">Últimos 6 meses</SelectItem>
                  <SelectItem value="1ano">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setRelatorioOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={gerarRelatorio}>
              <Download className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecrutamentoDashboard;