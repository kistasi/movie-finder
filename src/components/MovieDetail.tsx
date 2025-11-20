import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Link,
  Divider,
  Button,
  Stack,
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import MovieIcon from '@mui/icons-material/Movie'

interface MovieDetailProps {
  title: string
  summary: string
  wikipediaUrl: string
  loading: boolean
  error?: string
  director?: string
  writers?: string[]
  cast?: string[]
  runtime?: number
  genres?: string[]
  releaseDate?: string
  onRelatedClick?: () => void
}

export function MovieDetail({
  title,
  summary,
  wikipediaUrl,
  loading,
  error,
  director,
  writers,
  cast,
  runtime,
  genres,
  releaseDate,
  onRelatedClick,
}: MovieDetailProps) {
  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            gap: 2,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary">
            Loading movie details...
          </Typography>
        </Box>
      </Paper>
    )
  }

  // Show error only if we don't have movie details either
  if (error && !director && !cast) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="error">{error}</Alert>
      </Paper>
    )
  }

  // Don't show anything if we have no data at all
  if (!summary && !director && !cast && !runtime) {
    return null
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Movie metadata */}
      <Box sx={{ mb: 2 }}>
        {releaseDate && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Release Date:</strong> {releaseDate}
          </Typography>
        )}
        {runtime && runtime > 0 && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Runtime:</strong> {runtime} minutes
          </Typography>
        )}
        {genres && genres.length > 0 && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Genres:</strong> {genres.join(', ')}
          </Typography>
        )}
        {director && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Director:</strong> {director}
          </Typography>
        )}
        {writers && writers.length > 0 && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Writer{writers.length > 1 ? 's' : ''}:</strong>{' '}
            {writers.join(', ')}
          </Typography>
        )}
        {cast && cast.length > 0 && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Cast:</strong> {cast.join(', ')}
          </Typography>
        )}
      </Box>

      {summary && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
            {summary}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Link
              href={wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                fontWeight: 500,
              }}
            >
              Read more on Wikipedia
              <OpenInNewIcon fontSize="small" />
            </Link>
            {onRelatedClick && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<MovieIcon />}
                onClick={onRelatedClick}
              >
                Related
              </Button>
            )}
          </Stack>
        </>
      )}
    </Paper>
  )
}
