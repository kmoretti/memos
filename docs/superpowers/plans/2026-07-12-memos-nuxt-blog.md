# Memos Nuxt Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Nuxt 4 blog with icefox-style social feed layout + flatpaper paper texture, backed by Memos 0.29.1 API.

**Architecture:** Server API proxy pattern — Nuxt Server routes proxy requests to Memos API, keeping tokens secure. SSR for initial page loads, SPA for infinite scroll pagination. Memos reactions replace custom likes, memos child memos serve as comments.

**Tech Stack:** Nuxt 4, pnpm, TypeScript, SCSS, markdown-it, Pinia, @iconify/vue, medium-zoom

**Design Spec:** `docs/superpowers/specs/2026-07-12-memos-nuxt-blog-design.md`

---

## File Map

| File | Responsibility |
|------|---------------|
| `config.ts` | Static site/theme configuration |
| `nuxt.config.ts` | Nuxt framework config + runtimeConfig |
| `.env` | Environment variables (MEMOS_BASE_URL, MEMOS_ACCESS_TOKEN) |
| `app/types/memo.ts` | Memos API TypeScript interfaces |
| `server/utils/memos-client.ts` | Memos API client factory |
| `server/api/memos/index.get.ts` | List memos endpoint |
| `server/api/memos/[id].get.ts` | Get single memo endpoint |
| `server/api/memos/[id]/comments.get.ts` | List memo comments |
| `server/api/memos/[id]/comments.post.ts` | Create comment |
| `server/api/memos/[id]/reactions.get.ts` | List memo reactions |
| `server/api/memos/[id]/reactions.post.ts` | Upsert reaction |
| `server/api/auth.post.ts` | Memos sign-in proxy |
| `server/api/tags.get.ts` | Aggregate tags from memos |
| `app/composables/useMemos.ts` | Memo list data fetching + pagination |
| `app/composables/useAuth.ts` | Auth state + login/logout |
| `app/composables/useTheme.ts` | Dark mode toggle + persistence |
| `app/composables/useReaction.ts` | Reaction CRUD operations |
| `app/stores/auth.ts` | Pinia auth store |
| `app/utils/time.ts` | Time formatting utilities |
| `app/utils/markdown.ts` | Markdown rendering with markdown-it |
| `app/assets/styles/variables.scss` | CSS custom properties (light/dark) |
| `app/assets/styles/main.scss` | Global styles, layout, paper texture |
| `app/assets/styles/markdown.scss` | Markdown content styles |
| `app/components/ui/Icon.vue` | Iconify icon wrapper |
| `app/components/ui/DarkModeToggle.vue` | Theme toggle button |
| `app/components/ui/InfiniteScroll.vue` | Infinite scroll container |
| `app/components/ui/MarkdownRenderer.vue` | Markdown to HTML renderer |
| `app/components/ui/ImageLightbox.vue` | Image lightbox overlay |
| `app/components/layout/AppHeader.vue` | Top navigation bar |
| `app/components/layout/AppFooter.vue` | Footer |
| `app/components/memo/MemoCard.vue` | Single memo card |
| `app/components/memo/MemoList.vue` | Memo list with infinite scroll |
| `app/components/memo/MemoDetail.vue` | Memo detail body |
| `app/components/memo/MemoAttachment.vue` | Attachment renderer (images/video) |
| `app/components/memo/MemoLocation.vue` | Location display |
| `app/components/memo/MemoTime.vue` | Smart relative time |
| `app/components/reaction/ReactionBar.vue` | Reaction list + add button |
| `app/components/reaction/ReactionPicker.vue` | Emoji picker |
| `app/components/comment/CommentList.vue` | Comment list (collapsible) |
| `app/components/comment/CommentItem.vue` | Single comment |
| `app/components/comment/CommentForm.vue` | Comment input form |
| `app/components/auth/LoginModal.vue` | Login dialog |
| `app/pages/index.vue` | Homepage (memo feed) |
| `app/pages/memo/[id].vue` | Memo detail page |
| `app/pages/tags/index.vue` | Tag list page |
| `app/pages/tags/[tag].vue` | Memos filtered by tag |
| `app/pages/about.vue` | About page (placeholder) |
| `app/app.vue` | Root layout |
| `app/error.vue` | Error page |

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `nuxt.config.ts`, `config.ts`, `.env`, `tsconfig.json`, `app/app.vue`

- [ ] **Step 1: Initialize Nuxt 4 project**

```bash
cd e:\kmoretti-github\memos
pnpm dlx nuxi@latest init memos-blog --packageManager pnpm
cd memos-blog
```

- [ ] **Step 2: Install core dependencies**

```bash
pnpm add @iconify/vue markdown-it @pinia/nuxt pinia medium-zoom
pnpm add -D sass typescript @types/markdown-it
```

- [ ] **Step 3: Create `.env` file**

```bash
# .env
MEMOS_BASE_URL=https://mm.2005815.xyz
MEMOS_ACCESS_TOKEN=
```

- [ ] **Step 4: Create `config.ts`**

```typescript
// config.ts
export default {
  site: {
    title: '我的博客',
    description: '基于 Memos 的个人博客',
    author: '作者名',
    avatar: '/avatar.png',
    logo: '/logo.svg',
    favicon: '/favicon.ico',
    language: 'zh-CN',
    social: {
      github: '',
      twitter: '',
      email: '',
    },
  },
  memos: {
    pageSize: 20,
    defaultVisibility: 'PUBLIC',
  },
  theme: {
    colors: {
      primary: '#5b7a9d',
      accent: '#e8a87c',
    },
    fonts: {
      body: 'LXGW WenKai',
      heading: 'ZCOOL XiaoWei',
      mono: 'JetBrains Mono',
    },
    paper: {
      dashedBorder: true,
      tapeDecoration: true,
      stampDecoration: false,
    },
    lightbox: {
      enabled: true,
    },
  },
  footer: {
    copyright: '© 2024 作者名',
    beian: '',
    powered: true,
    links: [
      { text: '关于', href: '/about' },
    ],
  },
  seo: {
    titleTemplate: '%s - 我的博客',
    ogImage: '/og-image.png',
    keywords: ['blog', 'memos'],
  },
  analytics: {
    umami: '',
    cloudflare: '',
  },
} as const
```

- [ ] **Step 5: Configure `nuxt.config.ts`**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-01-01',
  modules: ['@pinia/nuxt', '@iconify/vue'],
  css: [
    '~/assets/styles/variables.scss',
    '~/assets/styles/main.scss',
  ],
  runtimeConfig: {
    memosBaseUrl: process.env.MEMOS_BASE_URL || 'https://mm.2005815.xyz',
    memosAccessToken: process.env.MEMOS_ACCESS_TOKEN || '',
    public: {
      siteTitle: '我的博客',
    },
  },
  app: {
    head: {
      title: '我的博客',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '基于 Memos 的个人博客' },
      ],
      htmlAttrs: { lang: 'zh-CN' },
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/assets/styles/variables" as *;`,
        },
      },
    },
  },
})
```

- [ ] **Step 6: Create minimal `app/app.vue`**

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 7: Verify project starts**

```bash
pnpm dev
```

Expected: Dev server starts on localhost:3000 without errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: initialize nuxt 4 project with config and dependencies"
```

---

## Task 2: TypeScript Types

**Files:**
- Create: `app/types/memo.ts`

- [ ] **Step 1: Create Memos API types**

```typescript
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
  // other fields from Memos auth response
}

export interface TagCount {
  name: string
  count: number
}
```

- [ ] **Step 2: Commit**

```bash
git add app/types/memo.ts
git commit -m "feat: add memos api typescript types"
```

---

## Task 3: Server API Client + Endpoints

**Files:**
- Create: `server/utils/memos-client.ts`, `server/api/memos/index.get.ts`, `server/api/memos/[id].get.ts`, `server/api/memos/[id]/comments.get.ts`, `server/api/memos/[id]/comments.post.ts`, `server/api/memos/[id]/reactions.get.ts`, `server/api/memos/[id]/reactions.post.ts`, `server/api/auth.post.ts`, `server/api/tags.get.ts`

- [ ] **Step 1: Create memos client utility**

```typescript
// server/utils/memos-client.ts
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
      return $fetch(`${options.baseUrl}/api/v1${path}`, {
        headers,
        query,
      })
    },
    async post(path: string, body: any) {
      return $fetch(`${options.baseUrl}/api/v1${path}`, {
        method: 'POST',
        headers,
        body,
      })
    },
  }
}

export function getMemosClient(event?: any) {
  const config = useRuntimeConfig()
  let token = config.memosAccessToken || ''

  // Check for user-provided token from request header
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
```

- [ ] **Step 2: Create GET /api/memos endpoint**

```typescript
// server/api/memos/index.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const client = getMemosClient(event)

  const params: Record<string, any> = {
    pageSize: Number(query.pageSize) || 20,
  }
  if (query.pageToken) {
    params.pageToken = query.pageToken
  }
  if (query.filter) {
    params.filter = query.filter
  }

  try {
    return await client.get('/memos', params)
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.message || 'Failed to fetch memos',
    })
  }
})
```

- [ ] **Step 3: Create GET /api/memos/:id endpoint**

```typescript
// server/api/memos/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const client = getMemosClient(event)

  try {
    return await client.get(`/memos/${id}`)
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.message || 'Failed to fetch memo',
    })
  }
})
```

- [ ] **Step 4: Create GET /api/memos/:id/comments**

```typescript
// server/api/memos/[id]/comments.get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const client = getMemosClient(event)

  try {
    return await client.get(`/memos/${id}/comments`)
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.message || 'Failed to fetch comments',
    })
  }
})
```

- [ ] **Step 5: Create POST /api/memos/:id/comments**

```typescript
// server/api/memos/[id]/comments.post.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const client = getMemosClient(event)

  try {
    return await client.post('/memos', {
      content: body.content,
      visibility: body.visibility || 'PUBLIC',
      parent: `memos/${id}`,
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.message || 'Failed to create comment',
    })
  }
})
```

- [ ] **Step 6: Create GET /api/memos/:id/reactions**

```typescript
// server/api/memos/[id]/reactions.get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const client = getMemosClient(event)

  try {
    return await client.get(`/memos/${id}/reactions`)
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.message || 'Failed to fetch reactions',
    })
  }
})
```

- [ ] **Step 7: Create POST /api/memos/:id/reactions**

```typescript
// server/api/memos/[id]/reactions.post.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const client = getMemosClient(event)

  try {
    return await client.post(`/memos/${id}/reactions`, {
      reactionType: body.reactionType,
      contentId: body.contentId,
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.message || 'Failed to upsert reaction',
    })
  }
})
```

- [ ] **Step 8: Create POST /api/auth**

```typescript
// server/api/auth.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  try {
    const response = await $fetch(`${config.memosBaseUrl}/api/v1/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        username: body.username,
        password: body.password,
      },
    })
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.data?.message || '登录失败',
    })
  }
})
```

- [ ] **Step 9: Create GET /api/tags**

```typescript
// server/api/tags.get.ts
export default defineEventHandler(async (event) => {
  const client = getMemosClient(event)
  const tagMap = new Map<string, number>()

  try {
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
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: 'Failed to aggregate tags',
    })
  }
})
```

- [ ] **Step 10: Test API endpoints manually**

```bash
pnpm dev
# Visit http://localhost:3000/api/memos?pageSize=2
# Visit http://localhost:3000/api/tags
```

Expected: JSON responses from Memos API.

- [ ] **Step 11: Commit**

```bash
git add server/
git commit -m "feat: add server api proxy layer for memos"
```

---

## Task 4: Composables + Stores

**Files:**
- Create: `app/composables/useAuth.ts`, `app/composables/useTheme.ts`, `app/composables/useMemos.ts`, `app/composables/useReaction.ts`, `app/stores/auth.ts`, `app/utils/time.ts`

- [ ] **Step 1: Create time utility**

```typescript
// app/utils/time.ts
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟前`
  if (diffHour < 24) return `${diffHour}小时前`
  if (diffDay < 7) return `${diffDay}天前`

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
```

- [ ] **Step 2: Create Pinia auth store**

```typescript
// app/stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    username: '' as string,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setAuth(token: string, username: string) {
      this.token = token
      this.username = username
      if (import.meta.client) {
        localStorage.setItem('memos_token', token)
        localStorage.setItem('memos_username', username)
      }
    },
    loadFromStorage() {
      if (import.meta.client) {
        this.token = localStorage.getItem('memos_token') || ''
        this.username = localStorage.getItem('memos_username') || ''
      }
    },
    logout() {
      this.token = ''
      this.username = ''
      if (import.meta.client) {
        localStorage.removeItem('memos_token')
        localStorage.removeItem('memos_username')
      }
    },
  },
})
```

- [ ] **Step 3: Create useAuth composable**

```typescript
// app/composables/useAuth.ts
export function useAuth() {
  const store = useAuthStore()
  const showLoginModal = ref(false)

  function requireAuth(): boolean {
    if (store.isLoggedIn) return true
    showLoginModal.value = true
    return false
  }

  async function login(username: string, password: string) {
    const response = await $fetch('/api/auth', {
      method: 'POST',
      body: { username, password },
    })
    const data = response as any
    store.setAuth(data.accessToken, username)
    showLoginModal.value = false
    return data
  }

  function logout() {
    store.logout()
  }

  return {
    isLoggedIn: computed(() => store.isLoggedIn),
    username: computed(() => store.username),
    showLoginModal,
    requireAuth,
    login,
    logout,
  }
}
```

- [ ] **Step 4: Create useTheme composable**

```typescript
// app/composables/useTheme.ts
export function useTheme() {
  const isDark = useState('theme-dark', () => false)

  function init() {
    if (!import.meta.client) return
    const saved = localStorage.getItem('memos_theme_mode')
    if (saved === 'dark') {
      isDark.value = true
      document.documentElement.classList.add('dark')
    }
  }

  function toggle() {
    isDark.value = !isDark.value
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', isDark.value)
      localStorage.setItem('memos_theme_mode', isDark.value ? 'dark' : 'light')
    }
  }

  return { isDark, init, toggle }
}
```

- [ ] **Step 5: Create useMemos composable**

```typescript
// app/composables/useMemos.ts
import type { MemosMemo, MemosListResponse } from '~/types/memo'

export function useMemos() {
  const memos = useState<MemosMemo[]>('memos-list', () => [])
  const loading = ref(false)
  const pageToken = ref('')
  const hasMore = ref(true)

  async function fetchMemos(initial = false) {
    if (loading.value || (!hasMore.value && !initial)) return
    loading.value = true

    try {
      const params: Record<string, any> = { pageSize: 20 }
      if (!initial && pageToken.value) {
        params.pageToken = pageToken.value
      }

      const data = await $fetch('/api/memos', { params }) as MemosListResponse

      if (initial) {
        memos.value = data.memos || []
      } else {
        memos.value.push(...(data.memos || []))
      }

      pageToken.value = data.nextPageToken || ''
      hasMore.value = !!data.nextPageToken
    } catch (error) {
      console.error('Failed to fetch memos:', error)
    } finally {
      loading.value = false
    }
  }

  function loadMore() {
    fetchMemos(false)
  }

  return { memos, loading, hasMore, fetchMemos, loadMore }
}
```

- [ ] **Step 6: Create useReaction composable**

```typescript
// app/composables/useReaction.ts
import type { MemosReaction } from '~/types/memo'

export function useReaction() {
  const { requireAuth } = useAuth()

  async function toggleReaction(memoId: string, contentId: string) {
    if (!requireAuth()) return null

    try {
      return await $fetch(`/api/memos/${memoId}/reactions`, {
        method: 'POST',
        body: { reactionType: 'REACTION_TYPE_UNSPECIFIED', contentId },
      })
    } catch (error) {
      console.error('Failed to toggle reaction:', error)
      return null
    }
  }

  function groupReactions(reactions: MemosReaction[]) {
    const groups: Record<string, { count: number; creators: string[] }> = {}
    for (const r of reactions) {
      if (!groups[r.contentId]) {
        groups[r.contentId] = { count: 0, creators: [] }
      }
      groups[r.contentId].count++
      groups[r.contentId].creators.push(r.creator)
    }
    return groups
  }

  return { toggleReaction, groupReactions }
}
```

- [ ] **Step 7: Commit**

```bash
git add app/composables/ app/stores/ app/utils/
git commit -m "feat: add composables, auth store, and utilities"
```

---

## Task 5: Styles Foundation

**Files:**
- Create: `app/assets/styles/variables.scss`, `app/assets/styles/main.scss`, `app/assets/styles/markdown.scss`

- [ ] **Step 1: Create CSS variables**

```scss
// app/assets/styles/variables.scss
// Light mode (default)
:root {
  --bg: #f8f5f0;
  --bg-card: #ffffff;
  --bg-card-hover: #fafafa;
  --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.06);
  --border: #e8e0d8;
  --border-style: 2px dashed;
  --text: #333333;
  --text-sub: #888888;
  --text-link: #5b7a9d;
  --accent: #5b7a9d;
  --accent-hover: #4a6680;
  --reaction-bg: #f0f0f0;
  --reaction-active-bg: #e8f0f8;
  --overlay: rgba(0, 0, 0, 0.5);
  --radius: 12px;
  --radius-sm: 8px;
  --max-width: 680px;
  --font-body: 'LXGW WenKai', 'Noto Sans SC', sans-serif;
  --font-heading: 'ZCOOL XiaoWei', serif;
  --font-mono: 'JetBrains Mono', monospace;
}

// Dark mode
html.dark {
  --bg: #1a1a1e;
  --bg-card: #242428;
  --bg-card-hover: #2a2a2e;
  --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.3);
  --border: #3a3a3e;
  --text: #e0e0e0;
  --text-sub: #888888;
  --text-link: #7ba4cc;
  --accent: #7ba4cc;
  --accent-hover: #92b8db;
  --reaction-bg: #333338;
  --reaction-active-bg: #2a3540;
  --overlay: rgba(0, 0, 0, 0.7);
}
```

- [ ] **Step 2: Create main styles**

```scss
// app/assets/styles/main.scss
@use 'variables' as *;

// Reset
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-body);
  color: var(--text);
  background: var(--bg);
  transition: background 0.3s, color 0.3s;
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
}

a {
  color: var(--text-link);
  text-decoration: none;
  &:hover { text-decoration: underline; }
}

img {
  max-width: 100%;
  height: auto;
}

// Layout
.page-container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1rem;
}

// Memo card (flatpaper paper texture)
.memo-card {
  background: var(--bg-card);
  border: var(--border-style) var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-card);
  transition: background 0.3s, box-shadow 0.3s;

  &:hover {
    background: var(--bg-card-hover);
  }
}

// Memo header (icefox style)
.memo-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.memo-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.memo-meta {
  flex: 1;
}

.memo-author {
  font-weight: 600;
  color: var(--text);
}

.memo-pin-badge {
  display: inline-block;
  background: var(--accent);
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  margin-left: 0.5rem;
}

.memo-time {
  font-size: 0.85rem;
  color: var(--text-sub);
}

// Tape decoration (flatpaper style)
.tape-decoration {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 20px;
    width: 60px;
    height: 12px;
    background: linear-gradient(135deg, rgba(232, 168, 124, 0.6), rgba(232, 168, 124, 0.3));
    border-radius: 2px;
    transform: rotate(-2deg);
  }
}

// Reaction bar
.reaction-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--border);
}

.reaction-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--reaction-bg);
  color: var(--text);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: var(--reaction-active-bg); }
  &.is-active { background: var(--reaction-active-bg); border-color: var(--accent); }
}

// Infinite scroll loading
.scroll-loading {
  text-align: center;
  padding: 2rem;
  color: var(--text-sub);
}

.scroll-nomore {
  text-align: center;
  padding: 2rem;
  color: var(--text-sub);
  font-size: 0.9rem;
}

// Responsive
@media (max-width: 768px) {
  .memo-card {
    padding: 1rem;
    border-radius: var(--radius-sm);
    margin-bottom: 1rem;
  }
  .memo-avatar {
    width: 32px;
    height: 32px;
  }
}
```

- [ ] **Step 3: Create markdown styles**

```scss
// app/assets/styles/markdown.scss
.markdown-body {
  line-height: 1.75;
  word-break: break-word;

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    margin: 1.5em 0 0.75em;
    line-height: 1.3;
  }
  h1 { font-size: 1.6em; }
  h2 { font-size: 1.4em; }
  h3 { font-size: 1.2em; }

  p { margin: 0.75em 0; }

  a {
    color: var(--text-link);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  code {
    font-family: var(--font-mono);
    background: var(--reaction-bg);
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
  }

  pre {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 1rem;
    overflow-x: auto;
    margin: 1em 0;

    code {
      background: none;
      padding: 0;
    }
  }

  blockquote {
    border-left: 3px solid var(--accent);
    padding-left: 1rem;
    margin: 1em 0;
    color: var(--text-sub);
  }

  ul, ol {
    padding-left: 1.5em;
    margin: 0.75em 0;
  }

  img {
    border-radius: var(--radius-sm);
    margin: 0.5em 0;
    cursor: zoom-in;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;

    th, td {
      border: 1px solid var(--border);
      padding: 0.5rem 0.75rem;
      text-align: left;
    }
    th { background: var(--reaction-bg); }
  }

  // Task lists
  .task-list-item {
    list-style: none;
    margin-left: -1.5em;
    input[type="checkbox"] {
      margin-right: 0.5em;
    }
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add app/assets/styles/
git commit -m "feat: add scss styles - variables, layout, markdown, paper texture"
```

---

## Task 6: UI Components

**Files:**
- Create: `app/components/ui/Icon.vue`, `app/components/ui/DarkModeToggle.vue`, `app/components/ui/MarkdownRenderer.vue`, `app/components/ui/ImageLightbox.vue`, `app/components/ui/InfiniteScroll.vue`

- [ ] **Step 1: Create Icon component**

```vue
<!-- app/components/ui/Icon.vue -->
<template>
  <Icon :icon="name" :width="size" :height="size" />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  name: string
  size?: number | string
}>()
</script>
```

- [ ] **Step 2: Create DarkModeToggle**

```vue
<!-- app/components/ui/DarkModeToggle.vue -->
<template>
  <button class="dark-mode-toggle" @click="toggle" :title="isDark ? '切换到浅色模式' : '切换到深色模式'">
    <UiIcon :name="isDark ? 'ph:sun' : 'ph:moon'" :size="20" />
  </button>
</template>

<script setup lang="ts">
const { isDark, toggle } = useTheme()
</script>

<style scoped>
.dark-mode-toggle {
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dark-mode-toggle:hover {
  background: var(--reaction-bg);
}
</style>
```

- [ ] **Step 3: Create MarkdownRenderer**

```vue
<!-- app/components/ui/MarkdownRenderer.vue -->
<template>
  <div class="markdown-body" v-html="renderedContent" />
</template>

<script setup lang="ts">
import { renderMarkdown } from '~/utils/markdown'

const props = defineProps<{
  content: string
}>()

const renderedContent = computed(() => renderMarkdown(props.content))
</script>
```

- [ ] **Step 4: Create markdown utility**

```typescript
// app/utils/markdown.ts
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

// Task list support
md.core.ruler.after('inline', 'task-lists', (state) => {
  const tokens = state.tokens
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== 'inline') continue
    const content = tokens[i].content
    if (/^\[[ x]\]\s/.test(content)) {
      const checked = content[1] === 'x'
      const text = content.slice(4)
      tokens[i].content = text
      tokens[i].children = [
        Object.assign(new state.Token('html_inline', '', 0), {
          content: `<input type="checkbox" disabled ${checked ? 'checked' : ''}> `,
        }),
        ...md.utils.arrayReplaceAt(tokens[i].children!, 0, md.parseInline(text, state.env)[0].children!),
      ]
    }
  }
})

export function renderMarkdown(content: string): string {
  return md.render(content)
}
```

- [ ] **Step 5: Create ImageLightbox (using medium-zoom)**

```vue
<!-- app/components/ui/ImageLightbox.vue -->
<template>
  <div ref="container">
    <slot />
  </div>
</template>

<script setup lang="ts">
import mediumZoom from 'medium-zoom'

const container = ref<HTMLElement>()

onMounted(() => {
  if (!import.meta.client) return
  const config = useAppConfig() as any
  if (config?.theme?.lightbox?.enabled === false) return

  nextTick(() => {
    if (container.value) {
      mediumZoom(container.value.querySelectorAll('.markdown-body img'), {
        background: 'rgba(0,0,0,0.8)',
      })
    }
  })
})
</script>
```

- [ ] **Step 6: Create InfiniteScroll**

```vue
<!-- app/components/ui/InfiniteScroll.vue -->
<template>
  <div ref="sentinel" class="scroll-sentinel" />
</template>

<script setup lang="ts">
const emit = defineEmits<{
  intersect: []
}>()

const sentinel = ref<HTMLElement>()

onMounted(() => {
  if (!sentinel.value) return
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        emit('intersect')
      }
    },
    { rootMargin: '100px' }
  )
  observer.observe(sentinel.value)

  onUnmounted(() => observer.disconnect())
})
</script>

<style scoped>
.scroll-sentinel {
  height: 1px;
}
</style>
```

- [ ] **Step 7: Commit**

```bash
git add app/components/ui/ app/utils/markdown.ts
git commit -m "feat: add ui components - icon, dark mode, markdown, lightbox, infinite scroll"
```

---

## Task 7: Memo Components

**Files:**
- Create: `app/components/memo/MemoTime.vue`, `app/components/memo/MemoLocation.vue`, `app/components/memo/MemoAttachment.vue`, `app/components/memo/MemoCard.vue`, `app/components/memo/MemoList.vue`, `app/components/memo/MemoDetail.vue`

- [ ] **Step 1: Create MemoTime**

```vue
<!-- app/components/memo/MemoTime.vue -->
<template>
  <span class="memo-time">{{ formatRelativeTime(time) }}</span>
</template>

<script setup lang="ts">
defineProps<{ time: string }>()
</script>
```

- [ ] **Step 2: Create MemoLocation**

```vue
<!-- app/components/memo/MemoLocation.vue -->
<template>
  <div class="memo-location" v-if="location?.placeholder">
    <UiIcon name="ph:map-pin" :size="14" />
    <span>{{ location.placeholder }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  location: { placeholder: string; latitude: number; longitude: number }
}>()
</script>

<style scoped>
.memo-location {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--text-sub);
  margin-top: 0.75rem;
}
</style>
```

- [ ] **Step 3: Create MemoAttachment**

```vue
<!-- app/components/memo/MemoAttachment.vue -->
<template>
  <div class="memo-attachments" :class="'grid-' + Math.min(attachments.length, 3)">
    <div v-for="att in attachments" :key="att.name" class="attachment-item">
      <img
        v-if="isImage(att.type)"
        :src="getAttachmentUrl(att)"
        :alt="att.filename"
        loading="lazy"
        class="attachment-image"
      />
      <video
        v-else-if="isVideo(att.type)"
        :src="getAttachmentUrl(att)"
        controls
        preload="metadata"
        class="attachment-video"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemosAttachment } from '~/types/memo'

const props = defineProps<{ attachments: MemosAttachment[] }>()

function isImage(type: string) {
  return type?.startsWith('image/')
}

function isVideo(type: string) {
  return type?.startsWith('video/')
}

function getAttachmentUrl(att: MemosAttachment) {
  if (att.externalLink) return att.externalLink
  const config = useRuntimeConfig()
  return `${config.memosBaseUrl}/api/v1/${att.name}/content`
}
</script>

<style scoped>
.memo-attachments {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.grid-1 { grid-template-columns: 1fr; }
.grid-2 { grid-template-columns: 1fr 1fr; }
.grid-3 { grid-template-columns: 1fr 1fr 1fr; }

.attachment-image {
  width: 100%;
  border-radius: var(--radius-sm);
  cursor: zoom-in;
  object-fit: cover;
  aspect-ratio: 1;
}

.attachment-video {
  width: 100%;
  border-radius: var(--radius-sm);
}
</style>
```

- [ ] **Step 4: Create MemoCard**

```vue
<!-- app/components/memo/MemoCard.vue -->
<template>
  <article class="memo-card" :class="{ 'tape-decoration': config.theme.paper.tapeDecoration }">
    <header class="memo-header">
      <img :src="avatarUrl" class="memo-avatar" :alt="memo.creator" />
      <div class="memo-meta">
        <span class="memo-author">{{ memo.creator }}</span>
        <span v-if="memo.pinned" class="memo-pin-badge">置顶</span>
      </div>
      <MemoTime :time="memo.createTime" />
    </header>

    <div class="memo-content">
      <UiImageLightbox>
        <UiMarkdownRenderer :content="memo.content" />
      </UiImageLightbox>
    </div>

    <MemoAttachment
      v-if="memo.attachments?.length"
      :attachments="memo.attachments"
    />

    <MemoLocation v-if="memo.location" :location="memo.location" />

    <ReactionReactionBar
      :memo-id="memo.name"
      :reactions="memo.reactions || []"
    />

    <NuxtLink :to="`/memo/${memoId}`" class="memo-detail-link" v-if="showDetailLink">
      查看详情 →
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { MemosMemo } from '~/types/memo'

const props = withDefaults(defineProps<{
  memo: MemosMemo
  showDetailLink?: boolean
}>(), {
  showDetailLink: false,
})

const config = useAppConfig() as any

const memoId = computed(() => {
  // Extract ID from "memos/{id}"
  return props.memo.name?.replace('memos/', '') || ''
})

const avatarUrl = computed(() => {
  // Generate gravatar from creator name
  return `https://www.gravatar.com/avatar/${hashCode(props.memo.creator)}?d=identicon&s=80`
})

function hashCode(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash).toString(16)
}
</script>

<style scoped>
.memo-detail-link {
  display: inline-block;
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-link);
}
</style>
```

- [ ] **Step 5: Create MemoList**

```vue
<!-- app/components/memo/MemoList.vue -->
<template>
  <div class="memo-list">
    <MemoMemoCard
      v-for="memo in memos"
      :key="memo.name"
      :memo="memo"
      show-detail-link
    />

    <div v-if="loading" class="scroll-loading">加载中...</div>
    <div v-else-if="!hasMore && memos.length > 0" class="scroll-nomore">没有更多了</div>

    <UiInfiniteScroll v-if="hasMore" @intersect="loadMore" />
  </div>
</template>

<script setup lang="ts">
const { memos, loading, hasMore, loadMore } = useMemos()
</script>
```

- [ ] **Step 6: Create MemoDetail**

```vue
<!-- app/components/memo/MemoDetail.vue -->
<template>
  <div class="memo-detail">
    <MemoMemoCard :memo="memo" />

    <div class="comments-section">
      <CommentCommentList :memo-id="memoId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemosMemo } from '~/types/memo'

const props = defineProps<{ memo: MemosMemo }>()

const memoId = computed(() => props.memo.name?.replace('memos/', '') || '')
</script>

<style scoped>
.comments-section {
  margin-top: 1.5rem;
}
</style>
```

- [ ] **Step 7: Commit**

```bash
git add app/components/memo/
git commit -m "feat: add memo components - card, list, detail, attachment, location, time"
```

---

## Task 8: Reaction + Comment Components

**Files:**
- Create: `app/components/reaction/ReactionBar.vue`, `app/components/reaction/ReactionPicker.vue`, `app/components/comment/CommentList.vue`, `app/components/comment/CommentItem.vue`, `app/components/comment/CommentForm.vue`

- [ ] **Step 1: Create ReactionPicker**

```vue
<!-- app/components/reaction/ReactionPicker.vue -->
<template>
  <div class="reaction-picker" @click.stop>
    <div class="picker-emojis">
      <button
        v-for="emoji in quickEmojis"
        :key="emoji"
        class="emoji-btn"
        @click="$emit('select', emoji)"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ select: [emoji: string] }>()

const quickEmojis = ['👍', '❤️', '😊', '😂', '🤔', '👏', '🎉', '🔥']
</script>

<style scoped>
.reaction-picker {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.5rem;
  box-shadow: var(--shadow-card);
  z-index: 10;
}
.picker-emojis {
  display: flex;
  gap: 0.25rem;
}
.emoji-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.2s;
}
.emoji-btn:hover {
  background: var(--reaction-bg);
}
</style>
```

- [ ] **Step 2: Create ReactionBar**

```vue
<!-- app/components/reaction/ReactionBar.vue -->
<template>
  <div class="reaction-bar" v-if="grouped.length > 0 || showPicker">
    <button
      v-for="g in grouped"
      :key="g.contentId"
      class="reaction-chip"
      @click="handleToggle(g.contentId)"
    >
      {{ g.contentId }} {{ g.count }}
    </button>

    <div class="reaction-add-wrapper" style="position: relative;">
      <button class="reaction-add" @click="showPicker = !showPicker">
        <UiIcon name="ph:smiley-plus" :size="16" />
      </button>
      <ReactionReactionPicker
        v-if="showPicker"
        @select="handleAdd"
        @click="showPicker = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemosReaction } from '~/types/memo'

const props = defineProps<{
  memoId: string
  reactions: MemosReaction[]
}>()

const { toggleReaction, groupReactions } = useReaction()
const { requireAuth } = useAuth()
const showPicker = ref(false)

const grouped = computed(() => {
  const groups = groupReactions(props.reactions)
  return Object.entries(groups).map(([contentId, data]) => ({
    contentId,
    count: data.count,
  }))
})

async function handleToggle(contentId: string) {
  await toggleReaction(props.memoId, contentId)
}

async function handleAdd(emoji: string) {
  showPicker.value = false
  await toggleReaction(props.memoId, emoji)
}
</script>
```

- [ ] **Step 3: Create CommentItem**

```vue
<!-- app/components/comment/CommentItem.vue -->
<template>
  <div class="comment-item">
    <img :src="avatarUrl" class="comment-avatar" :alt="comment.creator" />
    <div class="comment-body">
      <span class="comment-author">{{ comment.creator }}</span>
      <UiMarkdownRenderer :content="comment.content" />
      <span class="comment-time">{{ formatRelativeTime(comment.createTime) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemosMemo } from '~/types/memo'

const props = defineProps<{ comment: MemosMemo }>()

const avatarUrl = computed(() => {
  return `https://www.gravatar.com/avatar/${hashCode(props.comment.creator)}?d=identicon&s=32`
})

function hashCode(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(16)
}
</script>

<style scoped>
.comment-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px dashed var(--border);
}
.comment-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}
.comment-author {
  font-weight: 600;
  font-size: 0.85rem;
  margin-right: 0.5rem;
}
.comment-time {
  font-size: 0.75rem;
  color: var(--text-sub);
  margin-left: 0.5rem;
}
</style>
```

- [ ] **Step 4: Create CommentForm**

```vue
<!-- app/components/comment/CommentForm.vue -->
<template>
  <div class="comment-form">
    <div class="comment-form-inputs" v-if="!isLoggedIn">
      <input v-model="authorName" placeholder="昵称" required />
      <input v-model="authorEmail" type="email" placeholder="邮箱" required />
    </div>
    <div class="comment-form-main">
      <textarea
        v-model="content"
        placeholder="写下你的评论..."
        rows="2"
        required
      />
      <button class="comment-submit" @click="submit" :disabled="submitting">
        {{ submitting ? '提交中...' : '发表' }}
      </button>
    </div>
    <p v-if="error" class="comment-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ memoId: string }>()
const emit = defineEmits<{ posted: [] }>()

const { isLoggedIn, login } = useAuth()

const authorName = ref('')
const authorEmail = ref('')
const content = ref('')
const submitting = ref(false)
const error = ref('')

async function submit() {
  if (!content.value.trim()) return
  submitting.value = true
  error.value = ''

  try {
    // Login first if not authenticated
    if (!isLoggedIn.value) {
      if (!authorName.value || !authorEmail.value) {
        error.value = '请填写昵称和邮箱'
        submitting.value = false
        return
      }
      await login(authorName.value, authorEmail.value)
    }

    await $fetch(`/api/memos/${props.memoId}/comments`, {
      method: 'POST',
      body: { content: content.value, visibility: 'PUBLIC' },
    })

    content.value = ''
    emit('posted')
  } catch (e: any) {
    error.value = e.data?.message || '提交失败'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.comment-form {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--border);
}
.comment-form-inputs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.comment-form-inputs input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--text);
  font-size: 0.85rem;
}
.comment-form-main {
  display: flex;
  gap: 0.5rem;
}
textarea {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  resize: none;
}
.comment-submit {
  padding: 0.5rem 1rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  align-self: flex-end;
  font-size: 0.85rem;
}
.comment-error {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
</style>
```

- [ ] **Step 5: Create CommentList**

```vue
<!-- app/components/comment/CommentList.vue -->
<template>
  <div class="comment-section">
    <button class="comment-toggle" @click="expanded = !expanded" v-if="!expanded">
      💬 {{ count }}条评论 ▾
    </button>

    <div v-if="expanded">
      <CommentCommentItem
        v-for="comment in comments"
        :key="comment.name"
        :comment="comment"
      />

      <CommentCommentForm :memo-id="memoId" @posted="fetchComments" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemosMemo } from '~/types/memo'

const props = defineProps<{
  memoId: string
  count: number
}>()

const expanded = ref(false)
const comments = ref<MemosMemo[]>([])

async function fetchComments() {
  try {
    const data = await $fetch(`/api/memos/${props.memoId}/comments`) as any
    comments.value = data.memos || []
  } catch (e) {
    console.error('Failed to fetch comments:', e)
  }
}

watch(expanded, (val) => {
  if (val && comments.value.length === 0) {
    fetchComments()
  }
})
</script>

<style scoped>
.comment-toggle {
  background: none;
  border: none;
  color: var(--text-sub);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.5rem 0;
}
</style>
```

- [ ] **Step 6: Commit**

```bash
git add app/components/reaction/ app/components/comment/
git commit -m "feat: add reaction and comment components"
```

---

## Task 9: Auth + Layout Components

**Files:**
- Create: `app/components/auth/LoginModal.vue`, `app/components/layout/AppHeader.vue`, `app/components/layout/AppFooter.vue`

- [ ] **Step 1: Create LoginModal**

```vue
<!-- app/components/auth/LoginModal.vue -->
<template>
  <Teleport to="body">
    <div v-if="visible" class="login-overlay" @click.self="$emit('close')">
      <div class="login-modal memo-card">
        <h3>登录 Memos</h3>
        <form @submit.prevent="handleLogin">
          <input v-model="username" placeholder="用户名" required class="login-input" />
          <input v-model="password" type="password" placeholder="密码" required class="login-input" />
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
          <p v-if="error" class="login-error">{{ error }}</p>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>()
defineEmits<{ close: [] }>()

const { login } = useAuth()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await login(username.value, password.value)
  } catch (e: any) {
    error.value = e.data?.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.login-modal {
  width: 90%;
  max-width: 380px;
}
.login-modal h3 {
  margin-bottom: 1rem;
}
.login-input {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
}
.login-btn {
  width: 100%;
  padding: 0.6rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 1rem;
}
.login-error {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
</style>
```

- [ ] **Step 2: Create AppHeader**

```vue
<!-- app/components/layout/AppHeader.vue -->
<template>
  <header class="app-header">
    <div class="header-inner page-container">
      <NuxtLink to="/" class="header-logo">
        <span class="header-title">{{ config.site.title }}</span>
      </NuxtLink>
      <nav class="header-nav">
        <NuxtLink to="/tags" class="header-link">
          <UiIcon name="ph:tag" :size="18" />
        </NuxtLink>
        <NuxtLink to="/about" class="header-link">
          <UiIcon name="ph:user" :size="18" />
        </NuxtLink>
        <UiDarkModeToggle />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const config = useAppConfig() as any
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg);
  border-bottom: 1px dashed var(--border);
  backdrop-filter: blur(10px);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}
.header-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: var(--text);
  text-decoration: none;
}
.header-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.header-link {
  color: var(--text-sub);
  padding: 0.4rem;
  border-radius: 50%;
  display: flex;
  transition: background 0.2s;
}
.header-link:hover {
  background: var(--reaction-bg);
  text-decoration: none;
  color: var(--text);
}
</style>
```

- [ ] **Step 3: Create AppFooter**

```vue
<!-- app/components/layout/AppFooter.vue -->
<template>
  <footer class="app-footer">
    <div class="footer-inner page-container">
      <p>{{ config.footer.copyright }}</p>
      <p v-if="config.footer.beian">
        <a :href="'https://beian.miit.gov.cn/'" target="_blank">{{ config.footer.beian }}</a>
      </p>
      <p v-if="config.footer.powered">Powered by <a href="https://usememos.com" target="_blank">Memos</a></p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useAppConfig() as any
</script>

<style scoped>
.app-footer {
  border-top: 1px dashed var(--border);
  padding: 2rem 0;
  text-align: center;
  color: var(--text-sub);
  font-size: 0.85rem;
}
.footer-inner {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}
</style>
```

- [ ] **Step 4: Commit**

```bash
git add app/components/auth/ app/components/layout/
git commit -m "feat: add login modal, header, and footer components"
```

---

## Task 10: Pages

**Files:**
- Create: `app/pages/index.vue`, `app/pages/memo/[id].vue`, `app/pages/tags/index.vue`, `app/pages/tags/[tag].vue`, `app/pages/about.vue`

- [ ] **Step 1: Create homepage**

```vue
<!-- app/pages/index.vue -->
<template>
  <div class="page-container">
    <MemoMemoList />
  </div>
</template>

<script setup lang="ts">
const config = useAppConfig() as any
const { fetchMemos } = useMemos()

useHead({
  title: config.site.title,
})

onMounted(() => {
  fetchMemos(true)
})
</script>
```

- [ ] **Step 2: Create memo detail page**

```vue
<!-- app/pages/memo/[id].vue -->
<template>
  <div class="page-container">
    <div v-if="pending" class="scroll-loading">加载中...</div>
    <div v-else-if="error" class="scroll-loading">内容不存在</div>
    <MemoMemoDetail v-else-if="memo" :memo="memo" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { data: memo, pending, error } = await useFetch(`/api/memos/${id}`)

useHead({
  title: (memo.value as any)?.snippet || 'Memo 详情',
})
</script>
```

- [ ] **Step 3: Create tags index page**

```vue
<!-- app/pages/tags/index.vue -->
<template>
  <div class="page-container">
    <h1 class="tags-title">标签</h1>
    <div class="tags-cloud" v-if="tags">
      <NuxtLink
        v-for="tag in tags"
        :key="tag.name"
        :to="`/tags/${tag.name}`"
        class="tag-chip"
      >
        #{{ tag.name }}
        <span class="tag-count">{{ tag.count }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: tags } = await useFetch('/api/tags')

useHead({ title: '标签' })
</script>

<style scoped>
.tags-title {
  font-family: var(--font-heading);
  margin-bottom: 1.5rem;
}
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 1rem;
  border: var(--border-style) var(--border);
  border-radius: 999px;
  color: var(--text);
  text-decoration: none;
  transition: all 0.2s;
}
.tag-chip:hover {
  background: var(--reaction-active-bg);
  text-decoration: none;
}
.tag-count {
  font-size: 0.8rem;
  color: var(--text-sub);
}
</style>
```

- [ ] **Step 4: Create tag filter page**

```vue
<!-- app/pages/tags/[tag].vue -->
<template>
  <div class="page-container">
    <h1 class="tags-title">#{{ tag }}</h1>
    <MemoMemoList :filter="`tag in [\\\"${tag}\\\"]`" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const tag = route.params.tag as string

useHead({ title: `#${tag}` })
</script>
```

- [ ] **Step 5: Create about page**

```vue
<!-- app/pages/about.vue -->
<template>
  <div class="page-container">
    <div class="memo-card">
      <h1>关于</h1>
      <p>这是一个基于 Memos 的个人博客。</p>
      <p>主题风格融合了 icefox 和 flatpaper 的设计元素。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '关于' })
</script>
```

- [ ] **Step 6: Commit**

```bash
git add app/pages/
git commit -m "feat: add all pages - homepage, detail, tags, about"
```

---

## Task 11: App Root + Error Page

**Files:**
- Modify: `app/app.vue`, Create: `app/error.vue`

- [ ] **Step 1: Update app.vue with full layout**

```vue
<!-- app/app.vue -->
<template>
  <div id="app">
    <LayoutAppHeader />

    <!-- Theme restore script (avoids flash) -->
    <Head>
      <Script>
        (function() {
          var t = localStorage.getItem('memos_theme_mode');
          if (t === 'dark') document.documentElement.classList.add('dark');
        })();
      </Script>
    </Head>

    <main>
      <NuxtPage />
    </main>

    <LayoutAppFooter />

    <AuthLoginModal
      :visible="showLoginModal"
      @close="showLoginModal = false"
    />
  </div>
</template>

<script setup lang="ts">
const { showLoginModal } = useAuth()
const { init: initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1;
  padding: 1.5rem 0;
}
</style>
```

- [ ] **Step 2: Create error.vue**

```vue
<!-- app/error.vue -->
<template>
  <div class="page-container error-page">
    <div class="memo-card" style="text-align: center;">
      <h1>{{ error?.statusCode || 500 }}</h1>
      <p>{{ error?.message || '出错了' }}</p>
      <button class="error-btn" @click="clearError">返回首页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ error: any }>()

function clearError() {
  clearNuxtError({ redirect: '/' })
}
</script>

<style scoped>
.error-page {
  padding-top: 4rem;
  text-align: center;
}
.error-btn {
  margin-top: 1rem;
  padding: 0.6rem 1.5rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add app/app.vue app/error.vue
git commit -m "feat: add root layout with theme restore and error page"
```

---

## Task 12: Final Integration + Verify

**Files:** No new files. Verify and fix.

- [ ] **Step 1: Start dev server and verify all pages**

```bash
pnpm dev
```

Verify:
- Homepage loads with memo cards from Memos API
- Click memo → detail page loads
- Tags page shows aggregated tags
- Dark mode toggle works
- Reaction buttons visible
- Comment section expandable
- Login modal appears on interaction
- Responsive on mobile viewport

- [ ] **Step 2: Fix any issues found**

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete memos nuxt blog with icefox+flatpaper style"
```

---

## Self-Review Checklist

1. **Spec coverage**: All 12 spec sections covered by tasks
2. **Placeholder scan**: No TBD/TODO found
3. **Type consistency**: `MemosMemo`, `MemosReaction`, `MemosAttachment` types used consistently across all tasks
4. **File paths**: All file paths exact and consistent with file map
