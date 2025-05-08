import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect } from 'vitest'

import App from '../app'

test('renders heading and button', () => {
  render(<App />)

  expect(screen.getByText(/eCommerce-App/i)).toBeInTheDocument()
  expect(screen.getByRole('button')).toHaveTextContent(/count is 0/i)
})

test('increments count on click', () => {
  render(<App />)

  const button = screen.getByRole('button')
  fireEvent.click(button)
  expect(button).toHaveTextContent(/count is 1/i)
})

test('simple test', () => {
  expect(1 + 1).toBe(2)
})
