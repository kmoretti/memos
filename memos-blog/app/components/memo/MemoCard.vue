<template>
  <article class="memo-card" :class="{ 'tape-decoration': config.theme.paper.tapeDecoration }">
    <header class="memo-header">
      <img :src="avatarUrl" class="memo-avatar" :alt="displayName" />
      <div class="memo-meta">
        <span class="memo-author">{{ displayName }}</span>
        <span v-if="memo.pinned" class="memo-pin-badge">置顶</span>
      </div>
      <MemoTime :time="memo.createTime" />
    </header>

    <div class="memo-content">
      <UiImageLightbox>
        <UiMarkdownRenderer :content="memo.content" />
      </UiImageLightbox>
    </div>

    <MemoAttachment
      v-if="memo.attachments?.length"
      :attachments="memo.attachments"
    />

    <MemoLocation v-if="memo.location" :location="memo.location" />

    <ReactionBar
      :memo-id="memo.name"
      :reactions="memo.reactions || []"
    />

    <NuxtLink :to="`/memo/${memoId}`" class="memo-detail-link" v-if="showDetailLink">
      查看详情 →
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { MemosMemo } from '~/types/memo'

const props = withDefaults(defineProps<{
  memo: MemosMemo
  showDetailLink?: boolean
}>(), {
  showDetailLink: false,
})

const config = useAppConfig() as any

const memoId = computed(() => {
  return props.memo.name?.replace('memos/', '') || ''
})

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
</style>
