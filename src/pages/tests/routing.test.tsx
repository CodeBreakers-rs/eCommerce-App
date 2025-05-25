import React from 'react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import MainPage from '../main-page'
import LoginPage from '../login-page'
import RegistrationPage from '../registration-page'
import NotFoundPage from '../not-found-page'

import authReducer from '../../store/slices/auth-slice'

function renderWithStore(ui: React.ReactElement, initialRoute = '/') {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  })

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>{ui}</MemoryRouter>
    </Provider>,
  )
}

describe('Direct Navigation Routes', () => {
  it('navigates to Main page via direct URL', () => {
    renderWithStore(
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>,
    )
    expect(screen.getByText(/Main/i)).toBeInTheDocument()
  })

  it('navigates to Login page via direct URL', () => {
    renderWithStore(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>,
      '/login',
    )
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('navigates to Registration page via direct URL', () => {
    renderWithStore(
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>,
      '/register',
    )
    expect(screen.getByText(/Registration/i)).toBeInTheDocument()
  })
})
describe('Not Found Route', () => {
  it('navigates to Not Found page via direct URL', () => {
    renderWithStore(
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>,
    )
    expect(screen.getByText(/Not Found/i)).toBeInTheDocument()
  })
})
