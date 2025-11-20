import { describe, it, expect, beforeEach, vi } from 'vitest'
import { searchWikipedia } from './wikipedia'

describe('Wikipedia Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  describe('searchWikipedia', () => {
    it('should return wikipedia data for valid search', async () => {
      const mockSearchResult = {
        pages: [{ key: 'Test_Movie' }],
      }

      const mockSummary = {
        extract: 'Test movie summary',
        content_urls: {
          desktop: {
            page: 'https://en.wikipedia.org/wiki/Test_Movie',
          },
        },
      }

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSearchResult,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSummary,
        })

      const result = await searchWikipedia('Test Movie')

      expect(result).toEqual({
        summary: 'Test movie summary',
        url: 'https://en.wikipedia.org/wiki/Test_Movie',
      })

      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('/search/page')
      )
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('/page/summary/')
      )
    })

    it('should return null when no search results found', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ pages: [] }),
      })

      const result = await searchWikipedia('Nonexistent Movie')

      expect(result).toBeNull()
    })

    it('should return null when pages property is missing', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      })

      const result = await searchWikipedia('Test')

      expect(result).toBeNull()
    })

    it('should return null when search request fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      })

      const result = await searchWikipedia('Test Movie')

      expect(result).toBeNull()
    })

    it('should return null when summary request fails', async () => {
      const mockSearchResult = {
        pages: [{ key: 'Test_Movie' }],
      }

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSearchResult,
        })
        .mockResolvedValueOnce({
          ok: false,
        })

      const result = await searchWikipedia('Test Movie')

      expect(result).toBeNull()
    })

    it('should return null when fetch throws error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const result = await searchWikipedia('Test Movie')

      expect(result).toBeNull()
    })

    it('should properly encode search query in URL', async () => {
      const mockSearchResult = {
        pages: [{ key: 'Special_Movie' }],
      }

      const mockSummary = {
        extract: 'Summary',
        content_urls: {
          desktop: {
            page: 'https://en.wikipedia.org/wiki/Special_Movie',
          },
        },
      }

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSearchResult,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSummary,
        })

      await searchWikipedia('Movie With Spaces & Special Characters')

      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining(
          encodeURIComponent('Movie With Spaces & Special Characters')
        )
      )
    })
  })
})
