import { render, screen } from '@testing-library/react'
import { describe, it, vi, expect } from 'vitest'
import AboutUs from '../about-us-page'
import rsLogo from '../../assets/svg/logo-rs-school.svg'

vi.mock('../../assets/svg/rs-logo.svg', () => ({
  default: rsLogo,
}))

vi.mock('../../services/team-members', () => ({
  teamMembers: [
    {
      name: 'Sergei Keidzh',
      role: 'Frontend Developer',
      bio: 'Frontend developer since 2022, experienced in React, Redux, and modern JS tools.',
      image: '/some-image.jpg',
      github: 'https://github.com/sergeikeidzh',
    },
  ],
}))

describe('AboutUs component', () => {
  it('renders RS School section with logo', () => {
    render(<AboutUs />)

    expect(screen.getByText(/RS School program/i)).toBeInTheDocument()
    const logo = screen.getByAltText(/RS School Logo/i)
    expect(logo).toBeInTheDocument()
  })

  it('renders each team member with their name, bio, and GitHub link', () => {
    render(<AboutUs />)

    const name = screen.getByText('Sergei Keidzh')
    expect(name).toBeInTheDocument()

    const role = screen.getByText('Frontend Developer')
    expect(role).toBeInTheDocument()

    expect(
      screen.getAllByText(/Frontend developer since/i)[0],
    ).toBeInTheDocument()

    const githubLink = screen.getByRole('link', {
      name: /Sergei Keidzh/i,
    })

    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/sergeikeidzh',
    )
  })
})
