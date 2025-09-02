'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Swal from "sweetalert2"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { DollarSign, Users, Banknote, Calendar, CheckCircle, AlertCircle, FileText, Clock, Download, Send, Plus, X } from "lucide-react"
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

// Tipos de dados
type RelatorioMensal = {
  funcionarios_pagos: number;
  impostos_pagos: number;
};

type Pagamento = {
  id: string;
  nome: string;
  salario_bruto: number;
  salario_liquido: number;
  mes_referencia: string;
  status: 'pago' | 'pendente' | 'atrasado';
};

const FolhaPagamento = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [abrirIRT, setAbrirIRT] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resumo, setResumo] = useState({
    total_folha: 0,
    funcionarios: 0,
    media_salarial: 0,
    proximo_pagamento: ''
  });
  const [historico, setHistorico] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    mes_referencia: '',
    nome: '',
    salario_bruto: ''
  });
  const [relatorioMensal, setRelatorioMensal] = useState<RelatorioMensal>({
    funcionarios_pagos: 0,
    impostos_pagos: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Pagamentos
      const pagamentosRes = await fetch("http://localhost:8000/pagamentos/", { credentials: "include" });
      const pagamentosData = await pagamentosRes.json();
      setPagamentos(Array.isArray(pagamentosData) ? pagamentosData : []);
      
      // Resumo
      const resumoRes = await fetch("http://localhost:8000/resumo-folha/", { credentials: "include" });
      const resumoData = await resumoRes.json();
      setResumo(resumoData);
      
      // Histórico
      const historicoRes = await fetch("http://localhost:8000/historico-folha/", { credentials: "include" });
      const historicoData = await historicoRes.json();
      setHistorico(historicoData);
      
      // Relatório Mensal
      const relatorioRes = await fetch("http://localhost:8000/relatorio-mensal/", { 
        credentials: "include" 
      });
      const relatorioData = await relatorioRes.json();
      setRelatorioMensal(relatorioData);
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const processarSalario = async () => {
    try {
      const mesReferenciaFormatado = `${formData.mes_referencia}-01`;
      const res = await fetch("http://localhost:8000/pagamentos/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          mes_referencia: mesReferenciaFormatado,
          salario_bruto: parseFloat(formData.salario_bruto)
        })
      });

      if (res.ok) {
        Swal.fire({
          title: "Sucesso!",
          text: "Salário processado com sucesso",
          icon: "success",
          confirmButtonColor: "#4f46e5"
        });
        setAbrirIRT(false);
        fetchData();
        setFormData({ mes_referencia: '', nome: '', salario_bruto: '' });
      } else {
        const error = await res.json();
        throw new Error(error.detail || "Erro ao processar");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Erro!",
        text: error.message || "Falha no processamento",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Dados para gráfico
  const chartData = historico.map(item => ({
    mes: item.mes.split('-')[1] + '/' + item.mes.split('-')[0].slice(2),
    folha: item.folha,
    impostos: item.impostos
  }));

  // Função para gerar o PDF
  const gerarPDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const margin = 20;
    let yPos = margin + 20;

    // Título do relatório
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório de Folha de Pagamento', margin, yPos);
    yPos += 40;

    // Data de emissão
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Emitido em: ${new Date().toLocaleDateString('pt-AO')}`, margin, yPos);
    yPos += 30;

    // Seção de resumo
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Financeiro', margin, yPos);
    yPos += 30;

    // ...Tabela de resumo
    autoTable(doc, {
      startY: yPos,
      head: [['Total Folha', 'Funcionários', 'Média Salarial', 'Próximo Pagamento']],
      body: [
        [
          `KZ ${resumo.total_folha.toLocaleString('pt-AO')}`, 
          resumo.funcionarios.toString(),
          `KZ ${resumo.media_salarial.toLocaleString('pt-AO')}`,
          resumo.proximo_pagamento
        ]
      ],
      theme: 'grid',
      styles: { fontSize: 12, cellPadding: 5, halign: 'center' },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
    });
    yPos = (doc as any).lastAutoTable.finalY + 20;

    // .Seção de pagamentos
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhes de Pagamentos', margin, yPos);
    yPos += 30;

    // Tabela de pagamentos
    const pagamentosData = pagamentos.map(p => [
      p.nome,
      `KZ ${p.salario_bruto.toLocaleString('pt-AO')}`,
      `KZ ${p.salario_liquido.toLocaleString('pt-AO')}`,
      p.status.charAt(0).toUpperCase() + p.status.slice(1),
      p.mes_referencia
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Colaborador', 'Bruto', 'Líquido', 'Status', 'Mês Referência']],
      body: pagamentosData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 70 },
        2: { cellWidth: 70 },
        3: { cellWidth: 50 },
        4: { cellWidth: 70 }
      },
    });
    yPos = (doc as any).lastAutoTable.finalY + 20;

    // Seção de relatório mensal
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Mensal', margin, yPos);
    yPos += 30;

    // Tabela de relatório
    autoTable(doc, {
      startY: yPos,
      head: [['Funcionários Pagos', 'Impostos Pagos']],
      body: [
        [
          relatorioMensal.funcionarios_pagos.toString(),
          `KZ ${relatorioMensal.impostos_pagos.toLocaleString('pt-AO')}`
        ]
      ],
      theme: 'grid',
      styles: { fontSize: 12, cellPadding: 5, halign: 'center' },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
    });
    yPos = (doc as any).lastAutoTable.finalY + 20;

    // Seção de histórico
    if (historico.length > 0) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Histórico Financeiro (Últimos 6 Meses)', margin, yPos);
      yPos += 30;

      // Tabela de histórico
      const historicoData = historico.map(h => [
        h.mes,
        `KZ ${h.folha.toLocaleString('pt-AO')}`,
        `KZ ${h.impostos.toLocaleString('pt-AO')}`
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Mês', 'Folha de Pagamento', 'Impostos']],
        body: historicoData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
      });
      yPos = (doc as any).lastAutoTable.finalY + 20;
    }

    // Gráfico (placeholder - na prática use html-to-image para capturar o gráfico real)
    if (chartData.length > 0) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Evolução da Folha de Pagamento', margin, yPos);
      yPos += 30;

      // Placeholder para o gráfico
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos, 550, 200, 'F');
      doc.setTextColor(100, 100, 100);
      doc.text('Gráfico Histórico de Folha e Impostos', margin + 200, yPos + 100);
      yPos += 220;
    }

    // Rodapé
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() - margin - 50,
        doc.internal.pageSize.getHeight() - margin
      );
    }

    // Salvar PDF
    doc.save('relatorio-folha-pagamento.pdf');
  };

  if (loading) {
    return (
      <div className="bg-gray-50 p-6 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-44" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-full mt-2" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-extrabold text-purple-500 text-2xl">Folha de Pagamento</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={gerarPDF}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Enviar para Aprovação
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Folha</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KZ {resumo.total_folha.toLocaleString('pt-AO')}</div>
            <p className="text-xs text-muted-foreground">+3.2% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumo.funcionarios}</div>
            <p className="text-xs text-muted-foreground">+5 novos este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Média Salarial</CardTitle>
            <Banknote className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KZ {resumo.media_salarial.toLocaleString('pt-AO')}</div>
            <p className="text-xs text-muted-foreground">Acima do mercado (+12%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Próximo Pagamento</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumo.proximo_pagamento}</div>
            <p className="text-xs text-muted-foreground">3 dias restantes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Folha</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {historico.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`KZ ${value.toLocaleString('pt-AO')}`, 'Valor']}
                      labelFormatter={(value) => `Mês: ${value}`}
                    />
                    <Legend />
                    <Bar dataKey="folha" name="Folha (KZ)" fill="#8884d8" />
                    <Bar dataKey="impostos" name="Impostos (KZ)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Nenhum dado histórico disponível
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimos Pagamentos</CardTitle>
              <CardDescription>Processados este mês</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Bruto</TableHead>
                    <TableHead>Líquido</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentos.length > 0 ? pagamentos.map((pagamento) => (
                    <TableRow key={pagamento.id}>
                      <TableCell className="font-medium">{pagamento.nome}</TableCell>
                      <TableCell>KZ {pagamento.salario_bruto.toLocaleString('pt-AO')}</TableCell>
                      <TableCell>KZ {pagamento.salario_liquido.toLocaleString('pt-AO')}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            pagamento.status === 'pago' ? 'default' :
                            pagamento.status === 'pendente' ? 'secondary' : 'destructive'
                          }
                        >
                          {pagamento.status === 'pago' ? 'Pago' : 
                           pagamento.status === 'pendente' ? 'Pendente' : 'Atrasado'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        Nenhum pagamento registado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => setAbrirIRT(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Processar Salário
              </Button>
              <Link href={"/list/pagamento/desconto"}>
                <Button variant="outline" className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Descontos de imposto
                </Button>
              </Link>
              
              <Button variant="outline" className="justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Registrar Hora Extra
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status do Processamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                <div>
                  <p className="font-medium">Cálculos Concluídos</p>
                  <p className="text-sm text-muted-foreground">Todos os proventos e descontos</p>
                </div>
              </div>
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                <div>
                  <p className="font-medium">Aprovação Pendente</p>
                  <p className="text-sm text-muted-foreground">Aguardando RH</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Relatório Mensal */}
          <Card>
            <CardHeader>
              <CardTitle>Relatório do Mês</CardTitle>
              <CardDescription>Total de funcionários pagos e impostos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-green-500" />
                <div>
                  <p className="font-medium">Funcionários Pagos</p>
                  <p className="text-xl font-bold">{relatorioMensal.funcionarios_pagos}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Banknote className="mr-2 h-4 w-4 text-blue-500" />
                <div>
                  <p className="font-medium">Impostos Pagos</p>
                  <p className="text-xl font-bold">
                    KZ {relatorioMensal.impostos_pagos.toLocaleString('pt-AO')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Processamento */}
      {abrirIRT && (
        <div className='fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4'>
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Processar Salário</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setAbrirIRT(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Preencha os dados do funcionário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome Completo</label>
                <Input 
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome do funcionário"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mês Referência</label>
                <Input 
                  name="mes_referencia"
                  type="month"
                  value={formData.mes_referencia}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salário Bruto (KZ)</label>
                <Input 
                  name="salario_bruto"
                  type="number"
                  value={formData.salario_bruto}
                  onChange={handleChange}
                  placeholder="Valor em Kwanza"
                />
              </div>
              <Button 
                className="w-full mt-4"
                onClick={processarSalario}
                disabled={!formData.nome || !formData.mes_referencia || !formData.salario_bruto}
              >
                Processar Salário
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FolhaPagamento;