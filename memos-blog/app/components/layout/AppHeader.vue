<template>
  <header class="app-header">
    <div class="header-inner page-container">
      <NuxtLink to="/" class="header-logo">
        <span class="header-title">{{ config.site.title }}</span>
      </NuxtLink>
      <nav class="header-nav">
        <NuxtLink to="/tags" class="header-link">
          <UiIcon name="ph:tag" :size="18" />
        </NuxtLink>
        <NuxtLink to="/about" class="header-link">
          <UiIcon name="ph:user" :size="18" />
        </NuxtLink>
        <UiDarkModeToggle />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const config = useAppConfig() as any
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg);
  border-bottom: 1px dashed var(--border);
  backdrop-filter: blur(10px);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}
.header-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: var(--text);
  text-decoration: none;
}
.header-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.header-link {
  color: var(--text-sub);
  padding: 0.4rem;
  border-radius: 50%;
  display: flex;
  transition: background 0.2s;
}
.header-link:hover {
  background: var(--reaction-bg);
  text-decoration: none;
  color: var(--text);
}
</style>
