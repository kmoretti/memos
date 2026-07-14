<template>
  <div class="page-container">
    <h1 class="tags-title">标签</h1>
    <div class="tags-cloud" v-if="tags">
      <NuxtLink
        v-for="tag in tags"
        :key="tag.name"
        :to="`/tags/${tag.name}`"
        class="tag-chip"
      >
        #{{ tag.name }}
        <span class="tag-count">{{ tag.count }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TagCount } from '~/types/post'

const { data: tags } = await useFetch('/api/tags') as { data: Ref<TagCount[]> }

useHead({ title: '标签' })
</script>

<style scoped>
.tags-title {
  font-family: var(--font-heading);
  margin-bottom: 1.5rem;
}
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 1rem;
  border: var(--border-style) var(--border);
  border-radius: 999px;
  color: var(--text);
  text-decoration: none;
  transition: all 0.2s;
}
.tag-chip:hover {
  background: var(--reaction-active-bg);
  text-decoration: none;
}
.tag-count {
  font-size: 0.8rem;
  color: var(--text-sub);
}
</style>
