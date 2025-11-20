import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Link,
  Divider,
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

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
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    )
  }

  if (error) {
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

  if (!summary) {
    return null
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        {summary}
      </Typography>
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
    </Paper>
  )
}
