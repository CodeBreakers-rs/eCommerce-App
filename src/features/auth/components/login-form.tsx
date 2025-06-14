import React, { useState } from 'react'
import { isValidEmail, isValidPassword } from '../../../utils/validators'
import {
  loginStarted,
  login,
  loginFailed,
} from '../../../store/slices/auth-slice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { loginUser } from '../services/auth-service'
import type { Customer } from '@commercetools/platform-sdk'

export const LoginForm = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  )
  const [isShownPassword, setIsShownPassword] = useState(false)
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

    if (!validate()) return
    dispatch(loginStarted())

    try {
      const result = await loginUser(email, password)
      dispatch(
        login({
          token: result.token,
          customer: result.customer as Customer,
        }),
      )
    } catch (error: any) {
      const message = error.message || 'Login failed'
      dispatch(loginFailed(message))
      setLoginError(message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white rounded shadow"
    >
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-3 py-2 border rounded transition-colors ${
            hasValidated && errors.email
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300'
          }`}
          aria-describedby="email-error"
        />
        {hasValidated && errors.email && (
          <span id="email-error" className="text-red-600 text-sm mt-1 block">
            ⚠️ {errors.email}
          </span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block mb-1 font-medium">
          Password
        </label>
        <input
          type={isShownPassword ? 'text' : 'password'}
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-3 py-2 border rounded transition-colors ${
            hasValidated && errors.password
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300'
          }`}
          aria-describedby="password-error"
        />
        <label
          htmlFor="show-password"
          className="mt-2 inline-flex items-center text-sm"
        >
          <input
            type="checkbox"
            id="show-password"
            checked={isShownPassword}
            onChange={() => setIsShownPassword((prev) => !prev)}
            className="mr-2"
          />
          Show Password 👁️‍🗨️
        </label>
        {hasValidated && errors.password && (
          <span id="password-error" className="text-red-600 text-sm mt-1 block">
            ⚠️ {errors.password}
          </span>
        )}
      </div>

      {loginError && (
        <div className="text-red-600 text-sm mb-4">{loginError}</div>
      )}

      <button
        type="submit"
        disabled={!email.trim() || !password.trim()}
        className={`w-full py-2 rounded text-black font-semibold transition ${
          !email.trim() || !password.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Login
      </button>

      {auth.isLoggedIn && auth.customer && (
        <div className="mt-4 text-green-600 text-sm">
          Logged in as: <strong>{auth.customer.email}</strong>
        </div>
      )}
    </form>
  )
}
