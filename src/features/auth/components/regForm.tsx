import React, { useState, useEffect } from 'react'
import * as authService from '../services/authService'
import { useAppDispatch } from '../../../store/hooks'
import { login } from '../../../store/slices/auth-slice'
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

const countryNameToCode: Record<string, string> = {
  Canada: 'CA',
  'United States': 'US',
}

export const RegForm = () => {
  const dispatch = useAppDispatch()

  const initialForm: FormDataType = {
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

  const [formData, setFormData] = useState<FormDataType>(initialForm)
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
    const { name, value } = e.target
    const updatedForm = { ...formData, [name]: value }
    setFormData(updatedForm)
    if (hasSubmitted) validate(updatedForm)
  }

  const validateBillingFields = (data: FormDataType) => {
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

  const validate = (data: FormDataType) => {
    const newErrors: { [key: string]: string } = {}

    if (!isValidEmail(data.email)) newErrors.email = 'Invalid email format'
    if (!isValidPassword(data.password))
      newErrors.password =
        'Password must be at least 8 characters, include upper/lowercase, number and one special character'
    if (!isValidName(data.firstName)) newErrors.firstName = 'Invalid first name'
    if (!isValidName(data.lastName)) newErrors.lastName = 'Invalid last name'
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

    if (!validate(formData)) return

    const addresses = [
      {
        streetName: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: countryNameToCode[formData.country] || formData.country,
      },
    ]

    if (!useSameAddress) {
      addresses.push({
        streetName: formData.billingStreet,
        city: formData.billingCity,
        postalCode: formData.billingPostalCode,
        country:
          countryNameToCode[formData.billingCountry] || formData.billingCountry,
      })
    }

    const customerFormData: CustomerType = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.birthDate,
      addresses,
      defaultShippingAddress: defaultShipping ? 0 : undefined,
      defaultBillingAddress: defaultBilling
        ? useSameAddress
          ? 0
          : 1
        : undefined,
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

      dispatch(login(result.customer))
      console.log('Registration successful:', result)

      setMessage(`Account created for ${result.customer.email}`)

      setFormData(initialForm)
      setDefaultShipping(false)
      setDefaultBilling(false)
      setErrors({})
      setHasSubmitted(false)
    } catch (error: any) {
      const statusCode = error.statusCode || error.status || 500
      const errorList = error.response?.data?.errors || []
      const fallbackMessage = error.message || 'Something went wrong'

      let formattedMessage = `Error ${statusCode}: `

      switch (statusCode) {
        case 400:
          formattedMessage +=
            errorList.map((e: any) => `• ${e.message}`).join('\n') ||
            fallbackMessage
          break
        case 401:
          formattedMessage += 'Unauthorized. Please log in again.'
          break
        case 403:
          formattedMessage += 'Access denied.'
          break
        case 409:
          formattedMessage += 'An account with this email already exists.'
          break
        case 500:
        case 502:
        case 503:
          formattedMessage += 'Server error. Please try again later.'
          break
        default:
          formattedMessage += fallbackMessage
      }

      setErrorMessage(formattedMessage)
    }
  }

  const renderInput = (
    name: keyof FormDataType,
    label: string,
    type: string = 'text',
  ) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
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
  )

  const renderSelect = (name: keyof FormDataType, label: string) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={hasSubmitted && errors[name] ? 'input-error' : ''}
        aria-describedby={`${name}-error`}
        aria-invalid={!!errors[name]}
      >
        <option value="">-- Select a country --</option>
        {validCountries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      {hasSubmitted && errors[name] && (
        <span id={`${name}-error`} className="error-message">
          ⚠️ {errors[name]}
        </span>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="reg-form">
      {message && <p className="success-message">{message}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {renderInput('email', 'Email', 'email')}
      {renderInput('password', 'Password', 'password')}
      {renderInput('firstName', 'First Name')}
      {renderInput('lastName', 'Last Name')}
      {renderInput('birthDate', 'Birth Date', 'date')}

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={defaultShipping}
            onChange={() => setDefaultShipping(!defaultShipping)}
          />{' '}
          Default Shipping
        </label>
        <label>
          <input
            type="checkbox"
            checked={defaultBilling}
            onChange={() => setDefaultBilling(!defaultBilling)}
          />{' '}
          Default Billing
        </label>
        <label>
          <input
            type="checkbox"
            checked={useSameAddress}
            onChange={() => setUseSameAddress(!useSameAddress)}
          />{' '}
          Use same address
        </label>
      </div>

      <h3>Shipping Address</h3>
      {renderInput('street', 'Street')}
      {renderInput('city', 'City')}
      {renderInput('postalCode', 'Postal Code')}
      {renderSelect('country', 'Country')}

      {!useSameAddress && (
        <>
          <h3>Billing Address</h3>
          {renderInput('billingStreet', 'Street')}
          {renderInput('billingCity', 'City')}
          {renderInput('billingPostalCode', 'Postal Code')}
          {renderSelect('billingCountry', 'Billing Country')}
        </>
      )}

      <button
        type="submit"
        disabled={isButtonDisabled || Object.keys(errors).length > 0}
      >
        Register
      </button>
    </form>
  )
}
