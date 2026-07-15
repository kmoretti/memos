export interface UnifiedPost {
  id: string
  content: string
  author: string
  avatar: string
  createTime: number
  tags: string[]
  images: UnifiedImage[]
  extensions: UnifiedExtension[]
  location?: UnifiedLocation
  pinned: boolean
  likes: number
  layout: string
}

export interface UnifiedImage {
  url: string
  name: string
  width: number
  height: number
  contentType: string
}

export interface UnifiedExtension {
  type: 'WEBSITE' | 'GITHUBPROJ' | 'VIDEO' | 'MUSIC' | 'TWEET'
  payload: Record<string, any>
}

export interface UnifiedLocation {
  placeholder: string
  latitude: number
  longitude: number
}

export interface UnifiedPostResponse {
  items: UnifiedPost[]
  total: number
  nextPageToken?: string
}

export interface UnifiedComment {
  id: string
  content: string
  author: string
  avatar: string
  createTime: number
  parentId?: string | null
}

export interface TagCount {
  name: string
  count: number
}
