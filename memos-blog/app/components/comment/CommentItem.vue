<template>
  <div class="comment-item">
    <img v-if="avatarUrl" :src="avatarUrl" class="comment-avatar" :alt="comment.author" />
    <div v-else class="comment-avatar-placeholder">
      <UiIcon name="ph:user-circle" :size="28" />
    </div>
    <div class="comment-body">
      <span class="comment-author">{{ comment.author }}</span>
      <UiMarkdownRenderer :content="comment.content" />
      <span class="comment-time">{{ formatRelativeTime(comment.createTime * 1000) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UnifiedComment } from '~/types/post'

const props = defineProps<{ comment: UnifiedComment }>()

const config = useAppConfig() as any
const avatarUrl = computed(() => {
  if (props.comment.avatar) return props.comment.avatar
  return config.site?.avatar || ''
})
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
  flex-shrink: 0;
  object-fit: cover;
}
.comment-avatar-placeholder {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  color: var(--text-sub);
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
