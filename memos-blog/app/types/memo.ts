// app/types/memo.ts
export interface MemosMemo {
  name: string
  state: 'STATE_UNSPECIFIED' | 'NORMAL' | 'ARCHIVED'
  creator: string
  createTime: string
  updateTime: string
  content: string
  visibility: 'VISIBILITY_UNSPECIFIED' | 'PRIVATE' | 'PROTECTED' | 'PUBLIC'
  tags: string[]
  pinned: boolean
  attachments: MemosAttachment[]
  relations: MemosRelation[]
  reactions: MemosReaction[]
  property: {
    hasLink: boolean
    hasTaskList: boolean
    hasCode: boolean
    hasIncompleteTasks: boolean
    title: string
  }
  parent: string
  snippet: string
  location: {
    placeholder: string
    latitude: number
    longitude: number
  }
}

export interface MemosAttachment {
  name: string
  createTime: string
  filename: string
  content: string
  externalLink: string
  type: string
  size: string
  memo: string
}

export interface MemosRelation {
  memo: { name: string; snippet: string }
  relatedMemo: { name: string; snippet: string }
  type: string
}

export interface MemosReaction {
  name: string
  creator: string
  contentId: string
  reactionType: string
  createTime: string
}

export interface MemosListResponse {
  memos: MemosMemo[]
  nextPageToken: string
}

export interface MemosReactionListResponse {
  reactions: MemosReaction[]
  nextPageToken: string
  totalSize: number
}

export interface MemosSignInRequest {
  username: string
  password: string
}

export interface MemosSignInResponse {
  accessToken: string
}

export interface TagCount {
  name: string
  count: number
}
