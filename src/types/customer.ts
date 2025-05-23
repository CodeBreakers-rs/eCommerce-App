export type CustomerDraft = {
  email: string
  password: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  addresses?: any[]
  defaultShippingAddress?: number
}
