// config.ts
export default {
  site: {
    title: '我的博客',
    description: '基于 Memos 的个人博客',
    author: '克喵Moretti',
    avatar: 'https://q2.qlogo.cn/headimg_dl?dst_uin=3149261770&spec=0',
    logo: 'https://q2.qlogo.cn/headimg_dl?dst_uin=3149261770&spec=0',
    favicon: '/favicon.ico',
    language: 'zh-CN',
    social: {
      github: '',
      twitter: '',
      email: '',
    },
  },
  memos: {
    pageSize: 20,
    defaultVisibility: 'PUBLIC',
  },
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
      enabled: true,
    },
  },
  footer: {
    copyright: '© 2024 作者名',
    beian: '',
    powered: true,
    links: [
      { text: '关于', href: '/about' },
    ],
  },
  seo: {
    titleTemplate: '%s - 我的博客',
    ogImage: '/og-image.png',
    keywords: ['blog', 'memos'],
  },
  analytics: {
    umami: '',
    cloudflare: '',
  },
} as const
