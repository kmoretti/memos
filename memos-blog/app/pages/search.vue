<template>
  <div class="page-container search-page">
    <div class="search-header">
      <UiIcon name="ph:magnifying-glass" :size="20" class="search-icon" />
      <input
        v-model="query"
        class="search-input"
        type="text"
        placeholder="搜索说说内容..."
        autofocus
        @input="onSearch"
      />
    </div>

    <div v-if="query.trim()" class="search-results">
      <p v-if="loading" class="search-status">搜索中...</p>
      <p v-else-if="results.length === 0" class="search-status">未找到相关结果</p>
      <div v-else class="memo-list">
        <MemoCard
          v-for="memo in results"
          :key="memo.name"
          :memo="memo"
          show-detail-link
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemosMemo } from '~/types/memo'

const query = ref('')
const results = ref<MemosMemo[]>([])
const loading = ref(false)
const config = useAppConfig() as any

let timer: ReturnType<typeof setTimeout> | null = null

function onSearch() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(fetchSearch, 300)
}

async function fetchSearch() {
  const keyword = query.value.trim()
  if (!keyword) {
    results.value = []
    return
  }

  loading.value = true
  try {
    const params: Record<string, any> = {
      pageSize: 50,
      filter: `content.contains("${keyword}")`,
    }
    if (config.memos?.creator) {
      params.filter += ` && creator == "${config.memos.creator}"`
    }

    const runtimeConfig = useRuntimeConfig()
    const baseUrl = runtimeConfig.public.memosBaseUrl || 'https://mm.2005815.xyz'
    const token = runtimeConfig.memosAccessToken || ''

    const url = new URL(`${baseUrl}/api/v1/memos`)
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const data = await $fetch(url.toString(), { headers }) as any
    results.value = data.memos || []
  } catch (e) {
    console.error('Search failed:', e)
    results.value = []
  } finally {
    loading.value = false
  }
}

useHead({ title: '搜索' })
</script>

<style scoped>
.search-page {
  padding-top: 2rem;
}
.search-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-card);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
}
.search-icon {
  color: var(--text-sub);
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text);
}
.search-input::placeholder {
  color: var(--text-sub);
}
.search-status {
  color: var(--text-sub);
  font-size: 0.9rem;
  padding: 2rem 0;
  text-align: center;
}
.memo-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
