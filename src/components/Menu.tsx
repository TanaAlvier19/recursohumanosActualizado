'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { buscarDados,buscarModulos } from "@/lib/api";
import {useRouter} from "next/navigation"
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  DollarSign,
  GraduationCap, 
   FileInputIcon,
  FileText,
  Building,
  Info,
  Users,
  Gift,
  Briefcase,
  Settings,
  LogOut,
  LayoutDashboard,
  Plus,
  HelpCircle,
} from "lucide-react"
import Swal from "sweetalert2";

interface MenuProps {
  onClose?: () => void;
}


const Menu = ({ onClose }: MenuProps) => {
const router=useRouter()
async function logout() {
  try {
    const res = await fetch("http://localhost:8000/logout/", {
      credentials: "include",
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (res.ok) {
      Swal.fire("Saindo", "Volte Sempre", "success");
      router.push("/");
    }
  }

  catch (err) {
  }
}
const [empresa, setempresa]=useState('')
const [modulos, setmodulos]=useState<string[]>([])
//useEffect(() => {
//        const carregar=async()=>{
//         const res= await buscarDados();
//         if(!res){}else{
//           setempresa(res.empresa)
//         }
//        }
//        carregar()
//        const modulos=async()=>{
//         const res =await buscarModulos();
//         if(res){
//           setmodulos(res.map((item:{nome:string})=>item.nome))
//         }
//        }
//        modulos()

//     }, []);
//     console.log(modulos)

  return (

    <div className="h-screen flex">
      <div className="w-64 bg-gradient-to-b from-purple-600 to-blue-600 text-white">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    
                  </div>
                  <span className="font-semibold text-lg">AVD</span>
                </div>
      
                <nav className="space-y-2">
                  <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                    <LayoutDashboard size={20} />
                    <span>Visão Geral</span>
                  </Link>
                  <Link href="/list/departamento" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                    <Building size={20} />
                    <span>Departamentos</span>
                  </Link>
                  <Link href="/list/funciona" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                    <Users size={20} />
                    <span>Funcionários</span>
                  </Link>
                  <Link href="/list/assiduidade" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                    <Briefcase size={20} />
                    <span>Assiduidade</span>
                  </Link>
                  <Link href="/list/dispensas" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                    <FileInputIcon size={20} />
                    <span >Dispensas</span>
                  </Link>
                  <Link href="/list/get_courses" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                    <GraduationCap size={20} />
                    <span >Formações</span>
                  </Link>
                  <Link href="/list/pagamento" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                    <DollarSign size={20} />
                    <span >Folha de Pagamento</span>
                  </Link>
                  <Link href="/list/recrutamento" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                    <Briefcase size={20} />
                    <span>Recrutamento</span>
                  </Link>
                  
                  </nav>
                  <div className="mt-10 border-t border-blue-500 pt-1">
                              <Link 
                                href="/ajuda"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors"
                              >
                                <HelpCircle size={20} />
                                <span>Suporte RH</span>
                              </Link>
                              
                              <Link 
                                href="/personaliza" 
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
    </div>  );
};

export default Menu;
