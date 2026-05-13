import { useEffect, useState } from 'react'
import { loadRate } from '../rateCache'

export function useRate() {
  const [eurPerGbp, setEurPerGbp] = useState<number | null>(null)
  const [rateUpdatedAt, setRateUpdatedAt] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const updateRate = async () => {
      const rate = await loadRate()
      if (rate) {
        setEurPerGbp(rate.eurPerGbp)
        setRateUpdatedAt(rate.updatedAt)
      }
    }

    void updateRate()
  }, [])

  const forceRefresh = async () => {
    setIsRefreshing(true)
    try {
      const rate = await loadRate(true)
      if (rate) {
        setEurPerGbp(rate.eurPerGbp)
        setRateUpdatedAt(rate.updatedAt)
      }
    } finally {
      setIsRefreshing(false)
    }
  }

  return { eurPerGbp, rateUpdatedAt, isRefreshing, forceRefresh }
}
