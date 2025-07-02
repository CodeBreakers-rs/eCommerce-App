import React, { useState } from 'react'
import { isValidEmail, isValidPassword } from '../../../utils/validators'
import {
  loginStarted,
  login,
  loginFailed,
} from '../../../store/slices/auth-slice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { loginUser } from '../services/auth-service'
import regFormImg from '../../../assets/images/login-reg.png'

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Login failed'
}

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void (async () => {
      setHasValidated(true)
      setLoginError('')

      if (!validate()) return
      dispatch(loginStarted())

      try {
        const result = await loginUser(email, password)
        dispatch(
          login({
            token: result.token,
            customer: result.customer,
          }),
        )
      } catch (error: unknown) {
        const message = getErrorMessage(error)
        dispatch(loginFailed(message))
        setLoginError(message)
      }
    })()
  }

  return (
    <div className="flex items-center justify-center bg-[#f6ebdf] px-4">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-6xl gap-6 md:gap-0 py-6">
        <div className="w-full md:w-1/3 p-8">
          <h1 className="text-3xl font-bold text-[#3c2c27] mb-2">
            Welcome again!
          </h1>
          <p className="text-[#5a4b47] mb-6">Please enter your details</p>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-[#fdf7f2] rounded-lg p-4 sm:p-6 space-y-5 shadow-md mx-auto"
          >
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border-2 outline-none focus:ring-2 transition ${
                  hasValidated && errors.email
                    ? 'border-red-500 bg-red-50 focus:ring-red-300'
                    : 'border-[#d8cfc7] focus:ring-[#b49d8c]'
                }`}
                aria-describedby="email-error"
              />
              {hasValidated && errors.email && (
                <span
                  id="email-error"
                  className="text-red-600 text-sm mt-1 block"
                >
                  ⚠️ {errors.email}
                </span>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={isShownPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 pr-10 rounded-md border-2 outline-none focus:ring-2 transition ${
                    hasValidated && errors.password
                      ? 'border-red-500 bg-red-50 focus:ring-red-300'
                      : 'border-[#d8cfc7] focus:ring-[#b49d8c]'
                  }`}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  onClick={() => setIsShownPassword(!isShownPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {isShownPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {hasValidated && errors.password && (
                <span
                  id="password-error"
                  className="text-red-600 text-sm mt-1 block"
                >
                  ⚠️ {errors.password}
                </span>
              )}
            </div>

            {loginError && (
              <div className="text-red-600 text-sm mb-2">{loginError}</div>
            )}

            <button
              type="submit"
              disabled={!email.trim() || !password.trim()}
              className={`w-full py-2 rounded-md font-semibold transition ${
                !email.trim() || !password.trim()
                  ? 'bg-[#d8cfc7] text-white cursor-not-allowed'
                  : 'bg-[#3c2c27] text-white hover:bg-[#5a4b47]'
              }`}
            >
              Log in
            </button>

            <div className="text-sm text-[#5a4b47] mt-2 text-center">
              You don't have an account?{' '}
              <a href="/register" className="font-bold hover:underline">
                Registration
              </a>
            </div>

            {auth.isLoggedIn && auth.customer && (
              <div className="mt-4 text-green-600 text-sm text-center">
                Logged in as: <strong>{auth.customer.email}</strong>
              </div>
            )}
          </form>
        </div>

        <div className="hidden md:flex w-full md:w-2/3 justify-center items-center p-6">
          <img
            src={regFormImg}
            alt="Login illustration"
            className="w-full max-w-[800px] h-auto object-contain"
          />
        </div>
      </div>
    </div>
  )
}
