import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import * as authService from '../authService'
import { getCustomerProfile} from '../authService'

globalThis.fetch = vi.fn()

describe('authService', () => {
  const mockFetch = fetch as unknown as Mock

  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
  })

  describe('registerCustomer', () => {
    it('should register a customer successfully', async () => {
      const mockResponse = {
        customer: { email: 'test@example.com', id: '123' },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'mock-access-token',
          token_type: 'Bearer',
        }),
      })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await authService.registerCustomer({
        email: 'test@example.com',
        password: 'Password1!',
        firstName: 'John',
        lastName: 'Doe',
      })

      expect(fetch).toHaveBeenCalledTimes(2)

      const secondCallArgs = mockFetch.mock.calls[1]
      const [url, options] = secondCallArgs

      expect(url).toContain('/customers')
      expect(options).toMatchObject({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Bearer'),
          'Content-Type': 'application/json',
        }),
      })

      const parsedBody = JSON.parse(options.body)
      expect(parsedBody).toEqual(
        expect.objectContaining({
          email: 'test@example.com',
          password: 'Password1!',
          firstName: 'John',
          lastName: 'Doe',
        }),
      )

      expect(result).toEqual(mockResponse)
    })

    it('should throw error on failed registration', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Email already exists' }),
      })

      await expect(
        authService.registerCustomer({
          email: 'fail@example.com',
          password: 'Password1!',
        }),
      ).rejects.toThrow('Email already exists')
    })
  })

  describe('loginWithPassword', () => {
    it('should login and store tokens', async () => {
      const mockLoginData = {
        access_token: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLoginData,
      })

      const result = await authService.loginWithPassword(
        'user@example.com',
        'Password1!',
      )

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/customers/token'),
        expect.any(Object),
      )
      expect(result).toEqual(mockLoginData)
    })

    it('should throw error on failed login', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      })

      await expect(
        authService.loginWithPassword('user@example.com', 'wrongpass'),
      ).rejects.toThrow('Login failed')
    })
  })

  describe('getCustomerProfile', () => {
    it('should return customer data on success', async () => {
      const mockCustomer = { id: '123', email: 'test@example.com' }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCustomer,
      })

      const result = await authService.getCustomerProfile('mockAccessToken')
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/me'),
        expect.any(Object),
      )
      expect(result).toEqual(mockCustomer)
    })

    it('should throw error if fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      })

      await expect(authService.getCustomerProfile('badToken')).rejects.toThrow(
        'Failed to fetch customer data',
      )
    })
  })

})
