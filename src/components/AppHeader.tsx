type Props = {
  onSettingsClick: () => void
}

export function AppHeader({ onSettingsClick }: Props) {
  return (
    <header className="app-header">
      <h1>Fuel Converter</h1>
      <button
        type="button"
        className="settings-button"
        onClick={onSettingsClick}
        aria-label="Paramètres"
      >
        ⚙
      </button>
    </header>
  )
}
