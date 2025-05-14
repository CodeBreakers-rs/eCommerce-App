import { describe, it, expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import MainPage from '../main-page'
import LoginPage from '../login-page'
import RegistrationPage from '../registration-page'
import NotFoundPage from '../not-found-page'

describe('Direct Navigation Routes', () => {
  it('navigates to Main page via direct URL', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/Main/i)).toBeInTheDocument()
  })

  it('navigates to Login page via direct URL', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/Login/i)).toBeInTheDocument()
  })

  it('navigates to Registration page via direct URL', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegistrationPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/Registration/i)).toBeInTheDocument()
  })
})
describe('Not Found Route', () => {
  it('navigates to Not Found page via direct URL', () => {
    render(
      <MemoryRouter initialEntries={['/non-existent']}>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/Not Found/i)).toBeInTheDocument()
  })
})
