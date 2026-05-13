type Props = {
  onDigit: (digit: string) => void
  onClear: () => void
  onBackspace: () => void
}

export function Keypad({ onDigit, onClear, onBackspace }: Props) {
  return (
    <section className="keypad" aria-label="Clavier numérique">
      <div className="digits-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button key={digit} type="button" onClick={() => onDigit(String(digit))}>
            {digit}
          </button>
        ))}
        <button type="button" onClick={onClear}>
          C
        </button>
        <button type="button" onClick={() => onDigit('0')}>
          0
        </button>
        <button type="button" onClick={onBackspace}>
          ⌫
        </button>
      </div>
    </section>
  )
}
