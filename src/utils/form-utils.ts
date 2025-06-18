import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidBirthDate,
  isValidStreet,
  isValidCity,
  isValidPostalCode,
  isValidCountry,
} from './validators'
import type { FormDataType } from '../types/customer'

export const initialForm: FormDataType = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  street: '',
  city: '',
  postalCode: '',
  country: '',
  billingStreet: '',
  billingCity: '',
  billingPostalCode: '',
  billingCountry: '',
}
export const validCountries = ['United States', 'Canada']

export const validateBillingFields = (data: FormDataType) => {
  const billingErrors: { [key: string]: string } = {}
  if (!isValidStreet(data.billingStreet))
    billingErrors.billingStreet = 'Billing street cannot be empty'
  if (!isValidCity(data.billingCity))
    billingErrors.billingCity = 'Invalid billing city'
  if (!isValidPostalCode(data.billingPostalCode, data.billingCountry))
    billingErrors.billingPostalCode = 'Invalid billing postal code'
  if (!isValidCountry(data.billingCountry, validCountries))
    billingErrors.billingCountry = 'Select a valid billing country'
  return billingErrors
}

export const validate = (data: FormDataType, useSameAddress: boolean) => {
  const newErrors: { [key: string]: string } = {}

  if (!isValidEmail(data.email)) newErrors.email = 'Invalid email format'
  if (!isValidPassword(data.password))
    newErrors.password =
      'Password must be at least 8 characters, include upper/lowercase, number and one special character'
  if (!isValidName(data.firstName))
    newErrors.firstName = 'Name shouldn`t include digits'
  if (!isValidName(data.lastName))
    newErrors.lastName = 'Name shouldn`t include digits'
  if (!isValidBirthDate(data.birthDate))
    newErrors.birthDate = 'You must be at least 13 years old'
  if (!isValidStreet(data.street)) newErrors.street = 'Street cannot be empty'
  if (!isValidCity(data.city)) newErrors.city = 'Invalid city'
  if (!isValidPostalCode(data.postalCode, data.country))
    newErrors.postalCode = 'Invalid postal code'
  if (!isValidCountry(data.country, validCountries))
    newErrors.country = 'Select a valid country'

  if (!useSameAddress) {
    Object.assign(newErrors, validateBillingFields(data))
  }

  return newErrors
}
