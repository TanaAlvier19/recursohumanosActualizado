'use client'
import React from 'react'
import Slider from 'react-slick'
import Image from 'next/image'
import Link from 'next/link'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from '@material-tailwind/react'
import { motion } from 'framer-motion'
import {fadeIn, staggerContainer} from "@/utils/motion"
import ModuleCard from './CardModule'
import CardContents from './CardsContents'

const sliderImages = [
  { src: "/hr.png", alt: "Recursos Humanos" },
  { src: "/training.svg", alt: "Treinamento corporativo" },
  { src: "/peer-to-peer1.png", alt: "Colaboração entre colegas" },
  { src: "/time.svg", alt: "Gestão de tempo" },
  { src: "/payroll.png", alt: "Folha de pagamento" },
  { src: "/hiring.png", alt: "Recrutamento e seleção" },
  { src: "/perfomance.png", alt: "Avaliação de desempenho" },
]

export default function Section2() {
  const sliderSettings = {
  autoplay: true,
  autoplaySpeed: 3000,
  dots: true,
  infinite: true,
  speed: 700,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: false,
  cssEase: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        centerMode: true,
        centerPadding: '40px'
      }
    }
  ]
}

  return (
    <section className="w-full  py-20">
      <motion.div 
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16"
      >
        <motion.h2 
          variants={fadeIn('up', 'spring', 0.2, 0.75)}
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6"
        ><span className="bg-gradient-to-r from-[#e9e5e2] to-[#f5f5f5] bg-clip-text text-transparent">
        Módulos RH que atendem às suas necessidades
        </span>
          
        </motion.h2>
        
        <motion.p 
          variants={fadeIn('up', 'spring', 0.4, 0.75)}
          className="text-xl text-gray-300 max-w-3xl mx-auto"
        >
          Soluções completas para transformar sua gestão de pessoas
        </motion.p>
      </motion.div>

      <motion.div
  variants={fadeIn('up', 'spring', 0.6, 0.75)}
  className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700/50 max-w-6xl mx-auto p-1 mb-20 overflow-hidden"
>
  <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
  
  <div className="max-w-6xl mx-auto px-4">
        <Slider {...sliderSettings}>
          {sliderImages.map((image, index) => (
            <div key={index} className="px-2 outline-none">
              <div className="bg-gray-800 rounded-lg p-4 h-64 flex flex-col items-center justify-center">
                <div className="relative w-full h-40">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="p-4"
                  />
                </div>
                <p className="mt-4 text-white text-center font-medium">
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
</motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CardContents.map((content, index) => (
            <motion.div
              key={index}
              variants={fadeIn('up', 'spring', index * 0.2, 0.75)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <ModuleCard
                title={content.title}
                description={content.description}
                imageSrc={content.imageSrc}
                link={`/modulos/${content.title.toLowerCase().replace(/\s+/g, '-')}`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        variants={fadeIn('up', 'spring', 0.8, 0.75)}
        className="max-w-5xl mx-auto px-4 mt-28"
      >
        <div className="bg-gradient-to-r from-blue-600/90 to-cyan-600/90 rounded-2xl p-0.5">
          <div className="bg-gray-900/90 rounded-[15px] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Um Serviço Que Atende Às Suas Necessidades
              </h3>
              <p className="text-xl text-cyan-200 mb-10">
                Somos a Solução Completa para RH
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/modulos" className="inline-block">
                  <Button
                    ripple
                    className="py-3 px-8 bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-300 transition-all duration-300"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Conheça todos os módulos
                  </Button>
                </Link>
                
                <Link href="/registrar" className="inline-block">
                  <Button
                    ripple
                    className="py-3 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-all duration-300"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Começar agora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
