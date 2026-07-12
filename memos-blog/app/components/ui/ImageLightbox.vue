<template>
  <div ref="container">
    <slot />
  </div>
</template>

<script setup lang="ts">
import mediumZoom from 'medium-zoom'

const container = ref<HTMLElement>()

onMounted(() => {
  if (!import.meta.client) return
  const config = useAppConfig() as any
  if (config?.theme?.lightbox?.enabled === false) return

  nextTick(() => {
    if (container.value) {
      mediumZoom(container.value.querySelectorAll('.markdown-body img'), {
        background: 'rgba(0,0,0,0.8)',
      })
    }
  })
})
</script>
