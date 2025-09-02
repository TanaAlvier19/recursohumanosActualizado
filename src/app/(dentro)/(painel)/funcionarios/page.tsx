'use client';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/metrcCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { CalendarDays, DollarSign, FileText, RefreshCw, Smile, UserCheck, GraduationCap,Info,Gift } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

type Dispensa = {
  id: number;
  motivo: string;
  inicio: string;
  fim: string;
  status: "pendente" | "aprovado" | "rejeitado";
  created_at: string;
};

type Pagamento = {
  id: string;
  mes_referencia: string;
  salario_liquido: number;
  status: 'pago' | 'pendente' | 'atrasado';
};

const FuncionarioDashboard = () => {
  const { accessToken, userName, userLoading } = useContext(AuthContext);
  const router = useRouter();
  const [dispensas, setDispensas] = useState<Dispensa[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [totalDispensas, setTotalDispensas] = useState(0);
  const [aprovadas, setAprovadas] = useState(0);
  const [reprovadas, setReprovadas] = useState(0);
  const [pendentes, setPendentes] = useState(0);
  const [loading, setLoading] = useState(true);
  


  useEffect(() => {
    const fetchDispensas = async () => {
      try {
        const res = await fetch('https://backend-django-2-7qpl.onrender.com/api/dispensa/my/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        if (res.ok) {
          const data = await res.json();
          setDispensas(data);
          setTotalDispensas(data.length);
          setAprovadas(data.filter((d: Dispensa) => d.status === "aprovado").length);
          setReprovadas(data.filter((d: Dispensa) => d.status === "rejeitado").length);
          setPendentes(data.filter((d: Dispensa) => d.status === "pendente").length);
        }
      } catch (err) {
        console.error("Erro ao buscar dispensas:", err);
      }
    };

    if (accessToken) fetchDispensas();
  }, [accessToken]);

  useEffect(() => {
    const fetchPagamentos = async () => {
      try {
        const res = await fetch('https://backend-django-2-7qpl.onrender.com/api/pagamentos/funcionario/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        if (res.ok) {
          const data = await res.json();
          setPagamentos(data.slice(0, 3)); 
        }
      } catch (err) {
        console.error("Erro ao buscar pagamentos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) fetchPagamentos();
  }, [accessToken]);

  const doughnutData = {
    labels: ['Aprovadas', 'Rejeitadas', 'Pendentes'],
    datasets: [{
      data: [aprovadas, reprovadas, pendentes],
      backgroundColor: ['#22c55e', '#ef4444', '#facc15'],
      borderWidth: 1,
    }],
  };

  const hoje = new Date();
  const hora = hoje.getHours();
  const cumprimento = hora < 12 ? 'Bom Dia' : hora < 18 ? 'Boa Tarde' : 'Boa Noite';

  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 p-6 space-y-8"
    >
      <div className="flex justify-between items-center">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
        ) : (
          <>
            <div>
              <h1 className="font-extrabold text-purple-500 text-2xl">{cumprimento}, {userName}</h1>
              <p className="text-gray-600">Aqui está o resumo das suas informações</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/dispensas")}>
              <FileText className="mr-2 h-4 w-4" />
              Solicitar Dispensa
            </Button>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : (
          <>
            <MetricCard 
              title="Total de Dispensas" 
              value={totalDispensas} 
              icon={RefreshCw}
            />
            <MetricCard 
              title="Aprovadas" 
              value={aprovadas} 
              icon={UserCheck}
              color="bg-green-500"
            />
            <MetricCard 
              title="Rejeitadas" 
              value={reprovadas} 
              icon={FileText}
              color="bg-red-500"
            />
            <MetricCard 
              title="Pendentes" 
              value={pendentes} 
              icon={RefreshCw}
              color="bg-yellow-500"
            />
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              {loading ? (
                <Skeleton className="h-6 w-64" />
              ) : (
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-purple-500" />
                  Status das Minhas Dispensas
                </CardTitle>
              )}
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-80 w-full rounded-md" />
              ) : (
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-1/2">
                    <Doughnut data={doughnutData} />
                  </div>
                  
                  <div className="w-full md:w-1/2 space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Solicitações Aprovadas</p>
                        <p className="text-sm text-gray-600">Últimos 6 meses</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{aprovadas}</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Solicitações Pendentes</p>
                        <p className="text-sm text-gray-600">Aguardando aprovação</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">{pendentes}</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Solicitações Rejeitadas</p>
                        <p className="text-sm text-gray-600">Com justificativa</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800">{reprovadas}</Badge>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => router.push("/dispensas/historico")}
                    >
                      Ver Histórico Completo
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="flex justify-between items-center py-3">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Pagamentos Recentes</h3>
                    <Badge variant="outline" className="px-3 py-1">
                      Últimos 3 meses
                    </Badge>
                  </div>
                  <div className="overflow-x-auto">
                    {pagamentos.length > 0 ? (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left text-sm text-gray-600">
                            <th className="pb-3 font-medium">Mês</th>
                            <th className="pb-3 font-medium">Valor Líquido</th>
                            <th className="pb-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagamentos.map((pag, index) => (
                            <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                              <td className="py-3 text-sm font-medium">{pag.mes_referencia}</td>
                              <td className="py-3 text-sm font-medium">
                                Kz {pag.salario_liquido.toLocaleString('pt-BR')}
                              </td>
                              <td className="py-3">
                                <Badge 
                                  variant={
                                    pag.status === 'pago' ? 'default' :
                                    pag.status === 'pendente' ? 'secondary' : 'destructive'
                                  }
                                >
                                  {pag.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4">Nenhum pagamento registrado</p>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4"
                    onClick={() => router.push("/pagamentos/historico")}
                  >
                    Ver Histórico Completo
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* <Card>
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="border-l-4 border-gray-300 pl-3 py-1">
                        <Skeleton className="h-4 w-40 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDays className="h-5 w-5 text-purple-500" />
                    <h3 className="text-lg font-semibold">Próximos Eventos</h3>
                  </div>
                  <div className="space-y-4">
                    {eventos.map((evento, index) => (
                      <div key={index} className="border-l-4 border-purple-500 pl-3 py-1">
                        <p className="font-medium">{evento.titulo}</p>
                        <p className="text-sm text-gray-600">{evento.data}</p>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4"
                    onClick={() => router.push("/eventos")}
                  >
                    Ver Todos os Eventos
                  </Button>
                </>
              )}
            </CardContent>
          </Card> */}
          
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-4">
                    {Array(2).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Smile className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold">Meu Desempenho</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                      <div className="bg-green-500 w-10 h-10 rounded-lg flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Presenças</p>
                        <p className="text-xl font-bold">95%</p>
                        <p className="text-xs text-gray-600">Média mensal</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                      <div className="bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Tarefas Concluídas</p>
                        <p className="text-xl font-bold">87%</p>
                        <p className="text-xs text-gray-600">Último trimestre</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4"
                    onClick={() => router.push("/desempenho")}
                  >
                    Ver Detalhes
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Ações Rápidas</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="flex flex-col h-20"
                  onClick={() => router.push("/dispensas/solicitar")}
                >
                  <FileText className="h-5 w-5 mb-1" />
                  <span>Solicitar Dispensa</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex flex-col h-20"
                  onClick={() => router.push("/holerites")}
                >
                  <DollarSign className="h-5 w-5 mb-1" />
                  <span>Ver Holerites</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex flex-col h-20"
                  onClick={() => router.push("/beneficios")}
                >
                  <Gift className="h-5 w-5 mb-1" />
                  <span>Benefícios</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex flex-col h-20"
                  onClick={() => router.push("/treinamentos")}
                >
                  <GraduationCap className="h-5 w-5 mb-1" />
                  <span>Treinamentos</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default FuncionarioDashboard;