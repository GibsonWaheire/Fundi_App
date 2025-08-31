import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PhoneLoginModal({ isOpen, onClose, onSuccess, showPayment = false }) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate phone number format
    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Please enter a valid phone number (9 digits)')
      return
    }
    
    if (!phoneNumber.startsWith('7')) {
      setError('Phone number must start with 7')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call for phone verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create user object with phone number
      const userData = {
        id: Date.now().toString(),
        phone: `+254${phoneNumber}`,
        name: `User ${phoneNumber.slice(-4)}`,
        isVerified: true
      }
      
      // Login the user
      login(userData)
      
      // If this is for fundi discovery, show payment modal
      if (showPayment) {
        onSuccess(userData)
      } else {
        onClose()
        // Redirect to dashboard after successful phone login
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Failed to verify phone number. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white rounded-t-3xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              📱
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {showPayment ? 'Quick Access' : 'Sign In'}
            </h2>
            <p className="text-blue-100 text-lg">
              {showPayment 
                ? 'Enter your phone number to access fundi discovery' 
                : 'Enter your phone number to continue'
              }
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">
                  +254
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 9)
                    setPhoneNumber(value)
                    setError('')
                  }}
                  placeholder="7XX XXX XXX"
                  className="w-full pl-16 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200"
                  maxLength="9"
                  disabled={isLoading}
                />
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center">
                Enter the phone number registered with M-Pesa (9 digits starting with 7)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm">
                <div className="flex items-center">
                  <span className="text-xl mr-3">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">
                    {showPayment ? '💳' : '📱'}
                  </span>
                  {showPayment ? 'Continue to Payment' : 'Sign In'}
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
          </div>

          {showPayment && (
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="flex items-start">
                <span className="text-2xl mr-4">💡</span>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Pro Tip</h4>
                  <p className="text-blue-800 text-sm">
                    This phone number will be used for M-Pesa payments. Make sure it's the same number registered with your M-Pesa account.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
