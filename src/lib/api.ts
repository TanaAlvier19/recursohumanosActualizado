// Helper para detectar se é mobile
const isMobile = () => {
  if (typeof window === "undefined") return false
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 768
  )
}

const options = {}

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
      const token = localStorage.getItem("access_token")
      if (token) {
        ;(config.headers as any).Authorization = `Bearer ${token}`
      }
    } else {
      config.credentials = "include"
    }

    const baseURL = "https://recursohumanosactualizado.onrender.com"
    const fullURL = url.startsWith("http") ? url : `${baseURL}${url}`

    const res = await fetch(fullURL, config)

    if (res.status === 403 || res.status === 401) {
      return null
    }

    const dados = await res.json()
    return dados
  } catch (err) {
    console.error("Erro na requisição:", err)
    throw err
  }
}

export const buscarDados = async () => {
  return await fetchAPI("/usuariologado/")
}

export const buscarModulos = async () => {
  return await fetchAPI("/modulos/")
}
