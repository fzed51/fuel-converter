import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')) as { version: string }

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  base: '/fuel-converter/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Fuel Converter',
        short_name: 'FuelConverter',
        description: 'Conversion de carburant €/l, £/gal et pence/l',
        theme_color: '#c8c8d0',
        background_color: '#0a0a0f',
        display: 'standalone',
        display_override: ['standalone', 'fullscreen', 'window-controls-overlay'],
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
