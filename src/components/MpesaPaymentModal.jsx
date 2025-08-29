import { useState } from 'react'

const MpesaPaymentModal = ({ isOpen, onClose, fundiName, amount = 50, onPaymentSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number')
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (M-Pesa)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    +254
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="7XX XXX XXX"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the phone number registered with M-Pesa
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Profile Access</span>
                  <span className="text-sm font-medium text-gray-900">KSh {amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">M-Pesa Fee</span>
                  <span className="text-sm font-medium text-gray-900">KSh 0</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-green-600">KSh {amount}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  'Pay with M-Pesa'
                )}
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  You will receive an M-Pesa STK push notification on your phone
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default MpesaPaymentModal
