export function useMemos(extraFilter?: string) {
  const posts = ref<any[]>([])
  const loading = ref(false)
  const page = ref(1)
  const hasMore = ref(true)
  const config = useAppConfig() as any

  async function fetchPosts(initial = false) {
    if (loading.value) return
    if (!initial && !hasMore.value) return

    loading.value = true

    try {
      const pageSize = config.memos?.pageSize || 10

      if (initial) {
        page.value = 1
      }

      const params: Record<string, any> = {
        page: page.value,
        pageSize,
      }

      if (extraFilter) {
        const tagMatch = extraFilter.match(/tag in \['(.+?)'\]/)
        if (tagMatch) {
          params.tag = tagMatch[1]
        }
      }

      const data = await $fetch('/api/memos', { params }) as any

      if (initial) {
        posts.value = data.items || []
      } else {
        posts.value.push(...(data.items || []))
      }

      const returnedCount = data.items?.length || 0
      hasMore.value = returnedCount >= pageSize

      if (hasMore.value) {
        page.value++
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      loading.value = false
    }
  }

  function loadMore() {
    fetchPosts(false)
  }

  return { posts, loading, hasMore, fetchPosts, loadMore }
}
