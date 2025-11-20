import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import StarIcon from '@mui/icons-material/Star'
import type { TMDBMovie } from '../services/tmdb'

interface MovieListProps {
  movies: TMDBMovie[]
  onMovieClick: (movie: TMDBMovie) => void
  loading: boolean
}

export function MovieList({ movies, onMovieClick, loading }: MovieListProps) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (movies.length === 0) {
    return null
  }

  return (
    <Paper elevation={2}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Search Results</Typography>
      </Box>
      <List disablePadding>
        {movies.map((movie, index) => (
          <ListItem
            key={movie.id}
            disablePadding
            divider={index < movies.length - 1}
          >
            <ListItemButton onClick={() => onMovieClick(movie)}>
              <ListItemText
                primary={movie.title}
                secondary={
                  <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                    <Chip
                      icon={<CalendarTodayIcon />}
                      label={movie.release_date || 'N/A'}
                      size="small"
                      variant="outlined"
                    />
                    {movie.vote_average > 0 && (
                      <Chip
                        icon={<StarIcon />}
                        label={movie.vote_average.toFixed(1)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                }
                secondaryTypographyProps={{ component: 'div' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
