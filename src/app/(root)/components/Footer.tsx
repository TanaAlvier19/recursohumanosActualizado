'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from "@/utils/motion";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, ArrowRight, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={staggerContainer(0.1, 0.2)}
      className="w-full bg-slate-900 border-t border-slate-800 pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div variants={fadeIn('up', 'spring', 0.2, 0.75)} className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-xl mr-4">
                <div className="bg-slate-900 p-2 rounded-md">
                  <div className="bg-slate-800 w-8 h-8 rounded" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  AVD<span className="font-light">Soluções</span>
                </h3>
                <p className="text-slate-400 text-sm">Tecnologia para Gestão de Pessoas</p>
              </div>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Transformamos a gestão de RH com tecnologia inovadora, 
              oferecendo soluções completas para empresas que buscam excelência.
            </p>
            <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
              Baixar Catálogo <ArrowRight size={16} className="ml-2" />
            </Button>
          </motion.div>

          <motion.div variants={fadeIn('up', 'spring', 0.3, 0.75)}>
            <h4 className="text-lg font-semibold text-white mb-6">Soluções</h4>
            <ul className="space-y-3">
              {[
                'Gestão de Recrutamento',
                'Controle de Ponto Eletrônico',
                'Treinamento & Desenvolvimento',
                'Folha de Pagamento',
                'Benefícios Flexíveis',
                'Avaliação de Desempenho',
        
              ].map((item, index) => (
                <li key={index}>
                  <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeIn('up', 'spring', 0.4, 0.75)}>
            <h4 className="text-lg font-semibold text-white mb-6">Empresa</h4>
            <ul className="space-y-3">
              {[
                { name: 'Sobre Nós', href: '/sobre' },
                { name: 'Nosso Site Oficial', href: '' },
                { name: 'Blog & Artigos', href: '/blog' },
                
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeIn('up', 'spring', 0.5, 0.75)}>
            <h4 className="text-lg font-semibold text-white mb-6">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail size={18} className="text-cyan-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 text-sm">ononotecnologies@gmail.com.</p>
                  <p className="text-slate-500 text-xs">Atendimento comercial</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone size={18} className="text-cyan-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 text-sm">+244 923 456 789</p>
                  <p className="text-slate-500 text-xs">Segunda a Sexta, 8h-15h</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={18} className="text-cyan-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 text-sm">
                    Eduado Mondlane, Maianga<br />
                    Luanda, Angola
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Globe size={18} className="text-cyan-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <a  className='text-slate-400 text-sm' href="https://www.onono-technologies.com">Nosso Site Oficial</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <motion.p 
            variants={fadeIn('up', 'spring', 0.6, 0.75)}
            className="text-slate-500 text-sm mb-4 md:mb-0"
          >
            © {currentYear} AVD Soluções | Onono Produto. Todos os direitos reservados.
          </motion.p>
          <motion.div 
            variants={fadeIn('up', 'spring', 0.7, 0.75)}
            className="flex space-x-6"
          >
            {['Termos de Uso', 'Privacidade', 'Cookies'].map((item, index) => (
              <Link 
                key={index}
                href="#" 
                className="text-slate-500 hover:text-slate-400 text-sm transition-colors"
              >
                {item}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;