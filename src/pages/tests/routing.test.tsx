import { describe, it, expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import MainPage from '../main-page'
import LoginPage from '../login-page'
import RegistrationPage from '../registration-page'
import NotFoundPage from '../not-found-page'
import AboutUsPage from '../about-us-page'
import BasketPage from '../basket-page'
import CatalogPage from '../catalog-page'
import ProfilePage from '../profile-page'
import ProductPage from '../product-page'

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

  it('navigates to About Us page via direct URL', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Routes>
          <Route path="/about" element={<AboutUsPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/About Us/i)).toBeInTheDocument()
  })

  it('navigates to Basket page via direct URL', () => {
    render(
      <MemoryRouter initialEntries={['/basket']}>
        <Routes>
          <Route path="/basket" element={<BasketPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/Basket/i)).toBeInTheDocument()
  })

  it('navigates to Catalog page via direct URL', () => {
    render(
      <MemoryRouter initialEntries={['/catalog']}>
        <Routes>
          <Route path="/catalog" element={<CatalogPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/Catalog/i)).toBeInTheDocument()
  })

  it('navigates to Profile page via direct URL', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/Profile/i)).toBeInTheDocument()
  })

  it('navigates to Product page with a dynamic ID via direct URL', () => {
    render(
      <MemoryRouter initialEntries={['/product/123']}>
        <Routes>
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText(/Product Page/i)).toBeInTheDocument()
    expect(screen.getByText(/Product ID: 123/)).toBeInTheDocument()
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
