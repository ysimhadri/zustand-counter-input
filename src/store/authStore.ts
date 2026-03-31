import { create } from 'zustand'

interface User {
  id: number
  name: string
  username: string
  role: string
}

interface AuthState {
  token: string | null
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  verify: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Rehydrate from localStorage on first load
  token: localStorage.getItem('jwt_token'),
  user: null,

  login: async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')

    localStorage.setItem('jwt_token', data.token)
    set({ token: data.token, user: data.user })
  },

  logout: () => {
    localStorage.removeItem('jwt_token')
    set({ token: null, user: null })
  },

  // Called on app mount to validate a stored token
  verify: async () => {
    const { token } = get()
    if (!token) return
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      localStorage.removeItem('jwt_token')
      set({ token: null, user: null })
      return
    }
    const data = await res.json()
    set({ user: data.user })
  },
}))
