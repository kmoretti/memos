interface Ech0ClientOptions {
  baseUrl: string
  token?: string
}

export function createEch0Client(options: Ech0ClientOptions) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`
  }

  return {
    async post(path: string, body?: any) {
      const response = await fetch(`${options.baseUrl}${path}`, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Ech0 API error ${response.status}: ${text}`)
      }
      return response.json()
    },
    async get(path: string) {
      const response = await fetch(`${options.baseUrl}${path}`, { headers })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Ech0 API error ${response.status}: ${text}`)
      }
      return response.json()
    },
  }
}

export function getEch0Client() {
  const config = useRuntimeConfig()
  return createEch0Client({
    baseUrl: config.ech0BaseUrl || 'https://m.081531.xyz',
    token: config.ech0AccessToken || undefined,
  })
}
