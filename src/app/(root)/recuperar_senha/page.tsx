// app/recuperar-senha/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2, Mail, Shield, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Swal from "sweetalert2"
import Link from "next/link"

type Step = "email" | "codigo" | "nova-senha"

export default function RecuperarSenhaPage() {
  const [step, setStep] = useState<Step>("email")
  const [formData, setFormData] = useState({
    email: "",
    codigo: "",
    novaSenha: "",
    confirmarSenha: ""
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password)
  }

  const handleSolicitarRecuperacao = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!formData.email) {
      setErrors({ email: "Email é obrigatório" })
      return
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: "Digite um email válido" })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("https://avdserver.up.railway.app/solicitar-recuperacao-senha/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep("codigo")
        await Swal.fire({
          title: "Código enviado!",
          text: data.message,
          icon: "success",
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true,
        })
      } else {
        setErrors({ general: data.message || "Erro ao solicitar recuperação" })
      }
    } catch (error) {
      setErrors({ general: "Erro de conexão. Tente novamente." })
    } finally {
      setLoading(false)
    }
  }

  const handleVerificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!formData.codigo || formData.codigo.length !== 6) {
      setErrors({ codigo: "Código deve ter 6 dígitos" })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("https://avdserver.up.railway.app/verificar-codigo-recuperacao/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          codigo: formData.codigo
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep("nova-senha")
        await Swal.fire({
          title: "Código verificado!",
          text: data.message,
          icon: "success",
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true,
        })
      } else {
        setErrors({ general: data.message || "Código inválido" })
      }
    } catch (error) {
      setErrors({ general: "Erro de conexão. Tente novamente." })
    } finally {
      setLoading(false)
    }
  }

  const handleRedefinirSenha = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!formData.novaSenha) {
      setErrors({ novaSenha: "Nova senha é obrigatória" })
      return
    }

    if (!validatePassword(formData.novaSenha)) {
      setErrors({ 
        novaSenha: "A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números" 
      })
      return
    }

    if (formData.novaSenha !== formData.confirmarSenha) {
      setErrors({ confirmarSenha: "As senhas não coincidem" })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("https://avdserver.up.railway.app/redefinir-senha/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          codigo: formData.codigo,
          nova_senha: formData.novaSenha,
          confirmar_senha: formData.confirmarSenha
        }),
      })

      const data = await response.json()

      if (response.ok) {
        await Swal.fire({
          title: "Senha redefinida!",
          text: data.message,
          icon: "success",
          confirmButtonText: "Fazer Login",
          timer: 4000,
          timerProgressBar: true,
        })
        window.location.href = "/login"
      } else {
        setErrors({ general: data.message || "Erro ao redefinir senha" })
      }
    } catch (error) {
      setErrors({ general: "Erro de conexão. Tente novamente." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-primary hover:text-primary/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
          </div>
          <CardDescription>
            {step === "email" && "Digite seu email para receber um código de recuperação"}
            {step === "codigo" && "Digite o código que enviamos para seu email"}
            {step === "nova-senha" && "Crie uma nova senha para sua conta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" && (
            <form onSubmit={handleSolicitarRecuperacao} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle size={14} />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {errors.general && (
                <div className="flex items-center gap-3 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle size={16} />
                  <span>{errors.general}</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Código
              </Button>
            </form>
          )}

          {step === "codigo" && (
            <form onSubmit={handleVerificarCodigo} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código de Verificação</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="codigo"
                    type="text"
                    placeholder="123456"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.replace(/\D/g, '') })}
                    className="pl-10"
                    maxLength={6}
                    required
                  />
                </div>
                {errors.codigo && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle size={14} />
                    <span>{errors.codigo}</span>
                  </div>
                )}
              </div>

              {errors.general && (
                <div className="flex items-center gap-3 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle size={16} />
                  <span>{errors.general}</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("email")}
                >
                  Voltar
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verificar Código
                </Button>
              </div>
            </form>
          )}

          {step === "nova-senha" && (
            <form onSubmit={handleRedefinirSenha} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="novaSenha">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="novaSenha"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.novaSenha}
                    onChange={(e) => setFormData({ ...formData, novaSenha: e.target.value })}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.novaSenha && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle size={14} />
                    <span>{errors.novaSenha}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmarSenha"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmarSenha}
                    onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmarSenha && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle size={14} />
                    <span>{errors.confirmarSenha}</span>
                  </div>
                )}
              </div>

              {errors.general && (
                <div className="flex items-center gap-3 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle size={16} />
                  <span>{errors.general}</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("codigo")}
                >
                  Voltar
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Redefinir Senha
                </Button>
              </div>
            </form>
          )}

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Lembrou sua senha?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 underline underline-offset-4">
              Fazer Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}