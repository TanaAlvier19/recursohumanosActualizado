'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const ModuleCard = ({ 
  title, 
  description,
  imageSrc, 
  link
}: { 
  title: string, 
  description: string, 
  imageSrc: string, 
  link: string 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-sm bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-56 bg-gradient-to-r from-purple-50 to-indigo-50 overflow-hidden">
        <motion.div
          animate={{ 
            scale: isHovered ? 1.05 : 1,
            rotate: isHovered ? 2 : 0
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full w-full flex items-center justify-center"
        >
          <Image 
            src={imageSrc} 
            alt={title} 
            width={220} 
            height={220}
            className="object-contain transition-all duration-500"
          />
        </motion.div>
        
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-purple-700">Novo</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        
        <div className="h-32 overflow-y-auto mb-4">
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
        
        <Link href={link} passHref>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Saiba mais
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}

export default ModuleCard