<template>
  <span class="memo-time">{{ display }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{ time: string | number }>()

const display = computed(() => {
  const t = typeof props.time === 'number'
    ? props.time * 1000
    : new Date(props.time).getTime()
  return formatRelativeTime(t)
})
</script>
