"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Building2, User } from "lucide-react"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const PASSOS = [
  { numero: 1, titulo: "Dados Institucionais", descricao: "Informações da empresa", icone: Building2 },
  { numero: 2, titulo: "Representante", descricao: "Dados do responsável", icone: User },
]

interface CadastroDialogProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CadastroDialog({ onSuccess, onCancel }: CadastroDialogProps) {
  const [nome, setNome] = useState("")
  const router = useRouter()
  const [email, setRepEmail] = useState("")
  const [tipoEmpresa, setTipoEmpresa] = useState("")
  const [setorAtuacao, setSetorAtuacao] = useState("")
  const [cargo, setCargo] = useState("")
  const [nivelAcesso, setNivelAcesso] = useState("")
  const [emailCorporativo, setEmailCorporativo] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarsenha, setconfirmarsenha] = useState("")
  const [telefone, settelefoneRe] = useState("")
  const [nomeRep, setRepNome] = useState("")
  const [nif, setNif] = useState("")
  const [avancar, setAvancar] = useState(0)
  const [endereco, setEndereco] = useState("")

  function verificar(senha: string) {
    const criterios = {
      comprimento: senha.length >= 8,
      maiusculo: /[A-Z]/.test(senha),
      minusculo: /[a-z]/.test(senha),
      numero: /[0-9]/.test(senha),
      simbolo: /[^A-Za-z0-9]/.test(senha),
    }
    const cumpridos = Object.values(criterios).filter(Boolean).length
    let nivel = "Fraca"
    if (cumpridos >= 4) nivel = "Média"
    if (cumpridos === 5) nivel = "Forte"
    return { criterios, nivel }
  }

  const { criterios, nivel } = verificar(senha)

  const logar = async (e: React.FormEvent) => {
    e.preventDefault()
    const dados = {
      password: senha,
      emailRep: email,
    }
    try {
      const res = await fetch("http://localhost:8000/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
        credentials: "include",
      })
      if (res.ok) {
        onSuccess?.()
        router.push("/personaliza")
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
    }
  }

  const cadastrarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault()

    if (senha !== confirmarsenha) {
      Swal.fire("Erro", "As senhas não coincidem", "error")
      return
    }

    try {
      const dados = {
        nome,
        nomeRep,
        email_corporativo: emailCorporativo,
        emailRep: email,
        tipo_empresa: tipoEmpresa,
        setor_atuacao: setorAtuacao,
        cargo,
        nivel_acesso: nivelAcesso,
        password: senha,
        telefone,
        representante: nomeRep,
        nif,
        endereco,
      }
      const res = await fetch("http://localhost:8000/empresa/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      })
      if (res.ok) {
        Swal.fire("Sucesso!", "Empresa cadastrada com sucesso. Verifique seu email.", "success")
        logar(e)
      } else {
        Swal.fire("Erro", "Não foi possível cadastrar a empresa", "error")
      }
    } catch (error) {
      Swal.fire("Erro", "Erro de conexão com o servidor", "error")
    }
  }

  function CriterioItem({ valido, texto }: { valido: boolean; texto: string }) {
    const textoMap: { [key: string]: string } = {
      comprimento: "8+ caracteres",
      maiusculo: "Letra maiúscula",
      minusculo: "Letra minúscula",
      numero: "Número",
      simbolo: "Símbolo especial",
    }

    return (
      <div className="flex items-center gap-2 text-xs">
        {valido ? <CheckCircle className="text-emerald-500 size-3" /> : <XCircle className="text-red-500 size-3" />}
        <span className={cn("transition-colors", valido ? "text-emerald-600" : "text-slate-500")}>
          {textoMap[texto] || texto}
        </span>
      </div>
    )
  }

  const progressoAtual = ((avancar + 1) / PASSOS.length) * 100

  return (
    <div className="w-full max-h-[80vh] overflow-y-auto">
      {/* Header Compacto */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-slate-900">Cadastro Empresarial</h2>
        <p className="text-sm text-slate-600">Complete as informações para criar sua conta</p>
      </div>

      {/* Progress Indicator Compacto */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-700">
            Passo {avancar + 1} de {PASSOS.length}
          </span>
          <span className="text-xs text-slate-500">{Math.round(progressoAtual)}%</span>
        </div>
        <Progress value={progressoAtual} className="mb-3" />
        <div className="flex justify-center gap-4">
          {PASSOS.map((passo, index) => {
            const Icone = passo.icone
            return (
              <div key={passo.numero} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                    index <= avancar ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500",
                  )}
                >
                  {index < avancar ? <CheckCircle className="w-3 h-3" /> : <Icone className="w-3 h-3" />}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-slate-900">{passo.titulo}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step 1: Dados Institucionais */}
      {avancar === 0 && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-slate-900 flex items-center justify-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Dados Institucionais
            </h3>
            <p className="text-xs text-slate-600">Informações básicas da empresa</p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <Label htmlFor="nomeEmpresa" className="text-xs font-medium">
                  Nome da Empresa *
                </Label>
                <Input
                  id="nomeEmpresa"
                  type="text"
                  placeholder="Digite o nome da empresa"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="nif" className="text-xs font-medium">
                    NIF *
                  </Label>
                  <Input
                    id="nif"
                    type="text"
                    placeholder="NIF"
                    value={nif}
                    onChange={(e) => setNif(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="tipoEmpresa" className="text-xs font-medium">
                    Tipo
                  </Label>
                  <Select value={tipoEmpresa} onValueChange={setTipoEmpresa}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      
                      <SelectItem value="unipessoal">Privada</SelectItem>
                      <SelectItem value="sa">Pública</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="endereco" className="text-xs font-medium">
                  Endereço *
                </Label>
                <Input
                  id="endereco"
                  type="text"
                  placeholder="Endereço completo"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="emailCorporativo" className="text-xs font-medium">
                    Email Corporativo *
                  </Label>
                  <Input
                    id="emailCorporativo"
                    type="email"
                    placeholder="contato@empresa.com"
                    value={emailCorporativo}
                    onChange={(e) => setEmailCorporativo(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="setorAtuacao" className="text-xs font-medium">
                    Setor de Atuação
                  </Label>
                  <Select value={setorAtuacao} onValueChange={setSetorAtuacao}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="saude">Saúde</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="comercio">Comércio</SelectItem>
                      <SelectItem value="industria">Indústria</SelectItem>
                      <SelectItem value="servicos">Serviços</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setAvancar(avancar + 1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-9 text-sm"
                disabled={!nome || !nif || !endereco || !emailCorporativo}
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      )}

      {avancar === 1 && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-slate-900 flex items-center justify-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Dados do Representante
            </h3>
            <p className="text-xs text-slate-600">Informações do responsável</p>
          </div>

          <form onSubmit={cadastrarEmpresa} className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <Label htmlFor="nomeRepresentante" className="text-xs font-medium">
                  Nome Completo *
                </Label>
                <Input
                  id="nomeRepresentante"
                  type="text"
                  placeholder="Nome do representante"
                  value={nomeRep}
                  onChange={(e) => setRepNome(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="emailRep" className="text-xs font-medium">
                    Email *
                  </Label>
                  <Input
                    id="emailRep"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setRepEmail(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="telefone" className="text-xs font-medium">
                    Telefone *
                  </Label>
                  <Input
                    id="telefone"
                    type="tel"
                    placeholder="Telefone"
                    value={telefone}
                    onChange={(e) => settelefoneRe(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="cargo" className="text-xs font-medium">
                    Cargo
                  </Label>
                  <Select value={cargo} onValueChange={setCargo}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ceo">CEO</SelectItem>
                      <SelectItem value="diretor">Diretor</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                      <SelectItem value="coordenador">Coordenador</SelectItem>
                      <SelectItem value="proprietario">Proprietário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="nivelAcesso" className="text-xs font-medium">
                    Nível de Acesso *
                  </Label>
                  <Select value={nivelAcesso} onValueChange={setNivelAcesso}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                      <SelectItem value="usuario">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="senha" className="text-xs font-medium">
                    Senha *
                  </Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmarSenha" className="text-xs font-medium">
                    Confirmar *
                  </Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    placeholder="Confirmar"
                    value={confirmarsenha}
                    onChange={(e) => setconfirmarsenha(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {confirmarsenha && senha !== confirmarsenha && (
                <p className="text-xs text-red-600">As senhas não coincidem</p>
              )}
            </div>

            {senha && (
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-medium">Força da Senha</Label>
                  <Badge
                    variant={nivel === "Forte" ? "default" : nivel === "Média" ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {nivel}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(criterios).map(([key, valido]) => (
                    <CriterioItem key={key} valido={valido} texto={key} />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAvancar(avancar - 1)}
                className="px-4 h-9 text-sm"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-blue-700 text-white px-6 h-9 text-sm"
                disabled={
                  !nomeRep ||
                  !email ||
                  !telefone ||
                  !senha ||
                  !confirmarsenha ||
                  !nivelAcesso ||
                  senha !== confirmarsenha
                }
              >
                Cadastrar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
