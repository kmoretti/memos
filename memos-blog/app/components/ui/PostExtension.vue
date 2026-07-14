<template>
  <div class="post-extension" v-if="extension">
    <a
      v-if="extension.type === 'WEBSITE' || extension.type === 'GITHUBPROJ'"
      :href="extension.payload.url || extension.payload.repoUrl || '#'"
      target="_blank"
      rel="noopener noreferrer"
      class="extension-card extension-link"
    >
      <div class="extension-info">
        <div class="extension-title">
          <UiIcon :name="extension.type === 'GITHUBPROJ' ? 'ph:github-logo' : 'ph:globe'" :size="16" />
          {{ extension.payload.title || extension.payload.site || extension.payload.repoUrl || '链接' }}
        </div>
        <div class="extension-url" v-if="extension.payload.site">
          {{ extension.payload.site }}
        </div>
      </div>
      <UiIcon name="ph:arrow-up-right" :size="16" class="extension-arrow" />
    </a>

    <div v-else-if="extension.type === 'VIDEO'" class="extension-card extension-video">
      <div class="video-container">
        <iframe
          :src="videoEmbedUrl"
          frameborder="0"
          allowfullscreen
          loading="lazy"
        />
      </div>
    </div>

    <div v-else-if="extension.type === 'MUSIC'" class="extension-card extension-music">
      <div class="music-info">
        <UiIcon name="ph:music-note" :size="16" />
        <span>音乐</span>
      </div>
      <a :href="extension.payload.url || '#'" target="_blank" rel="noopener noreferrer" class="music-link">
        <UiIcon name="ph:arrow-up-right" :size="14" /> 播放
      </a>
    </div>

    <a
      v-else-if="extension.type === 'TWEET'"
      :href="extension.payload.url || '#'"
      target="_blank"
      rel="noopener noreferrer"
      class="extension-card extension-link"
    >
      <div class="extension-info">
        <div class="extension-title">
          <UiIcon name="ph:x-logo" :size="16" />
          @{{ extension.payload.username || 'twitter' }}
        </div>
        <div class="extension-url">推文</div>
      </div>
      <UiIcon name="ph:arrow-up-right" :size="16" class="extension-arrow" />
    </a>
  </div>
</template>

<script setup lang="ts">
import type { UnifiedExtension } from '~/types/post'

const props = defineProps<{
  extension: UnifiedExtension
}>()

const videoEmbedUrl = computed(() => {
  const p = props.extension.payload
  if (p.videoId) {
    const id = p.videoId.replace(/[^a-zA-Z0-9]/g, '')
    if (id.startsWith('BV')) {
      return `//player.bilibili.com/player.html?bvid=${id}&autoplay=0`
    }
    return `//player.bilibili.com/player.html?aid=${id}&autoplay=0`
  }
  if (p.url) {
    const ytMatch = p.url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/)
    if (ytMatch) {
      return `//www.youtube.com/embed/${ytMatch[1]}`
    }
  }
  return ''
})
</script>

<style scoped>
.post-extension {
  margin-top: 0.75rem;
}

.extension-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border: 1px dashed var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  text-decoration: none;
  color: var(--text);
  transition: all 0.2s;
}

.extension-card:hover {
  border-color: var(--accent);
  box-shadow: var(--card-hover-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.08));
}

.extension-info {
  flex: 1;
  min-width: 0;
}

.extension-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.extension-url {
  font-size: 0.8rem;
  color: var(--text-sub);
  margin-top: 0.2rem;
}

.extension-arrow {
  flex-shrink: 0;
  color: var(--text-sub);
}

.extension-video {
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.video-container {
  width: 100%;
  aspect-ratio: 16/9;
}

.video-container iframe {
  width: 100%;
  height: 100%;
}

.extension-music {
  gap: 0.5rem;
}

.music-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
}

.music-link {
  font-size: 0.8rem;
  color: var(--text-link);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}
</style>
