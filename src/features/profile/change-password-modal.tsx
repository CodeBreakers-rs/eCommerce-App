import { useState, useRef } from 'react'
import { changeCustomerPassword } from './services/password-service'
import { getCustomerProfile } from '../../features/profile/services/customer-service'
import { useClickOutside } from '../../hooks/use-click-outside'

type Props = {
  token: string
  onClose: () => void
}

export const ChangePasswordModal = ({ token, onClose }: Props) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isShownPassword, setIsShownPasswords] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useClickOutside(modalRef, onClose)

  const togglePasswordVisibility = () => setIsShownPasswords((prev) => !prev)

  const validate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return 'All fields are required'
    }
    if (newPassword.length < 8) {
      return 'Password must be at least 8 characters, include upper/lowercase, number and one special character'
    }
    if (newPassword !== confirmPassword) {
      return 'Passwords do not match'
    }
    return ''
  }

  const handleSubmit = async () => {
    const validationError = validate()
    if (validationError) return setError(validationError)

    try {
      const customer = await getCustomerProfile(token)

      if (!customer) {
        setError('Customer data is not available.')
        return
      }
      await changeCustomerPassword(
        token,
        currentPassword,
        newPassword,
        customer.version,
      )
      setSuccess(true)
      setTimeout(onClose, 2000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Change Password 🔒
        </h2>

        {success ? (
          <p className="text-green-600 text-center">
            Password changed successfully 🎉
          </p>
        ) : (
          <div className="space-y-4">
            <input
              id="current-password"
              data-testid="current-password"
              type={isShownPassword ? 'text' : 'password'}
              placeholder="Current Password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              id="new-password"
              data-testid="new-password"
              type={isShownPassword ? 'text' : 'password'}
              placeholder="New Password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              id="confirm-password"
              data-testid="confirm-password"
              type={isShownPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                id="toggle-password-visibility"
                data-testid="toggle-password-visibility"
                type="checkbox"
                checked={isShownPassword}
                onChange={togglePasswordVisibility}
              />
              Show Passwords
            </label>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="flex justify-between">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-gray-400 hover:bg-[#40312d] text-white rounded transition"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
