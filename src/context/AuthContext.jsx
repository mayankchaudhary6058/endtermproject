import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import { registerUser, loginUser, logoutUser } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const register = async (email, password, displayName) => {
    setError(null)
    try {
      await registerUser(email, password, displayName)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const login = async (email, password) => {
    setError(null)
    try {
      await loginUser(email, password)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    await logoutUser()
  }

  const value = { user, loading, error, register, login, logout }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
