"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Search, DollarSign } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Recibo {
  id: number
  funcionario: {
    id: number
    nome: string
    cargo: string
  }
  mes: number
  ano: number
  salario_bruto: number
  total_descontos: number
  salario_liquido: number
  data_pagamento: string
  status: "pendente" | "pago" | "cancelado"
}

interface Estatisticas {
  total_recibos: number
  total_pago: number
  total_pendente: number
  valor_total_mes: number
}

export default function RecibosPage() {
  const [recibos, setRecibos] = useState<Recibo[]>([])
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    total_recibos: 0,
    total_pago: 0,
    total_pendente: 0,
    valor_total_mes: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filtroMes, setFiltroMes] = useState<string>(new Date().getMonth().toString())
  const [filtroAno, setFiltroAno] = useState<string>(new Date().getFullYear().toString())
  const [filtroBusca, setFiltroBusca] = useState("")

  useEffect(() => {
    const carregarDados = async () => {
    try {
      setLoading(true)
      const [recibosRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/recibos/?mes=${filtroMes}&ano=${filtroAno}`, { credentials: "include" }),
        fetch(`${API_URL}/recibos/estatisticas/?mes=${filtroMes}&ano=${filtroAno}`, { credentials: "include" }),
      ])

      if (recibosRes.ok) {
        const recibosData = await recibosRes.json()
        setRecibos(recibosData)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setEstatisticas(statsData)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }
    carregarDados()
  }, [filtroMes, filtroAno])

  

  const baixarRecibo = async (reciboId: number) => {
    try {
      const response = await fetch(`${API_URL}/recibos/${reciboId}/pdf/`, {
        credentials: "include",
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `recibo-${reciboId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Erro ao baixar recibo:", error)
    }
  }

  const recibosFiltrados = recibos.filter((recibo) =>
    recibo.funcionario.nome.toLowerCase().includes(filtroBusca.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pendente: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      pago: "bg-green-500/10 text-green-500 border-green-500/20",
      cancelado: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    const labels: Record<string, string> = {
      pendente: "Pendente",
      pago: "Pago",
      cancelado: "Cancelado",
    }
    return (
      <Badge variant="outline" className={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando recibos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Recibos de Pagamento</h1>
            <p className="text-slate-400">Visualize e gerencie os recibos de pagamento</p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Total de Recibos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-white">{estatisticas.total_recibos}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-white">{estatisticas.total_pago}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-white">{estatisticas.total_pendente}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Valor Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-white">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                  }).format(estatisticas.valor_total_mes)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por funcionário..."
                    value={filtroBusca}
                    onChange={(e) => setFiltroBusca(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>
              </div>
              <Select value={filtroMes} onValueChange={setFiltroMes}>
                <SelectTrigger className="w-full md:w-48 bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {meses.map((mes, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {mes}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filtroAno} onValueChange={setFiltroAno}>
                <SelectTrigger className="w-full md:w-32 bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {[2024, 2025, 2026].map((ano) => (
                    <SelectItem key={ano} value={ano.toString()}>
                      {ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recibos de Pagamento</CardTitle>
            <CardDescription className="text-slate-400">
              {recibosFiltrados.length} recibo(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-slate-300">Funcionário</TableHead>
                    <TableHead className="text-slate-300">Período</TableHead>
                    <TableHead className="text-slate-300">Salário Bruto</TableHead>
                    <TableHead className="text-slate-300">Descontos</TableHead>
                    <TableHead className="text-slate-300">Salário Líquido</TableHead>
                    <TableHead className="text-slate-300">Data Pagamento</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recibosFiltrados.map((recibo) => (
                    <TableRow key={recibo.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{recibo.funcionario.nome}</div>
                          <div className="text-sm text-slate-400">{recibo.funcionario.cargo}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {meses[recibo.mes]}/{recibo.ano}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(recibo.salario_bruto)}
                      </TableCell>
                      <TableCell className="text-red-400">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(recibo.total_descontos)}
                      </TableCell>
                      <TableCell className="text-green-400 font-semibold">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(recibo.salario_liquido)}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(recibo.data_pagamento).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>{getStatusBadge(recibo.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                          onClick={() => baixarRecibo(recibo.id)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
