export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const client = getMemosClient(event)

  try {
    return await client.post(`/memos/${id}/reactions`, {
      reactionType: body.reactionType,
      contentId: body.contentId,
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.message || 'Failed to upsert reaction',
    })
  }
})
