export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-01-01',
  modules: [],
  css: [
    '~/assets/styles/variables.scss',
    '~/assets/styles/main.scss',
    '~/assets/styles/markdown.scss',
  ],
  experimental: {
    appManifest: true,
  },
  runtimeConfig: {
    dataSource: process.env.DATA_SOURCE || 'ech0',
    ech0BaseUrl: process.env.ECH0_BASE_URL || 'https://m.081531.xyz',
    ech0AccessToken: process.env.ECH0_ACCESS_TOKEN || '',
    memosBaseUrl: process.env.MEMOS_BASE_URL || 'https://mm.2005815.xyz',
    memosAccessToken: process.env.MEMOS_ACCESS_TOKEN || '',
    webPushPrivateKey: process.env.WEB_PUSH_PRIVATE_KEY || '',
    public: {
      siteTitle: '克喵的朋友圈',
      webPushPublicKey: 'BDSM0sJLDYaBxpiwjzTDa57Cm1HL95qVLgRiz-BI1EXvoRbvgAsQjuYIkPOphAyPmypBUFb93YV3YhBg7HQOFeU',
    },
  },
  app: {
    head: {
      title: '克喵的朋友圈',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: '基于Ech0的个人社交博客' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#5b7a9d' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'mobile-web-app-capable', content: 'yes' },
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
      htmlAttrs: { lang: 'zh-CN' },
    },
  },
  nitro: {
    preset: 'cloudflare-pages',
  },
})
