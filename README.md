# fuel-converter

Mini app web (Vite + React + TypeScript + PWA) pour convertir :
- `€/l` vers `£/gal`
- `£/gal` vers `€/l`
- `€/l` vers `pence/l`
- `pence/l` vers `€/l`

## Fonctionnalités

- Taux de change via `https://api.frankfurter.app/latest?from=GBP&to=EUR`
- Cache du taux pendant 6h (fallback sur le dernier taux en cas d'échec réseau)
- Mémorisation du sens de conversion
- Clavier numérique intégré, sans saisie de virgule
- Saisie au millième (ex: `1` => `0,001`, `1234` => `1,234`)

## Lancer le projet

```bash
npm install
npm run dev
```

## Vérifications

```bash
npm run lint
npm run build
```
