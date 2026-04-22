import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
)
const basePath = packageJson.homepage
  ? `${new URL(packageJson.homepage).pathname.replace(/\/$/, '')}/`
  : '/'

// https://vite.dev/config/
export default defineConfig({
  // Keep GitHub Pages asset paths aligned with the repo URL.
  base: basePath,
  plugins: [react()],
})
