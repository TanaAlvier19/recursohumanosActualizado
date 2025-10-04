// components/Section2.tsx
'use client';
import React, { useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import Link from 'next/link';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from "@/utils/motion";
import { X, Check, Users, Clock, Target, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';
// Tipagem para o conteúdo dos módulos
interface ModuleContent {
  title: string;
  description: string;
  longDescription: string;
  imageSrc: string;
  features: string[];
  benefits: string[];
  metrics: { label: string; value: string }[];
  targetUsers: string[];
  implementationTime: string;
  color: string;
}
  
const sliderImages = [
  { src: "/hr.png", alt: "Recursos Humanos", title: "Gestão de RH" },
  { src: "/training.svg", alt: "Treinamento corporativo", title: "Treinamentos" },
  { src: "/peer-to-peer1.png", alt: "Colaboração entre colegas", title: "Colaboração" },
  { src: "/time.svg", alt: "Gestão de tempo", title: "Gestão de Tempo" },
  { src: "/payroll.png", alt: "Folha de pagamento", title: "Folha de Pagamento" },
  { src: "/hiring.png", alt: "Recrutamento e seleção", title: "Recrutamento" },
  { src: "/perfomance.png", alt: "Avaliação de desempenho", title: "Desempenho" },
];

const CardContents: ModuleContent[] = [
  {
    title: 'Gestão de Dados',
    description: 'Transforme dados em insights valiosos para decisões mais inteligentes.',
    longDescription: 'Nossa solução de Gestão de Dados oferece uma plataforma completa para coleta, análise e visualização de informações críticas do RH. Transforme dados brutos em insights acionáveis que impulsionam a tomada de decisão estratégica com conformidade total à LGPD.',
    imageSrc: "/peer-to-peer1.png",
    color: "blue",
    features: [
      'Dashboard analítico em tempo real com métricas personalizáveis',
      'Relatórios automáticos e personalizáveis por departamento',
      'Integração com múltiplas fontes de dados corporativas',
      'Previsão de tendências com algoritmos de IA avançados',
      'Conformidade LGPD automatizada com auditoria completa',
      'Visualizações interativas e exportação em múltiplos formatos'
    ],
    benefits: [
      'Redução de 60% no tempo gasto em análise de dados',
      'Aumento de 45% na precisão das decisões estratégicas',
      'Conformidade legal garantida com auditoria automática',
      'Insights preditivos para planejamento de longo prazo'
    ],
    metrics: [
      { label: 'Redução no tempo de análise', value: '60%' },
      { label: 'Aumento na precisão decisória', value: '45%' },
      { label: 'Conformidade LGPD', value: '100%' }
    ],
    targetUsers: ['CIOs', 'Gestores de RH', 'Analistas de Dados', 'Diretores Executivos'],
    implementationTime: '3 semanas'
  },
  {
    title: 'Gestão de Formações',
    description: 'Capacitação contínua dos colaboradores com alinhamento estratégico entre habilidades e metas organizacionais.',
    longDescription: 'Sistema completo de gestão de treinamentos e desenvolvimento profissional. Desde o planejamento até a avaliação de resultados, tudo em uma plataforma integrada que conecta habilidades individuais aos objetivos estratégicos da empresa.',
    imageSrc: "/training.svg",
    color: "green",
    features: [
      'Catálogo de cursos personalizável por cargo e departamento',
      'Gestão completa de certificações e validações',
      'Avaliação de eficácia com métricas de ROI em treinamento',
      'Planos de desenvolvimento individual automatizados',
      'Integração com principais plataformas LMS do mercado',
      'Gamificação e reconhecimento por conquistas'
    ],
    benefits: [
      'Aumento de 35% no engajamento dos colaboradores',
      'Redução de 50% nos custos com treinamento externo',
      'Melhoria de 40% nas competências técnicas e comportamentais',
      'Otimização da retenção de talentos e redução de turnover'
    ],
    metrics: [
      { label: 'Aumento no engajamento', value: '35%' },
      { label: 'Redução de custos', value: '50%' },
      { label: 'Melhoria em competências', value: '40%' }
    ],
    targetUsers: ['Gestores de RH', 'Coordenadores de T&D', 'Lideranças', 'Colaboradores'],
    implementationTime: '2 semanas'
  },
  {
    title: 'Gestão de Tempo',
    description: 'Aumente a produtividade com foco no que realmente importa e reduza o estresse com controle sobre prazos.',
    longDescription: 'Controle completo da jornada de trabalho com ferramentas inteligentes de gestão de tempo e produtividade. Monitore, analise e otimize o tempo da sua equipe com relatórios detalhados e alertas proativos.',
    imageSrc: "/time.svg",
    color: "purple",
    features: [
      'Controle de ponto digital com biometria e reconhecimento facial',
      'Banco de horas automático com cálculos precisos',
      'Gestão inteligente de escalas e turnos',
      'Relatórios detalhados de produtividade por colaborador',
      'Alertas automáticos para horas extras e conformidade',
      'Integração com ferramentas de produtividade'
    ],
    benefits: [
      'Otimização de 30% no aproveitamento do tempo útil',
      'Redução significativa em horas extras desnecessárias',
      'Maior transparência nos processos de controle',
      'Conformidade trabalhista automatizada e auditável'
    ],
    metrics: [
      { label: 'Otimização do tempo', value: '30%' },
      { label: 'Redução horas extras', value: '25%' },
      { label: 'Conformidade trabalhista', value: '100%' }
    ],
    targetUsers: ['Gestores de RH', 'Supervisores', 'Encarregados', 'Colaboradores'],
    implementationTime: '1 semana'
  },
  {
    title: 'Recrutamento',
    description: 'Processos seletivos otimizados com triagem inteligente e acompanhamento completo de candidatos.',
    longDescription: 'Plataforma completa de recrutamento e seleção que acelera a contratação dos melhores talentos. Desde a publicação das vagas até a integração do novo colaborador, tudo em um fluxo otimizado e inteligente.',
    imageSrc: "/hiring.png",
    color: "orange",
    features: [
      'Portal de vagas personalizável com brand da empresa',
      'Triagem automatizada com IA para análise de currículos',
      'Sistema inteligente de agendamento de entrevistas',
      'Avaliações técnicas integradas por competência',
      'Pipeline visual de candidatos com status em tempo real',
      'Comunicação automatizada durante todo o processo'
    ],
    benefits: [
      'Redução de 50% no tempo total de contratação',
      'Melhoria significativa na qualidade dos candidatos selecionados',
      'Processo mais transparente para candidatos e gestores',
      'Redução de até 40% nos custos operacionais de recrutamento'
    ],
    metrics: [
      { label: 'Redução tempo contratação', value: '50%' },
      { label: 'Melhoria qualidade candidatos', value: '40%' },
      { label: 'Redução custos operacionais', value: '40%' }
    ],
    targetUsers: ['Recrutadores', 'Gestores de RH', 'Lideranças', 'Gestores Contratantes'],
    implementationTime: '2 semanas'
  },
  {
    title: 'Folha de Pagamento',
    description: 'Cálculos automáticos, relatórios detalhados e conformidade fiscal garantida.',
    longDescription: 'Sistema automatizado de folha de pagamento que garante precisão matemática e conformidade com a legislação trabalhista. Elimine erros, reduza retrabalho e mantenha seus colaboradores sempre informados sobre seus pagamentos.',
    imageSrc: "/payroll.png",
    color: "cyan",
    features: [
      'Cálculos automáticos com validação em múltiplas etapas',
      'Integração nativa com sistemas contábeis e ERPs',
      'Geração automática de guias fiscais e obrigações',
      'Portal do colaborador com acesso a holerites e informações',
      'Relatórios gerenciais com análise de custos detalhada',
      'Backup automático e segurança de dados avançada'
    ],
    benefits: [
      'Eliminação completa de erros de cálculo manual',
      'Conformidade fiscal garantida com atualizações automáticas',
      'Redução de 70% no tempo de processamento mensal',
      'Transparência total para colaboradores com acesso 24/7'
    ],
    metrics: [
      { label: 'Eliminação de erros', value: '100%' },
      { label: 'Redução tempo processamento', value: '70%' },
      { label: 'Conformidade fiscal', value: '100%' }
    ],
    targetUsers: ['Departamento Pessoal', 'Contabilidade', 'Gestores de RH', 'Diretoria Financeira'],
    implementationTime: '4 semanas'
  },
  {
    title: 'Desempenho',
    description: 'Avaliações periódicas com métricas objetivas e planos de desenvolvimento individual.',
    longDescription: 'Ferramenta completa para gestão de desempenho que conecta objetivos individuais às metas organizacionais. Promova uma cultura de feedback contínuo e desenvolvimento profissional com avaliações estruturadas e insights acionáveis.',
    imageSrc: "/perfomance.png",
    color: "red",
    features: [
      'Sistema de avaliação 360 graus completo e personalizável',
      'Definição e acompanhamento de metas e OKRs individuais',
      'Feedback contínuo com notificações automáticas',
      'Planos de desenvolvimento individual com metas específicas',
      'Relatórios de performance com insights visuais avançados',
      'Integração com sistemas de remuneração variável'
    ],
    benefits: [
      'Aumento de 40% na produtividade individual e de equipes',
      'Maior engajamento e satisfação dos colaboradores',
      'Identificação precoce de talentos e potencial de liderança',
      'Redução significativa do turnover voluntário'
    ],
    metrics: [
      { label: 'Aumento produtividade', value: '40%' },
      { label: 'Aumento engajamento', value: '35%' },
      { label: 'Redução turnover', value: '30%' }
    ],
    targetUsers: ['Gestores', 'RH', 'Lideranças', 'Colaboradores', 'Diretoria'],
    implementationTime: '2 semanas'
  }
];

// Componente do Card
const ModuleCard = ({ title, description, imageSrc, onLearnMore }: {
  title: string;
  description: string;
  imageSrc: string;
  onLearnMore: () => void;
}) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
      <Image
        src={imageSrc}
        alt={title}
        fill
        style={{ objectFit: 'contain' }}
        className="p-4"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
    <Button 
      onClick={onLearnMore}
      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
    >
      Saber Mais
    </Button>
  </div>
);

// Componente do Modal
const ModuleModal = ({ isOpen, onClose, module }: {
  isOpen: boolean;
  onClose: () => void;
  module: ModuleContent | null;
}) => {
  if (!module) return null;

  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-indigo-500',
    orange: 'from-orange-500 to-red-500',
    cyan: 'from-cyan-500 to-teal-500',
    red: 'from-red-500 to-pink-500',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className={`relative p-8 bg-gradient-to-r ${colorClasses[module.color as keyof typeof colorClasses]} text-white overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20"></div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="relative z-10 flex items-start gap-6">
                <div className="flex-shrink-0 w-20 h-20 bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                  <Image
                    src={module.imageSrc}
                    alt={module.title}
                    width={56}
                    height={56}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">{module.title}</h2>
                  <p className="text-xl opacity-90">{module.description}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sobre a Solução</h3>
                <p className="text-gray-600 leading-relaxed">{module.longDescription}</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {module.metrics.map((metric, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[module.color as keyof typeof colorClasses]} bg-clip-text text-transparent mb-2`}>
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Features */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className={`text-${module.color}-500`} size={20} />
                    Principais Funcionalidades
                  </h4>
                  <ul className="space-y-3">
                    {module.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className={`text-${module.color}-500 flex-shrink-0 mt-0.5`} size={16} />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className={`text-${module.color}-500`} size={20} />
                    Benefícios Comprovados
                  </h4>
                  <ul className="space-y-3">
                    {module.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className={`text-${module.color}-500 flex-shrink-0 mt-0.5`} size={16} />
                        <span className="text-gray-600 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Implementation Info */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Users size={16} />
                    Usuários-Alvo
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {module.targetUsers.map((user, index) => (
                      <span key={index} className={`px-3 py-1 text-xs rounded-full bg-gradient-to-r ${colorClasses[module.color as keyof typeof colorClasses]} text-white`}>
                        {user}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Tempo de Implementação
                  </h5>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${colorClasses[module.color as keyof typeof colorClasses]} bg-clip-text text-transparent`}>
                    {module.implementationTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo" className="flex-1 sm:flex-none">
                  <Button className={`w-full bg-gradient-to-r ${colorClasses[module.color as keyof typeof colorClasses]} hover:opacity-90 transition-opacity`}>
                    Agendar Demonstração
                  </Button>
                </Link>
                <Link href="/contacto" className="flex-1 sm:flex-none">
                  <Button variant="outline" className="w-full">
                    Falar com Especialista
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function Section2() {
  const [selectedModule, setSelectedModule] = useState<ModuleContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [empresa, setempresa]=useState([])

useEffect(()=>{
    const empresa =async()=>{
      const res= await fetch("http://localhost:8000/empresa/",{
        credentials:"include"
      })
      const data= await res.json()
      setempresa(data.length)
    }
    
    empresa()
  },[])
  const handleLearnMore = (module: ModuleContent) => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedModule(null);
  };

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
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, centerMode: true, centerPadding: '40px' }
      }
    ]
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={fadeIn('up', 'spring', 0.2, 0.75)}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Soluções Completas
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Para Seu RH
            </span>
          </motion.h2>
          
          <motion.p 
            variants={fadeIn('up', 'spring', 0.4, 0.75)}
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Módulos integrados que transformam a gestão de pessoas em vantagem competitiva
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeIn('up', 'spring', 0.6, 0.75)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative mb-20"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl p-8 backdrop-blur-sm border border-blue-200/50">
            <Slider {...sliderSettings}>
              {sliderImages.map((image, index) => (
                <div key={index} className="px-3 outline-none">
                  <div className="bg-white rounded-xl p-6 h-64 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="relative w-full h-40 mb-4">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="p-4"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        priority={index < 4}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 text-center">
                      {image.title}
                    </h3>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {CardContents.map((content, index) => (
            <motion.div
              key={content.title}
              variants={fadeIn('up', 'spring', index * 0.1, 0.75)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <ModuleCard
                title={content.title}
                description={content.description}
                imageSrc={content.imageSrc}
                onLearnMore={() => handleLearnMore(content)}
              />
            </motion.div>
          ))}
        </div>

        <ModuleModal
          isOpen={isModalOpen}
          onClose={closeModal}
          module={selectedModule}
        />

        <motion.div 
          variants={fadeIn('up', 'spring', 0.8, 0.75)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Pronto para Transformar seu RH?
              </h3>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                Mais de {empresa} empresas já confiam em nossas soluções. 
                Agende uma demonstração gratuita e descubra como podemos ajudar seu negócio.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo" className="inline-block">
                  <Button
                    className="py-3 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                    size="lg"
                  >
                    Agendar Demonstração
                  </Button>
                </Link>
                
                <Link href="/contacto" className="inline-block">
                  <Button
                    variant="outline"
                    className="py-3 px-8 border-white text-gray-900 hover:bg-white/10 transition-all duration-300"
                    size="lg"
                  >
                    Falar com Especialista
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}