<template>
  <div class="comment-section">
    <button class="comment-toggle" @click="expanded = !expanded" v-if="!expanded">
      💬 {{ count }}条评论 ▾
    </button>

    <div v-if="expanded">
      <CommentItem
        v-for="comment in comments"
        :key="comment.name"
        :comment="comment"
      />

      <CommentForm :memo-id="memoId" @posted="fetchComments" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemosMemo } from '~/types/memo'

const props = withDefaults(defineProps<{
  memoId: string
  count?: number
}>(), {
  count: 0,
})

const expanded = ref(false)
const comments = ref<MemosMemo[]>([])

async function fetchComments() {
  try {
    const data = await $fetch(`/api/memos/${props.memoId}/comments`) as any
    comments.value = data.memos || []
  } catch (e) {
    console.error('Failed to fetch comments:', e)
  }
}

watch(expanded, (val) => {
  if (val && comments.value.length === 0) {
    fetchComments()
  }
})
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
</style>
