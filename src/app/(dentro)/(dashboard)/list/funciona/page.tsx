"use client"

import type * as React from "react"
import Box from "@mui/material/Box"
import { DataGrid, type GridColDef, type GridEventListener } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { buscarDados } from "@/lib/api"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FiPlus, FiUser, FiX, FiCheck, FiDownload, FiEye, FiFile } from "react-icons/fi"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
type Departamento = {
  id: string;
  nome: string;
};
const VisualizadorArquivo = ({ url, nome }: { url: string; nome: string }) => {
  const [abrir, setAbrir] = useState(false)
  const [tipoArquivo, setTipoArquivo] = useState("")
  const urlCompleta = `http://localhost:8000${url}`

  useEffect(() => {
    if (url) {
      const extensao = url.split(".").pop()?.toLowerCase()
      if (extensao === "pdf") setTipoArquivo("pdf")
      else if (["jpg", "jpeg", "png", "gif"].includes(extensao || "")) setTipoArquivo("imagem")
      else setTipoArquivo("outro")
    }
  }, [url])

  const baixarArquivo = (e: React.MouseEvent) => {
    e.stopPropagation()
    const link = document.createElement("a")
    link.href = urlCompleta
    link.download = nome
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleVisualizarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAbrir(true)
  }

  return (
    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
      <Button variant="outline" size="sm" onClick={baixarArquivo} className="flex items-center gap-1 bg-transparent">
        <FiDownload className="h-4 w-4" /> Baixar
      </Button>
      {tipoArquivo === "pdf" || tipoArquivo === "imagem" ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleVisualizarClick}
          className="flex items-center gap-1 bg-transparent"
        >
          <FiEye className="h-4 w-4" /> Ver
        </Button>
      ) : null}

      <Dialog open={abrir} onOpenChange={setAbrir}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Visualizar Arquivo</DialogTitle>
            <DialogDescription>{nome}</DialogDescription>
          </DialogHeader>
          <div className="h-[70vh] flex justify-center items-center">
            {tipoArquivo === "pdf" ? (
              <iframe src={urlCompleta} className="w-full h-full border-0" title={`Visualização do arquivo ${nome}`} />
            ) : tipoArquivo === "imagem" ? (
              <Image
                src={urlCompleta || "/placeholder.svg"}
                alt={`Visualização do arquivo ${nome}`}
                className="max-w-full max-h-full object-contain"
                width={800}
                height={600}
              />
            ) : (
              <p className="text-center p-4">Visualização não disponível para este tipo de arquivo</p>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setAbrir(false)} className="mr-2">
              Fechar
            </Button>
            <Button onClick={baixarArquivo}>
              <FiDownload className="mr-2 h-4 w-4" /> Baixar Arquivo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function EmployeeDashboard() {
  type valorcampo = string | File | null
  const search = useSearchParams()
  const [salario_bruto, setsalario_bruto]=useState(0)
  const abrirDialog = search.get("abrirDialog") === "true"
  const [data, setData] = useState<any>()
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [campos, setCampos] = useState<Campo[]>([])
  const [valores, setValores] = useState<Record<string, valorcampo>>({})
  const [empresa, setEmpresa] = useState("")
  const router = useRouter()
  const [abrir, setAbrir] = useState(abrirDialog)
  const [apresentar, setApresentar] = useState(false)
  const [loading, setLoading] = useState(true)
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState<string>('')
  const columns: GridColDef[] = campos.map((campo) => {
    return {
      field: campo.nome,
      headerName: campo.nome,
      width: 180,
      editable: false,
      renderHeader: (params) => <div className="font-bold text-purple-700">{params.colDef.headerName}</div>,
      renderCell: (params) => {
        if (campo.tipo === "file") {
          const valor = params.value
          if (typeof valor === "string" && valor) {
            const nomeArquivo = valor.split("/").pop() || "Arquivo"
            return (
              <div className="flex items-center gap-2">
                <FiFile className="w-4 h-4 text-blue-600" />
                <VisualizadorArquivo url={valor} nome={nomeArquivo} />
              </div>
            )
          }
          return <div className="text-sm text-gray-400">N/A</div>
        }
        return <div className="text-sm truncate">{String(params.value)}</div>
      },
    }
  })

  type Campo = {
    id: number
    nome: string
    tipo: string
    obrigatorio: boolean
  }

  type ValoresAPI = {
    id: string
    departamento: string | null
    empresa: string
    valores: Record<string, string>
    arquivos?: { id: string; nome_campo: string; arquivo: string }[]
  }

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true)
        const res = await buscarDados()
        if (!res) {
          setTimeout(() => {
            Swal.fire("Não Estás Autenticado", "Inicie Sessão Para Navegar", "warning")
          }, 2000)
        } else {
          setApresentar(true)
          setData(res)
          setEmpresa(res.empresa.nome)
          await Campos()
          await Pegar()
        }
      } catch (error) {
        Swal.fire("Erro", "Falha ao carregar dados", "error")
      } finally {
        setLoading(false)
      }
    }
    Departamanto()
    carregar()
  }, [])

  const [row, setRow] = useState<ValoresAPI[]>([])

  const rows = row.map((i) => {
    const rowData: Record<string, any> = {
      id: i.id,
      ...i.valores,
    }
    if (i.arquivos && i.arquivos.length > 0) {
      i.arquivos.forEach((file) => {
        rowData[file.nome_campo] = file.arquivo
      })
    }
    return rowData
  })

  const handleEvent: GridEventListener<"rowClick"> = (params) => {
    const id = params.row.id
    console.log("ID do funcionario", id)
    router.push(`/list/funciona/${id}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    const valoresJSON: Record<string, any> = {}

    for (const key in valores) {
      const valor = valores[key]
      if (valor instanceof File) {
        formData.append(key, valor)
      } else if (valor !== null && valor !== undefined) {
        valoresJSON[key] = valor
      }
    }

    formData.append("valores", JSON.stringify(valoresJSON))
    formData.append("empresa", "20866411-4d42-4115-9bc1-2ec6427ace1d")
    formData.append("departamento", departamentoSelecionado)
    formData.append("salario_bruto", JSON.stringify(salario_bruto))

    try {
      const res = await fetch("http://localhost:8000/valores/", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      if (res.ok) {
        setAbrir(false)
        Swal.fire({
          title: "Adicionado!",
          text: "Dados enviados com sucesso.",
          icon: "success",
          confirmButtonColor: "#6D28D9",
        })
        Pegar()
        setValores({})
      } else {
        const errorData = await res.json()
        console.error("Erro do servidor:", errorData)
        Swal.fire({
          title: "Erro!",
          text: errorData.detail || "Ocorreu um erro ao enviar os dados.",
          icon: "error",
          confirmButtonColor: "#6D28D9",
        })
      }
    } catch (err: any) {
      console.error("Erro de rede:", err)
      Swal.fire({
        title: "Erro!",
        text: "Ocorreu um erro de conexão ao enviar os dados.",
        icon: "error",
        confirmButtonColor: "#6D28D9",
      })
    }
  }

  const Campos = async () => {
    try {
      const res = await fetch("http://localhost:8000/campos/empresa/", {
        method: "GET",
        credentials: "include",
      })
      const data = await res.json()
      if (res.ok) {
        setCampos(data)
      } else {
        throw new Error("Falha ao buscar campos")
      }
    } catch (err) {
      Swal.fire("Erro", "Falha ao buscar campos personalizados", "error")
    }
  }

  const Pegar = async () => {
    try {
      const res = await fetch("http://localhost:8000/valores/", {
        method: "GET",
        credentials: "include",
      })
      const data: ValoresAPI[] = await res.json()
      if (res.ok) {
        
        setRow(data)
        
        console.log("NOO",data)
      } else {
        throw new Error("Falha ao buscar valores")
      }
    } catch (err) {
      Swal.fire("Erro", "Falha ao buscar dados dos funcionários", "error")
    }
  }
  const Departamanto = async () => {
    try {
      const res = await fetch("http://localhost:8000/departamentos/", {
        method: "GET",
        credentials: "include",
      })
      const data = await res.json() 
      if (res.ok) {
        setDepartamentos(data.dados)
        console.log("Departamentos",data.dados)
      } else {
        throw new Error("Falha ao buscar Departamentos")
      }
    } catch (err) {
      Swal.fire("Erro", "Falha ao buscar dados dos funcionários", "error")
    }
  }

  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto">
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-[500px] w-full" />
        </div>
      ) : apresentar ? (
        <Card className="border-none shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FiUser className="text-purple-600" /> Funcionários
                </CardTitle>
                <p className="text-gray-500 mt-1">Gerencie os funcionários da {empresa}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  {row.length} {row.length === 1 ? "funcionário" : "funcionários"}
                </Badge>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                  onClick={() => setAbrir(true)}
                >
                  <FiPlus /> Adicionar Funcionário
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Dialog open={abrir} onOpenChange={setAbrir}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <DialogTitle className="text-xl">Adicionar Novo Funcionário</DialogTitle>
                      <DialogDescription>Preencha os dados do funcionário da {empresa}</DialogDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setAbrir(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX />
                    </Button>
                  </div>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                    {campos.map((campo) => (
                      <div key={campo.id} className="flex flex-col space-y-2">
                        <Label htmlFor={campo.nome}>
                          {campo.nome}
                          {campo.obrigatorio && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {campo.tipo === "file" ? (
                          <>
                            <Input
                              id={campo.nome}
                              type="file"
                              required={campo.obrigatorio}
                              onChange={(e) => {
                                setValores((prev) => ({
                                  ...prev,
                                  [campo.nome]: e.target.files?.[0] || null,
                                }))
                              }}
                              className="border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150"
                            />
                            {valores[campo.nome] instanceof File && (
                              <p className="text-sm text-gray-500 mt-1">
                                Arquivo selecionado: {(valores[campo.nome] as File).name}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <Input
                              id={campo.nome}
                              type={campo.tipo}
                              required={campo.obrigatorio}
                              placeholder={`Digite ${campo.nome.toLowerCase()}`}
                              value={(valores[campo.nome] as string) || ""}
                              onChange={(e) => {
                                setValores((prev) => ({
                                  ...prev,
                                  [campo.nome]: e.target.value,
                                }))
                              }}
                              className={cn(
                                "border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 transition duration-150",
                                campo.obrigatorio && !valores[campo.nome]
                                  ? "focus:ring-red-300"
                                  : "focus:ring-purple-500",
                              )}
                            />
                          </>
                        )}

                      </div>
                    ))}
                  </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                      <div className='flex flex-col gap-2'>
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select value={departamentoSelecionado} onValueChange={setDepartamentoSelecionado}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departamentos.map((departamento) => (
                        <SelectItem key={departamento.id} value={departamento.id}>
                          {departamento.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                      <div>
                        <Label>Salário Bruto</Label>
                      <Input

                      value={salario_bruto}
                      onChange={(e)=>setsalario_bruto(Number(e.target.value))}
                      type="number"
                      placeholder="300.000"
                      required
                      className="border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 transition duration-150"
                      
                      /></div>
                    </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <Button variant="outline" type="button" onClick={() => setAbrir(false)} className="border-gray-300">
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                    >
                      <FiCheck /> Registrar Funcionário
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Box sx={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                disableColumnMenu={false}
                pageSizeOptions={[5, 10, 25]}
                checkboxSelection
                disableRowSelectionOnClick
                onRowClick={handleEvent}
                sx={{
                  "& .MuiDataGrid-row": {
                    "&:hover": {
                      backgroundColor: "rgba(109, 40, 217, 0.05)",
                    },
                  },
                  "& .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f9fafb",
                    fontWeight: "bold",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    backgroundColor: "#f9fafb",
                  },
                  "& .MuiDataGrid-cell": {
                    display: "flex",
                    alignItems: "center",
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      ) : null}
    </main>
  )
}
