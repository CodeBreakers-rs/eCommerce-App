import {
  isValidEmail,
  isValidName,
  isValidBirthDate,
  isValidStreet,
  isValidCity,
  isValidPostalCode,
  isValidCountry,
} from '../../utils/validators'
import type { FormValues } from '../../types/modals'

export const validateForm = ({
  firstName,
  lastName,
  dateOfBirth,
  email,
  addresses,
  customer,
}: FormValues) => {
  const errors: { [key: string]: string } = {}

  if (!isValidName(firstName))
    errors.firstName = 'Name shouldn`t include digits'
  if (!isValidName(lastName)) errors.lastName = 'Name shouldn`t include digits'
  if (!isValidEmail(email)) errors.email = 'Invalid email address'
  if (!isValidBirthDate(dateOfBirth))
    errors.dateOfBirth = 'You must be at least 13 years old'

  const normalizeCountryName = (codeOrName: string): string => {
    const map: Record<string, string> = { CA: 'Canada', US: 'United States' }
    return map[codeOrName.toUpperCase()] || codeOrName
  }

  addresses.forEach((address, i) => {
    const normalizedCountry = normalizeCountryName(address.country || '')
    const prefix = `address_${i}`

    if (!isValidStreet(address.streetName || ''))
      errors[`${prefix}_street`] = 'Street cannot be empty'
    if (!isValidCity(address.city || ''))
      errors[`${prefix}_city`] = 'Invalid city'
    if (!isValidCountry(normalizedCountry, ['United States', 'Canada']))
      errors[`${prefix}_country`] = 'Select a valid country'
    if (!isValidPostalCode(address.postalCode || '', normalizedCountry))
      errors[`${prefix}_postalCode`] = 'Invalid postal code'
  })

  if (!customer.version && customer.version !== 0)
    errors.version = 'Customer version is missing. Cannot update.'

  return errors
}
