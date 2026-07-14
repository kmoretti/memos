import type { UnifiedPost, UnifiedPostResponse } from '~/types/post'

export function useMemos(extraFilter?: string) {
  const posts = ref<UnifiedPost[]>([])
  const loading = ref(false)
  const pageToken = ref('')
  const hasMore = ref(true)
  const config = useAppConfig() as any

  async function fetchPosts(initial = false) {
    if (loading.value) return
    if (!initial && !hasMore.value) return

    loading.value = true

    try {
      const params: Record<string, any> = {
        pageSize: config.memos?.pageSize || 20,
      }

      if (initial) {
        pageToken.value = ''
      }

      if (pageToken.value) {
        params.pageToken = pageToken.value
      }

      // Extract tag filter from extraFilter
      if (extraFilter) {
        const tagMatch = extraFilter.match(/tag in \['(.+?)'\]/)
        if (tagMatch) {
          params.tag = tagMatch[1]
        }
      }

      const data = await $fetch('/api/memos', { params }) as UnifiedPostResponse

      if (initial) {
        posts.value = data.items || []
      } else {
        posts.value.push(...(data.items || []))
      }

      pageToken.value = data.nextPageToken || ''
      hasMore.value = !!data.nextPageToken || (data.items?.length === (params.pageSize || 20) && data.items.length > 0)
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
