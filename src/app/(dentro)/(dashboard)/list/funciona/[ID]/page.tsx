"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  FiArrowLeft,
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
  FiCamera,
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

import VisualizadorArquivo from "@/components/visualizarArquivo"
import RelatorioPDF from "@/components/RelatorioPDF"
import PerfilHeader from "@/components/perfilHearder"

type FuncionarioCompleto = {
  id: string
  departamento: string | null
  empresa: string
  valores: Record<string, string>
  arquivos?: { id: string; nome_campo: string; arquivo: string }[]
  created_at?: string
  updated_at?: string
}

// Utility Functions
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
  if (name.includes("foto") || name.includes("imagem") || name.includes("avatar"))
    return <FiCamera className="w-4 h-4 text-pink-600" />
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
  
  // Se for um campo de imagem/foto, mostrar preview
  if ((name.includes("foto") || name.includes("imagem") || name.includes("avatar")) && 
      (value.startsWith('http') || value.includes('.jpg') || value.includes('.png') || value.includes('.jpeg'))) {
    
    const imageUrl = value.startsWith('http') ? value : `https://recursohumanosactualizado.onrender.com${value}`
    
    return (
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 relative rounded-lg overflow-hidden border">
          <Image
            src={imageUrl}
            alt={`Foto: ${fieldName}`}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>
        <span className="text-sm text-gray-600">Imagem disponível</span>
      </div>
    )
  }
  
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

export default function PerfilFuncionario() {
  const params = useParams()
  const id = params.ID
  const router = useRouter()
  const [funcionario, setFuncionario] = useState<FuncionarioCompleto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null)
  const [mostrarRelatorio, setMostrarRelatorio] = useState(false)

  // Carregar dados do funcionário
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`https://recursohumanosactualizado.onrender.com/perfil/?id=${id}`)

        if (!res.ok) {
          throw new Error("Funcionário não encontrado")
        }

        const data = await res.json()
        setFuncionario(data[0])
        await buscarFotoFuncionario(data[0])
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

  // Buscar foto do funcionário
  const buscarFotoFuncionario = async (funcionarioData: FuncionarioCompleto) => {
    try {
      const camposFoto = ['foto', 'imagem', 'foto do funcionario', 'imagem do funcionario', 'avatar', 'photo', 'picture']
      
      // Verificar em arquivos anexados
      if (funcionarioData.arquivos && funcionarioData.arquivos.length > 0) {
        const arquivoFoto = funcionarioData.arquivos.find(arquivo => 
          camposFoto.some(campo => arquivo.nome_campo.toLowerCase().includes(campo))
        )
        
        if (arquivoFoto) {
          setFotoPerfil(`https://recursohumanosactualizado.onrender.com${arquivoFoto.arquivo}`)
          return
        }
      }

      // Verificar em campos de valores
      const camposValores = Object.entries(funcionarioData.valores || {})
      const campoFoto = camposValores.find(([key, value]) => {
        const keyLower = key.toLowerCase()
        const valueLower = String(value).toLowerCase()
        return (
          camposFoto.some(campo => keyLower.includes(campo)) &&
          (valueLower.startsWith('http') || valueLower.includes('.jpg') || valueLower.includes('.png') || valueLower.includes('.jpeg'))
        )
      })

      if (campoFoto && campoFoto[1]) {
        const fotoUrl = campoFoto[1].startsWith('http') 
          ? campoFoto[1] 
          : `https://recursohumanosactualizado.onrender.com${campoFoto[1]}`
        setFotoPerfil(fotoUrl)
      }
    } catch (error) {
      console.error("Erro ao buscar foto do funcionário:", error)
    }
  }

  // Categorizar campos
  const categorizarCampos = (camposNormais: Record<string, string>) => {
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

    const camposMidia = Object.entries(camposNormais).filter(([key]) => {
      const k = key.toLowerCase()
      return k.includes("foto") || k.includes("imagem") || k.includes("avatar")
    })

    const camposPessoais = Object.entries(camposNormais).filter(([key]) => {
      const k = key.toLowerCase()
      return (
        !camposContato.some(([ck]) => ck === key) &&
        !camposEndereco.some(([ek]) => ek === key) &&
        !camposProfissionais.some(([pk]) => pk === key) &&
        !camposMidia.some(([mk]) => mk === key)
      )
    })

    return {
      camposContato,
      camposEndereco,
      camposProfissionais,
      camposMidia,
      camposPessoais
    }
  }

  if (loading) {
    return <LoadingState />
  } 

  if (error || !funcionario) {
    return <ErrorState error={error} id={id as string} router={router} />
  }

  const camposNormais = funcionario.valores || {}
  const nomeCompleto = camposNormais.nome || camposNormais.Nome || "Funcionário"
  const camposArquivos = funcionario.arquivos || []
  const {
    camposContato,
    camposEndereco,
    camposProfissionais,
    camposMidia,
    camposPessoais
  } = categorizarCampos(camposNormais)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Actions */}
        <HeaderActions 
          router={router} 
          onGerarRelatorio={() => setMostrarRelatorio(true)} 
        />

        {/* Modal de Relatório */}
        {mostrarRelatorio && (
          <RelatorioPDF 
            funcionario={funcionario}
            fotoPerfil={fotoPerfil}
            onClose={() => setMostrarRelatorio(false)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="shadow-xl border-0 overflow-hidden">
              <PerfilHeader
                nomeCompleto={nomeCompleto}
                funcionario={funcionario}
                fotoPerfil={fotoPerfil}
                camposNormais={camposNormais}
                onEditar={() => {/* Implementar edição */}}
              />
            </Card>

            {/* Abas de Informações */}
            <InformacoesTabs
              camposPessoais={camposPessoais}
              camposContato={camposContato}
              camposEndereco={camposEndereco}
              camposProfissionais={camposProfissionais}
              camposMidia={camposMidia}
            />
          </div>

          <Sidebar
            camposArquivos={camposArquivos}
            camposNormais={camposNormais}
            funcionario={funcionario}
            router={router}
            onGerarRelatorio={() => setMostrarRelatorio(true)}
          />
        </div>
      </div>
    </div>
  )
}

 function LoadingState() {
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

function ErrorState({ error, id, router }: { error: string | null, id: string, router: any }) {
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

function HeaderActions({ router, onGerarRelatorio }: { router: any, onGerarRelatorio: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2 bg-white shadow-sm">
        <FiArrowLeft /> Voltar para lista
      </Button>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="bg-white">
          <FiShare2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
        <Button variant="outline" className="bg-white" onClick={onGerarRelatorio}>
          <FiPrinter className="w-4 h-4 mr-2" />
          Gerar Relatório
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
            <DropdownMenuItem onClick={onGerarRelatorio}>
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
  )
}

function InformacoesTabs({ 
  camposPessoais, 
  camposContato, 
  camposEndereco, 
  camposProfissionais, 
  camposMidia 
}: any) {
  return (
    <Card className="shadow-lg border-0">
      <Tabs defaultValue="geral" className="w-full">
        <CardHeader className="pb-0">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100">
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
            <TabsTrigger value="midia" className="flex items-center gap-2">
              <FiCamera className="w-4 h-4" />
              Mídia
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Conteúdo das abas */}
          <TabsContent value="geral" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {camposPessoais.map(([chave, valor]: [string, string]) => (
                <CampoItem key={chave} chave={chave} valor={valor} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contato" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {camposContato.length > 0 ? (
                camposContato.map(([chave, valor]: [string, string]) => (
                  <CampoItem key={chave} chave={chave} valor={valor} />
                ))
              ) : (
                <EmptyState icon={<FiMail />} message="Nenhuma informação de contato cadastrada" />
              )}
            </div>
          </TabsContent>

          <TabsContent value="endereco" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {camposEndereco.length > 0 ? (
                camposEndereco.map(([chave, valor]: [string, string]) => (
                  <CampoItem key={chave} chave={chave} valor={valor} />
                ))
              ) : (
                <EmptyState icon={<FiMapPin />} message="Nenhuma informação de endereço cadastrada" />
              )}
            </div>
          </TabsContent>

          <TabsContent value="profissional" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {camposProfissionais.length > 0 ? (
                camposProfissionais.map(([chave, valor]: [string, string]) => (
                  <CampoItem key={chave} chave={chave} valor={valor} />
                ))
              ) : (
                <EmptyState icon={<FiBriefcase />} message="Nenhuma informação profissional cadastrada" />
              )}
            </div>
          </TabsContent>

          <TabsContent value="midia" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {camposMidia.length > 0 ? (
                camposMidia.map(([chave, valor]: [string, string]) => (
                  <CampoItem key={chave} chave={chave} valor={valor} />
                ))
              ) : (
                <EmptyState icon={<FiCamera />} message="Nenhuma mídia cadastrada" />
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}

function CampoItem({ chave, valor }: { chave: string, valor: string }) {
  return (
    <div className="group">
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
  )
}

function EmptyState({ icon, message }: { icon: React.ReactNode, message: string }) {
  return (
    <div className="col-span-2 text-center py-8">
      <div className="w-12 h-12 text-gray-300 mx-auto mb-4">
        {icon}
      </div>
      <p className="text-gray-500">{message}</p>
    </div>
  )
}

function Sidebar({ 
  camposArquivos, 
  camposNormais, 
  funcionario, 
  router, 
  onGerarRelatorio 
}: any) {
  return (
    <div className="space-y-6">
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
              {camposArquivos.map((arquivo: any) => {
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
                    {/* <VisualizadorArquivo url={arquivo.arquivo} nome={nomeArquivo} /> */}
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
          {/* <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Campos Preenchidos</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {Object.values(camposNormais).filter((v) => v && v.trim()).length}
            </Badge>
          </div> */}
          
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
          <Button 
            variant="outline" 
            className="w-full bg-transparent justify-start"
            onClick={onGerarRelatorio}
          >
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
    </div>
  )
} 