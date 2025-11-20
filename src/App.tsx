import { useState, useEffect } from 'react'
import { Container, Typography, Box, Divider } from '@mui/material'
import { SearchBox } from './components/SearchBox'
import { MovieList } from './components/MovieList'
import { MovieDetail } from './components/MovieDetail'
import { searchMovies as searchTMDB, getMovieDetails } from './services/tmdb'
import type { TMDBMovie, TMDBMovieDetails } from './services/tmdb'
import { searchWikipedia } from './services/wikipedia'
import type { WikipediaData } from './types/wikipedia'

function App() {
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null)
  const [movies, setMovies] = useState<TMDBMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [movieDetails, setMovieDetails] = useState<TMDBMovieDetails | null>(null)
  const [wikipediaData, setWikipediaData] = useState<WikipediaData | null>(null)
  const [wikipediaLoading, setWikipediaLoading] = useState(false)
  const [wikipediaError, setWikipediaError] = useState<string>('')

  useEffect(() => {
    if (error) {
      console.error('Error searching movies:', error)
    }
  }, [error])

  const handleSearch = async (searchQuery: string) => {
    setSelectedMovie(null)
    setMovieDetails(null)
    setWikipediaData(null)
    setWikipediaError('')
    setLoading(true)
    setError(null)

    try {
      const results = await searchTMDB(searchQuery)
      setMovies(results)
    } catch (err) {
      setError(err as Error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const handleMovieClick = async (movie: TMDBMovie) => {
    setSelectedMovie(movie)
    setWikipediaLoading(true)
    setWikipediaError('')
    setWikipediaData(null)
    setMovieDetails(null)

    // Fetch both TMDB details and Wikipedia data in parallel
    const [details, wikipediaResult] = await Promise.all([
      getMovieDetails(movie.id),
      searchWikipedia(movie.title),
    ])

    if (details) {
      setMovieDetails(details)
    }

    if (wikipediaResult) {
      setWikipediaData(wikipediaResult)
    } else {
      setWikipediaError('Wikipedia page not found for this movie.')
    }

    setWikipediaLoading(false)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Movie Finder
        </Typography>
        <Divider />
      </Box>

      <Box sx={{ mb: 4 }}>
        <SearchBox onSearch={handleSearch} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
      >
        <Box>
          <MovieList
            movies={movies}
            onMovieClick={handleMovieClick}
            loading={loading}
          />
        </Box>

        {selectedMovie && (
          <Box>
            <MovieDetail
              title={selectedMovie.title}
              summary={wikipediaData?.summary || ''}
              wikipediaUrl={wikipediaData?.url || ''}
              loading={wikipediaLoading}
              error={wikipediaError}
              director={movieDetails?.director}
              writers={movieDetails?.writers}
              cast={movieDetails?.cast}
              runtime={movieDetails?.runtime}
              genres={movieDetails?.genres.map((g) => g.name)}
              releaseDate={movieDetails?.release_date}
            />
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default App
