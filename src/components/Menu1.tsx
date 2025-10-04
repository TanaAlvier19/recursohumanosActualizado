'use client';
import { usePathname } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  Home, 
  Users, 
  Calendar, 
  Clock, 
  GraduationCap, 
  TrendingUp,
  Settings, 
  LogOut,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Briefcase,
  Building,
  FileText,
  UserPlus,
  Network,
  User,
  Target
} from "lucide-react";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <Home className="w-5 h-5" />,
        label: "Dashboard",
        href: "/funcionario",
      },
      {
        icon: <User className="w-5 h-5" />,
        label: "Meu Perfil",
        href: "/funcionario/perfil",
      },
      {
        icon: <Clock className="w-5 h-5" />,
        label: "Meu Ponto",
        href: "/funcionario/ponto",
      },
      {
        icon: <Calendar className="w-5 h-5" />,
        label: "Minhas Férias",
        href: "/funcionario/ferias",
      },
      {
        icon: <CreditCard className="w-5 h-5" />,
        label: "Meus Contracheques",
        href: "/funcionario/contracheques",
      },
      {
        icon: <GraduationCap className="w-5 h-5" />,
        label: "Minhas Formações",
        href: "/funcionario/formacoes",
      },
      {
        icon: <TrendingUp className="w-5 h-5" />,
        label: "Minha Performance",
        href: "/funcionario/performance",
      },
      {
        icon: <Target className="w-5 h-5" />,
        label: "Metas e Objetivos",
        href: "/funcionario/metas",
      },
    ],
  },
  {
    title: "RECURSOS",
    items: [
      {
        icon: <Users className="w-5 h-5" />,
        label: "Colegas de Trabalho",
        href: "/funcionario/equipe",
      },
      {
        icon: <Building className="w-5 h-5" />,
        label: "Departamentos",
        href: "/funcionario/departamentos",
      },
      {
        icon: <FileText className="w-5 h-5" />,
        label: "Documentos",
        href: "/funcionario/documentos",
      },
      {
        icon: <Network className="w-5 h-5" />,
        label: "Benefícios",
        href: "/funcionario/beneficios",
      },
    ],
  },
  {
    title: "SUPORTE",
    items: [
      {
        icon: <LifeBuoy className="w-5 h-5" />,
        label: "Suporte RH",
        href: "/funcionario/suporte",
      },
      {
        icon: <Settings className="w-5 h-5" />,
        label: "Configurações",
        href: "/funcionario/configuracoes",
      },
      {
        icon: <LogOut className="w-5 h-5" />,
        label: "Sair",
        href: "/logout",
      },
    ],
  },
];

interface MenuProps {
  isCollapsed: boolean;
  onCollapseToggle: () => void;
  onItemClick?: () => void;
}

const MenuFuncionario = ({ isCollapsed, onCollapseToggle, onItemClick }: MenuProps) => {
  const pathname = usePathname();
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  return (
    <div className={`
      relative h-screen bg-gradient-to-b from-slate-900 to-slate-800 
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-20' : 'w-64 xl:w-72'}
      border-r border-slate-700 flex flex-col
    `}>
      <button
        onClick={onCollapseToggle}
        className="absolute -right-3 top-6 bg-slate-800 hover:bg-slate-700 
                 rounded-full p-1 border border-slate-600 transition-all duration-200 z-10"
      >
        {isCollapsed ? 
          <ChevronRight className="w-4 h-4 text-slate-300" /> : 
          <ChevronLeft className="w-4 h-4 text-slate-300" />
        }
      </button>

      <div className="p-6 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
            <div className="bg-gray-900 p-2 rounded-md">
              <div className="bg-gray-800 w-2 h-2 rounded-sm" />
            </div>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-white font-bold text-lg">AVD Soluções</h1>
              <p className="text-slate-400 text-xs">Portal do Funcionário</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        <div className="space-y-6 px-4">
          {menuItems.map((group) => (
            <div key={group.title}>
              {/* Group Title */}
              {!isCollapsed && (
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-2 block mb-2">
                  {group.title}
                </span>
              )}
              
              {/* Menu Items */}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      href={item.href}
                      key={item.label}
                      onClick={onItemClick}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative
                        ${isActive 
                          ? 'bg-green-500/20 text-green-400 border-r-2 border-green-500 shadow-lg shadow-green-500/10' 
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-md'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      onMouseEnter={() => setActiveGroup(group.title)}
                      onMouseLeave={() => setActiveGroup(null)}
                    >
                      <div className={`
                        transition-all duration-200 relative
                        ${isActive 
                          ? 'text-green-400 transform scale-110' 
                          : 'text-slate-400 group-hover:text-white group-hover:scale-105'
                        }
                      `}>
                        {item.icon}
                        {isActive && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      
                      {!isCollapsed && (
                        <span className="font-medium text-sm transition-transform duration-200">
                          {item.label}
                        </span>
                      )}
                      
                      {isCollapsed && (
                        <div className={`
                          absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm 
                          rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200
                          pointer-events-none whitespace-nowrap z-50 border border-slate-700
                          ${activeGroup === group.title ? 'translate-x-0' : 'translate-x-2'}
                        `}>
                          {item.label}
                          <div className="absolute right-full top-1/2 transform -translate-y-1/2">
                            <div className="w-2 h-2 bg-slate-900 rotate-45"></div>
                          </div>
                        </div>
                      )}

                      {isCollapsed && isActive && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isCollapsed && (
        <div className="border-t border-slate-700 flex-shrink-0">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full 
                            flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">FU</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">Nome do Funcionário</p>
                <p className="text-slate-400 text-xs truncate">Cargo do Funcionário</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="border-t border-slate-700 flex-shrink-0">
          <div className="p-4 flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full 
                          flex items-center justify-center shadow-lg group relative">
              <span className="text-white font-bold text-xs">FU</span>
              
              <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm 
                            rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200
                            pointer-events-none whitespace-nowrap z-50 border border-slate-700">
                <div className="font-medium">Nome do Funcionário</div>
                <div className="text-slate-400 text-xs">Cargo do Funcionário</div>
                <div className="absolute right-full top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-slate-900 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuFuncionario;