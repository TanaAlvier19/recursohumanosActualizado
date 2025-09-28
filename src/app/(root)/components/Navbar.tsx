// components/Navbar.tsx
'use client';
import Image from "next/image";
import Swal from "sweetalert2";
import React, { useState, useEffect } from 'react';
import { LoginForm } from "@/components/login-form";
import { CadastroDialog } from "@/components/cadastro";
import { X, Menu, User, UserPlus, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const Navbar = () => {
  const [abrirDialog, setAbrir] = useState(false);
  const [cadastro, setCadastro] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed w-full text-blue-900 z-50 top-0 left-0 transition-all duration-300 ${
          scrolled 
            ? 'text-blue-900 backdrop-blur-md shadow-lg py-3 border-b ' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-xl">
                <div className="bg-gray-900 p-2 rounded-md">
                  <div className="bg-gray-800 w-6 h-6 rounded" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  AVD<span className="font-light">Soluções</span>
                </h3>
                <p className="text-xs text-gray-500">Tecnologia para RH</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="font-medium text-white hover:text-blue-600 transition-colors">
                Home
              </Link>
              
              <div className="relative" onMouseEnter={() => setServicesDropdown(true)} onMouseLeave={() => setServicesDropdown(false)}>
                <button className="font-medium text-white hover:text-blue-600 transition-colors flex items-center">
                  Serviços <ChevronDown size={16} className="ml-1" />
                </button>
                <AnimatePresence>
                  {servicesDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                    >
                      <Link href="/modulo" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                        Módulos RH
                      </Link>
                      <Link href="/consultoria" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                        Consultoria
                      </Link>
                      <Link href="/treinamentos" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                        Treinamentos
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/sobre" className="font-medium text-white hover:text-blue-600 transition-colors">
                Sobre nós
              </Link>
              
              <Link href="/contacto" className="font-medium text-white hover:text-blue-600 transition-colors">
                Contactar
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 font-medium"
                onClick={() => setAbrir(true)}
              >
                <User size={18} className="mr-2" />
                Entrar
              </Button>
              <Link href={"/registrar"}>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium py-3"
                  onClick={() => {
                   /*  setCadastro(true); */
                    setMobileMenuOpen(false);
                  }}
                >
                  Criar Conta
                </Button>
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
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
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-xl">
                    <div className="bg-gray-900 p-2 rounded-md">
                      <div className="bg-gray-800 w-6 h-6 rounded" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    AVD Soluções
                  </h3>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 space-y-4">
                <Link href="/" className="block text-lg font-medium text-gray-700 py-3 border-b border-gray-100">
                  Home
                </Link>
                <Link href="/modulos" className="block text-lg font-medium text-gray-700 py-3 border-b border-gray-100">
                  Módulos RH
                </Link>
                <Link href="/sobre" className="block text-lg font-medium text-gray-700 py-3 border-b border-gray-100">
                  Sobre nós
                </Link>
                <Link href="/contacto" className="block text-lg font-medium text-gray-700 py-3 border-b border-gray-100">
                  Contactar
                </Link>
              </nav>

              <div className="space-y-4 pt-8 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 font-medium py-3"
                  onClick={() => {
                    setAbrir(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Entrar
                </Button>
                <Link href={"/registrar"}>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium py-3"
                  onClick={() => {
                   /*  setCadastro(true); */
                    setMobileMenuOpen(false);
                  }}
                >
                  Criar Conta
                </Button>
                </Link>
                
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Dialog */}
      <Dialog open={abrirDialog} onOpenChange={setAbrir}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Acesse sua conta</DialogTitle>
            <DialogDescription className="text-gray-600">
              Insira suas credenciais para entrar no sistema
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <LoginForm />
          </div>
        </DialogContent>
      </Dialog>

      {/* Cadastro Dialog */}
      <Dialog open={cadastro} onOpenChange={setCadastro}>
        <DialogContent className="sm:max-w-2xl max-w-[95vw] rounded-2xl p-6">
          <CadastroDialog onSuccess={() => setCadastro(false)} onCancel={() => setCadastro(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;