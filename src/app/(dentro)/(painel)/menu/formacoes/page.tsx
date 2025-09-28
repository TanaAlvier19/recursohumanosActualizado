'use client';
import { useState, useEffect } from "react";
import { 
  Tabs, TabsList, TabsTrigger, TabsContent
} from "@/components/ui/tabs";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  X, BookOpen, Award, Star, CalendarCheck, GraduationCap, 
  FileText, CheckCircle, Clock, User, Calendar, Search
} from "lucide-react";
import Swal from "sweetalert2";
import { format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";

type Training = {
  id: number;
  titulo: string;
  area_tematica: string;
  Carga_horaria: string;
  horario: string;
  modalidade: string;
  dataInicio: string;
  dataFim: string;
  local: string;
  Formadores: string;
  empresaParceira: string;
  descricao: string;
  vagas: number;
  inscritos: number;
  rating: number;
  status: "active" | "completed" | "pending";
  progress?: number;
};

type Inscricao = {
  id: number;
  estado: string;
  formacao: Training;
};

export default function EmployeeTrainingPanel() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [activeTrainings, setActiveTrainings] = useState<Training[]>([]);
  const [completedTrainings, setCompletedTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [cursos, setCursos] = useState<Training[]>([]);
  const [cursoSelecionado, setCursoSelecionado] = useState<Training | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterModalidade, setFilterModalidade] = useState("all");

  const loadData = async () => {
    setLoading(true);
    try {
      const minhaFormacoesResponse = await fetch("http://localhost:8000/minha_formacoes/", {
        credentials: "include"
      });

      if (minhaFormacoesResponse.ok) {
        const minhaFormacoes= await minhaFormacoesResponse.json();
        // const userTrainings = minhaFormacoes.map(item => ({
        //   ...item.formacao,
        //   status: item.estado === "concluido" ? "completed" : "active",
        //   progress: item.estado === "concluido" ? 100 : 0
        // }));
        setTrainings(minhaFormacoes);
        // setActiveTrainings(userTrainings.filter(t => t.status === "active"));
        // setCompletedTrainings(userTrainings.filter(t => t.status === "completed"));
      }

      // Buscar todos os cursos disponíveis
      const todasFormacoesResponse = await fetch("http://localhost:8000/formacoes/", {
        credentials: "include"
      });

      if (todasFormacoesResponse.ok) {
        const dados = await todasFormacoesResponse.json();
        setCursos(dados);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      Swal.fire('Erro', 'Falha ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  const inscrever = async (id: number) => {
    try {
      const res = await fetch("http://localhost:8000/inscricao/", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ inscricao: id })
      });
      
      if (res.ok) {
        Swal.fire("Inscrição Feita", "Sua inscrição foi realizada com sucesso", "success");
        setModal(false);
        loadData();
      } else {
        const errorData = await res.json();
        Swal.fire("Erro", errorData.message || "Não foi possível completar a inscrição", "error");
      }
    } catch (err) {
      Swal.fire("Erro", "Falha na conexão com o servidor", "error");
    }
  };

  const detalhes = (dado: Training) => {
    setCursoSelecionado(dado);
    setModal(true);
  };

  const filteredCursos = cursos.filter(curso => {
    const matchesSearch = curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          curso.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || curso.area_tematica === filterCategory;
    const matchesModalidade = filterModalidade === "all" || curso.modalidade === filterModalidade;
    
    return matchesSearch && matchesCategory && matchesModalidade;
  });

  const totalHours = trainings.reduce((acc, curr) => {
    const match = curr.Carga_horaria.match(/\d+/);
    return acc + (match ? parseInt(match[0]) : 0);
  }, 0);

  const categories = [...new Set(cursos.map(c => c.area_tematica))];

  const renderTrainingCard = (training: Training) => (
    <Card key={training.id} className="mb-6 border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
      <div className="flex flex-col md:flex-row">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex items-center justify-center w-full md:w-1/4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">{training.titulo}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{training.area_tematica}</Badge>
                <Badge variant="outline">{training.modalidade}</Badge>
              </div>
              <CardDescription className="mt-2 text-gray-600">{training.descricao}</CardDescription>
            </div>
            {training.progress === 100 ? (
              <Badge className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <CheckCircle className="h-4 w-4" /> Concluído
              </Badge>
            ) : (
              <Badge className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4" /> Em andamento
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CalendarCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Início</p>
                  <p className="font-medium">{formatDate(training.dataInicio)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CalendarCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Término</p>
                  <p className="font-medium">{formatDate(training.dataFim)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Instrutor</p>
                  <p className="font-medium">{training.Formadores}</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progresso</span>
                <span className="text-sm font-medium text-blue-600">{training.progress || 0}%</span>
              </div>
              <Progress value={training.progress || 0} className="h-2.5 bg-gray-200" />
              <div className="mt-2 text-xs text-gray-500">
                Carga horária: {training.Carga_horaria}
              </div>
              
              <div className="mt-4 flex gap-3">
                {training.progress === 100 ? (
                  <Button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                    <FileText className="mr-2 h-4 w-4" />
                    Certificado
                  </Button>
                ) : (
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Continuar
                  </Button>
                )}
                <Button variant="outline" className="flex-1">
                  Detalhes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Total de Formações</CardTitle>
          <div className="bg-blue-100 p-2 rounded-lg">
            <GraduationCap className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-800">{trainings.length}</div>
          <p className="text-xs text-blue-600 mt-1">Programas realizados</p>
        </CardContent>
      </Card>

      <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Formações Concluídas</CardTitle>
          <div className="bg-green-100 p-2 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-800">{completedTrainings.length}</div>
          <p className="text-xs text-green-600 mt-1">Programas finalizados</p>
        </CardContent>
      </Card>

      <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Em Progresso</CardTitle>
          <div className="bg-purple-100 p-2 rounded-lg">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-800">{activeTrainings.length}</div>
          <p className="text-xs text-purple-600 mt-1">Cursos em andamento</p>
        </CardContent>
      </Card>

      <Card className="border-0 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Horas de Treino</CardTitle>
          <div className="bg-amber-100 p-2 rounded-lg">
            <BookOpen className="h-5 w-5 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-800">{totalHours}</div>
          <p className="text-xs text-amber-600 mt-1">Total dedicado</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                Portal de Desenvolvimento Profissional
              </h1>
              <p className="text-gray-600 mt-2">
                Gerencie seu crescimento profissional e acompanhe seu progresso
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <BookOpen className="mr-2 h-4 w-4" />
              Sugerir Formação
            </Button>
          </div>
        </div>

        {renderStats()}

        <Tabs defaultValue="active" className="space-y-6">
          <div className="bg-white rounded-xl p-2 shadow-sm">
            <TabsList className="bg-transparent p-0 gap-1">
              <TabsTrigger 
                value="active" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:shadow-none rounded-lg px-4 py-2"
              >
                <Clock className="h-4 w-4 mr-2" />
                Em Andamento
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 data-[state=active]:shadow-none rounded-lg px-4 py-2"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Concluídas
              </TabsTrigger>
              <TabsTrigger 
                value="available" 
                className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:shadow-none rounded-lg px-4 py-2"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Disponíveis
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active">
            <Card className="border-0 shadow-md rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <Clock className="h-6 w-6 text-blue-600" />
                      Formações em Progresso
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Continue seus cursos e acompanhe seu desenvolvimento
                    </CardDescription>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      Exportar Progresso
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      Ver Relatório
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex flex-col gap-6">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-gray-200 rounded-xl w-16 h-16 animate-pulse" />
                          <div className="flex-1">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : trainings.length > 0 ? (
                  trainings.map(renderTrainingCard)
                ) : (
                  <div className="text-center py-12">
                    <GraduationCap className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 font-semibold text-gray-800 text-xl">Nenhuma formação em andamento</h3>
                    <p className="mt-2 text-gray-600 max-w-md mx-auto">
                      Explore nossas formações disponíveis para começar a desenvolver novas habilidades
                    </p>
                    <Button 
                      className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600"
                      onClick={() => {
                        const availableTab = document.querySelector('[data-value="available"]');
                        if (availableTab) (availableTab as HTMLElement).click();
                      }}
                    >
                      Ver Formações Disponíveis
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card className="border-0 shadow-md rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      Formações Concluídas
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Histórico de todas as formações que você completou
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Exportar Certificados
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : completedTrainings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedTrainings.map(training => (
                      <Card key={training.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-green-600" />
                            {training.titulo}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">{training.descricao}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 text-sm mb-3">
                            <CalendarCheck className="h-4 w-4 text-gray-500" />
                            <span>Concluído em: {formatDate(training.dataFim)}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <FileText className="mr-2 h-4 w-4" />
                              Detalhes
                            </Button>
                            <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600">
                              <Award className="mr-2 h-4 w-4" />
                              Certificado
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <GraduationCap className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 font-semibold text-gray-800 text-xl">Nenhuma formação concluída</h3>
                    <p className="mt-2 text-gray-600 max-w-md mx-auto">
                      Comece uma formação para ver seu histórico aqui
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="available">
            <Card className="border-0 shadow-md rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                      Formações Disponíveis
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Explore novas oportunidades de aprendizado para seu desenvolvimento
                    </CardDescription>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      Filtrar
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-purple-600 to-violet-600"
                      onClick={() => {
                        const activeTab = document.querySelector('[data-value="active"]');
                        if (activeTab) (activeTab as HTMLElement).click();
                      }}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Minhas Formações
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Pesquisar formações..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      <option value="all">Todas Categorias</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    
                    <select 
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={filterModalidade}
                      onChange={(e) => setFilterModalidade(e.target.value)}
                    >
                      <option value="all">Todas Modalidades</option>
                      <option value="Presencial">Presencial</option>
                      <option value="Online">Online</option>
                      <option value="Híbrido">Híbrido</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCursos.map((dado) => (
                    <Card key={dado.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 flex justify-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-purple-600" />
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-800">{dado.titulo}</CardTitle>
                        <CardDescription className="line-clamp-2">{dado.descricao}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="flex-1">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {formatDate(dado.dataInicio)} - {formatDate(dado.dataFim)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{dado.Carga_horaria} ({dado.horario})</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{dado.Formadores}</span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <Badge variant="outline" className="border-purple-300 text-purple-600">
                              {dado.area_tematica}
                            </Badge>
                            
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                              <span className="text-sm font-medium">{dado.rating || "4.5"}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      
                      <div className="p-6 pt-0">
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                          onClick={() => detalhes(dado)}
                        >
                          Detalhes do Curso
                        </Button>
                      </div>
                    </Card>
                  ))}
                  
                  {filteredCursos.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
                      <h3 className="mt-4 font-semibold text-gray-800 text-xl">Nenhuma formação encontrada</h3>
                      <p className="mt-2 text-gray-600 max-w-md mx-auto">
                        Tente ajustar seus filtros ou pesquisar por termos diferentes
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterCategory("all");
                          setFilterModalidade("all");
                        }}
                      >
                        Limpar Filtros
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Detalhes do Curso */}
      {modal && cursoSelecionado && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b z-10 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Detalhes do curso</h2>
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => setModal(false)}
              >
                <X size={20} />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{cursoSelecionado.titulo}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-purple-100 text-purple-800">
                      {cursoSelecionado.area_tematica}
                    </Badge>
                    <Badge variant="outline" className="border-purple-300 text-purple-600">
                      {cursoSelecionado.modalidade}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-medium">{cursoSelecionado.rating || "4.5"}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{cursoSelecionado.descricao}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Instrutor</h4>
                      <p className="font-medium">{cursoSelecionado.Formadores}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Empresa Parceira</h4>
                      <p className="font-medium">{cursoSelecionado.empresaParceira || "Não informado"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Duração</h4>
                      <p>{cursoSelecionado.Carga_horaria} ({cursoSelecionado.horario})</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Vagas Disponíveis</h4>
                      <p>{cursoSelecionado.vagas - cursoSelecionado.inscritos} de {cursoSelecionado.vagas}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Data de Início</h4>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {formatDate(cursoSelecionado.dataInicio)}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Data de Término</h4>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {formatDate(cursoSelecionado.dataFim)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <Card className="border border-gray-200 rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">Resumo da Inscrição</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Curso</span>
                          <span className="font-medium">{cursoSelecionado.titulo}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Modalidade</span>
                          <span className="font-medium">{cursoSelecionado.modalidade}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Período</span>
                          <span className="font-medium text-right">
                            {formatDate(cursoSelecionado.dataInicio)} - {formatDate(cursoSelecionado.dataFim)}<br />
                            {cursoSelecionado.horario}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Local</span>
                          <span className="font-medium">{cursoSelecionado.local}</span>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <div className="flex justify-between font-bold text-lg">
                            <span>Vagas Disponíveis</span>
                            <span className="text-purple-600">{cursoSelecionado.vagas - cursoSelecionado.inscritos}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                        onClick={() => inscrever(cursoSelecionado.id)}
                      >
                        Inscrever-se Agora
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}