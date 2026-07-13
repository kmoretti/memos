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
    memosBaseUrl: process.env.MEMOS_BASE_URL || 'https://mm.2005815.xyz',
    memosAccessToken: process.env.MEMOS_ACCESS_TOKEN || '',
    webPushPrivateKey: process.env.WEB_PUSH_PRIVATE_KEY || 'KLakvOXpsk2U5t_FS5Don40b5BGqO8jYvS2UrJXShYo',
    public: {
      siteTitle: '我的博客',
      webPushPublicKey: 'BDSM0sJLDYaBxpiwjzTDa57Cm1HL95qVLgRiz-BI1EXvoRbvgAsQjuYIkPOphAyPmypBUFb93YV3YhBg7HQOFeU',
    },
  },
  app: {
    head: {
      title: '我的博客',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: '基于 Memos 的个人博客' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#5b7a9d' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'mobile-web-app-capable', content: 'yes' },
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/icon.jpg' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
      script: [
        {
          children: `if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js'); }); }`,
        },
      ],
      htmlAttrs: { lang: 'zh-CN' },
    },
  },
  nitro: {
    preset: 'cloudflare-pages',
  },
})
