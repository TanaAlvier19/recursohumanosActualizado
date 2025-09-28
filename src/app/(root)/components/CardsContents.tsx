'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ModuleCardProps {
  title: string;
  description: string;
  imageSrc: string;
  onLearnMore: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, imageSrc, onLearnMore }) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-cyan-50">
        <Image
          src={imageSrc}
          alt={title}
          fill
          style={{ objectFit: 'contain' }}
          className="p-6 group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>
        
        <Button
          onClick={onLearnMore}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-2.5 rounded-lg transition-all duration-300 group/btn"
        >
          <span className="flex items-center justify-center">
            Ver Detalhes
            <svg className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Button>
      </div>
    </motion.div>
  );
};

export default ModuleCard;