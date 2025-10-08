'use client'
import Image from "next/image"
import Link from 'next/link'
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
const Section1 = () => {

  const [empresa, setempresa]=useState([])
  const [satifacao, setsatifacao]=useState(0)
  
    const handleComoFunciona = () => {
      Swal.fire({
        title: "Como funciona nossa plataforma?",
        html: `
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">1</div>
              <p><b>Análise personalizada</b> das necessidades do seu RH</p>
            </div>
            <div class="flex items-start">
              <div class="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">2</div>
              <p><b>Implementação gradual</b> dos módulos necessários</p>
            </div>
            <div class="flex items-start">
              <div class="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">3</div>
              <p><b>Treinamento completo</b> da sua equipe</p>
            </div>
            <div class="flex items-start">
              <div class="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">4</div>
              <p><b>Suporte contínuo</b> e atualizações regulares</p>
            </div>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Entendi',
        customClass: {
          popup: 'rounded-2xl shadow-xl',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg'
        }
      });
    };
  useEffect(()=>{
    const empresa =async()=>{
      const res= await fetch("https://recursohumanosactualizado.onrender.com/empresa/",{
      })
      const data= await res.json()
      setempresa(data.length)
    }
    const satifacao =async()=>{
      const res= await fetch("https://recursohumanosactualizado.onrender.com/satisfacao/",{
      })
      const data= await res.json()
      setsatifacao(data)
    }
    satifacao() 
    empresa()
  },[])
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 py-20 to-slate-900">
      
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left py-5"
          >
           
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-5xl mx-auto lg:mx-0 leading-tight">
              <span className="block">Simplifique a</span>
              <span className="bg-gradient-to-r  from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Gestão de RH 
              </span>
              <span className="whitespace-normal lg:text-5xl lg:whitespace-nowrap block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">da Sua Empresa</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Automatize processos, centralize informações e tome decisões estratégicas com nossa plataforma completa de gestão de recursos humanos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link 
                  href="/registrar" 
                  className="inline-flex items-center justify-center w-full text-lg font-medium text-center whitespace-nowrap px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                >
                  Solicitar Demonstração
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Button
                  onClick={handleComoFunciona}
                  className="inline-flex lg:h-14 h-14 items-center justify-center w-full text-lg font-medium text-center whitespace-nowrap px-8 py-4 bg-transparent text-white rounded-xl border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                >
                  Funcionalidades
                </Button>
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">+{empresa}</div>
                <div className="text-sm text-slate-400">Empresas</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">{satifacao}%</div>
                <div className="text-sm text-slate-400">Satisfação</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-slate-400">Suporte</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 z-10"></div>
              <Image 
                src='/hr.png' 
                alt="Dashboard da plataforma de gestão de RH" 
                width={600} 
                height={600}
                className="w-full h-auto"
                priority
              />
              
              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="text-white font-semibold">+15%</div>
                <div className="text-cyan-300 text-sm">Eficiência</div>
              </motion.div>
              
            </div>
            
            <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Section1;