import { formatWithFractionDigits, getUnitFractionDigits } from '../utils'

type Props = {
  inputValue: number
  resultValue: number | null
  fromUnit: string
  toUnit: string
}

export function ConversionDisplay({ inputValue, resultValue, fromUnit, toUnit }: Props) {
  const inputFractionDigits = getUnitFractionDigits(fromUnit)
  const resultFractionDigits = getUnitFractionDigits(toUnit)

  return (
    <section className="display">
      <p className={`result${resultValue === null ? ' result--error' : ''}`}>
        {resultValue === null
          ? 'Taux indisponible'
          : `${formatWithFractionDigits(resultValue, resultFractionDigits)} ${toUnit}`}
      </p>
      <p className="input-value">
        {formatWithFractionDigits(inputValue, inputFractionDigits)} {fromUnit}
      </p>
    </section>
  )
}
