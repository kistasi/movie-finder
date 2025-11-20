import type { TMDBMovie } from '../services/tmdb'

interface MovieListProps {
  movies: TMDBMovie[]
  onMovieClick: (movie: TMDBMovie) => void
  loading: boolean
}

export function MovieList({ movies, onMovieClick, loading }: MovieListProps) {
  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (movies.length === 0) {
    return null
  }

  return (
    <div className="movie-list">
      <h2>Search Results</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id} className="movie-item">
            <button
              onClick={() => onMovieClick(movie)}
              className="movie-title-button"
            >
              {movie.title}
            </button>
            <div className="movie-info">
              <span className="movie-category">
                Release: {movie.release_date || 'N/A'}
              </span>
              {movie.vote_average > 0 && (
                <span className="movie-score">
                  Score: {movie.vote_average.toFixed(1)}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
