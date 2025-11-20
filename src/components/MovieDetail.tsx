interface MovieDetailProps {
  title: string
  summary: string
  wikipediaUrl: string
  loading: boolean
  error?: string
}

export function MovieDetail({
  title,
  summary,
  wikipediaUrl,
  loading,
  error,
}: MovieDetailProps) {
  if (loading) {
    return (
      <div className="movie-detail">
        <div className="loading">Loading Wikipedia summary...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="movie-detail">
        <h2>{title}</h2>
        <p className="error">{error}</p>
      </div>
    )
  }

  if (!summary) {
    return null
  }

  return (
    <div className="movie-detail">
      <h2>{title}</h2>
      <p className="summary">{summary}</p>
      <a
        href={wikipediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wikipedia-link"
      >
        Read more on Wikipedia →
      </a>
    </div>
  )
}
