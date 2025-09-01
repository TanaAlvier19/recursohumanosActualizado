"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  FiArrowLeft,
  FiDownload,
  FiEye,
  FiFile,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit3,
  FiPrinter,
  FiShare2,
  FiMoreVertical,
  FiClock,
  FiBriefcase,
  FiHome,
  FiGlobe,
  FiHash,
  FiDollarSign,
} from "react-icons/fi"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { cn } from "@/lib/utils"

const VisualizadorArquivo = ({ url, nome }: { url: string; nome: string }) => {
  const [abrir, setAbrir] = useState(false)
  const [tipoArquivo, setTipoArquivo] = useState("")
  const [loading, setLoading] = useState(false)
  const urlCompleta = `http://localhost:8000${url}`

  useEffect(() => {
    if (url) {
      const extensao = url.split(".").pop()?.toLowerCase()
      if (extensao === "pdf") setTipoArquivo("pdf")
      else if (["jpg", "jpeg", "png", "gif", "webp"].includes(extensao || "")) setTipoArquivo("imagem")
      else if (["doc", "docx"].includes(extensao || "")) setTipoArquivo("documento")
      else if (["xls", "xlsx"].includes(extensao || "")) setTipoArquivo("planilha")
      else setTipoArquivo("outro")
    }
  }, [url])

  const baixarArquivo = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoading(true)
    try {
      const response = await fetch(urlCompleta)
      const blob = await response.blob()
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = nome
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVisualizarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAbrir(true)
  }

  const getFileIcon = () => {
    switch (tipoArquivo) {
      case "pdf":
        return <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">📄</div>
      case "imagem":
        return <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">🖼️</div>
      case "documento":
        return <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">📝</div>
      case "planilha":
        return <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">📊</div>
      default:
        return <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">📎</div>
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={baixarArquivo}
        disabled={loading}
        className="flex items-center gap-1 bg-transparent hover:bg-blue-50"
      >
        <FiDownload className="h-4 w-4" />
        {loading ? "Baixando..." : "Baixar"}
      </Button>
      {(tipoArquivo === "pdf" || tipoArquivo === "imagem") && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleVisualizarClick}
          className="flex items-center gap-1 bg-transparent hover:bg-green-50"
        >
          <FiEye className="h-4 w-4" /> Visualizar
        </Button>
      )}

      <Dialog open={abrir} onOpenChange={setAbrir}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              {getFileIcon()}
              Visualizar Arquivo
            </DialogTitle>
            <DialogDescription>{nome}</DialogDescription>
          </DialogHeader>
          <div className="h-[70vh] p-6 pt-4">
            {tipoArquivo === "pdf" ? (
              <iframe src={urlCompleta} className="w-full h-full border rounded-lg" title={`PDF: ${nome}`} />
            ) : tipoArquivo === "imagem" ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <Image
                  src={urlCompleta || "/placeholder.svg"}
                  alt={`Imagem: ${nome}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  width={800}
                  height={600}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  {getFileIcon()}
                  <p className="mt-4 text-gray-600">Visualização não disponível para este tipo de arquivo</p>
                  <p className="text-sm text-gray-500 mt-2">Use o botão Baixar para acessar o arquivo</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center p-6 pt-0 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Badge variant="outline">{tipoArquivo.toUpperCase()}</Badge>
              <span>•</span>
              <span>{nome}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setAbrir(false)}>
                Fechar
              </Button>
              <Button onClick={baixarArquivo} disabled={loading}>
                <FiDownload className="mr-2 h-4 w-4" />
                {loading ? "Baixando..." : "Baixar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Tipos
type FuncionarioCompleto = {
  id: string
  departamento: string | null
  empresa: string
  valores: Record<string, string>
  arquivos?: { id: string; nome_campo: string; arquivo: string }[]
  created_at?: string
  updated_at?: string
}

export default function PerfilFuncionario() {
  const params = useParams()
  const id = params.ID
  const router = useRouter()
  const [funcionario, setFuncionario] = useState<FuncionarioCompleto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`http://localhost:8000/perfil/?id=${id}`)

        if (!res.ok) {
          throw new Error("Funcionário não encontrado")
        }

        const data = await res.json()
        setFuncionario(data[0])
        console.log("dados completos:", data[0])
      } catch (error) {
        console.error("Erro ao buscar funcionário:", error)
        setError(error instanceof Error ? error.message : "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      carregarDados()
    }
  }, [id])

  const getFieldIcon = (fieldName: string) => {
    const name = fieldName.toLowerCase()
    if (name.includes("email")) return <FiMail className="w-4 h-4 text-blue-600" />
    if (name.includes("telefone") || name.includes("phone") || name.includes("celular"))
      return <FiPhone className="w-4 h-4 text-green-600" />
    if (name.includes("endereco") || name.includes("address") || name.includes("rua"))
      return <FiMapPin className="w-4 h-4 text-red-600" />
    if (name.includes("data") || name.includes("nascimento") || name.includes("date"))
      return <FiCalendar className="w-4 h-4 text-purple-600" />
    if (name.includes("cargo") || name.includes("funcao") || name.includes("position"))
      return <FiBriefcase className="w-4 h-4 text-orange-600" />
    if (name.includes("salario") || name.includes("salary") || name.includes("valor"))
      return <FiDollarSign className="w-4 h-4 text-emerald-600" />
    if (name.includes("cpf") || name.includes("rg") || name.includes("documento") || name.includes("id"))
      return <FiHash className="w-4 h-4 text-indigo-600" />
    if (name.includes("site") || name.includes("website") || name.includes("url"))
      return <FiGlobe className="w-4 h-4 text-cyan-600" />
    return <FiUser className="w-4 h-4 text-gray-600" />
  }

  const formatFieldName = (fieldName: string) => {
    return fieldName
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const formatFieldValue = (fieldName: string, value: string) => {
    const name = fieldName.toLowerCase()
    if (name.includes("email")) {
      return (
        <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
          {value}
        </a>
      )
    }
    if (name.includes("telefone") || name.includes("phone") || name.includes("celular")) {
      return (
        <a href={`tel:${value}`} className="text-green-600 hover:underline">
          {value}
        </a>
      )
    }
    if (name.includes("site") || name.includes("website") || name.includes("url")) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">
          {value}
        </a>
      )
    }
    return value
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !funcionario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-white shadow-sm"
            >
              <FiArrowLeft /> Voltar
            </Button>
          </div>
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Funcionário não encontrado</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Alert>
                <AlertDescription>{error || `O funcionário com ID ${id} não foi encontrado.`}</AlertDescription>
              </Alert>
              <Button onClick={() => router.back()} className="mt-4">
                Voltar para lista
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Separar campos de arquivo dos campos normais
  const camposArquivos = funcionario.arquivos || []
  const camposNormais = funcionario.valores || {}
  const nomeCompleto = camposNormais.nome || camposNormais.Nome || "Funcionário"

  // Categorizar campos
  const camposContato = Object.entries(camposNormais).filter(([key]) => {
    const k = key.toLowerCase()
    return k.includes("email") || k.includes("telefone") || k.includes("phone") || k.includes("celular")
  })

  const camposEndereco = Object.entries(camposNormais).filter(([key]) => {
    const k = key.toLowerCase()
    return (
      k.includes("endereco") || k.includes("address") || k.includes("rua") || k.includes("cidade") || k.includes("cep")
    )
  })

  const camposProfissionais = Object.entries(camposNormais).filter(([key]) => {
    const k = key.toLowerCase()
    return (
      k.includes("cargo") ||
      k.includes("funcao") ||
      k.includes("salario") ||
      k.includes("departamento") ||
      k.includes("setor")
    )
  })

  const camposPessoais = Object.entries(camposNormais).filter(([key]) => {
    const k = key.toLowerCase()
    return (
      !camposContato.some(([ck]) => ck === key) &&
      !camposEndereco.some(([ek]) => ek === key) &&
      !camposProfissionais.some(([pk]) => pk === key)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2 bg-white shadow-sm">
            <FiArrowLeft /> Voltar para lista
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white">
              <FiShare2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="outline" className="bg-white">
              <FiPrinter className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-white">
                  <FiMoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FiEdit3 className="w-4 h-4 mr-2" />
                  Editar perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FiFile className="w-4 h-4 mr-2" />
                  Gerar relatório
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <FiUser className="w-4 h-4 mr-2" />
                  Desativar funcionário
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Card do Perfil Principal */}
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
              <CardContent className="relative pt-0 pb-6">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16 relative z-10">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                    <AvatarImage src="/placeholder.svg" alt={nomeCompleto} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {getInitials(nomeCompleto)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 md:ml-4 mt-4 md:mt-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">{nomeCompleto}</h1>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            ID: {funcionario.id}
                          </Badge>
                          {camposNormais.cargo && (
                            <Badge variant="outline" className="border-purple-200 text-purple-700">
                              {camposNormais.cargo}
                            </Badge>
                          )}
                          {funcionario.departamento && (
                            <Badge variant="outline" className="border-green-200 text-green-700">
                              {funcionario.departamento}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <FiEdit3 className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs com Informações */}
            <Card className="shadow-lg border-0">
              <Tabs defaultValue="geral" className="w-full">
                <CardHeader className="pb-0">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                    <TabsTrigger value="geral" className="flex items-center gap-2">
                      <FiUser className="w-4 h-4" />
                      Geral
                    </TabsTrigger>
                    <TabsTrigger value="contato" className="flex items-center gap-2">
                      <FiMail className="w-4 h-4" />
                      Contato
                    </TabsTrigger>
                    <TabsTrigger value="endereco" className="flex items-center gap-2">
                      <FiHome className="w-4 h-4" />
                      Endereço
                    </TabsTrigger>
                    <TabsTrigger value="profissional" className="flex items-center gap-2">
                      <FiBriefcase className="w-4 h-4" />
                      Profissional
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="pt-6">
                  <TabsContent value="geral" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {camposPessoais.map(([chave, valor]) => (
                        <div key={chave} className="group">
                          <div className="flex items-center gap-2 mb-3">
                            {getFieldIcon(chave)}
                            <h4 className="text-sm font-semibold text-gray-700">{formatFieldName(chave)}</h4>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 group-hover:bg-gray-100 transition-all duration-200">
                            <p className="text-gray-900 font-medium">
                              {formatFieldValue(chave, valor) || (
                                <span className="text-gray-400 italic">Não informado</span>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="contato" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {camposContato.length > 0 ? (
                        camposContato.map(([chave, valor]) => (
                          <div key={chave} className="group">
                            <div className="flex items-center gap-2 mb-3">
                              {getFieldIcon(chave)}
                              <h4 className="text-sm font-semibold text-gray-700">{formatFieldName(chave)}</h4>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 group-hover:bg-gray-100 transition-all duration-200">
                              <p className="text-gray-900 font-medium">{formatFieldValue(chave, valor)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-8">
                          <FiMail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Nenhuma informação de contato cadastrada</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="endereco" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {camposEndereco.length > 0 ? (
                        camposEndereco.map(([chave, valor]) => (
                          <div key={chave} className="group">
                            <div className="flex items-center gap-2 mb-3">
                              {getFieldIcon(chave)}
                              <h4 className="text-sm font-semibold text-gray-700">{formatFieldName(chave)}</h4>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 group-hover:bg-gray-100 transition-all duration-200">
                              <p className="text-gray-900 font-medium">{valor || "Não informado"}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-8">
                          <FiMapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Nenhuma informação de endereço cadastrada</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="profissional" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {camposProfissionais.length > 0 ? (
                        camposProfissionais.map(([chave, valor]) => (
                          <div key={chave} className="group">
                            <div className="flex items-center gap-2 mb-3">
                              {getFieldIcon(chave)}
                              <h4 className="text-sm font-semibold text-gray-700">{formatFieldName(chave)}</h4>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 group-hover:bg-gray-100 transition-all duration-200">
                              <p className="text-gray-900 font-medium">{valor || "Não informado"}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-8">
                          <FiBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Nenhuma informação profissional cadastrada</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documentos */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiFile className="w-5 h-5 text-purple-600" />
                  Documentos
                </CardTitle>
                <CardDescription>
                  {camposArquivos.length > 0
                    ? `${camposArquivos.length} arquivo(s) anexado(s)`
                    : "Nenhum arquivo anexado"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {camposArquivos.length > 0 ? (
                  <div className="space-y-4">
                    {camposArquivos.map((arquivo) => {
                      const nomeArquivo = arquivo.arquivo.split("/").pop() || "Arquivo"
                      const extensao = arquivo.arquivo.split(".").pop()?.toLowerCase()

                      return (
                        <div
                          key={arquivo.id}
                          className="border rounded-xl p-4 space-y-3 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FiFile className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {formatFieldName(arquivo.nome_campo)}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">{nomeArquivo}</p>
                              {extensao && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  {extensao.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <VisualizadorArquivo url={arquivo.arquivo} nome={nomeArquivo} />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiFile className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Nenhum documento</p>
                    <p className="text-sm text-gray-400">Este funcionário não possui arquivos anexados</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-purple-600" />
                  </div>
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Total de Campos</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {Object.keys(camposNormais).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Documentos</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {camposArquivos.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Campos Preenchidos</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {Object.values(camposNormais).filter((v) => v && v.trim()).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-medium text-gray-600">Completude</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      Object.values(camposNormais).filter((v) => v && v.trim()).length /
                        Object.keys(camposNormais).length >=
                        0.8
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800",
                    )}
                  >
                    {Math.round(
                      (Object.values(camposNormais).filter((v) => v && v.trim()).length /
                        Object.keys(camposNormais).length) *
                        100,
                    )}
                    %
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start">
                  <FiEdit3 className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
                <Button variant="outline" className="w-full bg-transparent justify-start">
                  <FiFile className="w-4 h-4 mr-2" />
                  Adicionar Documento
                </Button>
                <Button variant="outline" className="w-full bg-transparent justify-start">
                  <FiPrinter className="w-4 h-4 mr-2" />
                  Gerar Relatório
                </Button>
                <Separator />
                <Button variant="outline" className="w-full bg-transparent justify-start" onClick={() => router.back()}>
                  <FiArrowLeft className="w-4 h-4 mr-2" />
                  Voltar à Lista
                </Button>
              </CardContent>
            </Card>

            {/* Informações do Sistema */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiClock className="w-5 h-5 text-gray-600" />
                  Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ID do Funcionário</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">{funcionario.id}</code>
                </div>
                {funcionario.created_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Criado em</span>
                    <span className="text-gray-900">
                      {new Date(funcionario.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                )}
                {funcionario.updated_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Atualizado em</span>
                    <span className="text-gray-900">
                      {new Date(funcionario.updated_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
