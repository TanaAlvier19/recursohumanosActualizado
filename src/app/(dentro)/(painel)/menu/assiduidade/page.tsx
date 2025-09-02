"use client"

import type React from "react"

import { useEffect, useState, useRef, useContext } from "react"
import Swal from "sweetalert2"
import { AuthContext } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Camera,
  Clock,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Info,
  Loader2,
  Eye,
  Timer,
  LogIn,
  LogOut,
} from "lucide-react"

interface Assiduidade {
  id: number
  funcionario: number
  entrada: string
  saida: string | null
  data: string
  duracao: string
}

export default function FormModalAssiduidade() {
  const [desativado, setDesativado] = useState(false)
  const { accessToken, userId, userName, userLoading } = useContext(AuthContext)
  const router = useRouter()
  const [assiduidadeList, setAssiduidadeList] = useState<Assiduidade[]>([])
  const [formData, setFormData] = useState({
    entrada: "",
    data: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [armazenar, setArmazenar] = useState<string[]>([])
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isRegisteringFace, setIsRegisteringFace] = useState(false)
  const [contando, setContando] = useState(false)
  const [contagem, setContagem] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (!userLoading && !accessToken) {
      router.push("/logincomsenha")
    }
  }, [accessToken, userLoading, router])

  const fetchAssiduidade = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`https://backend-django-2-7qpl.onrender.com/api/assiduidade/?funcionario=${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data = await res.json()
      console.log("teu ID", userId)
      setAssiduidadeList(data)
    } catch (error) {
      console.error("Erro ao buscar assiduidade:", error)
      setError("Erro ao carregar dados de assiduidade")
    } finally {
      setLoading(false)
    }
  }, [userId, accessToken])

  useEffect(() => {
    if (userId) {
      fetchAssiduidade()
    }
  }, [userId, fetchAssiduidade])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const openCamera = async () => {
    Swal.fire({ title: "Abrindo câmera...", didOpen: () => Swal.showLoading() })
    setIsRegisteringFace(true)
    setIsCameraOpen(true)
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      Swal.close()
    } catch (err) {
      setError("Erro ao acessar a câmera: " + (err as Error).message)
      Swal.fire("Erro", "Não foi possível acessar sua câmera", "error")
      setIsCameraOpen(false)
      setIsRegisteringFace(false)
    }
  }

  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval>
    if (contando) {
      intervalo = setInterval(() => {
        setContagem((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(intervalo)
  }, [contando])

  const captureImage = (): string | null => {
    if (!videoRef.current) return null
    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL("image/jpeg")
    }
    return null
  }

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsCameraOpen(false)
    setIsRegisteringFace(false)
    setError(null)
    setContando(false)
    setContagem(0)
    setDesativado(false)
    setArmazenar([])
  }

  const armazenarImagem = () => {
    if (armazenar.length >= 3) {
      Swal.fire({
        icon: "warning",
        title: "Limite de 3 fotos atingido",
        text: "Você só pode capturar até 3 fotos para o reconhecimento facial.",
      })
      return
    }
    const imageData = captureImage()
    if (imageData) {
      setArmazenar((prev) => [...prev, imageData])
      Swal.fire({
        icon: "success",
        title: "Foto armazenada com sucesso!",
        timer: 1500,
        showConfirmButton: false,
      })
    } else {
      setError("Falha ao capturar imagem")
    }
  }

  const registerNewFace = async () => {
    const accessToken = localStorage.getItem("access_token")
    if (!accessToken) {
      Swal.fire({ icon: "error", title: "Token de acesso não encontrado" })
      return
    }
    if (!armazenar || armazenar.length === 0) {
      Swal.fire({ icon: "warning", title: "Nenhuma imagem capturada" })
      return
    }

    setDesativado(true)
    setContando(true)

    try {
      let erroOcorrido = false
      for (const imageData of armazenar) {
        const formData = new FormData()
        const blob = await (await fetch(imageData)).blob()
        formData.append("image", blob, "face.jpg")
        const response = await fetch("https://d620-102-214-36-139.ngrok-free.app/api/register_face/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        })
        const data = await response.json()
        if (!response.ok) {
          erroOcorrido = true
          console.error("Erro ao cadastrar imagem:", data)
          Swal.fire({
            icon: "error",
            title: `Erro ao cadastrar uma das imagens`,
            text: data.error || "Erro desconhecido",
          })
          break
        }
      }
      if (!erroOcorrido) {
        Swal.fire({
          icon: "success",
          title: `${armazenar.length} imagem(ns) cadastrada(s) com sucesso!`,
        })
        closeCamera()
      }
    } catch (err) {
      console.error("Erro geral:", err)
      Swal.fire({ icon: "error", title: "Erro ao registrar rosto", text: String(err) })
    } finally {
      setDesativado(false)
      setContando(false)
      setContagem(0)
      if (!closeCamera) {
        setArmazenar([])
        setIsCameraOpen(false)
        setIsRegisteringFace(false)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const showInstructions = () => {
    Swal.fire({
      title: "Como funciona o cadastro de rosto?",
      html: `
        <div class="text-left space-y-3">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
            <span>Abriremos sua câmera automaticamente</span>
          </div>
          <div class="flex items-center gap-2 mb-3">
            <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
            <span>Posicione seu rosto em boa iluminação</span>
          </div>
          <div class="flex items-center gap-2 mb-3">
            <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
            <span>Capture até 3 fotos diferentes</span>
          </div>
          <div class="flex items-center gap-2 mb-3">
            <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
            <span>Confirme o envio das fotos</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">5</span>
            <span>Pronto! Agora você pode registrar assiduidade</span>
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#3b82f6",
      confirmButtonText: "Entendi",
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return "-"
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return timeString
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR")
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (entrada: string, saida: string | null) => {
    if (entrada && saida) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completo
        </Badge>
      )
    } else if (entrada && !saida) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Timer className="w-3 h-3 mr-1" />
          Em andamento
        </Badge>
      )
    }
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
        <XCircle className="w-3 h-3 mr-1" />
        Incompleto
      </Badge>
    )
  }

  const calculateStats = () => {
    const total = assiduidadeList.length
    const completos = assiduidadeList.filter((item) => item.entrada && item.saida).length
    const emAndamento = assiduidadeList.filter((item) => item.entrada && !item.saida).length
    const esteMes = assiduidadeList.filter((item) => {
      const itemDate = new Date(item.data)
      const currentDate = new Date()
      return itemDate.getMonth() === currentDate.getMonth() && itemDate.getFullYear() === currentDate.getFullYear()
    }).length

    return { total, completos, emAndamento, esteMes }
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900">Minha Assiduidade</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4" />
                    {userName || "Usuário"}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={showInstructions} variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Info className="w-4 h-4" />
                  Como funciona?
                </Button>
                <Button onClick={openCamera} className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Camera className="w-4 h-4" />
                  Cadastrar Rosto
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <LogIn className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total de Registros</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Dias Completos</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.completos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Timer className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.emAndamento}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Este Mês</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.esteMes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Assiduidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Histórico de Assiduidade
            </CardTitle>
            <CardDescription>Visualize todos os seus registros de entrada e saída</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-slate-600">Carregando registros...</span>
              </div>
            ) : assiduidadeList.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Nenhum registro encontrado</p>
                <p className="text-sm text-slate-400">Seus registros de assiduidade aparecerão aqui</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Entrada</TableHead>
                      <TableHead>Saída</TableHead>
                      <TableHead>Duração</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assiduidadeList.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50">
                        <TableCell>{getStatusBadge(item.entrada, item.saida)}</TableCell>
                        <TableCell className="font-medium">{formatDate(item.data)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <LogIn className="w-4 h-4 text-green-600" />
                            {formatTime(item.entrada)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.saida ? (
                            <div className="flex items-center gap-2">
                              <LogOut className="w-4 h-4 text-red-600" />
                              {formatTime(item.saida)}
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.duracao ? (
                            <Badge variant="outline" className="font-mono">
                              {item.duracao}
                            </Badge>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal da Câmera */}
        <Dialog
          open={isCameraOpen}
          onOpenChange={(open) => {
            if (!open) {
              closeCamera()
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Cadastrar Rosto - {userName}
              </DialogTitle>
              <DialogDescription>
                Posicione seu rosto na câmera e capture até 3 fotos para o reconhecimento facial.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-auto rounded-lg border-2 border-slate-200"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    <Eye className="w-3 h-3 mr-1" />
                    {armazenar.length}/3 fotos
                  </Badge>
                </div>
              </div>

              {armazenar.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {armazenar.map((img, index) => (
                    <div key={index} className="flex-shrink-0">
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Captura ${index + 1}`}
                        className="w-16 h-16 rounded border object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <Button onClick={armazenarImagem} className="w-full" disabled={armazenar.length >= 3}>
                  <Camera className="w-4 h-4 mr-2" />
                  Capturar Foto ({armazenar.length}/3)
                </Button>

                <Button
                  onClick={registerNewFace}
                  disabled={desativado || armazenar.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {contando ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando... ({contagem}s)
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Salvar {armazenar.length} Foto(s)
                    </>
                  )}
                </Button>

                <Button onClick={closeCamera} variant="outline" className="w-full bg-transparent">
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>

              {contando && (
                <div className="space-y-2">
                  <Progress value={Math.min((contagem / 10) * 100, 100)} className="w-full" />
                  <p className="text-sm text-center text-green-600">Processando imagens... {contagem}s</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
