import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoginModal from '../LoginModal'
import RegisterModal from '../RegisterModal'
import { useState } from 'react'

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  // Different menu items based on user type
  const getMenuItems = () => {
    if (!user) return []
    
    if (user.type === 'fundi') {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠', description: 'Overview & Analytics' },
        { path: '/dashboard/jobs', label: 'My Jobs', icon: '📋', description: 'Assigned work & projects' },
        { path: '/dashboard/availability', label: 'Availability', icon: '📅', description: 'Set your schedule' },
        { path: '/dashboard/messages', label: 'Messages', icon: '💬', description: 'Chat with clients' },
        { path: '/dashboard/payments', label: 'Earnings', icon: '💰', description: 'Payments received' },
        { path: '/dashboard/reviews', label: 'Reviews', icon: '⭐', description: 'Client feedback' },
        { path: '/dashboard/profile', label: 'Profile', icon: '👤', description: 'Edit your profile' },
        { path: '/dashboard/settings', label: 'Settings', icon: '⚙️', description: 'Account preferences' }
      ]
    } else if (user.type === 'admin') {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠', description: 'Admin Overview' },
        { path: '/dashboard/users', label: 'Users', icon: '👥', description: 'Manage all users' },
        { path: '/dashboard/fundis', label: 'Fundis', icon: '🛠️', description: 'Manage fundis' },
        { path: '/dashboard/jobs', label: 'All Jobs', icon: '📋', description: 'Monitor all jobs' },
        { path: '/dashboard/reports', label: 'Reports', icon: '📊', description: 'Analytics & reports' },
        { path: '/dashboard/settings', label: 'Settings', icon: '⚙️', description: 'System settings' }
      ]
    } else {
      // Default client menu
      return [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠', description: 'Overview & Analytics' },
        { path: '/dashboard/find-fundis', label: 'Find Fundis', icon: '🔍', description: 'Browse & hire fundis' },
        { path: '/dashboard/jobs', label: 'My Jobs', icon: '📋', description: 'Manage your projects' },
        { path: '/dashboard/bookings', label: 'My Bookings', icon: '📅', description: 'Appointments & schedules' },
        { path: '/dashboard/messages', label: 'Messages', icon: '💬', description: 'Chat with fundis' },
        { path: '/dashboard/payments', label: 'Payments', icon: '💰', description: 'Transaction history' },
        { path: '/dashboard/settings', label: 'Settings', icon: '⚙️', description: 'Account preferences' }
      ]
    }
  }

  const menuItems = getMenuItems()

  return (
    <>
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg">
              F
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FundiMatch</h1>
              <p className="text-sm text-gray-500">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-start space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg mt-0.5">{item.icon}</span>
                  <div className="flex-1">
                    <span className="font-medium block">{item.label}</span>
                    <span className={`text-xs ${
                      location.pathname === item.path ? 'text-blue-500' : 'text-gray-400'
                    }`}>
                      {item.description}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        {user ? (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Welcome, {user.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.type || 'user'}</p>
                  {user.skill && (
                    <p className="text-xs text-blue-600 font-medium">{user.skill}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-3">
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsRegisterOpen(true)}
                className="w-full px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Support Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🚀</div>
              <p className="text-sm text-gray-600 mb-2">Need help?</p>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </>
  )
}
