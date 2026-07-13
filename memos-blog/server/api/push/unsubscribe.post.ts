export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.endpoint) {
    throw createError({ statusCode: 400, message: 'Endpoint required' })
  }

  const removed = removeSubscription(body.endpoint)

  return { success: true, removed }
})
