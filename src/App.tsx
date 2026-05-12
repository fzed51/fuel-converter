import { useEffect, useMemo, useState } from 'react'
import { getChange } from './api'
import './App.css'

const CACHE_KEY = 'fuel-converter-rate-cache'
const DIRECTION_KEY = 'fuel-converter-direction'
const SIX_HOURS_MS = 6 * 60 * 60 * 1000
const LITERS_PER_GALLON = 4.54609

type Direction = 'EUR_L_TO_GBP_GAL' | 'GBP_GAL_TO_EUR_L'

type RateCache = {
  eurPerGbp: number
  updatedAt: number
}

const formatWithThreeDecimals = (value: number): string =>
  new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value)

const digitsToValue = (digits: string): number => Number.parseInt(digits, 10) / 1000

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

const loadRate = async (): Promise<RateCache | null> => {
  const cached = readCachedRate()
  if (cached && Date.now() - cached.updatedAt < SIX_HOURS_MS) {
    return cached
  }

  try {
    const eurPerGbp = await getChange()
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

function App() {
  const [digits, setDigits] = useState('0')
  const [direction, setDirection] = useState<Direction>(() => {
    const storedDirection = localStorage.getItem(DIRECTION_KEY)
    if (storedDirection === 'GBP_GAL_TO_EUR_L') {
      return storedDirection
    }
    return 'EUR_L_TO_GBP_GAL'
  })
  const [eurPerGbp, setEurPerGbp] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    localStorage.setItem(DIRECTION_KEY, direction)
  }, [direction])

  useEffect(() => {
    const updateRate = async () => {
      const rate = await loadRate()
      if (rate) {
        setEurPerGbp(rate.eurPerGbp)
      }
    }

    void updateRate()
  }, [])

  const inputValue = useMemo(() => digitsToValue(digits), [digits])
  const resultValue = useMemo(() => {
    if (!eurPerGbp || eurPerGbp <= 0) {
      return null
    }

    if (direction === 'EUR_L_TO_GBP_GAL') {
      return (inputValue * LITERS_PER_GALLON) / eurPerGbp
    }

    return (inputValue / LITERS_PER_GALLON) * eurPerGbp
  }, [direction, eurPerGbp, inputValue])

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

  const fromUnit = direction === 'EUR_L_TO_GBP_GAL' ? '€/l' : '£/gal'
  const toUnit = direction === 'EUR_L_TO_GBP_GAL' ? '£/gal' : '€/l'

  return (
    <main className="app">
      <header className="app-header">
        <h1>Fuel Converter</h1>
        <button
          type="button"
          className="settings-button"
          onClick={() => setShowSettings((value) => !value)}
          aria-label="Paramètres"
        >
          ⚙
        </button>
      </header>

      {showSettings && (
        <section className="settings-panel">
          <p>Sens de conversion</p>
          <button
            type="button"
            className="direction-button"
            onClick={() =>
              setDirection((value) =>
                value === 'EUR_L_TO_GBP_GAL' ? 'GBP_GAL_TO_EUR_L' : 'EUR_L_TO_GBP_GAL',
              )
            }
          >
            {fromUnit} → {toUnit}
          </button>
        </section>
      )}

      <section className="display">
        <p className="result">
          {resultValue === null ? 'Taux indisponible' : `${formatWithThreeDecimals(resultValue)} ${toUnit}`}
        </p>
        <p className="input-value">
          {formatWithThreeDecimals(inputValue)} {fromUnit}
        </p>
      </section>

      <section className="keypad" aria-label="Clavier numérique">
        <div className="digits-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button key={digit} type="button" onClick={() => appendDigit(String(digit))}>
              {digit}
            </button>
          ))}
          <button type="button" onClick={clearDigits}>
            C
          </button>
          <button type="button" onClick={() => appendDigit('0')}>
            0
          </button>
          <button type="button" onClick={removeDigit}>
            ⌫
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
