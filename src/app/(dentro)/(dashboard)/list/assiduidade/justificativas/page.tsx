"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { FileText, Plus, CheckCircle2, XCircle, Clock, Upload, Download, Eye } from "lucide-react"

const justificativasPendentes = [
  {
    id: 1,
    funcionario: "João Silva",
    departamento: "TI",
    tipo: "Falta",
    data: "2024-01-15",
    motivo: "Consulta médica",
    documento: "atestado-medico.pdf",
    status: "pendente",
  },
  {
    id: 2,
    funcionario: "Maria Santos",
    departamento: "RH",
    tipo: "Atraso",
    data: "2024-01-16",
    motivo: "Problema de transporte",
    documento: null,
    status: "pendente",
  },
  {
    id: 3,
    funcionario: "Pedro Costa",
    departamento: "Vendas",
    tipo: "Falta",
    data: "2024-01-17",
    motivo: "Emergência familiar",
    documento: "declaracao.pdf",
    status: "pendente",
  },
]

const justificativasAprovadas = [
  {
    id: 4,
    funcionario: "Ana Oliveira",
    departamento: "Financeiro",
    tipo: "Falta",
    data: "2024-01-10",
    motivo: "Atestado médico",
    documento: "atestado.pdf",
    status: "aprovada",
    aprovadoPor: "Carlos Mendes",
    dataAprovacao: "2024-01-11",
  },
  {
    id: 5,
    funcionario: "Carlos Mendes",
    departamento: "Operações",
    tipo: "Atraso",
    data: "2024-01-12",
    motivo: "Trânsito intenso",
    documento: null,
    status: "aprovada",
    aprovadoPor: "Ana Oliveira",
    dataAprovacao: "2024-01-12",
  },
]

const justificativasRejeitadas = [
  {
    id: 6,
    funcionario: "Beatriz Lima",
    departamento: "Marketing",
    tipo: "Falta",
    data: "2024-01-08",
    motivo: "Motivo pessoal",
    documento: null,
    status: "rejeitada",
    rejeitadoPor: "Carlos Mendes",
    dataRejeicao: "2024-01-09",
    motivoRejeicao: "Falta de documentação comprobatória",
  },
]

export default function JustificativasPage() {
  const [openNova, setOpenNova] = useState(false)
  const [openDetalhes, setOpenDetalhes] = useState(false)
  const [selectedJustificativa, setSelectedJustificativa] = useState<any>(null)

  const handleAprovar = (id: number) => {
    console.log("[v0] Aprovando justificativa:", id)
  }

  const handleRejeitar = (id: number) => {
    console.log("[v0] Rejeitando justificativa:", id)
  }

  const handleVerDetalhes = (justificativa: any) => {
    setSelectedJustificativa(justificativa)
    setOpenDetalhes(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
              Justificativas e Abonos
            </h1>
            <p className="mt-2 text-slate-400">Sistema de justificativas de faltas e atrasos</p>
          </div>
          <Dialog open={openNova} onOpenChange={setOpenNova}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Nova Justificativa
              </Button>
            </DialogTrigger>
            <DialogContent className="border-slate-700 bg-slate-800 text-white">
              <DialogHeader>
                <DialogTitle>Nova Justificativa</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Registre uma justificativa de falta ou atraso
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
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select>
                    <SelectTrigger className="border-slate-700 bg-slate-900 text-white">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-700 bg-slate-800 text-white">
                      <SelectItem value="falta">Falta</SelectItem>
                      <SelectItem value="atraso">Atraso</SelectItem>
                      <SelectItem value="saida-antecipada">Saída Antecipada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="data">Data</Label>
                  <Input id="data" type="date" className="border-slate-700 bg-slate-900 text-white" />
                </div>
                <div>
                  <Label htmlFor="motivo">Motivo</Label>
                  <Textarea
                    id="motivo"
                    placeholder="Descreva o motivo da falta ou atraso"
                    className="border-slate-700 bg-slate-900 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="documento">Documento Comprobatório</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Anexar Documento
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">PDF, JPG ou PNG até 5MB</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                    onClick={() => setOpenNova(false)}
                  >
                    Enviar Justificativa
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                    onClick={() => setOpenNova(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pendentes</p>
                <p className="text-3xl font-bold text-white">{justificativasPendentes.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
                <Clock className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </Card>

          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Aprovadas</p>
                <p className="text-3xl font-bold text-white">{justificativasAprovadas.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                <CheckCircle2 className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Rejeitadas</p>
                <p className="text-3xl font-bold text-white">{justificativasRejeitadas.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </Card>

          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total do Mês</p>
                <p className="text-3xl font-bold text-white">
                  {justificativasPendentes.length + justificativasAprovadas.length + justificativasRejeitadas.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="pendentes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 lg:w-[600px]">
            <TabsTrigger value="pendentes">Pendentes ({justificativasPendentes.length})</TabsTrigger>
            <TabsTrigger value="aprovadas">Aprovadas ({justificativasAprovadas.length})</TabsTrigger>
            <TabsTrigger value="rejeitadas">Rejeitadas ({justificativasRejeitadas.length})</TabsTrigger>
          </TabsList>

          {/* Pendentes */}
          <TabsContent value="pendentes">
            <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Funcionário</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Departamento</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Tipo</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Data</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Motivo</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Documento</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {justificativasPendentes.map((just) => (
                      <tr
                        key={just.id}
                        className="border-b border-slate-700/50 transition-colors hover:bg-slate-700/30"
                      >
                        <td className="py-4 text-sm font-medium text-white">{just.funcionario}</td>
                        <td className="py-4 text-sm text-slate-300">{just.departamento}</td>
                        <td className="py-4">
                          <Badge
                            className={
                              just.tipo === "Falta" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                            }
                          >
                            {just.tipo}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-slate-300">
                          {new Date(just.data).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-4 text-sm text-slate-300">{just.motivo}</td>
                        <td className="py-4">
                          {just.documento ? (
                            <Button size="sm" variant="ghost" className="h-8 text-cyan-400 hover:text-cyan-300">
                              <Download className="mr-1 h-3 w-3" />
                              Ver
                            </Button>
                          ) : (
                            <span className="text-sm text-slate-500">Sem documento</span>
                          )}
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleVerDetalhes(just)}
                              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAprovar(just.id)}
                              className="bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            >
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleRejeitar(just.id)}
                              className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            >
                              <XCircle className="mr-1 h-3 w-3" />
                              Rejeitar
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

          {/* Aprovadas */}
          <TabsContent value="aprovadas">
            <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Funcionário</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Tipo</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Data</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Motivo</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Aprovado Por</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Data Aprovação</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {justificativasAprovadas.map((just) => (
                      <tr
                        key={just.id}
                        className="border-b border-slate-700/50 transition-colors hover:bg-slate-700/30"
                      >
                        <td className="py-4 text-sm font-medium text-white">{just.funcionario}</td>
                        <td className="py-4">
                          <Badge className="bg-green-500/20 text-green-400">{just.tipo}</Badge>
                        </td>
                        <td className="py-4 text-sm text-slate-300">
                          {new Date(just.data).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-4 text-sm text-slate-300">{just.motivo}</td>
                        <td className="py-4 text-sm text-slate-300">{just.aprovadoPor}</td>
                        <td className="py-4 text-sm text-slate-300">
                          {new Date(just.dataAprovacao).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-4">
                          <Button
                            size="sm"
                            onClick={() => handleVerDetalhes(just)}
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Ver Detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Rejeitadas */}
          <TabsContent value="rejeitadas">
            <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Funcionário</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Tipo</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Data</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Motivo</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Rejeitado Por</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Motivo Rejeição</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {justificativasRejeitadas.map((just) => (
                      <tr
                        key={just.id}
                        className="border-b border-slate-700/50 transition-colors hover:bg-slate-700/30"
                      >
                        <td className="py-4 text-sm font-medium text-white">{just.funcionario}</td>
                        <td className="py-4">
                          <Badge className="bg-red-500/20 text-red-400">{just.tipo}</Badge>
                        </td>
                        <td className="py-4 text-sm text-slate-300">
                          {new Date(just.data).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-4 text-sm text-slate-300">{just.motivo}</td>
                        <td className="py-4 text-sm text-slate-300">{just.rejeitadoPor}</td>
                        <td className="py-4 text-sm text-slate-300">{just.motivoRejeicao}</td>
                        <td className="py-4">
                          <Button
                            size="sm"
                            onClick={() => handleVerDetalhes(just)}
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Ver Detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Detalhes */}
        <Dialog open={openDetalhes} onOpenChange={setOpenDetalhes}>
          <DialogContent className="border-slate-700 bg-slate-800 text-white">
            <DialogHeader>
              <DialogTitle>Detalhes da Justificativa</DialogTitle>
            </DialogHeader>
            {selectedJustificativa && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">Funcionário</Label>
                    <p className="font-semibold text-white">{selectedJustificativa.funcionario}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Departamento</Label>
                    <p className="font-semibold text-white">{selectedJustificativa.departamento}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Tipo</Label>
                    <Badge
                      className={
                        selectedJustificativa.tipo === "Falta"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-amber-500/20 text-amber-400"
                      }
                    >
                      {selectedJustificativa.tipo}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-slate-400">Data</Label>
                    <p className="font-semibold text-white">
                      {new Date(selectedJustificativa.data).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-400">Motivo</Label>
                  <p className="text-white">{selectedJustificativa.motivo}</p>
                </div>
                {selectedJustificativa.documento && (
                  <div>
                    <Label className="text-slate-400">Documento</Label>
                    <Button
                      variant="outline"
                      className="mt-2 w-full border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Baixar {selectedJustificativa.documento}
                    </Button>
                  </div>
                )}
                <Button
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                  onClick={() => setOpenDetalhes(false)}
                >
                  Fechar
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
