'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function traduzirErroServidor(payload: { detail: string | string[]; email: any[]; otp: any[]; senha: any[]; }) {
  if (payload.detail) {
    if (payload.detail.includes('OTP inválido')) return 'Código OTP inválido ou expirado. Verifique e tente novamente.';
    if (payload.detail.includes('Funcionário não existe')) return 'E-mail não encontrado no sistema.';
    if (payload.detail.includes('A conta do funcionário ainda não foi ativada')) return 'A conta ainda não foi ativada. Verifique o OTP primeiro.';
    if (payload.detail.includes('OTP verificado')) return 'OTP verificado com sucesso! Crie sua nova senha.';
    if (payload.detail.includes('Senha criada com sucesso')) return 'Senha criada com sucesso. Faça login para continuar.';
    return payload.detail;
  }
  if (payload.email) return `E-mail: ${payload.email.join(', ')}`;
  if (payload.otp) return `OTP: ${payload.otp.join(', ')}`;
  if (payload.senha) return `Senha: ${payload.senha.join(', ')}`;
  
  return 'Ocorreu um erro desconhecido. Tente novamente.';
}

export default function VerificarOTP() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [etapa, setEtapa] = useState('otp'); 
  const [otp, setOtp] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Recupera o email da URL ao carregar a página
  useEffect(() => {
    const emailQuery = searchParams.get('email');
    if (emailQuery) setEmail(emailQuery);
  }, [searchParams]);

  async function handleVerificarOtp(e:React.FormEvent) {
    e.preventDefault();
    setCarregando(true);

    try {
      const res = await fetch("http://localhost:8000/verifcar-otp/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const payload = await res.json();
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Sucesso', text: payload.detail });
        setEtapa('senha');
      } else {
        // Swal.fire({ icon: 'error', title: 'Erro', text: traduzirErroServidor(payload) });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Erro de conexão', text: 'Não foi possível verificar o OTP.' });
    } finally {
      setCarregando(false);
    }
  }

  // Handler para criar a nova senha
  async function handleCriarSenha(e:React.FormEvent) {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      Swal.fire({ icon: 'error', title: 'Erro', text: 'As senhas não coincidem.' });
      return;
    }
    setCarregando(true);

    try {
      const res = await fetch("http://localhost:8000/set-password/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, confirmar_senha: confirmarSenha }),
      });

      const payload = await res.json();
      if (res.ok) {
        await Swal.fire({ icon: 'success', title: 'Sucesso', text: payload.detail });

        const tokenRes = await fetch("http://127.0.0.1:8000/api/token/", {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: senha }),
        });
        const data = await tokenRes.json();

        if (tokenRes.ok) {
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);

          router.replace('/painel'); 
        } else {
          Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Não foi possível fazer o login automático. Por favor, entre com sua nova senha.' });
          router.replace('/login');
        }

      } else {
        // Swal.fire({ icon: 'error', title: 'Erro', text: traduzirErroServidor(payload) });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Erro de conexão', text: 'Não foi possível criar a senha.' });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      {etapa === 'otp' ? (
        <form onSubmit={handleVerificarOtp} className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold text-center">Verificar Código OTP</h1>
          <p className="text-center text-gray-600">Enviamos um código para: {email}</p>

          <div>
            <Label htmlFor="otp">Código OTP</Label>
            <Input id="otp" type="text" required value={otp} onChange={e => setOtp(e.target.value)} placeholder="Digite o código" disabled={carregando} />
          </div>

          <Button type="submit" className="w-full" disabled={carregando}>
            {carregando ? 'Verificando...' : 'Verificar OTP'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleCriarSenha} className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold text-center">Criar Nova Senha</h1>

          <div>
            <Label htmlFor="senha">Senha</Label>
            <Input id="senha" type="password" required value={senha} onChange={e => setSenha(e.target.value)} placeholder="Sua nova senha" disabled={carregando} />
          </div>

          <div>
            <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
            <Input id="confirmarSenha" type="password" required value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} placeholder="Repita a senha" disabled={carregando} />
          </div>

          <Button type="submit" className="w-full" disabled={carregando}>
            {carregando ? 'Criando...' : 'Criar Senha'}
          </Button>
        </form>
      )}
    </div>
  );
}