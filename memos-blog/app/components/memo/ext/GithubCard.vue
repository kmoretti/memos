<template>
  <a :href="payload.repoUrl || '#'" target="_blank" rel="noopener" class="github-card">
    <div class="github-card-icon">
      <UiIcon name="ph:github-logo" :size="24" />
    </div>
    <div class="github-card-info">
      <span class="github-card-title">{{ repoName }}</span>
      <span class="github-card-url">{{ repoOwner }}</span>
    </div>
    <UiIcon name="ph:arrow-up-right" :size="16" class="github-card-arrow" />
  </a>
</template>

<script setup lang="ts">
const props = defineProps<{ payload: Record<string, any> }>()

const repoName = computed(() => {
  const url = props.payload.repoUrl || ''
  const parts = url.replace(/\/$/, '').split('/')
  return parts[parts.length - 1] || 'GitHub 项目'
})

const repoOwner = computed(() => {
  const url = props.payload.repoUrl || ''
  const parts = url.replace(/\/$/, '').split('/')
  return parts.length >= 2 ? parts[parts.length - 2] + '/' + parts[parts.length - 1] : url
})
</script>

<style scoped>
.github-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-top: 0.75rem;
  background: var(--reaction-bg);
  border: 1px dashed var(--border);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--text);
  transition: all 0.2s;
}
.github-card:hover {
  background: var(--reaction-active-bg);
  text-decoration: none;
}
.github-card-icon {
  flex-shrink: 0;
  color: var(--text);
}
.github-card-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
  flex: 1;
}
.github-card-title {
  font-weight: 600;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.github-card-url {
  font-size: 0.75rem;
  color: var(--text-sub);
}
.github-card-arrow {
  flex-shrink: 0;
  color: var(--text-sub);
}
</style>
