export type CustomerType = {
  email: string
  password: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  addresses?: any[]
  defaultShippingAddress?: number
}

export type Address = {
  streetName: string
  city: string
  postalCode: string
  country: string
}
