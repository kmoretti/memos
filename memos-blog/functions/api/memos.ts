// Cloudflare Pages Function: proxy /api/memos to Memos server
export async function onRequest(context: any) {
  const env = context.env
  const url = new URL(context.request.url)

  const memosUrl = new URL('https://mm.2005815.xyz/api/v1/memos')
  // Forward query params
  url.searchParams.forEach((value, key) => {
    memosUrl.searchParams.set(key, value)
  })

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Check for access token in env or header
  const token = env.MEMOS_ACCESS_TOKEN || ''
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const resp = await fetch(memosUrl.toString(), { headers })

  const data = await resp.json()

  return new Response(JSON.stringify(data), {
    status: resp.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
