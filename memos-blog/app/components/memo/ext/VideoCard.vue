<template>
  <div class="video-card">
    <div class="video-card-embed" v-if="embedUrl">
      <iframe
        :src="embedUrl"
        frameborder="0"
        allowfullscreen
        class="video-iframe"
      />
    </div>
    <div v-else class="video-card-fallback">
      <UiIcon name="ph:play-circle" :size="32" />
      <span>视频: {{ payload.videoId || '未知' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ payload: Record<string, any> }>()

const embedUrl = computed(() => {
  const id = props.payload.videoId || ''
  // Bilibili
  if (id.startsWith('BV')) {
    return `//player.bilibili.com/player.html?bvid=${id}&autoplay=0`
  }
  // YouTube
  if (id.length === 11 || id.includes('youtube.com') || id.includes('youtu.be')) {
    const ytId = id.includes('/') ? id.split('/').pop() : id
    return `//www.youtube.com/embed/${ytId}`
  }
  return ''
})
</script>

<style scoped>
.video-card {
  margin-top: 0.75rem;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px dashed var(--border);
}
.video-card-embed {
  position: relative;
  padding-top: 56.25%;
}
.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.video-card-fallback {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  color: var(--text-sub);
  font-size: 0.85rem;
}
</style>
