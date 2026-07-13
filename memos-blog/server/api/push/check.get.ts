import webPush from 'web-push'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const lastTime = getLastPushTime()

  // Configure web-push with VAPID keys
  webPush.setVapidDetails(
    'mailto:kemiao@example.com',
    config.public.webPushPublicKey,
    config.webPushPrivateKey
  )

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

  if (newMemos.length === 0) {
    return { success: true, pushed: 0 }
  }

  // Push notifications to all subscribers
  const subscriptions = getAllSubscriptions()
  let pushedCount = 0

  for (const sub of subscriptions) {
    try {
      for (const memo of newMemos) {
        const content = (memo.content || '').slice(0, 50)
        const memoId = memo.name?.split('/').pop() || ''
        const payload = JSON.stringify({
          title: '克喵的朋友圈',
          body: content || '新动态',
          icon: '/icon.png',
          badge: '/icon.png',
          url: `/memo/${memoId}`,
        })

        await webPush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload
        )
      }
      pushedCount++
    } catch (e: any) {
      // Subscription expired or invalid, remove it
      if (e.statusCode === 404 || e.statusCode === 410) {
        removeSubscription(sub.endpoint)
      }
    }
  }

  // Update last push time
  setLastPushTime(Date.now())

  return { success: true, pushed: pushedCount, memoCount: newMemos.length }
})
