import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { HabitProvider } from './context/HabitContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy loaded pages (React.lazy + Suspense)
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Analytics = lazy(() => import('./pages/Analytics'))

const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-950">
    <Navbar />
    <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
  </div>
)

const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-gray-950">
    <LoadingSpinner size="lg" text="Loading..." />
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HabitProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Analytics />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </HabitProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
