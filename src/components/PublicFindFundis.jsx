import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import PhoneLoginModal from './PhoneLoginModal'
import MpesaPaymentModal from './MpesaPaymentModal'

export default function PublicFindFundis() {
  const { user } = useAuth()
  const [selectedFundi, setSelectedFundi] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedService, setSelectedService] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [showContactModal, setShowContactModal] = useState(false)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [fundis, setFundis] = useState([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [paidFundiId, setPaidFundiId] = useState(null) // Track which fundi was paid for

  // Fetch fundis data
  useEffect(() => {
    const fetchFundis = async () => {
      try {
        const fundisData = await authService.getAllFundis()
        setFundis(fundisData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching fundis:', error)
        setLoading(false)
      }
    }

    fetchFundis()
  }, [])

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

  // Helper function to get specialties by specialization
  const getSpecialtiesBySpecialization = (specialization) => {
    const specialties = {
      'Plumbing': ['Pipe Repair', 'Drainage', 'Installation'],
      'Electrical': ['Wiring', 'Installation', 'Repairs'],
      'Carpentry': ['Furniture', 'Cabinets', 'Repairs'],
      'Painting': ['Interior', 'Exterior', 'Wallpaper'],
      'Construction': ['Renovation', 'Foundation', 'Roofing'],
      'Cleaning': ['Deep Cleaning', 'Post-Construction', 'Regular']
    }
    return specialties[specialization] || ['General Repairs']
  }

  // Transform fundis data for display
  const transformedFundis = fundis.map(fundi => ({
    id: fundi.id,
    name: fundi.username,
    service: fundi.specialization,
    location: fundi.location,
    rating: fundi.rating || 4.5,
    reviews: 0, // Will be calculated from reviews
    hourlyRate: `KSh ${fundi.hourly_rate}`,
    experience: fundi.experience,
    verified: fundi.is_active,
    available: fundi.is_available !== false, // Default to true if not explicitly false
    avatar: getAvatarBySpecialization(fundi.specialization),
    specialties: getSpecialtiesBySpecialization(fundi.specialization),
    phone: fundi.phone,
    email: fundi.email
  }))

  const handleViewContact = (fundi) => {
    setSelectedFundi(fundi)
    
    if (user) {
      // If user is logged in, show contact directly
      setShowContactModal(true)
    } else if (paidFundiId === fundi.id) {
      // If this fundi was already paid for, show contact
      setShowContactModal(true)
    } else {
      // If not logged in and not paid for this fundi, require payment
      setIsPhoneModalOpen(true)
    }
  }

  const handlePhoneSuccess = (user) => {
    setUserData(user)
    setIsPhoneModalOpen(false)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false)
    setPaidFundiId(selectedFundi.id) // Mark this fundi as paid for
    setShowContactModal(true)
  }



  const handleSignUpPrompt = () => {
    setShowContactModal(false)
    // Redirect based on user status
    window.location.href = user ? '/dashboard' : '/'
  }

  const filteredFundis = transformedFundis.filter(fundi => {
    const matchesSearch = fundi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fundi.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesService = selectedService === 'all' || fundi.service.toLowerCase() === selectedService
    const matchesLocation = selectedLocation === 'all' || fundi.location.toLowerCase().includes(selectedLocation)
    
    return matchesSearch && matchesService && matchesLocation
  })

  // Show loading state
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Perfect Fundi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {user 
                ? "Browse verified professionals in your area. As a registered user, you have free access to all contact details."
                : "Browse verified professionals in your area. Pay KSh 50 per fundi to unlock their contact details. Each payment unlocks one fundi's contact information."
              }
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link to="/" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300">
                ← Back to Home
              </Link>
              {user ? (
                <Link to="/dashboard" className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-300">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/" className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300">
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Payment Info for Non-Authenticated Users */}
        {!user && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-200">
            <div className="flex items-start">
              <span className="text-2xl mr-4">💡</span>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Pay KSh 50 per fundi to unlock their contact details. Each payment gives you access to one fundi's phone number and email.
                </p>
                <div className="flex items-center space-x-4 text-xs text-blue-700">
                  <span>💳 Pay per fundi</span>
                  <span>📞 Get contact details</span>
                  <span>🔒 Others remain locked</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Search & Filter</h2>
            <p className="text-gray-600">Find the perfect fundi for your project</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Search Fundis</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, service, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Service Type</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200"
              >
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.icon} {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200"
              >
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Found <span className="text-blue-600">{filteredFundis.length}</span> fundis
                </h3>
                <p className="text-gray-600">Ready to help with your project</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{filteredFundis.length}</div>
                <div className="text-sm text-gray-500">Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fundis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFundis.map((fundi) => (
            <div key={fundi.id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
                      {fundi.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{fundi.name}</h3>
                      <p className="text-blue-100">{fundi.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {fundi.verified && (
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                        ✅ Verified
                      </span>
                    )}
                    {!user && paidFundiId === fundi.id && (
                      <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                        💳 Paid
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    fundi.available 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {fundi.available ? '🟢 Available Now' : '🔴 Currently Busy'}
                  </span>
                  <div className="flex items-center text-yellow-300">
                    <span className="text-lg mr-1">⭐</span>
                    <span className="font-semibold">{fundi.rating}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-2xl mb-1">📍</div>
                    <div className="text-sm font-medium text-gray-900">{fundi.location}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-2xl mb-1">💰</div>
                    <div className="text-sm font-medium text-green-600">{fundi.hourlyRate}</div>
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-semibold text-gray-900">{fundi.experience}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Reviews</span>
                    <span className="font-semibold text-gray-900">{fundi.reviews} reviews</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {fundi.specialties.slice(0, 3).map((specialty, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                        {specialty}
                      </span>
                    ))}
                    {fundi.specialties.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        +{fundi.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewContact(fundi)}
                  disabled={!fundi.available}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                    user 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : paidFundiId === fundi.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {user ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">📞</span>
                      View Contact Details
                    </span>
                  ) : paidFundiId === fundi.id ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">📞</span>
                      View Contact Details
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">💳</span>
                      Pay KSh 50 to View Contact
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFundis.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No fundis found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or location</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedService('all')
                setSelectedLocation('all')
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {user ? 'Ready to Manage Your Projects?' : 'Ready to Get Started?'}
          </h2>
          <p className="text-xl text-blue-100 mb-6">
            {user 
              ? "Access your dashboard to manage bookings, payments, and more"
              : "Sign up for free to access all features and manage your projects"
            }
          </p>
          <Link
            to={user ? "/dashboard" : "/"}
            className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            {user ? 'Go to Dashboard' : 'Sign Up Now - It\'s Free!'}
          </Link>
        </div>
      </div>

      {/* Contact Details Modal */}
      {showContactModal && selectedFundi && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white rounded-t-3xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  {selectedFundi.avatar}
                </div>
                <h3 className="text-3xl font-bold mb-2">{selectedFundi.name}</h3>
                <p className="text-blue-100 text-lg">{selectedFundi.service}</p>
                <div className="flex items-center justify-center mt-4">
                  <span className="text-yellow-300 text-lg mr-2">⭐</span>
                  <span className="font-semibold">{selectedFundi.rating} ({selectedFundi.reviews} reviews)</span>
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
                  <span className="font-semibold text-green-600">{selectedFundi.hourlyRate}</span>
                </div>
              </div>

              {/* Booking Alert for Non-Authenticated Users */}
              {!user && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">💡</span>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Want to Book an Appointment?</h4>
                      <p className="text-blue-800 text-sm mb-4">
                        To book appointments, manage your projects, and access more features, you'll need to sign up for a free account.
                      </p>
                      <button
                        onClick={() => {
                          setShowContactModal(false)
                          alert('Please sign up to book appointments and manage your projects!')
                          window.location.href = '/'
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Sign Up Now - It's Free!
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-green-800 text-sm text-center">
                  ✅ <strong>Payment Successful!</strong> You can now contact this fundi directly.
                </p>
                {!user && (
                  <p className="text-green-700 text-xs text-center mt-2">
                    💡 Other fundis remain locked. Pay KSh 50 each to unlock their contact details.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Close
                </button>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
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
                )}
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
        phoneNumber={userData?.phone}
      />

    </div>
  )
}
