import type {
  WikipediaSearchResult,
  WikipediaSummary,
  WikipediaData,
} from '../types/wikipedia'

export async function searchWikipedia(
  title: string
): Promise<WikipediaData | null> {
  try {
    const searchResponse = await fetch(
      `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(title)}&limit=1`
    )

    if (!searchResponse.ok) {
      throw new Error('Failed to search Wikipedia')
    }

    const searchData: WikipediaSearchResult = await searchResponse.json()

    if (!searchData.pages || searchData.pages.length === 0) {
      return null
    }

    const pageTitle = searchData.pages[0].key

    const summaryResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`
    )

    if (!summaryResponse.ok) {
      throw new Error('Failed to fetch Wikipedia summary')
    }

    const summaryData: WikipediaSummary = await summaryResponse.json()

    return {
      summary: summaryData.extract,
      url: summaryData.content_urls.desktop.page,
    }
  } catch (error) {
    console.error('Error fetching Wikipedia data:', error)
    return null
  }
}
