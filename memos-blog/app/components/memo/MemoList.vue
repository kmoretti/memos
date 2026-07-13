<template>
  <div class="memo-list">
    <MemoCard
      v-for="memo in memos"
      :key="memo.name"
      :memo="memo"
      show-detail-link
    />

    <div v-if="loading" class="scroll-loading">加载中...</div>
    <div v-else-if="!hasMore && memos.length > 0" class="scroll-nomore">没有更多了</div>

    <UiInfiniteScroll v-if="hasMore && !loading" @intersect="loadMore" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ filter?: string }>()

const { memos, loading, hasMore, fetchMemos, loadMore } = useMemos(props.filter)

onMounted(() => {
  if (memos.value.length === 0) {
    fetchMemos(true)
  }
})
</script>
