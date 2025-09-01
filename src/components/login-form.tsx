"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useState} from "react"
import Swal from "sweetalert2"
import Link from "next/link"
import { useRouter } from "next/navigation"
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [senha, setsenha]=useState('')
  const [email, setemail]=useState('')
  const router =useRouter()
  const logar =async (e:React.FormEvent)=>{
    e.preventDefault()
    const dados={
        password:senha,
        emailRep:email
      }
   try{
    const res=await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
        credentials:"include"
    })
    const data = await res.json();
    if(res.ok){
   
    Swal.fire({
      title: 'Login bem-sucedido',
      text: 'Bem-vindo(a) de volta!',
      icon: 'success',
      confirmButtonText: 'OK'
    })
    if (data.nivel_acesso === 'admin') {
                router.push("/admin");
            } else if (data.nivel_acesso === 'funcionario') {
                router.push("/funcionarios"); 
            }
  }
   }
   
  catch(error){
    console.error("Erro ao fazer login:", error);
    return;
   }
   
  }
  
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={logar}>
      
      <div className="grid gap-6">
        
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required value={email}  onChange={(e)=>setemail(e.target.value)}/>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Palavra-Passe</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu a sua senha?
            </a>
          </div>
          <Input id="password" type="password" required  value={senha} onChange={(e)=>setsenha(e.target.value)}/>
        </div>
        <Button  className="w-full bg-purple-600 hover:text-purple-500 hover:bg-amber-50 cursor-pointer" type="submit">
          Iniciar Sessão
        </Button>
        
      </div>
      <div className="text-center text-sm">
        Ainda não tens uma conta?{" "}
        <Link href="#" className="underline underline-offset-4">
          Criar Conta
        </Link>
      </div>
    </form>
  )
}
