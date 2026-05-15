const UNIT_FRACTION_DIGITS: Record<string, number> = {
  '£/gal': 3,
  '€/l': 3,
}

const DEFAULT_FRACTION_DIGITS = 3

export const getUnitFractionDigits = (unit: string): number =>
  UNIT_FRACTION_DIGITS[unit] ?? DEFAULT_FRACTION_DIGITS

export const formatWithFractionDigits = (value: number, fractionDigits: number): string =>
  new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)

export const digitsToValue = (digits: string): number => Number.parseInt(digits, 10) / 1000
