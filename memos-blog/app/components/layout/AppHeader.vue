<template>
  <header class="header-wrapper">
    <nav class="header-nav" :class="{ 'header-nav--scrolled': scrolled }">
      <div class="header-nav-inner page-container">
        <div class="header-nav-left">
          <NuxtLink to="/" class="header-title">{{ config.site.title }}</NuxtLink>
        </div>
        <div class="header-actions">
          <a v-if="config.site.social?.github" :href="config.site.social.github" target="_blank" class="header-action" title="GitHub">
            <UiIcon name="ph:github-logo" :size="18" />
          </a>
          <a v-if="config.site.social?.email" :href="config.site.social.email" target="_blank" class="header-action" title="Email">
            <UiIcon name="ph:envelope" :size="18" />
          </a>
          <NuxtLink to="/search" class="header-action" title="搜索">
            <UiIcon name="ph:magnifying-glass" :size="18" />
          </NuxtLink>
          <NuxtLink to="/tags" class="header-action">
            <UiIcon name="ph:tag" :size="18" />
          </NuxtLink>
          <a :href="config.memos.authUrl" target="_blank" class="header-action" title="登录">
            <UiIcon name="ph:user" :size="18" />
          </a>
          <UiDarkModeToggle />
        </div>
      </div>
    </nav>

    <div class="page-container">
      <section class="header-banner" :class="{ 'header-banner--empty': !hasBanner }">
        <video
          v-if="config.banner?.topVideo"
          class="banner-video"
          autoplay muted loop playsinline
          :src="config.banner.topVideo"
        />
        <div
          v-if="config.banner?.topImage"
          class="banner-image"
          :style="{ backgroundImage: `url(${config.banner.topImage})` }"
        />
        <div v-if="!hasBanner" class="banner-fallback" />
        <div class="banner-overlay" />

        <div class="banner-info">
          <div class="banner-info-inner">
            <span class="banner-title">{{ config.site.title }}</span>
            <div v-if="config.banner?.logo" class="banner-avatar-wrap">
              <template v-if="config.banner?.avatarLink">
                <a :href="config.banner.avatarLink">
                  <img :src="config.banner.logo" class="banner-avatar" :alt="config.site.author" />
                </a>
              </template>
              <template v-else>
                <img :src="config.banner.logo" class="banner-avatar" :alt="config.site.author" />
              </template>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-if="config.banner?.description" class="page-container">
      <p class="banner-site-desc">{{ config.banner.description }}</p>
    </div>
  </header>
</template>

<script setup lang="ts">
const config = useAppConfig() as any
const scrolled = ref(false)

const hasBanner = computed(() => !!(config.banner?.topVideo || config.banner?.topImage))

function handleScroll() {
  scrolled.value = window.scrollY > 180
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 56px;
  background: transparent;
  transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
  border-bottom: 1px solid transparent;
}
.header-nav--scrolled {
  background: var(--bg);
  border-bottom-color: var(--border);
  backdrop-filter: blur(10px);
}
.header-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
.header-nav-left {
  display: flex;
  align-items: center;
}
.header-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: var(--text);
  text-decoration: none;
  transition: color 0.3s;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.header-action {
  color: var(--text-sub);
  padding: 0.4rem;
  border-radius: 50%;
  display: flex;
  transition: color 0.3s, background 0.2s;
  text-decoration: none;
}
.header-action:hover {
  background: var(--reaction-bg);
  color: var(--text);
}

/* Banner */
.header-banner {
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: var(--radius);
  overflow: visible;
}
.header-banner--empty {
  height: 0;
}
.banner-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius);
}
.banner-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius);
}
.banner-fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: var(--reaction-bg);
  border-radius: var(--radius);
}
.banner-overlay {
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.45) 100%
  );
}

/* Banner info: title + avatar both on right */
.banner-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 1.25rem 1rem;
}
.banner-info-inner {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 0.6rem;
}
.banner-title {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
  line-height: 1.4;
}
.banner-avatar-wrap {
  flex-shrink: 0;
  /* 头像一半在 Banner 内，一半在 Banner 外 */
  margin-bottom: -28px;
  position: relative;
  z-index: 2;
}
.banner-avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  display: block;
  border: 3px solid var(--bg-card, #fff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Description */
.banner-site-desc {
  margin: 1.25rem 0 0.75rem;
  text-align: right;
  font-size: 0.85rem;
  color: var(--text-sub);
}

@media (max-width: 768px) {
  .header-banner {
    height: 220px;
    border-radius: var(--radius-sm);
  }
  .banner-video,
  .banner-image,
  .banner-fallback,
  .banner-overlay {
    border-radius: var(--radius-sm);
  }
  .banner-avatar {
    width: 46px;
    height: 46px;
  }
  .banner-avatar-wrap {
    margin-bottom: -22px;
  }
  .banner-info {
    padding: 0 0.75rem 0.75rem;
  }
}
</style>
