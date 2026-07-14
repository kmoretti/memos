# 克喵的朋友圈

基于 [Ech0](https://github.com/MirrorX-Dev/Ech0) 的个人社交博客，使用 Nuxt 4 构建，部署在 Cloudflare Pages。支持双数据源（Ech0 / Memos）切换。

**线上地址**：https://memo.081531.xyz

## 功能特性

- **双数据源** — 支持 Ech0 和 Memos 两种后端，通过环境变量一键切换
- **扩展卡片** — 自动渲染网站链接、GitHub 项目、视频（B站/YouTube）、音乐等扩展
- **多布局图片** — 支持 waterfall、grid、horizontal、carousel、stack 等布局
- **标签分类** — 按标签筛选说说
- **搜索** — 按内容关键词搜索
- **评论** — 支持查看说说评论
- **点赞** — 显示说说点赞数
- **定位** — 显示发布位置信息
- **PWA 支持** — 可安装到桌面/手机主屏幕，支持离线访问
- **推送通知** — 新动态推送提醒（需配置 VAPID 密钥）
- **响应式设计** — 适配桌面端与移动端
- **深色模式** — 自动跟随系统主题，支持手动切换
- **手账风格** — 胶带、虚线边框等手账元素装饰

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Nuxt 4 + Vue 3 |
| 数据源 | Ech0 / Memos（可切换） |
| 样式 | SCSS + CSS 变量 |
| 图标 | Iconify Vue |
| Markdown | markdown-it |
| 图片查看 | medium-zoom |
| 部署 | Cloudflare Pages（Nitro Worker） |

## 项目结构

```
memos-blog/
├── app/
│   ├── components/
│   │   ├── layout/          # 页面布局（Header, Footer）
│   │   ├── memo/            # MemoCard, MemoList, MemoDetail, MemoTime, MemoLocation
│   │   ├── comment/         # CommentList, CommentItem
│   │   ├── reaction/        # ReactionBar
│   │   └── ui/              # PostImages, PostExtension, MarkdownRenderer, ImageLightbox 等
│   ├── composables/
│   │   └── useMemos.ts      # 获取说说列表（分页加载）
│   ├── pages/
│   │   ├── index.vue        # 首页
│   │   ├── search.vue       # 搜索
│   │   ├── about.vue        # 关于
│   │   ├── memo/[id].vue    # 说说详情
│   │   └── tags/            # 标签页
│   ├── types/
│   │   ├── post.ts          # 统一类型（UnifiedPost, UnifiedComment 等）
│   │   └── memo.ts          # Memos 类型（兼容保留）
│   ├── app.config.ts        # 站点配置
│   └── app.vue              # 根组件
├── server/
│   ├── api/
│   │   ├── memos/           # /api/memos, /api/memos/:id, /api/memos/:id/comments
│   │   ├── tags.get.ts      # /api/tags
│   │   └── push/            # 推送通知接口
│   └── utils/
│       ├── dataSource.ts    # 适配器工厂（根据 DATA_SOURCE 选择）
│       ├── ech0-adapter.ts  # Ech0 数据适配器
│       ├── ech0-client.ts   # Ech0 HTTP 客户端
│       ├── memos-adapter.ts # Memos 数据适配器
│       ├── memos-client.ts  # Memos HTTP 客户端
│       ├── pushSubscription.ts
│       └── pushState.ts
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js
│   ├── icon.png
│   └── offline.html
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

## 架构说明

### 统一数据层

项目通过 `server/utils/dataSource.ts` 的适配器模式，将不同数据源统一为 `UnifiedPost` 类型：

```
Ech0 API ──→ Ech0Adapter ──→ UnifiedPost
Memos API ──→ MemosAdapter ──→ UnifiedPost
```

切换数据源只需修改环境变量 `DATA_SOURCE` 为 `ech0` 或 `memos`。

### 统一类型

```ts
interface UnifiedPost {
  id: string
  content: string          // Markdown
  author: string
  avatar: string
  createTime: number       // unix seconds
  tags: string[]
  images: UnifiedImage[]
  extensions: UnifiedExtension[]  // WEBSITE / GITHUBPROJ / VIDEO / MUSIC / TWEET
  location?: UnifiedLocation
  pinned: boolean
  likes: number
  layout: string           // waterfall / grid / horizontal / carousel / stack / none
}
```

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm dev
```

访问 http://localhost:3000

### 构建部署

```bash
pnpm build
```

## 配置

### 站点配置

编辑 `app/app.config.ts`：

```ts
export default {
  site: {
    title: '你的站点标题',
    author: '你的名字',
    avatar: '头像 URL',
  },
  memos: {
    pageSize: 10,  // 每页加载数量
  },
  banner: {
    topImage: '你的封面图',
    description: '你的签名',
  },
  theme: {
    colors: {
      primary: '#5b7a9d',
      accent: '#e8a87c',
    },
    fonts: {
      body: 'LXGW WenKai',
      heading: 'ZCOOL XiaoWei',
    },
  },
}
```

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `DATA_SOURCE` | 数据源选择 `ech0` / `memos` | `ech0` |
| `ECH0_BASE_URL` | Ech0 服务器地址 | `https://m.081531.xyz` |
| `ECH0_ACCESS_TOKEN` | Ech0 访问令牌（可选） | 空 |
| `MEMOS_BASE_URL` | Memos 服务器地址 | `https://mm.2005815.xyz` |
| `MEMOS_ACCESS_TOKEN` | Memos API Token | 空 |
| `WEB_PUSH_PRIVATE_KEY` | VAPID 私钥（推送通知用） | 空 |

## 部署到 Cloudflare Pages

### 1. 连接 GitHub 仓库

在 Cloudflare Dashboard → Pages → 连接你的 GitHub 仓库

### 2. 构建设置

| 项目 | 值 |
|------|-----|
| 框架预设 | 无 |
| 构建命令 | `pnpm build` |
| 构建输出目录 | `dist` |
| 根目录（高级） | `memos-blog` |

### 3. 环境变量

在 Cloudflare Pages → 设置 → 环境变量中添加：

| 变量名 | 值 |
|--------|-----|
| `DATA_SOURCE` | `ech0` |
| `ECH0_BASE_URL` | 你的 Ech0 服务器地址 |

### 4. 保存并部署

清除缓存重新部署即可。

## 推送通知（可选）

推送通知需要 VAPID 密钥对：

```bash
npx web-push generate-vapid-keys
```

将生成的公钥和私钥配置到环境变量中。

## License

[MIT](https://opensource.org/licenses/MIT)
