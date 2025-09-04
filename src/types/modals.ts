import { type ReactNode } from 'react'
import type {
  Address as SDKAddress,
  Customer,
} from '@commercetools/platform-sdk'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export type FormValues = {
  firstName: string
  lastName: string
  dateOfBirth: string
  email: string
  addresses: SDKAddress[]
  customer: Customer
}
