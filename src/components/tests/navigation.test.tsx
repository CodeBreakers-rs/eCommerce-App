import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navigation from '../common/navigation'

describe('Navigation component', () => {
  it('renders all navigation links', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    )

    const links = [
      { text: '🏠 Main', href: '/' },
      { text: '🔐 Login', href: '/login' },
      { text: '📝 Register', href: '/register' },
      { text: '📋 Catalog', href: '/catalog' },
      { text: '👤 Profile', href: '/profile' },
      { text: '🛒 Basket', href: '/basket' },
      { text: '🙋 About', href: '/about' },
    ]

    for (const { text, href } of links) {
      const link = screen.getByRole('link', { name: text })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', href)
    }
  })
})
