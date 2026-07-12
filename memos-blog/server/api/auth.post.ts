export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  try {
    const response = await $fetch(`${config.memosBaseUrl}/api/v1/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        username: body.username,
        password: body.password,
      },
    })
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.data?.message || '登录失败',
    })
  }
})
