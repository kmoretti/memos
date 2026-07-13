<template>
  <div class="page-container">
    <h1 class="tags-title">#{{ tag }}</h1>
    <MemoList :filter="filter" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const tag = route.params.tag as string
const config = useAppConfig() as any
const creatorFilter = config.memos?.creator ? `creator == "${config.memos.creator}"` : ''
const filter = creatorFilter ? `tag in ['${tag}'] && ${creatorFilter}` : `tag in ['${tag}']`

useHead({ title: `#${tag}` })
</script>
