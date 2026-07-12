export function useAuth() {
  const store = useAuthStore()
  const showLoginModal = ref(false)

  function requireAuth(): boolean {
    if (store.isLoggedIn) return true
    showLoginModal.value = true
    return false
  }

  async function login(username: string, password: string) {
    const response = await $fetch('/api/auth', {
      method: 'POST',
      body: { username, password },
    })
    const data = response as any
    store.setAuth(data.accessToken, username)
    showLoginModal.value = false
    return data
  }

  function logout() {
    store.logout()
  }

  return {
    isLoggedIn: computed(() => store.isLoggedIn),
    username: computed(() => store.username),
    showLoginModal,
    requireAuth,
    login,
    logout,
  }
}
