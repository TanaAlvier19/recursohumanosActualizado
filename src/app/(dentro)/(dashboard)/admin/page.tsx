'use client';
import dynamic from "next/dynamic";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { buscarDados } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton";
import {motion} from "framer-motion"
import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/metrcCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  UserCheck, 
  FileBadge, 
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  FileText,
  Banknote,CalendarCheck,UserPlus,
  Info,
  Users,
  Gift,
  Briefcase,
  Settings,
  LogOut,
  BarChart4,
  LayoutDashboard,
  Plus,
  FileInputIcon,
  DollarSign,
  RefreshCw,
  Building,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { date } from "zod";
import React from "react";
import { Smile, UserCog, TrendingUp, CalendarDays } from "lucide-react";

type DataItem = {
  departamento: string;
  presencas: number;
};
const rhData = [
  { name: '1° Tri', hiring: 45, turnover: 9.2, payroll: 1280000 },
  { name: '2° Tri', hiring: 32, turnover: 7.1, payroll: 1320000 },
  { name: '3° Tri', hiring: 28, turnover: 6.5, payroll: 1350000 },
  { name: '4° Tri', hiring: 51, turnover: 5.8, payroll: 1420000 }
];
type Pagamento = {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  salario_bruto: number;
  descontos: number;
  salario_liquido: number;
  mes_referenca: string;
  status: 'pago' | 'pendente' | 'atrasado';
};
const indicadoresRH = [
  {
    titulo: "Turnover",
    valor: "7.1%",
    descricao: "Taxa de rotatividade no último trimestre",
    cor: "bg-amber-500",
    icone: <RefreshCw className="h-5 w-5 text-white" />,
  },
  {
    titulo: "Satisfação",
    valor: "84%",
    descricao: "Índice de satisfação dos colaboradores",
    cor: "bg-emerald-500",
    icone: <Smile className="h-5 w-5 text-white" />,
  },
  {
    titulo: "Treinamentos",
    valor: "62%",
    descricao: "Colaboradores treinados este ano",
    cor: "bg-indigo-500",
    icone: <GraduationCap className="h-5 w-5 text-white" />,
  },
];

const AdminDashboard = () => {
  const { accessToken, userName, userLoading } = useContext(AuthContext);
  const router = useRouter();
  const [nome, setnome]=useState('')
  const [funcionarios, setFuncionarios] = useState(0);
  const [totalDispensas, setTotalDispensas] = useState(0);
  const [totalPresencas, setTotalPresencas] = useState(0);
  const [departamentos, setDepartamentos] = useState(0);
  const [Formando, setFormando] = useState(0);
  const [Pagamento, setPagamento] = useState<Pagamento[]>([]);
  const [Candidatura,setCandidatura]=useState(0)
  const [folha,setfolha]=useState(0)
  const [carregar,setcarregar]=useState(true)
  const [DispensasAprovadas, setDispensasAprovadas]=useState(0)
  // const chartData = departamentos.map(dept => ({
  //   name: dept.nome,
  //   funcionarios: dept.funcionarios,
  //   orcamento: dept.orcamento / 1000, 
  // }))
  // }))
  useEffect(() => {
    const carregar=async()=>{
      
      const res= await buscarDados()
      if(res){
        setnome(res.user.nomeRep)
        console.log(res.user.nomeRep)

      }
    }
    carregar()
    
  }, []);
 useEffect(() => {
    const fetchData = async () => {
      try {
        const res= await fetch("http://localhost:8000/pagamentos/",
          {
            credentials:"include"
          }
        );
        
        if(res.ok){
          const data = await res.json();
          setPagamento(Array.isArray(data) ? data : [data]);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
   const dadosAdmin=async()=>{
  try{
    const res=await fetch("http://localhost:8000/painel/",{
    credentials:"include"
  })
    const data=await res.json()
  if(res.ok){
    console.log("Dados",data)
    setFuncionarios(data.funcionarios)
     setDepartamentos(data.departamento)
    // setTotalDispensas(data.Dispensas)
    setCandidatura(data.Candidatura)
    // setTotalPresencas(data.Presentes)
    // setFormando(data.Formando)
    setfolha(data.folha)
    setcarregar(false)
    // setDispensasAprovadas(data.aprovadas)
  }
  }
  catch(err){
    alert("erro")
  }
}

    dadosAdmin();
  }, []);

const hoje= new Date()
const hora=hoje.getHours();
const cumprimento=`${(hora<12 && 'Bom Dia')||(hora<17 && 'Boa tarde')|| 'Boa Noite'}`
  

  return (
    <div 
    
    className=" bg-gray-50 p-6 space-y-8">
      <div className="flex justify-between items-center ">
        {carregar ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
        ) : (
          <>
            <h1 className="font-extrabold text-purple-500 text-2xl">{cumprimento}, {nome}</h1>
            <p className="text-gray-600">Aqui está o resumo das operações de RH</p>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {carregar ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : (
          <>
            <MetricCard 
              title="Funcionários Cadastrados" 
              value={funcionarios} 
              icon={Users}
            />
            <MetricCard 
              title="Departamentos" 
              value={departamentos} 
              icon={Building}
              color="bg-amber-500"
            />
            <MetricCard 
              title="Folha de Pagamento" 
              value={`Kz ${folha.toLocaleString()}`} 
              icon={DollarSign}
              description="Total mensal"
              color="bg-emerald-500"
            />
            <MetricCard 
              title="Candidaturas" 
              value={Candidatura} 
              icon={FileText}
              description="Em processo seletivo"
              color="bg-indigo-500"
            />
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              {carregar ? (
                <Skeleton className="h-6 w-64" />
              ) : (
                <CardTitle className="flex items-center gap-2">
                  <BarChart4 className="h-5 w-5 text-purple-500" />
                  Indicadores de RH
                </CardTitle>
              )}
            </CardHeader>
            <CardContent>
              {carregar ? (
                <Skeleton className="h-80 w-full rounded-md" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rhData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="turnover" name="Turnover (%)" fill="#f59e0b" />
                    <Bar yAxisId="right" dataKey="satisfacao" name="Satisfação (%)" fill="#10b981" />
                    <Bar yAxisId="right" dataKey="treinamento" name="Treinamentos (%)" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              {carregar ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-3">
                    {Array(5).fill(0).map((_, i) => (
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
                      Último mês
                    </Badge>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left text-sm text-gray-600">
                          <th className="pb-3 font-medium">Funcionário</th>
                          <th className="pb-3 font-medium">Cargo</th>
                          <th className="pb-3 font-medium">Valor Líquido</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Pagamento.map((pag, index) => (
                          <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                            <td className="py-3 text-sm font-medium">{pag.nome}</td>
                            <td className="py-3 text-sm text-gray-600">{pag.cargo}</td>
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
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              {carregar ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
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
                    <UserCog className="h-5 w-5 text-purple-500" />
                    <h3 className="text-lg font-semibold">Indicadores de RH</h3>
                  </div>
                  <div className="space-y-4">
                    {indicadoresRH.map((indicador, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`${indicador.cor} w-10 h-10 rounded-lg flex items-center justify-center`}>
                          {indicador.icone}
                        </div>
                        <div>
                          <p className="font-medium">{indicador.titulo}</p>
                          <p className="text-xl font-bold">{indicador.valor}</p>
                          <p className="text-xs text-gray-600">{indicador.descricao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              {carregar ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-6 w-12" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold">Tendências de RH</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Contratações</p>
                        <p className="text-sm text-gray-600">Último trimestre</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">+12%</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium">Retenção</p>
                        <p className="text-sm text-gray-600">Taxa de permanência</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">91.5%</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <div>
                        <p className="font-medium">Diversidade</p>
                        <p className="text-sm text-gray-600">Equidade de gênero</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">45/55</Badge>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              {carregar ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="pl-3 py-1">
                        <Skeleton className="h-4 w-40 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDays className="h-5 w-5 text-red-500" />
                    <h3 className="text-lg font-semibold">Próximos Eventos</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-500 pl-3 py-1">
                      <p className="font-medium">Treinamento de Liderança</p>
                      <p className="text-sm text-gray-600">15 Nov • 09:00 - 12:00</p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-3 py-1">
                      <p className="font-medium">Avaliação de Desempenho</p>
                      <p className="text-sm text-gray-600">20-30 Nov</p>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 pl-3 py-1">
                      <p className="font-medium">Evento de Integração</p>
                      <p className="text-sm text-gray-600">5 Dez • 14:00 - 18:00</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;