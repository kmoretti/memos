<template>
  <button class="dark-mode-toggle" @click="toggle" :title="isDark ? '切换到浅色模式' : '切换到深色模式'">
    <UiIcon :name="isDark ? 'ph:sun' : 'ph:moon'" :size="20" />
  </button>
</template>

<script setup lang="ts">
const { isDark, toggle } = useTheme()
</script>

<style scoped>
.dark-mode-toggle {
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dark-mode-toggle:hover {
  background: var(--reaction-bg);
}
</style>
