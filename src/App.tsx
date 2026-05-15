import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { AppHeader } from './components/AppHeader'
import { ConversionDisplay } from './components/ConversionDisplay'
import { Keypad } from './components/Keypad'
import { SettingsModal } from './components/SettingsModal'
import { DIRECTION_KEY } from './constants'
import {
  convertValue,
  getDirectionUnits,
  getInitialDirection,
  getNextDirection,
} from './conversion'
import { useDigits } from './hooks/useDigits'
import { useRate } from './hooks/useRate'
import { getUnitFractionDigits } from './utils'

function App() {
  const [direction, setDirection] = useState(() =>
    getInitialDirection(localStorage.getItem(DIRECTION_KEY)),
  )
  const [showSettings, setShowSettings] = useState(false)
  const { fromUnit, toUnit } = getDirectionUnits(direction)

  const { eurPerGbp, rateUpdatedAt, isRefreshing, forceRefresh } = useRate()
  const { inputValue, appendDigit, removeDigit, clearDigits } = useDigits(
    getUnitFractionDigits(fromUnit),
  )

  useEffect(() => {
    localStorage.setItem(DIRECTION_KEY, direction)
  }, [direction])

  const resultValue = useMemo(
    () => convertValue({ direction, inputValue, eurPerGbp }),
    [direction, eurPerGbp, inputValue],
  )

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
          onDirectionToggle={() => setDirection((v) => getNextDirection(v))}
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
