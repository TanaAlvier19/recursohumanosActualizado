const BASE_URL = "https://recursohumanosactualizado.onrender.com"

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean
}

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export const fetchAPI = async (url: string, options: RequestInit = {}) => {
  try {
    console.log("[v0] fetchAPI chamada para:", url)

    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    console.log("[v0] Token encontrado:", token ? "Sim" : "Não")

    // **DETECTAR SE É FORM DATA**
    const isFormData = options.body instanceof FormData

    // **CONFIGURAÇÃO CORRETA DOS HEADERS**
    const headers: HeadersInit = {
      // Apenas definir Content-Type se NÃO for FormData
      ...(!isFormData && { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: "include" as RequestCredentials,
    }

    const baseURL = BASE_URL
    const fullURL = url.startsWith("http") ? url : `${baseURL}${url}`

    console.log("[v0] URL completa:", fullURL)
    console.log("[v0] Método:", options.method || "GET")
    console.log("[v0] É FormData?", isFormData)
    console.log("[v0] Headers configurados:", headers)

    const res = await fetch(fullURL, config)
    console.log("[v0] Status da resposta:", res.status)
    console.log("[v0] OK?", res.ok)

    if (res.status === 403 || res.status === 401) {
      console.warn(`[v0] Não autorizado: ${res.status}`)
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token")
      }
      throw new Error(`Não autorizado (${res.status}). Faça login novamente.`)
    }

    const contentType = res.headers.get("content-type")
    console.log("[v0] Content-Type:", contentType)

    // **TRATAMENTO FLEXÍVEL DA RESPOSTA**
    let responseData

    if (contentType && contentType.includes("application/json")) {
      try {
        responseData = await res.json()
        console.log("[v0] Dados parseados:", responseData)
      } catch (parseError) {
        console.error("[v0] Erro ao fazer parse do JSON:", parseError)
        const textResponse = await res.text()
        console.error("[v0] Resposta bruta:", textResponse)
        throw new Error("Resposta JSON inválida do servidor")
      }
    } else {
      // Tratar respostas não-JSON
      const textResponse = await res.text()
      console.log("[v0] Resposta não-JSON:", textResponse)

      if (res.ok) {
        // Tentar parsear mesmo que não seja JSON
        try {
          responseData = JSON.parse(textResponse)
        } catch {
          responseData = textResponse
        }
      } else {
        throw new Error(`Erro ${res.status}: ${textResponse}`)
      }
    }

    if (!res.ok) {
      console.error(`[v0] Erro HTTP: ${res.status} - ${fullURL}`)
      const errorMessage =
        responseData?.error || responseData?.message || responseData?.detail || `Erro HTTP ${res.status}`

      if (res.status === 400) {
        console.error("[v0] Bad Request - Detalhes:", responseData)
        // **MELHOR MENSAGEM PARA ERRO 400**
        const details = responseData?.valores || responseData
        throw new Error(errorMessage || "Dados inválidos enviados para o servidor")
      }

      throw new Error(errorMessage)
    }

    console.log("[v0] Dados recebidos com sucesso")
    return responseData
  } catch (err) {
    console.error("[v0] Erro na requisição:", err)

    if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
      throw new Error("Erro de conexão. Verifique sua internet e tente novamente.")
    }

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

export const testValoresEndpoint = async () => {
  console.log("🧪 TESTANDO ENDPOINT /valores/")

  try {
    // Teste 1: Requisição simples sem autenticação
    console.log("🔍 Teste 1: Requisição sem token...")
    const response1 = await fetch(`${BASE_URL}/valores/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    })
    console.log("Teste 1 - Status:", response1.status)
    console.log("Teste 1 - Content-Type:", response1.headers.get("content-type"))

    const text1 = await response1.text()
    console.log("Teste 1 - Resposta:", text1.substring(0, 500))

    // Teste 2: Com autenticação
    console.log("🔍 Teste 2: Requisição com token...")
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    const response2 = await fetch(`${BASE_URL}/valores/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    })
    console.log("Teste 2 - Status:", response2.status)
    console.log("Teste 2 - Content-Type:", response2.headers.get("content-type"))

    const text2 = await response2.text()
    console.log("Teste 2 - Resposta:", text2.substring(0, 500))

    return { test1: response1.status, test2: response2.status }
  } catch (error) {
    console.error("❌ Erro no teste:", error)
    throw error
  }
}

async function fetchAPITyped<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options

  // Use the original fetchAPI function
  return (await fetchAPI(endpoint, fetchOptions)) as T
}

// Unified API object
export const api = {
  instructors: {
    list: (tipo?: string) => {
      const params = tipo ? `?tipo=${tipo}` : ""
      return fetchAPITyped<any>(`/instrutores/${params}`)
    },
    get: (id: number) => fetchAPITyped<any>(`/instrutores/${id}/`),
    create: (data: any) =>
      fetchAPI("/instrutores/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      fetchAPI(`/instrutores/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchAPI(`/instrutores/${id}/`, {
        method: "DELETE",
      }),
  },
  competencies: {
    list: () => fetchAPITyped<any>(`/competencias/`),
    get: (id: number) => fetchAPITyped<any>(`/competencias/${id}/`),
    create: (data: any) =>
      fetchAPI("/competencias/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      fetchAPI(`/competencias/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchAPI(`/competencias/${id}/`, {
        method: "DELETE",
      }),
  },
  formations: {
    list: (filters?: { status?: string; categoria?: string; tipo?: string; ordering?: string; page_size?: number }) => {
      const params = new URLSearchParams()
      if (filters?.status) params.append("status", filters.status)
      if (filters?.categoria) params.append("categoria", filters.categoria)
      if (filters?.tipo) params.append("tipo", filters.tipo)
      if (filters?.ordering) params.append("ordering", filters.ordering)
      if (filters?.page_size) params.append("page_size", filters.page_size.toString())
      const queryString = params.toString()
      return fetchAPITyped<any>(`/formacoes/${queryString ? `?${queryString}` : ""}`)
    },
    get: (id: number) => fetchAPITyped<any>(`/formacoes/${id}/`),
    create: (data: any) =>
      fetchAPI("/formacoes/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      fetchAPI(`/formacoes/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchAPI(`/formacoes/${id}/`, {
        method: "DELETE",
      }),
    statistics: () => fetchAPITyped<any>("/formacoes/estatisticas/"),
    monthlyEvolution: () => fetchAPITyped<any[]>("/formacoes/evolucao_mensal/"),
    distributionByType: () => fetchAPITyped<any[]>("/formacoes/distribuicao_tipo/"),
  },
  enrollments: {
    list: (filters?: { status?: string; formacao?: number }) => {
      const params = new URLSearchParams()
      if (filters?.status) params.append("status", filters.status)
      if (filters?.formacao) params.append("formacao", filters.formacao.toString())
      const queryString = params.toString()
      return fetchAPITyped<any>(`/inscricoes/${queryString ? `?${queryString}` : ""}`)
    },
    get: (id: number) => fetchAPITyped<any>(`/inscricoes/${id}/`),
    create: (data: any) =>
      fetchAPI("/inscricoes/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      fetchAPI(`/inscricoes/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchAPI(`/inscricoes/${id}/`, {
        method: "DELETE",
      }),
  },
  evaluations: {
    list: () => fetchAPITyped<any>(`/avaliacoes/`),
    get: (id: number) => fetchAPITyped<any>(`/avaliacoes/${id}/`),
    create: (data: any) =>
      fetchAPI("/avaliacoes/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      fetchAPI(`/avaliacoes/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchAPI(`/avaliacoes/${id}/`, {
        method: "DELETE",
      }),
  },
  reports: {
    getStatistics: () => fetchAPITyped<any>("/formacoes/estatisticas/"),
    getMonthlyEvolution: () => fetchAPITyped<any[]>("/formacoes/evolucao_mensal/"),
    getDistributionByType: () => fetchAPITyped<any[]>("/formacoes/distribuicao_tipo/"),
    getTopFormations: () => fetchAPITyped<any[]>("/relatorios/top_formacoes/"),
    getMonthlyInvestment: () => fetchAPITyped<any[]>("/relatorios/investimento_mensal/"),
  },
  competencyEvaluations: {
    list: () => fetchAPITyped<any[]>(`/avaliacoes-competencia/`),
    get: (id: number) => fetchAPITyped<any>(`/avaliacoes-competencia/${id}/`),
    create: (data: any) =>
      fetchAPI("/avaliacoes-competencia/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      fetchAPI(`/avaliacoes-competencia/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchAPI(`/avaliacoes-competencia/${id}/`, {
        method: "DELETE",
      }),
  },
  presences: {
    list: () => fetchAPITyped<any[]>(`/presencas/`),
    get: (id: number) => fetchAPITyped<any>(`/presencas/${id}/`),
    create: (data: any) =>
      fetchAPI("/presencas/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      fetchAPI(`/presencas/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchAPI(`/presencas/${id}/`, {
        method: "DELETE",
      }),
  },
  certificates: {
    list: () => fetchAPITyped<any[]>(`/certificados/`),
    get: (id: number) => fetchAPITyped<any>(`/certificados/${id}/`),
    create: (data: any) =>
      fetchAPI("/certificados/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      fetchAPI(`/certificados/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchAPI(`/certificados/${id}/`, {
        method: "DELETE",
      }),
  },
}

export const instrutorAPI = api.instructors
export const formacaoAPI = api.formations
export const inscricaoAPI = api.enrollments
export const relatoriosAPI = api.reports
export const competenciaAPI = api.competencies
export const avaliacaoAPI = api.evaluations
export const presencaAPI = api.presences
export const certificadoAPI = api.certificates
export const avaliacaoCompetenciaAPI = api.competencyEvaluations
