import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import siteData from '../../content/site.json'

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.mp4', '.webm', '.mov']

export default defineEventHandler(async () => {
  const result: Record<string, string[]> = {}
  const works = (siteData as any).selectedWork ?? []

  for (const item of works) {
    const folder = item.folder
    if (!folder || typeof folder !== 'string') continue

    const dir = join(process.cwd(), 'public', 'projects', folder)
    try {
      const dirStat = await stat(dir)
      if (!dirStat.isDirectory()) { result[folder] = []; continue }
      const entries = await readdir(dir, { withFileTypes: true })
      result[folder] = entries
        .filter(e => e.isFile())
        .map(e => e.name)
        .filter(n => IMAGE_EXTENSIONS.some(ext => n.toLowerCase().endsWith(ext)))
        .sort()
        .map(name => `/projects/${encodeURIComponent(folder)}/${encodeURIComponent(name)}`)
    } catch {
      result[folder] = []
    }
  }

  return result
})
