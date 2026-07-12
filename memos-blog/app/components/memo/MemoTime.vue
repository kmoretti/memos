<template>
  <span class="memo-time">{{ formatRelativeTime(time) }}</span>
</template>

<script setup lang="ts">
defineProps<{ time: string }>()
</script>
