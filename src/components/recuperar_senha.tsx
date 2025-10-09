"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";


interface LoginData {
  password: string;
  emailRep: string;
}

interface LoginResponse {
  nivel_acesso: 'admin' | 'funcionario';
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface LoginFormProps extends React.ComponentProps<"form"> {
  className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  // Estados do formulário
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formState, setFormState] = useState({
    isLoading: false,
    showPassword: false,
    errors: {
      email: '',
      password: '',
      general: ''
    }
  });

  const router = useRouter();

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      password: '',
      general: ''
    };

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Digite um email válido';
    }

    if (!formData.password) {
      newErrors.password = 'Palavra-passe é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Palavra-passe deve ter pelo menos 6 caracteres';
    }

    setFormState(prev => ({ ...prev, errors: newErrors }));
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Handler para mudanças nos inputs
  const handleInputChange = (field: 'email' | 'password') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro quando usuário começar a digitar
    if (formState.errors[field]) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, [field]: '' }
      }));
    }
  };

  // Toggle para mostrar/ocultar senha
  const togglePasswordVisibility = () => {
    setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  // Função de login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulário antes de enviar
    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, isLoading: true, errors: { ...prev.errors, general: '' } }));

    const loginData: LoginData = {
      password: formData.password,
      emailRep: formData.email
    };

    try {
      const response = await fetch('https://avdserver.up.railway.app/login/', {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(loginData),
        credentials: "include"
      });

      const data: LoginResponse = await response.json();

      if (response.ok) {
        // Sucesso no login
        await Swal.fire({
          title: 'Login realizado com sucesso!',
          text: `Bem-vindo(a) de volta${data.user?.name ? ', ' + data.user.name : ''}!`,
          icon: 'success',
          confirmButtonText: 'Continuar',
          timer: 2000,
          timerProgressBar: true,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });

        // Redirecionamento baseado no nível de acesso
        const nivel = (data.nivel_acesso || '').toString().toLowerCase();
        const redirectPath = ['admin', 'gestor', 'manager'].includes(nivel) ? '/admin' : '/funcionario';
        router.push(redirectPath);

      } else {
        // Erro na resposta
        const errorMessage = data.message || 'Credenciais inválidas. Verifique seus dados e tente novamente.';
        
        setFormState(prev => ({
          ...prev,
          errors: { ...prev.errors, general: errorMessage }
        }));

        await Swal.fire({
          title: 'Erro no Login',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Tentar Novamente',
          confirmButtonColor: '#ef4444'
        });
      }

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      
      const errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, general: errorMessage }
      }));

      await Swal.fire({
        title: 'Erro de Conexão',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444'
      });

    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleLogin}
      noValidate
      {...props}
    >
      <div className="grid gap-6">
        {/* Campo de Email */}
        <div className="grid gap-3">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleInputChange('email')}
              className={cn(
                "pl-10 transition-colors",
                formState.errors.email && "border-red-500 focus:border-red-500"
              )}
              disabled={formState.isLoading}
              autoComplete="email"
              required
            />
          </div>
          {formState.errors.email && (
            <p className="text-sm text-red-500 mt-1">{formState.errors.email}</p>
          )}
        </div>

        {/* Campo de Senha */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Palavra-passe
            </Label>
            <Link
              href="/recuperar-senha"
              className="text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              id="password"
              type={formState.showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange('password')}
              className={cn(
                "pl-10 pr-10 transition-colors",
                formState.errors.password && "border-red-500 focus:border-red-500"
              )}
              disabled={formState.isLoading}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={formState.isLoading}
            >
              {formState.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formState.errors.password && (
            <p className="text-sm text-red-500 mt-1">{formState.errors.password}</p>
          )}
        </div>

        {/* Erro geral */}
        {formState.errors.general && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {formState.errors.general}
          </div>
        )}

        {/* Botão de Submit */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5 transition-all duration-300 shadow-lg hover:shadow-xl"
          disabled={formState.isLoading}
        >
          {formState.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Iniciar Sessão'
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-gray-600">
        Ainda não tem uma conta?{" "}
        <Link 
          href="/registrar" 
          className="text-blue-600 hover:text-blue-800 underline underline-offset-4 font-medium transition-colors"
        >
          Criar Conta
        </Link>
      </div>
    </form>
  );
}