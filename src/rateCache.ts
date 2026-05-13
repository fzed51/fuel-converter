import { getEurPerGbpRate } from './api'
import { CACHE_KEY, SIX_HOURS_MS } from './constants'
import type { RateCache } from './types'

const readCachedRate = (): RateCache | null => {
  const raw = localStorage.getItem(CACHE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as RateCache
    if (typeof parsed.eurPerGbp === 'number' && typeof parsed.updatedAt === 'number') {
      return parsed
    }
  } catch {
    return null
  }

  return null
}

export const loadRate = async (force = false): Promise<RateCache | null> => {
  const cached = readCachedRate()
  if (!force && cached && Date.now() - cached.updatedAt < SIX_HOURS_MS) {
    return cached
  }

  try {
    const eurPerGbp = await getEurPerGbpRate()
    const freshRate: RateCache = {
      eurPerGbp,
      updatedAt: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(freshRate))
    return freshRate
  } catch {
    return cached
  }
}
