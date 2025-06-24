import { useState, useEffect } from 'react'
import magnifyingGlassIcon from '../../../assets/svg/magnifying-glass.svg'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { resetCatalog, setProducts } from '../../../store/slices/catalog-slice'
import { fetchProducts, fetchProductsByText } from '../services/catalog-service'

const SearchInput = () => {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [error, setError] = useState<string | null>(null)

  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500)
    return () => clearTimeout(handler)
  }, [query])

  useEffect(() => {
    const fetchSearchResults = async () => {
      const trimmedQuery = debouncedQuery.trim()

      setError(null)

      try {
        if (trimmedQuery === '') {
          const data = await fetchProducts()
          dispatch(setProducts(data.results))
        } else {
          const data = await fetchProductsByText(trimmedQuery)
          dispatch(setProducts(data.results))
        }
      } catch (err) {
        console.error('Search failed:', err)
        setError('Search failed. Please try again.')
        dispatch(resetCatalog())
      }
    }

    void fetchSearchResults()
  }, [debouncedQuery, dispatch, token])

  return (
    <div className="relative text-[#483528] text-xl w-full max-w-xs">
      <input
        type="text"
        placeholder="Search desserts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 pl-10 text-base border rounded-lg focus:outline-none focus:ring focus:border-[#483528] placeholder:text-base placeholder:opacity-70"
      />
      <img
        src={magnifyingGlassIcon}
        className="w-5 h-5 absolute top-2.5 right-3 text-[#483528]"
        alt="Search icon"
      />
      {error && (
        <p className="text-red-500 text-base mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default SearchInput
