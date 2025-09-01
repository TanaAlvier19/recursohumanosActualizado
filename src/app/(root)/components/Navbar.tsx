"use client";
import Image from "next/image";
import Swal from "sweetalert2";
import React, { useState, useEffect } from 'react';
import { LoginForm } from "@/components/login-form";
import { CadastroDialog } from "@/components/cadastro";
import { X, Menu, User, UserPlus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [abrirDialog, setAbrir] = useState(false);
  const [cadastro, setCadastro] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleComoFunciona = () => {
    Swal.fire({
      title: "Como funciona o E-FILA?",
      html: `
        <div class="space-y-3">
          <div class="flex items-start">
            <div class="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">1</div>
            <p>Você escolhe o <b>local de atendimento</b> e o <b>serviço desejado</b>.</p>
          </div>
          <div class="flex items-start">
            <div class="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">2</div>
            <p>O sistema mostra os <b>horários disponíveis</b>.</p>
          </div>
          <div class="flex items-start">
            <div class="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">3</div>
            <p>Você faz a <b>reserva da fila</b> e recebe um <b>número digital</b>.</p>
          </div>
          <div class="flex items-start">
            <div class="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">4</div>
            <p>Ao chegar no local, <b>o atendimento já estará agendado</b>.</p>
          </div>
          <hr class="my-4 border-gray-200" />
          <p class="text-gray-600 italic">Você pode acompanhar o status da fila em tempo real pelo celular ou receber notificações por SMS.</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Entendi!',
      customClass: {
        popup: 'rounded-2xl shadow-xl',
        confirmButton: 'bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full'
      }
    });
  };

  return (
    <>
     
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 ${
          scrolled 
            ? 'bg-white shadow-md py-2 border-b border-gray-100' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            
            <div className="flex-shrink-0">
              <Image 
                src="/Onono.png" 
                alt="Onono" 
                width={140} 
                height={40} 
                className="w-32 md:w-40"
              />
            </div>

            <div className="hidden lg:flex gap-8 items-center">
              <Button 
                variant="ghost"
                className={`font-medium text-base ${
                  scrolled 
                    ? 'text-gray-700 hover:text-purple-600' 
                    : 'text-white hover:text-purple-300'
                }`}
              >
                Serviços
              </Button>
              <Button 
                variant="ghost"
                onClick={handleComoFunciona}
                className={`font-medium text-base ${
                  scrolled 
                    ? 'text-gray-700 hover:text-purple-600' 
                    : 'text-white hover:text-purple-300'
                }`}
              >
                Como funciona?
              </Button>
              <Button 
                variant="ghost"
                className={`font-medium text-base ${
                  scrolled 
                    ? 'text-gray-700 hover:text-purple-600' 
                    : 'text-white hover:text-purple-300'
                }`}
              >
                Sobre nós
              </Button>
            </div>

            <div className="hidden lg:flex gap-3">
              <Button 
                variant="outline" 
                className="border-purple-600 text-purple-600 hover:bg-purple-50 font-medium flex items-center gap-2"
                onClick={() => setAbrir(true)}
              >
                <User size={18} />
                Iniciar Sessão
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-medium text-white flex items-center gap-2"
                onClick={() => setCadastro(true)}
              >
                <UserPlus size={18} />
                Criar Conta
              </Button>
            </div>

            <div className="lg:hidden">
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="text-gray-700"
              >
                <Menu size={24} />
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white lg:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                <Image 
                  src="/Onono.png" 
                  alt="Onono" 
                  width={120} 
                  height={35} 
                  className="w-32"
                />
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={24} />
                </Button>
              </div>

              <div className="flex flex-col gap-4 flex-grow">
                <Button 
                  variant="ghost"
                  className="justify-start text-lg py-5"
                >
                  Serviços
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => {
                    handleComoFunciona();
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start text-lg py-5"
                >
                  Como funciona?
                </Button>
                <Button 
                  variant="ghost"
                  className="justify-start text-lg py-5"
                >
                  Sobre nós
                </Button>
              </div>

              <div className="flex flex-col gap-3 mt-auto pt-8">
                <Button 
                  variant="outline" 
                  className="border-purple-600 text-purple-600 font-medium py-6 text-lg"
                  onClick={() => {
                    setAbrir(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Iniciar Sessão
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 font-medium text-white py-6 text-lg"
                  onClick={() => {
                    setCadastro(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Criar Conta
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* {abrirDialog &&(
        <div className="fixed insert-0 z-50 bg-white">

        </div>
      )

      } */}
      <Dialog open={abrirDialog} onOpenChange={setAbrir}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Acesse sua conta</DialogTitle>
            <DialogDescription className="text-gray-600">
              Insira suas credenciais para entrar no sistema
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <LoginForm  />
          </div>
          <DialogClose asChild>
            <Button variant="ghost" className="absolute top-4 right-4" size="icon">
              <X size={20} />
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Dialog open={cadastro} onOpenChange={setCadastro}>
      <DialogContent className="sm:max-w-2xl max-w-[95vw] rounded-2xl p-6">
        <CadastroDialog onSuccess={() => setCadastro(false)} onCancel={() => setCadastro(false)} />
        <DialogClose asChild>
          <Button variant="ghost" className="absolute top-4 right-4" size="icon">
            <X size={20} />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default Navbar;