export default defineEventHandler(async (event) => {
  const lastTime = getLastPushTime()

  // Fetch memos newer than last push time
  let newMemos: any[] = []
  try {
    const client = getMemosClient(event)
    const filter = `createTime > "${new Date(lastTime).toISOString()}"`
    const data = await client.get('/memos', {
      pageSize: 20,
      filter,
    })
    newMemos = data.memos || []
  } catch (e) {
    throw createError({ statusCode: 500, message: 'Failed to fetch memos' })
  }

  // Update last push time
  setLastPushTime(Date.now())

  return { success: true, memoCount: newMemos.length }
})
