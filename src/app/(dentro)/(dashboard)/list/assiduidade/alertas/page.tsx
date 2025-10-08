"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, AlertCircle, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react"
import { fetchApi, getApiUrl } from "@/lib/api-config"
import Swal from "sweetalert2"

interface Alerta {
  id: number
  tipo: string
  funcionario_nome: string
  departamento_nome: string
  prioridade: string
  descricao: string
  data: string
  status: string
}

function useAlertasData() {
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchApi(getApiUrl("/api/alertas/por_prioridade/"))
        const data = await response.json()
        setAlertas(data.alertas || [])
      } catch (error) {
        console.error("[v0] Erro ao buscar alertas:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { alertas, loading, setAlertas }
}

export default function AlertasPage() {
  const { alertas, loading, setAlertas } = useAlertasData()

  const handleResolver = async (id: number) => {
    try {
      await fetchApi(getApiUrl(`/api/alertas/${id}/resolver/`), { method: "POST" })
      setAlertas(alertas.map((a) => (a.id === id ? { ...a, status: "resolvido" } : a)))
      Swal.fire({ icon: "success", title: "Alerta resolvido!", timer: 2000, showConfirmButton: false })
    } catch (error) {
      Swal.fire({ icon: "error", title: "Erro", text: "Não foi possível resolver o alerta" })
    }
  }

  const handleIgnorar = async (id: number) => {
    try {
      await fetchApi(getApiUrl(`/api/alertas/${id}/ignorar/`), { method: "POST" })
      setAlertas(alertas.map((a) => (a.id === id ? { ...a, status: "ignorado" } : a)))
      Swal.fire({ icon: "success", title: "Alerta ignorado!", timer: 2000, showConfirmButton: false })
    } catch (error) {
      Swal.fire({ icon: "error", title: "Erro", text: "Não foi possível ignorar o alerta" })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
      </div>
    )
  }

  const criticos = alertas.filter((a) => a.prioridade === "alta" && a.status === "pendente")
  const media = alertas.filter((a) => a.prioridade === "media" && a.status === "pendente")
  const resolvidos = alertas.filter((a) => a.status === "resolvido")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
            Alertas e Inconsistências
          </h1>
          <p className="mt-2 text-slate-400">Monitoramento e resolução de problemas de frequência</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Críticos</p>
                <p className="text-3xl font-bold text-white">{criticos.length}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>
          </Card>

          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Média Prioridade</p>
                <p className="text-3xl font-bold text-white">{media.length}</p>
              </div>
              <AlertCircle className="h-12 w-12 text-amber-400" />
            </div>
          </Card>

          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Resolvidos Hoje</p>
                <p className="text-3xl font-bold text-white">{resolvidos.length}</p>
              </div>
              <CheckCircle2 className="h-12 w-12 text-green-400" />
            </div>
          </Card>

          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Pendentes</p>
                <p className="text-3xl font-bold text-white">{criticos.length + media.length}</p>
              </div>
              <Clock className="h-12 w-12 text-blue-400" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="criticos">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 lg:w-[600px]">
            <TabsTrigger value="criticos">Críticos ({criticos.length})</TabsTrigger>
            <TabsTrigger value="media">Média ({media.length})</TabsTrigger>
            <TabsTrigger value="resolvidos">Resolvidos ({resolvidos.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="criticos">
            <Card className="border-slate-700 bg-slate-800/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Alertas de Alta Prioridade</h3>
              <div className="space-y-4">
                {criticos.map((alerta) => (
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
                          <div className="mb-2 text-sm text-slate-300">
                            {alerta.funcionario_nome} • {alerta.departamento_nome} •{" "}
                            {new Date(alerta.data).toLocaleDateString("pt-BR")}
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

          <TabsContent value="media">
            <Card className="border-slate-700 bg-slate-800/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Alertas de Média Prioridade</h3>
              <div className="space-y-4">
                {media.map((alerta) => (
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
                          <div className="mb-2 text-sm text-slate-300">
                            {alerta.funcionario_nome} • {alerta.departamento_nome} •{" "}
                            {new Date(alerta.data).toLocaleDateString("pt-BR")}
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

          <TabsContent value="resolvidos">
            <Card className="border-slate-700 bg-slate-800/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Alertas Resolvidos</h3>
              <div className="space-y-4">
                {resolvidos.map((alerta) => (
                  <Card key={alerta.id} className="border-slate-700 bg-slate-800/30 p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h4 className="font-semibold text-white">{alerta.tipo}</h4>
                          <Badge className="bg-green-500/20 text-green-400">Resolvido</Badge>
                        </div>
                        <div className="mb-2 text-sm text-slate-300">
                          {alerta.funcionario_nome} • {alerta.departamento_nome} •{" "}
                          {new Date(alerta.data).toLocaleDateString("pt-BR")}
                        </div>
                        <p className="text-sm text-slate-400">{alerta.descricao}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
