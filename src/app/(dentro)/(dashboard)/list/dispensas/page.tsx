"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MetricCard } from "@/components/metrcCard"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import {
  Check,
  X,
  Download,
  Trash2,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  ArrowUpDown,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  CalendarDays,
} from "lucide-react"
import { format, parseISO, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import Swal from "sweetalert2"

export type Leave = {
  id: number
  motivo: string
  inicio: string
  fim: string
  justificativo: string
  status: "pendente" | "aprovado" | "rejeitado"
  admin_comentario: string | null
  por: string
  created_at: string
  funcionario_nome?: string
  funcionario_cargo?: string
}

const STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "pendente", label: "Pendentes" },
  { value: "aprovado", label: "Aprovados" },
  { value: "rejeitado", label: "Rejeitados" },
]

const ITEMS_PER_PAGE = 8

export default function AdminLeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState<{ key: keyof Leave; direction: "asc" | "desc" } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR })
  }

  const calculateDays = (start: string, end: string): number => {
    return differenceInDays(parseISO(end), parseISO(start)) + 1
  }

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("https://recursohumanosactualizado.onrender.com/dispensa/todas/", { credentials: "include" })

      if (!response.ok) throw new Error("Falha ao carregar dispensas")

      const data = await response.json()
      setLeaves(data || [])
    } catch (err) {
      setError("Não foi possível carregar os pedidos de dispensa")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeaves()
  }, [fetchLeaves])

  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "pendente").length,
    approved: leaves.filter((l) => l.status === "aprovado").length,
    rejected: leaves.filter((l) => l.status === "rejeitado").length,
    totalDays: leaves.reduce((acc, l) => acc + calculateDays(l.inicio, l.fim), 0),
  }

  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch =
      leave.funcionario_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.motivo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || leave.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedLeaves = [...filteredLeaves].sort((a, b) => {
    if (!sortConfig) return 0

    const key = sortConfig.key
    if (a[key]! < b[key]!) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (a[key]! > b[key]!) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  const totalPages = Math.ceil(sortedLeaves.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedLeaves = sortedLeaves.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const exportPDF = useCallback(() => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text("Relatório de Pedidos de Dispensa", 15, 15)
    doc.setFontSize(10)
    doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`, 15, 22)

    autoTable(doc, {
      head: [["Funcionário", "Cargo", "Motivo", "Período", "Dias", "Status", "Feedback"]],
      body: sortedLeaves.map((leave) => [
        leave.funcionario_nome || "-",
        leave.funcionario_cargo || "-",
        leave.motivo,
        `${formatDate(leave.inicio)} - ${formatDate(leave.fim)}`,
        calculateDays(leave.inicio, leave.fim).toString(),
        leave.status,
        leave.admin_comentario || "-",
      ]),
      startY: 30,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] },
    })

    doc.save(`relatorio-dispensas-${format(new Date(), "yyyyMMdd")}.pdf`)

    toast({
      title: "Relatório Exportado!",
      description: "O PDF foi gerado com sucesso",
    })
  }, [sortedLeaves, toast])

  const confirmAction = async (message: string) => {
    return Swal.fire({
      title: "Tem certeza?",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      background: "#1e293b",
      color: "white",
    })
  }

  const deleteLeave = async (id: number) => {
    const confirmation = await confirmAction("Esta ação não pode ser desfeita!")
    if (!confirmation.isConfirmed) return

    try {
      const response = await fetch(`https://recursohumanosactualizado.onrender.com/deletar-dispensa/${id}/`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) throw new Error("Falha ao deletar dispensa")

      setLeaves((prev) => prev.filter((leave) => leave.id !== id))
      toast({
        title: "Sucesso!",
        description: "Dispensa removida com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a dispensa",
        variant: "destructive",
      })
    }
  }

  const updateLeaveStatus = async (id: number, status: "aprovado" | "rejeitado") => {
    const { value: comment } = await Swal.fire({
      title: status === "aprovado" ? "Comentário de aprovação" : "Comentário de reprovação",
      input: "textarea",
      inputPlaceholder: "Digite seu comentário aqui...",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#64748b",
      background: "#1e293b",
      color: "white",
      inputValidator: (value) => !value && "Por favor, digite um comentário!",
    })

    if (!comment) return

    try {
      const response = await fetch(`https://recursohumanosactualizado.onrender.com/actualizar/${id}/`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, admin_comentario: comment }),
      })

      if (!response.ok) throw new Error()

      setLeaves((prev) =>
        prev.map((leave) => (leave.id === id ? { ...leave, status, admin_comentario: comment } : leave)),
      )

      toast({
        title: "Atualizado!",
        description: `Status alterado para ${status}`,
      })
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      })
    }
  }

  const requestSort = (key: keyof Leave) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const renderStatusBadge = (status: Leave["status"]) => {
    const variants = {
      pendente: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      aprovado: "bg-green-500/20 text-green-400 border-green-500/30",
      rejeitado: "bg-red-500/20 text-red-400 border-red-500/30",
    }

    const labels = {
      pendente: "Pendente",
      aprovado: "Aprovado",
      rejeitado: "Rejeitado",
    }

    return <Badge className={`${variants[status]} capitalize border`}>{labels[status]}</Badge>
  }

  const openDetails = (leave: Leave) => {
    setSelectedLeave(leave)
    setIsDetailOpen(true)
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Erro ao carregar dados</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <Button
          onClick={fetchLeaves}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Gestão de Dispensas
            </h1>
            <p className="text-lg text-slate-300">
              {filteredLeaves.length} {filteredLeaves.length === 1 ? "registro encontrado" : "registros encontrados"}
            </p>
          </div>

          <Button
            onClick={exportPDF}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard
            title="Total de Dispensas"
            value={stats.total.toString()}
            icon={CalendarDays}
            description="Todos os pedidos"
            trend={{ value: 0, isPositive: true }}
          />
          <MetricCard
            title="Pendentes"
            value={stats.pending.toString()}
            icon={Clock}
            description="Aguardando análise"
            trend={{ value: 0, isPositive: false }}
          />
          <MetricCard
            title="Aprovadas"
            value={stats.approved.toString()}
            icon={CheckCircle}
            description="Dispensas aprovadas"
            trend={{ value: 0, isPositive: true }}
          />
          <MetricCard
            title="Rejeitadas"
            value={stats.rejected.toString()}
            icon={XCircle}
            description="Dispensas rejeitadas"
            trend={{ value: 0, isPositive: false }}
          />
          <MetricCard
            title="Total de Dias"
            value={stats.totalDays.toString()}
            icon={Calendar}
            description="Dias de dispensa"
            trend={{ value: 0, isPositive: true }}
          />
        </div>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <CardTitle className="text-white">Pedidos de Dispensa</CardTitle>
                <CardDescription className="text-slate-400">
                  Gerencie e analise todos os pedidos de dispensa
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar funcionário ou motivo..."
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-white">
                    <Filter className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border border-slate-600">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-600 hover:bg-slate-700/50">
                    <TableHead className="text-slate-300">
                      <button
                        className="flex items-center gap-1 font-medium hover:text-white transition-colors"
                        onClick={() => requestSort("funcionario_nome")}
                      >
                        Funcionário
                        <ArrowUpDown size={14} />
                      </button>
                    </TableHead>
                    <TableHead className="text-slate-300">Motivo</TableHead>
                    <TableHead className="text-slate-300">
                      <button
                        className="flex items-center gap-1 font-medium hover:text-white transition-colors"
                        onClick={() => requestSort("inicio")}
                      >
                        Período
                        <ArrowUpDown size={14} />
                      </button>
                    </TableHead>
                    <TableHead className="text-slate-300">Dias</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-right text-slate-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLeaves.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                          <CalendarDays className="h-12 w-12 text-slate-500 mb-3" />
                          <p className="text-slate-400">Nenhum pedido de dispensa encontrado</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedLeaves.map((leave) => (
                      <TableRow key={leave.id} className="border-slate-600 hover:bg-slate-700/50 transition-colors">
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <p className="text-white">{leave.funcionario_nome || "—"}</p>
                            <p className="text-sm text-slate-400">{leave.funcionario_cargo || "—"}</p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="truncate text-slate-300">{leave.motivo}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-white">{formatDate(leave.inicio)}</span>
                            <span className="text-xs text-slate-400">até {formatDate(leave.fim)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {calculateDays(leave.inicio, leave.fim)} dias
                          </Badge>
                        </TableCell>
                        <TableCell>{renderStatusBadge(leave.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                                  onClick={() => openDetails(leave)}
                                >
                                  <Eye size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-slate-700 border-slate-600 text-white">
                                <p>Ver detalhes</p>
                              </TooltipContent>
                            </Tooltip>

                            {leave.status === "pendente" && (
                              <>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => updateLeaveStatus(leave.id, "aprovado")}
                                    >
                                      <Check size={16} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-slate-700 border-slate-600 text-white">
                                    <p>Aprovar dispensa</p>
                                  </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="destructive"
                                      onClick={() => updateLeaveStatus(leave.id, "rejeitado")}
                                    >
                                      <X size={16} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-slate-700 border-slate-600 text-white">
                                    <p>Rejeitar dispensa</p>
                                  </TooltipContent>
                                </Tooltip>
                              </>
                            )}

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                                  onClick={() => deleteLeave(leave.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-slate-700 border-slate-600 text-white">
                                <p>Excluir dispensa</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""} text-slate-300 hover:bg-slate-700 hover:text-white`}
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i

                      return page <= totalPages ? (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                            className={`${
                              page === currentPage
                                ? "bg-cyan-500 text-white hover:bg-cyan-600"
                                : "text-slate-300 hover:bg-slate-700 hover:text-white"
                            }`}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ) : null
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : ""} text-slate-300 hover:bg-slate-700 hover:text-white`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        {isDetailOpen && selectedLeave && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Detalhes da Dispensa</h2>
                    <p className="text-slate-400">ID: #{selectedLeave.id}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                    onClick={() => setIsDetailOpen(false)}
                  >
                    <X size={20} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-400 mb-1">Funcionário</h3>
                      <p className="font-medium text-white">{selectedLeave.funcionario_nome || "—"}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-400 mb-1">Cargo</h3>
                      <p className="text-slate-300">{selectedLeave.funcionario_cargo || "—"}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-400 mb-1">Solicitado em</h3>
                      <p className="text-slate-300">
                        {format(parseISO(selectedLeave.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-400 mb-1">Período</h3>
                      <p className="text-slate-300">
                        {formatDate(selectedLeave.inicio)} - {formatDate(selectedLeave.fim)}
                        <span className="ml-2 text-sm text-slate-400">
                          ({calculateDays(selectedLeave.inicio, selectedLeave.fim)} dias)
                        </span>
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-400 mb-1">Status</h3>
                      <div className="mt-1">{renderStatusBadge(selectedLeave.status)}</div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-400 mb-1">Motivo</h3>
                      <p className="text-slate-300">{selectedLeave.motivo}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Justificativa</h3>
                  {selectedLeave.justificativo ? (
                    <a
                      href={selectedLeave.justificativo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <Download size={16} className="mr-2" />
                      Baixar documento
                    </a>
                  ) : (
                    <p className="text-slate-400">Nenhum documento anexado</p>
                  )}
                </div>

                {selectedLeave.status !== "pendente" && (
                  <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">
                      {selectedLeave.status === "aprovado" ? "Aprovado" : "Rejeitado"} por: {selectedLeave.por}
                    </h3>
                  </div>
                )}

                {selectedLeave.admin_comentario && (
                  <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Comentário do Administrador</h3>
                    <p className="text-slate-300">{selectedLeave.admin_comentario}</p>
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    onClick={() => setIsDetailOpen(false)}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 space-y-8">
    <div className="flex justify-between items-center">
      <div>
        <Skeleton className="h-10 w-64 mb-2 bg-slate-700" />
        <Skeleton className="h-4 w-48 bg-slate-700" />
      </div>
      <Skeleton className="h-10 w-40 bg-slate-700" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-lg bg-slate-700" />
      ))}
    </div>

    <Skeleton className="h-96 rounded-lg bg-slate-700" />
  </div>
)
