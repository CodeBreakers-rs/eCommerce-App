import React, { useState } from 'react'
import { isValidEmail, isValidPassword } from '../../../utils/validators'
import './regForm.css'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  )
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const newErrors: typeof errors = {}

    if (!isValidEmail(email)) newErrors.email = 'Invalid email format'
    if (!isValidPassword(password))
      newErrors.password =
        'Password must be at least 8 characters, include upper/lowercase, number and one special character'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (validate()) {
      alert('Form submitted successfully')
      // API //TODO
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
          className={submitted && errors.email ? 'input-error' : ''}
          aria-describedby="email-error"
        />
        {submitted && errors.email && (
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
          className={submitted && errors.password ? 'input-error' : ''}
          aria-describedby="password-error"
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />
            Show Password 👁️‍🗨️
          </label>
        </div>
        {submitted && errors.password && (
          <span id="password-error" className="error-message">
            ⚠️ {errors.password}
          </span>
        )}
      </div>

      <button type="submit" disabled={!email.trim() || !password.trim()}>
        Login
      </button>
    </form>
  )
}
