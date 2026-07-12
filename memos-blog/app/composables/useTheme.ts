export function useTheme() {
  const isDark = useState('theme-dark', () => false)

  function init() {
    if (!import.meta.client) return
    const saved = localStorage.getItem('memos_theme_mode')
    if (saved === 'dark') {
      isDark.value = true
      document.documentElement.classList.add('dark')
    }
  }

  function toggle() {
    isDark.value = !isDark.value
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', isDark.value)
      localStorage.setItem('memos_theme_mode', isDark.value ? 'dark' : 'light')
    }
  }

  return { isDark, init, toggle }
}
