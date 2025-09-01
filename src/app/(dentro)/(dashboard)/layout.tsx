'use client'
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {useState, useRef, useEffect} from "react"
import { buscarDados } from "@/lib/api";
import { motion } from "framer-motion";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
let menuref = useRef<HTMLDivElement>(null);
const router = useRouter();
const [apresentar,setapresentar]=useState(false);
useEffect(() => {
    
    document.addEventListener("click", handleClickOutside, true);

}, []);
useEffect(()=>{
  const carregar =async() => {
    const res = await buscarDados();
    if(!res) {
      setTimeout(() => {
        Swal.fire("Não Estás Autenticado", " Inicie Sessão Para Navegar", "warning")
        router.push("/");
      }, 1000);
    }else {
      console.log("Dados", res)
      setapresentar(true);
    }
  };
  carregar();
}, [router]);
const handleClickOutside = (event: { target: any; }) => {
    if (menuref.current && !menuref.current.contains(event.target)) {
        console.log("Clique fora do menu");
        setabrirMenu(false);
    } else if (menuref.current) {
        console.log("Clique dentro do menu");
    }
};
  const [abrirMenu, setabrirMenu] = useState(false);
  return (
      
      <div >
        {apresentar === false && (<div>
        <div className="flex items-center justify-center h-screen ">
          <div className="flex flex-col items-center justify-center gap-2"><motion.div
            className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-purple-600"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <p>Verificando autenticação...</p></div>
        </div>

      </div>)}
      {apresentar && (
        <div className="h-screen flex font-sans">
          <div className="flex-col hidden md:flex  w-1/5 md:w-2/10  xl:w-1/6">
            <Menu />
          </div>
          {abrirMenu && (
            <div className="fixed top-0 left-0 h-full w-[50%] bg-sky-700 z-50 md:hidden shadow-lg p-4" ref={menuref}>
              <Menu onClose={() => setabrirMenu(false)} />
            </div>
          )}
          <div className="flex-1 flex flex-col  bg-gray-50 overflow-auto">
            <Navbar />

            <main className="flex-1 p-4 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      )}
      
        
    </div>
  );

}
