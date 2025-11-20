export interface WikipediaSearchResult {
  pages: Array<{
    id: number
    key: string
    title: string
  }>
}

export interface WikipediaSummary {
  title: string
  extract: string
  content_urls: {
    desktop: {
      page: string
    }
  }
}

export interface WikipediaData {
  summary: string
  url: string
}
