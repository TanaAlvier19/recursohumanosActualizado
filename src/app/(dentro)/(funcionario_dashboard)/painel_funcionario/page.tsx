"use client"
import Link from "next/link"
import { useContext, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  User,
  DollarSign,
  Calendar,
  GraduationCap,
  Building2,
  Clock,
  FileText,
  Bell,
  Settings,
  CheckCircle2,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AuthContext } from "@/app/context/AuthContext"
import { buscarDados } from "@/lib/api"

export default function FuncionarioDashboard() {
  const { userName } = useContext(AuthContext)

  const [employeeData, setEmployeeData] = useState({
    name: userName || "Colaborador",
    role: "Colaborador",
    department: "—",
    admissionDate: "—",
    employeeId: "—",
  })

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const me = await buscarDados()
        if (!active || !me) return
        setEmployeeData({
          name: me?.nome || userName || "Colaborador",
          role: me?.cargo || me?.role || "Colaborador",
          department: me?.departamento?.nome || me?.departamento || "—",
          admissionDate: me?.data_admissao || me?.admissao || "—",
          employeeId: (me?.matricula || me?.id || "").toString() || "—",
        })
      } catch (e) {
        // fallback silencioso
      }
    }
    load()
    return () => {
      active = false
    }
  }, [userName])

  const quickStats = [
    {
      title: "Salário Atual",
      value: "R$ 8.500,00",
      icon: DollarSign,
      color: "green",
      description: "Próximo pagamento em 5 dias",
    },
    {
      title: "Assiduidade",
      value: "98.5%",
      icon: CheckCircle2,
      color: "blue",
      description: "Excelente frequência",
    },
    {
      title: "Formações Concluídas",
      value: "12",
      icon: GraduationCap,
      color: "cyan",
      description: "3 em andamento",
    },
    {
      title: "Horas Trabalhadas",
      value: "168h",
      icon: Clock,
      color: "purple",
      description: "Este mês",
    },
  ]

  const upcomingEvents = [
    {
      type: "formacao",
      title: "Treinamento React Avançado",
      date: "15/05/2024",
      time: "14:00",
      status: "confirmado",
    },
    {
      type: "pagamento",
      title: "Pagamento de Salário",
      date: "05/05/2024",
      time: "00:00",
      status: "agendado",
    },
    {
      type: "avaliacao",
      title: "Avaliação de Desempenho",
      date: "20/05/2024",
      time: "10:00",
      status: "pendente",
    },
  ]

  const myModules = [
    {
      name: "Minha Folha de Pagamento",
      icon: DollarSign,
      description: "Contracheques e benefícios",
      href: "/funcionario/folha-pagamento",
      stats: "Último: R$ 8.500,00",
      color: "from-green-500 to-emerald-600",
      notifications: 1,
    },
    {
      name: "Minha Assiduidade",
      icon: Calendar,
      description: "Presenças e justificativas",
      href: "/funcionario/assiduidade",
      stats: "98.5% este mês",
      color: "from-blue-500 to-cyan-600",
      notifications: 0,
    },
    {
      name: "Minhas Formações",
      icon: GraduationCap,
      description: "Cursos e certificados",
      href: "/funcionario/formacoes",
      stats: "3 em andamento",
      color: "from-cyan-500 to-blue-600",
      notifications: 2,
    },
    {
      name: "Meu Departamento",
      icon: Building2,
      description: "Informações do departamento",
      href: "/funcionario/departamento",
      stats: "TI - 45 membros",
      color: "from-purple-500 to-pink-600",
      notifications: 0,
    },
  ]

  const recentDocuments = [
    {
      name: "Contracheque Abril 2024",
      type: "PDF",
      date: "30/04/2024",
      size: "245 KB",
    },
    {
      name: "Certificado React Básico",
      type: "PDF",
      date: "25/04/2024",
      size: "1.2 MB",
    },
    {
      name: "Declaração de Vínculo",
      type: "PDF",
      date: "15/04/2024",
      size: "180 KB",
    },
  ]

  const attendanceData = [
    { month: "Jan", presenca: 100 },
    { month: "Fev", presenca: 95 },
    { month: "Mar", presenca: 100 },
    { month: "Abr", presenca: 98 },
    { month: "Mai", presenca: 100 },
  ]

  const skillsProgress = [
    { skill: "React", progress: 85 },
    { skill: "Node.js", progress: 75 },
    { skill: "TypeScript", progress: 80 },
    { skill: "Python", progress: 60 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header com informações do funcionário */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {employeeData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Olá, {employeeData.name.split(" ")[0]}!</h1>
              <p className="text-slate-400 mb-2">{employeeData.role}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {employeeData.department}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {employeeData.employeeId}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Desde {employeeData.admissionDate}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
              <Badge className="ml-2 bg-red-500">3</Badge>
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              Perfil
            </Button>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20`}
                    >
                      <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  Próximos Eventos
                </CardTitle>
                <CardDescription className="text-slate-400">Sua agenda para os próximos dias</CardDescription>
              </div>
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                Ver agenda completa
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        event.type === "formacao"
                          ? "bg-cyan-500/20"
                          : event.type === "pagamento"
                            ? "bg-green-500/20"
                            : "bg-purple-500/20"
                      }`}
                    >
                      {event.type === "formacao" && <GraduationCap className="w-6 h-6 text-cyan-400" />}
                      {event.type === "pagamento" && <DollarSign className="w-6 h-6 text-green-400" />}
                      {event.type === "avaliacao" && <FileText className="w-6 h-6 text-purple-400" />}
                    </div>
                    <div>
                      <p className="text-white font-medium">{event.title}</p>
                      <p className="text-sm text-slate-400">
                        {event.date} às {event.time}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      event.status === "confirmado"
                        ? "border-green-500/50 text-green-400"
                        : event.status === "agendado"
                          ? "border-blue-500/50 text-blue-400"
                          : "border-orange-500/50 text-orange-400"
                    }`}
                  >
                    {event.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meus Módulos */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {myModules.map((module, index) => {
              const Icon = module.icon
              return (
                <Link key={index} href={module.href}>
                  <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 hover:border-cyan-500/50 transition-all cursor-pointer group h-full relative">
                    {module.notifications > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 z-10">{module.notifications}</Badge>
                    )}
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center mb-4`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                        {module.name}
                      </h3>
                      <p className="text-sm text-slate-400 mb-3">{module.description}</p>
                      <p className="text-xs text-cyan-400 font-medium">{module.stats}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Minha Assiduidade</CardTitle>
              <CardDescription className="text-slate-400">Taxa de presença nos últimos 5 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="presenca" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Desenvolvimento de Competências */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Minhas Competências</CardTitle>
              <CardDescription className="text-slate-400">Progresso no desenvolvimento de habilidades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillsProgress.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">{item.skill}</span>
                      <span className="text-sm font-medium text-cyan-400">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documentos Recentes */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Documentos Recentes
                </CardTitle>
                <CardDescription className="text-slate-400">Seus documentos mais recentes</CardDescription>
              </div>
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{doc.name}</p>
                      <p className="text-sm text-slate-400">
                        {doc.date} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
