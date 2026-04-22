import { copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const indexPath = resolve('dist', 'index.html')
const fallbackPath = resolve('dist', '404.html')

if (!existsSync(indexPath)) {
  console.error('Missing build output: dist/index.html')
  process.exit(1)
}

await copyFile(indexPath, fallbackPath)

console.log('Copied dist/index.html to dist/404.html for GitHub Pages SPA routing.')
