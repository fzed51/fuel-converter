export type Direction =
  | 'EUR_L_TO_GBP_GAL'
  | 'GBP_GAL_TO_EUR_L'
  | 'EUR_L_TO_PENCE_L'
  | 'PENCE_L_TO_EUR_L'

export type RateCache = {
  eurPerGbp: number
  updatedAt: number
}
