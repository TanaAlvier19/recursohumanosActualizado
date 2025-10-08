export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://recursohumanosactualizado.onrender.com"

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint
  return `${API_BASE_URL}/${cleanEndpoint}`
}

export const defaultFetchOptions: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
}

export async function fetchApi(endpoint: string, options?: RequestInit) {
  const url = getApiUrl(endpoint)

  if (process.env.NODE_ENV === "development") {
    console.log("[v0] API Request:", {
      url,
      method: options?.method || "GET",
      baseUrl: API_BASE_URL,
    })
  }

  try {
    const response = await fetch(url, {
      ...defaultFetchOptions,
      ...options,
      credentials: "include",
    })

    if (process.env.NODE_ENV === "development") {
      console.log("[v0] API Response:", {
        url,
        status: response.status,
        ok: response.ok,
      })
    }

    return response
  } catch (error) {
    console.error("[v0] API Error:", {
      url,
      error: error instanceof Error ? error.message : "Unknown error",
      baseUrl: API_BASE_URL,
    })
    throw error
  }
}

export async function checkBackendConnection(): Promise<boolean> {
  try {
    const response = await fetch(getApiUrl("api/"), {
      method: "GET",
      credentials: "include",
    })
    return response.ok
  } catch {
    return false
  }
}
