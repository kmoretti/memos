interface MemosClientOptions {
  baseUrl: string
  token?: string
}

export function createMemosClient(options: MemosClientOptions) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`
  }

  return {
    async get(path: string, query?: Record<string, any>) {
      const url = new URL(`${options.baseUrl}/api/v1${path}`)
      if (query) {
        for (const [key, value] of Object.entries(query)) {
          if (value !== undefined && value !== null) {
            url.searchParams.set(key, String(value))
          }
        }
      }
      const response = await fetch(url.toString(), { headers })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Memos API error ${response.status}: ${errorText}`)
      }
      return response.json()
    },
    async post(path: string, body: any) {
      const response = await fetch(`${options.baseUrl}/api/v1${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Memos API error ${response.status}: ${errorText}`)
      }
      return response.json()
    },
  }
}

export function getMemosClient(event?: any) {
  const config = useRuntimeConfig()
  let token = config.memosAccessToken || ''

  if (event) {
    const authHeader = getHeader(event, 'authorization')
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    }
  }

  return createMemosClient({
    baseUrl: config.memosBaseUrl,
    token: token || undefined,
  })
}
