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
  Edit
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from '@material-tailwind/react';
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
        console.log("Candidatos,", candidatosData )

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
        console.log("Entrevistas,", data)
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
    
    // Formatar hora
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

  // Funções para ações rápidas
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

  return (
    <div className="bg-gray-50 p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-extrabold text-purple-500 text-2xl">Recrutamento e Seleção</h1>
        <div className="flex gap-2">
          <a href={`http://localhost:3000/empresa/${empresaNome}/`}>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Página pública de Candidatura
            </Button>
          </a>
          <Button onClick={() => setAbrir(true)} className='bg-purple-700 hover:bg-purple-500'>
            <UserPlus className="mr-2 h-4 w-4" />
            Nova Vaga
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Vagas Abertas" 
          value={vagasAbertas} 
          icon={Briefcase}
        />
        <MetricCard 
          title="Candidatos Ativos" 
          value={candidatoTotal} 
          icon={Users}
          description={`${hoje} novos hoje`}
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 dias</div>
            <p className="text-xs text-muted-foreground">Desde abertura até contratação</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28%</div>
            <p className="text-xs text-muted-foreground">Candidatos/Contratações</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance de Contratação</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="vagas" name="Vagas Abertas" fill="#8884d8" />
                  <Bar dataKey="contratacoes" name="Contratações" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vagas em Destaque</CardTitle>
              <CardDescription>Status atual</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Vaga</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Candidatos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vagas.map((vaga) => (
                    <TableRow key={vaga.id}>
                      <TableCell className="font-medium">{vaga.titulo}</TableCell>
                      <TableCell>{vaga.departamento.nome}</TableCell>
                      <TableCell>{vaga.candidatos}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            vaga.status === 'aberta' ? 'default' :
                            vaga.status === 'pausada' ? 'secondary' : 'destructive'
                          }
                        >
                          {vaga.status === 'aberta' ? 'Aberta' : vaga.status === 'pausada' ? 'Pausada' : 'Fechada'}
                        </Badge>
                        {vaga.prioridade === 'alta' && (
                          <span className="ml-2 text-xs text-red-500">❗ Prioridade</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Search className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidatos Recentes</CardTitle>
              <CardDescription>Últimas 24 horas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidatoRecentes.length > 0 ? (
                candidatoRecentes.slice(0, 4).map((candidato) => (
                  <div key={candidato.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {candidato.nome.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{candidato.nome}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{candidato.vaga.titulo}</span>
                          <Badge variant="outline" className="text-xs ml-2">
                            {candidato.etapa}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setCandidatoSelecionado(candidato.id);
                        setVagaSelecionada(candidato.vaga.id);
                        setAgendarOpen(true);
                      }}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">Nenhum candidato recente.</div>
              )}
              <Button variant="outline" className="w-full mt-2">
                Ver todos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Entrevistas</CardTitle>
              <CardDescription>Hoje e amanhã</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {entrevistas.length > 0 ? (
                entrevistas.map((entrevista) => {
                  const candidato = candidatos.find(c => c.id === entrevista.candidato);
                  const vaga = vagas.find(v => v.id === entrevista.vaga);
                  
                  return (
                    <div 
                      key={entrevista.id} 
                      className="flex items-start border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className={`flex-shrink-0 p-2 rounded-lg ${
                        new Date(entrevista.dataHora).toDateString() === new Date().toDateString() 
                          ? "bg-blue-100" 
                          : "bg-orange-100"
                      }`}>
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {candidato ? candidato.nome : "Candidato não encontrado"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {vaga ? vaga.titulo : "Vaga não encontrada"}
                            </p>
                            <p className="text-sm mt-1">
                              {formatarDataEntrevista(entrevista.dataHora)}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
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
                        
                        <div className="mt-2 text-sm">
                          <p className="font-medium">Local:</p>
                          <p>{entrevista.local || "Não informado"}</p>
                        </div>
                        
                        {entrevista.descricao && (
                          <div className="mt-2 text-sm">
                            <p className="font-medium">Detalhes:</p>
                            <p className="text-muted-foreground">{entrevista.descricao}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">Nenhuma entrevista agendada para hoje ou amanhã</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setAgendarOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Agendar Entrevista
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => setTesteOpen(true)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Enviar Teste Técnico
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => setAgendarOpen(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Entrevista
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => setRelatorioOpen(true)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
          
          {/* Modal para Nova Vaga */}
          <Dialog open={abrir} onOpenChange={setAbrir}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className='text-center'>Adicionar Nova Vaga</DialogTitle>
                <DialogDescription className='text-center'>
                  Preencha os dados da vaga
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="titulo">Nome da Vaga</Label>
                  <Input 
                    id="titulo"
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="fimVaga">Fim da Vaga</Label>
                  <Input 
                    id="fimVaga"
                    type="date"
                    value={fimDavaga}
                    onChange={(e) => setFimDavaga(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="tipoVaga">Tipo de Vaga</Label>
                  <Select value={tipoVaga} onValueChange={setTipoVaga}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tempoIntegral">Tempo Integral</SelectItem>
                      <SelectItem value="meioPeriodo">Meio Período</SelectItem>
                      <SelectItem value="remoto">Remoto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select value={departamentoSelecionado} onValueChange={setDepartamentoSelecionado}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um departamento" />
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
                
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="requisitos">Requisitos da Vaga</Label>
                  <Textarea
                    id="requisitos"
                    rows={4}
                    value={requisitos}
                    onChange={(e) => setRequisitos(e.target.value)}
                    className="col-span-3" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  />
                </div>
                
                <Button 
                  className='bg-purple-500 hover:bg-purple-400' 
                  onClick={criarVaga}
                  disabled={!titulo || !fimDavaga || !tipoVaga || !departamentoSelecionado}
                >
                  Criar Vaga
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={agendarOpen} onOpenChange={setAgendarOpen}>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>Agendar Entrevista</DialogTitle>
      <DialogDescription>
        Preencha os detalhes da entrevista
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="candidato" className="text-right">
          Candidato
        </Label>
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
          <SelectTrigger className="col-span-3">
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
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="vaga" className="text-right">
          Vaga
        </Label>
        <Select 
          value={entrevista.vaga} 
          onValueChange={(value) => setEntrevista({...entrevista, vaga: value})}
        >
          <SelectTrigger className="col-span-3">
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
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="dataHora" className="text-right">
          Data e Hora
        </Label>
        <Input
          id="dataHora"
          type="datetime-local"
          value={entrevista.dataHora}
          onChange={(e) => setEntrevista({...entrevista, dataHora: e.target.value})}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="local" className="text-right">
          Local
        </Label>
        <Input
          id="local"
          type="text"
          value={entrevista.local}
          onChange={(e) => setEntrevista({...entrevista, local: e.target.value})}
          placeholder="Sala de reunião 3"
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="descricao" className="text-right">
          Descrição
        </Label>
        <Textarea
                    id="descricao"
                    value={entrevista.descricao}
                    onChange={(e) => setEntrevista({ ...entrevista, descricao: e.target.value })}
                    placeholder="Detalhes da entrevista"
                    className="col-span-3" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        />
      </div>
    </div>
    <div className="flex justify-end">
      <Button onClick={agendarEntrevista}>Agendar Entrevista</Button>
    </div>
  </DialogContent>
</Dialog>

          <Dialog open={testeOpen} onOpenChange={setTesteOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Enviar Teste Técnico</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do teste técnico
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="candidatoTeste" className="text-right">
                    Candidato
                  </Label>
                  <Select 
                    value={testeTecnico.candidato} 
                    onValueChange={(value) => setTesteTecnico({...testeTecnico, candidato: value})}
                  >
                    <SelectTrigger className="col-span-3">
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
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vagaTeste" className="text-right">
                    Vaga
                  </Label>
                  <Select 
                    value={testeTecnico.vaga} 
                    onValueChange={(value) => setTesteTecnico({...testeTecnico, vaga: value})}
                  >
                    <SelectTrigger className="col-span-3">
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
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="linkTeste" className="text-right">
                    Link do Teste
                  </Label>
                  <Input
                    id="linkTeste"
                    type="text"
                    value={testeTecnico.link}
                    onChange={(e) => setTesteTecnico({...testeTecnico, link: e.target.value})}
                    placeholder="https://exemplo.com/teste"
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dataLimite" className="text-right">
                    Data Limite
                  </Label>
                  <Input
                    id="dataLimite"
                    type="datetime-local"
                    value={testeTecnico.dataLimite}
                    onChange={(e) => setTesteTecnico({...testeTecnico, dataLimite: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={enviarTesteTecnico}>Enviar Teste</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal para Gerar Relatório */}
          <Dialog open={relatorioOpen} onOpenChange={setRelatorioOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Gerar Relatório</DialogTitle>
                <DialogDescription>
                  Selecione o tipo de relatório e período
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tipoRelatorio" className="text-right">
                    Tipo
                  </Label>
                  <Select 
                    value={tipoRelatorio} 
                    onValueChange={setTipoRelatorio}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candidatos">Candidatos por Vaga</SelectItem>
                      <SelectItem value="entrevistas">Entrevistas Agendadas</SelectItem>
                      <SelectItem value="contratacoes">Contratações</SelectItem>
                      <SelectItem value="desempenho">Desempenho de Recrutamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="periodoRelatorio" className="text-right">
                    Período
                  </Label>
                  <Select 
                    value={periodoRelatorio} 
                    onValueChange={setPeriodoRelatorio}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                      <SelectItem value="15dias">Últimos 15 dias</SelectItem>
                      <SelectItem value="1mes">Último mês</SelectItem>
                      <SelectItem value="3meses">Últimos 3 meses</SelectItem>
                      <SelectItem value="6meses">Últimos 6 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={gerarRelatorio}>Gerar Relatório</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default RecrutamentoDashboard;