'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useContext
} from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  Check, 
  X, 
  Download, 
  Trash2, 
  FileText, 
  Search, 
  Filter,
  Calendar,
  AlertCircle,
  MoreVertical,
  ArrowUpDown
} from "lucide-react";
import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { format, parseISO, differenceInDays, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import Swal from "sweetalert2";

export type Leave = {
  id: number;
  motivo: string;
  inicio: string;
  fim: string;
  justificativo: string;
  status: "pendente" | "aprovado" | "rejeitado";
  admin_comentario: string | null;
  por:string
  created_at: string;
  funcionario_nome?: string;
  funcionario_cargo?: string;
};

const STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "pendente", label: "Pendentes" },
  { value: "aprovado", label: "Aprovados" },
  { value: "rejeitado", label: "Rejeitados" }
];

const ITEMS_PER_PAGE = 8;

export default function AdminLeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Leave; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const { toast } = useToast();


  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const calculateDays = (start: string, end: string): number => {
    return differenceInDays(parseISO(end), parseISO(start)) + 1;
  };

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/dispensa/todas/",
        { credentials:"include" }
      );
      
      if (!response.ok) throw new Error("Falha ao carregar dispensas");
      
      const data = await response.json();
      setLeaves(data || []);
      console.log(data)
    } catch (err) {
      setError("Não foi possível carregar os pedidos de dispensa");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
      fetchLeaves();
  }, [fetchLeaves]);

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.funcionario_nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          leave.motivo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || leave.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedLeaves = [...filteredLeaves].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key;
    if (a[key]! < b[key]!) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[key]! > b[key]!) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedLeaves.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLeaves = sortedLeaves.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const exportPDF = useCallback(() => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Relatório de Pedidos de Dispensa", 15, 15);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`, 15, 22);
    
    autoTable(doc, {
      head: [["Funcionário", "Cargo", "Motivo", "Período", "Dias", "Status", "Feedback"]],
      body: sortedLeaves.map(leave => [
        leave.funcionario_nome || "-",
        leave.funcionario_cargo || "-",
        leave.motivo,
        `${formatDate(leave.inicio)} - ${formatDate(leave.fim)}`,
        calculateDays(leave.inicio, leave.fim).toString(),
        leave.status,
        leave.admin_comentario || "-"
      ]),
      startY: 30,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    doc.save(`relatorio-dispensas-${format(new Date(), 'yyyyMMdd')}.pdf`);
  }, [sortedLeaves]);

  const confirmAction = async (message: string) => {
    return Swal.fire({
      title: "Tem certeza?",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    });
  };

  const deleteLeave = async (id: number) => {
    const confirmation = await confirmAction("Esta ação não pode ser desfeita!");
    if (!confirmation.isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8000/deletar-dispensa/${id}/`,
        { method: "DELETE",
          credentials:"include"
         }
      );

      if (!response.ok) throw new Error("Falha ao deletar dispensa");

      setLeaves(prev => prev.filter(leave => leave.id !== id));
      toast({ title: "Sucesso!", description: "Dispensa removida com sucesso", variant: "default" });
    } catch (error) {
      toast({ 
        title: "Erro", 
        description: "Não foi possível remover a dispensa", 
        variant: "destructive" 
      });
    }
  };

  const updateLeaveStatus = async (id: number, status: "aprovado" | "rejeitado") => {
    const { value: comment } = await Swal.fire({
      title: status === "aprovado" ? "Comentário de aprovação" : "Comentário de reprovação",
      input: "textarea",
      inputPlaceholder: "Digite seu comentário aqui...",
      showCancelButton: true,
      inputValidator: (value) => !value && "Por favor, digite um comentário!"
    });

    if (!comment) return;

    try {
      const response = await fetch(
        `http://localhost:8000/actualizar/${id}/`,
        {
          method: "PUT",
          credentials:"include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, admin_comentario: comment })
        }
      );

      if (!response.ok) throw new Error();

      setLeaves(prev => 
        prev.map(leave => 
          leave.id === id 
            ? { ...leave, status, admin_comentario: comment } 
            : leave
        )
      );

      toast({
        title: "Atualizado!",
        description: `Status alterado para ${status}`,
        variant: "default"
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive"
      });
    }
  };

  // Ordenar colunas
  const requestSort = (key: keyof Leave) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderStatusBadge = (status: Leave["status"]) => {
    const variants = {
      pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      aprovado: "bg-green-100 text-green-800 hover:bg-green-200",
      rejeitado: "bg-red-100 text-red-800 hover:bg-red-200"
    };
    
    const labels = {
      pendente: "Pendente",
      aprovado: "Aprovado",
      rejeitado: "Rejeitado"
    };

    return (
      <Badge className={`${variants[status]} capitalize`}>
        {labels[status]}
      </Badge>
    );
  };

  const openDetails = (leave: Leave) => {
    setSelectedLeave(leave);
    setIsDetailOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-48" />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(7)].map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(7)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Erro ao carregar dados</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={fetchLeaves}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Gestão de Dispensas</h1>
          <p className="text-gray-600">
            {filteredLeaves.length} {filteredLeaves.length === 1 ? 'registro encontrado' : 'registros encontrados'}
          </p>
        </div>
        
        <Button onClick={exportPDF} className="gap-2">
          <FileText size={16} />
          Exportar Relatório
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar funcionário ou motivo..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <span>Status</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>
                <button 
                  className="flex items-center gap-1 font-medium"
                  onClick={() => requestSort('funcionario_nome')}
                >
                  Funcionário
                  <ArrowUpDown size={14} />
                </button>
              </TableHead>
              {/* <TableHead>Cargo</TableHead> */}
              <TableHead>Motivo</TableHead>
              <TableHead>
                <button 
                  className="flex items-center gap-1 font-medium"
                  onClick={() => requestSort('inicio')}
                >
                  Período
                  <ArrowUpDown size={14} />
                </button>
              </TableHead>
              <TableHead>Dias</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum pedido de dispensa encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginatedLeaves.map(leave => (
                <TableRow key={leave.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {leave.funcionario_nome || "—"}
                  </TableCell>
                  {/* <TableCell>{leave.funcionario_cargo || "—"}</TableCell> */}
                  <TableCell className="max-w-[200px] truncate">
                    {leave.motivo}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{formatDate(leave.inicio)}</span>
                      <span className="text-xs text-gray-500">até {formatDate(leave.fim)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {calculateDays(leave.inicio, leave.fim)} dias
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {renderStatusBadge(leave.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              onClick={() => openDetails(leave)}
                            >
                              <MoreVertical size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver detalhes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      {leave.status === "pendente" && (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  className="bg-green-600 hover:bg-green-300"
                                  
                                  size="icon" 
                                  // variant="success"
                                  onClick={() => updateLeaveStatus(leave.id, "aprovado")}
                                >
                                  <Check size={16} className="bg-green-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Aprovar dispensa</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="icon" 
                                  variant="destructive"
                                  onClick={() => updateLeaveStatus(leave.id, "rejeitado")}
                                >
                                  <X size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Rejeitar dispensa</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      )}
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => deleteLeave(leave.id)}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir dispensa</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  // disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = Math.max(1, Math.min(
                  currentPage - 2,
                  totalPages - 4
                )) + i;
                
                return page <= totalPages ? (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ) : null;
              })}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  // disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      
      {isDetailOpen && selectedLeave && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">Detalhes da Dispensa</h2>
                  <p className="text-gray-600">ID: #{selectedLeave.id}</p>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => setIsDetailOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Funcionário</h3>
                    <p className="font-medium">{selectedLeave.funcionario_nome || "—"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Cargo</h3>
                    <p>{selectedLeave.funcionario_cargo || "—"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Solicitado em</h3>
                    <p>{format(parseISO(selectedLeave.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Período</h3>
                    <p>
                      {formatDate(selectedLeave.inicio)} - {formatDate(selectedLeave.fim)}
                      <span className="ml-2 text-sm text-gray-500">
                        ({calculateDays(selectedLeave.inicio, selectedLeave.fim)} dias)
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-1">
                      {renderStatusBadge(selectedLeave.status)}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Motivo</h3>
                    <p className="mt-1">{selectedLeave.motivo}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Justificativa</h3>
                {selectedLeave.justificativo ? (
                  <a
                    href={selectedLeave.justificativo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:underline"
                  >
                    <Download size={16} className="mr-1" />
                    Baixar documento
                  </a>
                ) : (
                  <p className="text-gray-500">Nenhum documento anexado</p>
                )}
                {selectedLeave.status !== "pendente"  &&(
                <h3 className="text-sm font-medium text-gray-500 mb-2">{selectedLeave.status} Por:{selectedLeave.por}</h3>
                // <p className="mt-1">{selectedLeave.motivo}</p>
                
                )} 
              </div>
              
              {selectedLeave.admin_comentario && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Comentário do Administrador</h3>
                  <p>{selectedLeave.admin_comentario}</p>
                </div>
              )}
              
              <div className="mt-6 flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDetailOpen(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}