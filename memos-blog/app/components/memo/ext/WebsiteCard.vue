<template>
  <a :href="payload.site || '#'" target="_blank" rel="noopener" class="website-card">
    <div class="website-card-info">
      <span class="website-card-title">{{ payload.title || '链接' }}</span>
      <span class="website-card-site">{{ getDomain(payload.site) }}</span>
    </div>
    <UiIcon name="ph:arrow-up-right" :size="16" class="website-card-icon" />
  </a>
</template>

<script setup lang="ts">
const props = defineProps<{ payload: Record<string, any> }>()

function getDomain(url: string) {
  try { return new URL(url).hostname } catch { return url }
}
</script>

<style scoped>
.website-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  margin-top: 0.75rem;
  background: var(--reaction-bg);
  border: 1px dashed var(--border);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--text);
  transition: all 0.2s;
}
.website-card:hover {
  background: var(--reaction-active-bg);
  text-decoration: none;
}
.website-card-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}
.website-card-title {
  font-weight: 600;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.website-card-site {
  font-size: 0.75rem;
  color: var(--text-sub);
}
.website-card-icon {
  flex-shrink: 0;
  color: var(--text-sub);
}
</style>
