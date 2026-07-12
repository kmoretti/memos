<template>
  <Icon :icon="name" :width="size" :height="size" />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  name: string
  size?: number | string
}>()
</script>
