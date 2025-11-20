import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MovieDetail } from './MovieDetail'

describe('MovieDetail', () => {
  const defaultProps = {
    title: 'The Matrix',
    summary: 'A computer hacker learns about the true nature of reality.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/The_Matrix',
    loading: false,
  }

  it('should render loading state', () => {
    render(<MovieDetail {...defaultProps} loading={true} />)

    expect(screen.getByText('Loading movie details...')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render error when no movie details available', () => {
    render(
      <MovieDetail
        {...defaultProps}
        summary=""
        error="Wikipedia page not found for this movie."
      />
    )

    expect(
      screen.getByText('Wikipedia page not found for this movie.')
    ).toBeInTheDocument()
  })

  it('should render movie title and summary', () => {
    render(<MovieDetail {...defaultProps} />)

    expect(screen.getByText('The Matrix')).toBeInTheDocument()
    expect(
      screen.getByText(
        'A computer hacker learns about the true nature of reality.'
      )
    ).toBeInTheDocument()
  })

  it('should render Wikipedia link', () => {
    render(<MovieDetail {...defaultProps} />)

    const link = screen.getByRole('link', { name: /read more on wikipedia/i })
    expect(link).toHaveAttribute('href', defaultProps.wikipediaUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render director information', () => {
    render(<MovieDetail {...defaultProps} director="Lana Wachowski" />)

    expect(screen.getByText(/Director:/)).toBeInTheDocument()
    expect(screen.getByText(/Lana Wachowski/)).toBeInTheDocument()
  })

  it('should render writers information', () => {
    render(
      <MovieDetail
        {...defaultProps}
        writers={['Lana Wachowski', 'Lilly Wachowski']}
      />
    )

    expect(screen.getByText(/Writers:/)).toBeInTheDocument()
    expect(
      screen.getByText(/Lana Wachowski, Lilly Wachowski/)
    ).toBeInTheDocument()
  })

  it('should render single writer with singular label', () => {
    render(<MovieDetail {...defaultProps} writers={['Solo Writer']} />)

    expect(screen.getByText(/Writer:/)).toBeInTheDocument()
    expect(screen.queryByText(/Writers:/)).not.toBeInTheDocument()
  })

  it('should render cast information', () => {
    render(
      <MovieDetail
        {...defaultProps}
        cast={['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss']}
      />
    )

    expect(screen.getByText(/Cast:/)).toBeInTheDocument()
    expect(
      screen.getByText(/Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss/)
    ).toBeInTheDocument()
  })

  it('should render runtime', () => {
    render(<MovieDetail {...defaultProps} runtime={136} />)

    expect(screen.getByText(/Runtime:/)).toBeInTheDocument()
    expect(screen.getByText(/136 minutes/)).toBeInTheDocument()
  })

  it('should render genres', () => {
    render(<MovieDetail {...defaultProps} genres={['Action', 'Sci-Fi']} />)

    expect(screen.getByText(/Genres:/)).toBeInTheDocument()
    expect(screen.getByText(/Action, Sci-Fi/)).toBeInTheDocument()
  })

  it('should render release date', () => {
    render(<MovieDetail {...defaultProps} releaseDate="1999-03-31" />)

    expect(screen.getByText(/Release Date:/)).toBeInTheDocument()
    expect(screen.getByText(/1999-03-31/)).toBeInTheDocument()
  })

  it('should render Related button when onRelatedClick is provided', () => {
    const mockOnRelatedClick = vi.fn()
    render(
      <MovieDetail {...defaultProps} onRelatedClick={mockOnRelatedClick} />
    )

    expect(screen.getByRole('button', { name: /related/i })).toBeInTheDocument()
  })

  it('should not render Related button when onRelatedClick is not provided', () => {
    render(<MovieDetail {...defaultProps} />)

    expect(
      screen.queryByRole('button', { name: /related/i })
    ).not.toBeInTheDocument()
  })

  it('should call onRelatedClick when Related button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnRelatedClick = vi.fn()

    render(
      <MovieDetail {...defaultProps} onRelatedClick={mockOnRelatedClick} />
    )

    await user.click(screen.getByRole('button', { name: /related/i }))

    expect(mockOnRelatedClick).toHaveBeenCalledTimes(1)
  })

  it('should not render runtime when it is 0', () => {
    render(<MovieDetail {...defaultProps} runtime={0} />)

    expect(screen.queryByText(/Runtime:/)).not.toBeInTheDocument()
  })

  it('should render nothing when no summary and no details', () => {
    const { container } = render(
      <MovieDetail
        title="Test"
        summary=""
        wikipediaUrl=""
        loading={false}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should show movie details even without Wikipedia summary', () => {
    render(
      <MovieDetail
        title="Test Movie"
        summary=""
        wikipediaUrl=""
        loading={false}
        director="Test Director"
        runtime={120}
      />
    )

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText(/Test Director/)).toBeInTheDocument()
    expect(screen.queryByText(/Read more on Wikipedia/)).not.toBeInTheDocument()
  })

  it('should render all metadata fields together', () => {
    render(
      <MovieDetail
        {...defaultProps}
        director="Director Name"
        writers={['Writer 1', 'Writer 2']}
        cast={['Actor 1', 'Actor 2']}
        runtime={120}
        genres={['Action', 'Drama']}
        releaseDate="2024-01-01"
      />
    )

    expect(screen.getByText(/Release Date:/)).toBeInTheDocument()
    expect(screen.getByText(/Runtime:/)).toBeInTheDocument()
    expect(screen.getByText(/Genres:/)).toBeInTheDocument()
    expect(screen.getByText(/Director:/)).toBeInTheDocument()
    expect(screen.getByText(/Writers:/)).toBeInTheDocument()
    expect(screen.getByText(/Cast:/)).toBeInTheDocument()
  })
})
