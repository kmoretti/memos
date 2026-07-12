<template>
  <div class="reaction-picker" @click.stop>
    <div class="picker-emojis">
      <button
        v-for="emoji in quickEmojis"
        :key="emoji"
        class="emoji-btn"
        @click="$emit('select', emoji)"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ select: [emoji: string] }>()

const quickEmojis = ['👍', '❤️', '😊', '😂', '🤔', '👏', '🎉', '🔥']
</script>

<style scoped>
.reaction-picker {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.5rem;
  box-shadow: var(--shadow-card);
  z-index: 10;
}
.picker-emojis {
  display: flex;
  gap: 0.25rem;
}
.emoji-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.2s;
}
.emoji-btn:hover {
  background: var(--reaction-bg);
}
</style>
