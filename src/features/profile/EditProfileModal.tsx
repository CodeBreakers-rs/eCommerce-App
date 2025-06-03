import React, { useState } from 'react'
import type {
  EditProfileModalProps,
  CustomerProfile,
} from '../../types/customer'

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  customer,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<CustomerProfile>({ ...customer })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <label>
          First Name:
          <input
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input name="email" value={formData.email} onChange={handleChange} />
        </label>
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default EditProfileModal
