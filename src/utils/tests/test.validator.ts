import { describe, it, expect } from 'vitest'

import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidBirthDate,
  isValidStreet,
  isValidCity,
  isValidPostalCode,
  isValidCountry,
} from '../validators'

describe('Validation Utilities', () => {
  it('validates email correctly', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
  })

  it('validates password complexity', () => {
    expect(isValidPassword('Password1')).toBe(true)
    expect(isValidPassword('pass')).toBe(false)
  })

  it('validates name', () => {
    expect(isValidName('John')).toBe(true)
    expect(isValidName('')).toBe(false)
    expect(isValidName('John123')).toBe(false)
  })

  it('validates birth date (age >= 13)', () => {
    const thirteenYearsAgo = new Date()
    thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13)
    const oldEnough = thirteenYearsAgo.toISOString().split('T')[0]

    const tooYoung = new Date().toISOString().split('T')[0]

    expect(isValidBirthDate(oldEnough)).toBe(true)
    expect(isValidBirthDate(tooYoung)).toBe(false)
  })

  it('validates street', () => {
    expect(isValidStreet('123 Main St')).toBe(true)
    expect(isValidStreet('')).toBe(false)
  })

  it('validates city', () => {
    expect(isValidCity('Toronto')).toBe(true)
    expect(isValidCity('123')).toBe(false)
  })

  it('validates postal code', () => {
    expect(isValidPostalCode('12345', 'US')).toBe(true)
    expect(isValidPostalCode('A1B 2C3', 'CA')).toBe(true)
    expect(isValidPostalCode('invalid', 'US')).toBe(false)
  })

  it('validates country from list', () => {
    const countries = ['Canada', 'United States']
    expect(isValidCountry('Canada', countries)).toBe(true)
    expect(isValidCountry('France', countries)).toBe(false)
  })
})
