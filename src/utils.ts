export const formatWithThreeDecimals = (value: number): string =>
  new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value)

export const digitsToValue = (digits: string): number => Number.parseInt(digits, 10) / 1000
