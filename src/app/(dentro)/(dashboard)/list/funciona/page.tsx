"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { buscarDados, fetchAPI } from "@/lib/api"
import { MetricCard } from "@/components/metrcCard"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  FiPlus,
  FiUser,
  FiX,
  FiCheck,
  FiDownload,
  FiEye,
  FiFile,
  FiUsers,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiSave,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"
import { Users, Building, DollarSign, ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

const VisualizadorArquivo = ({ url, nome }: { url: string; nome: string }) => {
  const [abrir, setAbrir] = useState(false)
  const [tipoArquivo, setTipoArquivo] = useState("")
  const urlCompleta = `https://avdserver.up.railway.app${url}`

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
      <Button
        variant="outline"
        size="sm"
        onClick={baixarArquivo}
        className="flex items-center gap-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
      >
        <FiDownload className="h-4 w-4" /> Baixar
      </Button>
      {tipoArquivo === "pdf" || tipoArquivo === "imagem" ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleVisualizarClick}
          className="flex items-center gap-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
        >
          <FiEye className="h-4 w-4" /> Ver
        </Button>
      ) : null}

      <Dialog open={abrir} onOpenChange={setAbrir}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">Visualizar Arquivo</DialogTitle>
            <DialogDescription className="text-sm text-slate-400">{nome}</DialogDescription>
          </DialogHeader>
          <div className="h-[70vh] flex justify-center items-center bg-slate-900 rounded-lg">
            {tipoArquivo === "pdf" ? (
              <iframe
                src={urlCompleta}
                className="w-full h-full border-0 rounded-lg"
                title={`Visualização do arquivo ${nome}`}
              />
            ) : tipoArquivo === "imagem" ? (
              <Image
                src={urlCompleta || "/placeholder.svg"}
                alt={`Visualização do arquivo ${nome}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                width={800}
                height={600}
              />
            ) : (
              <div className="text-center p-6">
                <FiFile className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">Visualização não disponível para este tipo de arquivo</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setAbrir(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Fechar
            </Button>
            <Button
              onClick={baixarArquivo}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              <FiDownload className="mr-2 h-4 w-4" /> Baixar Arquivo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const PerfilFuncionarioModal = ({
  funcionario,
  open,
  onOpenChange,
}: {
  funcionario: any
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  if (!funcionario) return null

  const getValor = (campo: string) => {
    return funcionario.valores?.[campo] || "Não informado"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-semibold text-white">Perfil do Funcionário</DialogTitle>
              <DialogDescription className="text-sm text-slate-400">
                Informações detalhadas do colaborador
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-white rounded-full"
            >
              <FiX className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-slate-700">
            <Avatar className="w-20 h-20 border-4 border-slate-700 shadow-md">
              <AvatarImage src={funcionario.foto || "/placeholder-user.jpg"} />
              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-semibold">
                {getValor("Nome")?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{getValor("Nome")}</h3>
              <p className="text-slate-400">{getValor("Cargo")}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  {funcionario.departamento || "Sem departamento"}
                </Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                  Ativo
                </Badge>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white flex items-center gap-2">
              <FiEdit className="w-4 h-4" /> Editar Perfil
            </Button>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-700">
              <TabsTrigger
                value="info"
                className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-slate-600"
              >
                <FiUser className="w-4 h-4" /> Informações
              </TabsTrigger>
              <TabsTrigger
                value="documentos"
                className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-slate-600"
              >
                <FiFile className="w-4 h-4" /> Documentos
              </TabsTrigger>
              <TabsTrigger
                value="historico"
                className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-slate-600"
              >
                <FiClock className="w-4 h-4" /> Histórico
              </TabsTrigger>
              <TabsTrigger
                value="contato"
                className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-slate-600"
              >
                <FiUsers className="w-4 h-4" /> Contato
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <Label className="text-sm font-medium text-slate-400">Cargo</Label>
                  <p className="text-white font-medium mt-1">{getValor("Cargo")}</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <Label className="text-sm font-medium text-slate-400">Departamento</Label>
                  <p className="text-white font-medium mt-1">{funcionario.departamento || "Não informado"}</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <Label className="text-sm font-medium text-slate-400">Data de Admissão</Label>
                  <p className="text-white font-medium mt-1">{getValor("data_admissao")}</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <Label className="text-sm font-medium text-slate-400">Salário</Label>
                  <p className="text-white font-medium mt-1">
                    {funcionario.salario_bruto
                      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          Number(funcionario.salario_bruto),
                        )
                      : "Não informado"}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Fechar
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white flex items-center gap-2">
              <FiEdit className="w-4 h-4" /> Editar Funcionário
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function EmployeeDashboard() {
  type valorcampo = string | File | null
  const search = useSearchParams()
  const [salario_bruto, setsalario_bruto] = useState(0)
  const abrirDialog = search.get("abrirDialog") === "true"
  const [data, setData] = useState<any>()
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [campos, setCampos] = useState<Campo[]>([])
  const [valores, setValores] = useState<Record<string, valorcampo>>({})
  const [empresa, setEmpresa] = useState("")
  const router = useRouter()
  const [abrir, setAbrir] = useState(abrirDialog)
  const [apresentar, setApresentar] = useState(false)
  const [mapaDepartamentos, setMapaDepartamentos] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState<string>("")
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<any>(null)
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false)
  const [pesquisa, setPesquisa] = useState("")
  const [editandoId, setEditandoId] = useState<string | null>(null)
  console.log(departamentoSelecionado)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  useEffect(() => {
    console.log("Mapa de departamentos:", mapaDepartamentos)
  }, [mapaDepartamentos])

  useEffect(() => {
    console.log("Funcionário selecionado:", funcionarioSelecionado)
  }, [funcionarioSelecionado])
  const [stats, setStats] = useState({
    totalFuncionarios: 0,
    totalDepartamentos: 0,
    salarioMedio: 0,
    funcionariosAtivos: 0,
  })

  type Departamento = {
    id: string
    nome: string
  }

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
    salario_bruto: string
    arquivos?: { id: string; nome_campo: string; arquivo: string }[]
  }

  const handleEvent = (funcionarioSelecionado: any) => {
    router.push(`/list/funciona/${funcionarioSelecionado.id}`)
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

  useEffect(() => {
    if (row.length > 0) {
      const totalSalarios = row.reduce((acc, curr) => {
        const salario = Number.parseFloat(curr.salario_bruto || "0")
        return acc + salario
      }, 0)

      setStats({
        totalFuncionarios: row.length,
        totalDepartamentos: new Set(row.map((r) => r.departamento)).size,
        salarioMedio: totalSalarios / row.length,
        funcionariosAtivos: row.length,
      })
    }
  }, [row])

  const rows = row.map((i) => {
    const rowData: Record<string, any> = {
      id: i.id,
      departamento: i.departamento || "Sem Departamento",
      departamentoId: i.departamento,
      salario_bruto: Number.parseFloat(i.salario_bruto || "0"),
      ...i.valores,
    }
    if (i.arquivos && i.arquivos.length > 0) {
      i.arquivos.forEach((file) => {
        rowData[file.nome_campo] = file.arquivo
      })
    }
    return rowData
  })

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) => String(value).toLowerCase().includes(pesquisa.toLowerCase())),
  )

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortField) return 0
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    const aStr = String(aValue).toLowerCase()
    const bStr = String(bValue).toLowerCase()

    if (sortDirection === "asc") {
      return aStr.localeCompare(bStr)
    }
    return bStr.localeCompare(aStr)
  })

  const totalPages = Math.ceil(sortedRows.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRows = sortedRows.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const toggleAllRows = () => {
    if (selectedRows.size === paginatedRows.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedRows.map((r) => r.id)))
    }
  }

  const handleEditar = (id: string) => {
    setEditandoId(id)
    const funcionario = row.find((f) => f.id === id)
    if (funcionario) {
      setValores(funcionario.valores)
      setDepartamentoSelecionado(funcionario.departamento || "")
      setsalario_bruto(Number.parseFloat(funcionario.valores.salario_bruto || "0"))
      setAbrir(true)
    }
  }

  const handleExcluir = async (pk: string) => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: "Esta ação não pode ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
      background: "#1e293b",
      color: "white",
    })

    if (result.isConfirmed) {
      try {
        await fetchAPI(`/valores/${pk}/`, {
          method: "DELETE",
        })

        Swal.fire({
          title: "Excluído!",
          text: "Funcionário excluído com sucesso.",
          icon: "success",
          background: "#1e293b",
          color: "white",
          confirmButtonColor: "#0ea5e9",
        })
        Pegar()
      } catch (error) {
        Swal.fire({
          title: "Erro!",
          text: "Falha ao excluir funcionário.",
          icon: "error",
          background: "#1e293b",
          color: "white",
        })
      }
    }
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
    formData.append("departamento", departamentoSelecionado)
    formData.append("salario_bruto", JSON.stringify(salario_bruto))

    const url = editandoId ? `/valores/${editandoId}/` : "/valores/"
    const method = editandoId ? "PUT" : "POST"

    try {
      await fetchAPI(url, {
        method,
        body: formData,
      })

      setAbrir(false)
      setEditandoId(null)
      Swal.fire({
        title: editandoId ? "Atualizado!" : "Adicionado!",
        text: editandoId ? "Dados atualizados com sucesso." : "Dados enviados com sucesso.",
        icon: "success",
        confirmButtonColor: "#0ea5e9",
        background: "#1e293b",
        color: "white",
      })
      Pegar()
      setValores({})
      setsalario_bruto(0)
      setDepartamentoSelecionado("")
    } catch (err: any) {
      console.error("Erro:", err)
      Swal.fire({
        title: "Erro!",
        text: err.message || "Ocorreu um erro ao enviar os dados.",
        icon: "error",
        confirmButtonColor: "#0ea5e9",
        background: "#1e293b",
        color: "white",
      })
    }
  }

  const Campos = async () => {
    try {
      const data = await fetchAPI("/campos/empresa/com-uso/")
      setCampos(data)
    } catch (err) {
      Swal.fire("Erro", "Falha ao buscar campos personalizados", "error")
    }
  }

  const Pegar = async () => {
    try {
      const data: ValoresAPI[] = await fetchAPI("/valores/")
      setRow(data)
    } catch (err) {
      Swal.fire("Erro", "Falha ao buscar dados dos funcionários", "error")
    }
  }

  const Departamanto = async () => {
    try {
      const data = await fetchAPI("/departamentos/")

      console.log("Resposta completa da API:", data)

      let departamentosData: Departamento[] = []

      if (Array.isArray(data)) {
        departamentosData = data
      } else if (data.dados && Array.isArray(data.dados)) {
        departamentosData = data.dados
      } else if (data.data && Array.isArray(data.data)) {
        departamentosData = data.data
      } else {
        console.warn("Estrutura de dados inesperada:", data)
        departamentosData = []
      }

      setDepartamentos(departamentosData)

      const mapa: Record<string, string> = {}
      departamentosData.forEach((dept) => {
        mapa[dept.id] = dept.nome
      })
      setMapaDepartamentos(mapa)
      console.log("Mapa de departamentos criado:", mapa)
    } catch (err) {
      console.error("Erro ao carregar departamentos:", err)
      Swal.fire("Erro", "Falha ao buscar departamentos", "error")
      setDepartamentos([])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-1/3 bg-slate-700" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl bg-slate-700" />
            ))}
          </div>
          <Skeleton className="h-[500px] w-full rounded-xl bg-slate-700" />
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {apresentar ? (
            <>
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
                    <Users className="text-cyan-400" />
                    Gestão de Funcionários
                  </h1>
                  <p className="text-slate-300 text-lg">
                    Gerencie os funcionários da <span className="text-cyan-400 font-semibold">{empresa}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard
                    title="Total Funcionários"
                    value={stats.totalFuncionarios.toString()}
                    icon={Users}
                    description="Colaboradores ativos"
                    trend={{ value: 5.2, isPositive: true }}
                  />
                  <MetricCard
                    title="Departamentos"
                    value={stats.totalDepartamentos.toString()}
                    icon={Building}
                    description="Áreas ativas"
                    trend={{ value: 2, isPositive: true }}
                  />
                  <MetricCard
                    title="Salário Médio"
                    value={new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "AOA",
                      maximumFractionDigits: 0,
                    }).format(stats.salarioMedio)}
                    icon={DollarSign}
                    description="Média salarial"
                    trend={{ value: 3.5, isPositive: true }}
                  />
                </div>
              </div>

              <Card className="border-0 shadow-lg bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader className="pb-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <CardTitle className="text-xl font-semibold text-white">Lista de Funcionários</CardTitle>
                      <CardDescription className="text-slate-400 text-sm mt-1">
                        Gerencie e visualize todos os funcionários do sistema
                      </CardDescription>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-[1fr_auto] gap-3 items-center w-full">
                      <div className="relative w-full min-w-0">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          placeholder="Pesquisar funcionários..."
                          value={pesquisa}
                          onChange={(e) => setPesquisa(e.target.value)}
                          className="pl-10 pr-4 py-2 w-full bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        />
                      </div>

                      <div className=" flex-col sm:flex-row items-center gap-2 justify-end xs:justify-start w-full xs:w-auto">
                        <Badge
                          variant="secondary"
                          className="px-3 py-1.5 text-sm bg-slate-700 text-slate-300 whitespace-nowrap flex-shrink-0"
                        >
                          {filteredRows.length} {filteredRows.length === 1 ? "funcionário" : "funcionários"}
                        </Badge>
                        <Link href={"/personaliza"}>
                          <Button className="bg-gradient-to-r from-cyan-900 to-blue-900 hover:from-cyan-600 hover:to-blue-700 text-white flex items-center gap-2 shadow-sm whitespace-nowrap flex-shrink-0 min-w-0">
                            Criar Novos campos
                          </Button>
                        </Link>
                        <Button
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white flex items-center gap-2 shadow-sm whitespace-nowrap flex-shrink-0 min-w-0"
                          onClick={() => {
                            setEditandoId(null)
                            setValores({})
                            setAbrir(true)
                          }}
                          size="sm"
                        >
                          <FiPlus className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate hidden sm:inline">Adicionar Funcionário</span>
                          <span className="truncate sm:hidden">Adicionar</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-0">
                  <Dialog open={abrir} onOpenChange={setAbrir}>
                    <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-slate-800 border-slate-700">
                      <DialogHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <DialogTitle className="text-xl font-semibold text-white">
                              {editandoId ? "Editar Funcionário" : "Adicionar Novo Funcionário"}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-400">
                              {editandoId
                                ? "Atualize os dados do funcionário"
                                : `Preencha os dados do funcionário da ${empresa}`}
                            </DialogDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setAbrir(false)
                              setEditandoId(null)
                            }}
                            className="text-slate-400 hover:text-white rounded-full"
                          >
                            <FiX className="w-4 h-4" />
                          </Button>
                        </div>
                      </DialogHeader>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {campos.map((campo) => (
                            <div key={campo.id} className="space-y-2">
                              <Label htmlFor={campo.nome} className="text-sm font-medium text-slate-300">
                                {campo.nome}
                                {campo.obrigatorio && <span className="text-red-400 ml-1">*</span>}
                              </Label>
                              {campo.tipo === "file" ? (
                                <>
                                  <Input
                                    id={campo.nome}
                                    type="file"
                                    required={campo.obrigatorio && !editandoId}
                                    onChange={(e) => {
                                      setValores((prev) => ({
                                        ...prev,
                                        [campo.nome]: e.target.files?.[0] || null,
                                      }))
                                    }}
                                    className="border border-slate-600 bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150"
                                  />
                                  {valores[campo.nome] instanceof File && (
                                    <p className="text-sm text-green-400 mt-1">
                                      Arquivo selecionado: {(valores[campo.nome] as File).name}
                                    </p>
                                  )}
                                </>
                              ) : (
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
                                    "border bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition duration-150",
                                    campo.obrigatorio && !valores[campo.nome]
                                      ? "border-red-500/50 focus:ring-red-500"
                                      : "border-slate-600 focus:ring-cyan-500 focus:border-transparent",
                                  )}
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700">
                          <div className="space-y-2">
                            <Label htmlFor="departamento" className="text-sm font-medium text-slate-300">
                              Departamento
                            </Label>
                            <Select value={departamentoSelecionado} onValueChange={setDepartamentoSelecionado}>
                              <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500">
                                <SelectValue placeholder="Selecione um departamento" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-600">
                                {departamentos?.map((departamento) => (
                                  <SelectItem
                                    key={departamento.id}
                                    value={departamento.id}
                                    className="text-white hover:bg-slate-700"
                                  >
                                    {departamento.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-300">Salário Bruto</Label>
                            <Input
                              value={salario_bruto}
                              onChange={(e) => setsalario_bruto(Number(e.target.value))}
                              type="number"
                              placeholder="Ex: 3000.00"
                              required
                              className="bg-slate-700 border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => {
                              setAbrir(false)
                              setEditandoId(null)
                            }}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white flex items-center gap-2 shadow-sm"
                          >
                            {editandoId ? <FiSave className="w-4 h-4" /> : <FiCheck className="w-4 h-4" />}
                            {editandoId ? "Atualizar" : "Registrar"} Funcionário
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <PerfilFuncionarioModal
                    funcionario={funcionarioSelecionado}
                    open={modalPerfilAberto}
                    onOpenChange={setModalPerfilAberto}
                  />

                  <div className="rounded-lg border border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-800/80 hover:bg-slate-800/80 border-slate-700">
                            <TableHead className="w-12">
                              <Checkbox
                                checked={selectedRows.size === paginatedRows.length && paginatedRows.length > 0}
                                onCheckedChange={toggleAllRows}
                                className="border-slate-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                              />
                            </TableHead>
                            {campos.map((campo) => (
                              <TableHead key={campo.id} className="text-slate-300 font-semibold">
                                <button
                                  onClick={() => handleSort(campo.nome)}
                                  className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                                >
                                  {campo.nome}
                                  <ArrowUpDown className="w-4 h-4" />
                                </button>
                              </TableHead>
                            ))}
                            <TableHead className="text-slate-300 font-semibold">
                              <button
                                onClick={() => handleSort("departamento")}
                                className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                              >
                                Departamento
                                <ArrowUpDown className="w-4 h-4" />
                              </button>
                            </TableHead>
                            <TableHead className="text-slate-300 font-semibold text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedRows.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={campos.length + 3} className="text-center py-12 text-slate-400">
                                <FiUsers className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                                <p>Nenhum funcionário encontrado</p>
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginatedRows.map((rowData) => {
                              const funcionario = row.find((f) => f.id === rowData.id)
                              return (
                                <TableRow
                                  key={rowData.id}
                                  className="border-slate-700 hover:bg-cyan-500/5 transition-colors cursor-pointer"
                                  onClick={() => {
                                    setFuncionarioSelecionado(funcionario)
                                    setModalPerfilAberto(true)
                                  }}
                                >
                                  <TableCell onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                      checked={selectedRows.has(rowData.id)}
                                      onCheckedChange={() => toggleRowSelection(rowData.id)}
                                      className="border-slate-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                                    />
                                  </TableCell>
                                  {campos.map((campo) => (
                                    <TableCell key={campo.id} className="text-slate-300">
                                      {campo.tipo === "file" ? (
                                        <div onClick={(e) => e.stopPropagation()}>
                                          {rowData[campo.nome] ? (
                                            <div className="flex items-center gap-2">
                                              <FiFile className="w-4 h-4 text-cyan-400" />
                                              <VisualizadorArquivo
                                                url={rowData[campo.nome]}
                                                nome={rowData[campo.nome].split("/").pop() || "Arquivo"}
                                              />
                                            </div>
                                          ) : (
                                            <span className="text-sm text-slate-500">N/A</span>
                                          )}
                                        </div>
                                      ) : campo.nome === "salario_bruto" ? (
                                        new Intl.NumberFormat("pt-BR", {
                                          style: "currency",
                                          currency: "BRL",
                                        }).format(Number(rowData[campo.nome]) || 0)
                                      ) : (
                                        String(rowData[campo.nome] || "N/A")
                                      )}
                                    </TableCell>
                                  ))}
                                  <TableCell className="text-slate-300">
                                    <Badge
                                      variant="secondary"
                                      className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                                    >
                                      {rowData.departamento || "Sem Departamento"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex gap-2 justify-end">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setFuncionarioSelecionado(funcionario)
                                          setModalPerfilAberto(true)
                                          handleEvent(funcionario)
                                        }}
                                        className="flex items-center gap-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                                      >
                                        <FiEye className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleEditar(rowData.id)
                                        }}
                                        className="flex items-center gap-1 border-green-500/30 text-green-400 hover:bg-green-500/10"
                                      >
                                        <FiEdit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleExcluir(rowData.id)
                                        }}
                                        className="flex items-center gap-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                                      >
                                        <FiTrash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700 bg-slate-800/50">
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-slate-400">
                          Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, sortedRows.length)} de{" "}
                          {sortedRows.length} funcionários
                        </p>
                        <Select
                          value={itemsPerPage.toString()}
                          onValueChange={(value) => {
                            setItemsPerPage(Number(value))
                            setCurrentPage(1)
                          }}
                        >
                          <SelectTrigger className="w-24 bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="5" className="text-white hover:bg-slate-700">
                              5
                            </SelectItem>
                            <SelectItem value="10" className="text-white hover:bg-slate-700">
                              10
                            </SelectItem>
                            <SelectItem value="25" className="text-white hover:bg-slate-700">
                              25
                            </SelectItem>
                            <SelectItem value="50" className="text-white hover:bg-slate-700">
                              50
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                        >
                          <FiChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum
                            if (totalPages <= 5) {
                              pageNum = i + 1
                            } else if (currentPage <= 3) {
                              pageNum = i + 1
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i
                            } else {
                              pageNum = currentPage - 2 + i
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className={cn(
                                  "w-8 h-8",
                                  currentPage === pageNum
                                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                                    : "border-slate-600 text-slate-300 hover:bg-slate-700",
                                )}
                              >
                                {pageNum}
                              </Button>
                            )
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                        >
                          <FiChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </main>
    </TooltipProvider>
  )
}
