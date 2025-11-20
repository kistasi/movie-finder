const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || ''
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

const CREW_JOBS = {
  DIRECTOR: 'Director',
  SCREENPLAY: 'Screenplay',
  WRITER: 'Writer',
  STORY: 'Story',
} as const

const LIMITS = {
  WRITERS: 3,
  CAST: 5,
} as const

export interface TMDBMovie {
  id: number
  title: string
  overview: string
  release_date: string
  vote_average: number
  media_type?: string
}

export interface TMDBMovieDetails {
  id: number
  title: string
  overview: string
  release_date: string
  vote_average: number
  runtime: number
  genres: Array<{ id: number; name: string }>
  director?: string
  writers: string[]
  cast: string[]
  poster_path?: string
}

interface TMDBSearchResponse {
  results: TMDBMovie[]
}

interface TMDBMovieDetailsResponse {
  id: number
  title: string
  overview: string
  release_date: string
  vote_average: number
  runtime: number
  genres: Array<{ id: number; name: string }>
  poster_path?: string
}

interface TMDBCreditsResponse {
  cast: Array<{ name: string; order: number }>
  crew: Array<{ name: string; job: string }>
}

function validateApiKey(): void {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured')
  }
}

function buildUrl(endpoint: string, params?: Record<string, string>): string {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
  url.searchParams.append('api_key', TMDB_API_KEY)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  return url.toString()
}

function extractDirector(crew: TMDBCreditsResponse['crew']): string | undefined {
  return crew.find((person) => person.job === CREW_JOBS.DIRECTOR)?.name
}

function extractWriters(crew: TMDBCreditsResponse['crew']): string[] {
  const writerJobs = [CREW_JOBS.SCREENPLAY, CREW_JOBS.WRITER, CREW_JOBS.STORY]

  return crew
    .filter((person) => writerJobs.includes(person.job as typeof writerJobs[number]))
    .map((person) => person.name)
    .filter((name, index, self) => self.indexOf(name) === index)
    .slice(0, LIMITS.WRITERS)
}

function extractCast(cast: TMDBCreditsResponse['cast']): string[] {
  return cast
    .sort((a, b) => a.order - b.order)
    .slice(0, LIMITS.CAST)
    .map((person) => person.name)
}

export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  validateApiKey()

  const url = buildUrl('/search/movie', { query })
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`)
  }

  const data: TMDBSearchResponse = await response.json()
  return data.results
}

export async function getMovieDetails(
  movieId: number
): Promise<TMDBMovieDetails | null> {
  validateApiKey()

  try {
    const detailsUrl = buildUrl(`/movie/${movieId}`)
    const creditsUrl = buildUrl(`/movie/${movieId}/credits`)

    const [detailsResponse, creditsResponse] = await Promise.all([
      fetch(detailsUrl),
      fetch(creditsUrl),
    ])

    if (!detailsResponse.ok || !creditsResponse.ok) {
      return null
    }

    const details: TMDBMovieDetailsResponse = await detailsResponse.json()
    const credits: TMDBCreditsResponse = await creditsResponse.json()

    return {
      id: details.id,
      title: details.title,
      overview: details.overview,
      release_date: details.release_date,
      vote_average: details.vote_average,
      runtime: details.runtime,
      genres: details.genres,
      director: extractDirector(credits.crew),
      writers: extractWriters(credits.crew),
      cast: extractCast(credits.cast),
      poster_path: details.poster_path,
    }
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return null
  }
}

export async function getRelatedMovies(
  movieId: number
): Promise<TMDBMovie[]> {
  validateApiKey()

  try {
    const url = buildUrl(`/movie/${movieId}/similar`)
    const response = await fetch(url)

    if (!response.ok) {
      return []
    }

    const data: TMDBSearchResponse = await response.json()
    return data.results
  } catch (error) {
    console.error('Error fetching related movies:', error)
    return []
  }
}
