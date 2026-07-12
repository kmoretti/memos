import type { MemosReaction } from '~/types/memo'

export function useReaction() {
  const { requireAuth } = useAuth()

  async function toggleReaction(memoId: string, contentId: string) {
    if (!requireAuth()) return null

    try {
      return await $fetch(`/api/memos/${memoId}/reactions`, {
        method: 'POST',
        body: { reactionType: 'REACTION_TYPE_UNSPECIFIED', contentId },
      })
    } catch (error) {
      console.error('Failed to toggle reaction:', error)
      return null
    }
  }

  function groupReactions(reactions: MemosReaction[]) {
    const groups: Record<string, { count: number; creators: string[] }> = {}
    for (const r of reactions) {
      if (!groups[r.contentId]) {
        groups[r.contentId] = { count: 0, creators: [] }
      }
      groups[r.contentId].count++
      groups[r.contentId].creators.push(r.creator)
    }
    return groups
  }

  return { toggleReaction, groupReactions }
}
