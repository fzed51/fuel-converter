import { useMemo, useState } from 'react'
import { digitsToValue } from '../utils'

export function useDigits(fractionDigits = 3) {
  const [digits, setDigits] = useState('0')

  const appendDigit = (digit: string) => {
    setDigits((current) => {
      if (current === '0') {
        return digit
      }
      return `${current}${digit}`.slice(0, 10)
    })
  }

  const removeDigit = () => {
    setDigits((current) => {
      const next = current.slice(0, -1)
      return next === '' ? '0' : next
    })
  }

  const clearDigits = () => setDigits('0')

  const inputValue = useMemo(() => digitsToValue(digits, fractionDigits), [digits, fractionDigits])

  return { inputValue, appendDigit, removeDigit, clearDigits }
}
