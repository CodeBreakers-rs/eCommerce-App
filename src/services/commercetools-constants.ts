export const PROJECT_KEY = import.meta.env.VITE_CT_PROJECT_KEY
export const API_BASE_URL = import.meta.env.VITE_CT_API_URL
export const AUTH_URL = import.meta.env.VITE_CT_AUTH_URL
export const CLIENT_ID = import.meta.env.VITE_CT_CLIENT_ID
export const CLIENT_SECRET = import.meta.env.VITE_CT_CLIENT_SECRET

export const SIGNUP_URL = `${API_BASE_URL}/${PROJECT_KEY}/customers`
export const TOKEN_URL = `${AUTH_URL}/oauth/${PROJECT_KEY}/customers/token`
export const API_ME_URL = `${API_BASE_URL}/${PROJECT_KEY}/me`
