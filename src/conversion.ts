import { LITERS_PER_GALLON } from './constants'
import type { Direction } from './types'

type DirectionUnits = { fromUnit: string; toUnit: string }

const DEFAULT_DIRECTION: Direction = 'EUR_L_TO_GBP_GAL'

const VALID_DIRECTIONS: Direction[] = [
  'EUR_L_TO_GBP_GAL',
  'GBP_GAL_TO_EUR_L',
  'EUR_L_TO_PENCE_L',
  'PENCE_L_TO_EUR_L',
  'EUR_TO_GBP',
  'GBP_TO_EUR',
]

const NEXT_DIRECTION: Record<Direction, Direction> = {
  EUR_L_TO_GBP_GAL: 'GBP_GAL_TO_EUR_L',
  GBP_GAL_TO_EUR_L: 'EUR_L_TO_PENCE_L',
  EUR_L_TO_PENCE_L: 'PENCE_L_TO_EUR_L',
  PENCE_L_TO_EUR_L: 'EUR_TO_GBP',
  EUR_TO_GBP: 'GBP_TO_EUR',
  GBP_TO_EUR: 'EUR_L_TO_GBP_GAL',
}

const DIRECTION_UNITS: Record<Direction, DirectionUnits> = {
  EUR_L_TO_GBP_GAL: { fromUnit: '€/l', toUnit: '£/gal' },
  GBP_GAL_TO_EUR_L: { fromUnit: '£/gal', toUnit: '€/l' },
  EUR_L_TO_PENCE_L: { fromUnit: '€/l', toUnit: 'pence/l' },
  PENCE_L_TO_EUR_L: { fromUnit: 'pence/l', toUnit: '€/l' },
  EUR_TO_GBP: { fromUnit: '€', toUnit: '£' },
  GBP_TO_EUR: { fromUnit: '£', toUnit: '€' },
}

export const getInitialDirection = (storedDirection: string | null): Direction =>
  isDirection(storedDirection) ? storedDirection : DEFAULT_DIRECTION

export const getNextDirection = (direction: Direction): Direction => NEXT_DIRECTION[direction]

export const getDirectionUnits = (direction: Direction): DirectionUnits => DIRECTION_UNITS[direction]

export const convertValue = ({
  direction,
  inputValue,
  eurPerGbp,
}: {
  direction: Direction
  inputValue: number
  eurPerGbp: number | null
}): number | null => {
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
}

function isDirection(value: string | null): value is Direction {
  return value !== null && VALID_DIRECTIONS.includes(value as Direction)
}
