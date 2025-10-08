"use client"

import { useState, useEffect } from "react"
import {
  isBiometricAvailable,
  registerBiometric,
  validateBiometric,
  getBiometricType,
  type BiometricCredential,
  type BiometricValidation,
} from "@/lib/biometric-auth"

export function useBiometric() {
  const [isAvailable, setIsAvailable] = useState(false)
  const [biometricType, setBiometricType] = useState<"digital" | "facial" | "platform" | "none">("none")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkBiometric() {
      const available = await isBiometricAvailable()
      const type = await getBiometricType()

      setIsAvailable(available)
      setBiometricType(type)
      setIsLoading(false)
    }

    checkBiometric()
  }, [])

  const register = async (funcionarioId: number, nome: string): Promise<BiometricCredential | null> => {
    if (!isAvailable) {
      console.error("[v0] Biometria não disponível neste dispositivo")
      return null
    }

    return await registerBiometric(funcionarioId, nome)
  }

  const validate = async (credentialId: string): Promise<BiometricValidation> => {
    if (!isAvailable) {
      return {
        valid: false,
        confidence: 0,
        error: "Biometria não disponível neste dispositivo",
      }
    }

    return await validateBiometric(credentialId)
  }

  return {
    isAvailable,
    biometricType,
    isLoading,
    register,
    validate,
  }
}
