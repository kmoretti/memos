import { createEch0Client } from './ech0-client'
import type { DataSourceAdapter } from './dataSource'
import type { UnifiedPost, UnifiedPostResponse, UnifiedComment, TagCount } from '~/types/post'

export class Ech0Adapter implements DataSourceAdapter {
  private _client: any = null

  private getClient() {
    if (!this._client) {
      const config = useRuntimeConfig()
      this._client = createEch0Client({
        baseUrl: config.ech0BaseUrl || 'https://m.081531.xyz',
        token: config.ech0AccessToken || undefined,
      })
    }
    return this._client
  }

  async query(params: {
    page: number
    pageSize: number
    search?: string
    tag?: string
  }): Promise<UnifiedPostResponse> {
    const client = this.getClient()
    const res = await client.post('/api/echo/query', {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search || '',
    })

    if (res.code !== 1) {
      throw new Error(res.msg || 'Ech0 query failed')
    }

    const items = (res.data?.items || []).map((e: any) => this.transformEcho(e))

    return {
      items,
      total: res.data?.total || 0,
    }
  }

  async getById(id: string): Promise<UnifiedPost | null> {
    const client = this.getClient()
    const res = await client.get(`/api/echo/${id}`)
    if (res.code === 1 && res.data) {
      return this.transformEcho(res.data)
    }
    return null
  }

  async getTags(): Promise<TagCount[]> {
    const client = this.getClient()
    const res = await client.get('/api/tags')
    if (res.code === 1 && Array.isArray(res.data)) {
      return res.data.map((t: any) => ({
        name: t.name,
        count: t.usage_count || 0,
      }))
    }
    return []
  }

  async getComments(postId: string): Promise<UnifiedComment[]> {
    const client = this.getClient()
    const res = await client.get(`/api/comments?echo_id=${postId}`)
    if (res.code === 1 && Array.isArray(res.data)) {
      return res.data
        .filter((c: any) => c.status === 'approved')
        .map((c: any) => ({
          id: c.id,
          content: c.content || '',
          author: c.nickname || '匿名',
          avatar: '',
          createTime: c.created_at || 0,
          parentId: c.parent_id,
        }))
    }
    return []
  }

  private transformEcho(echo: any): UnifiedPost {
    const config = useRuntimeConfig()
    const baseUrl = config.ech0BaseUrl || 'https://m.081531.xyz'

    const images = (echo.echo_files || [])
      .filter((f: any) => f.file?.category === 'image')
      .map((f: any) => ({
        url: f.file.url?.startsWith('http') ? f.file.url : `${baseUrl}${f.file.url}`,
        name: f.file.name || '',
        width: f.file.width || 0,
        height: f.file.height || 0,
        contentType: f.file.content_type || 'image/jpeg',
      }))

    const extensions = []
    if (echo.extension?.type && echo.extension.type !== 'LOCATION') {
      extensions.push({
        type: echo.extension.type as UnifiedExtension['type'],
        payload: echo.extension.payload || {},
      })
    }

    const location = echo.extension?.type === 'LOCATION'
      ? echo.extension.payload
      : undefined

    return {
      id: echo.id,
      content: echo.content || '',
      author: echo.username || '',
      avatar: '',
      createTime: echo.created_at || 0,
      tags: (echo.tags || []).map((t: any) => t.name),
      images,
      extensions,
      location,
      pinned: false,
      likes: echo.fav_count || 0,
      layout: echo.layout || 'waterfall',
    }
  }
}
