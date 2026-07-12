export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const client = getMemosClient(event)

  try {
    return await client.get(`/memos/${id}/comments`)
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.message || 'Failed to fetch comments',
    })
  }
})
