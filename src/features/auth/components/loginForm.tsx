import React, { useState } from 'react'
import { isValidEmail, isValidPassword } from '../../../utils/validators'
import { login } from '../../../store/slices/auth-slice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { getCustomerData, loginWithPassword } from '../services/authService'
import { saveAuthState } from '../../../store/local-storage'
import './regForm.css'

export const LoginForm = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  )
  const [showPassword, setShowPassword] = useState(false)
  const [hasValidated, setHasValidated] = useState(false)
  const [loginError, setLoginError] = useState('')

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
        const tokenData = await loginWithPassword(email, password)
        const customer = await getCustomerData(tokenData.access_token)

        const payload = {
          customer,
          token: tokenData.access_token,
        }

        dispatch(login(payload))
        saveAuthState({
          isLoggedIn: true,
          customer,
          token: tokenData.access_token,
        })
        console.log('Customer data:', customer)
      } catch (error: any) {
        setLoginError(error.message || 'Login failed')
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

      {auth.isLoggedIn && auth.customer && (
        <>
          <div className="success-message">
            Logged in as: <strong>{auth.customer.email}</strong>
          </div>
        </>
      )}
    </form>
  )
}
