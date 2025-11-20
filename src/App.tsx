import { useState, useEffect } from 'react'
import { SearchBox } from './components/SearchBox'
import { MovieList } from './components/MovieList'
import { MovieDetail } from './components/MovieDetail'
import { searchMovies as searchTMDB } from './services/tmdb'
import type { TMDBMovie } from './services/tmdb'
import { searchWikipedia } from './services/wikipedia'
import type { WikipediaData } from './types/wikipedia'

function App() {
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null)
  const [movies, setMovies] = useState<TMDBMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
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

    const result = await searchWikipedia(movie.title)

    if (result) {
      setWikipediaData(result)
    } else {
      setWikipediaError('Wikipedia page not found for this movie.')
    }

    setWikipediaLoading(false)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Movie Finder</h1>
      </header>

      <main className="main">
        <SearchBox onSearch={handleSearch} />

        <div className="content">
          <MovieList
            movies={movies}
            onMovieClick={handleMovieClick}
            loading={loading}
          />

          {selectedMovie && (
            <MovieDetail
              title={selectedMovie.title}
              summary={wikipediaData?.summary || ''}
              wikipediaUrl={wikipediaData?.url || ''}
              loading={wikipediaLoading}
              error={wikipediaError}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
