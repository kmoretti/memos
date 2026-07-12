<template>
  <div class="page-container">
    <div v-if="pending" class="scroll-loading">加载中...</div>
    <div v-else-if="error" class="scroll-loading">内容不存在</div>
    <MemoDetail v-else-if="memo" :memo="memo" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { data: memo, pending, error } = await useFetch(`/api/memos/${id}`)

useHead({
  title: (memo.value as any)?.snippet || 'Memo 详情',
})
</script>
