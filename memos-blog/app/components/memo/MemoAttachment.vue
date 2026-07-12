<template>
  <div class="memo-attachments" :class="'grid-' + Math.min(attachments.length, 3)">
    <div v-for="att in attachments" :key="att.name" class="attachment-item">
      <img
        v-if="isImage(att.type)"
        :src="getAttachmentUrl(att)"
        :alt="att.filename"
        loading="lazy"
        class="attachment-image"
      />
      <video
        v-else-if="isVideo(att.type)"
        :src="getAttachmentUrl(att)"
        controls
        preload="metadata"
        class="attachment-video"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemosAttachment } from '~/types/memo'

const props = defineProps<{ attachments: MemosAttachment[] }>()

function isImage(type: string) {
  return type?.startsWith('image/')
}

function isVideo(type: string) {
  return type?.startsWith('video/')
}

function getAttachmentUrl(att: MemosAttachment) {
  if (att.externalLink) return att.externalLink
  const config = useRuntimeConfig()
  return `${config.memosBaseUrl}/api/v1/${att.name}/content`
}
</script>

<style scoped>
.memo-attachments {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.grid-1 { grid-template-columns: 1fr; }
.grid-2 { grid-template-columns: 1fr 1fr; }
.grid-3 { grid-template-columns: 1fr 1fr 1fr; }

.attachment-image {
  width: 100%;
  border-radius: var(--radius-sm);
  cursor: zoom-in;
  object-fit: cover;
  aspect-ratio: 1;
}

.attachment-video {
  width: 100%;
  border-radius: var(--radius-sm);
}
</style>
