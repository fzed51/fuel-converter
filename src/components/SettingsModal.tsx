
type Props = {
  fromUnit: string
  toUnit: string
  eurPerGbp: number | null
  rateUpdatedAt: number | null
  isRefreshing: boolean
  onClose: () => void
  onDirectionToggle: () => void
  onForceRefresh: () => void
}

export function SettingsModal({
  fromUnit,
  toUnit,
  eurPerGbp,
  rateUpdatedAt,
  isRefreshing,
  onClose,
  onDirectionToggle,
  onForceRefresh,
}: Props) {

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div
        className="settings-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div className="settings-modal-header">
          <h2 id="settings-modal-title">Paramètres</h2>
          <button
            type="button"
            className="settings-close-button"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="settings-section">
          <p className="settings-label">Sens de conversion</p>
          <button type="button" className="direction-button" onClick={onDirectionToggle}>
            {fromUnit} → {toUnit}
          </button>
        </div>

        <div className="settings-section">
          <p className="settings-label">Taux de change EUR / GBP</p>
          <p className="settings-rate">
            {eurPerGbp !== null ? `1 £ = ${eurPerGbp.toFixed(4)} €` : 'Indisponible'}
          </p>
          {rateUpdatedAt !== null && (
            <p className="settings-updated">
              Mis à jour le{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'short',
                timeStyle: 'short',
              }).format(new Date(rateUpdatedAt))}
            </p>
          )}
          <button
            type="button"
            className="refresh-button"
            onClick={onForceRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Mise à jour…' : '↻ Forcer la mise à jour'}
          </button>
        </div>
      </div>
    </div>
  )
}
