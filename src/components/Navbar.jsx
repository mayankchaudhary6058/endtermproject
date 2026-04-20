import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, BarChart2, LogOut, Zap } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navLink = (to, Icon, label) => (
    <Link
      to={to}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
        pathname === to
          ? 'bg-green-500/20 text-green-400'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon size={16} />
      {label}
    </Link>
  )

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
            <Zap size={16} className="text-gray-950" fill="currentColor" />
          </div>
          <span className="font-display text-lg font-bold text-white">HabitFlow</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLink('/dashboard', LayoutDashboard, 'Dashboard')}
          {navLink('/analytics', BarChart2, 'Analytics')}
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-gray-500">Signed in as</p>
            <p className="text-sm font-medium text-gray-200">{user?.displayName || user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-400 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
