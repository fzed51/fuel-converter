import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { AppHeader } from './components/AppHeader'
import { ConversionDisplay } from './components/ConversionDisplay'
import { Keypad } from './components/Keypad'
import { SettingsModal } from './components/SettingsModal'
import { DIRECTION_KEY, LITERS_PER_GALLON } from './constants'
import { useDigits } from './hooks/useDigits'
import { useRate } from './hooks/useRate'
import type { Direction } from './types'
import { getUnitFractionDigits } from './utils'

const NEXT_DIRECTION: Record<Direction, Direction> = {
  EUR_L_TO_GBP_GAL: 'GBP_GAL_TO_EUR_L',
  GBP_GAL_TO_EUR_L: 'EUR_L_TO_PENCE_L',
  EUR_L_TO_PENCE_L: 'PENCE_L_TO_EUR_L',
  PENCE_L_TO_EUR_L: 'EUR_TO_GBP',
  EUR_TO_GBP: 'GBP_TO_EUR',
  GBP_TO_EUR: 'EUR_L_TO_GBP_GAL',
}

const DIRECTION_UNITS: Record<Direction, { fromUnit: string; toUnit: string }> = {
  EUR_L_TO_GBP_GAL: { fromUnit: '€/l', toUnit: '£/gal' },
  GBP_GAL_TO_EUR_L: { fromUnit: '£/gal', toUnit: '€/l' },
  EUR_L_TO_PENCE_L: { fromUnit: '€/l', toUnit: 'pence/l' },
  PENCE_L_TO_EUR_L: { fromUnit: 'pence/l', toUnit: '€/l' },
  EUR_TO_GBP: { fromUnit: '€', toUnit: '£' },
  GBP_TO_EUR: { fromUnit: '£', toUnit: '€' },
}

function App() {
  const [direction, setDirection] = useState<Direction>(() => {
    const storedDirection = localStorage.getItem(DIRECTION_KEY)
    if (
      storedDirection === 'EUR_L_TO_GBP_GAL' ||
      storedDirection === 'GBP_GAL_TO_EUR_L' ||
      storedDirection === 'EUR_L_TO_PENCE_L' ||
      storedDirection === 'PENCE_L_TO_EUR_L' ||
      storedDirection === 'EUR_TO_GBP' ||
      storedDirection === 'GBP_TO_EUR'
    ) {
      return storedDirection
    }
    return 'EUR_L_TO_GBP_GAL'
  })
  const [showSettings, setShowSettings] = useState(false)
  const { fromUnit, toUnit } = DIRECTION_UNITS[direction]

  const { eurPerGbp, rateUpdatedAt, isRefreshing, forceRefresh } = useRate()
  const { inputValue, appendDigit, removeDigit, clearDigits } = useDigits(
    getUnitFractionDigits(fromUnit),
  )

  useEffect(() => {
    localStorage.setItem(DIRECTION_KEY, direction)
  }, [direction])

  const resultValue = useMemo(() => {
    if (!eurPerGbp || eurPerGbp <= 0) {
      return null
    }

    if (direction === 'EUR_L_TO_GBP_GAL') {
      return (inputValue * LITERS_PER_GALLON) / eurPerGbp
    }
    if (direction === 'GBP_GAL_TO_EUR_L') {
      return (inputValue / LITERS_PER_GALLON) * eurPerGbp
    }
    if (direction === 'EUR_L_TO_PENCE_L') {
      return (inputValue * 100) / eurPerGbp
    }
    if (direction === 'PENCE_L_TO_EUR_L') {
      return (inputValue * eurPerGbp) / 100
    }
    if (direction === 'EUR_TO_GBP') {
      return inputValue / eurPerGbp
    }
    if (direction === 'GBP_TO_EUR') {
      return inputValue * eurPerGbp
    }

    const unreachableDirection: never = direction
    throw new Error(`Direction non gérée: ${unreachableDirection}`)
  }, [direction, eurPerGbp, inputValue])

  return (
    <main className="app">
      <AppHeader onSettingsClick={() => setShowSettings((v) => !v)} />

      {showSettings && (
        <SettingsModal
          fromUnit={fromUnit}
          toUnit={toUnit}
          eurPerGbp={eurPerGbp}
          rateUpdatedAt={rateUpdatedAt}
          isRefreshing={isRefreshing}
          onClose={() => setShowSettings(false)}
          onDirectionToggle={() => setDirection((v) => NEXT_DIRECTION[v])}
          onForceRefresh={() => void forceRefresh()}
        />
      )}

      <ConversionDisplay
        inputValue={inputValue}
        resultValue={resultValue}
        fromUnit={fromUnit}
        toUnit={toUnit}
      />

      <Keypad onDigit={appendDigit} onClear={clearDigits} onBackspace={removeDigit} />
    </main>
  )
}

export default App
