"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, Wifi, WifiOff } from "lucide-react"
import { checkBackendConnection, API_BASE_URL } from "@/lib/api-config"

export function BackendStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true)
      const connected = await checkBackendConnection()
      setIsConnected(connected)
      setIsChecking(false)
    }

    checkConnection()

    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  if (isChecking) {
    return (
      <Alert className="border-slate-700 bg-slate-800/50">
        <Wifi className="h-4 w-4 animate-pulse" />
        <AlertTitle>Verificando conexão...</AlertTitle>
        <AlertDescription className="text-slate-400">
          Conectando ao backend em <code className="text-cyan-400">{API_BASE_URL}</code>
        </AlertDescription>
      </Alert>
    )
  }

  if (isConnected === false) {
    return (
      <Alert className="border-red-500/50 bg-red-500/10">
        <WifiOff className="h-4 w-4 text-red-400" />
        <AlertTitle className="text-red-400">Backend não conectado</AlertTitle>
        <AlertDescription className="text-slate-300 space-y-2">
          <p>Não foi possível conectar ao backend Django em:</p>
          <code className="block bg-slate-900 px-3 py-2 rounded text-cyan-400 text-sm">{API_BASE_URL}</code>
          <div className="mt-3 space-y-1 text-sm">
            <p className="font-semibold text-slate-200">Para resolver:</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Certifique-se de que o servidor Django está rodando</li>
              <li>Verifique se a URL do backend está correta</li>
              <li>Configure CORS no Django para permitir requisições do frontend</li>
              <li>
                Se necessário, configure a variável <code className="text-cyan-400">NEXT_PUBLIC_API_URL</code>
              </li>
            </ol>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-green-500/50 bg-green-500/10">
      <CheckCircle2 className="h-4 w-4 text-green-400" />
      <AlertTitle className="text-green-400">Backend conectado</AlertTitle>
      <AlertDescription className="text-slate-300">
        Conectado com sucesso ao backend em <code className="text-cyan-400">{API_BASE_URL}</code>
      </AlertDescription>
    </Alert>
  )
}
