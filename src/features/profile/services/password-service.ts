import { API_ME_URL } from '../../../services/commercetools-constants'

export async function changeCustomerPassword(
  accessToken: string,
  currentPassword: string,
  newPassword: string,
  version: number,
): Promise<void> {
  const response = await fetch(`${API_ME_URL}/password`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version,
      currentPassword,
      newPassword,
    }),
  })

  if (!response.ok) {
    throw new Error(`Password change failed: ${response.status}`)
  }
}
