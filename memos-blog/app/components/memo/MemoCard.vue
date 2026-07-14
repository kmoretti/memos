<template>
  <article class="memo-card" :class="{ 'tape-decoration': config.theme.paper.tapeDecoration }">
    <header class="memo-header">
      <img :src="avatarUrl" class="memo-avatar" :alt="displayName" />
      <div class="memo-meta">
        <span class="memo-author">{{ displayName }}</span>
        <span v-if="post.pinned" class="memo-pin-badge">置顶</span>
      </div>
      <MemoTime :time="post.createTime" />
    </header>

    <div class="memo-content">
      <UiImageLightbox>
        <UiMarkdownRenderer :content="post.content" />
      </UiImageLightbox>
    </div>

    <UiPostImages
      v-if="post.images?.length"
      :images="post.images"
      :layout="post.layout"
    />

    <UiPostExtension
      v-for="ext in post.extensions"
      :key="ext.type"
      :extension="ext"
    />

    <MemoLocation v-if="post.location" :location="post.location" />

    <div v-if="post.likes > 0" class="memo-likes">
      <UiIcon name="ph:heart" :size="14" /> {{ post.likes }}
    </div>

    <NuxtLink :to="`/memo/${post.id}`" class="memo-detail-link" v-if="showDetailLink">
      查看详情 →
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { UnifiedPost } from '~/types/post'

const props = withDefaults(defineProps<{
  post: UnifiedPost
  showDetailLink?: boolean
}>(), {
  showDetailLink: false,
})

const config = useAppConfig() as any

const displayName = computed(() => config.site.author || '作者')
const avatarUrl = computed(() => config.site.avatar || '/avatar.png')
</script>

<style scoped>
.memo-detail-link {
  display: inline-block;
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-link);
}
.memo-likes {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-sub);
}
</style>
