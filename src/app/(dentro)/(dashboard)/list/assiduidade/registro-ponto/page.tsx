"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Fingerprint, Clock, CheckCircle2, Coffee, LogOut, Search, Calendar, User, MapPin } from "lucide-react"

const registrosHoje = [
  { id: 1, tipo: "Entrada", horario: "08:00:00", status: "sucesso", localizacao: "Sede Principal" },
  { id: 2, tipo: "Saída Intervalo", horario: "12:00:00", status: "sucesso", localizacao: "Sede Principal" },
  { id: 3, tipo: "Retorno Intervalo", horario: "13:00:00", status: "sucesso", localizacao: "Sede Principal" },
]

export default function RegistroPontoPage() {
  const [scanning, setScanning] = useState(false)
  const [lastScan, setLastScan] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleBiometricScan = (tipo: string) => {
    setScanning(true)
    setTimeout(() => {
      const now = new Date()
      const horario = now.toLocaleTimeString("pt-BR")
      setLastScan(`${tipo} registrado às ${horario}`)
      setScanning(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
              Registro de Ponto Biométrico
            </h1>
            <p className="mt-2 text-slate-400">Sistema de marcação de ponto com leitura biométrica</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{new Date().toLocaleTimeString("pt-BR")}</div>
            <div className="text-sm text-slate-400">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Painel de Registro Biométrico */}
          <div className="lg:col-span-2">
            <Card className="border-slate-700 bg-slate-800/50 p-8 backdrop-blur-sm">
              <div className="mb-6 text-center">
                <h2 className="mb-2 text-2xl font-bold text-white">Registrar Ponto</h2>
                <p className="text-slate-400">Posicione seu dedo no leitor biométrico</p>
              </div>

              {/* Simulador de Biometria */}
              <div className="mb-8 flex justify-center">
                <div
                  className={`relative flex h-64 w-64 items-center justify-center rounded-full border-4 transition-all ${
                    scanning ? "animate-pulse border-cyan-500 bg-cyan-500/20" : "border-slate-600 bg-slate-700/30"
                  }`}
                >
                  <Fingerprint className={`h-32 w-32 ${scanning ? "text-cyan-400" : "text-slate-500"}`} />
                  {scanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-full w-full animate-ping rounded-full border-4 border-cyan-500 opacity-75" />
                    </div>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  size="lg"
                  onClick={() => handleBiometricScan("Entrada")}
                  disabled={scanning}
                  className="h-16 bg-gradient-to-r from-green-500 to-emerald-600 text-lg font-semibold text-white hover:from-green-600 hover:to-emerald-700"
                >
                  <Clock className="mr-2 h-6 w-6" />
                  Registrar Entrada
                </Button>

                <Button
                  size="lg"
                  onClick={() => handleBiometricScan("Saída")}
                  disabled={scanning}
                  className="h-16 bg-gradient-to-r from-red-500 to-rose-600 text-lg font-semibold text-white hover:from-red-600 hover:to-rose-700"
                >
                  <LogOut className="mr-2 h-6 w-6" />
                  Registrar Saída
                </Button>

                <Button
                  size="lg"
                  onClick={() => handleBiometricScan("Saída Intervalo")}
                  disabled={scanning}
                  className="h-16 bg-gradient-to-r from-amber-500 to-orange-600 text-lg font-semibold text-white hover:from-amber-600 hover:to-orange-700"
                >
                  <Coffee className="mr-2 h-6 w-6" />
                  Saída Intervalo
                </Button>

                <Button
                  size="lg"
                  onClick={() => handleBiometricScan("Retorno Intervalo")}
                  disabled={scanning}
                  className="h-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-lg font-semibold text-white hover:from-blue-600 hover:to-indigo-700"
                >
                  <CheckCircle2 className="mr-2 h-6 w-6" />
                  Retorno Intervalo
                </Button>
              </div>

              {/* Feedback do Último Registro */}
              {lastScan && (
                <div className="mt-6 rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                    <div>
                      <p className="font-semibold text-green-400">Registro realizado com sucesso!</p>
                      <p className="text-sm text-slate-300">{lastScan}</p>
                    </div>
                  </div>
                </div>
              )}

              {scanning && (
                <div className="mt-6 rounded-lg border border-cyan-500/50 bg-cyan-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                    <p className="text-cyan-400">Lendo biometria...</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Informações do Funcionário */}
          <div className="space-y-6">
            <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold text-white">Informações do Funcionário</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <User className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Nome</p>
                    <p className="font-semibold text-white">João Silva</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                    <Calendar className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Departamento</p>
                    <p className="font-semibold text-white">Tecnologia da Informação</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Clock className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Horário</p>
                    <p className="font-semibold text-white">08:00 - 17:00</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <MapPin className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Localização</p>
                    <p className="font-semibold text-white">Sede Principal</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold text-white">Status Hoje</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Entrada</span>
                  <Badge className="bg-green-500/20 text-green-400">08:00</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Saída Intervalo</span>
                  <Badge className="bg-amber-500/20 text-amber-400">12:00</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Retorno Intervalo</span>
                  <Badge className="bg-blue-500/20 text-blue-400">13:00</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Saída</span>
                  <Badge className="bg-slate-600/50 text-slate-400">Pendente</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Histórico de Registros Hoje */}
        <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Registros de Hoje</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Buscar registro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">Tipo</th>
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">Horário</th>
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">Localização</th>
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {registrosHoje.map((registro) => (
                  <tr
                    key={registro.id}
                    className="border-b border-slate-700/50 transition-colors hover:bg-slate-700/30"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {registro.tipo === "Entrada" && <Clock className="h-4 w-4 text-green-400" />}
                        {registro.tipo === "Saída" && <LogOut className="h-4 w-4 text-red-400" />}
                        {registro.tipo === "Saída Intervalo" && <Coffee className="h-4 w-4 text-amber-400" />}
                        {registro.tipo === "Retorno Intervalo" && <CheckCircle2 className="h-4 w-4 text-blue-400" />}
                        <span className="text-sm font-medium text-white">{registro.tipo}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-300">{registro.horario}</td>
                    <td className="py-4 text-sm text-slate-300">{registro.localizacao}</td>
                    <td className="py-4">
                      <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                        {registro.status === "sucesso" ? "Sucesso" : "Pendente"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
