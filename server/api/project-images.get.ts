import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.mp4', '.webm', '.mov']

export default defineEventHandler(async (event) => {
  const { folder } = getQuery(event)
  if (typeof folder !== 'string' || !folder.length) {
    return { images: [] }
  }

  if (folder.includes('..') || folder.includes('/') || folder.includes('\\')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid folder' })
  }

  const dir = join(process.cwd(), 'public', 'projects', folder)

  try {
    const dirStat = await stat(dir)
    if (!dirStat.isDirectory()) return { images: [] }
  } catch {
    return { images: [] }
  }

  const entries = await readdir(dir, { withFileTypes: true })
  const images = entries
    .filter(e => e.isFile())
    .map(e => e.name)
    .filter(n => IMAGE_EXTENSIONS.some(ext => n.toLowerCase().endsWith(ext)))
    .sort()
    .map(name => `/projects/${encodeURIComponent(folder)}/${encodeURIComponent(name)}`)

  return { images }
})
