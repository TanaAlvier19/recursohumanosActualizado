'use client';
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  CalendarCheck,
  FileText,
  GraduationCap,
  DollarSign,
  Settings,
  LogOut,
  LayoutDashboard,
  User,
  HelpCircle
} from "lucide-react";
import Swal from "sweetalert2";

const Menu1 = () => {
  const router = useRouter();

  async function logout() {
    try {
      const res = await fetch("/api/logout/", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        Swal.fire("Até logo!", "Sessão encerrada com sucesso", "success");
        router.push("/login");
      }
    } catch (err) {
      Swal.fire("Erro", "Falha ao tentar sair", "error");
    }
  }

  return (
    <div className="h-screen flex">
      <div className="w-64 bg-gradient-to-b from-purple-600 to-blue-600 text-white">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 mt-4">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            <div>
              {/* <p className="font-bold">João Silva</p>
              <p className="text-xs text-blue-200">Desenvolvedor Sênior</p> */}
            </div>
          </div>

          <nav className="space-y-1">
            <Link 
              href="/funcionarios" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <LayoutDashboard size={20} />
              <span>Visão Geral</span>
            </Link>
            
            <Link 
              href="/menu/assiduidade" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Clock size={20} />
              <span>Meu Ponto</span>
            </Link>
            
            <Link 
              href="/menu/pedir_dispensa" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <CalendarCheck size={20} />
              <span>Minhas Férias</span>
            </Link>
            
            {/* <Link 
              href="/meus-holerites" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <DollarSign size={20} />
              <span>Holerites</span>
            </Link> */}
            
            {/* <Link 
              href="/meu-desempenho" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <FileText size={20} />
              <span>Avaliações</span>
            </Link> */}
            
            <Link 
              href="/menu/formacoes" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <GraduationCap size={20} />
              <span>Treinamentos</span>
            </Link>
            
            {/* <Link 
              href="/meu-perfil" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <User size={20} />
              <span>Meu Perfil</span>
            </Link> */}
          </nav>

          <div className="mt-20 border-t border-blue-500 pt-4">
            <Link 
              href="/ajuda"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <HelpCircle size={20} />
              <span>Suporte RH</span>
            </Link>
            
            <Link 
              href="/configuracoes" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Settings size={20} />
              <span>Configurações</span>
            </Link>
            
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors text-left"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu1;