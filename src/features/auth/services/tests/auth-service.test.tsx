import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import * as authService from '../auth-service'
import type { Customer } from '@commercetools/platform-sdk'

globalThis.fetch = vi.fn()

describe('authService', () => {
  const mockFetch = fetch as unknown as Mock

  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
  })

  describe('registerCustomer', () => {
    it('should register a customer successfully', async () => {
      const mockCustomer: Customer = {
        id: '123',
        version: 1,
        createdAt: '2023-01-01T00:00:00.000Z',
        lastModifiedAt: '2023-01-01T00:00:00.000Z',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isEmailVerified: true,
        addresses: [],
        shippingAddressIds: [],
        billingAddressIds: [],
        stores: [],
        custom: undefined,
        authenticationMode: 'Password',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'mock-access-token',
            expires_in: 3600,
            scope: 'mock-scope',
            token_type: 'Bearer',
          }) as unknown as Response,
      })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCustomer),
      }) as unknown as Response

      const result = await authService.registerCustomer({
        email: 'test@example.com',
        password: 'Password1!',
        firstName: 'John',
        lastName: 'Doe',
      })

      expect(fetch).toHaveBeenCalledTimes(2)
      expect(result).toEqual(mockCustomer)
    })

    it('should throw error on failed registration', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'mock-access-token',
            expires_in: 3600,
            scope: 'mock-scope',
            token_type: 'Bearer',
          }) as unknown as Response,
      })

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Email already exists' }),
      }) as unknown as Response

      await expect(
        authService.registerCustomer({
          email: 'fail@example.com',
          password: 'Password1!',
        }),
      ).rejects.toThrow('Email already exists')
    })
  })

  describe('loginWithPassword', () => {
    it('should login successfully', async () => {
      const mockTokenResponse = {
        access_token: 'mockAccessToken',
        expires_in: 3600,
        scope: 'some-scope',
        token_type: 'Bearer',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTokenResponse),
      }) as unknown as Response

      const result = await authService.loginWithPassword(
        'user@example.com',
        'Password1!',
      )

      expect(result).toEqual(mockTokenResponse)
    })

    it('should throw error on failed login', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Login failed' }),
      }) as unknown as Response

      await expect(
        authService.loginWithPassword('user@example.com', 'wrongpass'),
      ).rejects.toThrow('Login failed')
    })
  })
})
