<template>
  <div id="app">
    <LayoutAppHeader />

    <main>
      <NuxtPage />
    </main>

    <LayoutAppFooter />
    <UiBackToTop />
  </div>
</template>

<script setup lang="ts">
const { init: initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1;
  padding: 1.5rem 0;
}
</style>
