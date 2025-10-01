'use client'

import { useState, useEffect, useCallback, useContext } from 'react'
import { AuthContext } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Swal from "sweetalert2"
import { Button } from '@/components/ui/button'
import { MetricCard } from "@/components/metrcCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {Users, DollarSign,Building} from "lucide-react"
import {motion} from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton";

interface Departamento {
  id: number
  nome: string
  responsavel: string
  orcamento: number
  funcionarios: number
  status: boolean
  data_criacao: string
}

export default function DepartamentoManager() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalorcamento, setTotalorcamento]=useState('')
  const [departamentoAtivo, setDepartamentoAtivo]=useState('')
  const [funcionarios, setfuncionarios]=useState('')
  const [showForm, setShowForm] = useState(false)
  const [currentDept, setCurrentDept] = useState<Departamento | null>(null)
  const router = useRouter()
  const pageSize = 10
  useEffect(() => {
    buscardepartamentos()
  }, [])

  const handleEdit = (id: number) => {
    const dept = departamentos.find(d => d.id === id)
    if (dept) {
      setCurrentDept(dept)
      setShowForm(true)
    }
  }
  // const pesquisar =async(pesquisa:string)=>{
  //   try {
  //       pesquisa=searchTerm
  //       const data ={
  //         nome:pesquisa
  //       }
  //       await fetch('http://localhost:8000/departamentos/pesquisar/', 
  //         { 
  //           credentials:"include",
  //           method: 'POST',
  //           body: JSON.stringify(data),
  //           headers: {
  //             "Content-Type": "application/json"
  //           }
  //         })
  //       buscardepartamentos()
  //     }catch{

  //     }
  // }

  const handleDelete = async (id: number) => {
    if (await Swal.fire('Deletar Departamento','Tem certeza que deseja excluir este departamento?','question')) {
      const data={
        id:id
      }
      try {
        await fetch('http://localhost:8000/departamentos/', 
          { 
            credentials:"include",
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json"
            }
          })
        buscardepartamentos()
      } catch (error) {
        console.error('Erro ao excluir:', error)
      }
    }
  }
const buscardepartamentos=async()=>{
    try{
      const res= await fetch("http://localhost:8000/departamentos/",{
        credentials:"include"
      })
      if (res.ok){
      const data=await res.json()
        setDepartamentos(data.dados)
        setLoading(false)
        setfuncionarios(data.funcionarios)
        setTotalorcamento(data.orcamento)
        setDepartamentoAtivo(data.status)
      }
    }catch{

    }
  }
  const handleSave = async (data: Omit<Departamento, 'id'>) => {
    try {
      const url = currentDept 
        ? `/api/departamentos/${currentDept.id}`
        : 'http://localhost:8000/departamentos/'
        
      const method = currentDept ? 'PUT' : 'POST'
      
      await fetch(url, {
        credentials:"include",
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      buscardepartamentos()
      setShowForm(false)
      setCurrentDept(null)
    } catch (error) {
      console.error('Erro ao salvar:', error)
    }
  }

  const chartData = departamentos.map(dept => ({
    name: dept.nome,
    funcionarios: dept.funcionarios,
    orcamento: dept.orcamento / 1000, 
  }))

  return (
    <div 
    
     className="container mx-auto p-4 space-y-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Gestão de Departamentos</h1>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-1/2">
      
        </div>
        <button
          onClick={() => {
            setCurrentDept(null)
            setShowForm(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
        >
          <span>+</span>
          <span>Novo Departamento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <MetricCard 
            title="Departamentos Ativos" 
            value={departamentoAtivo} 
            icon={Building}
            
          />
          
          <MetricCard 
            title="Total de Funcionários" 
            value={funcionarios} 
            icon={Users}
            color="bg-amber-500"
          />
          
          <MetricCard 
            title="Orçamento Total" 
            value={totalorcamento}
            icon={DollarSign}
            color="bg-emerald-500"
          />
        
      </div>
        {showForm && (
        <DepartamentoForm
          // departamento={currentDept}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setCurrentDept(null)
          }}
        />
      )}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Distribuição por Departamento</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Funcionários', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="funcionarios" name="Funcionários" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Orçamento (mil KZ)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value} mil KZ`, 'Orçamento']} />
                <Legend />
                <Bar dataKey="orcamento" name="Orçamento (mil KZ)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Carregando departamentos...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader>Nome</TableHeader>
                  <TableHeader>Responsável</TableHeader>
                  <TableHeader>Orçamento</TableHeader>
                  <TableHeader>Funcionários</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departamentos.length > 0 ? (
                  departamentos.map((dept) => (
                    <tr key={dept.id} className="hover:bg-gray-50">
                      <TableCell>{dept.nome}</TableCell>
                      <TableCell>{dept.responsavel}</TableCell>
                      <TableCell>KZ {dept.orcamento.toLocaleString('pt-AO')}</TableCell>
                      <TableCell>{dept.funcionarios}</TableCell>
                      <TableCell>
                        <StatusBadge status={dept.status ? 'ativo' : 'inativo'} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <ActionButton 
                            onClick={() => handleEdit(dept.id)}
                            color="blue"
                            icon="✏️"
                          />
                          <ActionButton 
                            onClick={() => handleDelete(dept.id)}
                            color="red"
                            icon="🗑️"
                          />
                        </div>
                      </TableCell>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      Nenhum departamento encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 flex items-center gap-1"
            >
              <span>←</span>
              <span>Anterior</span>
            </button>
            <span className="text-sm text-gray-700">
              Página {currentPage} • {departamentos.length} itens
            </span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={departamentos.length < pageSize}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 flex items-center gap-1"
            >
              <span>Próxima</span>
              <span>→</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ title, value, icon, trend }: { title: string; value: string | number; icon: string; trend: string }) {
  const isPositive = trend.startsWith('+')
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      <div className={`mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {trend} vs último mês
      </div>
    </div>
  )
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  )
}

function TableCell({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {children}
    </td>
  )
}

function StatusBadge({ status }: { status: 'ativo' | 'inativo' }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${
      status === 'ativo' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {status === 'ativo' ? 'Ativo' : 'Inativo'}
    </span>
  )
}

function ActionButton({ onClick, color, icon }: { onClick: () => void; color: 'blue' | 'red'; icon: string }) {
  const colorClasses = {
    blue: 'text-blue-600 hover:text-blue-900',
    red: 'text-red-600 hover:text-red-900'
  }
  
  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color]} transition-colors`}
      title={color === 'blue' ? 'Editar' : 'Excluir'}
    >
      {icon}
    </button>
  )
}

function DepartamentoForm({
  departamento,
  onSave,
  onCancel
}: {
  departamento?: Departamento
  onSave: (data: Omit<Departamento, 'id'>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Omit<Departamento, 'id'>>(
    departamento || {
      nome: '',
      responsavel: '',
      orcamento: 0,
      funcionarios: 0,
      status: false,
      data_criacao: new Date().toISOString()
    }
  )

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {departamento ? 'Editar Departamento' : 'Novo Departamento'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Responsável*</label>
          <input
            type="text"
            value={formData.responsavel}
            onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Orçamento (KZ)*</label>
          <input
            type="number"
            value={formData.orcamento}
            onChange={(e) => setFormData({...formData, orcamento: Number(e.target.value)})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Funcionários*</label>
          <input
            type="number"
            value={formData.funcionarios}
            onChange={(e) => setFormData({...formData, funcionarios: Number(e.target.value)})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
          <select
            value={formData.status ? 'ativo' : 'inativo'}
            onChange={(e) => setFormData({...formData, status: e.target.value === 'ativo'})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <Button
          onClick={() => onSave(formData)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Salvar Departamento
        </Button>
      </div>
    </div>
  )
}

