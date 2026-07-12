export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-01-01',
  modules: ['@pinia/nuxt'],
  css: [
    '~/assets/styles/variables.scss',
    '~/assets/styles/main.scss',
    '~/assets/styles/markdown.scss',
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
})
