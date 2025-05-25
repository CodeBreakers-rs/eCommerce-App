import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import NotFoundPage from '../not-found-page'

describe('NotFoundPage', () => {
  it('renders the 404 message', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>,
    )

    expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument()
    expect(screen.getByText(/The page you're looking for/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Return to the Main page/i }),
    ).toBeInTheDocument()
  })
})
