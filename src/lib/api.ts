// Helper para detectar se é mobile
const isMobile = () => {
  if (typeof window === "undefined") return false
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 768
  )
}

export const fetchAPI = async (url: string, options: RequestInit = {}) => {
  try {
    const mobile = isMobile()

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }

    if (mobile) {
      // Mobile: usa localStorage
      const token = localStorage.getItem("access_token")
      if (token) {
        ;(config.headers as any).Authorization = `Bearer ${token}`
      }
    } else {
      // Desktop: usa cookies
      config.credentials = "include"
    }

    const baseURL = "https://recursohumanosactualizado.onrender.com"
    const fullURL = url.startsWith("http") ? url : `${baseURL}${url}`

    const res = await fetch(fullURL, config)

    if (res.status === 403 || res.status === 401) {
      console.warn(`[fetchAPI] Não autorizado: ${res.status}`)
      return null
    }

    const contentType = res.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`[fetchAPI] Resposta não é JSON. Content-Type: ${contentType}`)
      console.error(`[fetchAPI] Status: ${res.status} - URL: ${fullURL}`)

      // Se for erro 500, retornar null ao invés de tentar fazer parse
      if (res.status >= 500) {
        console.error(`[fetchAPI] Erro no servidor (${res.status})`)
        return null
      }

      throw new Error(`Resposta não é JSON. Status: ${res.status}`)
    }

    if (!res.ok) {
      console.error(`[fetchAPI] Erro HTTP: ${res.status} - ${fullURL}`)
      const errorData = await res.json().catch(() => ({ error: "Erro desconhecido" }))
      throw new Error(errorData.error || `Erro HTTP ${res.status}`)
    }

    const dados = await res.json()
    return dados
  } catch (err) {
    console.error("[fetchAPI] Erro na requisição:", err)
    return null
  }
}

export const buscarDados = async () => {
  return await fetchAPI("/usuariologado/")
}

export const buscarModulos = async () => {
  return await fetchAPI("/modulos/")
}
