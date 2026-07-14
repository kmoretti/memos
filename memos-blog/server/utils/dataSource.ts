import { Ech0Adapter } from './ech0-adapter'
import { MemosAdapter } from './memos-adapter'

export interface DataSourceAdapter {
  query(params: {
    page: number
    pageSize: number
    search?: string
    tag?: string
  }): Promise<{ items: any[]; total: number; nextPageToken?: string }>

  getById(id: string): Promise<any | null>

  getTags(): Promise<{ name: string; count: number }[]>

  getComments(postId: string): Promise<any[]>
}

let _adapter: DataSourceAdapter | null = null

export function getDataSource(): DataSourceAdapter {
  if (_adapter) return _adapter

  const config = useRuntimeConfig()
  const source = config.dataSource || 'ech0'

  if (source === 'memos') {
    _adapter = new MemosAdapter()
  } else {
    _adapter = new Ech0Adapter()
  }

  return _adapter!
}
