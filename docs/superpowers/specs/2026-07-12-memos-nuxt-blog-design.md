# Memos Nuxt Blog 设计文档

> **日期**: 2026-07-12
> **状态**: 已批准
> **技术栈**: Nuxt 4 + pnpm + TypeScript + SCSS
> **数据源**: Memos 0.29.1 API

---

## 1. 项目概述

### 目标

构建一个 Nuxt 4 博客，视觉风格融合 **icefox**（社交媒体信息流布局）和 **flatpaper**（纸张手帐质感），数据源为独立部署的 Memos 0.29.1 实例（`https://mm.2005815.xyz/`）。

### 核心特性

- **朋友圈风格信息流** — icefox 的头像+内容+时间布局
- **纸张手帐质感** — flatpaper 的虚线边框、胶带装饰、暖色调
- **Memos Reactions** — 替代 icefox 的自定义点赞系统
- **Memos Comments** — 使用 Memos 子 memo 作为评论
- **Markdown 渲染** — 完整渲染 Memos 的 Markdown 内容
- **明暗模式** — localStorage 持久化，避免闪烁
- **响应式布局** — 桌面/平板/手机适配
- **Iconify 图标** — 统一图标库
- **渐进式登录** — 浏览免登录，交互需登录

### 不包含

- 游戏页面
- 自定义点赞系统（替换为 Memos Reactions）
- 后台管理页面
- 纯静态配置页面

---

## 2. 架构设计

### 2.1 架构方案：服务端代理

```
浏览器 ←→ Nuxt Server (SSR/SPA) ←→ Memos API (https://mm.2005815.xyz)
              ↓
         Server API 代理层
         - Token 安全（.env 注入）
         - 请求缓存
         - 内容过滤（PUBLIC/ALL）
```

**选择理由**：
- Token 不暴露给浏览器端
- Server API 可做缓存减少 Memos API 压力
- 完美支持混合渲染（SSR 首屏 + 客户端分页）
- Nuxt 4 生态最成熟的用法

### 2.2 渲染策略

| 页面 | 渲染方式 | 说明 |
|------|----------|------|
| 首页（memo 列表） | SSR（首屏）+ SPA（分页） | 首屏 20 条 SSR 渲染，滚动加载走 SPA |
| Memo 详情页 | SSR | 完整内容 + 评论 + reactions |
| 标签列表页 | SSR | 从 memos 聚合标签 |
| 按标签筛选 | SSR + SPA 分页 | 类似首页 |
| 关于页 | SSR | 静态内容 |

### 2.3 环境变量

```bash
# .env
MEMOS_BASE_URL=https://mm.2005815.xyz
MEMOS_ACCESS_TOKEN=           # 可选，有则可访问非公开内容
```

---

## 3. 项目结构

参考 [blog-v3](https://github.com/L33Z22L11/blog-v3) 的 Nuxt 4 目录结构：

```
memos-blog/
├── app/                          # 前端
│   ├── assets/
│   │   └── styles/
│   │       ├── main.scss         # 全局样式
│   │       ├── variables.scss    # CSS 变量（主题色、间距、纸张质感）
│   │       └── markdown.scss     # Markdown 渲染样式
│   ├── components/
│   │   ├── layout/               # 布局组件
│   │   │   ├── AppHeader.vue     # 顶部导航
│   │   │   ├── AppFooter.vue     # 页脚
│   │   │   └── AppSidebar.vue    # 侧边栏
│   │   ├── memo/                 # Memo 组件
│   │   │   ├── MemoCard.vue      # 单条 memo 卡片
│   │   │   ├── MemoList.vue      # memo 列表（无限滚动）
│   │   │   ├── MemoDetail.vue    # memo 详情页主体
│   │   │   ├── MemoAttachment.vue # 附件渲染
│   │   │   ├── MemoLocation.vue  # 位置信息
│   │   │   └── MemoTime.vue      # 智能时间
│   │   ├── reaction/             # 表情反应
│   │   │   ├── ReactionBar.vue   # reaction 列表 + 添加
│   │   │   └── ReactionPicker.vue # emoji 选择器
│   │   ├── comment/              # 评论
│   │   │   ├── CommentList.vue   # 评论列表
│   │   │   ├── CommentItem.vue   # 单条评论
│   │   │   └── CommentForm.vue   # 评论输入
│   │   ├── auth/                 # 认证
│   │   │   └── LoginModal.vue    # 登录弹窗
│   │   └── ui/                   # 通用 UI
│   │       ├── DarkModeToggle.vue # 明暗切换
│   │       ├── InfiniteScroll.vue # 无限滚动
│   │       ├── MarkdownRenderer.vue # Markdown 渲染
│   │       └── Icon.vue          # Iconify 封装
│   ├── composables/
│   │   ├── useMemos.ts           # memo 数据获取
│   │   ├── useAuth.ts            # 认证状态
│   │   ├── useTheme.ts           # 明暗模式
│   │   └── useReaction.ts        # reaction 操作
│   ├── pages/
│   │   ├── index.vue             # 首页
│   │   ├── memo/[id].vue         # 详情页
│   │   ├── tags/
│   │   │   ├── index.vue         # 标签列表
│   │   │   └── [tag].vue         # 按标签筛选
│   │   └── about.vue             # 关于（预留）
│   ├── plugins/
│   │   └── markdown.ts           # Markdown 插件
│   ├── stores/
│   │   └── auth.ts               # Pinia 认证状态
│   ├── types/
│   │   └── memo.ts               # Memos API 类型
│   ├── utils/
│   │   ├── time.ts               # 时间工具
│   │   └── markdown.ts           # Markdown 工具
│   ├── app.vue                   # 根布局
│   └── error.vue                 # 错误页
├── server/
│   ├── api/
│   │   ├── memos/
│   │   │   ├── index.get.ts      # GET /api/memos
│   │   │   ├── [id].get.ts       # GET /api/memos/:id
│   │   │   ├── [id]/
│   │   │   │   ├── comments.get.ts
│   │   │   │   ├── comments.post.ts
│   │   │   │   ├── reactions.get.ts
│   │   │   │   └── reactions.post.ts
│   │   │   └── auth.post.ts      # POST /api/auth
│   │   └── tags.get.ts           # GET /api/tags
│   └── utils/
│       └── memos-client.ts       # Memos API 客户端
├── public/
├── config.ts                     # 集中配置
├── nuxt.config.ts
├── package.json
├── tsconfig.json
└── .env
```

---

## 4. 数据流设计

### 4.1 Server API 代理映射

| Nuxt Server API | Memos API | 方法 | 认证 |
|---|---|---|---|
| `/api/memos` | `/api/v1/memos` | GET | 否（PUBLIC） |
| `/api/memos/:id` | `/api/v1/memos/:id` | GET | 否 |
| `/api/memos/:id/comments` | `/api/v1/memos/:id/comments` | GET | 否 |
| `/api/memos/:id/reactions` | `/api/v1/memos/:id/reactions` | GET | 否 |
| `/api/memos/:id/reactions` | `/api/v1/memos/:id/reactions` | POST | 是 |
| `/api/memos/:id/comments` | `/api/v1/memos` (parent=:id) | POST | 是 |
| `/api/auth` | `/api/v1/auth/signin` | POST | 否 |
| `/api/tags` | 聚合自 memos | GET | 否 |

### 4.2 Server API 客户端封装

```typescript
// server/utils/memos-client.ts
interface MemosClientOptions {
  baseUrl: string
  token?: string
}

function createMemosClient(options: MemosClientOptions) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`
  }

  return {
    async get(path: string) {
      return $fetch(`${options.baseUrl}/api/v1${path}`, { headers })
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

// 在 Server API 中使用：
// const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
// const client = createMemosClient({ baseUrl: MEMOS_BASE_URL, token })
```

### 4.3 数据获取策略

**首页信息流**：
1. SSR：`useAsyncData('memos', () => $fetch('/api/memos?pageSize=20'))` 获取首屏数据
2. 滚动到底：`useMemos()` composable 调用 `loadMore()`，使用 `pageToken` 分页
3. 新数据追加到列表，触发 Alpine/Vue 响应式更新

**Memo 详情页**：
1. SSR：`useAsyncData` 获取完整 memo + comments + reactions
2. 一次性加载所有数据，无需分页

**标签页**：
1. SSR：Server 端遍历所有 memo，聚合去重 tags
2. 返回 `{ tag: string, count: number }[]`

### 4.4 认证流程

```
1. 用户点击 reaction/评论
2. 检查 localStorage → Pinia store 中的 token
3. 无 token → 显示 LoginModal
4. 用户输入账号密码 → POST /api/auth
5. Server 调用 Memos SignIn → 返回 { token }
6. 前端存储到 localStorage + Pinia store
7. 后续请求通过 header 携带 token
8. Token 过期（401）→ 自动清除 → 只显示 PUBLIC 内容
```

---

## 5. 视觉设计

### 5.1 设计方向

**"手帐朋友圈"** — icefox 的社交媒体信息流布局 + flatpaper 的纸张手帐质感。

### 5.2 色彩方案

```scss
// 浅色模式
$light-bg: #f8f5f0;           // 暖白纸张底色
$light-card: #ffffff;          // 卡片白
$light-card-shadow: rgba(0, 0, 0, 0.06);
$light-border: #e8e0d8;       // 虚线边框色
$light-text: #333333;
$light-text-sub: #888888;
$light-accent: #5b7a9d;       // 主色（蓝灰）

// 深色模式
$dark-bg: #1a1a1e;
$dark-card: #242428;
$dark-card-shadow: rgba(0, 0, 0, 0.3);
$dark-border: #3a3a3e;
$dark-text: #e0e0e0;
$dark-text-sub: #888888;
$dark-accent: #7ba4cc;
```

### 5.3 卡片布局（融合两种风格）

```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐   ← flatpaper 虚线边框
│  ┌──────────────────────────┐  │
│  │ 🎨 胶带装饰（可选）       │  │   ← flatpaper 胶带/贴纸
│  └──────────────────────────┘  │
│                                │
│  [头像] 作者名    ·  3小时前    │   ← icefox 朋友圈布局
│         置顶/广告标识          │
│                                │
│  Markdown 内容渲染...          │
│  [图片九宫格] / [视频播放器]    │   ← icefox 附件布局
│                                │
│  📍 位置信息                   │   ← Memos location 字段
│                                │
│  ┌────────────────────────┐   │
│  │ 😊 👍 ❤️  + 添加反应   │   │   ← Memos Reactions
│  └────────────────────────┘   │
│                                │
│  💬 N条评论  ▾ 展开           │   ← Memos Comments（折叠）
│                                │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │   ← flatpaper 分隔线
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
```

### 5.4 字体

```scss
$font-body: 'LXGW WenKai', 'Noto Sans SC', sans-serif;   // 正文（手帐感）
$font-heading: 'ZCOOL XiaoWei', serif;                     // 标题
$font-mono: 'JetBrains Mono', monospace;                    // 代码
```

通过 Google Fonts 或 CDN 加载。

### 5.5 明暗模式

- 使用 CSS 变量控制所有颜色
- `<html>` 标签切换 `dark` class
- `localStorage` 持久化（key: `memos_theme_mode`）
- 页面加载前执行恢复脚本（`<script>` 在 `<head>` 中，避免闪烁）
- `useTheme()` composable 提供 `isDark`、`toggle()` 方法

### 5.6 响应式布局

```
桌面 (>1024px):  单列信息流，最大宽度 680px，居中
平板 (768-1024px): 单列信息流，左右 padding 减小
手机 (<768px):   全宽，卡片圆角减小，字体微调，底部导航
```

### 5.7 flatpaper 风格元素

通过 `config.ts` 的 `theme.paper` 配置控制：

| 元素 | CSS 实现 | 配置开关 |
|------|----------|----------|
| 虚线边框 | `border: 2px dashed $light-border` | `dashedBorder` |
| 胶带装饰 | CSS 伪元素 + 渐变背景 | `tapeDecoration` |
| 卡片阴影 | `box-shadow` 柔和投影 | — |
| 纸张底色 | 暖白 `#f8f5f0` | — |
| 分隔线 | 虚线 `border-bottom: 1px dashed` | — |

---

## 6. 核心组件设计

### 6.1 MemoCard.vue

```vue
<template>
  <article class="memo-card">
    <!-- 头部：头像 + 作者 + 时间 -->
    <header class="memo-header">
      <img :src="avatarUrl" class="memo-avatar" />
      <div class="memo-meta">
        <span class="memo-author">{{ memo.creator }}</span>
        <span v-if="memo.pinned" class="memo-pin-badge">置顶</span>
      </div>
      <MemoTime :time="memo.createTime" />
    </header>

    <!-- 内容 -->
    <div class="memo-content">
      <MarkdownRenderer :content="memo.content" />
    </div>

    <!-- 附件 -->
    <MemoAttachment
      v-if="memo.attachments?.length"
      :attachments="memo.attachments"
    />

    <!-- 位置 -->
    <MemoLocation v-if="memo.location" :location="memo.location" />

    <!-- Reactions -->
    <ReactionBar
      :memo-id="memo.name"
      :reactions="memo.reactions"
    />

    <!-- 评论（折叠） -->
    <CommentList
      v-if="commentCount > 0"
      :memo-id="memo.name"
      :count="commentCount"
      :collapsed="true"
    />
  </article>
</template>
```

### 6.2 MarkdownRenderer.vue

使用 `markdown-it` 渲染 Memos 的 Markdown content：

```typescript
// plugins/markdown.ts
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,        // 禁止原始 HTML（XSS 防护）
  linkify: true,      // 自动链接
  typographer: true,  // 智能引号
})

// 需要支持的特性：
// - 标准 Markdown 语法
// - 任务列表 - [ ] / - [x]
// - 代码块（带语言高亮）
// - 图片/视频嵌入
// - Emoji :emoji_name:
// - 行内代码
// - 引用块
// - 表格
```

**图片灯箱**：当 `config.ts` 中 `theme.lightbox.enabled` 为 `true` 时，Markdown 渲染的 `<img>` 标签自动添加 `data-lightbox` 属性，点击图片可全屏预览。使用轻量灯箱库（如 `medium-zoom` 或自定义 Vue 组件），支持：
- 点击图片放大预览
- 背景遮罩 + 缩放动画
- ESC / 点击遮罩关闭
- 左右箭头切换（同一篇 memo 内的多张图片）

### 6.3 ReactionBar.vue

```vue
<template>
  <div class="reaction-bar">
    <!-- 已有 reactions（按 contentId 分组计数） -->
    <button
      v-for="(reaction, id) in groupedReactions"
      :key="id"
      class="reaction-chip"
      :class="{ 'is-active': reaction.hasMyReaction }"
      @click="toggleReaction(id)"
    >
      {{ id }} {{ reaction.count }}
    </button>

    <!-- 添加 reaction 按钮 -->
    <button class="reaction-add" @click="showPicker = true">
      <Icon name="ph:smiley-plus" /> 添加
    </button>

    <!-- Emoji 选择器 -->
    <ReactionPicker
      v-if="showPicker"
      @select="addReaction"
      @close="showPicker = false"
    />
  </div>
</template>
```

### 6.4 LoginModal.vue

```vue
<template>
  <Teleport to="body">
    <div v-if="visible" class="login-overlay" @click.self="$emit('close')">
      <div class="login-modal">
        <h3>登录 Memos</h3>
        <form @submit.prevent="handleLogin">
          <input v-model="username" placeholder="用户名" required />
          <input v-model="password" type="password" placeholder="密码" required />
          <button type="submit" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </div>
    </div>
  </Teleport>
</template>
```

---

## 7. Memos API 类型定义

```typescript
// types/memo.ts

export interface MemosMemo {
  name: string                    // "memos/{id}"
  state: 'STATE_UNSPECIFIED' | 'NORMAL' | 'ARCHIVED'
  creator: string
  createTime: string              // ISO 8601
  updateTime: string
  content: string                 // Markdown
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
  parent: string                  // 父 memo name（评论用）
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
  content: string                 // base64 or URL
  externalLink: string
  type: string                    // MIME type
  size: string
  memo: string
}

export interface MemosReaction {
  name: string
  creator: string
  contentId: string               // emoji identifier
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
```

---

## 8. config.ts 设计

> **注意**：`config.ts` 只包含静态配置，敏感信息（API URL、Token）通过 Nuxt 的 `runtimeConfig`（`nuxt.config.ts`）从 `.env` 注入。Server API 通过 `useRuntimeConfig()` 获取。

```typescript
export default {
  // 站点基本信息
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

  // Memos 前端配置（API URL 和 Token 在 runtimeConfig 中）
  memos: {
    pageSize: 20,
    defaultVisibility: 'PUBLIC',
  },

  // 主题视觉配置
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
      enabled: true,              // 图片灯箱开关
    },
  },

  // 页脚
  footer: {
    copyright: '© 2024 作者名',
    beian: '',
    powered: true,
    links: [
      { text: '关于', href: '/about' },
    ],
  },

  // SEO
  seo: {
    titleTemplate: '%s - 我的博客',
    ogImage: '/og-image.png',
    keywords: ['blog', 'memos'],
  },

  // 统计
  analytics: {
    umami: '',
    cloudflare: '',
  },

  // 扩展点
  // features: {},
} as const
```

---

## 9. 错误处理

| 场景 | 处理方式 |
|------|----------|
| API 401 | 清除本地 token，提示重新登录，降级为只显示 PUBLIC 内容 |
| API 403 | 提示无权限 |
| API 404 | 显示 "内容不存在" 空状态 |
| API 500 | 显示重试按钮 |
| 网络错误 | 显示离线提示 + 重试 |
| Token 过期 | 检测 401 → 自动清除 → 静默降级 |

---

## 10. 依赖清单

```json
{
  "dependencies": {
    "nuxt": "^4.0.0",
    "@iconify/vue": "^4.0.0",
    "markdown-it": "^14.0.0",
    "@pinia/nuxt": "^0.5.0",
    "pinia": "^2.0.0"
  },
  "devDependencies": {
    "@nuxt/devtools": "latest",
    "sass": "^1.70.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 11. 测试策略

- **组件测试**：Vitest + Vue Test Utils（MemoCard、ReactionBar 等核心组件）
- **API 测试**：Vitest（Server API 代理层的请求转发和错误处理）
- **E2E 测试**：可后续添加 Playwright

---

## 12. 参考项目

| 项目 | 参考内容 |
|------|----------|
| [icefox](https://github.com/xiaopanglian/icefox) | 朋友圈信息流布局、头像+内容+时间结构、图标切换 |
| [flatpaper](https://github.com/Homulilly/hexo-theme-flatpaper) | 纸张质感、虚线边框、胶带装饰、手帐风格 |
| [blog-v3](https://github.com/L33Z22L11/blog-v3) | Nuxt 4 项目结构、config.ts 模式、composables 组织 |
| [Memos API 0.29.1](https://usememos.com/docs/api/0-29-1) | API 端点、数据模型、认证方式 |
