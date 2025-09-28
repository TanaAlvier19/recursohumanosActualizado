'use client'

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, 
  XCircle, 
  Building2, 
  User, 
  Shield,
  Mail,
  Phone,
  MapPin,
  FileText,
  Briefcase,
  Lock,
  Eye,
  EyeOff
} from "lucide-react"
import Swal from "sweetalert2"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const PASSOS = [
  { 
    numero: 1, 
    titulo: "Dados Empresariais", 
    descricao: "Informações da organização", 
    icone: Building2 
  },
  { 
    numero: 2, 
    titulo: "Representante Legal", 
    descricao: "Dados do responsável", 
    icone: User 
  },
  { 
    numero: 3, 
    titulo: "Segurança", 
    descricao: "Criação de credenciais", 
    icone: Lock 
  },
]

interface CadastroDialogProps {
  onSuccess?: () => void
  onCancel?: () => void
}

interface EmpresaData {
  nome: string
  nif: string
  tipoEmpresa: string
  setorAtuacao: string
  endereco: string
  emailCorporativo: string
  telefoneEmpresa: string
}

interface RepresentanteData {
  nomeCompleto: string
  email: string
  telefone: string
  cargo: string
  nivelAcesso: string
}

interface SegurancaData {
  senha: string
  confirmarSenha: string
}

export function CadastroDialog({ onSuccess, onCancel }: CadastroDialogProps) {
  const router = useRouter()
  const [passoAtual, setPassoAtual] = useState(0)
  const [loading, setLoading] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  
  // Estados organizados por categoria
  const [empresa, setEmpresa] = useState<EmpresaData>({
    nome: "",
    nif: "",
    tipoEmpresa: "",
    setorAtuacao: "",
    endereco: "",
    emailCorporativo: "",
    telefoneEmpresa: ""
  })

  const [representante, setRepresentante] = useState<RepresentanteData>({
    nomeCompleto: "",
    email: "",
    telefone: "",
    cargo: "",
    nivelAcesso: ""
  })

  const [seguranca, setSeguranca] = useState<SegurancaData>({
    senha: "",
    confirmarSenha: ""
  })

  // Setores de atuação profissionais
  const SETORES_ATUACAO = [
    "Tecnologia da Informação",
    "Saúde e Bem-estar",
    "Educação e Treinamento",
    "Serviços Financeiros",
    "Comércio e Varejo",
    "Indústria e Manufatura",
    "Consultoria Empresarial",
    "Serviços Profissionais",
    "Energia e Utilities",
    "Construção Civil",
    "Transporte e Logística",
    "Agricultura e Agropecuária",
    "Telecomunicações",
    "Mídia e Entretenimento",
    "Hotelaria e Turismo",
    "Outros"
  ]

  const CARGOS = [
    "CEO/Diretor Executivo",
    "Diretor de RH",
    "Gerente de RH",
    "Coordenador de RH",
    "Analista de RH",
    "Proprietário/Empreendedor",
    "Outro"
  ]

  // Validação de senha profissional
  function validarSenha(senha: string) {
    const criterios = {
      comprimento: senha.length >= 12,
      maiusculo: /[A-Z]/.test(senha),
      minusculo: /[a-z]/.test(senha),
      numero: /[0-9]/.test(senha),
      simbolo: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
      sequencia: !/(.)\1\1/.test(senha), // Evitar sequências repetitivas
      comum: !['password', '123456', 'senha'].includes(senha.toLowerCase())
    }

    const cumpridos = Object.values(criterios).filter(Boolean).length
    let nivel = "Fraca"
    let cor = "red"

    if (cumpridos >= 4) {
      nivel = "Média"
      cor = "orange"
    }
    if (cumpridos >= 5) {
      nivel = "Forte"
      cor = "green"
    }
    if (cumpridos === 7) {
      nivel = "Excelente"
      cor = "emerald"
    }

    return { criterios, nivel, cor }
  }

  const { criterios, nivel, cor } = validarSenha(seguranca.senha)

  // Atualizações específicas por categoria
  const atualizarEmpresa = (campo: keyof EmpresaData, valor: string) => {
    setEmpresa(prev => ({ ...prev, [campo]: valor }))
  }

  const atualizarRepresentante = (campo: keyof RepresentanteData, valor: string) => {
    setRepresentante(prev => ({ ...prev, [campo]: valor }))
  }

  const atualizarSeguranca = (campo: keyof SegurancaData, valor: string) => {
    setSeguranca(prev => ({ ...prev, [campo]: valor }))
  }

  // Validações de passo
  const passo1Valido = () => {
    return empresa.nome && empresa.nif && empresa.endereco && empresa.emailCorporativo
  }

  const passo2Valido = () => {
    return representante.nomeCompleto && representante.email && representante.telefone && representante.nivelAcesso
  }

  const passo3Valido = () => {
    return seguranca.senha && seguranca.confirmarSenha && seguranca.senha === seguranca.confirmarSenha && nivel !== "Fraca"
  }

  const avancarPasso = () => {
    if (passoAtual < PASSOS.length - 1) {
      setPassoAtual(passoAtual + 1)
    }
  }

  const voltarPasso = () => {
    if (passoAtual > 0) {
      setPassoAtual(passoAtual - 1)
    }
  }

  const cadastrarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (seguranca.senha !== seguranca.confirmarSenha) {
      Swal.fire("Erro de Validação", "As senhas não coincidem. Por favor, verifique e tente novamente.", "error")
      setLoading(false)
      return
    }

    try {
      const dadosEmpresa = {
        empresa: {
          nome: empresa.nome,
          nif: empresa.nif.replace(/\D/g, ''), // Remove caracteres não numéricos
          tipo_empresa: empresa.tipoEmpresa,
          setor_atuacao: empresa.setorAtuacao,
          endereco: empresa.endereco,
          email_corporativo: empresa.emailCorporativo,
          telefone: empresa.telefoneEmpresa
        },
        representante: {
          nome_completo: representante.nomeCompleto,
          email: representante.email,
          telefone: representante.telefone,
          cargo: representante.cargo,
          nivel_acesso: representante.nivelAcesso
        },
        seguranca: {
          senha: seguranca.senha
        }
      }

      const res = await fetch("http://localhost:8000/empresa/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(dadosEmpresa),
      })

      if (res.ok) {
        await Swal.fire({
          title: "Cadastro Realizado com Sucesso!",
          text: "Sua empresa foi cadastrada com sucesso. Em breve nossa equipe entrará em contato para ativação da conta.",
          icon: "success",
          confirmButtonText: "Continuar",
          confirmButtonColor: "#2563eb",
          timer: 5000
        })
        
        onSuccess?.()
        router.push("/personaliza")
      } else {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Erro ao processar cadastro")
      }
    } catch (error) {
      console.error("Erro no cadastro:", error)
      Swal.fire({
        title: "Erro no Cadastro",
        text: "Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente ou entre em contato com nosso suporte.",
        icon: "error",
        confirmButtonText: "Entendi"
      })
    } finally {
      setLoading(false)
    }
  }

  // Componente de critério de senha
  function CriterioSenha({ valido, texto }: { valido: boolean; texto: string }) {
    return (
      <div className="flex items-center gap-2 text-xs">
        {valido ? 
          <CheckCircle className="text-emerald-500 size-3" /> : 
          <XCircle className="text-red-500 size-3" />
        }
        <span className={cn("transition-colors", valido ? "text-emerald-600" : "text-slate-500")}>
          {texto}
        </span>
      </div>
    )
  }

  // Máscara de telefone
  const formatarTelefone = (valor: string) => {
    const numbers = valor.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return valor
  }

  // Máscara de NIF
  const formatarNIF = (valor: string) => {
    return valor.replace(/\D/g, '').slice(0, 14)
  }

  const progresso = ((passoAtual + 1) / PASSOS.length) * 100

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Cadastro Empresarial
          </CardTitle>
          <CardDescription className="text-slate-600">
            Complete as informações para criar sua conta corporativa
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Barra de Progresso */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">
                Etapa {passoAtual + 1} de {PASSOS.length}
              </span>
              <span className="text-sm text-slate-500">{Math.round(progresso)}% completo</span>
            </div>
            <Progress value={progresso} className="h-2" />
            
            {/* Indicadores de Etapa */}
            <div className="flex justify-between">
              {PASSOS.map((passo, index) => {
                const Icone = passo.icone
                const ativo = index <= passoAtual
                const concluido = index < passoAtual
                
                return (
                  <div key={passo.numero} className="flex flex-col items-center flex-1">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                      concluido ? "bg-green-500 text-white" :
                      ativo ? "bg-blue-600 text-white" :
                      "bg-slate-200 text-slate-400"
                    )}>
                      {concluido ? <CheckCircle className="w-4 h-4" /> : <Icone className="w-4 h-4" />}
                    </div>
                    <div className="text-center mt-2">
                      <p className={cn(
                        "text-xs font-medium transition-colors",
                        ativo ? "text-blue-600" : "text-slate-400"
                      )}>
                        {passo.titulo}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Conteúdo dos Passos */}
          <div className="space-y-6">
            {/* Passo 1: Dados Empresariais */}
            {passoAtual === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeEmpresa" className="text-sm font-medium flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Nome da Empresa *
                    </Label>
                    <Input
                      id="nomeEmpresa"
                      placeholder="Digite a razão social"
                      value={empresa.nome}
                      onChange={(e) => atualizarEmpresa('nome', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nif" className="text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      NIF/CNPJ *
                    </Label>
                    <Input
                      id="nif"
                      placeholder="000.000.000-00"
                      value={formatarNIF(empresa.nif)}
                      onChange={(e) => atualizarEmpresa('nif', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoEmpresa" className="text-sm font-medium">
                      Tipo de Empresa *
                    </Label>
                    <Select value={empresa.tipoEmpresa} onValueChange={(v) => atualizarEmpresa('tipoEmpresa', v)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mei">MEI</SelectItem>
                        <SelectItem value="ltda">LTDA</SelectItem>
                        <SelectItem value="sa">S.A.</SelectItem>
                        <SelectItem value="eireli">EIRELI</SelectItem>
                        <SelectItem value="ong">ONG/Associação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="setorAtuacao" className="text-sm font-medium">
                      Setor de Atuação *
                    </Label>
                    <Select value={empresa.setorAtuacao} onValueChange={(v) => atualizarEmpresa('setorAtuacao', v)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        {SETORES_ATUACAO.map(setor => (
                          <SelectItem key={setor} value={setor.toLowerCase().replace(/\s+/g, '-')}>
                            {setor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="endereco" className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Endereço Completo *
                    </Label>
                    <Input
                      id="endereco"
                      placeholder="Rua, número, bairro, cidade - Estado"
                      value={empresa.endereco}
                      onChange={(e) => atualizarEmpresa('endereco', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailCorporativo" className="text-sm font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Corporativo *
                    </Label>
                    <Input
                      id="emailCorporativo"
                      type="email"
                      placeholder="contato@empresa.com"
                      value={empresa.emailCorporativo}
                      onChange={(e) => atualizarEmpresa('emailCorporativo', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefoneEmpresa" className="text-sm font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefone Comercial *
                    </Label>
                    <Input
                      id="telefoneEmpresa"
                      placeholder="(00) 00000-0000"
                      value={formatarTelefone(empresa.telefoneEmpresa)}
                      onChange={(e) => atualizarEmpresa('telefoneEmpresa', e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="px-6"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={avancarPasso}
                    disabled={!passo1Valido()}
                    className="px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {/* Passo 2: Representante Legal */}
            {passoAtual === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nomeRepresentante" className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nome Completo do Representante *
                    </Label>
                    <Input
                      id="nomeRepresentante"
                      placeholder="Nome completo do responsável legal"
                      value={representante.nomeCompleto}
                      onChange={(e) => atualizarRepresentante('nomeCompleto', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailRepresentante" className="text-sm font-medium">
                      Email Pessoal *
                    </Label>
                    <Input
                      id="emailRepresentante"
                      type="email"
                      placeholder="seu@email.com"
                      value={representante.email}
                      onChange={(e) => atualizarRepresentante('email', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefoneRepresentante" className="text-sm font-medium">
                      Telefone/WhatsApp *
                    </Label>
                    <Input
                      id="telefoneRepresentante"
                      placeholder="(00) 00000-0000"
                      value={formatarTelefone(representante.telefone)}
                      onChange={(e) => atualizarRepresentante('telefone', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cargo" className="text-sm font-medium flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Cargo *
                    </Label>
                    <Select value={representante.cargo} onValueChange={(v) => atualizarRepresentante('cargo', v)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        {CARGOS.map(cargo => (
                          <SelectItem key={cargo} value={cargo.toLowerCase().replace(/\s+/g, '-')}>
                            {cargo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nivelAcesso" className="text-sm font-medium">
                      Nível de Acesso *
                    </Label>
                    <Select value={representante.nivelAcesso} onValueChange={(v) => atualizarRepresentante('nivelAcesso', v)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador Master</SelectItem>
                        <SelectItem value="gerente">Gerente de RH</SelectItem>
                        <SelectItem value="coordenador">Coordenador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={voltarPasso}
                    className="px-6"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={avancarPasso}
                    disabled={!passo2Valido()}
                    className="px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {/* Passo 3: Segurança */}
            {passoAtual === 2 && (
              <form onSubmit={cadastrarEmpresa} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senha" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Senha de Acesso *
                    </Label>
                    <div className="relative">
                      <Input
                        id="senha"
                        type={mostrarSenha ? "text" : "password"}
                        placeholder="Mínimo 12 caracteres"
                        value={seguranca.senha}
                        onChange={(e) => atualizarSeguranca('senha', e.target.value)}
                        className="h-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-10 px-3"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                      >
                        {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha" className="text-sm font-medium">
                      Confirmar Senha *
                    </Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      placeholder="Digite novamente a senha"
                      value={seguranca.confirmarSenha}
                      onChange={(e) => atualizarSeguranca('confirmarSenha', e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>

                {/* Validação de Senha */}
                {seguranca.senha && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium">Segurança da Senha</Label>
                        <Badge variant={cor === "emerald" ? "default" : cor === "green" ? "secondary" : "destructive"}>
                          {nivel}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <CriterioSenha valido={criterios.comprimento} texto="12+ caracteres" />
                        <CriterioSenha valido={criterios.maiusculo} texto="Letra maiúscula" />
                        <CriterioSenha valido={criterios.minusculo} texto="Letra minúscula" />
                        <CriterioSenha valido={criterios.numero} texto="Número" />
                        <CriterioSenha valido={criterios.simbolo} texto="Símbolo especial" />
                        <CriterioSenha valido={criterios.sequencia} texto="Sem repetições" />
                        <CriterioSenha valido={criterios.comum} texto="Não é comum" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {seguranca.confirmarSenha && seguranca.senha !== seguranca.confirmarSenha && (
                  <div className="text-red-600 text-sm flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    As senhas não coincidem
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={voltarPasso}
                    className="px-6"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    disabled={!passo3Valido() || loading}
                    className="px-6 bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Finalizar Cadastro
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}