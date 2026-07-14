<template>
  <div class="music-card">
    <div class="music-card-icon">
      <UiIcon name="ph:music-note" :size="24" />
    </div>
    <div class="music-card-info">
      <span class="music-card-label">音乐</span>
      <a :href="payload.url" target="_blank" rel="noopener" class="music-card-link">
        {{ getMusicSource }} · 点击收听
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ payload: Record<string, any> }>()

const getMusicSource = computed(() => {
  const url = props.payload.url || ''
  if (url.includes('music.163.com')) return '网易云音乐'
  if (url.includes('y.qq.com')) return 'QQ 音乐'
  if (url.includes('spotify.com')) return 'Spotify'
  return '音乐链接'
})
</script>

<style scoped>
.music-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-top: 0.75rem;
  background: var(--reaction-bg);
  border: 1px dashed var(--border);
  border-radius: var(--radius-sm);
}
.music-card-icon {
  flex-shrink: 0;
  color: var(--text);
}
.music-card-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.music-card-label {
  font-weight: 600;
  font-size: 0.85rem;
}
.music-card-link {
  font-size: 0.8rem;
  color: var(--text-link);
  text-decoration: none;
}
.music-card-link:hover {
  text-decoration: underline;
}
</style>
