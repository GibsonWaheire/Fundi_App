import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/fundi-profile', label: 'Find Fundi', icon: '👷' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/contact', label: 'Contact', icon: '📞' }
  ]

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
            F
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FundiMatch</h1>
            <p className="text-sm text-gray-500">Connect & Build</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
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
  )
}
