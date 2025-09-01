'use client'

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "./data-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  FileDown, 
  UserPlus, 
  CalendarCheck,
  GraduationCap,
  Users,
  BookOpenCheck
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColumnDef } from '@tanstack/react-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Participante = {
  id: number;
  nome: string;
  curso: string;
  status: "matriculado" | "concluído" | "abandonou";
  data_conclusao: string | null;
};

type Curso = {
  id: number;
  titulo: string;
  Carga_horaria: string;
  Formadores: string;
  area_tematica: string;
  dataFim: string;
  dataInicio: string;
  descricao: string;
  empresaParceira: string;
  horario: string;
  local: string;
  modalidade: string;
};
type Inscritos={
  id:number
  funcionario_nome:string
  formacao:string
  estado:"pendente"| "matriculado" | "concluído" | "Em Andamento";
  data_conclusao: string | null;
}
type Departamento = {
  id: string;
  nome: string;  
};
export default function GestaoFormacoes() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [DepartamentoSelecionado, setDepartamentoSelecionado]=useState<string>('')
    const [departamentos,setdepartamentos]=useState<Departamento[]>([])
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [participantesFiltrados, setParticipantesFiltrados] = useState<Participante[]>([]);
  const [abaAtiva, setAbaAtiva] = useState("cursos");
  const [termoBusca, setTermoBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [DataFim, setdataFim]=useState('')
  const [DataInicio, setdataInicio]=useState('')
  const [inscritos,setinscritos]=useState<Inscritos[]>([])
  const [estatisticas, setEstatisticas] = useState({
    totalCursos: 0,
    funcionariosMatriculados: 0,
    taxaConclusao: 0
  });

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setCarregando(true);
        const res= await fetch("http://localhost:8000/formacoes/",{
          credentials:"include"
        })
        const data=await res.json()
        if(res.ok){
        setCursos(data);
        console.log(data)
        }
       
        //   {
        //     id: 2,
        //     titulo: "Introdução ao React",
        //     Carga_horaria: "30 horas",
        //     Formadores: "Carlos Mendes",
        //     area_tematica: "Desenvolvimento",
        //     dataFim: "2023-06-20",
        //     dataInicio: "2023-05-10",
        //     descricao: "Fundamentos do React para iniciantes",
        //     empresaParceira: "Empresa B",
        //     horario: "19:00 às 21:00",
        //     local: "Sala 101",
        //     modalidade: "Presencial"
        //   }
        // ];
        
        const participantesMock: Participante[] = [
          {
            id: 1,
            nome: "João Silva",
            curso: "Gestão de Projetos",
            status: "matriculado",
            data_conclusao: null
          },
          {
            id: 2,
            nome: "Maria Santos",
            curso: "Introdução ao React",
            status: "concluído",
            data_conclusao: "2023-06-18"
          }
        ];
        
        setParticipantes(participantesMock);
        setParticipantesFiltrados(participantesMock);
        setCarregando(false);
        
        // Calcular estatísticas
        calcularEstatisticas(data, participantesMock);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Swal.fire('Erro', 'Falha ao carregar dados. Tente novamente.', 'error');
        setCarregando(false);
      }
    };

    buscarDados();
  }, []);
const relatorioDepartamento = async () => {
  try {
    const response = await fetch(`http://localhost:8000/formacoes_departamento/?departamento=${DepartamentoSelecionado}`, {
      credentials: "include"
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar dados das formações');
    }
    
    const formacoes = await response.json();
    console.log(formacoes)
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Relatório de Formações por Departamento", 15, 15);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`, 15, 22);
    
    doc.setFontSize(12);
    doc.text(`Departamento: ${departamentos.find(d => d.id === DepartamentoSelecionado)?.nome || 'Não especificado'}`, 15, 32);
    
    autoTable(doc, {
      head: [
        ["Título", "Área Temática", "Carga Horária", "Período", "Local", "Formadores"]
      ],
      body: formacoes.map((formacao: { titulo: any; area_tematica: any; Carga_horaria: any; dataInicio: any; dataFim: any; local: any; Formadores: any; }) => [
        formacao.titulo || "-",
        formacao.area_tematica || "-",
        formacao.Carga_horaria || "-",
        `${formatDate(formacao.dataInicio)} - ${formatDate(formacao.dataFim)}`,
        formacao.local || "-",
        formacao.Formadores || "-"
      ]),
      startY: 40,
      styles: { 
        fontSize: 9,
        cellPadding: 2
      },
      headStyles: { 
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { top: 40 }
    });
    
  
    doc.save(`formacoes-departamento-${format(new Date(), 'yyyyMMdd')}.pdf`);
    
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    alert('Falha ao gerar relatório. Verifique o console para mais detalhes.');
  }
};
const relatorioData = async () => {
  try {
    const response = await fetch(`http://localhost:8000/formacoes_data/?dataInicio=${DataInicio}&dataFim=${DataFim}`, {
      credentials: "include"
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar dados das formações');
    }
    
    const formacoes = await response.json();
    console.log(formacoes)
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Relatório de Formações", 15, 15);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`, 15, 22);
    
    doc.setFontSize(12);
    doc.text(`Datas das Formações: ${DataInicio || 'Não especificado'} ${DataFim}`, 15, 32);
    
    autoTable(doc, {
      head: [
        ["Título", "Área Temática", "Carga Horária", "Período", "Local", "Formadores"]
      ],
      body: formacoes.map((formacao: { titulo: any; area_tematica: any; Carga_horaria: any; dataInicio: any; dataFim: any; local: any; Formadores: any; }) => [
        formacao.titulo || "-",
        formacao.area_tematica || "-",
        formacao.Carga_horaria || "-",
        `${formatDate(formacao.dataInicio)} - ${formatDate(formacao.dataFim)}`,
        formacao.local || "-",
        formacao.Formadores || "-"
      ]),
      startY: 40,
      styles: { 
        fontSize: 9,
        cellPadding: 2
      },
      headStyles: { 
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { top: 40 }
    });
    
  
    doc.save(`formacoes-departamento-${format(new Date(), 'yyyyMMdd')}.pdf`);
    
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    alert('Falha ao gerar relatório. Verifique o console para mais detalhes.');
  }
};

  function formatDate(dateString:string) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  }
  useEffect(() => {
    if (termoBusca) {
      const filtrados = participantes.filter(participante => 
        participante.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        participante.curso.toLowerCase().includes(termoBusca.toLowerCase())
      );
      setParticipantesFiltrados(filtrados);
    } else {
      setParticipantesFiltrados(participantes);
    }
  }, [termoBusca, participantes]);

  const calcularEstatisticas = (cursos: Curso[], participantes: Participante[]) => {
    const totalCursos = cursos.length;
    const funcionariosMatriculados = participantes.length;
    
    const concluidos = participantes.filter(p => p.status === "concluído").length;
    const taxaConclusao = funcionariosMatriculados > 0 ? Math.round((concluidos / funcionariosMatriculados) * 100) : 0;
    
    setEstatisticas({
      totalCursos,
      funcionariosMatriculados,
      taxaConclusao
    });
  };

  const formatarData = (dataString: string) => {
    try {
      return format(new Date(dataString), 'dd/MM/yyyy');
    } catch {
      return dataString;
    }
  };

  const adicionarCurso = () => {
    Swal.fire({
      title: 'Novo Curso',
      html: `
        <input id="titulo-curso" class="swal2-input" placeholder="Título do Curso">
        <input id="data-inicio" class="swal2-input" type="date" placeholder="Data Início">
        <input id="data-termino" class="swal2-input" type="date" placeholder="Data Término">
        <textarea id="descricao" class="swal2-textarea" placeholder="Descrição"></textarea>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          titulo: (document.getElementById('titulo-curso') as HTMLInputElement).value,
          dataInicio: (document.getElementById('data-inicio') as HTMLInputElement).value,
          dataTermino: (document.getElementById('data-termino') as HTMLInputElement).value,
          descricao: (document.getElementById('descricao') as HTMLTextAreaElement).value
        }
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { titulo, dataInicio, dataTermino, descricao } = result.value;
        
        const novoCurso: Curso = {
          id: cursos.length + 1,
          titulo,
          Carga_horaria: "40 horas",
          Formadores: "A definir",
          area_tematica: "Outra",
          dataFim: dataTermino,
          dataInicio,
          descricao,
          empresaParceira: "Nossa empresa",
          horario: "A definir",
          local: "A definir",
          modalidade: "Remoto"
        };
        
        setCursos([...cursos, novoCurso]);
        Swal.fire('Sucesso!', 'Curso adicionado com sucesso.', 'success');
      }
    });
  };

  const gerarRelatorio = () => {
    Swal.fire({
      title: 'Relatório Gerado!',
      text: 'O relatório foi gerado com sucesso.',
      icon: 'success',
      confirmButtonText: 'Baixar'
    });
  };

  const inscreverFuncionario = () => {
    Swal.fire({
      title: 'Inscrever Funcionário',
      html: `
        <input id="nome-funcionario" class="swal2-input" placeholder="Nome do Funcionário">
        <select id="curso" class="swal2-select">
          <option value="">Selecione um curso</option>
          ${cursos.map(c => `<option value="${c.id}">${c.titulo}</option>`).join('')}
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          nomeFuncionario: (document.getElementById('nome-funcionario') as HTMLInputElement).value,
          cursoId: (document.getElementById('curso') as HTMLSelectElement).value
        }
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { nomeFuncionario, cursoId } = result.value;
        const curso = cursos.find(c => c.id === parseInt(cursoId));
        
        if (!curso) {
          Swal.fire('Erro', 'Curso não encontrado.', 'error');
          return;
        }
        
        const novoParticipante: Participante = {
          id: participantes.length + 1,
          nome: nomeFuncionario,
          curso: curso.titulo,
          status: "matriculado",
          data_conclusao: null
        };
        
        setParticipantes([...participantes, novoParticipante]);
        Swal.fire('Sucesso!', 'Funcionário inscrito com sucesso.', 'success');
        
        calcularEstatisticas(cursos, [...participantes, novoParticipante]);
      }
    });
  };
 const loadData = async () => {
    try {
      const minhaFormacoesResponse = await fetch("http://localhost:8000/inscricao/", {
        credentials: "include"
      });

      if (minhaFormacoesResponse.ok) {
        const minhaFormacoes= await minhaFormacoesResponse.json();
        
        setinscritos(minhaFormacoes);
        
      }

      
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      Swal.fire('Erro', 'Falha ao carregar dados', 'error');
    } finally {
    }
  };

  const renderizarCartoesEstatisticas = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
          <GraduationCap className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estatisticas.totalCursos}</div>
          <p className="text-xs text-blue-600">Programas disponíveis</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Funcionários Inscritos</CardTitle>
          <Users className="h-5 w-5 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estatisticas.funcionariosMatriculados}</div>
          <p className="text-xs text-purple-600">Participantes ativos</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
          <BookOpenCheck className="h-5 w-5 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estatisticas.taxaConclusao}%</div>
          <p className="text-xs text-amber-600">Formações concluídas</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderizarTabelaParticipantes = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-semibold">Funcionários Inscritos</h3>
        
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Buscar funcionário ou curso..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conclusão</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {participantesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhum funcionário encontrado
                </td>
              </tr>
            ) : (
              inscritos.map(participante => (
                <tr key={participante.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="font-medium text-gray-700">
                          {participante.funcionario_nome.charAt(0)}
                        </span>
                      </div> */}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{participante.funcionario_nome}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participante.formacao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant={
                        participante.estado === "concluído" ? "default" : 
                        participante.estado === "matriculado" ? "secondary" : "destructive"
                      }
                    >
                      {participante.estado === "concluído" ? "Concluído" : 
                       participante.estado === "matriculado" ? "Matriculado" : "Em andamento"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participante.data_conclusao ? formatarData(participante.data_conclusao) : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderizarTopPerformers = () => (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Top Performers</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cursos Concluídos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recomendações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {participantes
              .filter(p => p.status === "concluído")
              .map(participante => (
                <tr key={participante.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{participante.nome.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{participante.nome}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge variant="default">1</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className="flex items-center gap-1">
                      Top Performer
                    </Badge>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
useEffect(() => {
    
  const Departametos = async () => {
       try {
         const res = await fetch("http://localhost:8000/departamentos/", {
           credentials: "include"
         });
         const data = await res.json();
         if (res.ok) {
           setdepartamentos(data.dados);
           console.log(data.dados)
         }
       } catch (error) {
         console.error("Erro ao buscar dados:", error);
       } finally {
        //  setLoading(false);
       }
     };
     loadData()
    Departametos()
  }, []);
  const deleteCurso = (id: number) => {
    setCursos(cursos.filter(curso => curso.id !== id));
    Swal.fire('Sucesso!', 'Curso excluído com sucesso.', 'success');
  }

  const editCurso = (id: number, updatedData: Partial<Curso>) => {
    setCursos(cursos.map(curso => 
      curso.id === id ? { ...curso, ...updatedData } : curso
    ));
    Swal.fire('Sucesso!', 'Curso atualizado com sucesso.', 'success');
  }

  const ActionsCell = ({ row }: { row: any }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      const offset = date.getTimezoneOffset()
      date.setMinutes(date.getMinutes() - offset)
      return date.toISOString().split('T')[0]
    }

    const [formData, setFormData] = useState<Partial<Curso>>({
      titulo: row.original.titulo,
      descricao: row.original.descricao,
      dataInicio: formatDate(row.original.dataInicio || ''),
      dataFim: formatDate(row.original.dataFim || ''),
      Formadores: row.original.Formadores,
      Carga_horaria: row.original.Carga_horaria,
      area_tematica: row.original.area_tematica,
      empresaParceira: row.original.empresaParceira,
      horario: row.original.horario,
      local: row.original.local,
      modalidade: row.original.modalidade
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    }

    const validateForm = () => {
      const newErrors: Record<string, string> = {}
      const requiredFields: Array<keyof Curso> = [
        'titulo',
        'descricao',
        'dataInicio',
        'dataFim',
        'Formadores',
        'Carga_horaria',
        'area_tematica',
        'empresaParceira',
        'horario',
        'local',
        'modalidade'
      ]

      requiredFields.forEach(field => {
        const value = formData[field]
        const isDate = field.includes('data')
        const isValidDate = isDate ? !isNaN(Date.parse(String(value) || '')) : true

        if (!value || (isDate && !isValidDate)) {
          newErrors[field] = 'Este campo é obrigatório'
        }
      })

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
      if (!validateForm()) return
      editCurso(row.original.id, formData)
      setIsDialogOpen(false)
    }

    const handleDelete = () => {
      deleteCurso(row.original.id)
      setIsDeleteDialogOpen(false)
    }

    return (
      <div className="flex gap-2">
        {/* Diálogo de Edição */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              Editar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Curso</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {[
                { id: 'titulo', label: 'Título do Curso' },
                { id: 'descricao', label: 'Descrição' },
                { id: 'dataInicio', label: 'Data de Início', type: 'date' },
                { id: 'dataFim', label: 'Data de Término', type: 'date' },
                { id: 'Formadores', label: 'Instrutores' },
                { id: 'Carga_horaria', label: 'Carga Horária' },
                { id: 'area_tematica', label: 'Área Temática' },
                { id: 'empresaParceira', label: 'Empresa Parceira' },
                { id: 'horario', label: 'Horário' },
                { id: 'local', label: 'Local' },
                { id: 'modalidade', label: 'Modalidade' },
              ].map(({ id, label, type = 'text' }) => (
                <div key={id} className="grid items-center gap-1.5">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    name={id}
                    required
                    value={formData[id as keyof Curso] || ''}
                    onChange={handleChange}
                    className={errors[id] ? 'border-red-500' : ''}
                    type={type}
                  />
                  {errors[id] && (
                    <span className="text-red-500 text-xs">{errors[id]}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Diálogo de Confirmação de Exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              Excluir
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
            </DialogHeader>
            <p>Tem certeza que deseja excluir o curso <strong>{row.original.titulo}</strong>?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Confirmar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  const columns: ColumnDef<Curso>[] = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const dataFim = row.original.dataFim;
        
        if (!dataFim) {
          return <Badge variant="secondary">Data não disponível</Badge>;
        }

        const formattedDate = dataFim.includes('/') 
          ? dataFim.split('/').reverse().join('-')
          : dataFim;
        
        const dateObj = new Date(formattedDate);
        
        if (isNaN(dateObj.getTime())) {
          return <Badge variant="destructive">Data inválida</Badge>;
        }

        const now = new Date();
        
        if (dateObj < now) {
          return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
        } else {
          return <Badge className="bg-blue-100 text-blue-800">Em andamento</Badge>;
        }
      }
    },
    { accessorKey: "titulo", header: "Curso" },
    { accessorKey: "descricao", header: "Descrição" },
    { 
      accessorKey: "dataInicio", 
      header: "Início",
      cell: ({ row }) => formatarData(row.original.dataInicio)
    },
    { 
      accessorKey: "dataFim", 
      header: "Término",
      cell: ({ row }) => formatarData(row.original.dataFim)
    },
    { accessorKey: "Formadores", header: "Instrutores" },
    { accessorKey: "Carga_horaria", header: "Carga Horária" },
    { header: "Ações", cell: ({ row }) => <ActionsCell row={row} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestão de Formações</h1>
            <p className="text-gray-600 mt-2">Desenvolva suas equipes e impulsione o crescimento organizacional</p>
          </div>
          
          {/* <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={gerarRelatorio}>
              <FileDown className="mr-2 h-4 w-4" />
              Relatório
            </Button>
            <Button variant="default" onClick={inscreverFuncionario}>
              <UserPlus className="mr-2 h-4 w-4" />
              Inscrever Funcionário
            </Button>
            <Button className="bg-gradient-to-r from-green-500 to-teal-500" onClick={adicionarCurso}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Curso
            </Button>
          </div> */}
        </div>

        {renderizarCartoesEstatisticas()}

        <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-2 rounded-lg">
            <TabsTrigger 
              value="cursos" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2"
            >
              Programas de Formação
            </TabsTrigger>
            <TabsTrigger 
              value="participantes" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2"
            >
              Participantes
            </TabsTrigger>
            <TabsTrigger 
              value="relatorios" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2"
            >
              Relatórios
            </TabsTrigger>
            <TabsTrigger 
              value="desempenho" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2"
            >
              Desempenho
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cursos">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Catálogo de Formações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {carregando ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <DataTable columns={columns} data={cursos} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participantes">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Funcionários Inscritos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {carregando ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  renderizarTabelaParticipantes()
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="relatorios">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de Formações</CardTitle>
                <CardDescription>Gere relatórios personalizados com base em diversos critérios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Por Período</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label>Data Inicial</Label>
                          <Input type="date" value={DataInicio}  onChange={(e)=>setdataInicio(e.target.value)} />
                        </div>
                        <div>
                          <Label>Data Final</Label>
                          <Input type="date" value={DataFim}  onChange={(e)=>setdataFim(e.target.value)}  />
                        </div>
                        <Button className="w-full" onClick={relatorioData}>
                          <FileDown className="mr-2 h-4 w-4" /> Gerar Relatório
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Por Funcionário</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label>Funcionário</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um funcionário" />
                            </SelectTrigger>
                            <SelectContent>
                              {participantes.map(p => (
                                <SelectItem key={p.id} value={p.id.toString()}>{p.nome}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full">
                          <FileDown className="mr-2 h-4 w-4" /> Gerar Histórico
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Por Departamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className='flex flex-col gap-2'>
                                      <Label>Departamento</Label>
                                      <Select value={DepartamentoSelecionado} onValueChange={(DepartamentoSelecionado)=>setDepartamentoSelecionado(DepartamentoSelecionado)}>
                                      <SelectTrigger className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
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
                        <Button className="w-full" onClick={relatorioDepartamento}>
                          <FileDown className="mr-2 h-4 w-4" /> Gerar Relatório
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Exportação de Dados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button variant="outline">
                      <FileDown className="mr-2 h-4 w-4" /> Todos os Dados (CSV)
                    </Button>
                    <Button variant="outline">
                      <FileDown className="mr-2 h-4 w-4" /> Formações (PDF)
                    </Button>
                    <Button variant="outline">
                      <FileDown className="mr-2 h-4 w-4" /> Participantes (Excel)
                    </Button>
                    <Button variant="outline">
                      <FileDown className="mr-2 h-4 w-4" /> Certificados (ZIP)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="desempenho">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Desempenho</CardTitle>
                <CardDescription>Métricas e indicadores de eficácia das formações</CardDescription>
              </CardHeader>
              <CardContent>
                {renderizarTopPerformers()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}