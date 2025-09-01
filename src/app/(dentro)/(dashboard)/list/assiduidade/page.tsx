"use client"
import { useEffect, useState, useRef, useContext } from "react"
import type React from "react"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { FileText, LogIn, LogOut, Loader2 } from "lucide-react"
import { AuthContext } from "@/app/context/AuthContext"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"

// Shadcn UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Assiduidade {
  id: number
  funcionario: number
  funcionario_nome: string
  entrada: string
  saida: string | null
  data: string
  duracao: string
}

interface Funcionario {
  id: number
  nome: string
}

export default function FormModalAssiduidade() {
  const { accessToken } = useContext(AuthContext)
  const router = useRouter()
  const [listaFuncionarios, definirListaFuncionarios] = useState<Funcionario[]>([])
  const [listaAssiduidade, definirListaAssiduidade] = useState<Assiduidade[]>([])
  const [dadosFormulario, definirDadosFormulario] = useState({ funcionario: "", entrada: "", data: "" })
  const [localizar, definirLocalizar] = useState<{ lat: number | null; long: number | null }>({ lat: null, long: null })
  const [carregando, definirCarregando] = useState(false)
  const [modalAberto, definirModalAberto] = useState(false)
  const [erro, definirErro] = useState<string | null>(null)
  const [hora, setHora] = useState<string>("")
  const [idEdicao, definirIdEdicao] = useState<number | null>(null)
  const [saidaEditada, definirSaidaEditada] = useState<string>("")
  const [contando, setcontador] = useState(false)
  const [cameraAberta, definirCameraAberta] = useState(false)
  const [registrandoEntrada, definirRegistrandoEntrada] = useState(false)
  const [registrandoSaida, definirRegistrandoSaida] = useState(false)
  const [contagem, setContagem] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (accessToken) {
      carregarAssiduidade()
    }
  }, [accessToken])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          definirLocalizar({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Erro ao obter localização:", error)
          definirErro("Não foi possível obter sua localização. Por favor, permita o acesso à localização.")
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        },
      )
    } else {
      definirErro("Geolocalização não é suportada pelo seu navegador.")
    }
  }, [])

  const carregarAssiduidade = async () => {
    setLoading(true)
    try {
      const resposta = await fetch("https://backend-django-2-7qpl.onrender.com/api/assiduidade/todos/")
      if (!resposta.ok) {
        throw new Error("Erro ao carregar assiduidade.")
      }
      const dados = await resposta.json()
      definirListaAssiduidade(dados)
    } catch (err: any) {
      definirErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  const aoMudarInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    definirDadosFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const registrarEntrada = async (payload: { funcionario: any; entrada: string; data: string }) => {
    try {
      const resposta = await fetch("https://backend-django-2-7qpl.onrender.com/api/assiduidade/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(payload),
      })
      if (!resposta.ok) {
        const errorData = await resposta.json()
        throw new Error(errorData.error || "Erro ao registrar entrada")
      }
      await carregarAssiduidade()
    } catch (erro: any) {
      definirErro(erro.message)
      Swal.fire("Erro", erro.message, "error")
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

  const editarSaida = async (id: number, saida: string) => {
    definirCarregando(true)
    try {
      const resposta = await fetch(`https://backend-django-2-7qpl.onrender.com/api/assiduidade/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saida }),
      })
      if (!resposta.ok) {
        const erroDados = await resposta.json()
        throw new Error(erroDados.error || "Erro ao registrar saída")
      }
      await carregarAssiduidade()
      definirIdEdicao(null)
      definirSaidaEditada("")
    } catch (err: any) {
      definirErro(err.message)
      Swal.fire("Erro", err.message, "error")
    } finally {
      definirCarregando(false)
    }
  }

  const exportarPDF = () => {
    const doc = new jsPDF()
    doc.text("Relatório de Assiduidade", 14, 16)
    autoTable(doc, {
      head: [["Funcionário", "Entrada", "Saída", "Data", "Duração"]],
      body: listaAssiduidade.map((a) => [a.funcionario_nome, a.entrada, a.saida || "-", a.data, a.duracao || "-"]),
      startY: 20,
    })
    doc.save("relatorio-assiduidade.pdf")
  }

  const abrirCamera = async () => {
    definirCameraAberta(true)
    definirErro(null) // Limpa erros anteriores
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch (err) {
      definirErro("Erro ao acessar a câmera: " + (err as Error).message + ". Por favor, permita o acesso à câmera.")
      definirCameraAberta(false) // Fecha o modal se o acesso à câmera falhar
    }
  }

  const capturarImagem = (): string | null => {
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

  const fecharCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setContagem(0)
    setcontador(false)
    definirCameraAberta(false)
    definirRegistrandoEntrada(false)
    definirRegistrandoSaida(false)
    definirModalAberto(false) // Garante que modalAberto também seja resetado
  }

  useEffect(() => {
    if (!accessToken) {
      router.push("/logincomsenha")
    }
  }, [accessToken, router])

  const reconhecerFace = async () => {
    definirCarregando(true)
    definirErro(null) // Limpa erros anteriores
    const imagem = capturarImagem()
    if (!imagem) {
      definirErro("Falha ao capturar imagem")
      definirCarregando(false)
      return
    }

    try {
      const resposta = await fetch("https://3b63-102-214-36-178.ngrok-free.app/api/facial/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagem }),
      })

      if (!resposta.ok) {
        const erroData = await resposta.json().catch(() => ({}))
        throw new Error(erroData?.error || "Funcionário não reconhecido")
      }

      const dados = await resposta.json()
      if (!dados.funcionario_id) {
        throw new Error("Funcionário não identificado na imagem.")
      }

      const agora = new Date()
      const hora = agora.toTimeString().slice(0, 5)
      const dataAtual = agora.toISOString().split("T")[0]

      if (registrandoSaida) {
        const registroAberto = listaAssiduidade.find(
          (item) =>
            item.funcionario.toString() === dados.funcionario_id.toString() &&
            item.data === dataAtual &&
            item.saida === null,
        )
        if (!registroAberto) {
          Swal.fire("Erro", "Não há entrada registrada hoje para esse funcionário.", "warning")
          return
        }
        await registrarSaida(dados.funcionario_id, hora)
        Swal.fire("Sucesso", "Saída registrada com sucesso!", "success")
      } else {
        // registrandoEntrada
        const entradaExistente = listaAssiduidade.find(
          (item) => item.funcionario.toString() === dados.funcionario_id.toString() && item.data === dataAtual,
        )
        if (entradaExistente) {
          Swal.fire("Erro", "Este funcionário já tem entrada registrada hoje.", "warning")
          return
        }
        await registrarEntrada({
          funcionario: dados.funcionario_id.toString(),
          entrada: hora,
          data: dataAtual,
        })
        Swal.fire("Sucesso", "Entrada registrada com sucesso!", "success")
      }
      await carregarAssiduidade()
    } catch (err: any) {
      definirErro("Erro: " + err.message)
      Swal.fire("Erro", err.message, "error")
    } finally {
      fecharCamera()
      definirCarregando(false)
    }
  }

  async function registrarSaida(funcionarioId: number, horaSaida: string) {
    try {
      const existente = listaAssiduidade.find(
        (item) => item.funcionario.toString() === funcionarioId.toString() && item.saida === null,
      )
      if (existente) {
        await editarSaida(existente.id, horaSaida)
      } else {
        const agora = new Date()
        const dataAtual = agora.toISOString().split("T")[0]
        const resposta = await fetch("https://backend-django-2-7qpl.onrender.com/api/assiduidade/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ funcionario: funcionarioId, entrada: "00:00", saida: horaSaida, data: dataAtual }),
        })
        if (!resposta.ok) {
          const errorData = await resposta.json()
          throw new Error(errorData.error || "Tente Novamente ou verifique se o serviço está ativo!")
        }
        Swal.fire("Sucesso", "Saída registrada com sucesso!", "success")
        await carregarAssiduidade()
      }
    } catch (err: any) {
      definirErro(err.message)
      Swal.fire("Ops..", err.message, "error")
    }
  }

  const abrirModalEntrada = async () => {
    definirRegistrandoEntrada(true)
    definirRegistrandoSaida(false) // Garante que apenas um seja verdadeiro
    definirModalAberto(true)
    await abrirCamera()
  }

  const abrirModalSaida = async () => {
    definirRegistrandoSaida(true)
    definirRegistrandoEntrada(false) // Garante que apenas um seja verdadeiro
    definirModalAberto(false) // ModalAberto é apenas para entrada, então mantém falso para saída
    await abrirCamera()
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }, [])

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      {/* Informações de Localização */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Localização Atual</CardTitle>
          <CardDescription>
            {localizar.lat !== null && localizar.long !== null
              ? `Lat: ${localizar.lat}, Long: ${localizar.long}`
              : "Localização não disponível"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {localizar.lat !== null && localizar.long !== null && (
            <Button asChild variant="link" className="p-0 h-auto">
              <a
                href={`https://www.google.com/maps?q=${localizar.lat},${localizar.long}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver a localização no mapa
              </a>
            </Button>
          )}
        </CardContent>
      </Card> */}

      {/* Cabeçalho e Exportar PDF */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">Gestão de Assiduidade</CardTitle>
            <CardDescription className="text-sm text-yellow-800 mt-2">
              {/* Os registros de assiduidades serão apagados depois de 20h e será gerado um relatório. */}
            </CardDescription>
          </div>
          <Button onClick={exportarPDF} className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Exportar PDF
          </Button>
        </CardHeader>
      </Card>

      {/* Botões de Entrada/Saída */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button onClick={abrirModalEntrada} className="flex items-center gap-2">
          <LogIn className="w-5 h-5" />
          Registrar Entrada
        </Button>
        <Button onClick={abrirModalSaida} className="flex items-center gap-2">
          <LogOut className="w-5 h-5" />
          Registrar Saída
        </Button>
      </div>

      {/* Exibição de Erro */}
      {erro && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}

      {/* Spinner de Carregamento para o conteúdo principal */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
          <span className="sr-only">Carregando...</span>
        </div>
      )}

      {/* Lista de Assiduidade (Mobile) */}
      {!loading && (
        <div className="block sm:hidden space-y-4">
          {listaAssiduidade.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum registro de assiduidade encontrado.</p>
          ) : (
            listaAssiduidade.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 space-y-2">
                  <p>
                    <strong>Funcionário:</strong> {item.funcionario_nome}
                  </p>
                  <p>
                    <strong>Entrada:</strong> {item.entrada}
                  </p>
                  <p>
                    <strong>Saída:</strong>{" "}
                    {idEdicao === item.id ? (
                      <Input type="time" value={saidaEditada} onChange={(e) => definirSaidaEditada(e.target.value)} />
                    ) : (
                      item.saida || "-"
                    )}
                  </p>
                  <p>
                    <strong>Data:</strong> {item.data}
                  </p>
                  <p>
                    <strong>Duração:</strong> {item.duracao || "-"}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Lista de Assiduidade (Desktop) */}
      {!loading && (
        <Card className="hidden sm:block overflow-x-auto">
          {listaAssiduidade.length === 0 ? (
            <CardContent className="p-4 text-center text-gray-500">
              Nenhum registro de assiduidade encontrado.
            </CardContent>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Saída</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Duração</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listaAssiduidade.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.funcionario_nome}</TableCell>
                    <TableCell>{item.entrada}</TableCell>
                    <TableCell>{item.saida || "-"}</TableCell>
                    <TableCell>{item.data}</TableCell>
                    <TableCell>{item.duracao || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      )}

      {/* Modal de Entrada */}
      <Dialog open={modalAberto && registrandoEntrada && cameraAberta} onOpenChange={fecharCamera}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Entrada</DialogTitle>
            <DialogDescription>Posicione seu rosto na câmera para registrar sua entrada.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto border rounded" />
            {contando && <p className="text-green-600 text-sm text-center">{contagem} segundos</p>}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                reconhecerFace()
                setcontador(true)
              }}
              disabled={carregando}
            >
              {carregando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reconhecer"}
            </Button>
            <Button variant="outline" onClick={fecharCamera}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Saída */}
      <Dialog open={registrandoSaida && cameraAberta} onOpenChange={fecharCamera}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Saída</DialogTitle>
            <DialogDescription>Posicione seu rosto na câmera para registrar sua saída.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto border rounded" />
            {contando && <p className="text-green-600 text-sm text-center">{contagem} segundos</p>}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                reconhecerFace()
                setcontador(true)
              }}
              disabled={carregando}
            >
              {carregando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reconhecer"}
            </Button>
            <Button variant="outline" onClick={fecharCamera}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
