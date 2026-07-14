<template>
  <div class="memo-list">
    <MemoCard
      v-for="post in posts"
      :key="post.id"
      :post="post"
      show-detail-link
    />

    <div v-if="loading" class="scroll-loading">加载中...</div>
    <div v-else-if="!hasMore && posts.length > 0" class="scroll-nomore">没有更多了</div>
    <button
      v-if="hasMore && !loading && posts.length > 0"
      class="load-more-btn"
      @click="loadMore"
    >
      加载更多
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ filter?: string }>()

const { posts, loading, hasMore, fetchPosts, loadMore } = useMemos(props.filter)

onMounted(() => {
  if (posts.value.length === 0) {
    fetchPosts(true)
  }
})
</script>

<style scoped>
.load-more-btn {
  display: block;
  margin: 2rem auto 0;
  padding: 0.5rem 2rem;
  background: var(--bg-card);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  color: var(--text-sub);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}
.load-more-btn:hover {
  color: var(--text);
  border-color: var(--accent);
}
</style>
