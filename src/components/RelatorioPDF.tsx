"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FiDownload } from "react-icons/fi"
import Image from "next/image"
import { toast } from "sonner"

interface FuncionarioCompleto {
  id: string
  departamento: string | null
  empresa: string
  valores: Record<string, string>
  arquivos?: { id: string; nome_campo: string; arquivo: string }[]
  created_at?: string
  updated_at?: string
}

interface RelatorioPDFProps {
  funcionario: FuncionarioCompleto
  fotoPerfil: string | null
  onClose: () => void
}

export default function RelatorioPDF({ funcionario, fotoPerfil, onClose }: RelatorioPDFProps) {
  const relatorioRef = useRef<HTMLDivElement>(null)
  const [gerandoPDF, setGerandoPDF] = useState(false)
  const [fotoCarregada, setFotoCarregada] = useState(false)
  const [fotoComFallback, setFotoComFallback] = useState<string | null>(null)
  const [fotoError, setFotoError] = useState(false)

  useEffect(() => {
    const prepararFoto = async () => {
      if (!fotoPerfil) {
        setFotoCarregada(true)
        setFotoError(true)
        return
      }

      try {
        const img = document.createElement('img')
        
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            setFotoComFallback(fotoPerfil)
            setFotoCarregada(true)
            setFotoError(false)
            resolve()
          }
          
          img.onerror = () => {
            console.warn("Não foi possível carregar a foto, usando fallback")
            setFotoCarregada(true)
            setFotoError(true)
            resolve()
          }
          
          img.crossOrigin = "anonymous"
          img.src = fotoPerfil
          
          setTimeout(() => {
            if (!fotoCarregada) {
              console.warn("Timeout ao carregar foto")
              setFotoCarregada(true)
              setFotoError(true)
              resolve()
            }
          }, 100000)
        })
        
      } catch (error) {
        console.error("Erro ao preparar foto:", error)
        setFotoCarregada(true)
        setFotoError(true)
      }
    }
    
    prepararFoto()
  }, [fotoPerfil])

  const gerarPDF = async () => {
    if (!relatorioRef.current) return

    setGerandoPDF(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
      // Aguarda um pouco mais para garantir que tudo está carregado
      await new Promise(resolve => setTimeout(resolve, 2000))

      const canvas = await html2canvas(relatorioRef.current, {
  scale: 2,
  useCORS: true,
  logging: true, // Ative para debug
  backgroundColor: '#ffffff',
  allowTaint: true, // IMPORTANTE: Mude para true
  foreignObjectRendering: false,
  imageTimeout: 15000,
  onclone: (clonedDoc, element) => {
    // Garante que todas as imagens base64 estejam carregadas
    const images = element.getElementsByTagName('img')
    Array.from(images).forEach((img) => {
      if (img.src.startsWith('data:image')) {
        // Força o carregamento completo de imagens base64
        img.style.display = 'block'
      }
    })
  }
})

      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const nomeArquivo = `relatorio-${funcionario.valores?.Nome || funcionario.valores?.nome || 'funcionario'}-${new Date().toISOString().split('T')[0]}.pdf`
      
      pdf.save(nomeArquivo)
      toast.success("Relatório gerado com sucesso!")
      onClose()
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast.error("Erro ao gerar relatório. Tente novamente.")
    } finally {
      setGerandoPDF(false)
    }
  }

  const camposNormais = funcionario.valores || {}
  const nomeCompleto = camposNormais.nome || camposNormais.Nome || "Funcionário"
  const camposArquivos = funcionario.arquivos || []

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatFieldName = (fieldName: string) => {
    return fieldName
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const isImageUrlValid = (url: string) => {
    return url && (url.startsWith('http') || url.startsWith('data:image') || url.startsWith('/'))
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Gerar Relatório do Funcionário</DialogTitle>
          <DialogDescription>
            Visualize o relatório antes de gerar o PDF {!fotoCarregada && fotoPerfil && "(Carregando foto...)"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview do Relatório */}
          <div 
            ref={relatorioRef}
            className="bg-white p-8 border rounded-lg shadow-sm"
            style={{ 
              width: '210mm',
              minHeight: '297mm',
              margin: '0 auto'
            }}
          >
            {/* Cabeçalho */}
            <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-blue-900">RELATÓRIO DE FUNCIONÁRIO</h1>
              <p className="text-gray-600">Sistema de Gestão de Recursos Humanos</p>
              <p className="text-sm text-gray-500 mt-2">
                Emitido em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
              </p>
            </div>

            <div className="flex items-center gap-6 mb-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                {fotoPerfil && isImageUrlValid(fotoPerfil) && !fotoError && fotoCarregada ? (
  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
    <img
      src={fotoComFallback || fotoPerfil}
      alt={nomeCompleto}
      className="w-full h-full object-cover"
      onError={(e) => {
        console.error("Erro ao carregar foto no preview")
        setFotoError(true)
      }}
    />
  </div>
) : (
  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-lg">
    {getInitials(nomeCompleto)}
  </div>
)}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{nomeCompleto}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
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
                  {fotoPerfil && !fotoError && (
                    <Badge variant="outline" className="border-green-200 text-green-700">
                      Foto Disponível
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Dados Pessoais */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4">
                Dados Pessoais
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {camposPessoais.map(([chave, valor]) => (
                  <div key={chave} className="border-l-4 border-blue-500 pl-3">
                    <label className="text-sm font-medium text-gray-600 block">{formatFieldName(chave)}</label>
                    <p className="text-gray-900 font-medium">{valor || "Não informado"}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Informações de Contato */}
            {camposContato.length > 0 && (
              <section className="mb-6">
                <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2 mb-4">
                  Informações de Contato
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {camposContato.map(([chave, valor]) => (
                    <div key={chave} className="border-l-4 border-green-500 pl-3">
                      <label className="text-sm font-medium text-gray-600 block">{formatFieldName(chave)}</label>
                      <p className="text-gray-900 font-medium">{valor || "Não informado"}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Endereço */}
            {camposEndereco.length > 0 && (
              <section className="mb-6">
                <h3 className="text-lg font-semibold text-orange-800 border-b border-orange-200 pb-2 mb-4">
                  Endereço
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {camposEndereco.map(([chave, valor]) => (
                    <div key={chave} className="border-l-4 border-orange-500 pl-3">
                      <label className="text-sm font-medium text-gray-600 block">{formatFieldName(chave)}</label>
                      <p className="text-gray-900 font-medium">{valor || "Não informado"}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Dados Profissionais */}
            {camposProfissionais.length > 0 && (
              <section className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 border-b border-purple-200 pb-2 mb-4">
                  Dados Profissionais
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {camposProfissionais.map(([chave, valor]) => (
                    <div key={chave} className="border-l-4 border-purple-500 pl-3">
                      <label className="text-sm font-medium text-gray-600 block">{formatFieldName(chave)}</label>
                      <p className="text-gray-900 font-medium">{valor || "Não informado"}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Documentos Anexados */}
            {camposArquivos.length > 0 && (
              <section className="mb-6">
                <h3 className="text-lg font-semibold text-red-800 border-b border-red-200 pb-2 mb-4">
                  Documentos Anexados
                </h3>
                <div className="space-y-2">
                  {camposArquivos.map((arquivo) => {
                    const nomeArquivo = arquivo.arquivo.split("/").pop() || "Arquivo"
                    return (
                      <div key={arquivo.id} className="flex items-center justify-between py-2 border-b">
                        <div>
                          <p className="font-medium text-gray-900">{formatFieldName(arquivo.nome_campo)}</p>
                          <p className="text-sm text-gray-600">{nomeArquivo}</p>
                        </div>
                        <Badge variant="outline">Anexado</Badge>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}


          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={gerarPDF} 
              disabled={gerandoPDF || (!fotoCarregada && !!fotoPerfil)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FiDownload className="w-4 h-4 mr-2" />
              {gerandoPDF ? "Gerando PDF..." : 
               (!fotoCarregada && fotoPerfil) ? "Carregando foto..." : "Baixar Relatório PDF"}
            </Button>
          </div>

          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
              <p>Debug: Foto URL: {fotoPerfil || 'Nenhuma'}</p>
              <p>Foto carregada: {fotoCarregada ? 'Sim' : 'Não'}</p>
              <p>Foto error: {fotoError ? 'Sim' : 'Não'}</p>
              <p>Gerando PDF: {gerandoPDF ? 'Sim' : 'Não'}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}