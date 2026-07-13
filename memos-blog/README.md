# 克喵的朋友圈

基于 [Memos](https://usememos.com) 的个人社交博客，使用 Nuxt 4 构建，部署在 Cloudflare Pages。

**线上地址**：https://memo.081531.xyz

## 功能特性

- **Memos 集成** — 自动拉取 Memos 动态，支持标签分类、搜索、评论、Reactions
- **PWA 支持** — 可安装到桌面/手机主屏幕，支持离线访问
- **推送通知** — 新动态推送提醒（需配置 VAPID 密钥）
- **响应式设计** — 适配桌面端与移动端
- **深色模式** — 自动跟随系统主题，支持手动切换
- **手账风格** — 胶带、虚线边框等手账元素装饰

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Nuxt 4 + Vue 3 |
| 样式 | SCSS + CSS 变量 |
| 图标 | Iconify Vue |
| Markdown | markdown-it |
| 图片查看 | medium-zoom |
| 部署 | Cloudflare Pages（Nitro Worker） |

## 项目结构

```
memos-blog/
├── app/
│   ├── components/        # 组件
│   │   ├── layout/        # 页面布局（Header, Footer）
│   │   ├── memo/          # MemoCard, MemoList, MemoDetail 等
│   │   └── ui/            # 通用 UI（BackToTop, MarkdownRenderer, PwaInstall 等）
│   ├── composables/       # 组合式函数
│   │   ├── useMemos.ts    # 获取 Memos 列表
│   │   ├── useTheme.ts    # 主题管理
│   │   └── useInfiniteScroll.ts
│   ├── pages/             # 页面路由
│   │   ├── index.vue      # 首页（Memos 列表）
│   │   ├── search.vue     # 搜索
│   │   ├── about.vue      # 关于
│   │   ├── memo/[id].vue  # Memo 详情
│   │   └── tags/          # 标签页
│   ├── plugins/           # 插件
│   │   └── pwa.client.ts  # Service Worker 注册
│   ├── types/             # TypeScript 类型定义
│   ├── assets/styles/     # SCSS 样式
│   ├── app.config.ts      # 站点配置（主题、内容、SEO）
│   └── app.vue            # 根组件
├── server/                # 服务端 API（Nitro 路由）
│   ├── api/
│   │   ├── memos/         # Memos 代理接口
│   │   ├── tags.get.ts    # 标签聚合
│   │   └── push/          # 推送通知接口
│   └── utils/
│       ├── memos-client.ts      # Memos API 客户端
│       ├── pushSubscription.ts  # 订阅管理
│       └── pushState.ts         # 推送状态
├── public/                # 静态资源
│   ├── manifest.webmanifest  # PWA 清单
│   ├── sw.js                 # Service Worker
│   ├── icon.png              # PWA 图标
│   └── offline.html          # 离线页面
├── nuxt.config.ts
├── package.json
└── tsconfig.json
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
  // 站点信息
  site: {
    title: '你的站点标题',
    author: '你的名字',
  },

  // Memos 配置
  memos: {
    pageSize: 20,
    creator: 'users/your-username', // 留空则展示所有用户
  },

  // 首页 Banner
  banner: {
    topImage: '你的封面图',
    description: '你的签名',
  },

  // 主题
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
| `MEMOS_BASE_URL` | Memos 服务器地址 | `https://mm.2005815.xyz` |
| `MEMOS_ACCESS_TOKEN` | Memos API Token | 空 |
| `WEB_PUSH_PRIVATE_KEY` | VAPID 私钥（推送通知用） | 空 |

## 部署到 Cloudflare Pages

### 1. 连接 GitHub 仓库

在 Cloudflare Dashboard → Pages → 连接你的 GitHub 仓库 `kmoretti/memos`

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
| `MEMOS_BASE_URL` | 你的 Memos 服务器地址 |
| `MEMOS_ACCESS_TOKEN` | 你的 Memos API Token |

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
