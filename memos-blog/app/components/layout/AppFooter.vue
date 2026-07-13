<template>
  <footer class="app-footer">
    <div class="footer-inner page-container">
      <div v-if="config.footer.links?.length" class="footer-links">
        <NuxtLink v-for="link in config.footer.links" :key="link.href" :to="link.href" class="footer-link">
          {{ link.text }}
        </NuxtLink>
      </div>
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
.footer-links {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
}
.footer-link {
  color: var(--text-sub);
  text-decoration: none;
  transition: color 0.2s;
}
.footer-link:hover {
  color: var(--text);
}
</style>
