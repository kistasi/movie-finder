const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || ''
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export interface TMDBMovie {
  id: number
  title: string
  overview: string
  release_date: string
  vote_average: number
  media_type?: string
}

interface TMDBSearchResponse {
  results: TMDBMovie[]
}

export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured')
  }

  const url = new URL(`${TMDB_BASE_URL}/search/movie`)
  url.searchParams.append('api_key', TMDB_API_KEY)
  url.searchParams.append('query', query)

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`)
  }

  const data: TMDBSearchResponse = await response.json()
  return data.results
}
