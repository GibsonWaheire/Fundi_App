import { useState, useEffect } from 'react'

const MpesaPaymentModal = ({ isOpen, onClose, fundiName, amount = 50, onPaymentSuccess, phoneNumber: initialPhoneNumber }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [error, setError] = useState('')

  // Set initial phone number if provided
  useEffect(() => {
    if (initialPhoneNumber) {
      setPhoneNumber(initialPhoneNumber.replace('+254', ''))
    }
  }, [initialPhoneNumber])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Please enter a valid phone number (9 digits)')
      return
    }
    
    if (!phoneNumber.startsWith('7')) {
      setError('Phone number must start with 7')
      return
    }

    setIsProcessing(true)
    
    // Simulate M-Pesa STK push
    setTimeout(() => {
      // Simulate successful payment
      setPaymentStatus('success')
      setIsProcessing(false)
      
      // Close modal after 3 seconds
      setTimeout(() => {
        onClose()
        setPaymentStatus(null)
        setPhoneNumber('')
        setError('')
        if (onPaymentSuccess) {
          onPaymentSuccess()
        }
      }, 3000)
    }, 3000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="relative p-8 pb-6">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
          >
            ✕
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl">📱</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">M-Pesa Payment</h2>
            <p className="text-gray-600">Pay KSh {amount} to view {fundiName}'s full profile</p>
          </div>
        </div>

        {paymentStatus === 'success' ? (
          <div className="px-8 pb-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-3xl">✅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">You can now view the complete fundi profile.</p>
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <p className="text-sm text-green-800">
                An M-Pesa confirmation message has been sent to your phone.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 pb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Phone Number (M-Pesa)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
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
                    className="w-full pl-16 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-lg"
                    placeholder="7XX XXX XXX"
                    maxLength="9"
                    required
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-600 mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {error}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Enter the phone number registered with M-Pesa (9 digits starting with 7)
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Payment Summary</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Access</span>
                    <span className="text-sm font-medium text-gray-900">KSh {amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">M-Pesa Fee</span>
                    <span className="text-sm font-medium text-gray-900">KSh 0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Total Amount</span>
                      <span className="font-bold text-lg text-green-600">KSh {amount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Processing Payment...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">📱</span>
                    Pay with M-Pesa
                  </div>
                )}
              </button>

              <div className="text-center space-y-2">
                <p className="text-xs text-gray-500">
                  You will receive an M-Pesa STK push notification on your phone
                </p>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800">
                    💡 <strong>Tip:</strong> Make sure your phone has network coverage and M-Pesa is active
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default MpesaPaymentModal
