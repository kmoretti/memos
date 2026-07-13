<template>
  <div class="reaction-bar" v-if="grouped.length > 0">
    <span
      v-for="g in grouped"
      :key="g.emoji"
      class="reaction-chip"
    >
      {{ g.emoji }} {{ g.count }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { MemosReaction } from '~/types/memo'

const props = defineProps<{
  memoId: string
  reactions: MemosReaction[]
}>()

const grouped = computed(() => {
  const groups: Record<string, number> = {}
  for (const r of props.reactions) {
    const emoji = r.reactionType || '?'
    groups[emoji] = (groups[emoji] || 0) + 1
  }
  return Object.entries(groups).map(([emoji, count]) => ({
    emoji,
    count,
  }))
})
</script>

<style scoped>
.reaction-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--border);
}
.reaction-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--reaction-bg);
  color: var(--text);
  font-size: 0.85rem;
}
</style>
