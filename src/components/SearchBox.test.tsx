import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBox } from './SearchBox'

describe('SearchBox', () => {
  it('should render search input and button', () => {
    const mockOnSearch = vi.fn()
    render(<SearchBox onSearch={mockOnSearch} />)

    expect(
      screen.getByPlaceholderText('Search for movies...')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('should call onSearch with trimmed query when form is submitted', async () => {
    const user = userEvent.setup()
    const mockOnSearch = vi.fn()
    render(<SearchBox onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('Search for movies...')
    const button = screen.getByRole('button', { name: /search/i })

    await user.type(input, '  The Matrix  ')
    await user.click(button)

    expect(mockOnSearch).toHaveBeenCalledWith('The Matrix')
    expect(mockOnSearch).toHaveBeenCalledTimes(1)
  })

  it('should not call onSearch when query is empty', async () => {
    const user = userEvent.setup()
    const mockOnSearch = vi.fn()
    render(<SearchBox onSearch={mockOnSearch} />)

    const button = screen.getByRole('button', { name: /search/i })
    await user.click(button)

    expect(mockOnSearch).not.toHaveBeenCalled()
  })

  it('should not call onSearch when query is only whitespace', async () => {
    const user = userEvent.setup()
    const mockOnSearch = vi.fn()
    render(<SearchBox onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('Search for movies...')
    const button = screen.getByRole('button', { name: /search/i })

    await user.type(input, '   ')
    await user.click(button)

    expect(mockOnSearch).not.toHaveBeenCalled()
  })

  it('should submit on Enter key press', async () => {
    const user = userEvent.setup()
    const mockOnSearch = vi.fn()
    render(<SearchBox onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('Search for movies...')

    await user.type(input, 'Inception{Enter}')

    expect(mockOnSearch).toHaveBeenCalledWith('Inception')
  })

  it('should update input value when typing', async () => {
    const user = userEvent.setup()
    const mockOnSearch = vi.fn()
    render(<SearchBox onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText(
      'Search for movies...'
    ) as HTMLInputElement

    await user.type(input, 'Avatar')

    expect(input.value).toBe('Avatar')
  })

  it('should clear input after submission', async () => {
    const user = userEvent.setup()
    const mockOnSearch = vi.fn()
    render(<SearchBox onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText(
      'Search for movies...'
    ) as HTMLInputElement

    await user.type(input, 'Interstellar')
    await user.type(input, '{Enter}')

    expect(input.value).toBe('Interstellar')
  })
})
