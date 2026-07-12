<template>
  <div class="page-container">
    <MemoList />
  </div>
</template>

<script setup lang="ts">
const config = useAppConfig() as any

useHead({
  title: config.site.title,
})
</script>
