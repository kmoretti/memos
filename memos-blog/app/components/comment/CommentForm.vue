<template>
  <div class="comment-form">
    <div class="comment-form-inputs" v-if="!isLoggedIn">
      <input v-model="authorName" placeholder="昵称" required />
      <input v-model="authorEmail" type="email" placeholder="邮箱" required />
    </div>
    <div class="comment-form-main">
      <textarea
        v-model="content"
        placeholder="写下你的评论..."
        rows="2"
        required
      />
      <button class="comment-submit" @click="submit" :disabled="submitting">
        {{ submitting ? '提交中...' : '发表' }}
      </button>
    </div>
    <p v-if="error" class="comment-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ memoId: string }>()
const emit = defineEmits<{ posted: [] }>()

const { isLoggedIn, login } = useAuth()

const authorName = ref('')
const authorEmail = ref('')
const content = ref('')
const submitting = ref(false)
const error = ref('')

async function submit() {
  if (!content.value.trim()) return
  submitting.value = true
  error.value = ''

  try {
    if (!isLoggedIn.value) {
      if (!authorName.value || !authorEmail.value) {
        error.value = '请填写昵称和邮箱'
        submitting.value = false
        return
      }
      await login(authorName.value, authorEmail.value)
    }

    await $fetch(`/api/memos/${props.memoId}/comments`, {
      method: 'POST',
      body: { content: content.value, visibility: 'PUBLIC' },
    })

    content.value = ''
    emit('posted')
  } catch (e: any) {
    error.value = e.data?.message || '提交失败'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.comment-form {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--border);
}
.comment-form-inputs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.comment-form-inputs input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--text);
  font-size: 0.85rem;
}
.comment-form-main {
  display: flex;
  gap: 0.5rem;
}
textarea {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  resize: none;
}
.comment-submit {
  padding: 0.5rem 1rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  align-self: flex-end;
  font-size: 0.85rem;
}
.comment-error {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
</style>
