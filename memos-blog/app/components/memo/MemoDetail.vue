<template>
  <div class="memo-detail">
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
.comments-section {
  margin-top: 1.5rem;
}
</style>
