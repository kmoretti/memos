<template>
  <Teleport to="body">
    <div v-if="visible" class="login-overlay" @click.self="$emit('close')">
      <div class="login-modal memo-card">
        <h3>登录 Memos</h3>
        <form @submit.prevent="handleLogin">
          <input v-model="username" placeholder="用户名" required class="login-input" />
          <input v-model="password" type="password" placeholder="密码" required class="login-input" />
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
          <p v-if="error" class="login-error">{{ error }}</p>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>()
defineEmits<{ close: [] }>()

const { login } = useAuth()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await login(username.value, password.value)
  } catch (e: any) {
    error.value = e.data?.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.login-modal {
  width: 90%;
  max-width: 380px;
}
.login-modal h3 {
  margin-bottom: 1rem;
}
.login-input {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
}
.login-btn {
  width: 100%;
  padding: 0.6rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 1rem;
}
.login-error {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
</style>
