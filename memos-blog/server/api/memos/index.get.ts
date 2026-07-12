export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const client = getMemosClient(event)

  const params: Record<string, any> = {
    pageSize: Number(query.pageSize) || 20,
  }
  if (query.pageToken) {
    params.pageToken = query.pageToken
  }
  if (query.filter) {
    params.filter = query.filter
  }

  try {
    return await client.get('/memos', params)
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.message || 'Failed to fetch memos',
    })
  }
})
