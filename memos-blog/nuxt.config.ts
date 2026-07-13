export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-01-01',
  modules: ['@nuxtjs/pwa'],
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
      ],
      htmlAttrs: { lang: 'zh-CN' },
    },
  },
  pwa: {
    meta: {
      title: '克喵的朋友圈',
      author: '克喵Moretti',
      theme_color: '#5b7a9d',
      background_color: '#ffffff',
      display: 'standalone',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      mobileApp: true,
      mobileAppAuto: true,
      appleStatusBarStyle: 'black-translucent',
    },
    manifest: {
      name: '克喵的朋友圈',
      short_name: '克喵',
      description: '基于Nuxt的memos展示博客',
      theme_color: '#5b7a9d',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      orientation: 'any',
    },
    icon: {
      source: 'https://q2.qlogo.cn/headimg_dl?dst_uin=3149261770&spec=0',
      fileName: 'icon.png',
      size: 512,
    },
    workbox: {
      navigateFallback: '/',
      swType: 'sw',
      autoRegister: true,
      config: {
        base: '/',
        scope: '/',
      },
      runtimeCaching: [
        {
          urlPattern: '/api/.*',
          handler: 'NetworkFirst',
          strategyOptions: {
            networkTimeoutSeconds: 5,
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 86400,
            },
          },
        },
        {
          urlPattern: '.*\\.(?:js|css)$',
          handler: 'CacheFirst',
          strategyOptions: {
            cacheName: 'static-cache',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 31536000,
            },
          },
        },
        {
          urlPattern: '.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$',
          handler: 'StaleWhileRevalidate',
          strategyOptions: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 300,
              maxAgeSeconds: 2592000,
            },
          },
        },
        {
          urlPattern: '.*\\.(?:woff|woff2|ttf|eot|otf)$',
          handler: 'CacheFirst',
          strategyOptions: {
            cacheName: 'font-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 31536000,
            },
          },
        },
        {
          urlPattern: '/_nuxt/.*',
          handler: 'CacheFirst',
          strategyOptions: {
            cacheName: 'nuxt-static',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 31536000,
            },
          },
        },
      ],
    },
    oneSignal: false,
  },
})
