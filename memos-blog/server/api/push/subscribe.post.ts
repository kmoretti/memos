export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
    throw createError({ statusCode: 400, message: 'Invalid subscription' })
  }

  const added = addSubscription({
    endpoint: body.endpoint,
    keys: { p256dh: body.keys.p256dh, auth: body.keys.auth },
    createdAt: Date.now(),
  })

  return { success: true, added }
})
