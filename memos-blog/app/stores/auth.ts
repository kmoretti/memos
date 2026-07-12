import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    username: '' as string,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setAuth(token: string, username: string) {
      this.token = token
      this.username = username
      if (import.meta.client) {
        localStorage.setItem('memos_token', token)
        localStorage.setItem('memos_username', username)
      }
    },
    loadFromStorage() {
      if (import.meta.client) {
        this.token = localStorage.getItem('memos_token') || ''
        this.username = localStorage.getItem('memos_username') || ''
      }
    },
    logout() {
      this.token = ''
      this.username = ''
      if (import.meta.client) {
        localStorage.removeItem('memos_token')
        localStorage.removeItem('memos_username')
      }
    },
  },
})
