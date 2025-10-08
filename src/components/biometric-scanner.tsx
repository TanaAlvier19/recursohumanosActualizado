"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Fingerprint, Scan, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useBiometric } from "@/hooks/use-biometric"

interface BiometricScannerProps {
  funcionarioId: number
  funcionarioNome: string
  onScanComplete?: (success: boolean, data?: any) => void
  mode?: "register" | "validate"
  credentialId?: string
}

export function BiometricScanner({
  funcionarioId,
  funcionarioNome,
  onScanComplete,
  mode = "validate",
  credentialId,
}: BiometricScannerProps) {
  const { isAvailable, biometricType, isLoading, register, validate } = useBiometric()
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; confidence?: number } | null>(null)

  const handleScan = async () => {
    setScanning(true)
    setResult(null)

    try {
      if (mode === "register") {
        const credential = await register(funcionarioId, funcionarioNome)

        if (credential) {
          setResult({
            success: true,
            message: "Biometria registrada com sucesso!",
          })
          onScanComplete?.(true, credential)
        } else {
          setResult({
            success: false,
            message: "Falha ao registrar biometria",
          })
          onScanComplete?.(false)
        }
      } else {
        if (!credentialId) {
          setResult({
            success: false,
            message: "ID de credencial não fornecido",
          })
          onScanComplete?.(false)
          setScanning(false)
          return
        }

        const validation = await validate(credentialId)

        if (validation.valid) {
          setResult({
            success: true,
            message: "Biometria validada com sucesso!",
            confidence: validation.confidence,
          })
          onScanComplete?.(true, validation)
        } else {
          setResult({
            success: false,
            message: validation.error || "Falha na validação biométrica",
          })
          onScanComplete?.(false)
        }
      }
    } catch (error) {
      console.error("[v0] Erro no scanner biométrico:", error)
      setResult({
        success: false,
        message: "Erro ao processar biometria",
      })
      onScanComplete?.(false)
    } finally {
      setScanning(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="border-slate-700 bg-slate-800/50 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      </Card>
    )
  }

  if (!isAvailable) {
    return (
      <Card className="border-red-500/30 bg-red-500/10 p-6">
        <div className="flex items-center gap-3">
          <XCircle className="h-6 w-6 text-red-400" />
          <div>
            <p className="font-semibold text-red-400">Biometria não disponível</p>
            <p className="text-sm text-slate-300">Este dispositivo não suporta autenticação biométrica</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-slate-700 bg-slate-800/50 p-8">
      <div className="mb-6 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <h3 className="text-xl font-semibold text-white">
            {mode === "register" ? "Registrar Biometria" : "Validar Biometria"}
          </h3>
          <Badge className="bg-cyan-500/20 text-cyan-400">
            {biometricType === "facial" && "Face ID"}
            {biometricType === "digital" && "Impressão Digital"}
            {biometricType === "platform" && "Biometria"}
          </Badge>
        </div>
        <p className="text-slate-400">
          {mode === "register"
            ? "Posicione seu dedo no sensor ou olhe para a câmera"
            : "Autentique-se para registrar o ponto"}
        </p>
      </div>

      {/* Scanner Visual */}
      <div className="mb-6 flex justify-center">
        <div
          className={`relative flex h-48 w-48 items-center justify-center rounded-full border-4 transition-all ${
            scanning
              ? "animate-pulse border-cyan-500 bg-cyan-500/20"
              : result?.success
                ? "border-green-500 bg-green-500/20"
                : result && !result.success
                  ? "border-red-500 bg-red-500/20"
                  : "border-slate-600 bg-slate-700/30"
          }`}
        >
          {scanning ? (
            <>
              <Scan className="h-24 w-24 animate-pulse text-cyan-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-full animate-ping rounded-full border-4 border-cyan-500 opacity-75" />
              </div>
            </>
          ) : result?.success ? (
            <CheckCircle2 className="h-24 w-24 text-green-400" />
          ) : result && !result.success ? (
            <XCircle className="h-24 w-24 text-red-400" />
          ) : (
            <Fingerprint className="h-24 w-24 text-slate-500" />
          )}
        </div>
      </div>

      {/* Resultado */}
      {result && (
        <div
          className={`mb-4 rounded-lg border p-4 ${
            result.success ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"
          }`}
        >
          <div className="flex items-center gap-3">
            {result.success ? (
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            ) : (
              <XCircle className="h-6 w-6 text-red-400" />
            )}
            <div className="flex-1">
              <p className={`font-semibold ${result.success ? "text-green-400" : "text-red-400"}`}>{result.message}</p>
              {result.confidence && <p className="text-sm text-slate-300">Confiança: {result.confidence}%</p>}
            </div>
          </div>
        </div>
      )}

      {/* Botão de Ação */}
      <Button
        onClick={handleScan}
        disabled={scanning}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
        size="lg"
      >
        {scanning ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Escaneando...
          </>
        ) : (
          <>
            <Fingerprint className="mr-2 h-5 w-5" />
            {mode === "register" ? "Registrar Biometria" : "Escanear Biometria"}
          </>
        )}
      </Button>

      {scanning && (
        <p className="mt-4 text-center text-sm text-cyan-400">Aguarde enquanto processamos sua biometria...</p>
      )}
    </Card>
  )
}
