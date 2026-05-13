import { formatWithThreeDecimals } from '../utils'

type Props = {
  inputValue: number
  resultValue: number | null
  fromUnit: string
  toUnit: string
}

export function ConversionDisplay({ inputValue, resultValue, fromUnit, toUnit }: Props) {
  return (
    <section className="display">
      <p className={`result${resultValue === null ? ' result--error' : ''}`}>
        {resultValue === null
          ? 'Taux indisponible'
          : `${formatWithThreeDecimals(resultValue)} ${toUnit}`}
      </p>
      <p className="input-value">
        {formatWithThreeDecimals(inputValue)} {fromUnit}
      </p>
    </section>
  )
}
