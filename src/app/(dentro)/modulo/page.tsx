'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Users, 
  Shield, 
  BarChart3, 
  Calendar,
  Mail,
  Phone,
  Send,
  Building
} from 'lucide-react'

// Dados dos módulos disponíveis
const availableModules = [
  {
    id: 'gestao-dados',
    title: 'Gestão de Dados',
    description: 'Sistema completo para gestão e análise de dados de colaboradores',
    fullDescription: 'Centralize todas as informações da sua equipe em uma plataforma segura e intuitiva. Relatórios automáticos, analytics avançados e conformidade total com LGPD.',
    imageSrc: '/peer-to-peer1.png',
    features: [
      'Banco de dados centralizado',
      'Relatórios automatizados',
      'Analytics em tempo real',
      'Conformidade LGPD',
      'Backup automático'
    ],
    price: 'Sob consulta',
    implementationTime: '72 horas',
    category: 'Core RH'
  },
  {
    id: 'gestao-formacoes',
    title: 'Gestão de Formações',
    description: 'Plataforma completa para treinamento e desenvolvimento',
    fullDescription: 'Gerencie programas de capacitação, acompanhe progresso e mensure ROI do treinamento. Integração com plataformas de E-learning.',
    imageSrc: '/training.svg',
    features: [
      'Gestão de programas de treinamento',
      'Acompanhamento de progresso',
      'Certificados automáticos',
      'Integração E-learning',
      'Relatórios de eficácia'
    ],
    price: 'Sob consulta',
    implementationTime: '48 horas',
    category: 'Desenvolvimento'
  },
  {
    id: 'gestao-tempo',
    title: 'Gestão de Tempo',
    description: 'Controle de ponto e gestão de jornada de trabalho',
    fullDescription: 'Sistema completo para controle de ponto eletrônico, banco de horas, escalas e compliance trabalhista.',
    imageSrc: '/time.svg',
    features: [
      'Controle de ponto eletrônico',
      'Gestão de escalas',
      'Banco de horas',
      'Compliance trabalhista',
      'Relatórios de produtividade'
    ],
    price: 'Sob consulta',
    implementationTime: '24 horas',
    category: 'Operacional'
  },
  {
    id: 'recrutamento',
    title: 'Recrutamento e Seleção',
    description: 'Sistema completo para processos seletivos',
    fullDescription: 'Automatize todo o processo de recrutamento, desde a publicação de vagas até a contratação.',
    imageSrc: '/hiring.png',
    features: [
      'Publicação de vagas',
      'Triagem automática',
      'Agendamento de entrevistas',
      'Onboarding digital',
      'Base de talentos'
    ],
    price: 'Sob consulta',
    implementationTime: '96 horas',
    category: 'Aquisição'
  },
  {
    id: 'folha-pagamento',
    title: 'Folha de Pagamento',
    description: 'Sistema automatizado de folha de pagamento',
    fullDescription: 'Cálculos automáticos, impostos, benefícios e conformidade fiscal completa.',
    imageSrc: '/payroll.png',
    features: [
      'Cálculos automáticos',
      'Impostos e encargos',
      'Benefícios flexíveis',
      'Conformidade fiscal',
      'Recibos digitais'
    ],
    price: 'Sob consulta',
    implementationTime: '120 horas',
    category: 'Financeiro'
  },
  {
    id: 'desempenho',
    title: 'Avaliação de Desempenho',
    description: 'Sistema de avaliação e feedback contínuo',
    fullDescription: 'Avaliações 360°, metas e objetivos, planos de desenvolvimento individual.',
    imageSrc: '/perfomance.png',
    features: [
      'Avaliação 360°',
      'Metas e objetivos',
      'Feedback contínuo',
      'Planos de desenvolvimento',
      'Relatórios de performance'
    ],
    price: 'Sob consulta',
    implementationTime: '72 horas',
    category: 'Desenvolvimento'
  }
]

const ModuleSelectionPage = () => {
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    email: '',
    phone: '',
    employees: '',
    needs: ''
  })
  const [currentStep, setCurrentStep] = useState(1)

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const handleSubmit = () => {
    // Aqui você integraria com seu backend
    console.log('Módulos selecionados:', selectedModules)
    console.log('Informações da empresa:', companyInfo)
    setCurrentStep(3)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar ao site
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <span className="text-sm text-slate-600">Seleção</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <span className="text-sm text-slate-600">Contato</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${currentStep >= 3 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <span className="text-sm text-slate-600">Confirmação</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  Selecione os Módulos para Sua Empresa
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Escolha os módulos que melhor atendem às necessidades do seu RH. 
                  Nossa equipe entrará em contato para uma proposta personalizada.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableModules.map((module, index) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`h-full cursor-pointer transition-all duration-200 ${
                        selectedModules.includes(module.id)
                          ? 'ring-2 ring-blue-500 shadow-lg'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => toggleModule(module.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-4">
                          <CardTitle className="text-xl">{module.title}</CardTitle>
                          <Checkbox 
                            checked={selectedModules.includes(module.id)}
                            onChange={() => toggleModule(module.id)}
                          />
                        </div>
                        <CardDescription>{module.description}</CardDescription>
                        <Badge variant="secondary" className="mt-2 w-fit">
                          {module.category}
                        </Badge>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-slate-600">
                            <Clock className="w-4 h-4 mr-2" />
                            Implementação: {module.implementationTime}
                          </div>
                          
                          <div className="space-y-2">
                            {module.features.slice(0, 3).map((feature, i) => (
                              <div key={i} className="flex items-center text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center pt-8">
                <Button 
                  size="lg"
                  onClick={() => setCurrentStep(2)}
                  disabled={selectedModules.length === 0}
                  className="px-8 py-3"
                >
                  Continuar ({selectedModules.length} selecionados)
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Informações da Empresa
                </h2>
                <p className="text-slate-600">
                  Preencha os dados para nossa equipe entrar em contato com uma proposta personalizada
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nome da Empresa *
                      </label>
                      <input
                        type="text"
                        value={companyInfo.name}
                        onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Sua empresa"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          value={companyInfo.email}
                          onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          value={companyInfo.phone}
                          onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="(+244) XXX XXX XXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Número de Colaboradores *
                      </label>
                      <select
                        value={companyInfo.employees}
                        onChange={(e) => setCompanyInfo({...companyInfo, employees: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione...</option>
                        <option value="1-10">1-10 colaboradores</option>
                        <option value="11-50">11-50 colaboradores</option>
                        <option value="51-200">51-200 colaboradores</option>
                        <option value="201-500">201-500 colaboradores</option>
                        <option value="500+">Mais de 500 colaboradores</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Necessidades Específicas
                      </label>
                      <textarea
                        value={companyInfo.needs}
                        onChange={(e) => setCompanyInfo({...companyInfo, needs: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Descreva suas necessidades específicas..."
                      />
                    </div>

                    
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 mb-3">Módulos Selecionados:</h3>
                      <div className="space-y-2">
                        {selectedModules.map(moduleId => {
                          const mod = availableModules.find(m => m.id === moduleId)
                          return mod ? (
                            <div key={moduleId} className="flex justify-between items-center text-sm">
                              <span>{mod.title}</span>
                              <Badge variant="outline">{mod.category}</Badge>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1"
                      >
                        Voltar
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!companyInfo.name || !companyInfo.email || !companyInfo.phone || !companyInfo.employees}
                        className="flex-1"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Solicitação
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Solicitação Enviada com Sucesso!
                </h2>
                
                <p className="text-slate-600 mb-6">
                  Nossa equipe entrará em contato dentro de 24 horas para discutir 
                  os módulos selecionados e preparar uma proposta personalizada.
                </p>

                <div className="bg-slate-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-slate-900 mb-3">Resumo da Solicitação:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Empresa:</span>
                      <span className="font-medium">{companyInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Módulos selecionados:</span>
                      <span className="font-medium">{selectedModules.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Previsão de contato:</span>
                      <span className="font-medium">24 horas</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/">
                    <Button variant="outline">
                      Voltar ao Início
                    </Button>
                  </Link>
                  <Button>
                    <Mail className="w-4 h-4 mr-2" />
                    Falar com Consultor
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ModuleSelectionPage