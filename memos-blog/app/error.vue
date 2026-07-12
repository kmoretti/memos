<template>
  <div class="page-container error-page">
    <div class="memo-card" style="text-align: center;">
      <h1>{{ error?.statusCode || 500 }}</h1>
      <p>{{ error?.message || '出错了' }}</p>
      <button class="error-btn" @click="clearError">返回首页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ error: any }>()

function clearError() {
  clearNuxtError({ redirect: '/' })
}
</script>

<style scoped>
.error-page {
  padding-top: 4rem;
  text-align: center;
}
.error-btn {
  margin-top: 1rem;
  padding: 0.6rem 1.5rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
</style>
