import type { MemosMemo, MemosListResponse } from '~/types/memo'

export function useMemos(extraFilter?: string) {
  const memos = ref<MemosMemo[]>([])
  const loading = ref(false)
  const pageToken = ref('')
  const hasMore = ref(true)

  async function fetchMemos(initial = false) {
    if (loading.value) return
    if (!initial && !hasMore.value) return

    loading.value = true

    try {
      const config = useAppConfig() as any
      const params: Record<string, any> = { pageSize: config.memos?.pageSize || 20 }
      if (!initial && pageToken.value) {
        params.pageToken = pageToken.value
      }

      // Build filter: creator filter from config + optional extra filter
      const filters: string[] = []
      if (config.memos?.creator) {
        filters.push(`creator == "${config.memos.creator}"`)
      }
      if (extraFilter) {
        filters.push(extraFilter)
      }
      if (filters.length > 0) {
        params.filter = filters.join(' && ')
      }

      const runtimeConfig = useRuntimeConfig()
      const baseUrl = runtimeConfig.public.memosBaseUrl || 'https://mm.2005815.xyz'
      const token = runtimeConfig.memosAccessToken || ''

      const url = new URL(`${baseUrl}/api/v1/memos`)
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value))
        }
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const data = await $fetch(url.toString(), { headers }) as MemosListResponse

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
