export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const ds = getDataSource()

  try {
    const post = await ds.getById(id!)
    if (!post) {
      throw createError({ statusCode: 404, message: 'Post not found' })
    }
    return post
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.message || error.message || 'Failed to fetch post',
    })
  }
})
