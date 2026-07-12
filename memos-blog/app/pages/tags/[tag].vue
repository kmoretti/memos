<template>
  <div class="page-container">
    <h1 class="tags-title">#{{ tag }}</h1>
    <MemoList :filter="`tag in ['${tag}']`" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const tag = route.params.tag as string

useHead({ title: `#${tag}` })
</script>
