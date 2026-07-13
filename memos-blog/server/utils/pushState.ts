// Track last push time for detecting new memos
// In-memory state - resets on server restart

let lastPushTime = Date.now()

export function getLastPushTime(): number {
  return lastPushTime
}

export function setLastPushTime(time: number): void {
  lastPushTime = time
}
