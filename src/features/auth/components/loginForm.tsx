import React, { useState } from 'react'
import { isValidEmail, isValidPassword } from '../../../utils/validators'
import { loginWithPassword, getCustomerData } from '../services/authService'
//import { logout } from '../services/authService'
import './regForm.css'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  )
  const [showPassword, setShowPassword] = useState(false)
  const [hasValidated, setHasValidated] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [user, setUser] = useState<any>(null)

  const validate = () => {
    const newErrors: typeof errors = {}

    if (!isValidEmail(email)) newErrors.email = 'Invalid email format'
    if (!isValidPassword(password))
      newErrors.password =
        'Password must be at least 8 characters, include upper/lowercase, number and one special character'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasValidated(true)
    setLoginError('')
    if (validate()) {
      try {
        const tokens = await loginWithPassword(email, password)
        const customer = await getCustomerData(tokens.access_token)
        console.log('Customer data:', customer)
        setUser(customer)
        alert(`Welcome, ${customer.firstName || customer.email}!`)
      } catch (error: any) {
        setLoginError(
          'Login failed. Please check your credentials and try again.',
        )
        console.error(error)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="reg-form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={hasValidated && errors.email ? 'input-error' : ''}
          aria-describedby="email-error"
        />
        {hasValidated && errors.email && (
          <span id="email-error" className="error-message">
            ⚠️ {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={hasValidated && errors.password ? 'input-error' : ''}
          aria-describedby="password-error"
        />
        <div>
          <label htmlFor="show-password">
            <input
              type="checkbox"
              id="show-password"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />
            Show Password 👁️‍🗨️
          </label>
        </div>
        {hasValidated && errors.password && (
          <span id="password-error" className="error-message">
            ⚠️ {errors.password}
          </span>
        )}
      </div>

      {loginError && <div className="error-message">{loginError}</div>}

      <button type="submit" disabled={!email.trim() || !password.trim()}>
        Login
      </button>
      {user && (
        <>
          <div className="success-message">
            Logged in as: <strong>{user.email}</strong>
          </div>
        </>
      )}
    </form>
  )
}
