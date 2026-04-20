import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setError('')
    setLoading(true)
    try {
      await register(form.email, form.password, form.name)
      navigate('/dashboard')
    } catch (err) {
      if (err.message?.includes('email-already')) {
        setError('This email is already in use')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
            <Zap size={24} className="text-gray-950" fill="currentColor" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Start your journey</h1>
          <p className="mt-2 text-gray-400">Build habits that actually stick</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {fields.map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="mb-1.5 block text-sm text-gray-400">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-green-500 focus:outline-none"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-500 py-3 font-display font-semibold text-gray-950 transition-all hover:bg-green-400 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-green-400 hover:text-green-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
