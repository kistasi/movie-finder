import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MovieList } from './MovieList'
import type { TMDBMovie } from '../services/tmdb'

const mockMovies: TMDBMovie[] = [
  {
    id: 1,
    title: 'The Matrix',
    overview: 'A computer hacker learns about the true nature of reality.',
    release_date: '1999-03-31',
    vote_average: 8.7,
  },
  {
    id: 2,
    title: 'Inception',
    overview: 'A thief who steals corporate secrets.',
    release_date: '2010-07-16',
    vote_average: 8.4,
  },
]

describe('MovieList', () => {
  it('should render loading state', () => {
    render(
      <MovieList movies={[]} onMovieClick={vi.fn()} loading={true} />
    )

    expect(screen.getByText('Loading movies...')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render movie list with default title', () => {
    render(
      <MovieList movies={mockMovies} onMovieClick={vi.fn()} loading={false} />
    )

    expect(screen.getByText('Search Results')).toBeInTheDocument()
    expect(screen.getByText('The Matrix')).toBeInTheDocument()
    expect(screen.getByText('Inception')).toBeInTheDocument()
  })

  it('should render custom title', () => {
    render(
      <MovieList
        movies={mockMovies}
        onMovieClick={vi.fn()}
        loading={false}
        title="Related Movies"
      />
    )

    expect(screen.getByText('Related Movies')).toBeInTheDocument()
  })

  it('should render release dates', () => {
    render(
      <MovieList movies={mockMovies} onMovieClick={vi.fn()} loading={false} />
    )

    expect(screen.getByText('1999-03-31')).toBeInTheDocument()
    expect(screen.getByText('2010-07-16')).toBeInTheDocument()
  })

  it('should render vote averages', () => {
    render(
      <MovieList movies={mockMovies} onMovieClick={vi.fn()} loading={false} />
    )

    expect(screen.getByText('8.7')).toBeInTheDocument()
    expect(screen.getByText('8.4')).toBeInTheDocument()
  })

  it('should handle missing release date', () => {
    const moviesWithoutDate: TMDBMovie[] = [
      {
        id: 1,
        title: 'Test Movie',
        overview: 'Test',
        release_date: '',
        vote_average: 0,
      },
    ]

    render(
      <MovieList
        movies={moviesWithoutDate}
        onMovieClick={vi.fn()}
        loading={false}
      />
    )

    expect(screen.getByText('N/A')).toBeInTheDocument()
  })

  it('should not render vote average when it is 0', () => {
    const moviesWithZeroRating: TMDBMovie[] = [
      {
        id: 1,
        title: 'Test Movie',
        overview: 'Test',
        release_date: '2024-01-01',
        vote_average: 0,
      },
    ]

    render(
      <MovieList
        movies={moviesWithZeroRating}
        onMovieClick={vi.fn()}
        loading={false}
      />
    )

    expect(screen.queryByText('0.0')).not.toBeInTheDocument()
  })

  it('should call onMovieClick when movie is clicked', async () => {
    const user = userEvent.setup()
    const mockOnMovieClick = vi.fn()

    render(
      <MovieList
        movies={mockMovies}
        onMovieClick={mockOnMovieClick}
        loading={false}
      />
    )

    await user.click(screen.getByText('The Matrix'))

    expect(mockOnMovieClick).toHaveBeenCalledWith(mockMovies[0])
    expect(mockOnMovieClick).toHaveBeenCalledTimes(1)
  })

  it('should render nothing when movies array is empty and not loading', () => {
    const { container } = render(
      <MovieList movies={[]} onMovieClick={vi.fn()} loading={false} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render all movies in the list', () => {
    render(
      <MovieList movies={mockMovies} onMovieClick={vi.fn()} loading={false} />
    )

    const listItems = screen.getAllByRole('button')
    expect(listItems).toHaveLength(mockMovies.length)
  })

  it('should format vote average to 1 decimal place', () => {
    const moviesWithRating: TMDBMovie[] = [
      {
        id: 1,
        title: 'Test',
        overview: 'Test',
        release_date: '2024-01-01',
        vote_average: 8.666,
      },
    ]

    render(
      <MovieList
        movies={moviesWithRating}
        onMovieClick={vi.fn()}
        loading={false}
      />
    )

    expect(screen.getByText('8.7')).toBeInTheDocument()
  })
})
