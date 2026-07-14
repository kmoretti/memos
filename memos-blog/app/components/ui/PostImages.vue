<template>
  <div class="post-images" :class="'layout-' + layout">
    <div
      v-for="(img, idx) in images"
      :key="idx"
      class="post-image-item"
      :class="{ 'first-image': idx === 0 && images.length > 1 }"
    >
      <img
        :src="img.url"
        :alt="img.name"
        loading="lazy"
        class="post-image"
        :style="img.width && img.height ? { aspectRatio: `${img.width}/${img.height}` } : {}"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UnifiedImage } from '~/types/post'

defineProps<{
  images: UnifiedImage[]
  layout: string
}>()
</script>

<style scoped>
.post-images {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.layout-waterfall,
.layout-grid,
.layout-none {
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

.layout-horizontal {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.layout-carousel,
.layout-stack {
  grid-template-columns: 1fr;
}

.post-image-item {
  overflow: hidden;
  border-radius: var(--radius-sm);
}

.post-image {
  width: 100%;
  display: block;
  object-fit: cover;
  cursor: zoom-in;
  border-radius: var(--radius-sm);
  transition: transform 0.2s;
}

.post-image:hover {
  transform: scale(1.02);
}

.post-images:has(.post-image-item:only-child) .post-image {
  max-height: 400px;
  object-fit: contain;
}

.post-images:not(:has(.post-image-item:only-child)) .first-image .post-image {
  aspect-ratio: 16/9;
}
</style>
