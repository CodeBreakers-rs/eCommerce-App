import type {
  Customer as SDKCustomer,
  Address as SDKAddress,
} from '@commercetools/platform-sdk'

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

export interface CustomerProfile {
  firstName?: string
  lastName?: string
  email: string
  dateOfBirth?: string;
  addresses?: SDKAddress[]
}

export interface EditProfileModalProps {
  customer: SDKCustomer
  onSave: (updatedCustomer: CustomerUpdatePayload) => Promise<void>
  onClose: () => void
}

export type CustomerUpdatePayload = {
  version: number
  firstName?: string
  lastName?: string
  email?: string
  dateOfBirth?: string
  addresses?: SDKAddress[]
} 

export type BasicProfile = Pick<CustomerProfile, 'firstName' | 'lastName' | 'email' | 'dateOfBirth' | 'addresses'>;

export type CustomerProfileType = {
  email: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  addresses?: SDKAddress[]
  defaultShippingAddress?: number
  defaultBillingAddress?: number
}

export interface CustomerState {
  token: string | null
  customer: CustomerProfileType | null
}