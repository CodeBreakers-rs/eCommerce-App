import React, { useState, useEffect } from 'react'
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

export const RegForm = () => {
  const [formData, setFormData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedForm = { ...formData, [e.target.name]: e.target.value }
    setFormData(updatedForm)
    validate(updatedForm)
  }

  const validate = (data = formData) => {
    const newErrors: typeof errors = {}

    if (!isValidEmail(data.email)) newErrors.email = 'Invalid email format'
    if (!isValidPassword(data.password))
      newErrors.password =
        'Password must be at least 8 characters, include upper/lowercase and number'
    if (!isValidName(data.firstName)) newErrors.firstName = 'Invalid first name'
    if (!isValidName(data.lastName)) newErrors.lastName = 'Invalid last name'
    if (!isValidBirthDate(data.birthDate))
      newErrors.birthDate = 'You must be at least 13 years old'
    if (!isValidStreet(data.street)) newErrors.street = 'Street cannot be empty'
    if (!isValidCity(data.city)) newErrors.city = 'Invalid city name'
    if (!isValidPostalCode(data.postalCode, 'US'))
      newErrors.postalCode = 'Invalid postal code'
    if (!isValidCountry(data.country, validCountries))
      newErrors.country = 'Select a valid country'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    const allFilled = Object.values(formData).every((val) => val.trim() !== '')
    const noErrors = validate(formData)
    setIsButtonDisabled(!(allFilled && noErrors))
  }, [formData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isButtonDisabled) {
      //connectApi();  //TODO
    }
  }

  return (
    <form onSubmit={handleSubmit} className="reg-form">
      {[
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'password', type: 'password', label: 'Password' },
        { name: 'firstName', type: 'text', label: 'First Name' },
        { name: 'lastName', type: 'text', label: 'Last Name' },
        { name: 'birthDate', type: 'date', label: 'Birth Date' },
        { name: 'street', type: 'text', label: 'Street' },
        { name: 'city', type: 'text', label: 'City' },
        { name: 'postalCode', type: 'text', label: 'Postal Code' },
        { name: 'country', type: 'text', label: 'Country' },
      ].map(({ name, type, label }) => (
        <div key={name} className="form-group">
          <label htmlFor={name}>{label}</label>
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            className={errors[name] ? 'input-error' : ''}
            aria-describedby={`${name}-error`}
            aria-invalid={!!errors[name]}
          />
          {errors[name] && (
            <span id={`${name}-error`} className="error-message">
              ⚠️ {errors[name]}
            </span>
          )}
        </div>
      ))}
      <button type="submit" disabled={isButtonDisabled}>
        Register
      </button>
    </form>
  )
}
