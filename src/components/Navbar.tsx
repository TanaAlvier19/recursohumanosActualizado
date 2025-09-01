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
  X
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
    { id: 1, titulo: 'Novo funcionário adicionado', tempo: '10 min atrás', lida: false },
    { id: 2, titulo: 'Folha de pagamento processada', tempo: '1 hora atrás', lida: false },
    { id: 3, titulo: 'Férias aprovadas', tempo: 'Ontem', lida: true },
  ]);
  const [naoLidas, setNaoLidas] = useState(2);
  
  // Referências para fechar menus ao clicar fora
  const chatRef = useRef<HTMLDivElement>(null);
  const acoesRef = useRef<HTMLDivElement>(null);
  
  // Fechar menus ao clicar fora
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
  
  // Marcar notificações como lidas
  const marcarComoLida = (id: number) => {
    setNotificacoes(notificacoes.map(notif => 
      notif.id === id ? {...notif, lida: true} : notif
    ));
    setNaoLidas(notificacoes.filter(n => !n.lida && n.id !== id).length);
  };
  
  // Marcar todas como lidas
  const marcarTodasLidas = () => {
    setNotificacoes(notificacoes.map(notif => ({...notif, lida: true})));
    setNaoLidas(0);
  };
  
  // Enviar mensagem no chat
  const enviarMensagem = useCallback(() => {
    if (mensagem.trim()) {
      // Simular envio de mensagem
      setTimeout(() => {
        // Simular resposta automática
      }, 500);
      setMensagem('');
    }
  }, [mensagem]);

  // Logout
  const fazerLogout = () => {
    router.push('/logincomsenha');
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo e Nome */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">RH</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ONONO RH
            </h1>
          </div>
          
          {/* Barra de pesquisa */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-1/3 max-w-md">
            <Search size={18} className="text-gray-500 mr-2" />
            <Input 
              placeholder="Pesquisar funcionários, documentos..." 
              className="bg-transparent border-0 focus-visible:ring-0 p-0 h-auto"
            />
          </div>

          {/* Menu de navegação */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100">
              <Info size={18} className="mr-1.5" />
              Informações
            </Button>
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
              <FileText size={18} className="mr-1.5" />
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
                  <span>Notificações</span>
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
                      className={`py-3 ${!notificacao.lida ? 'bg-blue-50' : ''}`}
                      onSelect={() => marcarComoLida(notificacao.id)}
                    >
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-1.5 rounded-full mr-3">
                          <Bell size={16} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{notificacao.titulo}</p>
                          <p className="text-xs text-gray-500 mt-1">{notificacao.tempo}</p>
                        </div>
                        {!notificacao.lida && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1.5" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Botão de perfil */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-0">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src="/placeholder-user.jpg" alt="Usuário" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      AD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium">Admin User</p>
                    <p className="text-xs text-gray-600">admin@onono.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <User size={16} className="mr-2 text-gray-600" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings size={16} className="mr-2 text-gray-600" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <HelpCircle size={16} className="mr-2 text-gray-600" />
                    <span>Ajuda</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500 hover:bg-red-50 focus:bg-red-50"
                  onClick={fazerLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  <span>Sair</span>
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
            <div className="border-b px-4 py-3 flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
              <div className="flex items-center">
                <MessageCircle size={18} className="mr-2" />
                <span className="font-semibold">Suporte RH</span>
                <Badge variant="secondary" className="ml-2 bg-white text-blue-600">
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
                    <p className="text-sm">Olá! Sou a Ana, do suporte do ONONO RH. Como posso ajudar você hoje?</p>
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
                    Como adicionar funcionário?
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    Processar folha de pagamento
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    Solicitar férias
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    Relatórios
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
                >
                  Enviar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <CardHeader className="flex flex-row justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-white">Ações Rápidas</CardTitle>
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
                <Link href="/list/funciona?abrirDialog=true" passHref>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <UserPlus size={24} className="text-blue-600" />
                    <span className="font-medium">Novo Funcionário</span>
                  </Button>
                </Link>
                
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <FileText size={24} className="text-green-600" />
                  <span className="font-medium">Relatório Mensal</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <CalendarCheck size={24} className="text-orange-600" />
                  <span className="font-medium">Solicitar Férias</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <Banknote size={24} className="text-purple-600" />
                  <span className="font-medium">Processar Folha</span>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavbarRH;