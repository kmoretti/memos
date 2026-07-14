export default defineEventHandler(async () => {
  const ds = getDataSource()

  try {
    return await ds.getTags()
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch tags',
    })
  }
})
