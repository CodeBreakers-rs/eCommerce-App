export type CustomerType = {
  email: string
  password: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  addresses?: Address[]
  defaultShippingAddress?: number
  defaultBillingAddress?: number
}

export type Address = {
  streetName: string
  city: string
  postalCode: string
  country: string
}

export type FormDataType = {
  email: string
  password: string
  firstName: string
  lastName: string
  birthDate: string
  street: string
  city: string
  postalCode: string
  country: string
  billingStreet: string
  billingCity: string
  billingPostalCode: string
  billingCountry: string
}
