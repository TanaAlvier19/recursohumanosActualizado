export const fetchAPI = async (url: string, options: RequestInit = {}) => {
  try {
    console.log("[v0] fetchAPI chamada para:", url)

    const token = localStorage.getItem("access_token")
    console.log("[v0] Token encontrado:", token ? "Sim" : "Não")

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {}),
      },
    }

    const baseURL = "https://recursohumanosactualizado.onrender.com"
    const fullURL = url.startsWith("http") ? url : `${baseURL}${url}`

    console.log("[v0] URL completa:", fullURL)

    const res = await fetch(fullURL, config)
    console.log("[v0] Status da resposta:", res.status)

    if (res.status === 403 || res.status === 401) {
      console.warn(`[v0] Não autorizado: ${res.status}`)
      throw new Error(`Não autorizado (${res.status}). Faça login novamente.`)
    }

    const contentType = res.headers.get("content-type")
    console.log("[v0] Content-Type:", contentType)

    if (!contentType || !contentType.includes("application/json")) {
      console.error(`[v0] Resposta não é JSON. Content-Type: ${contentType}`)
      console.error(`[v0] Status: ${res.status} - URL: ${fullURL}`)

      if (res.status >= 500) {
        console.error(`[v0] Erro no servidor (${res.status})`)
        throw new Error(`Erro no servidor (${res.status}). Tente novamente mais tarde.`)
      }

      throw new Error(`Resposta inválida do servidor. Status: ${res.status}`)
    }

    let dados
    try {
      dados = await res.json()
      console.log("[v0] Dados parseados:", dados)
    } catch (parseError) {
      console.error("[v0] Erro ao fazer parse do JSON:", parseError)
      throw new Error("Erro ao processar resposta do servidor")
    }

    if (!res.ok) {
      console.error(`[v0] Erro HTTP: ${res.status} - ${fullURL}`)
      const errorMessage = dados?.error || dados?.message || dados?.detail || `Erro HTTP ${res.status}`
      throw new Error(errorMessage)
    }

    if (res.status === 202) {
      console.log("[v0] Status 202 (Accepted) - Requisição aceita")
      // Se não houver dados, retornar array vazio ou objeto vazio dependendo do contexto
      if (!dados || (Array.isArray(dados) && dados.length === 0)) {
        console.log("[v0] Resposta 202 sem dados, retornando array vazio")
        return []
      }
    }

    console.log("[v0] Dados recebidos com sucesso")
    return dados
  } catch (err) {
    console.error("[v0] Erro na requisição:", err)

    if (err instanceof Error) {
      throw err
    }

    throw new Error("Erro desconhecido ao fazer requisição")
  }
}

export const buscarDados = async () => {
  return await fetchAPI("/usuariologado/")
}

export const buscarModulos = async () => {
  return await fetchAPI("/modulos/")
}
