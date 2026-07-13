export function usePushNotification() {
  const config = useRuntimeConfig()
  const isSupported = ref(false)
  const permission = ref<NotificationPermission>('default')
  const isSubscribed = ref(false)
  const swRegistration = ref<ServiceWorkerRegistration | null>(null)

  async function init() {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      isSupported.value = false
      return
    }

    isSupported.value = true
    permission.value = Notification.permission

    try {
      const reg = await navigator.serviceWorker.ready
      swRegistration.value = reg

      const subscription = await reg.pushManager?.getSubscription()
      isSubscribed.value = !!subscription
    } catch (e) {
      console.error('Push notification init failed:', e)
    }
  }

  async function requestPermission() {
    if (!isSupported.value) return 'denied'

    const result = await Notification.requestPermission()
    permission.value = result
    return result
  }

  async function subscribe() {
    if (!swRegistration.value || !isSupported.value) return false

    try {
      const perm = await requestPermission()
      if (perm !== 'granted') return false

      const applicationServerKey = urlBase64ToUint8Array(
        config.public.webPushPublicKey
      )

      const subscription = await swRegistration.value.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })

      const subJson = subscription.toJSON()

      // Send subscription to server
      await $fetch('/api/push/subscribe', {
        method: 'POST',
        body: {
          endpoint: subJson.endpoint,
          keys: subJson.keys,
        },
      })

      isSubscribed.value = true
      return true
    } catch (e) {
      console.error('Push subscribe failed:', e)
      return false
    }
  }

  async function unsubscribe() {
    if (!swRegistration.value) return false

    try {
      const subscription = await swRegistration.value.pushManager.getSubscription()
      if (!subscription) return false

      const endpoint = subscription.endpoint
      await subscription.unsubscribe()

      await $fetch('/api/push/unsubscribe', {
        method: 'POST',
        body: { endpoint },
      })

      isSubscribed.value = false
      return true
    } catch (e) {
      console.error('Push unsubscribe failed:', e)
      return false
    }
  }

  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  onMounted(() => {
    init()
  })

  return {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
  }
}
