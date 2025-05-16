export const isValidEmail = (email: string): boolean => {
  const checkEmail = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkEmail)
}

export const isValidPassword = (password: string): boolean => {
  const checkPass = password.trim();
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(checkPass)
}

export const isValidName = (name: string): boolean =>
  /^[A-Za-z]{1,}$/.test(name)

export const isValidBirthDate = (birthDate: string): boolean => {
  const birth = new Date(birthDate)
  const today = new Date()

  const age = today.getFullYear() - birth.getFullYear()
  const months = today.getMonth() - birth.getMonth()
  const days = today.getDate() - birth.getDate()

  if (age > 13) return true
  if (age === 13) {
    if (months > 0) return true
    if (months === 0 && days >= 0) return true
  }

  return false
}

export const isValidStreet = (street: string): boolean =>
  street.trim().length > 0

export const isValidCity = (city: string): boolean =>
  /^[A-Za-z\s]{1,}$/.test(city)

export const isValidPostalCode = (
  postalCode: string,
  country: string,
): boolean => {
  const patterns: Record<string, RegExp> = {
    'United States': /^\d{5}$/,
    Canada: /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/,
  }
  const pattern = patterns[country]
  if (!pattern) return false

  return pattern.test(postalCode)
}

export const isValidCountry = (
  country: string,
  validCountries: string[],
): boolean => validCountries.includes(country)
