export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const client = getMemosClient(event)

  try {
    return await client.post('/memos', {
      content: body.content,
      visibility: body.visibility || 'PUBLIC',
      parent: `memos/${id}`,
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.message || 'Failed to create comment',
    })
  }
})
