'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  FileText,
  Info,
  Banknote,
  CalendarCheck,
  UserPlus,
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  HelpCircle,
  X,
  Building,
  CreditCard,
  Users,
  TrendingUp,
  GraduationCap,
  Clock,
  Calendar,
  Home,
  Network
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

const NavbarRH = () => {
  const router = useRouter();
  const [chatSuporteAberto, setChatSuporteAberto] = useState(false);
  const [acoesRapidasAberto, setAcoesRapidasAberto] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [notificacoes, setNotificacoes] = useState([
    { id: 1, titulo: 'Novo funcionário adicionado', tempo: '10 min atrás', lida: false, tipo: 'funcionario' },
    { id: 2, titulo: 'Folha de pagamento processada', tempo: '1 hora atrás', lida: false, tipo: 'folha' },
    { id: 3, titulo: 'Novo candidato aplicou à vaga', tempo: '2 horas atrás', lida: false, tipo: 'recrutamento' },
    { id: 4, titulo: 'Departamento criado com sucesso', tempo: 'Ontem', lida: true, tipo: 'departamento' },
    { id: 5, titulo: 'Formação agendada para amanhã', tempo: '2 dias atrás', lida: true, tipo: 'formacao' },
  ]);
  const [naoLidas, setNaoLidas] = useState(3);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const acoesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setChatSuporteAberto(false);
      }
      if (acoesRef.current && !acoesRef.current.contains(event.target as Node)) {
        setAcoesRapidasAberto(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIconeNotificacao = (tipo: string) => {
    switch (tipo) {
      case 'funcionario': return <Users size={16} className="text-blue-600" />;
      case 'folha': return <CreditCard size={16} className="text-green-600" />;
      case 'recrutamento': return <UserPlus size={16} className="text-purple-600" />;
      case 'departamento': return <Building size={16} className="text-orange-600" />;
      case 'formacao': return <GraduationCap size={16} className="text-cyan-600" />;
      default: return <Bell size={16} className="text-gray-600" />;
    }
  };

  const marcarComoLida = (id: number) => {
    setNotificacoes(notificacoes.map(notif => 
      notif.id === id ? {...notif, lida: true} : notif
    ));
    setNaoLidas(notificacoes.filter(n => !n.lida && n.id !== id).length);
  };
  
  const marcarTodasLidas = () => {
    setNotificacoes(notificacoes.map(notif => ({...notif, lida: true})));
    setNaoLidas(0);
  };
  
  const enviarMensagem = useCallback(() => {
    if (mensagem.trim()) {
      // Simular envio de mensagem
      setTimeout(() => {
        // Simular resposta automática
      }, 500);
      setMensagem('');
    }
  }, [mensagem]);

  const fazerLogout = () => {
    router.push('/logincomsenha');
  };

  // Navegação rápida para os módulos principais
  const modulosPrincipais = [
    { icon: <Home size={20} />, label: 'Dashboard', href: '/admin', color: 'text-blue-600' },
    { icon: <Users size={20} />, label: 'Funcionários', href: '/list/funcionarios', color: 'text-green-600' },
    { icon: <Building size={20} />, label: 'Departamentos', href: '/list/departamentos', color: 'text-orange-600' },
    { icon: <CreditCard size={20} />, label: 'Folha de Pagamento', href: '/list/folha-pagamento', color: 'text-purple-600' },
    { icon: <UserPlus size={20} />, label: 'Recrutamento', href: '/list/recrutamento', color: 'text-pink-600' },
    { icon: <GraduationCap size={20} />, label: 'Formações', href: '/list/formacoes', color: 'text-cyan-600' },
  ];

  return (
    <header className="w-full bg-white shadow-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
        
          <div className="flex items-center">
            <div className="sm:bg-gradient-to-r sm:from-cyan-500 sm:to-blue-600 sm:p-2 rounded-lg mr-3">
              <div className="sm:bg-gray-900 sm:p-2 sm:rounded-md">
                <div className="sm:bg-gray-800 sm:w-2 h-2 rounded-sm" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                RH<span className="font-light">System</span>
              </h3>
              <p className="text-xs text-gray-500 hidden sm:block">Professional Suite</p>
            </div>
          </div>
          
          {/* Barra de Pesquisa */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-1/3 max-w-md">
            <Search size={18} className="text-gray-500 mr-2" />
            <Input 
              placeholder="Pesquisar funcionários, departamentos, documentos..." 
              className="bg-transparent border-0 focus-visible:ring-0 p-0 h-auto"
            />
          </div>

          {/* Menu de Navegação Rápida */}
          <nav className="hidden lg:flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:bg-gray-100">
                  <FileText size={18} className="mr-1.5" />
                  Navegação Rápida
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>Módulos do Sistema</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {modulosPrincipais.map((modulo) => (
                  <DropdownMenuItem key={modulo.href} asChild>
                    <Link href={modulo.href} className="cursor-pointer">
                      <div className={`mr-2 ${modulo.color}`}>
                        {modulo.icon}
                      </div>
                      <span>{modulo.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/relatorios" className="cursor-pointer">
                    <Network size={18} className="mr-2 text-gray-600" />
                    <span>Relatórios e Analytics</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="ghost" 
              className="text-gray-700 hover:bg-gray-100"
              onClick={() => setChatSuporteAberto(true)}
            >
              <MessageCircle size={18} className="mr-1.5" />
              Suporte
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:bg-gray-100"
              onClick={() => setAcoesRapidasAberto(true)}
            >
              <TrendingUp size={18} className="mr-1.5" />
              Ações Rápidas
            </Button>
          </nav>

          {/* Menu do usuário */}
          <div className="flex items-center space-x-3">
            {/* Botão de notificações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full p-2">
                  <Bell size={20} className="text-gray-600" />
                  {naoLidas > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {naoLidas}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notificações do Sistema</span>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-xs h-6 p-0"
                    onClick={marcarTodasLidas}
                  >
                    Marcar todas como lidas
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-60 overflow-y-auto">
                  {notificacoes.map(notificacao => (
                    <DropdownMenuItem 
                      key={notificacao.id}
                      className={`py-3 ${!notificacao.lida ? 'bg-blue-50 border-l-2 border-blue-500' : ''}`}
                      onSelect={() => marcarComoLida(notificacao.id)}
                    >
                      <div className="flex items-start w-full">
                        <div className="bg-gray-100 p-1.5 rounded-full mr-3">
                          {getIconeNotificacao(notificacao.tipo)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notificacao.titulo}</p>
                          <p className="text-xs text-gray-500 mt-1">{notificacao.tempo}</p>
                        </div>
                        {!notificacao.lida && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1.5 flex-shrink-0" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/notificacoes" className="cursor-pointer text-center justify-center text-blue-600">
                    Ver todas as notificações
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Botão de perfil */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-0">
                  <Avatar className="w-9 h-9 border-2 border-gray-200">
                    <AvatarImage src="/placeholder-user.jpg" alt="Usuário" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium">Admin User</p>
                    <p className="text-xs text-gray-600">admin@rhsystem.com</p>
                    <Badge variant="outline" className="w-fit text-xs mt-1">
                      Administrador
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="cursor-pointer w-full">
                      <User size={16} className="mr-2 text-gray-600" />
                      <span>Meu Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/definicoes" className="cursor-pointer w-full">
                      <Settings size={16} className="mr-2 text-gray-600" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/ajuda" className="cursor-pointer w-full">
                      <HelpCircle size={16} className="mr-2 text-gray-600" />
                      <span>Ajuda e Suporte</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500 hover:bg-red-50 focus:bg-red-50"
                  onClick={fazerLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  <span>Sair do Sistema</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Barra de pesquisa mobile */}
        <div className="md:hidden mt-3">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-500 mr-2" />
            <Input 
              placeholder="Pesquisar..." 
              className="bg-transparent border-0 focus-visible:ring-0 p-0 h-auto"
            />
          </div>
        </div>
      </div>

      {/* Chat de Suporte */}
      <AnimatePresence>
        {chatSuporteAberto && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50 w-80 h-[500px] max-h-[80vh] bg-white border rounded-xl shadow-xl flex flex-col"
          >
            <div className="border-b px-4 py-3 flex justify-between items-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-xl">
              <div className="flex items-center">
                <MessageCircle size={18} className="mr-2" />
                <span className="font-semibold">Suporte RH System</span>
                <Badge variant="secondary" className="ml-2 bg-white text-blue-600 text-xs">
                  Online
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setChatSuporteAberto(false)}
              >
                <X size={16} />
              </Button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="flex flex-col space-y-3">
                <div className="flex justify-start">
                  <div className="bg-gray-200 px-4 py-2 rounded-xl max-w-[75%]">
                    <p className="text-sm">Olá! Sou a Ana, do suporte do RH System. Como posso ajudar você hoje?</p>
                  </div>
                </div>
                
                {mensagem && (
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-xl max-w-[75%]">
                      <p className="text-sm">{mensagem}</p>
                    </div>
                  </div>
                )}
                
                {/* Mensagens padrão */}
                <div className="text-center text-xs text-gray-500 mt-4">
                  <p>Digite sua dúvida ou escolha uma opção:</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    Folha de Pagamento
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    Recrutamento
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    Departamentos
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    Formações
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="border-t p-3">
              <div className="flex gap-2">
                <Input 
                  placeholder="Digite sua mensagem..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
                />
                <Button 
                  size="sm" 
                  onClick={enviarMensagem}
                  disabled={!mensagem.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Enviar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ações Rápidas */}
      <AnimatePresence>
        {acoesRapidasAberto && (
          <motion.div
            ref={acoesRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Card className="w-80 shadow-xl border border-gray-200">
              <CardHeader className="flex flex-row justify-between items-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
                <CardTitle className="text-white text-lg">Ações Rápidas</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20"
                  onClick={() => setAcoesRapidasAberto(false)}
                >
                  <X size={16} />
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 pt-6">
                <Link href="/list/funcionarios?novo=true" passHref>
                  <Button variant="outline" className="h-20 flex-col gap-2 hover:border-blue-300 hover:bg-blue-50">
                    <UserPlus size={24} className="text-blue-600" />
                    <span className="font-medium text-xs text-center">Novo Funcionário</span>
                  </Button>
                </Link>
                
                <Link href="/list/folha-pagamento?processar=true" passHref>
                  <Button variant="outline" className="h-20 flex-col gap-2 hover:border-green-300 hover:bg-green-50">
                    <CreditCard size={24} className="text-green-600" />
                    <span className="font-medium text-xs text-center">Processar Folha</span>
                  </Button>
                </Link>
                
                <Link href="/list/recrutamento?novaVaga=true" passHref>
                  <Button variant="outline" className="h-20 flex-col gap-2 hover:border-purple-300 hover:bg-purple-50">
                    <UserPlus size={24} className="text-purple-600" />
                    <span className="font-medium text-xs text-center">Nova Vaga</span>
                  </Button>
                </Link>
                
                <Link href="/list/departamentos?novo=true" passHref>
                  <Button variant="outline" className="h-20 flex-col gap-2 hover:border-orange-300 hover:bg-orange-50">
                    <Building size={24} className="text-orange-600" />
                    <span className="font-medium text-xs text-center">Novo Departamento</span>
                  </Button>
                </Link>

                <Link href="/list/formacoes?nova=true" passHref>
                  <Button variant="outline" className="h-20 flex-col gap-2 hover:border-cyan-300 hover:bg-cyan-50">
                    <GraduationCap size={24} className="text-cyan-600" />
                    <span className="font-medium text-xs text-center">Nova Formação</span>
                  </Button>
                </Link>

                <Link href="/relatorios" passHref>
                  <Button variant="outline" className="h-20 flex-col gap-2 hover:border-gray-300 hover:bg-gray-50">
                    <FileText size={24} className="text-gray-600" />
                    <span className="font-medium text-xs text-center">Gerar Relatório</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavbarRH;