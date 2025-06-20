import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { getCustomerProfile } from '../features/profile/services/customer-service'

globalThis.fetch = vi.fn()
const mockFetch = fetch as unknown as Mock

vi.mock('../../profile/services/customer-service', () => ({
  getCustomerProfile: vi.fn(),
}))

describe('getCustomerProfile', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return customer data on success', async () => {
    const mockCustomer = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCustomer),
    })

    const result = await getCustomerProfile('mockAccessToken')

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/me'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer mockAccessToken',
        }) as unknown,
      }) as unknown,
    )

    expect(result).toEqual(mockCustomer)
  })

  it('should return null and log error if fetch fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    })

    const result = await getCustomerProfile('badToken')

    expect(result).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching profile:',
      expect.any(Error),
    )

    consoleSpy.mockRestore()
  })
})
