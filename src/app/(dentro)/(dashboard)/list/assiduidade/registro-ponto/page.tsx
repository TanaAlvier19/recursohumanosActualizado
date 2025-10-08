"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Fingerprint, Clock, CheckCircle2, Coffee, LogOut, Search, Calendar, User, MapPin, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Swal from "sweetalert2"

interface RegistroPonto {
  id: string
  tipo: 'entrada' | 'saida' | 'saida_intervalo' | 'retorno_intervalo'
  data_hora: string
  localizacao?: string
  latitude?: number
  longitude?: number
  validado_biometria: boolean
  status: string
}

interface FuncionarioInfo {
  id: string
  nomeRep: string
  emailRep: string
  empresa: string
    
}

interface StatusHoje {
  entrada?: string
  saida_intervalo?: string
  retorno_intervalo?: string
  saida?: string
}

export default function RegistroPontoPage() {
  const [funcionario, setFuncionario] = useState<FuncionarioInfo | null>(null)
  const [registrosHoje, setRegistrosHoje] = useState<RegistroPonto[]>([])
  const [statusHoje, setStatusHoje] = useState<StatusHoje>({})
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Buscar dados do funcionário e registros
  useEffect(() => {
    fetchDadosFuncionario()
    fetchRegistrosHoje()
  }, [])

  const fetchDadosFuncionario = async () => {
    try {
      const response = await fetch("http://localhost:8000/usuario/", {
        credentials: "include",
       
      })

      if (!response.ok) throw new Error("Erro ao buscar dados do funcionário")

      const userData = await response.json()
      setFuncionario(userData)

    } catch (error) {
      console.error("Erro ao buscar dados do funcionário:", error)
      toast.error("Erro ao carregar dados do funcionário")
    }
  }

  const fetchRegistrosHoje = async () => {
    try {
      if (!funcionario?.id) return

      const response = await fetch(
        `http://localhost:8000/registros-ponto/hoje/?funcionario_id=${funcionario.id}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) throw new Error("Erro ao buscar registros")

      const data = await response.json()
      setRegistrosHoje(data.registros || [])

      // Atualizar status hoje
      const status: StatusHoje = {}
      data.registros?.forEach((registro: RegistroPonto) => {
        const hora = new Date(registro.data_hora).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        })
        status[registro.tipo] = hora
      })
      setStatusHoje(status)
    } catch (error) {
      console.error("Erro ao buscar registros:", error)
      toast.error("Erro ao carregar registros do dia")
    } finally {
      setLoading(false)
    }
  }

  const handleRegistrarPonto = async (tipo: string) => {
    if (!funcionario) {
      toast.error("Dados do funcionário não carregados")
      return
    }

    setRegistering(true)

    try {
      // Obter localização se disponível
      let latitude, longitude, localizacao = "Sede Principal"
      
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: true
            })
          })
          latitude = position.coords.latitude
          longitude = position.coords.longitude
          localizacao = `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`
        } catch (geoError) {
          console.warn("Erro ao obter localização:", geoError)
          // Continua sem localização
        }
      }

      const registroData = {
        funcionario_id: funcionario.id,
        tipo: tipo,
        latitude: latitude,
        longitude: longitude,
        localizacao: localizacao,
        biometria: "simulada", // Em produção, aqui viria os dados biométricos reais
        dispositivo: navigator.userAgent,
        ip_address: await getClientIP()
      }

      const response = await fetch("http://localhost:8000/registros-ponto/registrar/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registroData),
      })

      const result = await response.json()
console.log(result)
      if (!response.ok) {
        throw new Error(result.message || "Erro ao registrar ponto")
      }

      if (result.success) {
        toast.success(`Ponto registrado com sucesso!`, {
          description: `${formatTipoRegistro(tipo)} às ${new Date().toLocaleTimeString('pt-BR')}`
        })

        // Atualizar lista de registros
        await fetchRegistrosHoje()
      } else {
        throw new Error(result.message || "Erro ao registrar ponto")
      }

    } catch (error) {
      console.error("Erro ao registrar ponto:", error)
      toast.error("Erro ao registrar ponto", {
        description: error instanceof Error ? error.message : "Tente novamente"
      })
    } finally {
      setRegistering(false)
    }
  }

  // Funções auxiliares
  const formatTipoRegistro = (tipo: string) => {
    const tipos: { [key: string]: string } = {
      'entrada': 'Entrada',
      'saida': 'Saída',
      'saida_intervalo': 'Saída Intervalo',
      'retorno_intervalo': 'Retorno Intervalo'
    }
    return tipos[tipo] || tipo
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'entrada': return Clock
      case 'saida': return LogOut
      case 'saida_intervalo': return Coffee
      case 'retorno_intervalo': return CheckCircle2
      default: return Clock
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'entrada': return "text-green-400"
      case 'saida': return "text-red-400"
      case 'saida_intervalo': return "text-amber-400"
      case 'retorno_intervalo': return "text-blue-400"
      default: return "text-slate-400"
    }
  }

  const getCSRFToken = async () => {
    // Em uma aplicação real, você obteria o token CSRF dos cookies
    return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || ''
  }

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch {
      return '127.0.0.1'
    }
  }

  // Filtrar registros baseado na busca
  const filteredRegistros = registrosHoje.filter(registro =>
    formatTipoRegistro(registro.tipo).toLowerCase().includes(searchTerm.toLowerCase()) ||
    registro.data_hora.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-cyan-400" />
          <p className="mt-4 text-slate-400">Carregando dados do funcionário...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
              Registro de Ponto
            </h1>
            <p className="mt-2 text-slate-400">Sistema de controle de frequência</p>
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
          {/* Painel de Registro */}
          <div className="lg:col-span-2">
            <Card className="border-slate-700 bg-slate-800/50 p-8 backdrop-blur-sm">
              <div className="mb-6 text-center">
                <h2 className="mb-2 text-2xl font-bold text-white">Registrar Ponto</h2>
                <p className="text-slate-400">
                  {funcionario ? `Bem-vindo, ${funcionario.nomeRep}` : "Carregando..."}
                </p>
              </div>

              {/* Indicador de Biometria */}
              <div className="mb-8 flex justify-center">
                <div className="flex h-64 w-64 items-center justify-center rounded-full border-4 border-slate-600 bg-slate-700/30">
                  <Fingerprint className="h-32 w-32 text-slate-500" />
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  size="lg"
                  onClick={() => handleRegistrarPonto("entrada")}
                  disabled={registering || statusHoje.entrada}
                  className="h-16 bg-gradient-to-r from-green-500 to-emerald-600 text-lg font-semibold text-white hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
                >
                  {registering ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    <Clock className="mr-2 h-6 w-6" />
                  )}
                  {statusHoje.entrada ? `Entrada: ${statusHoje.entrada}` : "Registrar Entrada"}
                </Button>

                <Button
                  size="lg"
                  onClick={() => handleRegistrarPonto("saida")}
                  disabled={registering || statusHoje.saida}
                  className="h-16 bg-gradient-to-r from-red-500 to-rose-600 text-lg font-semibold text-white hover:from-red-600 hover:to-rose-700 disabled:opacity-50"
                >
                  {registering ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-6 w-6" />
                  )}
                  {statusHoje.saida ? `Saída: ${statusHoje.saida}` : "Registrar Saída"}
                </Button>

                <Button
                  size="lg"
                  onClick={() => handleRegistrarPonto("saida_intervalo")}
                  disabled={registering || statusHoje.saida_intervalo}
                  className="h-16 bg-gradient-to-r from-amber-500 to-orange-600 text-lg font-semibold text-white hover:from-amber-600 hover:to-orange-700 disabled:opacity-50"
                >
                  {registering ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    <Coffee className="mr-2 h-6 w-6" />
                  )}
                  {statusHoje.saida_intervalo ? `Saída Intervalo: ${statusHoje.saida_intervalo}` : "Saída Intervalo"}
                </Button>

                <Button
                  size="lg"
                  onClick={() => handleRegistrarPonto("retorno_intervalo")}
                  disabled={registering || statusHoje.retorno_intervalo}
                  className="h-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-lg font-semibold text-white hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50"
                >
                  {registering ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-6 w-6" />
                  )}
                  {statusHoje.retorno_intervalo ? `Retorno: ${statusHoje.retorno_intervalo}` : "Retorno Intervalo"}
                </Button>
              </div>

              {registering && (
                <div className="mt-6 rounded-lg border border-cyan-500/50 bg-cyan-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                    <p className="text-cyan-400">Processando registro...</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Informações do Funcionário */}
          <div className="space-y-6">
            {funcionario && (
              <>
                <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
                  <h3 className="mb-4 text-lg font-semibold text-white">Informações do Funcionário</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                        <User className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Nome</p>
                        <p className="font-semibold text-white">{funcionario.nomeRep}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                        <Calendar className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Departamento</p>
                        <p className="font-semibold text-white">
                          {funcionario.departamento?.nome || "Não definido"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                        <Clock className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Horário Padrão</p>
                        <p className="font-semibold text-white">08:00 - 17:00</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                        <MapPin className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Empresa</p>
                        <p className="font-semibold text-white">{funcionario.empresa}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
                  <h3 className="mb-4 text-lg font-semibold text-white">Status Hoje</h3>
                  <div className="space-y-3">
                    {[
                      { tipo: 'entrada', label: 'Entrada' },
                      { tipo: 'saida_intervalo', label: 'Saída Intervalo' },
                      { tipo: 'retorno_intervalo', label: 'Retorno Intervalo' },
                      { tipo: 'saida', label: 'Saída' }
                    ].map(({ tipo, label }) => (
                      <div key={tipo} className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">{label}</span>
                        {statusHoje[tipo as keyof StatusHoje] ? (
                          <Badge className="bg-green-500/20 text-green-400">
                            {statusHoje[tipo as keyof StatusHoje]}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-600/50 text-slate-400">
                            Pendente
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
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
            {filteredRegistros.length === 0 ? (
              <div className="py-8 text-center">
                <Clock className="mx-auto h-12 w-12 text-slate-600" />
                <p className="mt-2 text-slate-400">Nenhum registro encontrado para hoje</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="pb-3 text-left text-sm font-medium text-slate-400">Tipo</th>
                    <th className="pb-3 text-left text-sm font-medium text-slate-400">Data/Hora</th>
                    <th className="pb-3 text-left text-sm font-medium text-slate-400">Localização</th>
                    <th className="pb-3 text-left text-sm font-medium text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistros.map((registro) => {
                    const IconComponent = getTipoIcon(registro.tipo)
                    const tipoColor = getTipoColor(registro.tipo)
                    
                    return (
                      <tr
                        key={registro.id}
                        className="border-b border-slate-700/50 transition-colors hover:bg-slate-700/30"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <IconComponent className={`h-4 w-4 ${tipoColor}`} />
                            <span className="text-sm font-medium text-white">
                              {formatTipoRegistro(registro.tipo)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-slate-300">
                          {new Date(registro.data_hora).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4 text-sm text-slate-300">
                          {registro.localizacao || "Sede Principal"}
                        </td>
                        <td className="py-4">
                          <Badge className={
                            registro.validado_biometria 
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                          }>
                            {registro.validado_biometria ? "Validado" : "Pendente"}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}