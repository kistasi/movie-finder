import { useState } from 'react'

interface SearchBoxProps {
  onSearch: (query: string) => void
}

export function SearchBox({ onSearch }: SearchBoxProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-box">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies..."
        className="search-input"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  )
}
