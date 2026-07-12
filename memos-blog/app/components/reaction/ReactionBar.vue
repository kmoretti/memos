<template>
  <div class="reaction-bar" v-if="grouped.length > 0 || showPicker">
    <button
      v-for="g in grouped"
      :key="g.contentId"
      class="reaction-chip"
      @click="handleToggle(g.contentId)"
    >
      {{ g.contentId }} {{ g.count }}
    </button>

    <div class="reaction-add-wrapper" style="position: relative;">
      <button class="reaction-add" @click="showPicker = !showPicker">
        <UiIcon name="ph:smiley-plus" :size="16" />
      </button>
      <ReactionPicker
        v-if="showPicker"
        @select="handleAdd"
        @click="showPicker = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemosReaction } from '~/types/memo'

const props = defineProps<{
  memoId: string
  reactions: MemosReaction[]
}>()

const { toggleReaction, groupReactions } = useReaction()
const { requireAuth } = useAuth()
const showPicker = ref(false)

const grouped = computed(() => {
  const groups = groupReactions(props.reactions)
  return Object.entries(groups).map(([contentId, data]) => ({
    contentId,
    count: data.count,
  }))
})

async function handleToggle(contentId: string) {
  await toggleReaction(props.memoId, contentId)
}

async function handleAdd(emoji: string) {
  showPicker.value = false
  await toggleReaction(props.memoId, emoji)
}
</script>
