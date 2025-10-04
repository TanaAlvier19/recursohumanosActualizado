"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Timer, Plus, TrendingUp, TrendingDown, Clock, Search } from "lucide-react"

const saldosFuncionarios = [
  {
    id: 1,
    funcionario: "João Silva",
    departamento: "TI",
    saldo: 15.5,
    extras: 20,
    devidas: 4.5,
    compensadas: 8,
  },
  {
    id: 2,
    funcionario: "Maria Santos",
    departamento: "RH",
    saldo: -3.5,
    extras: 5,
    devidas: 8.5,
    compensadas: 2,
  },
  {
    id: 3,
    funcionario: "Pedro Costa",
    departamento: "Vendas",
    saldo: 8.0,
    extras: 12,
    devidas: 4,
    compensadas: 6,
  },
  {
    id: 4,
    funcionario: "Ana Oliveira",
    departamento: "Financeiro",
    saldo: 22.5,
    extras: 30,
    devidas: 7.5,
    compensadas: 15,
  },
  {
    id: 5,
    funcionario: "Carlos Mendes",
    departamento: "Operações",
    saldo: -5.0,
    extras: 3,
    devidas: 8,
    compensadas: 1,
  },
]

const historicoLancamentos = [
  {
    id: 1,
    funcionario: "João Silva",
    data: "2024-01-15",
    tipo: "extra",
    horas: 3.5,
    motivo: "Projeto urgente",
    status: "aprovado",
  },
  {
    id: 2,
    funcionario: "Maria Santos",
    data: "2024-01-16",
    tipo: "compensacao",
    horas: 2.0,
    motivo: "Compensação de horas devidas",
    status: "aprovado",
  },
  {
    id: 3,
    funcionario: "Pedro Costa",
    data: "2024-01-17",
    tipo: "extra",
    horas: 4.0,
    motivo: "Suporte fim de semana",
    status: "pendente",
  },
  {
    id: 4,
    funcionario: "Ana Oliveira",
    data: "2024-01-18",
    tipo: "devida",
    horas: 1.5,
    motivo: "Saída antecipada",
    status: "aprovado",
  },
]

export default function BancoHorasPage() {
  const [openLancamento, setOpenLancamento] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const totalExtras = saldosFuncionarios.reduce((acc, f) => acc + f.extras, 0)
  const totalDevidas = saldosFuncionarios.reduce((acc, f) => acc + f.devidas, 0)
  const totalCompensadas = saldosFuncionarios.reduce((acc, f) => acc + f.compensadas, 0)
  const saldoGeral = totalExtras - totalDevidas

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
              Banco de Horas
            </h1>
            <p className="mt-2 text-slate-400">Gestão de horas extras, devidas e compensações</p>
          </div>
          <Dialog open={openLancamento} onOpenChange={setOpenLancamento}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Novo Lançamento
              </Button>
            </DialogTrigger>
            <DialogContent className="border-slate-700 bg-slate-800 text-white">
              <DialogHeader>
                <DialogTitle>Novo Lançamento</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Registre horas extras, devidas ou compensações
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="funcionario">Funcionário</Label>
                  <Select>
                    <SelectTrigger className="border-slate-700 bg-slate-900 text-white">
                      <SelectValue placeholder="Selecione o funcionário" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-700 bg-slate-800 text-white">
                      <SelectItem value="1">João Silva</SelectItem>
                      <SelectItem value="2">Maria Santos</SelectItem>
                      <SelectItem value="3">Pedro Costa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo de Lançamento</Label>
                  <Select>
                    <SelectTrigger className="border-slate-700 bg-slate-900 text-white">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-700 bg-slate-800 text-white">
                      <SelectItem value="extra">Hora Extra</SelectItem>
                      <SelectItem value="devida">Hora Devida</SelectItem>
                      <SelectItem value="compensacao">Compensação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data">Data</Label>
                    <Input id="data" type="date" className="border-slate-700 bg-slate-900 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="horas">Horas</Label>
                    <Input
                      id="horas"
                      type="number"
                      step="0.5"
                      placeholder="0.0"
                      className="border-slate-700 bg-slate-900 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="motivo">Motivo</Label>
                  <Input
                    id="motivo"
                    placeholder="Descreva o motivo"
                    className="border-slate-700 bg-slate-900 text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                    onClick={() => setOpenLancamento(false)}
                  >
                    Registrar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                    onClick={() => setOpenLancamento(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Saldo Geral</p>
                <p className={`text-3xl font-bold ${saldoGeral >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {saldoGeral >= 0 ? "+" : ""}
                  {saldoGeral.toFixed(1)}h
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20">
                <Timer className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </Card>

          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Extras</p>
                <p className="text-3xl font-bold text-white">{totalExtras.toFixed(1)}h</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Devidas</p>
                <p className="text-3xl font-bold text-white">{totalDevidas.toFixed(1)}h</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20">
                <TrendingDown className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </Card>

          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Compensadas</p>
                <p className="text-3xl font-bold text-white">{totalCompensadas.toFixed(1)}h</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="saldos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 lg:w-[400px]">
            <TabsTrigger value="saldos">Saldos por Funcionário</TabsTrigger>
            <TabsTrigger value="historico">Histórico de Lançamentos</TabsTrigger>
          </TabsList>

          {/* Saldos por Funcionário */}
          <TabsContent value="saldos">
            <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Saldos Individuais</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Buscar funcionário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Funcionário</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Departamento</th>
                      <th className="pb-3 text-right text-sm font-medium text-slate-400">Horas Extras</th>
                      <th className="pb-3 text-right text-sm font-medium text-slate-400">Horas Devidas</th>
                      <th className="pb-3 text-right text-sm font-medium text-slate-400">Compensadas</th>
                      <th className="pb-3 text-right text-sm font-medium text-slate-400">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saldosFuncionarios.map((funcionario) => (
                      <tr
                        key={funcionario.id}
                        className="border-b border-slate-700/50 transition-colors hover:bg-slate-700/30"
                      >
                        <td className="py-4 text-sm font-medium text-white">{funcionario.funcionario}</td>
                        <td className="py-4 text-sm text-slate-300">{funcionario.departamento}</td>
                        <td className="py-4 text-right text-sm text-green-400">+{funcionario.extras.toFixed(1)}h</td>
                        <td className="py-4 text-right text-sm text-red-400">-{funcionario.devidas.toFixed(1)}h</td>
                        <td className="py-4 text-right text-sm text-blue-400">{funcionario.compensadas.toFixed(1)}h</td>
                        <td className="py-4 text-right">
                          <Badge
                            className={
                              funcionario.saldo >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            }
                          >
                            {funcionario.saldo >= 0 ? "+" : ""}
                            {funcionario.saldo.toFixed(1)}h
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Histórico de Lançamentos */}
          <TabsContent value="historico">
            <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold text-white">Lançamentos Recentes</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Data</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Funcionário</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Tipo</th>
                      <th className="pb-3 text-right text-sm font-medium text-slate-400">Horas</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Motivo</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicoLancamentos.map((lancamento) => (
                      <tr
                        key={lancamento.id}
                        className="border-b border-slate-700/50 transition-colors hover:bg-slate-700/30"
                      >
                        <td className="py-4 text-sm text-slate-300">
                          {new Date(lancamento.data).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-4 text-sm font-medium text-white">{lancamento.funcionario}</td>
                        <td className="py-4">
                          {lancamento.tipo === "extra" && (
                            <Badge className="bg-green-500/20 text-green-400">Hora Extra</Badge>
                          )}
                          {lancamento.tipo === "devida" && (
                            <Badge className="bg-red-500/20 text-red-400">Hora Devida</Badge>
                          )}
                          {lancamento.tipo === "compensacao" && (
                            <Badge className="bg-blue-500/20 text-blue-400">Compensação</Badge>
                          )}
                        </td>
                        <td className="py-4 text-right text-sm font-semibold text-white">
                          {lancamento.tipo === "extra" ? "+" : lancamento.tipo === "devida" ? "-" : ""}
                          {lancamento.horas.toFixed(1)}h
                        </td>
                        <td className="py-4 text-sm text-slate-300">{lancamento.motivo}</td>
                        <td className="py-4">
                          {lancamento.status === "aprovado" ? (
                            <Badge className="bg-green-500/20 text-green-400">Aprovado</Badge>
                          ) : (
                            <Badge className="bg-amber-500/20 text-amber-400">Pendente</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Resumo por Departamento */}
        <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-lg font-semibold text-white">Resumo por Departamento</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {["TI", "RH", "Vendas", "Financeiro", "Operações"].map((dept) => {
              const funcionariosDept = saldosFuncionarios.filter((f) => f.departamento === dept)
              const saldoDept = funcionariosDept.reduce((acc, f) => acc + f.saldo, 0)
              const extrasDept = funcionariosDept.reduce((acc, f) => acc + f.extras, 0)

              return (
                <Card key={dept} className="border-slate-700 bg-slate-800/30 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold text-white">{dept}</h4>
                    <Badge className={saldoDept >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                      {saldoDept >= 0 ? "+" : ""}
                      {saldoDept.toFixed(1)}h
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Funcionários</span>
                      <span className="text-white">{funcionariosDept.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Extras</span>
                      <span className="text-green-400">+{extrasDept.toFixed(1)}h</span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
