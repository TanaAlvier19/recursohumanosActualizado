"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Eye, Calendar, Users, Building2, Filter } from "lucide-react"

const relatoriosDisponiveis = [
  {
    id: 1,
    nome: "Espelho de Ponto - Janeiro 2024",
    tipo: "Espelho de Ponto",
    periodo: "Janeiro 2024",
    funcionarios: 320,
    geradoEm: "2024-02-01",
    formato: "PDF",
  },
  {
    id: 2,
    nome: "Relatório Consolidado - Janeiro 2024",
    tipo: "Consolidado",
    periodo: "Janeiro 2024",
    funcionarios: 320,
    geradoEm: "2024-02-01",
    formato: "Excel",
  },
  {
    id: 3,
    nome: "Relatório por Departamento - TI",
    tipo: "Por Departamento",
    periodo: "Janeiro 2024",
    funcionarios: 45,
    geradoEm: "2024-02-01",
    formato: "PDF",
  },
]

const espelhoPontoData = [
  {
    data: "2024-01-15",
    diaSemana: "Segunda",
    entrada: "08:00",
    saidaIntervalo: "12:00",
    retornoIntervalo: "13:00",
    saida: "17:00",
    totalHoras: "8h",
    status: "normal",
  },
  {
    data: "2024-01-16",
    diaSemana: "Terça",
    entrada: "08:15",
    saidaIntervalo: "12:00",
    retornoIntervalo: "13:00",
    saida: "17:15",
    totalHoras: "8h",
    status: "atraso",
  },
  {
    data: "2024-01-17",
    diaSemana: "Quarta",
    entrada: "08:00",
    saidaIntervalo: "12:00",
    retornoIntervalo: "13:00",
    saida: "18:00",
    totalHoras: "9h",
    status: "extra",
  },
  {
    data: "2024-01-18",
    diaSemana: "Quinta",
    entrada: "-",
    saidaIntervalo: "-",
    retornoIntervalo: "-",
    saida: "-",
    totalHoras: "0h",
    status: "falta",
  },
  {
    data: "2024-01-19",
    diaSemana: "Sexta",
    entrada: "08:00",
    saidaIntervalo: "12:00",
    retornoIntervalo: "13:00",
    saida: "17:00",
    totalHoras: "8h",
    status: "normal",
  },
]

export default function RelatoriosPage() {
  const [selectedFuncionario, setSelectedFuncionario] = useState("")
  const [selectedPeriodo, setSelectedPeriodo] = useState("")
  const [selectedDepartamento, setSelectedDepartamento] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
              Relatórios de Frequência
            </h1>
            <p className="mt-2 text-slate-400">Espelho de ponto, relatórios individuais e consolidados</p>
          </div>
        </div>

        <Tabs defaultValue="gerar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 lg:w-[600px]">
            <TabsTrigger value="gerar">Gerar Relatório</TabsTrigger>
            <TabsTrigger value="espelho">Espelho de Ponto</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          {/* Gerar Relatório */}
          <TabsContent value="gerar" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Relatório Individual */}
              <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <Users className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Relatório Individual</h3>
                <p className="mb-4 text-sm text-slate-400">Frequência detalhada de um funcionário específico</p>
                <div className="space-y-3">
                  <div>
                    <Label className="text-slate-400">Funcionário</Label>
                    <Select value={selectedFuncionario} onValueChange={setSelectedFuncionario}>
                      <SelectTrigger className="border-slate-700 bg-slate-900 text-white">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-700 bg-slate-800 text-white">
                        <SelectItem value="1">João Silva</SelectItem>
                        <SelectItem value="2">Maria Santos</SelectItem>
                        <SelectItem value="3">Pedro Costa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-400">Período</Label>
                    <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
                      <SelectTrigger className="border-slate-700 bg-slate-900 text-white">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-700 bg-slate-800 text-white">
                        <SelectItem value="jan">Janeiro 2024</SelectItem>
                        <SelectItem value="fev">Fevereiro 2024</SelectItem>
                        <SelectItem value="mar">Março 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700">
                    <FileText className="mr-2 h-4 w-4" />
                    Gerar Relatório
                  </Button>
                </div>
              </Card>

              {/* Relatório por Departamento */}
              <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                  <Building2 className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Relatório por Departamento</h3>
                <p className="mb-4 text-sm text-slate-400">Consolidado de frequência por departamento</p>
                <div className="space-y-3">
                  <div>
                    <Label className="text-slate-400">Departamento</Label>
                    <Select value={selectedDepartamento} onValueChange={setSelectedDepartamento}>
                      <SelectTrigger className="border-slate-700 bg-slate-900 text-white">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-700 bg-slate-800 text-white">
                        <SelectItem value="ti">TI</SelectItem>
                        <SelectItem value="rh">RH</SelectItem>
                        <SelectItem value="vendas">Vendas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-400">Período</Label>
                    <Select>
                      <SelectTrigger className="border-slate-700 bg-slate-900 text-white">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-700 bg-slate-800 text-white">
                        <SelectItem value="jan">Janeiro 2024</SelectItem>
                        <SelectItem value="fev">Fevereiro 2024</SelectItem>
                        <SelectItem value="mar">Março 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700">
                    <FileText className="mr-2 h-4 w-4" />
                    Gerar Relatório
                  </Button>
                </div>
              </Card>

              {/* Relatório Consolidado */}
              <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Relatório Consolidado</h3>
                <p className="mb-4 text-sm text-slate-400">Visão geral de toda a empresa</p>
                <div className="space-y-3">
                  <div>
                    <Label className="text-slate-400">Período</Label>
                    <Select>
                      <SelectTrigger className="border-slate-700 bg-slate-900 text-white">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-700 bg-slate-800 text-white">
                        <SelectItem value="jan">Janeiro 2024</SelectItem>
                        <SelectItem value="fev">Fevereiro 2024</SelectItem>
                        <SelectItem value="mar">Março 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-400">Formato</Label>
                    <Select>
                      <SelectTrigger className="border-slate-700 bg-slate-900 text-white">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-700 bg-slate-800 text-white">
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700">
                    <FileText className="mr-2 h-4 w-4" />
                    Gerar Relatório
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Espelho de Ponto */}
          <TabsContent value="espelho" className="space-y-6">
            <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Espelho de Ponto - João Silva</h3>
                  <p className="text-sm text-slate-400">Janeiro 2024 • Departamento: TI</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Exportar PDF
                  </Button>
                </div>
              </div>

              {/* Resumo */}
              <div className="mb-6 grid gap-4 md:grid-cols-4">
                <Card className="border-slate-700 bg-slate-800/30 p-4">
                  <p className="text-sm text-slate-400">Dias Trabalhados</p>
                  <p className="text-2xl font-bold text-white">20</p>
                </Card>
                <Card className="border-slate-700 bg-slate-800/30 p-4">
                  <p className="text-sm text-slate-400">Faltas</p>
                  <p className="text-2xl font-bold text-red-400">1</p>
                </Card>
                <Card className="border-slate-700 bg-slate-800/30 p-4">
                  <p className="text-sm text-slate-400">Atrasos</p>
                  <p className="text-2xl font-bold text-amber-400">2</p>
                </Card>
                <Card className="border-slate-700 bg-slate-800/30 p-4">
                  <p className="text-sm text-slate-400">Horas Extras</p>
                  <p className="text-2xl font-bold text-green-400">5h</p>
                </Card>
              </div>

              {/* Tabela de Marcações */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Data</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Dia</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Entrada</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Saída Intervalo</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Retorno</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Saída</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Total</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {espelhoPontoData.map((dia, idx) => (
                      <tr key={idx} className="border-b border-slate-700/50 transition-colors hover:bg-slate-700/30">
                        <td className="py-3 text-sm text-white">{new Date(dia.data).toLocaleDateString("pt-BR")}</td>
                        <td className="py-3 text-sm text-slate-300">{dia.diaSemana}</td>
                        <td className="py-3 text-sm text-slate-300">{dia.entrada}</td>
                        <td className="py-3 text-sm text-slate-300">{dia.saidaIntervalo}</td>
                        <td className="py-3 text-sm text-slate-300">{dia.retornoIntervalo}</td>
                        <td className="py-3 text-sm text-slate-300">{dia.saida}</td>
                        <td className="py-3 text-sm font-semibold text-white">{dia.totalHoras}</td>
                        <td className="py-3">
                          {dia.status === "normal" && <Badge className="bg-green-500/20 text-green-400">Normal</Badge>}
                          {dia.status === "atraso" && <Badge className="bg-amber-500/20 text-amber-400">Atraso</Badge>}
                          {dia.status === "extra" && <Badge className="bg-blue-500/20 text-blue-400">Extra</Badge>}
                          {dia.status === "falta" && <Badge className="bg-red-500/20 text-red-400">Falta</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Histórico */}
          <TabsContent value="historico">
            <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold text-white">Relatórios Gerados</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Nome do Relatório</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Tipo</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Período</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Funcionários</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Gerado em</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Formato</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatoriosDisponiveis.map((relatorio) => (
                      <tr
                        key={relatorio.id}
                        className="border-b border-slate-700/50 transition-colors hover:bg-slate-700/30"
                      >
                        <td className="py-4 text-sm font-medium text-white">{relatorio.nome}</td>
                        <td className="py-4">
                          <Badge className="bg-blue-500/20 text-blue-400">{relatorio.tipo}</Badge>
                        </td>
                        <td className="py-4 text-sm text-slate-300">{relatorio.periodo}</td>
                        <td className="py-4 text-sm text-slate-300">{relatorio.funcionarios}</td>
                        <td className="py-4 text-sm text-slate-300">
                          {new Date(relatorio.geradoEm).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-4">
                          <Badge className="bg-slate-600/50 text-slate-300">{relatorio.formato}</Badge>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-green-400 hover:bg-green-500/10 hover:text-green-300"
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Baixar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
