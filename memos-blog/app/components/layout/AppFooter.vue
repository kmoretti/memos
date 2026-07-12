<template>
  <footer class="app-footer">
    <div class="footer-inner page-container">
      <p>{{ config.footer.copyright }}</p>
      <p v-if="config.footer.beian">
        <a :href="'https://beian.miit.gov.cn/'" target="_blank">{{ config.footer.beian }}</a>
      </p>
      <p v-if="config.footer.powered">Powered by <a href="https://usememos.com" target="_blank">Memos</a></p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useAppConfig() as any
</script>

<style scoped>
.app-footer {
  border-top: 1px dashed var(--border);
  padding: 2rem 0;
  text-align: center;
  color: var(--text-sub);
  font-size: 0.85rem;
}
.footer-inner {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}
</style>
