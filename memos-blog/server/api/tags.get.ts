export default defineEventHandler(async (event) => {
  const client = getMemosClient(event)
  const tagMap = new Map<string, number>()

  try {
    let pageToken = ''
    let hasMore = true

    while (hasMore) {
      const params: Record<string, any> = { pageSize: 50 }
      if (pageToken) params.pageToken = pageToken

      const data = await client.get('/memos', params) as any

      for (const memo of data.memos || []) {
        if (memo.visibility !== 'PUBLIC') continue
        for (const tag of memo.tags || []) {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
        }
      }

      pageToken = data.nextPageToken || ''
      hasMore = !!pageToken
    }

    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: 'Failed to aggregate tags',
    })
  }
})
