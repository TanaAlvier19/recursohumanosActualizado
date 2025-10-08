const isMobile = () => {
  if (typeof window === "undefined") return false
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 768
  )
}

const options = {}

export const buscarDados = async () => {
  try {
    const mobile = isMobile()

    const config: RequestInit = {
      ...options,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options as any).headers,
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

    const res = await fetch("https://recursohumanosactualizado.onrender.com/usuariologado/", config)

    if (res.status === 403 || res.status === 401) {
      return null
    }

    const dados = await res.json()
    console.log(dados)
    return dados
  } catch (err) {
    alert("Erro: " + err)
  }
}

export const buscarModulos = async () => {
  try {
    const mobile = isMobile()

    const config: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

    const res = await fetch("https://recursohumanosactualizado.onrender.com/modulos/", config)

    if (res.status === 403 || res.status === 401) {
      return null
    }

    const dados = await res.json()
    console.log(dados)
    return dados
  } catch (err) {
    alert("Erro: " + err)
  }
}
