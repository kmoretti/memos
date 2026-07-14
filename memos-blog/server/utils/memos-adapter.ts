import { getMemosClient } from './memos-client'
import type { DataSourceAdapter } from './dataSource'
import type { UnifiedPost, UnifiedPostResponse, UnifiedComment, TagCount } from '~/types/post'

export class MemosAdapter implements DataSourceAdapter {
  async query(params: {
    page: number
    pageSize: number
    search?: string
    tag?: string
  }): Promise<UnifiedPostResponse> {
    const client = getMemosClient()

    const filters: string[] = []
    if (params.tag) {
      filters.push(`tag in ['${params.tag}']`)
    }
    if (params.search) {
      filters.push(`content.contains("${params.search}")`)
    }

    const data = await client.get('/memos', {
      pageSize: params.pageSize,
      filter: filters.length > 0 ? filters.join(' && ') : undefined,
    })

    const items = (data.memos || []).map((m: any) => this.transformMemo(m))

    return {
      items,
      total: items.length,
      nextPageToken: data.nextPageToken || '',
    }
  }

  async getById(id: string): Promise<UnifiedPost | null> {
    const client = getMemosClient()
    try {
      const data = await client.get(`/memos/${id}`)
      if (data) {
        return this.transformMemo(data)
      }
    } catch {
      return null
    }
    return null
  }

  async getTags(): Promise<TagCount[]> {
    const client = getMemosClient()
    const tagMap = new Map<string, number>()

    let pageToken = ''
    let hasMore = true

    while (hasMore) {
      const params: Record<string, any> = { pageSize: 50 }
      if (pageToken) params.pageToken = pageToken

      const data = await client.get('/memos', params) as any

      for (const memo of data.memos || []) {
        if (memo.visibility !== 'PUBLIC') continue
        for (const tag of memo.tags || []) {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
        }
      }

      pageToken = data.nextPageToken || ''
      hasMore = !!pageToken
    }

    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }

  async getComments(postId: string): Promise<UnifiedComment[]> {
    const client = getMemosClient()
    try {
      const data = await client.get(`/memos/${postId}/comments`) as any
      return (data.memos || []).map((m: any) => ({
        id: m.name?.replace('memos/', '') || '',
        content: m.content || '',
        author: m.creator?.replace('users/', '') || '',
        avatar: '',
        createTime: m.createTime ? new Date(m.createTime).getTime() / 1000 : 0,
        parentId: undefined,
      }))
    } catch {
      return []
    }
  }

  private transformMemo(memo: any): UnifiedPost {
    const id = memo.name?.replace('memos/', '') || ''
    const baseUrl = process.env.MEMOS_BASE_URL || 'https://mm.2005815.xyz'

    const images = (memo.attachments || [])
      .filter((a: any) => a.type?.startsWith('image/'))
      .map((a: any) => ({
        url: a.externalLink || `${baseUrl}/api/v1/${a.name}/content`,
        name: a.filename || '',
        width: 0,
        height: 0,
        contentType: a.type || 'image/jpeg',
      }))

    return {
      id,
      content: memo.content || '',
      author: memo.creator?.replace('users/', '') || '',
      avatar: '',
      createTime: memo.createTime
        ? Math.floor(new Date(memo.createTime).getTime() / 1000)
        : 0,
      tags: memo.tags || [],
      images,
      extensions: [],
      location: memo.location?.placeholder || (memo.location?.latitude != null
        ? memo.location
        : undefined),
      pinned: memo.pinned || false,
      likes: 0,
      layout: 'none',
    }
  }
}
