import type { Customer as SDKCustomer } from '@commercetools/platform-sdk'

export const mockCustomer: SDKCustomer = {
  id: '12345',
  version: 1,
  createdAt: new Date().toISOString(),
  lastModifiedAt: new Date().toISOString(),
  email: 'jane.smith@example.com',
  firstName: 'Jane',
  lastName: 'Smith',
  isEmailVerified: true,
  addresses: [],
} as unknown as SDKCustomer
