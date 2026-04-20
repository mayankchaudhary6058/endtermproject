import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
