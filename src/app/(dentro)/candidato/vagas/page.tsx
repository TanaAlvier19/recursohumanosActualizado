"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Briefcase, Clock, Heart, Share2, Building2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Swal from "sweetalert2"

export default function VagasDisponiveis() {
  const [busca, setBusca] = useState("")
  const [departamento, setDepartamento] = useState("todos")
  const [tipo, setTipo] = useState("todos")
  const [localizacao, setLocalizacao] = useState("todos")

  const [modalCandidatura, setModalCandidatura] = useState(false)
  const [vagaSelecionada, setVagaSelecionada] = useState<any>(null)
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [curriculum, setCurriculum] = useState<File | null>(null)

  const vagas = [
    {
      id: 1,
      titulo: "Desenvolvedor Full Stack Sênior",
      departamento: "Tecnologia",
      localizacao: "São Paulo, SP",
      tipo: "CLT",
      modelo: "Híbrido",
      salario: "R$ 12.000 - R$ 18.000",
      nivel: "Sênior",
      candidatos: 45,
      publicada: "2 dias atrás",
      descricao: "Buscamos desenvolvedor experiente em React, Node.js e TypeScript para liderar projetos inovadores.",
      requisitos: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
      beneficios: ["Vale Refeição", "Plano de Saúde", "Home Office", "Auxílio Educação"],
      salva: false,
    },
    {
      id: 2,
      titulo: "Analista de Marketing Digital",
      departamento: "Marketing",
      localizacao: "Remote",
      tipo: "CLT",
      modelo: "Remoto",
      salario: "R$ 6.000 - R$ 9.000",
      nivel: "Pleno",
      candidatos: 78,
      publicada: "5 dias atrás",
      descricao: "Profissional criativo para gerenciar campanhas digitais e estratégias de conteúdo.",
      requisitos: ["Google Ads", "Facebook Ads", "SEO", "Analytics", "Copywriting"],
      beneficios: ["Vale Refeição", "Plano de Saúde", "Flexibilidade de Horário"],
      salva: true,
    },
    {
      id: 3,
      titulo: "Gerente de Vendas",
      departamento: "Vendas",
      localizacao: "Rio de Janeiro, RJ",
      tipo: "CLT",
      modelo: "Presencial",
      salario: "R$ 8.000 - R$ 12.000 + Comissões",
      nivel: "Sênior",
      candidatos: 32,
      publicada: "1 semana atrás",
      descricao: "Liderar equipe de vendas e desenvolver estratégias para expansão de mercado.",
      requisitos: ["Gestão de Equipes", "CRM", "Negociação", "Análise de Dados"],
      beneficios: ["Vale Refeição", "Plano de Saúde", "Carro da Empresa", "Comissões"],
      salva: false,
    },
    {
      id: 4,
      titulo: "Designer UX/UI",
      departamento: "Design",
      localizacao: "São Paulo, SP",
      tipo: "PJ",
      modelo: "Híbrido",
      salario: "R$ 7.000 - R$ 11.000",
      nivel: "Pleno",
      candidatos: 56,
      publicada: "3 dias atrás",
      descricao: "Designer criativo para criar experiências digitais incríveis e interfaces intuitivas.",
      requisitos: ["Figma", "Adobe XD", "Prototipagem", "Design System", "User Research"],
      beneficios: ["Flexibilidade", "Equipamento", "Cursos"],
      salva: false,
    },
    {
      id: 5,
      titulo: "Analista de Dados Júnior",
      departamento: "Tecnologia",
      localizacao: "Remote",
      tipo: "CLT",
      modelo: "Remoto",
      salario: "R$ 4.000 - R$ 6.000",
      nivel: "Júnior",
      candidatos: 123,
      publicada: "4 dias atrás",
      descricao: "Oportunidade para iniciar carreira em análise de dados com mentoria e treinamento.",
      requisitos: ["SQL", "Python", "Excel", "Power BI", "Estatística"],
      beneficios: ["Vale Refeição", "Plano de Saúde", "Treinamentos", "Mentoria"],
      salva: true,
    },
    {
      id: 6,
      titulo: "Engenheiro DevOps",
      departamento: "Tecnologia",
      localizacao: "São Paulo, SP",
      tipo: "CLT",
      modelo: "Híbrido",
      salario: "R$ 14.000 - R$ 20.000",
      nivel: "Sênior",
      candidatos: 28,
      publicada: "1 dia atrás",
      descricao: "Profissional experiente para gerenciar infraestrutura cloud e pipelines CI/CD.",
      requisitos: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins"],
      beneficios: ["Vale Refeição", "Plano de Saúde", "Stock Options", "Home Office"],
      salva: false,
    },
  ]

  const vagasFiltradas = vagas.filter((vaga) => {
    const matchBusca =
      vaga.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      vaga.descricao.toLowerCase().includes(busca.toLowerCase())
    const matchDepartamento = departamento === "todos" || vaga.departamento === departamento
    const matchTipo = tipo === "todos" || vaga.tipo === tipo
    const matchLocalizacao = localizacao === "todos" || vaga.localizacao.includes(localizacao)

    return matchBusca && matchDepartamento && matchTipo && matchLocalizacao
  })

  const abrirModalCandidatura = (vaga: any) => {
    setVagaSelecionada(vaga)
    setModalCandidatura(true)
  }

  const enviarCandidatura = async () => {
    if (!nome || !email || !telefone || !curriculum) {
      Swal.fire("Atenção", "Por favor, preencha todos os campos obrigatórios", "warning")
      return
    }

    try {
      const formData = new FormData()
      formData.append("nome", nome)
      formData.append("email", email)
      formData.append("telefone", telefone)
      formData.append("observacoes", observacoes)
      formData.append("vagaId", vagaSelecionada.id)
      formData.append("curriculum", curriculum)

      // Simular envio - substituir pela chamada real da API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      Swal.fire("Candidatura Enviada!", "Você será notificado em breve sobre sua candidatura", "success")

      // Limpar formulário
      setNome("")
      setEmail("")
      setTelefone("")
      setObservacoes("")
      setCurriculum(null)
      setModalCandidatura(false)
    } catch (error) {
      Swal.fire("Erro", "Ocorreu um erro ao enviar sua candidatura. Tente novamente.", "error")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Vagas Disponíveis
          </h1>
          <p className="text-slate-400 mt-1">Encontre sua próxima oportunidade de carreira</p>
        </div>

        {/* Busca e Filtros */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por cargo, palavra-chave..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={departamento} onValueChange={setDepartamento}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue placeholder="Departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Departamentos</SelectItem>
                    <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue placeholder="Tipo de Contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="CLT">CLT</SelectItem>
                    <SelectItem value="PJ">PJ</SelectItem>
                    <SelectItem value="Estágio">Estágio</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={localizacao} onValueChange={setLocalizacao}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue placeholder="Localização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as Localizações</SelectItem>
                    <SelectItem value="São Paulo">São Paulo</SelectItem>
                    <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                    <SelectItem value="Remote">Remoto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="flex items-center justify-between">
          <p className="text-slate-400">
            {vagasFiltradas.length} {vagasFiltradas.length === 1 ? "vaga encontrada" : "vagas encontradas"}
          </p>
        </div>

        {/* Lista de Vagas */}
        <div className="grid grid-cols-1 gap-4">
          {vagasFiltradas.map((vaga) => (
            <Card key={vaga.id} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
                        <Briefcase className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-white">{vaga.titulo}</h3>
                            <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {vaga.departamento}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {vaga.localizacao}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {vaga.publicada}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-300 mt-3">{vaga.descricao}</p>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {vaga.requisitos.slice(0, 5).map((req, index) => (
                            <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                              {req}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-700">
                          <div>
                            <p className="text-slate-500 text-xs">Tipo</p>
                            <p className="text-white font-medium">{vaga.tipo}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Modelo</p>
                            <p className="text-white font-medium">{vaga.modelo}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Nível</p>
                            <p className="text-white font-medium">{vaga.nivel}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Salário</p>
                            <p className="text-cyan-400 font-medium">{vaga.salario}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                          <Button
                            onClick={() => abrirModalCandidatura(vaga)}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                          >
                            Candidatar-se
                          </Button>
                          <Button variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                            Ver Detalhes
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400">
                            <Heart className={`w-5 h-5 ${vaga.salva ? "fill-red-400 text-red-400" : ""}`} />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-cyan-400">
                            <Share2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={modalCandidatura} onOpenChange={setModalCandidatura}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Candidatar-se para {vagaSelecionada?.titulo}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Preencha os dados abaixo para enviar sua candidatura
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-slate-300">
                Nome Completo <span className="text-red-400">*</span>
              </Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white"
                placeholder="seu.email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-slate-300">
                Telefone <span className="text-red-400">*</span>
              </Label>
              <Input
                id="telefone"
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="curriculum" className="text-slate-300">
                Currículo (PDF) <span className="text-red-400">*</span>
              </Label>
              <Input
                id="curriculum"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setCurriculum(e.target.files[0])
                  }
                }}
                className="bg-slate-900 border-slate-700 text-white"
              />
              {curriculum && <p className="text-sm text-cyan-400">Arquivo selecionado: {curriculum.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes" className="text-slate-300">
                Informações Adicionais
              </Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white min-h-[100px]"
                placeholder="Conte-nos mais sobre você e por que se interessa por esta vaga..."
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={enviarCandidatura}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Enviar Candidatura
            </Button>
            <Button
              variant="outline"
              onClick={() => setModalCandidatura(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
