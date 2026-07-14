export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const ds = getDataSource()

  try {
    return await ds.query({
      page: Number(query.page) || 1,
      pageSize: Number(query.pageSize) || 20,
      search: query.search as string,
      tag: query.tag as string,
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.message || error.message || 'Failed to fetch posts',
    })
  }
})
