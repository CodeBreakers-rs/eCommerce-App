export const isValidEmail = (email:string) : boolean => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (password:string) : boolean => 
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

export const isValidName = (name:string) : boolean => 
    /^[A-Za-z]{1,}$/.test(name);

export const isValidBirthDate = (birthDate:string) : boolean => {
    const date = new Date(birthDate);
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 13;
}

export const isValidStreet = (street:string) : boolean => 
    street.trim().length > 0;

export const isValidCity = (city: string): boolean =>
  /^[A-Za-z\s]{1,}$/.test(city);

export const isValidPostalCode = (postalCode: string, country: string): boolean => {
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}$/,
    CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  };
  return patterns[country]?.test(postalCode) ?? false;
};

export const isValidCountry = (country: string, validCountries: string[]): boolean => 
    validCountries.includes(country);