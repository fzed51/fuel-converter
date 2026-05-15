const UNIT_FRACTION_DIGITS: Record<string, number> = {
  '€/l': 3,
  '£/gal': 3,
  'pence/l': 1,
  '€': 2,
  '£': 2,
}

const DEFAULT_FRACTION_DIGITS = 3

export const getUnitFractionDigits = (unit: string): number =>
  UNIT_FRACTION_DIGITS[unit] ?? DEFAULT_FRACTION_DIGITS

export const formatWithFractionDigits = (value: number, fractionDigits: number): string =>
  new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)

export const digitsToValue = (digits: string, fractionDigits = 3): number =>
  Number.parseInt(digits, 10) / 10 ** fractionDigits
