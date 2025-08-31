import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import { fundiUnlockService } from '../services/fundiUnlockService'
import PhoneLoginModal from './PhoneLoginModal'
import MpesaPaymentModal from './MpesaPaymentModal'

export default function PublicFindFundis() {
  const { user } = useAuth()
  const [selectedFundi, setSelectedFundi] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedService, setSelectedService] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [fundis, setFundis] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(null)
  const [fundiUnlocks, setFundiUnlocks] = useState([])

  // Fetch fundis data and unlock tracking
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching fundis and unlock data...')
        
        const [fundisData, unlocksData] = await Promise.all([
          authService.getAllFundis(),
          fundiUnlockService.getAllUnlocks()
        ])
        
        console.log('Fundis fetched successfully:', fundisData.length)
        console.log('Unlock data fetched successfully:', unlocksData.length)
        
        setFundis(fundisData)
        setFundiUnlocks(unlocksData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
    email: fundi.email,
    bio: fundi.bio || 'Professional fundi with excellent service'
  }))

  const handleViewContact = (fundi) => {
    setSelectedFundi(fundi)
    
    // Check if the current user has unlocked this specific fundi
    if (user) {
      const unlockInfo = fundiUnlocks.find(unlock => unlock.fundi_id === fundi.id)
      if (unlockInfo && unlockInfo.unlocked_by.includes(user.id)) {
        // User has paid for this fundi, show contact
        setShowContactModal(true)
      } else {
        // User hasn't paid for this fundi, require payment
        setIsPhoneModalOpen(true)
      }
    } else {
      // No user logged in, require payment
      setIsPhoneModalOpen(true)
    }
  }

  const handlePhoneSuccess = (user) => {
    setUserData(user)
    setIsPhoneModalOpen(false)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = async () => {
    try {
      setIsPaymentModalOpen(false)
      
      // Record the unlock in the database
      if (userData && selectedFundi) {
        await fundiUnlockService.unlockFundi(selectedFundi.id, userData.id)
        
        // Refresh unlock data immediately
        const updatedUnlocks = await fundiUnlockService.getAllUnlocks()
        setFundiUnlocks(updatedUnlocks)
        
        // Show success message
        console.log(`✅ Successfully unlocked ${selectedFundi.name} - Status changed from 🔒 Locked to 🔓 Unlocked`)
        
        // Show visual feedback
        alert(`🎉 Success! ${selectedFundi.name} is now unlocked! You can now see their contact details.`)
      }
      
      setShowContactModal(true)
    } catch (error) {
      console.error('Error recording unlock:', error)
      // Still show contact modal even if recording fails
      setShowContactModal(true)
    }
  }

  // Helper functions
  const canViewContact = (fundiId) => {
    // Check if the current user has unlocked this specific fundi
    if (!user) return false;
    
    const unlockInfo = fundiUnlocks.find(unlock => unlock.fundi_id === fundiId)
    if (!unlockInfo) return false;
    
    // Check if current user is in the unlocked_by array
    return unlockInfo.unlocked_by.includes(user.id)
  }

  const getLockStatus = (fundiId) => {
    if (!user) return 'locked'; // Show as locked for non-logged users
    return canViewContact(fundiId) ? 'unlocked' : 'locked';
  }

  const getUnlockCount = (fundiId) => {
    const unlockInfo = fundiUnlocks.find(unlock => unlock.fundi_id === fundiId)
    return unlockInfo ? unlockInfo.unlock_count : 0
  }

  const hasUserUnlocked = (fundiId) => {
    if (!user) return false;
    const unlockInfo = fundiUnlocks.find(unlock => unlock.fundi_id === fundiId)
    return unlockInfo ? unlockInfo.unlocked_by.includes(user.id) : false
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  // Filter and sort fundis
  const filteredAndSortedFundis = transformedFundis
    .filter(fundi => {
      const matchesSearch = fundi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fundi.service.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesService = selectedService === 'all' || fundi.service.toLowerCase() === selectedService
      const matchesLocation = selectedLocation === 'all' || fundi.location.toLowerCase().includes(selectedLocation)
      const matchesUnlockFilter = !showUnlockedOnly || canViewContact(fundi.id)
      return matchesSearch && matchesService && matchesLocation && matchesUnlockFilter
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (sortBy === 'hourlyRate') {
        aValue = parseFloat(aValue)
        bValue = parseFloat(bValue)
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
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

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Fundis</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
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
              Browse verified professionals in your area. Pay KSh 50 per fundi to unlock their contact details.
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
          
          {user && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔓</span>
                  <div>
                    <h3 className="font-semibold text-blue-900">Filter by Access</h3>
                    <p className="text-blue-800 text-sm">Show only unlocked fundis or view all</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    showUnlockedOnly
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {showUnlockedOnly ? 'Show All Fundis' : 'Show Unlocked Only'}
                </button>
              </div>
            </div>
          )}
          
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
                  Found <span className="text-blue-600">{filteredAndSortedFundis.length}</span> fundis
                </h3>
                <p className="text-gray-600">Ready to help with your project</p>
                <div className="mt-2 flex items-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <span className="text-blue-600 mr-1">🔓</span>
                    <span className="text-gray-600">
                      {filteredAndSortedFundis.filter(f => getLockStatus(f.id) === 'unlocked').length} unlocked
                    </span>
                  </span>
                  <span className="flex items-center">
                    <span className="text-gray-600 mr-1">🔒</span>
                    <span className="text-gray-600">
                      {filteredAndSortedFundis.filter(f => getLockStatus(f.id) === 'locked').length} locked
                    </span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{filteredAndSortedFundis.length}</div>
                <div className="text-sm text-gray-500">Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fundis List - Modern Design */}
        <div className="space-y-4">
          {filteredAndSortedFundis.map((fundi) => (
            <div key={fundi.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {/* Fundi Info */}
                <div className="flex items-start space-x-4 flex-1">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
                          {fundi.avatar}
                        </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 truncate">{fundi.name}</h3>
                          {fundi.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                          ✓ Verified
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        fundi.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {fundi.available ? '🟢 Available' : '🔴 Busy'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getLockStatus(fundi.id) === 'unlocked'
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getLockStatus(fundi.id) === 'unlocked' ? '🔓 Unlocked' : '🔒 Locked'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="mr-2">🔧</span>
                        <span className="font-medium">{fundi.service}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        <span>{fundi.location}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">⭐</span>
                        <span className="font-medium">{fundi.rating}/5.0</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">💰</span>
                        <span className="font-semibold text-green-600">KSh {fundi.hourlyRate}/hr</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-500">
                      <span className="mr-4">📚 {fundi.experience}</span>
                      <span>💬 {fundi.bio.substring(0, 50)}...</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="mt-4 lg:mt-0 lg:ml-6 flex-shrink-0">
                  <div className="text-center">
                      <button
                        onClick={() => handleViewContact(fundi)}
                        disabled={!fundi.available}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          getLockStatus(fundi.id) === 'unlocked'
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                          : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                      } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}
                      >
                        {getLockStatus(fundi.id) === 'unlocked' ? (
                          <span className="flex items-center">
                          <span className="mr-2">📞</span>
                          Contact Now
                          </span>
                        ) : (
                          <span className="flex items-center">
                          <span className="mr-2">💳</span>
                            Pay KSh 50
                          </span>
                        )}
                      </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedFundis.length === 0 && (
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
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-6">
            Sign up for free to access all features and manage your projects
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Sign Up Now - It's Free!
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
                    <strong>Status Changed: Locked → Unlocked!</strong>
                  </p>
                </div>
                <p className="text-green-800 text-sm text-center">
                  ✅ <strong>Access Granted!</strong> You can now contact this fundi directly.
                </p>
                <div className="text-green-700 text-xs text-center mt-2 space-y-1">
                  <p>💡 Other fundis remain locked. Pay KSh 50 each to unlock their contact details.</p>
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
        phoneNumber={userData?.phone}
      />
    </div>
  )
}
