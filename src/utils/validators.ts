export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const isValidPassword = (password: string): boolean =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)

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
  const toStandard = postalCode.toUpperCase().replace(/[^A-Z0-9]/g, '')

  const toCanStandard = (input: string) => {
    if (/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(input)) {
      return `${input.slice(0, 3)} ${input.slice(3)}`
    }
    return input
  }

  const patterns: Record<string, RegExp> = {
    US: /^\d{5}$/,
    CA: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/,
  }

  const normalized = country === 'CA' ? toCanStandard(toStandard) : toStandard

  return patterns[country]?.test(normalized) ?? false
}

export const isValidCountry = (
  country: string,
  validCountries: string[],
): boolean => validCountries.includes(country)
