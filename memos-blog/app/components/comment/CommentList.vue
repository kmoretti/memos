<template>
  <div class="comment-section">
    <button
      class="comment-toggle"
      @click="toggleExpand"
    >
      💬 {{ expanded ? '收起评论' : '查看评论' }}
      <span v-if="!expanded && actualCount > 0" class="comment-count">({{ actualCount }})</span>
      <span v-if="!expanded"> ▾</span>
    </button>

    <div v-if="expanded" class="comment-list">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
      <div v-if="loading" class="comment-loading">加载中...</div>
      <div v-else-if="comments.length === 0" class="comment-empty">暂无评论</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UnifiedComment } from '~/types/post'

const props = defineProps<{
  postId: string
}>()

const expanded = ref(false)
const comments = ref<UnifiedComment[]>([])
const actualCount = ref(0)
const loading = ref(false)

async function fetchComments() {
  loading.value = true
  try {
    const data = await $fetch(`/api/memos/${props.postId}/comments`) as any
    comments.value = Array.isArray(data) ? data : []
    actualCount.value = comments.value.length
  } catch (e) {
    console.error('Failed to fetch comments:', e)
  } finally {
    loading.value = false
  }
}

function toggleExpand() {
  expanded.value = !expanded.value
  if (expanded.value && comments.value.length === 0) {
    fetchComments()
  }
}
</script>

<style scoped>
.comment-toggle {
  background: none;
  border: none;
  color: var(--text-sub);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.5rem 0;
}
.comment-count {
  color: var(--text-link);
}
.comment-list {
  margin-top: 0.5rem;
}
.comment-empty {
  color: var(--text-sub);
  font-size: 0.85rem;
  padding: 0.5rem 0;
}
.comment-loading {
  color: var(--text-sub);
  font-size: 0.85rem;
  padding: 0.5rem 0;
}
</style>
