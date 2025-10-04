"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MetricCard } from "@/components/metrcCard"
import { BookOpen, Calendar, Award, Clock, CheckCircle2, AlertCircle, Target, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function FuncionarioFormacoesPage() {
  const metrics = {
    formacoesInscritas: 8,
    formacoesEmAndamento: 3,
    formacoesConcluidas: 12,
    certificadosObtidos: 10,
    horasTotais: 240,
    proximaFormacao: "15/03/2025",
  }

  const minhasInscricoes = [
    {
      id: 1,
      titulo: "Liderança e Gestão de Equipes",
      tipo: "Presencial",
      instrutor: "Maria Silva",
      dataInicio: "2025-03-15",
      progresso: 65,
      status: "Em andamento",
      proximaAula: "2025-03-18",
    },
    {
      id: 2,
      titulo: "Excel Avançado para Análise de Dados",
      tipo: "Online",
      instrutor: "João Santos",
      dataInicio: "2025-03-20",
      progresso: 0,
      status: "Aguardando início",
      proximaAula: "2025-03-20",
    },
    {
      id: 3,
      titulo: "Comunicação Assertiva",
      tipo: "Híbrido",
      instrutor: "Ana Costa",
      dataInicio: "2025-03-10",
      progresso: 80,
      status: "Em andamento",
      proximaAula: "2025-03-19",
    },
  ]

  const formacoesDisponiveis = [
    {
      id: 4,
      titulo: "Gestão de Projetos Ágeis",
      tipo: "EAD",
      instrutor: "Carlos Oliveira",
      cargaHoraria: 32,
      dataInicio: "2025-03-25",
      vagas: 15,
      categoria: "Gestão",
    },
    {
      id: 5,
      titulo: "Inteligência Emocional no Trabalho",
      tipo: "Presencial",
      instrutor: "Patricia Lima",
      cargaHoraria: 20,
      dataInicio: "2025-04-01",
      vagas: 2,
      categoria: "Desenvolvimento Pessoal",
    },
    {
      id: 6,
      titulo: "Power BI para Gestores",
      tipo: "Online",
      instrutor: "Roberto Alves",
      cargaHoraria: 28,
      dataInicio: "2025-04-10",
      vagas: 13,
      categoria: "Tecnologia",
    },
  ]

  const certificadosRecentes = [
    { titulo: "Python para Análise de Dados", dataEmissao: "2025-02-28", nota: 9.5 },
    { titulo: "Gestão do Tempo", dataEmissao: "2025-02-15", nota: 9.0 },
    { titulo: "Técnicas de Apresentação", dataEmissao: "2025-01-30", nota: 8.8 },
  ]

  const meuPDI = {
    objetivo: "Desenvolver competências em liderança e gestão de equipes",
    prazo: "Dezembro 2025",
    progresso: 45,
    competencias: [
      { nome: "Liderança", nivel: 3, meta: 5 },
      { nome: "Comunicação", nivel: 4, meta: 5 },
      { nome: "Gestão de Projetos", nivel: 2, meta: 4 },
      { nome: "Análise de Dados", nivel: 3, meta: 4 },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em andamento":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Aguardando início":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case "Concluída":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Presencial":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
      case "Online":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Híbrido":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "EAD":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Minhas Formações</h1>
            <p className="text-slate-400">Acompanhe seu desenvolvimento profissional</p>
          </div>
          <Link href="/funcionario/formacoes/disponiveis">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Explorar Formações
            </Button>
          </Link>
        </div>

        {/* Quick Access Navigation */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Acesso Rápido</CardTitle>
            <CardDescription className="text-slate-400">Navegue pelas suas áreas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <Link href="/funcionario/formacoes/disponiveis">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4 border-slate-700 hover:bg-slate-700/50 bg-transparent"
                >
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                  <span className="text-sm text-slate-300">Disponíveis</span>
                </Button>
              </Link>
              <Link href="/funcionario/formacoes/minhas-inscricoes">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4 border-slate-700 hover:bg-slate-700/50 bg-transparent"
                >
                  <Calendar className="w-6 h-6 text-blue-400" />
                  <span className="text-sm text-slate-300">Inscrições</span>
                </Button>
              </Link>
              <Link href="/funcionario/formacoes/historico">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4 border-slate-700 hover:bg-slate-700/50 bg-transparent"
                >
                  <Clock className="w-6 h-6 text-purple-400" />
                  <span className="text-sm text-slate-300">Histórico</span>
                </Button>
              </Link>
              <Link href="/funcionario/formacoes/certificados">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4 border-slate-700 hover:bg-slate-700/50 bg-transparent"
                >
                  <Award className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-slate-300">Certificados</span>
                </Button>
              </Link>
              <Link href="/funcionario/formacoes/meu-pdi">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4 border-slate-700 hover:bg-slate-700/50 bg-transparent"
                >
                  <Target className="w-6 h-6 text-orange-400" />
                  <span className="text-sm text-slate-300">Meu PDI</span>
                </Button>
              </Link>
              <Link href="/funcionario/formacoes/minhas-competencias">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 py-4 border-slate-700 hover:bg-slate-700/50 bg-transparent"
                >
                  <CheckCircle2 className="w-6 h-6 text-teal-400" />
                  <span className="text-sm text-slate-300">Competências</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Formações Inscritas"
            value={metrics.formacoesInscritas.toString()}
            icon={BookOpen}
            description="Total de inscrições"
          />
          <MetricCard
            title="Em Andamento"
            value={metrics.formacoesEmAndamento.toString()}
            icon={Calendar}
            description="Formações ativas"
          />
          <MetricCard
            title="Concluídas"
            value={metrics.formacoesConcluidas.toString()}
            icon={CheckCircle2}
            description="Finalizadas com sucesso"
            trend={{ value: 20, isPositive: true }}
          />
          <MetricCard
            title="Certificados"
            value={metrics.certificadosObtidos.toString()}
            icon={Award}
            description="Certificados obtidos"
          />
          <MetricCard
            title="Horas Totais"
            value={metrics.horasTotais.toString()}
            icon={Clock}
            description="Horas de formação"
            trend={{ value: 15, isPositive: true }}
          />
          <MetricCard
            title="Próxima Formação"
            value={metrics.proximaFormacao}
            icon={AlertCircle}
            description="Data de início"
          />
        </div>

        {/* Minhas Inscrições */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Minhas Inscrições Ativas</CardTitle>
                <CardDescription className="text-slate-400">Formações em que você está inscrito</CardDescription>
              </div>
              <Link href="/funcionario/formacoes/minhas-inscricoes">
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 bg-transparent">
                  Ver Todas
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {minhasInscricoes.map((formacao) => (
                <div
                  key={formacao.id}
                  className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg hover:bg-slate-900/70 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{formacao.titulo}</h3>
                      <p className="text-sm text-slate-400">Instrutor: {formacao.instrutor}</p>
                    </div>
                    <Badge className={getTipoColor(formacao.tipo)}>{formacao.tipo}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Próxima aula: {new Date(formacao.proximaAula).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <Badge className={getStatusColor(formacao.status)}>{formacao.status}</Badge>
                      <span className="text-slate-400">{formacao.progresso}% concluído</span>
                    </div>
                    <Progress value={formacao.progresso} className="h-2" />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    >
                      Acessar Formação
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 bg-transparent">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Formações Disponíveis e Meu PDI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formações Disponíveis */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Formações Disponíveis</CardTitle>
                  <CardDescription className="text-slate-400">Novas oportunidades de desenvolvimento</CardDescription>
                </div>
                <Link href="/funcionario/formacoes/disponiveis">
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 bg-transparent">
                    Ver Todas
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formacoesDisponiveis.map((formacao) => (
                  <div
                    key={formacao.id}
                    className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg hover:bg-slate-900/70 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">{formacao.titulo}</h4>
                      <Badge className={getTipoColor(formacao.tipo)} >
                        {formacao.tipo}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        {formacao.instrutor}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formacao.cargaHoraria}h
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Início: {new Date(formacao.dataInicio).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formacao.vagas} vagas disponíveis
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    >
                      Inscrever-se
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Meu PDI */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Meu Plano de Desenvolvimento</CardTitle>
                  <CardDescription className="text-slate-400">Acompanhe suas metas de crescimento</CardDescription>
                </div>
                <Link href="/funcionario/formacoes/meu-pdi">
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 bg-transparent">
                    Ver Completo
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <p className="text-white font-medium mb-2">{meuPDI.objetivo}</p>
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                    <span>Prazo: {meuPDI.prazo}</span>
                    <span>{meuPDI.progresso}% concluído</span>
                  </div>
                  <Progress value={meuPDI.progresso} className="h-2" />
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm">Competências em Desenvolvimento</h4>
                  {meuPDI.competencias.map((comp, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{comp.nome}</span>
                        <span className="text-slate-400">
                          Nível {comp.nivel}/{comp.meta}
                        </span>
                      </div>
                      <Progress value={(comp.nivel / comp.meta) * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificados Recentes */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Certificados Recentes</CardTitle>
                <CardDescription className="text-slate-400">Suas conquistas mais recentes</CardDescription>
              </div>
              <Link href="/funcionario/formacoes/certificados">
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 bg-transparent">
                  Ver Todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {certificadosRecentes.map((cert, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg"
                >
                  <Award className="w-8 h-8 text-cyan-400 mb-3" />
                  <h4 className="text-white font-medium mb-2">{cert.titulo}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{new Date(cert.dataEmissao).toLocaleDateString("pt-BR")}</span>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Nota: {cert.nota}</Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-3 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                  >
                    Baixar Certificado
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
