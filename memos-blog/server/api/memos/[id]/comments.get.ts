export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const ds = getDataSource()

  try {
    return await ds.getComments(id!)
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch comments',
    })
  }
})
