import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import RegisterModal from './RegisterModal'

export default function PublicFindFundis() {
  const { user } = useAuth()
  const [selectedFundi, setSelectedFundi] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedService, setSelectedService] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [showContactModal, setShowContactModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [fundis, setFundis] = useState([])
  const [loading, setLoading] = useState(true)

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
    available: fundi.is_available,
    avatar: getAvatarBySpecialization(fundi.specialization),
    specialties: getSpecialtiesBySpecialization(fundi.specialization),
    phone: fundi.phone,
    email: fundi.email
  }))

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

  const handleViewContact = (fundi) => {
    setSelectedFundi(fundi)
    if (user) {
      // If user is logged in, show contact directly
      setShowContactModal(true)
    } else {
      // If not logged in, open registration modal
      setShowRegisterModal(true)
    }
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">FundiMatch</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Back to Home
              </Link>
              {user ? (
                <Link to="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Dashboard
                </Link>
              ) : (
                <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Sign Up / Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Trusted Fundis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {user 
              ? "Browse verified professionals in your area. As a registered user, you have free access to all contact details."
              : "Browse verified professionals in your area. Sign up to view contact details and get full access to their profiles."
            }
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Fundis</label>
              <input
                type="text"
                placeholder="Search by name, service, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.icon} {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{filteredFundis.length}</span> fundis
          </p>
        </div>

        {/* Fundis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFundis.map((fundi) => (
            <div key={fundi.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl text-white">
                      {fundi.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{fundi.name}</h3>
                      <p className="text-sm text-gray-600">{fundi.service}</p>
                    </div>
                  </div>
                  {fundi.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      ✅ Verified
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">📍 Location</span>
                    <span className="font-medium">{fundi.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">⭐ Rating</span>
                    <span className="font-medium">{fundi.rating} ({fundi.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">💰 Hourly Rate</span>
                    <span className="font-medium text-green-600">{fundi.hourlyRate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">📅 Experience</span>
                    <span className="font-medium">{fundi.experience}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {fundi.specialties.map((specialty, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status and Action */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    fundi.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {fundi.available ? '🟢 Available' : '🔴 Busy'}
                  </span>
                  <button
                    onClick={() => handleViewContact(fundi)}
                    disabled={!fundi.available}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {user ? 'View Contact' : 'Sign Up to View Contact'}
                  </button>
                </div>
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
              : "Sign up for free to view fundi contact details and manage your projects"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4">
                {selectedFundi.avatar}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedFundi.name}</h3>
              <p className="text-gray-600 mb-6">{selectedFundi.service}</p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">📞 Phone:</span>
                  <span className="font-medium">{selectedFundi.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">📧 Email:</span>
                  <span className="font-medium">{selectedFundi.email}</span>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 text-sm">
                  {user 
                    ? "💡 <strong>Tip:</strong> You can manage all your bookings and payments from your dashboard."
                    : "💡 <strong>Tip:</strong> Save these contact details! You can now call or email this fundi directly."
                  }
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSignUpPrompt}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {user ? 'Go to Dashboard' : 'Sign Up Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)} 
        allowFundis={false}
      />

    </div>
  )
}
