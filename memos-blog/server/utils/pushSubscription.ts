// In-memory push subscription storage
// For production, use a database or file-based storage

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
  userId?: string
  createdAt: number
}

const subscriptions = new Map<string, PushSubscription>()

export function addSubscription(sub: PushSubscription): boolean {
  const key = sub.endpoint
  if (subscriptions.has(key)) return false
  subscriptions.set(key, { ...sub, createdAt: Date.now() })
  return true
}

export function removeSubscription(endpoint: string): boolean {
  return subscriptions.delete(endpoint)
}

export function getAllSubscriptions(): PushSubscription[] {
  return Array.from(subscriptions.values())
}

export function getSubscriptionCount(): number {
  return subscriptions.size
}
