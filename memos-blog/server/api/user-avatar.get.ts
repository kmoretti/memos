export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const creator = query.creator as string // e.g. "users/kemiao"

  if (!creator) {
    throw createError({ statusCode: 400, message: 'Missing creator parameter' })
  }

  const client = getMemosClient(event)

  try {
    // Fetch user profile from Memos API
    const user = await client.get(`/${creator}`) as any

    // Try to get avatar from user profile
    // Memos user profile may have avatarUrl, avatar, or we can use email for Gravatar
    let avatarUrl = ''

    if (user.avatarUrl) {
      avatarUrl = user.avatarUrl
    } else if (user.avatar) {
      avatarUrl = user.avatar
    } else if (user.email) {
      // Use Gravatar with MD5 of email
      // We'll compute MD5 on the client side, so return the email
      avatarUrl = `gravatar:${user.email}`
    }

    return { avatarUrl, nickname: user.nickname || user.username || creator.split('/').pop() }
  } catch (error) {
    // If user fetch fails, return empty to use fallback
    return { avatarUrl: '', nickname: creator.split('/').pop() || '' }
  }
})
