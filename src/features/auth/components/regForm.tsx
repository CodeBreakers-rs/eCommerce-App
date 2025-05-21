import React, { useState, useEffect } from 'react'
import { registerCustomer } from '../services/authService'
import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidBirthDate,
  isValidStreet,
  isValidCity,
  isValidPostalCode,
  isValidCountry,
} from '../../../utils/validators'
import './regForm.css'

const validCountries = ['United States', 'Canada']

type FormDataType = {
  email: string
  password: string
  firstName: string
  lastName: string
  birthDate: string
  street: string
  city: string
  postalCode: string
  country: string
}

export const RegForm = () => {
  const [formData, setFormData] = useState<FormDataType>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const updatedForm = { ...formData, [e.target.name]: e.target.value }
    setFormData(updatedForm)
    if (hasSubmitted) validate(updatedForm)
  }

  const validate = (data: FormDataType) => {
    const newErrors: typeof errors = {}

    if (!isValidEmail(data.email)) newErrors.email = 'Invalid email format'
    if (!isValidPassword(data.password))
      newErrors.password =
        'Password must be at least 8 characters, include upper/lowercase, number and one special character'
    if (!isValidName(data.firstName)) newErrors.firstName = 'Invalid first name'
    if (!isValidName(data.lastName)) newErrors.lastName = 'Invalid last name'
    if (!isValidBirthDate(data.birthDate))
      newErrors.birthDate = 'You must be at least 13 years old'
    if (!isValidStreet(data.street)) newErrors.street = 'Street cannot be empty'
    if (!isValidCity(data.city)) newErrors.city = 'Invalid city name'
    if (!isValidPostalCode(data.postalCode, data.country))
      newErrors.postalCode = 'Invalid postal code'
    if (!isValidCountry(data.country, validCountries))
      newErrors.country = 'Select a valid country'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    const allFilled = Object.values(formData).every((val) => val.trim() !== '')
    setIsButtonDisabled(!allFilled)
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasSubmitted(true)
    setMessage('')
    setErrorMessage('')

    const noErrors = validate(formData)
    if (!noErrors) return

    const customerDraft = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.birthDate,
      addresses: [
        {
          streetName: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country === 'United States' ? 'US' : 'CA',
        },
      ],
      defaultShippingAddress: 0,
    }

    try {
      const result = await registerCustomer(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
      )
      console.log('Success:', result)
      setMessage(` Account created for ${result.customer.email}`)
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        street: '',
        city: '',
        postalCode: '',
        country: '',
      })
      setErrors({})
      setHasSubmitted(false)
    } catch (error: any) {
      console.error('Registration error:', error)
      setErrorMessage(` Registration failed: ${error.message}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="reg-form">
      {message && <p className="success-message">{message}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {[
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'password', type: 'password', label: 'Password' },
        { name: 'firstName', type: 'text', label: 'First Name' },
        { name: 'lastName', type: 'text', label: 'Last Name' },
        { name: 'birthDate', type: 'date', label: 'Birth Date' },
        { name: 'street', type: 'text', label: 'Street' },
        { name: 'city', type: 'text', label: 'City' },
        { name: 'postalCode', type: 'text', label: 'Postal Code' },
      ].map(({ name, type, label }) => (
        <div key={name} className="form-group">
          <label htmlFor={name}>{label}</label>
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            className={hasSubmitted && errors[name] ? 'input-error' : ''}
            aria-describedby={`${name}-error`}
            aria-invalid={!!errors[name]}
          />
          {hasSubmitted && errors[name] && (
            <span id={`${name}-error`} className="error-message">
              ⚠️ {errors[name]}
            </span>
          )}
        </div>
      ))}

      <div className="form-group">
        <label htmlFor="country">Country</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className={hasSubmitted && errors.country ? 'input-error' : ''}
          aria-describedby="country-error"
          aria-invalid={!!errors.country}
        >
          <option value="">-- Select a country --</option>
          {validCountries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {hasSubmitted && errors.country && (
          <span id="country-error" className="error-message">
            ⚠️ {errors.country}
          </span>
        )}
      </div>

      <button type="submit" disabled={isButtonDisabled}>
        Register
      </button>
    </form>
  )
}
