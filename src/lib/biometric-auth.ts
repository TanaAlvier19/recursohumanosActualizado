
export interface BiometricCredential {
  id: string
  type: "digital" | "facial" | "platform"
  rawId: ArrayBuffer
  response: {
    clientDataJSON: ArrayBuffer
    attestationObject: ArrayBuffer
  }
}

export interface BiometricValidation {
  valid: boolean
  confidence: number
  funcionarioId?: number
  error?: string
}


export async function isBiometricAvailable(): Promise<boolean> {
  if (!window.PublicKeyCredential) {
    return false
  }

  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    return available
  } catch (error) {
    console.error("[v0] Erro ao verificar disponibilidade biométrica:", error)
    return false
  }
}

export async function registerBiometric(funcionarioId: number, nome: string): Promise<BiometricCredential | null> {
  try {
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Sistema de Assiduidade",
        id: window.location.hostname,
      },
      user: {
        id: new Uint8Array(Buffer.from(funcionarioId.toString())),
        name: nome,
        displayName: nome,
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" }, // ES256
        { alg: -257, type: "public-key" }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        requireResidentKey: false,
      },
      timeout: 60000,
      attestation: "direct",
    }

    const credential = (await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    })) as PublicKeyCredential

    if (!credential) {
      throw new Error("Falha ao criar credencial biométrica")
    }

    const response = credential.response as AuthenticatorAttestationResponse

    return {
      id: credential.id,
      type: "platform",
      rawId: credential.rawId,
      response: {
        clientDataJSON: response.clientDataJSON,
        attestationObject: response.attestationObject,
      },
    }
  } catch (error) {
    console.error("[v0] Erro ao registrar biometria:", error)
    return null
  }
}

/**
 * Valida biometria do funcionário
 */
export async function validateBiometric(credentialId: string): Promise<BiometricValidation> {
  try {
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      allowCredentials: [
        {
          id: Uint8Array.from(atob(credentialId), (c) => c.charCodeAt(0)),
          type: "public-key",
          transports: ["internal"],
        },
      ],
      timeout: 60000,
      userVerification: "required",
    }

    const assertion = (await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    })) as PublicKeyCredential

    if (!assertion) {
      return {
        valid: false,
        confidence: 0,
        error: "Falha na validação biométrica",
      }
    }

    // Simular confiança baseada na resposta
    const confidence = 95 + Math.random() * 5 // 95-100%

    return {
      valid: true,
      confidence: Math.round(confidence * 10) / 10,
    }
  } catch (error) {
    console.error("[v0] Erro ao validar biometria:", error)
    return {
      valid: false,
      confidence: 0,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

/**
 * Obtém tipo de biometria disponível no dispositivo
 */
export async function getBiometricType(): Promise<"digital" | "facial" | "platform" | "none"> {
  const available = await isBiometricAvailable()

  if (!available) {
    return "none"
  }

  // Detectar tipo baseado no user agent e capacidades
  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
    return "facial" // Face ID
  } else if (userAgent.includes("android")) {
    return "digital" // Impressão digital
  }

  return "platform" // Biometria genérica da plataforma
}

/**
 * Converte ArrayBuffer para Base64
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/**
 * Converte Base64 para ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}
