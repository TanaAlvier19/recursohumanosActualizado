"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, AlertCircle, CheckCircle2, XCircle, Search, Filter, Clock, User } from "lucide-react"

const alertasCriticos = [
  {
    id: 1,
    tipo: "Falta sem Justificativa",
    funcionario: "João Silva",
    departamento: "TI",
    data: "2024-01-18",
    descricao: "Falta registrada sem justificativa há 3 dias",
    prioridade: "alta",
    status: "pendente",
  },
  {
    id: 2,
    tipo: "Marcação Duplicada",
    funcionario: "Maria Santos",
    departamento: "RH",
    data: "2024-01-17",
    descricao: "Duas marcações de entrada no mesmo dia",
    prioridade: "alta",
    status: "pendente",
  },
  {
    id: 3,
    tipo: "Excesso de Horas Extras",
    funcionario: "Pedro Costa",
    departamento: "Vendas",
    data: "2024-01-15",
    descricao: "Acumulou 25h extras no mês (limite: 20h)",
    prioridade: "alta",
    status: "pendente",
  },
]

const alertasMedia = [
  {
    id: 4,
    tipo: "Atraso Recorrente",
    funcionario: "Ana Oliveira",
    departamento: "Financeiro",
    data: "2024-01-16",
    descricao: "3 atrasos nos últimos 7 dias",
    prioridade: "media",
    status: "pendente",
  },
  {
    id: 5,
    tipo: "Intervalo Irregular",
    funcionario: "Carlos Mendes",
    departamento: "Operações",
    data: "2024-01-15",
    descricao: "Intervalo de 30min (mínimo: 1h)",
    prioridade: "media",
    status: "pendente",
  },
]

const inconsistencias = [
  {
    id: 6,
    tipo: "Marcação Fora do Horário",
    funcionario: "Beatriz Lima",
    departamento: "Marketing",
    data: "2024-01-14",
    descricao: "Entrada às 06:00 (horário: 08:00)",
    prioridade: "baixa",
    status: "resolvido",
  },
  {
    id: 7,
    tipo: "Falta de Marcação",
    funcionario: "Lucas Ferreira",
    departamento: "Logística",
    data: "2024-01-13",
    descricao: "Sem marcação de saída",
    prioridade: "media",
    status: "resolvido",
  },
]

export default function AlertasPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const handleResolver = (id: number) => {
    console.log("[v0] Resolvendo alerta:", id)
  }

  const handleIgnorar = (id: number) => {
    console.log("[v0] Ignorando alerta:", id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
              Alertas e Inconsistências
            </h1>
            <p className="mt-2 text-slate-400">Monitoramento e resolução de problemas de frequência</p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Críticos</p>
                <p className="text-3xl font-bold text-white">{alertasCriticos.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </Card>

          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Média Prioridade</p>
                <p className="text-3xl font-bold text-white">{alertasMedia.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
                <AlertCircle className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </Card>

          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Resolvidos Hoje</p>
                <p className="text-3xl font-bold text-white">12</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                <CheckCircle2 className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Pendentes</p>
                <p className="text-3xl font-bold text-white">{alertasCriticos.length + alertasMedia.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="criticos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 lg:w-[600px]">
            <TabsTrigger value="criticos">Críticos ({alertasCriticos.length})</TabsTrigger>
            <TabsTrigger value="media">Média ({alertasMedia.length})</TabsTrigger>
            <TabsTrigger value="resolvidos">Resolvidos ({inconsistencias.length})</TabsTrigger>
          </TabsList>

          {/* Alertas Críticos */}
          <TabsContent value="criticos">
            <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Alertas de Alta Prioridade</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Buscar alerta..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {alertasCriticos.map((alerta) => (
                  <Card
                    key={alerta.id}
                    className="border-red-500/30 bg-gradient-to-r from-red-500/10 to-transparent p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h4 className="font-semibold text-white">{alerta.tipo}</h4>
                            <Badge className="bg-red-500/20 text-red-400">Alta Prioridade</Badge>
                          </div>
                          <div className="mb-2 flex items-center gap-4 text-sm text-slate-300">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {alerta.funcionario}
                            </div>
                            <span>•</span>
                            <span>{alerta.departamento}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(alerta.data).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                          <p className="text-sm text-slate-400">{alerta.descricao}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleResolver(alerta.id)}
                          className="bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Resolver
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleIgnorar(alerta.id)}
                          className="bg-slate-600/20 text-slate-400 hover:bg-slate-600/30"
                        >
                          <XCircle className="mr-1 h-3 w-3" />
                          Ignorar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Alertas Média Prioridade */}
          <TabsContent value="media">
            <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold text-white">Alertas de Média Prioridade</h3>
              <div className="space-y-4">
                {alertasMedia.map((alerta) => (
                  <Card
                    key={alerta.id}
                    className="border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                          <AlertCircle className="h-5 w-5 text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h4 className="font-semibold text-white">{alerta.tipo}</h4>
                            <Badge className="bg-amber-500/20 text-amber-400">Média Prioridade</Badge>
                          </div>
                          <div className="mb-2 flex items-center gap-4 text-sm text-slate-300">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {alerta.funcionario}
                            </div>
                            <span>•</span>
                            <span>{alerta.departamento}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(alerta.data).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                          <p className="text-sm text-slate-400">{alerta.descricao}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleResolver(alerta.id)}
                          className="bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Resolver
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleIgnorar(alerta.id)}
                          className="bg-slate-600/20 text-slate-400 hover:bg-slate-600/30"
                        >
                          <XCircle className="mr-1 h-3 w-3" />
                          Ignorar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Resolvidos */}
          <TabsContent value="resolvidos">
            <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold text-white">Alertas Resolvidos</h3>
              <div className="space-y-4">
                {inconsistencias.map((alerta) => (
                  <Card key={alerta.id} className="border-slate-700 bg-slate-800/30 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h4 className="font-semibold text-white">{alerta.tipo}</h4>
                            <Badge className="bg-green-500/20 text-green-400">Resolvido</Badge>
                          </div>
                          <div className="mb-2 flex items-center gap-4 text-sm text-slate-300">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {alerta.funcionario}
                            </div>
                            <span>•</span>
                            <span>{alerta.departamento}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(alerta.data).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                          <p className="text-sm text-slate-400">{alerta.descricao}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Tipos de Alertas Configurados */}
        <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-lg font-semibold text-white">Tipos de Alertas Configurados</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { nome: "Falta sem Justificativa", ativo: true, prioridade: "alta" },
              { nome: "Atraso Recorrente", ativo: true, prioridade: "media" },
              { nome: "Excesso de Horas Extras", ativo: true, prioridade: "alta" },
              { nome: "Marcação Duplicada", ativo: true, prioridade: "alta" },
              { nome: "Intervalo Irregular", ativo: true, prioridade: "media" },
              { nome: "Falta de Marcação", ativo: false, prioridade: "baixa" },
            ].map((tipo, idx) => (
              <Card key={idx} className="border-slate-700 bg-slate-800/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="mb-1 font-semibold text-white">{tipo.nome}</h4>
                    <Badge
                      className={
                        tipo.prioridade === "alta"
                          ? "bg-red-500/20 text-red-400"
                          : tipo.prioridade === "media"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-blue-500/20 text-blue-400"
                      }
                    >
                      {tipo.prioridade === "alta" ? "Alta" : tipo.prioridade === "media" ? "Média" : "Baixa"}
                    </Badge>
                  </div>
                  <Badge className={tipo.ativo ? "bg-green-500/20 text-green-400" : "bg-slate-600/50 text-slate-400"}>
                    {tipo.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
