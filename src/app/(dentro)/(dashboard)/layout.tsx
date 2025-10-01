'use client';
import Menu from "@/components/Menu";
import NavbarRH from "@/components/Navbar"; 
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FeedbackSatisfacao from "@/components/satisfacao"; 
import { useState, useRef, useEffect } from "react"
import { buscarDados } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Menu as MenuIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [apresentar, setApresentar] = useState(false);
  const [abrirMenu, setAbrirMenu] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        const res = await buscarDados();
        if (!res) {
          setTimeout(() => {
            Swal.fire({
              title: "Não Estás Autenticado",
              text: "Inicie Sessão Para Navegar",
              icon: "warning",
              confirmButtonText: "Ir para Login",
              confirmButtonColor: "#3B82F6"
            });
            router.push("/");
          }, 1000);
        } else {
          console.log("Dados do usuário:", res);
          setApresentar(true);
        }
      } catch (error) {
        console.error("Erro na autenticação:", error);
        Swal.fire("Erro", "Falha na autenticação", "error");
        router.push("/");
      } finally {
        setCarregando(false);
      }
    };
    
    carregar();
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAbrirMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (abrirMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [abrirMenu]);

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 ">
        <div className="flex flex-col items-center justify-center gap-4">
          <motion.div
            className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-center">
            <p className="text-lg font-medium text-white">Verificando autenticação...</p>
            <p className="text-sm text-white mt-1">Carregando AVD Soluções</p>
          </div>
        </div>
      </div>
    );
  }

  if (!apresentar) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 ">
      <div className="flex h-screen font-sans">
        <div className={`
          hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64 xl:w-72'}
        `}>
          <Menu 
            isCollapsed={isCollapsed}
            onCollapseToggle={handleCollapseToggle}
          />
        </div>

        <AnimatePresence>
          {abrirMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setAbrirMenu(false)}
              />
              <motion.div
                ref={menuRef}
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-79 max-w-[85vw] z-50 lg:hidden bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl"
              >
                
                <div className="h-full overflow-y-auto">
                  <Menu 
                    isCollapsed={false}
                    onCollapseToggle={handleCollapseToggle}
                    onItemClick={() => setAbrirMenu(false)}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className={`
          flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:ml-30' : 'lg:ml-0'}
        `}>
          <div className="sticky top-0 z-30 bg-white shadow-sm">
            <NavbarRH 
              onMenuToggle={() => setAbrirMenu(!abrirMenu)}
              menuAberto={abrirMenu}
              isMenuCollapsed={isCollapsed}
              onCollapseToggle={handleCollapseToggle}
            />
          </div>

          <main className="flex-1 overflow-auto bg-gradient-to-b from-slate-900 to-slate-800 ">
            <div className={`
              container mx-auto p-4 lg:p-6 max-w-7xl transition-all duration-300
              ${isCollapsed ? 'lg:pl-2' : 'lg:pl-6'}
            `}>
              {children}
            </div>
          </main>
        </div>
      </div>

      <FeedbackSatisfacao />
    </div>
  );
}