"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { FiEdit3, FiCamera } from "react-icons/fi"

interface PerfilHeaderProps {
  nomeCompleto: string
  funcionario: any
  fotoPerfil: string | null
  camposNormais: Record<string, string>
  onEditar: () => void
}

export default function PerfilHeader({ 
  nomeCompleto, 
  funcionario, 
  fotoPerfil, 
  camposNormais,
  onEditar 
}: PerfilHeaderProps) {

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="mb-6">
<div className="h-32 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
    <div className="relative pt-0 pb-6">
      <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16 relative z-10">
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
            <AvatarImage 
              src={fotoPerfil || "/time.png"} 
              alt={nomeCompleto}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              {getInitials(nomeCompleto)}
            </AvatarFallback>
          </Avatar>
          {fotoPerfil && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-white">
              <FiCamera className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 md:ml-4 mt-4 md:mt-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{nomeCompleto}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {/* <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  ID: {funcionario.id}
                </Badge> */}
                {camposNormais.cargo && (
                  <Badge variant="outline" className="border-purple-200 text-purple-700">
                     {camposNormais.cargo}
                  </Badge>
                )}
                {funcionario.departamento && (
                  <Badge variant="outline" className="border-green-200 text-green-700">
                    Departamento: {funcionario.departamento}
                  </Badge>
                )}
                {fotoPerfil && (
                  <Badge variant="outline" className="border-green-200 text-green-700">
                    <FiCamera className="w-3 h-3 mr-1" />
                    Foto
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={onEditar}>
                <FiEdit3 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    

  )
}