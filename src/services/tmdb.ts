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

interface TMDBCreditsResponse {
  cast: Array<{ name: string; order: number }>
  crew: Array<{ name: string; job: string }>
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

export async function getMovieDetails(
  movieId: number
): Promise<TMDBMovieDetails | null> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured')
  }

  try {
    // Fetch movie details and credits in parallel
    const [detailsResponse, creditsResponse] = await Promise.all([
      fetch(
        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
      ),
      fetch(
        `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
      ),
    ])

    if (!detailsResponse.ok || !creditsResponse.ok) {
      return null
    }

    const details = await detailsResponse.json()
    const credits: TMDBCreditsResponse = await creditsResponse.json()

    // Extract director
    const director = credits.crew.find((person) => person.job === 'Director')

    // Extract writers (screenplay, writer, story)
    const writers = credits.crew
      .filter(
        (person) =>
          person.job === 'Screenplay' ||
          person.job === 'Writer' ||
          person.job === 'Story'
      )
      .map((person) => person.name)
      // Remove duplicates
      .filter((name, index, self) => self.indexOf(name) === index)
      .slice(0, 3) // Limit to 3 writers

    // Extract top cast (first 5)
    const cast = credits.cast
      .sort((a, b) => a.order - b.order)
      .slice(0, 5)
      .map((person) => person.name)

    return {
      id: details.id,
      title: details.title,
      overview: details.overview,
      release_date: details.release_date,
      vote_average: details.vote_average,
      runtime: details.runtime,
      genres: details.genres,
      director: director?.name,
      writers,
      cast,
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
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured')
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`
    )

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
