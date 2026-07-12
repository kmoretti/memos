<template>
  <div class="memo-location" v-if="location?.placeholder">
    <UiIcon name="ph:map-pin" :size="14" />
    <span>{{ location.placeholder }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  location: { placeholder: string; latitude: number; longitude: number }
}>()
</script>

<style scoped>
.memo-location {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--text-sub);
  margin-top: 0.75rem;
}
</style>
