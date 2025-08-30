import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path) => location.pathname === path

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FundiMatch
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Home
                {isActive('/') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                )}
              </Link>
              <Link 
                to="/find-fundis" 
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                      isActive('/find-fundis') 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Find Fundis
                {isActive('/find-fundis') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                )}
              </Link>
              <Link 
                to="/fundi" 
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive('/fundi') 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                For Fundis
                {isActive('/fundi') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                )}
              </Link>
              <Link 
                to="/about" 
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive('/about') 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                About
                {isActive('/about') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                )}
              </Link>
              <Link 
                to="/contact" 
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive('/contact') 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Contact
                {isActive('/contact') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                )}
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Welcome, {user.username}</span>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  {isActive('/fundi') ? (
                    // Fundi page buttons
                    <>
                      <button 
                        onClick={() => setIsLoginOpen(true)}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                      >
                        Fundi Sign In
                      </button>
                      <button 
                        onClick={() => setIsRegisterOpen(true)}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Join as Fundi
                      </button>
                    </>
                  ) : (
                    // Main site buttons
                    <>
                      <button 
                        onClick={() => setIsLoginOpen(true)}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => setIsRegisterOpen(true)}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} allowFundis={isActive('/fundi')} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} allowFundis={isActive('/fundi')} />
    </>
  )
}

export default Navbar
