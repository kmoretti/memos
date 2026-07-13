import { VitePWA } from 'vite-plugin-pwa'

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
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/icon.png' },
      ],
      htmlAttrs: { lang: 'zh-CN' },
    },
  },
  nitro: {
    preset: 'cloudflare-pages-static',
  },
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt'],
        manifest: {
          name: '克喵的朋友圈',
          short_name: '克喵',
          description: '基于Nuxt的memos展示博客',
          theme_color: '#5b7a9d',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          orientation: 'any',
          icons: [
            { src: '/icon.png', sizes: '64x64', type: 'image/png' },
            { src: '/icon.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon.png', sizes: '512x512', type: 'image/png' },
            { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          navigateFallback: '/',
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /\/api\/.*/i,
              handler: 'NetworkFirst',
              options: {
                networkTimeoutSeconds: 5,
                cacheName: 'api-cache',
                expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
              },
            },
            {
              urlPattern: /\/_nuxt\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'nuxt-static',
                expiration: { maxEntries: 200, maxAgeSeconds: 31536000 },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'image-cache',
                expiration: { maxEntries: 300, maxAgeSeconds: 2592000 },
              },
            },
            {
              urlPattern: /\.(?:woff|woff2|ttf|eot|otf)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'font-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 31536000 },
              },
            },
          ],
        },
      }),
    ],
  },
})
