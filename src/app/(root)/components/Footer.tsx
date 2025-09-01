'use client'
import React from 'react'
import { motion } from 'framer-motion'
// import {fadeIn, staggerContainer} from "@/utils/motion"
import {fadeIn, staggerContainer} from "@/utils/motion"
import Link from 'next/link'
import Image from 'next/image'

const FooterWithLogo = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <motion.footer
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={staggerContainer(0.1, 0.2)}
      className="w-full bg-gradient-to-r from-[#3C0AB3] to-[#9247D3] border-t border-[#8747C2] pt-16 pb-8">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <motion.div variants={fadeIn('up', 'spring', 0.2, 0.75)}>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg mr-3">
                <div className="bg-gray-900 p-2 rounded-md">
                  <div className="bg-gray-800 w-8 h-8 rounded-sm" />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                AVD<span className="font-light">Soluções</span>
              </h3>
            </div>
            <p className="text-white mb-6">
              Transformando a gestão de pessoas com tecnologia inovadora e soluções personalizadas para o seu negócio.
            </p>
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((item) => (
                <motion.div 
                  key={item}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-gray-800/50 hover:bg-cyan-500/10 border border-gray-700 rounded-lg p-2 cursor-pointer transition-all"
                >
                  <div className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-sm" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Links Rápidos */}
          <motion.div variants={fadeIn('up', 'spring', 0.3, 0.75)}>
            <h4 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-800">Links Rápidos</h4>
            <ul className="space-y-3 text-white">
              {[
                { name: 'Sobre Nós', href: '#' },
                { name: 'Nossos Serviços', href: '#' },
                { name: 'Módulos', href: '#' },
                { name: 'Planos', href: '#' },
                { name: 'Blog', href: '#' },
                { name: 'Contato', href: '#' },
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-white hover:text-cyan-400 transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-3"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Módulos Populares */}
          <motion.div variants={fadeIn('up', 'spring', 0.4, 0.75)}>
            <h4 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-800">Módulos Populares</h4>
            <ul className="space-y-3">
              {[
                'Gestão de Recrutamento',
                'Controle de Ponto',
                'Treinamentos',
                'Folha de Pagamento',
                'Benefícios',
                'Desempenho'
              ].map((module, index) => (
                <li key={index}>
                  <Link href="#" className="text-white hover:text-cyan-400 transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                    {module}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          
          <motion.div variants={fadeIn('up', 'spring', 0.5, 0.75)}>
            <h4 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-800">Entre em Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-cyan-500/10 p-2 rounded-lg mr-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-sm" />
                </div>
                <span className="text-white">onono-technologies@gmail.com</span>
              </li>
              <li className="flex items-start">
                <div className="bg-cyan-500/10 p-2 rounded-lg mr-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-sm" />
                </div>
                <span className="text-white">+244 99999-8888</span>
              </li>
              <li className="flex items-start">
                <div className="bg-cyan-500/10 p-2 rounded-lg mr-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-sm" />
                </div>
                <span className="text-white">
                  Rua Eduardo Mondlane<br />
                  Luanda, Maianga
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <motion.p 
            variants={fadeIn('up', 'spring', 0.6, 0.75)}
            className="text-white text-sm mb-4 md:mb-0"
          >
            © {currentYear} Onono. Todos os direitos reservados.
          </motion.p>
          <motion.div 
            variants={fadeIn('up', 'spring', 0.7, 0.75)}
            className="flex space-x-6"
          >
            {['Termos de Uso', 'Política de Privacidade', 'Cookies'].map((item, index) => (
              <Link 
                key={index}
                href="#" 
                className="text-white hover:text-cyan-400 text-sm transition-colors"
              >
                {item}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.footer>
  )
}

export default FooterWithLogo