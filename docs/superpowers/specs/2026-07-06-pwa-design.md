# PWA 全功能实现设计文档

## 概述

为 memos-blog 项目添加完整的 PWA 支持，包括：可安装性、离线缓存、推送通知、全平台适配。

## 技术方案

**选型：** `@nuxtjs/pwa` 模块 + 自定义推送通知逻辑

**理由：** Nuxt 官方 PWA 模块开箱即用，自动处理 Manifest、Service Worker、Meta 标签、图标生成；推送通知通过自定义 SW 文件扩展实现。

---

## 1. 核心架构

### 依赖安装
- `@nuxtjs/pwa` — Nuxt PWA 模块

### nuxt.config.ts 变更
- `modules: ['@nuxtjs/pwa']`
- 移除 `pwa: false`
- 移除 `experimental.appManifest: false`

### PWA 配置（pwa 选项）

| 配置项 | 值 | 来源 |
|--------|-----|------|
| manifest.name | "克喵的朋友圈" | app.config.site.title |
| manifest.short_name | "克喵" | 截断 |
| manifest.description | "基于Nuxt的memos展示博客" | app.config.site.description |
| manifest.theme_color | "#5b7a9d" | app.config.theme.colors.primary |
| manifest.background_color | "#ffffff" | 默认白 |
| manifest.display | standalone | - |
| manifest.start_url | "/" | - |
| manifest.orientation | any | - |
| icon.source | 头像 URL | app.config.site.avatar |
| icon.sizes | 自动生成 | - |
| icon.purpose | any maskable | - |
| meta.title | "克喵的朋友圈" | app.config.site.title |
| meta.theme_color | "#5b7a9d" | 同上 |

### 自动生成的文件
- `manifest.webmanifest` — Web App Manifest
- `sw.js` — Service Worker
- 图标文件：manifest-icon-192.png, manifest-icon-512.png 等
- Apple touch icon

---

## 2. 离线缓存策略

### 预缓存（构建时生成）
- 所有页面 HTML
- 所有静态资源（JS/CSS/字体/图片）
- 通过 `generate` 命令生成的静态文件

### 运行时缓存策略

| 资源类型 | 策略 | 说明 |
|----------|------|------|
| API 请求（memos 数据） | NetworkFirst | 优先网络，离线回退缓存 |
| 静态资源（JS/CSS） | CacheFirst | 优先缓存，构建更新后失效 |
| 字体文件 | CacheFirst | 缓存后离线可用 |
| 图片资源 | StaleWhileRevalidate | 先展示缓存，后台更新 |
| HTML 页面 | NetworkFirst | 优先实时，离线回退 |

### 缓存过期控制
- 静态资源：最长 365 天
- API 响应：最长 1 天
- 图片：最长 30 天

### 离线回退页面
- 未缓存页面离线访问时显示简洁提示页
- 包含：站点图标、"暂无网络连接"文字、重试按钮
- 位置：`public/offline.html`

---

## 3. 推送通知

### 机制
`@nuxtjs/pwa` 本身不内置推送，需要自定义实现。

### 触发流程
1. 用户首次访问时请求通知权限（不强制）
2. 后台定时轮询 Memos API 检测新内容（每 10 分钟）
3. 发现新 memos 时通过 Service Worker 推送
4. 用户点击通知 → 跳转 `/{memo_id}` 详情页

### 推送内容
- 标题："克喵的朋友圈"
- 正文：新 memos 的摘要（前 50 字）
- 图标：PWA 图标

### 状态管理
- 使用内存变量（或文件）存储上次推送的 memo 时间戳
- 每次轮询时比较 `createTime > lastPushTime` 的 memo 数量
- 推送成功后更新 `lastPushTime`
- 首次运行时以当前时间为起点，不推送历史内容

### 需要新增的文件

| 文件 | 说明 |
|------|------|
| `server/utils/pushSubscription.ts` | 管理推送订阅存储（内存 Map） |
| `server/utils/pushState.ts` | 管理 lastPushTime 状态 |
| `server/api/push/subscribe.post.ts` | 接收浏览器订阅 |
| `server/api/push/unsubscribe.post.ts` | 移除订阅 |
| `server/api/push/check.get.ts` | 轮询检查新 memos 并推送 |
| `public/sw-push.js` | 自定义 push 事件处理 |
| `app/composables/usePushNotification.ts` | 前端通知管理 |

### 前端 API
- `usePushNotification()` composable
  - `requestPermission()` — 请求通知权限
  - `subscribe()` — 注册推送订阅
  - `unsubscribe()` — 取消订阅
  - `isSubscribed` — 当前订阅状态

---

## 4. 多端适配

### iOS 适配
- `apple-mobile-web-app-capable: yes` — 全屏
- `apple-mobile-web-app-status-bar-style: black-translucent` — 状态栏半透明
- `apple-touch-icon` — 主屏幕图标
- `apple-touch-startup-image` — 启动画面

### Android/Chrome 适配
- `theme_color: '#5b7a9d'` — 地址栏颜色
- `background_color: '#ffffff'` — 启动背景
- `display: standalone` — 无地址栏全屏

### Meta 标签
`@nuxtjs/pwa` 的 meta 模块自动注入：
- `theme-color`
- `apple-mobile-web-app-capable`
- `apple-mobile-web-app-status-bar-style`
- `apple-touch-icon`
- `og:type`, `og:title`, `og:image`
- `twitter:card`, `twitter:title`

### 视口优化
- 补充 `viewport-fit=cover`（iPhone 刘海屏/药丸屏）
- 禁止电话号码自动识别 `format-detection`
- 底部安全区域 padding（`env(safe-area-inset-*)`）

### 键盘导航
- Tab 切换、Enter 确认
- PWA 安装后桌面端独立窗口显示

---

## 5. 修改的文件清单

| 文件 | 变更 |
|------|------|
| `nuxt.config.ts` | 添加 @nuxtjs/pwa 模块和 PWA 配置 |
| `package.json` | 添加 @nuxtjs/pwa 依赖 |
| `public/offline.html` | 新增离线回退页面 |
| `server/utils/pushSubscription.ts` | 新增推送订阅管理 |
| `server/api/push/subscribe.post.ts` | 新增 |
| `server/api/push/unsubscribe.post.ts` | 新增 |
| `server/api/push/check.get.ts` | 新增 |
| `app/composables/usePushNotification.ts` | 新增前端通知管理 |
| `public/sw-push.js` | 新增自定义 push 事件处理 |
