import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AboutUs from '../about-us-page'

describe('AboutUs Component', () => {
  it('renders heading and RS School link', () => {
    render(<AboutUs />)
    expect(screen.getByText(/RS School program/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /RS School/i })).toHaveAttribute(
      'href',
      'https://rs.school/',
    )
  })

  it('renders RS School logo', () => {
    render(<AboutUs />)
    const logo = screen.getByAltText(/RS School Logo/i)
    expect(logo).toBeInTheDocument()
  })

  it('renders team members with GitHub links', () => {
    render(<AboutUs />)
    const githubLinks = screen.getAllByRole('link', { name: /Github Logo/i })
    expect(githubLinks.length).toBeGreaterThan(0)
  })
})
