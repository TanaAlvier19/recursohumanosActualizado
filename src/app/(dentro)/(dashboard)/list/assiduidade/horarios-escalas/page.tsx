"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Plus, Edit, Trash2, Users, Sun, Moon, Sunrise } from "lucide-react"

const turnos = [
  {
    id: 1,
    nome: "Comercial",
    entrada: "08:00",
    saida: "17:00",
    intervalo: "1h",
    funcionarios: 245,
    tipo: "fixo",
  },
  {
    id: 2,
    nome: "Manhã",
    entrada: "06:00",
    saida: "14:00",
    intervalo: "30min",
    funcionarios: 45,
    tipo: "fixo",
  },
  {
    id: 3,
    nome: "Tarde",
    entrada: "14:00",
    saida: "22:00",
    intervalo: "30min",
    funcionarios: 38,
    tipo: "fixo",
  },
  {
    id: 4,
    nome: "Noturno",
    entrada: "22:00",
    saida: "06:00",
    intervalo: "1h",
    funcionarios: 22,
    tipo: "fixo",
  },
  {
    id: 5,
    nome: "Flexível",
    entrada: "Variável",
    saida: "Variável",
    intervalo: "1h",
    funcionarios: 30,
    tipo: "flexivel",
  },
]

const escalas = [
  {
    id: 1,
    nome: "Escala 5x2",
    descricao: "5 dias trabalhados, 2 dias de folga",
    funcionarios: 180,
    departamentos: ["Operações", "Vendas"],
  },
  {
    id: 2,
    nome: "Escala 6x1",
    descricao: "6 dias trabalhados, 1 dia de folga",
    funcionarios: 95,
    departamentos: ["Produção", "Logística"],
  },
  {
    id: 3,
    nome: "Escala 12x36",
    descricao: "12 horas trabalhadas, 36 horas de folga",
    funcionarios: 45,
    departamentos: ["Segurança", "Portaria"],
  },
]

const horariosFlexiveis = [
  {
    id: 1,
    funcionario: "Ana Silva",
    departamento: "TI",
    horarioPreferencial: "09:00 - 18:00",
    cargaHoraria: "8h/dia",
    status: "ativo",
  },
  {
    id: 2,
    funcionario: "Carlos Mendes",
    departamento: "Marketing",
    horarioPreferencial: "10:00 - 19:00",
    cargaHoraria: "8h/dia",
    status: "ativo",
  },
  {
    id: 3,
    funcionario: "Beatriz Costa",
    departamento: "Design",
    horarioPreferencial: "08:30 - 17:30",
    cargaHoraria: "8h/dia",
    status: "ativo",
  },
]

export default function HorariosEscalasPage() {
  const [openTurno, setOpenTurno] = useState(false)
  const [openEscala, setOpenEscala] = useState(false)
  const [openFlexivel, setOpenFlexivel] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
              Horários e Escalas
            </h1>
            <p className="mt-2 text-slate-400">Gestão de turnos, escalas e horários flexíveis</p>
          </div>
        </div>

        <Tabs defaultValue="turnos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 lg:w-[600px]">
            <TabsTrigger value="turnos">Turnos de Trabalho</TabsTrigger>
            <TabsTrigger value="escalas">Escalas</TabsTrigger>
            <TabsTrigger value="flexivel">Horário Flexível</TabsTrigger>
          </TabsList>

          {/* Turnos de Trabalho */}
          <TabsContent value="turnos" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={openTurno} onOpenChange={setOpenTurno}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Turno
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-slate-700 bg-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Turno</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Configure um novo turno de trabalho
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nome-turno">Nome do Turno</Label>
                      <Input
                        id="nome-turno"
                        placeholder="Ex: Comercial, Manhã, Tarde..."
                        className="border-slate-700 bg-slate-900 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="entrada">Horário de Entrada</Label>
                        <Input id="entrada" type="time" className="border-slate-700 bg-slate-900 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="saida">Horário de Saída</Label>
                        <Input id="saida" type="time" className="border-slate-700 bg-slate-900 text-white" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="intervalo">Intervalo</Label>
                      <Select>
                        <SelectTrigger className="border-slate-700 bg-slate-900 text-white">
                          <SelectValue placeholder="Selecione o intervalo" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-700 bg-slate-800 text-white">
                          <SelectItem value="30min">30 minutos</SelectItem>
                          <SelectItem value="1h">1 hora</SelectItem>
                          <SelectItem value="1h30">1 hora e 30 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tipo">Tipo de Turno</Label>
                      <Select>
                        <SelectTrigger className="border-slate-700 bg-slate-900 text-white">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-700 bg-slate-800 text-white">
                          <SelectItem value="fixo">Fixo</SelectItem>
                          <SelectItem value="flexivel">Flexível</SelectItem>
                          <SelectItem value="rotativo">Rotativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                        onClick={() => setOpenTurno(false)}
                      >
                        Criar Turno
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                        onClick={() => setOpenTurno(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {turnos.map((turno) => (
                <Card key={turno.id} className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                        {turno.nome === "Manhã" && <Sunrise className="h-6 w-6 text-cyan-400" />}
                        {turno.nome === "Comercial" && <Sun className="h-6 w-6 text-amber-400" />}
                        {turno.nome === "Tarde" && <Sun className="h-6 w-6 text-orange-400" />}
                        {turno.nome === "Noturno" && <Moon className="h-6 w-6 text-indigo-400" />}
                        {turno.nome === "Flexível" && <Clock className="h-6 w-6 text-green-400" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{turno.nome}</h3>
                        <Badge
                          className={
                            turno.tipo === "fixo" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"
                          }
                        >
                          {turno.tipo === "fixo" ? "Fixo" : "Flexível"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-400">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Entrada</span>
                      <span className="font-semibold text-white">{turno.entrada}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Saída</span>
                      <span className="font-semibold text-white">{turno.saida}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Intervalo</span>
                      <span className="font-semibold text-white">{turno.intervalo}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-700 pt-3">
                      <span className="text-sm text-slate-400">Funcionários</span>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-cyan-400" />
                        <span className="font-semibold text-cyan-400">{turno.funcionarios}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Escalas */}
          <TabsContent value="escalas" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={openEscala} onOpenChange={setOpenEscala}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Escala
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-slate-700 bg-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Escala</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Configure uma nova escala de trabalho
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nome-escala">Nome da Escala</Label>
                      <Input
                        id="nome-escala"
                        placeholder="Ex: Escala 5x2, 6x1..."
                        className="border-slate-700 bg-slate-900 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Input
                        id="descricao"
                        placeholder="Descreva o padrão da escala"
                        className="border-slate-700 bg-slate-900 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dias-trabalho">Dias de Trabalho</Label>
                        <Input
                          id="dias-trabalho"
                          type="number"
                          placeholder="5"
                          className="border-slate-700 bg-slate-900 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dias-folga">Dias de Folga</Label>
                        <Input
                          id="dias-folga"
                          type="number"
                          placeholder="2"
                          className="border-slate-700 bg-slate-900 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                        onClick={() => setOpenEscala(false)}
                      >
                        Criar Escala
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                        onClick={() => setOpenEscala(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {escalas.map((escala) => (
                <Card key={escala.id} className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-white">{escala.nome}</h3>
                      <p className="text-sm text-slate-400">{escala.descricao}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-400">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-t border-slate-700 pt-3">
                      <span className="text-sm text-slate-400">Funcionários</span>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-cyan-400" />
                        <span className="font-semibold text-cyan-400">{escala.funcionarios}</span>
                      </div>
                    </div>
                    <div>
                      <span className="mb-2 block text-sm text-slate-400">Departamentos</span>
                      <div className="flex flex-wrap gap-2">
                        {escala.departamentos.map((dept, idx) => (
                          <Badge key={idx} className="bg-blue-500/20 text-blue-400">
                            {dept}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Horário Flexível */}
          <TabsContent value="flexivel" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={openFlexivel} onOpenChange={setOpenFlexivel}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Funcionário
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-slate-700 bg-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Adicionar ao Horário Flexível</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Configure horário flexível para um funcionário
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="funcionario">Funcionário</Label>
                      <Select>
                        <SelectTrigger className="border-slate-700 bg-slate-900 text-white">
                          <SelectValue placeholder="Selecione o funcionário" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-700 bg-slate-800 text-white">
                          <SelectItem value="1">João Silva</SelectItem>
                          <SelectItem value="2">Maria Santos</SelectItem>
                          <SelectItem value="3">Pedro Costa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="entrada-pref">Entrada Preferencial</Label>
                        <Input id="entrada-pref" type="time" className="border-slate-700 bg-slate-900 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="saida-pref">Saída Preferencial</Label>
                        <Input id="saida-pref" type="time" className="border-slate-700 bg-slate-900 text-white" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="carga">Carga Horária Diária</Label>
                      <Select>
                        <SelectTrigger className="border-slate-700 bg-slate-900 text-white">
                          <SelectValue placeholder="Selecione a carga horária" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-700 bg-slate-800 text-white">
                          <SelectItem value="6h">6 horas/dia</SelectItem>
                          <SelectItem value="8h">8 horas/dia</SelectItem>
                          <SelectItem value="10h">10 horas/dia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                        onClick={() => setOpenFlexivel(false)}
                      >
                        Adicionar
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                        onClick={() => setOpenFlexivel(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Funcionário</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Departamento</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Horário Preferencial</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Carga Horária</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Status</th>
                      <th className="pb-3 text-left text-sm font-medium text-slate-400">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horariosFlexiveis.map((horario) => (
                      <tr
                        key={horario.id}
                        className="border-b border-slate-700/50 transition-colors hover:bg-slate-700/30"
                      >
                        <td className="py-4 text-sm font-medium text-white">{horario.funcionario}</td>
                        <td className="py-4 text-sm text-slate-300">{horario.departamento}</td>
                        <td className="py-4 text-sm text-slate-300">{horario.horarioPreferencial}</td>
                        <td className="py-4 text-sm text-slate-300">{horario.cargaHoraria}</td>
                        <td className="py-4">
                          <Badge className="bg-green-500/20 text-green-400">
                            {horario.status === "ativo" ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-400"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-red-400">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
