import { useState } from 'react'
import type { EditProfileModalProps } from '../../types/customer'
import { Modal } from '../../hooks/modal'
import { ChangePasswordModal } from './change-password-modal'
import { ProfileForm } from './profile-form'

export const EditProfileModal = ({
  customer,
  token,
  onSave,
  onClose,
}: EditProfileModalProps) => {
  const [isShownPasswordModal, setIsShownPasswordModal] = useState(false)

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Profile">
      <ProfileForm customer={customer} onSave={onSave} onClose={onClose} />

      <button
        onClick={() => setIsShownPasswordModal(true)}
        className="mt-4 px-4 py-2 bg-gray-400 hover:bg-[#40312d] text-white rounded"
      >
        Change Password
      </button>

      {isShownPasswordModal && (
        <ChangePasswordModal
          token={token}
          onClose={() => setIsShownPasswordModal(false)}
        />
      )}
    </Modal>
  )
}

export default EditProfileModal
