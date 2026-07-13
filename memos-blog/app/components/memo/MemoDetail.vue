<template>
  <div class="memo-detail">
    <button class="back-btn" @click="$router.back()">
      <UiIcon name="ph:arrow-left" :size="18" /> 返回
    </button>

    <MemoCard :memo="memo" />

    <div class="comments-section">
      <CommentList :memo-id="memoId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemosMemo } from '~/types/memo'

const props = defineProps<{ memo: MemosMemo }>()

const memoId = computed(() => props.memo.name?.replace('memos/', '') || '')
</script>

<style scoped>
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 1rem;
  padding: 0.4rem 0.8rem;
  background: var(--bg-card);
  border: 1px dashed var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-sub);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}
.back-btn:hover {
  color: var(--text);
  border-color: var(--accent);
}
.comments-section {
  margin-top: 1.5rem;
}
</style>
