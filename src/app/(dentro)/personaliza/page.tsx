'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from "sweetalert2"
import { buscarDados } from '@/lib/api';
import { HomeIcon, PlusCircle, Trash2, HelpCircle, Settings, Edit, List } from "lucide-react";

type FieldDefinition = {
  id?: string;
  nome?: string;
  tipo?: string;
  obrigatorio?: boolean;
  opcoes?: string[];
  em_uso?: boolean;
  quantidade_uso?: number;
};

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CriarCamposPersonalizados() {
  const router = useRouter();
  const [apresentar, setApresentar] = useState(false);
  const [empresaId, setEmpresaId] = useState('');
  const [campos, setCampos] = useState<FieldDefinition[]>([]);
  const [camposExistentes, setCamposExistentes] = useState<FieldDefinition[]>([]);
  const [abaAtiva, setAbaAtiva] = useState("criar");
  
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [carregandoExistentes, setCarregandoExistentes] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dadosUsuario = await buscarDados();
        if (!dadosUsuario) {
          Swal.fire({
            title: "Autenticação Necessária",
            text: "Por favor, faça login para acessar esta funcionalidade",
            icon: "warning",
            confirmButtonText: "Ir para Login"
          }).then(() => router.push("/"));
          return;
        }
        
        setEmpresaId(dadosUsuario.empresa.id);
        setApresentar(true);
        await carregarCamposExistentes();
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Swal.fire("Erro", "Não foi possível carregar os dados da empresa", "error");
      }
    };
    
    carregarDados();
  }, [router]);

  const carregarCamposExistentes = async () => {
    try {
      setCarregandoExistentes(true);
      const res = await fetch('https://avdserver.up.railway.app/campos/empresa/com-uso/', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setCamposExistentes(data);
      } else {
        throw new Error('Falha ao carregar campos existentes');
      }
    } catch (error) {
      console.error('Erro ao carregar campos existentes:', error);
      Swal.fire('Erro', 'Não foi possível carregar os campos existentes', 'error');
    } finally {
      setCarregandoExistentes(false);
    }
  };

  const adicionarCampo = () => {
    setCampos([
      ...campos,
      {
        nome: '',
        tipo: 'text',
        obrigatorio: false
      }
    ]);
  };

  const removerCampo = (index: number) => {
    const novosCampos = [...campos];
    novosCampos.splice(index, 1);
    setCampos(novosCampos);
  };

  const validarCampos = () => {
    if (campos.length === 0) {
      setErro('Adicione pelo menos um campo personalizado');
      return false;
    }

    for (const campo of campos) {
      if (!campo.nome?.trim()) {
        setErro('Todos os campos devem ter um nome');
        return false;
      }

      if (campo.nome.length > 64) {
        setErro(`O nome do campo "${campo.nome}" não pode exceder 64 caracteres`);
        return false;
      }

      if (campo.tipo === 'select' && (!campo.opcoes || campo.opcoes.length === 0)) {
        setErro(`O campo "${campo.nome}" do tipo seleção precisa ter opções definidas`);
        return false;
      }
    }

    setErro(null);
    return true;
  };

  const salvarCampos = async () => {
    try {
      const camposParaEnviar = campos
        .filter(campo => campo.nome && campo.tipo)
        .map(campo => ({
          nome: campo.nome,
          tipo: campo.tipo,
          obrigatorio: campo.obrigatorio || false,
          opcoes: campo.tipo === 'select' ? campo.opcoes : undefined,
          empresa: empresaId
        }));
      
      const res = await fetch('https://avdserver.up.railway.app/campos/criar/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(camposParaEnviar),
        credentials: "include"
      });

      if (!res.ok) {
        const erroData = await res.json();
        throw new Error(erroData.campos || 'Erro ao salvar campos');
      }
      
      return await res.json();
    } catch (error) {
      console.error("Erro ao salvar campos:", error);
      throw error;
    }
  };

  const excluirCampoExistente = async (campoId: string, campoNome: string) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja excluir o campo "${campoNome}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      background: '#1e293b',
      color: 'white',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`https://avdserver.up.railway.app/campos/${campoId}/`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (res.ok) {
          Swal.fire({
            title: 'Excluído!',
            text: 'Campo excluído com sucesso.',
            icon: 'success',
            background: '#1e293b',
            color: 'white',
            confirmButtonColor: '#0ea5e9',
          });
          await carregarCamposExistentes();
        } else {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Falha ao excluir campo');
        }
      } catch (error: any) {
        Swal.fire({
          title: 'Erro!',
          text: error.message || 'Não foi possível excluir o campo',
          icon: 'error',
          background: '#1e293b',
          color: 'white',
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarCampos()) return;
    
    setEnviando(true);
    
    try {
      await salvarCampos();
      
      setSucesso(true);
      setCampos([]);
      await carregarCamposExistentes();
      
      Swal.fire({
        title: "Sucesso!",
        text: "Campos personalizados criados com sucesso",
        icon: "success",
        confirmButtonText: "Continuar"
      });
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro desconhecido ao salvar');
      Swal.fire("Erro", "Ocorreu um erro ao tentar salvar os campos", "error");
    } finally {
      setEnviando(false);
    }
  };

  const adicionarOpcao = (campoIndex: number, novaOpcao: string) => {
    if (!novaOpcao.trim()) return;
    
    const novosCampos = [...campos];
    if (!novosCampos[campoIndex].opcoes) {
      novosCampos[campoIndex].opcoes = [];
    }
    
    novosCampos[campoIndex].opcoes?.push(novaOpcao.trim());
    setCampos(novosCampos);
  };

  const removerOpcao = (campoIndex: number, opcaoIndex: number) => {
    const novosCampos = [...campos];
    novosCampos[campoIndex].opcoes?.splice(opcaoIndex, 1);
    setCampos(novosCampos);
  };

  const getTipoLabel = (tipo: string) => {
    const tipos: { [key: string]: string } = {
      text: 'Texto',
      number: 'Número',
      date: 'Data',
      select: 'Seleção',
      email: 'Email',
      file: 'Arquivo'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      {!apresentar ? (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center justify-center gap-3">
            <motion.div
              className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-cyan-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-300">Carregando informações da empresa...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <Settings className="h-8 w-8 text-cyan-400" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Campos Personalizados
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-slate-300 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Crie e gerencie campos personalizados para coletar informações específicas da sua empresa
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link 
                href="/admin" 
                className="inline-flex items-center mt-6 text-cyan-400 hover:text-cyan-300 transition-colors group"
              >
                <HomeIcon className="mr-2 transition-transform group-hover:-translate-x-1" />
                Voltar para o Painel Principal
              </Link>
            </motion.div>
          </div>

          <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 p-1 rounded-lg mb-8">
              <TabsTrigger 
                value="criar" 
                className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              >
                <PlusCircle className="h-4 w-4" />
                Criar Novos Campos
              </TabsTrigger>
              <TabsTrigger 
                value="gerenciar" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
              >
                <List className="h-4 w-4" />
                Gerenciar Campos Existentes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="criar">
              <motion.div 
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-6 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {sucesso ? (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-green-500/20 rounded-full">
                        <svg className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-green-400 mb-3">
                      Campos Criados com Sucesso!
                    </h3>
                    <p className="text-green-300/80 mb-6 text-lg">
                      Seus campos personalizados foram configurados e estão prontos para uso.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button 
                        onClick={() => setSucesso(false)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
                      >
                        Criar Mais Campos
                      </Button>
                      <Button 
                        onClick={() => router.push('/admin')}
                        variant="outline"
                        className="border-green-500 text-green-400 hover:bg-green-500/10"
                      >
                        Ir para o Painel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {erro && (
                      <motion.div 
                        className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className="flex items-start">
                          <svg className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h3 className="text-sm font-medium text-red-400">
                              Atenção
                            </h3>
                            <div className="mt-1 text-sm text-red-300/80">
                              <p>{erro}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="mb-8 bg-cyan-500/10 border-l-4 border-cyan-500 p-4 rounded-lg">
                      <div className="flex items-start">
                        <HelpCircle className="h-5 w-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium text-cyan-400 mb-2">Como funcionam os campos personalizados?</h3>
                          <ul className="text-sm text-cyan-300/80 list-disc pl-5 space-y-1">
                            <li>Adicione campos específicos para coletar informações relevantes</li>
                            <li>Para campos de seleção, defina as opções disponíveis</li>
                            <li>Marque como obrigatório quando a informação for essencial</li>
                            <li>Os campos ficarão disponíveis no cadastro de funcionários</li>
                            <li><strong>O campo ID é automático e não precisa ser criado</strong></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h2 className="text-2xl font-semibold text-white">Criar Novos Campos</h2>
                            <p className="text-slate-400 mt-1">
                              Adicione campos personalizados para suas necessidades
                            </p>
                          </div>
                          <Button 
                            type="button"
                            onClick={adicionarCampo}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white flex items-center shadow-lg"
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Adicionar Campo
                          </Button>
                        </div>

                        {campos.length === 0 ? (
                          <motion.div 
                            className="text-center py-12 border-2 border-dashed border-slate-600/50 rounded-xl bg-slate-800/30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Settings className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-300 mb-2">
                              Nenhum campo personalizado criado
                            </h3>
                            <p className="text-slate-400 mb-6">
                              Comece adicionando seu primeiro campo personalizado
                            </p>
                            <Button 
                              type="button"
                              onClick={adicionarCampo}
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Criar Primeiro Campo
                            </Button>
                          </motion.div>
                        ) : (
                          <div className="space-y-4">
                            {campos.map((campo, index) => (
                              <motion.div 
                                key={index}
                                className="p-6 rounded-xl border-2 bg-slate-800/30 border-slate-600/50 hover:border-slate-500/50 transition-colors"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                              >
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <label className="block text-sm font-medium text-slate-300 mb-3">
                                        Nome do Campo *
                                      </label>
                                      <Input
                                        value={campo.nome}
                                        onChange={(e) => {
                                          const novosCampos = [...campos];
                                          novosCampos[index].nome = e.target.value;
                                          setCampos(novosCampos);
                                        }}
                                        placeholder="Ex: Nível Hierárquico, Especialização, Departamento"
                                        className="w-full bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-slate-300 mb-3">
                                        Tipo de Campo *
                                      </label>
                                      <Select 
                                        value={campo.tipo} 
                                        onValueChange={(value) => {
                                          const novosCampos = [...campos];
                                          novosCampos[index].tipo = value;
                                          
                                          if (value !== 'select') {
                                            novosCampos[index].opcoes = undefined;
                                          }
                                          
                                          setCampos(novosCampos);
                                        }}
                                      >
                                        <SelectTrigger className="w-full bg-slate-700/50 border-slate-600 text-white focus:border-cyan-500">
                                          <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-600">
                                          <SelectItem value="text" className="text-white hover:bg-slate-700">Texto</SelectItem>
                                          <SelectItem value="number" className="text-white hover:bg-slate-700">Número</SelectItem>
                                          <SelectItem value="date" className="text-white hover:bg-slate-700">Data</SelectItem>
                                          <SelectItem value="select" className="text-white hover:bg-slate-700">Seleção</SelectItem>
                                          <SelectItem value="email" className="text-white hover:bg-slate-700">Email</SelectItem>
                                          <SelectItem value="file" className="text-white hover:bg-slate-700">Arquivo</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  {campo.tipo === 'select' && (
                                    <div className="space-y-4">
                                      <label className="block text-sm font-medium text-slate-300">
                                        Opções de Seleção *
                                      </label>
                                      <div className="space-y-3">
                                        {campo.opcoes?.map((opcao, opcaoIndex) => (
                                          <div key={opcaoIndex} className="flex items-center justify-between bg-slate-700/30 p-3 rounded-lg border border-slate-600">
                                            <span className="text-slate-200">{opcao}</span>
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              type="button"
                                              onClick={() => removerOpcao(index, opcaoIndex)}
                                              className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        ))}

                                        <div className="flex gap-2">
                                          <Input
                                            id={`nova-opcao-${index}`}
                                            placeholder="Digite uma nova opção"
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const input = e.target as HTMLInputElement;
                                                adicionarOpcao(index, input.value);
                                                input.value = '';
                                              }
                                            }}
                                            className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                                          />
                                          <Button 
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                              const input = document.getElementById(`nova-opcao-${index}`) as HTMLInputElement;
                                              if (input) {
                                                adicionarOpcao(index, input.value);
                                                input.value = '';
                                              }
                                            }}
                                            className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                                          >
                                            Adicionar
                                          </Button>
                                        </div>
                                      </div>
                                      <p className="text-xs text-slate-400 mt-2">
                                        Pressione Enter ou clique em Adicionar para incluir uma opção
                                      </p>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between pt-4 border-t border-slate-600/50">
                                    <div className="flex items-center space-x-3">
                                      <Checkbox 
                                        id={`obrigatorio-${index}`}
                                        checked={campo.obrigatorio} 
                                        onCheckedChange={(checked) => {
                                          const novosCampos = [...campos];
                                          novosCampos[index].obrigatorio = checked as boolean;
                                          setCampos(novosCampos);
                                        }}
                                        className="border-slate-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                                      />
                                      <label htmlFor={`obrigatorio-${index}`} className="text-sm font-medium text-slate-300">
                                        Campo obrigatório
                                      </label>
                                    </div>

                                    <Button 
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => removerCampo(index)}
                                      className="flex items-center bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Remover Campo
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>

                      {campos.length > 0 && (
                        <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setCampos([]);
                              setErro(null);
                            }}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            Limpar Campos
                          </Button>
                          <Button 
                            type="submit"
                            disabled={enviando}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 text-lg shadow-lg"
                          >
                            {enviando ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Salvando Campos...
                              </>
                            ) : (
                              `Criar ${campos.length} Campo${campos.length > 1 ? 's' : ''}`
                            )}
                          </Button>
                        </div>
                      )}
                    </form>
                  </>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="gerenciar">
              <motion.div 
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-6 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Campos Existentes</h2>
                    <p className="text-slate-400 mt-1">
                      Gerencie os campos personalizados da sua empresa
                    </p>
                  </div>
                  <Button 
                    onClick={carregarCamposExistentes}
                    variant="outline"
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                  </Button>
                </div>

                {carregandoExistentes ? (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <motion.div
                        className="border-gray-300 h-12 w-12 animate-spin rounded-full border-4 border-t-cyan-500"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <p className="text-gray-300">Carregando campos...</p>
                    </div>
                  </div>
                ) : camposExistentes.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-600/50 rounded-xl bg-slate-800/30">
                    <List className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-300 mb-2">
                      Nenhum campo personalizado encontrado
                    </h3>
                    <p className="text-slate-400 mb-6">
                      Crie seu primeiro campo personalizado na aba Criar Campos
                    </p>
                    <Button 
                      onClick={() => setAbaAtiva("criar")}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Criar Primeiro Campo
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {camposExistentes.map((campo) => (
                      <Card key={campo.id} className="bg-slate-800/30 border-slate-600/50">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">{campo.nome}</h3>
                                <Badge 
                                  variant="secondary" 
                                  className={
                                    campo.obrigatorio 
                                      ? "bg-red-500/20 text-red-400 border-red-500/30" 
                                      : "bg-green-500/20 text-green-400 border-green-500/30"
                                  }
                                >
                                  {campo.obrigatorio ? 'Obrigatório' : 'Opcional'}
                                </Badge>
                                <Badge 
                                  variant="secondary"
                                  className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                                >
                                  {getTipoLabel(campo.tipo || 'text')}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span>Tipo: {getTipoLabel(campo.tipo || 'text')}</span>
                                <span>•</span>
                                <span className={
                                  campo.em_uso 
                                    ? "text-green-400" 
                                    : "text-slate-500"
                                }>
                                  {campo.em_uso 
                                    ? `Em uso (${campo.quantidade_uso || 0} funcionários)` 
                                    : 'Não utilizado'
                                  }
                                </span>
                              </div>

                              {campo.tipo === 'select' && campo.opcoes && campo.opcoes.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm text-slate-400 mb-2">Opções:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {campo.opcoes.map((opcao, index) => (
                                      <Badge 
                                        key={index} 
                                        variant="outline"
                                        className="bg-slate-700/50 text-slate-300 border-slate-600"
                                      >
                                        {opcao}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              {campo.em_uso ? (
                                <Badge 
                                  variant="secondary"
                                  className="bg-green-500/20 text-green-400 border-green-500/30"
                                >
                                  Em Uso
                                </Badge>
                              ) : (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => excluirCampoExistente(campo.id!, campo.nome!)}
                                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-slate-400">
                      <p className="font-medium text-cyan-400 mb-1">Sobre a exclusão de campos</p>
                      <p>Campos que estão sendo utilizados por funcionários não podem ser excluídos para manter a integridade dos dados.</p>
                      <p className="mt-1">Para excluir um campo em uso, primeiro remova todas as referências a ele nos funcionários.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

// Adicione este ícone se não estiver importado
function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  )
}