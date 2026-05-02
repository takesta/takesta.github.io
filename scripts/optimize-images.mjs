import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const assetsDir = path.join(__dirname, '../public/assets')
const heroSrc = path.join(assetsDir, 'hero-image.jpg')

if (!existsSync(heroSrc)) {
  console.error('hero-image.jpg not found')
  process.exit(1)
}

const heroSizes = [
  { width: 1920, suffix: '-1920' },
  { width: 1280, suffix: '-1280' },
  { width: 768, suffix: '-768' },
]

console.log('Generating hero WebP variants...')
for (const { width, suffix } of heroSizes) {
  const outPath = path.join(assetsDir, `hero-image${suffix}.webp`)
  await sharp(heroSrc)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outPath)
  const { size } = (await import('fs')).statSync(outPath)
  console.log(`  ${path.basename(outPath)}: ${(size / 1024).toFixed(0)} KB`)
}

console.log('Generating fallback compressed JPEG...')
const fallbackPath = path.join(assetsDir, 'hero-image-1920.jpg')
await sharp(heroSrc)
  .resize(1920, null, { withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(fallbackPath)
const { size: fallbackSize } = (await import('fs')).statSync(fallbackPath)
console.log(`  hero-image-1920.jpg: ${(fallbackSize / 1024).toFixed(0)} KB`)

console.log('Generating OGP image (1200x630)...')
const ogpPath = path.join(assetsDir, 'ogp-image.jpg')
await sharp(heroSrc)
  .resize(1200, 630, { fit: 'cover', position: 'center' })
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(ogpPath)
const { size: ogpSize } = (await import('fs')).statSync(ogpPath)
console.log(`  ogp-image.jpg: ${(ogpSize / 1024).toFixed(0)} KB`)

console.log('Done.')
