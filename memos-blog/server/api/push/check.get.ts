export default defineEventHandler(async () => {
  const lastTime = getLastPushTime()

  try {
    const ds = getDataSource()
    const result = await ds.query({
      page: 1,
      pageSize: 20,
    })

    // Filter posts newer than last push time
    const newPosts = (result.items || []).filter(
      (p: any) => p.createTime > lastTime / 1000
    )

    setLastPushTime(Date.now())

    return { success: true, postCount: newPosts.length }
  } catch (e) {
    throw createError({ statusCode: 500, message: 'Failed to fetch posts' })
  }
})
