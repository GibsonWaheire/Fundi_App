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
    
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call for phone verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create user object with phone number
      const userData = {
        id: Date.now().toString(),
        phone: phoneNumber,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">📱</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {showPayment ? 'Quick Access' : 'Sign In'}
          </h2>
          <p className="text-gray-600">
            {showPayment 
              ? 'Enter your phone number to access fundi discovery' 
              : 'Enter your phone number to continue'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                +254
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="7XX XXX XXX"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              We'll send you a verification code via SMS
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Verifying...
              </span>
            ) : (
              showPayment ? 'Continue to Payment' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Cancel
          </button>
        </div>

        {showPayment && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center text-blue-800">
              <span className="text-lg mr-2">💡</span>
              <p className="text-sm">
                <strong>Pro Tip:</strong> This phone number will be used for M-Pesa payments
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
