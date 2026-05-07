import siteData from '~/content/site.json'

export interface WorkItem {
  title: string
  slug: string
  url?: string
  folder?: string
}

export interface SiteContent {
  name: string
  selectedWork: WorkItem[]
  archive: WorkItem[]
  about: string
  blog: { label: string; url: string }
  instagram: { handle: string; url: string }
  email: string
}

export const useSite = (): SiteContent => siteData as SiteContent
