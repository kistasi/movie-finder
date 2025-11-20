import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  searchMovies,
  getMovieDetails,
  getRelatedMovies,
  type TMDBMovie,
} from './tmdb'

const mockApiKey = 'test-api-key'

vi.stubEnv('VITE_TMDB_API_KEY', mockApiKey)

describe('TMDB Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  describe('searchMovies', () => {
    it('should return movies for valid search query', async () => {
      const mockMovies: TMDBMovie[] = [
        {
          id: 1,
          title: 'Test Movie',
          overview: 'Test overview',
          release_date: '2024-01-01',
          vote_average: 8.5,
        },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: mockMovies }),
      })

      const result = await searchMovies('test')

      expect(result).toEqual(mockMovies)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/search/movie')
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('query=test')
      )
    })

    it('should throw error when API request fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      })

      await expect(searchMovies('test')).rejects.toThrow('TMDB API error')
    })

    it('should return empty array when no results', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [] }),
      })

      const result = await searchMovies('nonexistent')

      expect(result).toEqual([])
    })
  })

  describe('getMovieDetails', () => {
    it('should return detailed movie information', async () => {
      const mockDetails = {
        id: 1,
        title: 'Test Movie',
        overview: 'Test overview',
        release_date: '2024-01-01',
        vote_average: 8.5,
        runtime: 120,
        genres: [
          { id: 1, name: 'Action' },
          { id: 2, name: 'Drama' },
        ],
      }

      const mockCredits = {
        crew: [
          { name: 'Director Name', job: 'Director' },
          { name: 'Writer One', job: 'Screenplay' },
          { name: 'Writer Two', job: 'Writer' },
          { name: 'Story Writer', job: 'Story' },
        ],
        cast: [
          { name: 'Actor One', order: 0 },
          { name: 'Actor Two', order: 1 },
          { name: 'Actor Three', order: 2 },
        ],
      }

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockDetails,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCredits,
        })

      const result = await getMovieDetails(1)

      expect(result).toMatchObject({
        id: 1,
        title: 'Test Movie',
        director: 'Director Name',
        writers: expect.arrayContaining(['Writer One', 'Writer Two']),
        cast: expect.arrayContaining(['Actor One', 'Actor Two', 'Actor Three']),
        genres: mockDetails.genres,
      })
    })

    it('should limit writers to 3', async () => {
      const mockCredits = {
        crew: [
          { name: 'Writer One', job: 'Screenplay' },
          { name: 'Writer Two', job: 'Screenplay' },
          { name: 'Writer Three', job: 'Writer' },
          { name: 'Writer Four', job: 'Writer' },
        ],
        cast: [],
      }

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 1,
            title: 'Test',
            overview: '',
            release_date: '2024-01-01',
            vote_average: 0,
            runtime: 0,
            genres: [],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCredits,
        })

      const result = await getMovieDetails(1)

      expect(result?.writers).toHaveLength(3)
    })

    it('should limit cast to 5', async () => {
      const mockCredits = {
        crew: [],
        cast: [
          { name: 'Actor 1', order: 0 },
          { name: 'Actor 2', order: 1 },
          { name: 'Actor 3', order: 2 },
          { name: 'Actor 4', order: 3 },
          { name: 'Actor 5', order: 4 },
          { name: 'Actor 6', order: 5 },
        ],
      }

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 1,
            title: 'Test',
            overview: '',
            release_date: '2024-01-01',
            vote_average: 0,
            runtime: 0,
            genres: [],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCredits,
        })

      const result = await getMovieDetails(1)

      expect(result?.cast).toHaveLength(5)
    })

    it('should remove duplicate writers', async () => {
      const mockCredits = {
        crew: [
          { name: 'Writer One', job: 'Screenplay' },
          { name: 'Writer One', job: 'Story' },
          { name: 'Writer Two', job: 'Writer' },
        ],
        cast: [],
      }

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 1,
            title: 'Test',
            overview: '',
            release_date: '2024-01-01',
            vote_average: 0,
            runtime: 0,
            genres: [],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCredits,
        })

      const result = await getMovieDetails(1)

      expect(result?.writers).toEqual(['Writer One', 'Writer Two'])
    })

    it('should return null when API request fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      })

      const result = await getMovieDetails(1)

      expect(result).toBeNull()
    })

    it('should return null when fetch throws error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const result = await getMovieDetails(1)

      expect(result).toBeNull()
    })

    it('should handle missing director', async () => {
      const mockCredits = {
        crew: [{ name: 'Producer', job: 'Producer' }],
        cast: [],
      }

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 1,
            title: 'Test',
            overview: '',
            release_date: '2024-01-01',
            vote_average: 0,
            runtime: 0,
            genres: [],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCredits,
        })

      const result = await getMovieDetails(1)

      expect(result?.director).toBeUndefined()
    })
  })

  describe('getRelatedMovies', () => {
    it('should return related movies', async () => {
      const mockMovies: TMDBMovie[] = [
        {
          id: 2,
          title: 'Related Movie',
          overview: 'Related overview',
          release_date: '2024-02-01',
          vote_average: 7.5,
        },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: mockMovies }),
      })

      const result = await getRelatedMovies(1)

      expect(result).toEqual(mockMovies)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/movie/1/similar')
      )
    })

    it('should return empty array when API request fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      })

      const result = await getRelatedMovies(1)

      expect(result).toEqual([])
    })

    it('should return empty array when fetch throws error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const result = await getRelatedMovies(1)

      expect(result).toEqual([])
    })
  })
})
