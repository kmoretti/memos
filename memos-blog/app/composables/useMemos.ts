import type { MemosMemo, MemosListResponse } from '~/types/memo'

export function useMemos() {
  const memos = useState<MemosMemo[]>('memos-list', () => [])
  const loading = ref(false)
  const pageToken = ref('')
  const hasMore = ref(true)

  async function fetchMemos(initial = false) {
    if (loading.value || (!hasMore.value && !initial)) return
    loading.value = true

    try {
      const params: Record<string, any> = { pageSize: 20 }
      if (!initial && pageToken.value) {
        params.pageToken = pageToken.value
      }

      const data = await $fetch('/api/memos', { params }) as MemosListResponse

      if (initial) {
        memos.value = data.memos || []
      } else {
        memos.value.push(...(data.memos || []))
      }

      pageToken.value = data.nextPageToken || ''
      hasMore.value = !!data.nextPageToken
    } catch (error) {
      console.error('Failed to fetch memos:', error)
    } finally {
      loading.value = false
    }
  }

  function loadMore() {
    fetchMemos(false)
  }

  return { memos, loading, hasMore, fetchMemos, loadMore }
}
