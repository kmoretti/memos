<template>
  <div ref="sentinel" class="scroll-sentinel" />
</template>

<script setup lang="ts">
const emit = defineEmits<{
  intersect: []
}>()

const sentinel = ref<HTMLElement>()

onMounted(() => {
  if (!sentinel.value) return
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        emit('intersect')
      }
    },
    { rootMargin: '100px' }
  )
  observer.observe(sentinel.value)

  onUnmounted(() => observer.disconnect())
})
</script>

<style scoped>
.scroll-sentinel {
  height: 1px;
}
</style>
