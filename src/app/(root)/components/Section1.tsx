'use client'
import Image from "next/image"
import Link from 'next/link'
import { motion } from "framer-motion"

const Section1 = () => {
  return (
    <section className="relative overflow-hidden py-10 md:py-20">
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-center">
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10 text-white"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Simplifique sua gestão de RH com o nosso software.
            </h1>

            <p className="text-lg text-purple-100 mb-8 max-w-md">
              Gerencie dados da sua instituição de forma mais eficiente
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
              >
                <Link href="/registrar" className="block text-xl text-center whitespace-nowrap px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                  Registrar Agora
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
              >
                <Link href="/modulos" className="block text-xl text-center whitespace-nowrap px-6 py-3 bg-white text-purple-700 rounded-lg border border-purple-600 hover:bg-purple-50 transition-colors">
                  Ver Módulos
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center"
          >
            <Image 
              src='/hr.png' 
              alt="Gestão de RH" 
              width={500} 
              height={500}
              className="w-full max-w-md md:max-w-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Section1;