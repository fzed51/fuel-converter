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

function App() {
  const [direction, setDirection] = useState<Direction>(() => {
    const storedDirection = localStorage.getItem(DIRECTION_KEY)
    if (storedDirection === 'GBP_GAL_TO_EUR_L') {
      return storedDirection
    }
    return 'EUR_L_TO_GBP_GAL'
  })
  const [showSettings, setShowSettings] = useState(false)

  const { eurPerGbp, rateUpdatedAt, isRefreshing, forceRefresh } = useRate()
  const { inputValue, appendDigit, removeDigit, clearDigits } = useDigits()

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

    return (inputValue / LITERS_PER_GALLON) * eurPerGbp
  }, [direction, eurPerGbp, inputValue])

  const fromUnit = direction === 'EUR_L_TO_GBP_GAL' ? '€/l' : '£/gal'
  const toUnit = direction === 'EUR_L_TO_GBP_GAL' ? '£/gal' : '€/l'

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
          onDirectionToggle={() =>
            setDirection((v) => (v === 'EUR_L_TO_GBP_GAL' ? 'GBP_GAL_TO_EUR_L' : 'EUR_L_TO_GBP_GAL'))
          }
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
