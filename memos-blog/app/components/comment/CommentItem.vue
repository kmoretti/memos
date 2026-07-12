<template>
  <div class="comment-item">
    <img :src="avatarUrl" class="comment-avatar" :alt="displayName" />
    <div class="comment-body">
      <span class="comment-author">{{ displayName }}</span>
      <UiMarkdownRenderer :content="comment.content" />
      <span class="comment-time">{{ formatRelativeTime(comment.createTime) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemosMemo } from '~/types/memo'

const props = defineProps<{ comment: MemosMemo }>()

const config = useAppConfig() as any
const displayName = computed(() => config.site.author || '评论者')
const avatarUrl = computed(() => config.site.avatar || '/avatar.png')
</script>

<style scoped>
.comment-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px dashed var(--border);
}
.comment-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}
.comment-author {
  font-weight: 600;
  font-size: 0.85rem;
  margin-right: 0.5rem;
}
.comment-time {
  font-size: 0.75rem;
  color: var(--text-sub);
  margin-left: 0.5rem;
}
</style>
