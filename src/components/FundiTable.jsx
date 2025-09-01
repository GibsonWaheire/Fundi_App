import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import PhoneLoginModal from './PhoneLoginModal'
import MpesaPaymentModal from './MpesaPaymentModal'

const FundiTable = () => {
  const { user } = useAuth()
  const [fundis, setFundis] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedService, setSelectedService] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [showContactModal, setShowContactModal] = useState(false)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedFundi, setSelectedFundi] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [unlockedFundis, setUnlockedFundis] = useState(new Set())
  const [forceContactView, setForceContactView] = useState(false)

  // Fetch fundis data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const fundisData = await authService.getAllFundis()
        setFundis(fundisData)
        
        // Set current user if logged in
        if (user) {
          setCurrentUser(user)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const services = [
    { id: 'all', name: 'All Services', icon: '🔧' },
    { id: 'plumbing', name: 'Plumbing', icon: '🚰' },
    { id: 'electrical', name: 'Electrical', icon: '⚡' },
    { id: 'construction', name: 'Construction', icon: '🏗️' },
    { id: 'painting', name: 'Painting', icon: '🎨' },
    { id: 'carpentry', name: 'Carpentry', icon: '🪑' },
    { id: 'cleaning', name: 'Cleaning', icon: '🧹' }
  ]

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'nairobi', name: 'Nairobi' },
    { id: 'mombasa', name: 'Mombasa' },
    { id: 'kisumu', name: 'Kisumu' },
    { id: 'nakuru', name: 'Nakuru' },
    { id: 'eldoret', name: 'Eldoret' }
  ]

  // Helper function to get avatar by specialization
  const getAvatarBySpecialization = (specialization) => {
    const avatars = {
      'Plumbing': '🚰',
      'Electrical': '⚡',
      'Carpentry': '🪑',
      'Painting': '🎨',
      'Construction': '🏗️',
      'Cleaning': '🧹'
    }
    return avatars[specialization] || '🔧'
  }

  // Transform fundis data for display
  const transformedFundis = fundis.map(fundi => ({
    id: fundi.id,
    name: fundi.username,
    service: fundi.specialization,
    location: fundi.location,
    rating: fundi.rating || 4.5,
    hourlyRate: fundi.hourly_rate,
    experience: fundi.experience,
    verified: fundi.is_active,
    available: fundi.is_available !== false,
    avatar: getAvatarBySpecialization(fundi.specialization),
    phone: fundi.phone,
    email: fundi.email
  }))

  // Check if fundi is unlocked
  const isUnlocked = (fundiId) => {
    return unlockedFundis.has(fundiId)
  }

  const handleViewContact = (fundi) => {
    setSelectedFundi(fundi)
    
    if (isUnlocked(fundi.id)) {
      // Fundi is already unlocked - show contact details
      setShowContactModal(true)
    } else {
      // Fundi is locked - start payment flow
      if (!currentUser) {
      setIsPhoneModalOpen(true)
      } else {
        setIsPaymentModalOpen(true)
      }
    }
  }

  const handlePhoneSuccess = (userData) => {
    setCurrentUser(userData)
    setIsPhoneModalOpen(false)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = () => {
            // SECURITY: Removed console.log for production
    
    // Close payment modal
    setIsPaymentModalOpen(false)
    
    // Add fundi to unlocked set
    if (selectedFundi) {
      setUnlockedFundis(prev => new Set([...prev, selectedFundi.id]))
      
      // FORCE CONTACT VIEW - User cannot escape this
      setForceContactView(true)
    setShowContactModal(true)
      
      // Show success message
      alert(`🎉 Success! ${selectedFundi.name} is now unlocked! You will now see the contact details.`)
    }
  }

  // Filter fundis
  const filteredAndSortedFundis = transformedFundis
    .filter(fundi => {
      const matchesSearch = fundi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fundi.service.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesService = selectedService === 'all' || fundi.service.toLowerCase() === selectedService
      const matchesLocation = selectedLocation === 'all' || fundi.location.toLowerCase().includes(selectedLocation)
      return matchesSearch && matchesService && matchesLocation
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fundis...</p>
        </div>
      </div>
    )
  }

  // FORCE CONTACT VIEW - If user just paid, show ONLY the contact modal
  if (forceContactView && selectedFundi && showContactModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                {selectedFundi.avatar}
              </div>
              <h3 className="text-3xl font-bold mb-2">{selectedFundi.name}</h3>
              <p className="text-green-100 text-lg">{selectedFundi.service}</p>
              <div className="flex items-center justify-center mt-4">
                <span className="text-yellow-300 text-lg mr-2">⭐</span>
                <span className="font-semibold">{selectedFundi.rating}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Contact Details */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📞</span>
                  <span className="text-gray-600">Phone</span>
                </div>
                <span className="font-semibold text-gray-900">{selectedFundi.phone}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📧</span>
                  <span className="text-gray-600">Email</span>
                </div>
                <span className="font-semibold text-gray-900">{selectedFundi.email}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📍</span>
                  <span className="text-gray-600">Location</span>
                </div>
                <span className="font-semibold text-gray-900">{selectedFundi.location}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💰</span>
                  <span className="text-gray-600">Rate</span>
                </div>
                <span className="font-semibold text-green-600">KSh {selectedFundi.hourlyRate}/hr</span>
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">🔓</span>
                <p className="text-green-800 text-sm font-semibold">
                  <strong>PAYMENT SUCCESSFUL!</strong>
                </p>
              </div>
              <p className="text-green-800 text-sm text-center">
                ✅ <strong>Contact Unlocked!</strong> You can now contact this fundi directly.
              </p>
              <div className="text-green-700 text-xs text-center mt-2 space-y-1">
                <p>🎯 <strong>This specific fundi ({selectedFundi.name}) is now unlocked for you!</strong></p>
                <p>💡 Other fundis remain locked. Pay KSh 50 each to unlock their contact details.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowContactModal(false)
                  setForceContactView(false)
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Close & Continue Browsing
              </button>
              <button
                onClick={() => {
                  setShowContactModal(false)
                  setForceContactView(false)
                  alert('Please sign up to access more features!')
                  window.location.href = '/'
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Skilled Fundis</h1>
            <p className="text-xl text-gray-600">
              Browse verified professionals. Pay KSh 50 per fundi to unlock their contact details.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">�� How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                💳
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pay KSh 50</h3>
              <p className="text-gray-600 text-sm">Per fundi to unlock their contact details</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                📞
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Contact Details</h3>
              <p className="text-gray-600 text-sm">Phone number and email address</p>
                </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                🔒
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Others Remain Locked</h3>
              <p className="text-gray-600 text-sm">Pay separately for each fundi</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search fundis by name or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.icon} {service.name}
                </option>
              ))}
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
              <h3 className="text-xl font-semibold text-gray-900">
                  Found <span className="text-blue-600">{filteredAndSortedFundis.length}</span> fundis
                </h3>
                <p className="text-gray-600">Ready to help with your project</p>
              <div className="mt-2 flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <span className="text-blue-600 mr-1">🔓</span>
                  <span className="text-gray-600">
                    {filteredAndSortedFundis.filter(f => isUnlocked(f.id)).length} unlocked
                  </span>
                </span>
                <span className="flex items-center">
                  <span className="text-gray-600 mr-1">🔒</span>
                  <span className="text-gray-600">
                    {filteredAndSortedFundis.filter(f => !isUnlocked(f.id)).length} locked
                  </span>
                </span>
              </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{filteredAndSortedFundis.length}</div>
              <div className="text-sm text-gray-500">Total Fundis</div>
            </div>
          </div>
        </div>

        {/* Fundis Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left">Fundi</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Rate</th>
                  <th className="px-4 py-3 text-left">Experience</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Access</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedFundis.map((fundi, index) => (
                  <tr key={fundi.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                          {fundi.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{fundi.name}</div>
                          <div className="text-sm text-gray-500">{fundi.experience}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900">{fundi.service}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-600">📍 {fundi.location}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        <span className="font-semibold">{fundi.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-green-600">KSh {fundi.hourlyRate}/hr</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-600">{fundi.experience}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        fundi.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {fundi.available ? '🟢 Available' : '🔴 Busy'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isUnlocked(fundi.id)
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isUnlocked(fundi.id) ? '🔓 Unlocked' : '🔒 Locked'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isUnlocked(fundi.id) ? (
                        <div className="space-y-2">
                          <div 
                            className="text-sm text-gray-600 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                            onClick={() => handleViewContact(fundi)}
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <span>📞</span>
                              <span className="font-semibold">{fundi.phone}</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2 mt-1">
                              <span>📧</span>
                              <span className="font-semibold">{fundi.email}</span>
                            </div>
                            <div className="text-xs text-blue-600 mt-1 text-center">
                              Click to view full profile
                            </div>
                          </div>
                        </div>
                      ) : (
                      <button
                        onClick={() => handleViewContact(fundi)}
                        disabled={!fundi.available}
                          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="flex items-center">
                            <span className="mr-1">💳</span>
                            Pay KSh 50
                          </span>
                        </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regular Contact Modal (for already unlocked fundis) */}
        {showContactModal && selectedFundi && !forceContactView && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  {selectedFundi.avatar}
                </div>
                <h3 className="text-3xl font-bold mb-2">{selectedFundi.name}</h3>
                <p className="text-blue-100 text-lg">{selectedFundi.service}</p>
                <div className="flex items-center justify-center mt-4">
                  <span className="text-yellow-300 text-lg mr-2">⭐</span>
                  <span className="font-semibold">{selectedFundi.rating}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Contact Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📞</span>
                    <span className="text-gray-600">Phone</span>
                  </div>
                  <span className="font-semibold text-gray-900">{selectedFundi.phone}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📧</span>
                    <span className="text-gray-600">Email</span>
                  </div>
                  <span className="font-semibold text-gray-900">{selectedFundi.email}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📍</span>
                    <span className="text-gray-600">Location</span>
                  </div>
                  <span className="font-semibold text-gray-900">{selectedFundi.location}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💰</span>
                    <span className="text-gray-600">Rate</span>
                  </div>
                  <span className="font-semibold text-green-600">KSh {selectedFundi.hourlyRate}/hr</span>
                </div>
              </div>

              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-2xl mr-2">🔓</span>
                    <p className="text-green-800 text-sm font-semibold">
                      <strong>Contact Unlocked!</strong>
                    </p>
                  </div>
                <p className="text-green-800 text-sm text-center">
                    ✅ You can now contact this fundi directly.
                  </p>
                  <div className="text-green-700 text-xs text-center mt-2 space-y-1">
                    <p>💡 Other fundis remain locked. Pay KSh 50 each to unlock their contact details.</p>
                    <p>🎯 <strong>This specific fundi ({selectedFundi.name}) is unlocked for you!</strong></p>
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Close
                </button>
                  <button
                    onClick={() => {
                      setShowContactModal(false)
                      alert('Please sign up to access more features!')
                      window.location.href = '/'
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                  >
                    Sign Up Free
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <PhoneLoginModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onSuccess={handlePhoneSuccess}
        showPayment={true}
      />

      <MpesaPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        fundi={selectedFundi}
          phoneNumber={currentUser?.phone}
      />
      </div>
    </div>
  )
}

export default FundiTable

