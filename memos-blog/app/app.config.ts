// config.ts
export default {
  site: {
    title: '克喵的朋友圈',
    description: '基于Nuxt的memos展示博客',
    author: '克喵Moretti',
    avatar: 'https://q2.qlogo.cn/headimg_dl?dst_uin=3149261770&spec=0',
    logo: 'https://q2.qlogo.cn/headimg_dl?dst_uin=3149261770&spec=0',
    favicon: 'https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/favicon-kemiao.ico',
    language: 'zh-CN',
    social: {
      github: 'https://s.2005815.xyz/github',
      twitter: '',
      email: 'https://s.2005815.xyz/mail',
    },
  },
  memos: {
    pageSize: 20,
    defaultVisibility: 'PUBLIC',
    authUrl: 'https://mm.2005815.xyz/auth',
    // 留空则展示所有用户
    creator: 'users/kemiao',
  },
  banner: {
    topVideo: '',
    topImage: 'https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/bg.webp',
    logo: 'https://q2.qlogo.cn/headimg_dl?dst_uin=3149261770&spec=0',
    avatarLink: '/',
    description: '人生如逆旅，我亦是行人。',
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
    copyright: '© 2024 - Now 克喵Moretti',
    beian: '',
    powered: true,
    // links: [
    //   { text: '关于', href: '/about' },
    // ],
  },
  seo: {
    titleTemplate: '%s - Memos',
    ogImage: 'https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/bg.webp',
    keywords: ['blog', 'memos'],
  },
  analytics: {
    umami: '',
    cloudflare: '',
  },
} as const
