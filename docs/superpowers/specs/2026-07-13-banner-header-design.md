# Banner Header Design Spec

## Overview

为 memos-blog 添加 icefox 风格的顶部 banner 横幅，包含导航栏滚动变色效果、背景图片/视频支持、Logo + 站点标题 + 描述展示。

## Visual Design

```
┌──────────────────────────────────────────────┐
│ [标题]                       [标签][👤][🌙]   │ ← sticky, 初始透明
├──────────────────────────────────────────────┤
│ ╔══════════════════════════════════════════╗  │
│ ║                                          ║  │
│ ║         320px Banner 区域                ║  │
│ ║   背景: video > image > 纯色             ║  │
│ ║                                          ║  │
│ ║                  ┌──────┐                ║  │
│ ║                  │ Logo │ 站点标题       ║  │
│ ║                  │ 60x60│ 站点描述       ║  │
│ ║                  └──────┘                ║  │
│ ╚══════════════════════════════════════════╝  │
├──────────────────────────────────────────────┤
│              Memo 列表内容                    │
```

## Configuration

在 `app/app.config.ts` 中新增 `banner` 配置块：

```ts
banner: {
  topVideo: '',      // 背景视频 URL，优先级最高
  topImage: '',      // 背景图片 URL（无视频时显示）
  logo: '',          // 头像/Logo 图片 URL
  avatarLink: '',    // 头像点击链接，留空则不跳转
  description: '',   // 站点描述文字
}
```

## Behavior

### 导航栏
- 初始状态：透明背景，文字/图标白色 + text-shadow
- 滚动超过 180px 后：背景变为 `var(--bg)`，添加底部边框
- 始终 sticky 定位在顶部，高度 56px，z-index 100

### Banner 区域
- 高度：240px（移动端 180px）
- 背景优先级：video > image > 默认纯色（`var(--reaction-bg)`）
- `background-size: cover`，`background-position: center`
- 顶部渐变遮罩：`rgba(0,0,0,0.3)` → 透明 → `rgba(0,0,0,0.4)`，确保导航栏文字可读
- 底部信息区域：Logo + 标题 + 描述，右下角对齐

### Logo/标题区域
- Logo：48x48px，圆角 4px，白色半透明边框（移动端 40x40）
- 站点标题：白色，字号 16px，粗体，text-shadow
- 站点描述：白色半透明，字号 13px
- 如果配置了 `avatarLink`，Logo 可点击

### 移动端适配（≤768px）
- Banner 高度降至 240px
- Logo 缩小为 50x50
- 导航栏 padding 缩小

## Files to Modify

| File | Change |
|---|---|
| `app/app.config.ts` | 新增 `banner` 配置块 |
| `app/components/layout/AppHeader.vue` | 重构为导航栏 + banner 结构，添加 scroll 监听 |
| `app/assets/styles/variables.scss` | 无需改动，复用现有变量 |

## Not In Scope

- 背景视差滚动效果
- Banner 图片轮播
- 多组 banner 自动切换
