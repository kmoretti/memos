<template>
  <div class="memo-location" v-if="location">
    <UiIcon name="ph:map-pin" :size="14" />
    <span>{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  location: { placeholder: string; latitude: number; longitude: number }
}>()

const text = computed(() => {
  const loc = props.location
  if (loc.placeholder) return loc.placeholder
  const lat = Number(loc.latitude)
  const lng = Number(loc.longitude)
  if (!isNaN(lat) && !isNaN(lng)) {
    return `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`
  }
  return ''
})
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
