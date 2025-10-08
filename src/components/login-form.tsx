"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Swal from "sweetalert2"
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle } from "lucide-react"

interface LoginData {
  password: string
  emailRep: string
}

interface LoginResponse {
  success?: boolean
  nivel_acesso?: "admin" | "funcionario"
  message?: string
  error?: string
  field?: string
  user?: {
    id: string
    name: string
    email: string
  }
}

interface LoginFormProps extends React.ComponentProps<"form"> {
  className?: string
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [formState, setFormState] = useState({
    isLoading: false,
    showPassword: false,
    errors: {
      email: "",
      password: "",
      general: "",
    },
  })

  const router = useRouter()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors = {
      email: "",
      password: "",
      general: "",
    }

    if (!formData.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Digite um email válido"
    }

    if (!formData.password) {
      newErrors.password = "Palavra-passe é obrigatória"
    } else if (formData.password.length < 6) {
      newErrors.password = "Palavra-passe deve ter pelo menos 6 caracteres"
    }

    setFormState((prev) => ({ ...prev, errors: newErrors }))
    return !Object.values(newErrors).some((error) => error !== "")
  }

  const handleInputChange = (field: "email" | "password") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (formState.errors[field]) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [field]: "" },
      }))
    }
  }

  const togglePasswordVisibility = () => {
    setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setFormState((prev) => ({ ...prev, isLoading: true, errors: { ...prev.errors, general: "" } }))

    const loginData: LoginData = {
      password: formData.password,
      emailRep: formData.email,
    }

    try {
      const response = await fetch("https://avdserver.up.railway.app/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      })

      const data: LoginResponse = await response.json()

      if (response.ok && data.success) {
        await Swal.fire({
          title: "Login realizado!",
          text: `Bem-vindo(a) de volta${data.user?.name ? ", " + data.user.name : ""}!`,
          icon: "success",
          confirmButtonText: "Continuar",
          timer: 2000,
          timerProgressBar: true,
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        })

        const redirectPath = data.nivel_acesso === "admin" ? "/admin" : "/funcionarios"
        router.push(redirectPath)
      } else {
        // Tratamento específico de erros
        const errorMessage = data.message || "Erro ao fazer login. Tente novamente."
        const errorField = data.field || "general"

        setFormState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [errorField]: errorMessage,
            general: errorField === "general" ? errorMessage : "",
          },
        }))

        // Mostrar alerta apenas para erros gerais ou críticos
        if (response.status === 403 || response.status === 404) {
          await Swal.fire({
            title: data.error || "Erro no Login",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#ef4444",
          })
        }
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)

      const errorMessage = "Erro de conexão. Verifique sua internet e tente novamente."

      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, general: errorMessage },
      }))

      await Swal.fire({
        title: "Erro de Conexão",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      })
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleLogin} noValidate {...props}>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleInputChange("email")}
              className={cn(
                "pl-10 h-11 transition-all duration-200",
                formState.errors.email && "border-destructive focus-visible:ring-destructive",
              )}
              disabled={formState.isLoading}
              autoComplete="email"
              required
            />
          </div>
          {formState.errors.email && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle size={14} />
              <span>{formState.errors.email}</span>
            </div>
          )}
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Palavra-passe
            </Label>
            <Link
              href="/recuperar_senha"
              className="text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              id="password"
              type={formState.showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange("password")}
              className={cn(
                "pl-10 pr-10 h-11 transition-all duration-200",
                formState.errors.password && "border-destructive focus-visible:ring-destructive",
              )}
              disabled={formState.isLoading}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={formState.isLoading}
              aria-label={formState.showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {formState.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formState.errors.password && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle size={14} />
              <span>{formState.errors.password}</span>
            </div>
          )}
        </div>

        {formState.errors.general && (
          <div className="flex items-center gap-3 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{formState.errors.general}</span>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          disabled={formState.isLoading}
        >
          {formState.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Iniciar Sessão"
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Ainda não tem uma conta?{" "}
        <Link
          href="/registrar"
          className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors"
        >
          Criar Conta
        </Link>
      </div>
    </form>
  )
}
