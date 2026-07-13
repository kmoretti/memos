<template>
  <Transition name="fade">
    <button v-if="show" class="pwa-install" @click="install" title="安装应用">
      <UiIcon name="ph:arrow-down-to-line" :size="18" />
      <span class="pwa-install-text">安装</span>
    </button>
  </Transition>
</template>

<script setup lang="ts">
const show = ref(false)
let deferredPrompt: any = null

function install() {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  deferredPrompt.userChoice.then(() => {
    show.value = false
    deferredPrompt = null
  })
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt = e
    show.value = true
  })

  window.addEventListener('appinstalled', () => {
    show.value = false
    deferredPrompt = null
  })
})
</script>

<style scoped>
.pwa-install {
  position: fixed;
  bottom: 5.5rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.85rem;
  border-radius: 2rem;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text);
  cursor: pointer;
  font-size: 0.8rem;
  font-family: var(--font-body);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background 0.2s, box-shadow 0.2s;
  z-index: 100;
}
.pwa-install:hover {
  background: var(--reaction-bg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.pwa-install-text {
  line-height: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
