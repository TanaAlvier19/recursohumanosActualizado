// app/(dashboard)/diretor-rh/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricCard } from '@/components/metrcCard';
import {
  Users,
  DollarSign,
  TrendingUp,
  Target,
  BarChart3,
  Download,
  Eye,
  Calendar,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];

export default function DiretorRHDashboard() {
  const [activeTab, setActiveTab] = useState('estratégico');

  const strategicData = [
    { mes: 'Jan', headcount: 420, custo: 12500000, turnover: 5.2 },
    { mes: 'Fev', headcount: 435, custo: 12800000, turnover: 4.8 },
    { mes: 'Mar', headcount: 450, custo: 13200000, turnover: 6.1 },
    { mes: 'Abr', headcount: 445, custo: 13100000, turnover: 5.5 },
    { mes: 'Mai', headcount: 460, custo: 13500000, turnover: 4.9 },
    { mes: 'Jun', headcount: 456, custo: 13450000, turnover: 5.8 },
  ];

  const budgetData = [
    { categoria: 'Salários', utilizado: 12500000, orcamento: 15000000 },
    { categoria: 'Benefícios', utilizado: 2800000, orcamento: 3000000 },
    { categoria: 'Treinamento', utilizado: 450000, orcamento: 600000 },
    { categoria: 'Recrutamento', utilizado: 320000, orcamento: 500000 },
  ];

  const satisfactionData = [
    { departamento: 'TI', satisfacao: 88, engajamento: 82 },
    { departamento: 'Vendas', satisfacao: 76, engajamento: 71 },
    { departamento: 'Marketing', satisfacao: 82, engajamento: 78 },
    { departamento: 'Financeiro', satisfacao: 85, engajamento: 80 },
    { departamento: 'Operações', satisfacao: 79, engajamento: 75 },
  ];

  const metrics = {
    headcount: 456,
    custoTotal: 13450000,
    turnover: 5.8,
    satisfacao: 84,
    custoPorFuncionario: 29500,
    produtividade: 15,
    engajamento: 78,
    roiTreinamento: 142
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard do Diretor de RH</h1>
            <p className="text-slate-400">
              Visão estratégica e indicadores de negócio
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
              <BarChart3 className="w-4 h-4 mr-2" />
              Relatório Executivo
            </Button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Headcount"
            value={metrics.headcount.toString()}
            icon={Users}
            description="Funcionários ativos"
            trend={{ value: 2.1, isPositive: true }}
          />
          <MetricCard
            title="Custo Total RH"
            value={formatCurrency(metrics.custoTotal)}
            icon={DollarSign}
            description="Este mês"
            trend={{ value: 1.8, isPositive: false }}
          />
          <MetricCard
            title="Turnover"
            value={`${metrics.turnover}%`}
            icon={TrendingUp}
            description="Taxa mensal"
            trend={{ value: 0.3, isPositive: false }}
          />
          <MetricCard
            title="Satisfação"
            value={`${metrics.satisfacao}%`}
            icon={Target}
            description="NPS interno"
            trend={{ value: 2.5, isPositive: true }}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="estratégico" className="text-slate-300 data-[state=active]:bg-slate-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Estratégico
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="text-slate-300 data-[state=active]:bg-slate-700">
              <DollarSign className="w-4 h-4 mr-2" />
              Financeiro
            </TabsTrigger>
            <TabsTrigger value="pessoas" className="text-slate-300 data-[state=active]:bg-slate-700">
              <Users className="w-4 h-4 mr-2" />
              Pessoas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="estratégico" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Evolução Estratégica</CardTitle>
                  <CardDescription className="text-slate-400">
                    Headcount, custos e turnover
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={strategicData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="mes" stroke="#cbd5e1" />
                      <YAxis stroke="#cbd5e1" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          color: 'white',
                        }}
                        formatter={(value) => [typeof value === 'number' ? value.toLocaleString('pt-BR') : value, 'Valor']}
                      />
                      <Legend />
                      <Bar dataKey="headcount" name="Headcount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="custo" name="Custo (KZ mil)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="turnover" name="Turnover (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Indicadores de Eficiência</CardTitle>
                  <CardDescription className="text-slate-400">
                    Métricas de performance do RH
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300">Custo por Funcionário</span>
                        <span className="text-cyan-400 font-semibold">
                          {formatCurrency(metrics.custoPorFuncionario)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-cyan-500 h-2 rounded-full" 
                          style={{ width: '75%' }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300">ROI em Treinamento</span>
                        <span className="text-green-400 font-semibold">{metrics.roiTreinamento}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: '85%' }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300">Engajamento</span>
                        <span className="text-purple-400 font-semibold">{metrics.engajamento}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: '78%' }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300">Produtividade</span>
                        <span className="text-blue-400 font-semibold">+{metrics.produtividade}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: '60%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Orçamento vs Realizado</CardTitle>
                  <CardDescription className="text-slate-400">
                    Utilização do orçamento de RH
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={budgetData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="categoria" stroke="#cbd5e1" />
                      <YAxis stroke="#cbd5e1" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          color: 'white',
                        }}
                        formatter={(value) => [formatCurrency(Number(value)), 'Valor']}
                      />
                      <Legend />
                      <Bar dataKey="utilizado" name="Utilizado" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="orcamento" name="Orçamento" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Distribuição de Custos</CardTitle>
                  <CardDescription className="text-slate-400">
                    Composição dos gastos com pessoal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={budgetData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ categoria, utilizado }) => `${categoria}: ${formatCurrency(utilizado)}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="utilizado"
                      >
                        {budgetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          color: 'white',
                        }}
                        formatter={(value) => [formatCurrency(Number(value)), 'Valor']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pessoas" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Satisfação por Departamento</CardTitle>
                <CardDescription className="text-slate-400">
                  Níveis de satisfação e engajamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={satisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="departamento" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: 'white',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="satisfacao" name="Satisfação (%)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="engajamento" name="Engajamento (%)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Metas Estratégicas */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Metas Estratégicas 2024</CardTitle>
            <CardDescription className="text-slate-400">
              Objetivos de RH e progresso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { meta: 'Reduzir Turnover', atual: 5.8, target: 4.5, unidade: '%' },
                { meta: 'Aumentar Satisfação', atual: 84, target: 90, unidade: '%' },
                { meta: 'Otimizar Custo/Func', atual: 29500, target: 28000, unidade: 'KZ' },
                { meta: 'ROI Treinamento', atual: 142, target: 160, unidade: '%' }
              ].map((item, index) => {
                const progresso = (item.atual / item.target) * 100;
                return (
                  <Card key={index} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Award className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                        <h4 className="font-semibold text-white mb-2">{item.meta}</h4>
                        <div className="text-2xl font-bold text-cyan-400 mb-2">
                          {item.atual}{item.unidade}
                        </div>
                        <div className="text-sm text-slate-400 mb-2">
                          Meta: {item.target}{item.unidade}
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              progresso >= 100 ? 'bg-green-500' : 
                              progresso >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(progresso, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}