import React, { useState, useEffect } from 'react'
import * as authService from '../services/authService'
import { sanitizeCustomerDraft } from '../services/authService'
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
import type { CustomerType, FormDataType } from '../../../types/customer'

const validCountries = ['United States', 'Canada']

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
    billingStreet: '',
    billingCity: '',
    billingPostalCode: '',
    billingCountry: '',
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [defaultShipping, setDefaultShipping] = useState(false)
  const [defaultBilling, setDefaultBilling] = useState(false)
  const [useSameAddress, setUseSameAddress] = useState(true)

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

  useEffect(() => {
    if (useSameAddress) {
      setFormData((prev) => ({
        ...prev,
        billingStreet: prev.street,
        billingCity: prev.city,
        billingPostalCode: prev.postalCode,
        billingCountry: prev.country,
      }))
    }
  }, [
    formData.street,
    formData.city,
    formData.postalCode,
    formData.country,
    useSameAddress,
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasSubmitted(true)
    setMessage('')
    setErrorMessage('')

    const noErrors = validate(formData)
    if (!noErrors) return

    const addresses = [
      {
        streetName: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
    ]

    if (!useSameAddress) {
      addresses.push({
        streetName: formData.billingStreet,
        city: formData.billingCity,
        postalCode: formData.billingPostalCode,
        country: formData.billingCountry,
      })
    }

    let defaultShippingIndex: number | undefined = undefined
    let defaultBillingIndex: number | undefined = undefined

    if (defaultShipping) defaultShippingIndex = 0
    if (defaultBilling) defaultBillingIndex = useSameAddress ? 0 : 1

    const customerFormData: CustomerType = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.birthDate,
      addresses,
      defaultShippingAddress: defaultShipping ? 0 : undefined,
      defaultBillingAddress: defaultBilling ? 0 : undefined,
    }

    const sanitized = sanitizeCustomerDraft(customerFormData)
    console.log(
      'Sanitized registration payload:',
      JSON.stringify(sanitized, null, 2),
    )
    try {
      const result = await authService.registerCustomer(
        sanitized as CustomerType,
      )
      console.log('Success:', result)
      setMessage(`Account created for ${result.customer.email}`)
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
        billingStreet: '',
        billingCity: '',
        billingPostalCode: '',
        billingCountry: '',
      })
      setDefaultShipping(false)
      setDefaultBilling(false)
      setErrors({})
      setHasSubmitted(false)
    } catch (error: any) {
      console.error('Registration error:', error)

      const statusCode = error.statusCode || error.status || 500
      const fallbackMessage = error.message || 'Something went wrong'
      const errorData = error.response?.data || error
      const errorList = errorData.errors || []

      console.error('🚨 Registration failed:', {
        statusCode,
        message,
        errors: errorList,
      })

      let formattedMessage = ` Error ${statusCode}: ${message} `

      switch (statusCode) {
        case 400: {
          if (errorList.length) {
            formattedMessage +=
              '\n' + errorList.map((e: any) => `• ${e.message}`).join('\n')
          }
          break
        }
        case 401:
          formattedMessage += '🔒 Unauthorized. Please log in again.'
          break
        case 403:
          formattedMessage +=
            '🚫 Access denied. You do not have permission to perform this action.'
          break
        case 409:
          formattedMessage += '⚠️ An account with this email already exists.'
          break
        case 500:
        case 502:
        case 503:
          formattedMessage += '⚠️ Server error. Please try again later.'
          break
        default:
          formattedMessage += fallbackMessage
          break
      }

      setErrorMessage(formattedMessage)
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

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={defaultShipping}
            onChange={() => setDefaultShipping(!defaultShipping)}
          />
          Set as default shipping address
        </label>

        <label>
          <input
            type="checkbox"
            checked={defaultBilling}
            onChange={() => setDefaultBilling(!defaultBilling)}
          />
          Set as default billing address
        </label>
        <label>
          <input
            type="checkbox"
            checked={useSameAddress}
            onChange={() => setUseSameAddress(!useSameAddress)}
          />
          Use the same address for billing and shipping
        </label>
      </div>
      <h3>Shipping Address</h3>
      {[
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

      {!useSameAddress && (
        <>
          <h3>Billing Address</h3>
          {[
            { name: 'billingStreet', type: 'text', label: 'Street' },
            { name: 'billingCity', type: 'text', label: 'City' },
            { name: 'billingPostalCode', type: 'text', label: 'Postal Code' },
          ].map(({ name, type, label }) => (
            <div key={name} className="form-group">
              <label htmlFor={name}>{label}</label>
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="form-group">
            <label htmlFor="billingCountry">Country</label>
            <select
              id="billingCountry"
              name="billingCountry"
              value={formData.billingCountry}
              onChange={handleChange}
            >
              <option value="">-- Select a country --</option>
              {validCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <button type="submit" disabled={isButtonDisabled}>
        Register
      </button>
    </form>
  )
}
