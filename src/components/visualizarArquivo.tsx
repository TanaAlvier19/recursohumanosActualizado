"use client"

import type React from "react"
import { useRef, useState } from "react"
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

  const gerarPDF = async () => {
    if (!relatorioRef.current) return

    setGerandoPDF(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
      const canvas = await html2canvas(relatorioRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
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
      toast.error("Erro ao gerar relatório")
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Gerar Relatório do Funcionário</DialogTitle>
          <DialogDescription>
            Visualize o relatório antes de gerar o PDF
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div 
            ref={relatorioRef}
            className="bg-white p-8 border rounded-lg shadow-sm"
            style={{ 
              width: '210mm',
              minHeight: '297mm',
              margin: '0 auto'
            }}
          >
            <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-blue-900">RELATÓRIO DE FUNCIONÁRIO</h1>
              <p className="text-gray-600">Sistema de Gestão de Recursos Humanos</p>
              <p className="text-sm text-gray-500 mt-2">
                Emitido em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
              </p>
            </div>

            <div className="flex items-center gap-6 mb-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                {fotoPerfil ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={fotoPerfil}
                      alt={nomeCompleto}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
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

            <section className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo do Cadastro</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{Object.keys(camposNormais).length}</p>
                  <p className="text-sm text-gray-600">Campos Preenchidos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{camposArquivos.length}</p>
                  <p className="text-sm text-gray-600">Documentos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(
                      (Object.values(camposNormais).filter((v) => v && v.trim()).length /
                        Object.keys(camposNormais).length) *
                        100,
                    )}
                    %
                  </p>
                  <p className="text-sm text-gray-600">Completude</p>
                </div>
              </div>
            </section>

            <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-500">
              <p>Este relatório foi gerado automaticamente pelo Sistema de RH</p>
              <p>Documento confidencial - Uso interno</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={gerarPDF} 
              disabled={gerandoPDF}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FiDownload className="w-4 h-4 mr-2" />
              {gerandoPDF ? "Gerando PDF..." : "Baixar Relatório PDF"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}