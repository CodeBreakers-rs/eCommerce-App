import React, { useState, useEffect } from 'react'
import { useAppDispatch } from '../../../store/hooks'
import { login } from '../../../store/slices/auth-slice'
import {
  registerCustomer,
  loginUser,
  sanitizeCustomerDraft,
} from '../services/auth-service'
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
import type {
  CustomerDraftPayload,
  FormDataType,
} from '../../../types/customer'

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

    const customerFormData: CustomerDraftPayload = {
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

    try {
      const result = await registerCustomer(sanitized as CustomerDraftPayload)
      console.log('Registration successful:', result)
      const loginResult = await loginUser(
        customerFormData.email,
        customerFormData.password,
      )
      dispatch(
        login({
          customer: loginResult.customer,
          token: loginResult.token,
        }),
      )
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
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`mt-1 block w-full rounded border-2 px-3 py-2 focus:outline-none transition ${
          hasSubmitted && errors[name]
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 focus:border-blue-500'
        }`}
        aria-describedby={`${name}-error`}
        aria-invalid={!!errors[name]}
      />
      {hasSubmitted && errors[name] && (
        <span id={`${name}-error`} className="text-red-600 text-sm mt-1 block">
          ⚠️ {errors[name]}
        </span>
      )}
    </div>
  )

  const renderSelect = (name: keyof FormDataType, label: string) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`mt-1 block w-full rounded border-2 px-3 py-2 focus:outline-none transition ${
          hasSubmitted && errors[name]
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 focus:border-blue-500'
        }`}
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
        <span id={`${name}-error`} className="text-red-600 text-sm mt-1 block">
          ⚠️ {errors[name]}
        </span>
      )}
    </div>
  )

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 space-y-4 bg-white shadow rounded"
    >
      {message && (
        <p className="text-green-600 font-medium text-sm">{message}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 font-medium whitespace-pre-line text-sm">
          {errorMessage}
        </p>
      )}

      {renderInput('email', 'Email', 'email')}
      {renderInput('password', 'Password', 'password')}
      {renderInput('firstName', 'First Name')}
      {renderInput('lastName', 'Last Name')}
      {renderInput('birthDate', 'Birth Date', 'date')}

      <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 mb-4">
        <label>
          <input
            type="checkbox"
            checked={defaultShipping}
            onChange={() => setDefaultShipping(!defaultShipping)}
            className="mr-2"
          />{' '}
          Default Shipping
        </label>
        <label className="inline-flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            checked={defaultBilling}
            onChange={() => setDefaultBilling(!defaultBilling)}
            className="mr-2"
          />{' '}
          Default Billing
        </label>
        <label className="inline-flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            checked={useSameAddress}
            onChange={() => setUseSameAddress(!useSameAddress)}
            className="mr-2"
          />{' '}
          Use same address
        </label>
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800">
        Shipping Address
      </h3>
      {renderInput('street', 'Street')}
      {renderInput('city', 'City')}
      {renderInput('postalCode', 'Postal Code')}
      {renderSelect('country', 'Country')}

      {!useSameAddress && (
        <>
          <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800">
            Billing Address
          </h3>
          {renderInput('billingStreet', 'Street')}
          {renderInput('billingCity', 'City')}
          {renderInput('billingPostalCode', 'Postal Code')}
          {renderSelect('billingCountry', 'Billing Country')}
        </>
      )}

      <button
        type="submit"
        disabled={isButtonDisabled || Object.keys(errors).length > 0}
        className={`w-full py-2 px-4 rounded font-semibold text-black transition ${
          isButtonDisabled || Object.keys(errors).length > 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Register
      </button>
    </form>
  )
}
