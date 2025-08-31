import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import { fundiUnlockService } from '../services/fundiUnlockService'
import PhoneLoginModal from './PhoneLoginModal'
import MpesaPaymentModal from './MpesaPaymentModal'

const FundiTable = () => {
  const { user } = useAuth()
  const [fundis, setFundis] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedService, setSelectedService] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showContactModal, setShowContactModal] = useState(false)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedFundi, setSelectedFundi] = useState(null)
  const [userData, setUserData] = useState(null)
  const [fundiUnlocks, setFundiUnlocks] = useState([])

  // Fetch fundis data and unlock tracking
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
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
    email: fundi.email
  }))

  const handleViewContact = (fundi) => {
    setSelectedFundi(fundi)
    
    // Check if fundi is already unlocked by anyone
    const unlockInfo = fundiUnlocks.find(unlock => unlock.fundi_id === fundi.id)
    if (unlockInfo && unlockInfo.unlock_count > 0) {
      // Fundi is already unlocked, show contact for free (for everyone)
      setShowContactModal(true)
    } else {
      // Fundi not unlocked, require payment (for everyone, including logged-in users)
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
        
        // Refresh unlock data
        const updatedUnlocks = await fundiUnlockService.getAllUnlocks()
        setFundiUnlocks(updatedUnlocks)
      }
      
      setShowContactModal(true)
    } catch (error) {
      console.error('Error recording unlock:', error)
      // Still show contact modal even if recording fails
      setShowContactModal(true)
    }
  }

  // Filter and sort fundis
  const filteredAndSortedFundis = transformedFundis
    .filter(fundi => {
      const matchesSearch = fundi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fundi.service.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesService = selectedService === 'all' || fundi.service.toLowerCase() === selectedService
      const matchesLocation = selectedLocation === 'all' || fundi.location.toLowerCase().includes(selectedLocation)
      
      return matchesSearch && matchesService && matchesLocation
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

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (column) => {
    if (sortBy !== column) return '↕️'
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  const canViewContact = (fundiId) => {
    // Check if fundi is already unlocked by anyone (for everyone)
    const unlockInfo = fundiUnlocks.find(unlock => unlock.fundi_id === fundiId)
    return unlockInfo && unlockInfo.unlock_count > 0
  }

  const getUnlockCount = (fundiId) => {
    const unlockInfo = fundiUnlocks.find(unlock => unlock.fundi_id === fundiId)
    return unlockInfo ? unlockInfo.unlock_count : 0
  }

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

        {/* Results Count */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Found <span className="text-blue-600">{filteredAndSortedFundis.length}</span> fundis
                </h3>
                <p className="text-gray-600">Ready to help with your project</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{filteredAndSortedFundis.length}</div>
                <div className="text-sm text-gray-500">Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fundis Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <button 
                      onClick={() => handleSort('name')}
                      className="flex items-center space-x-2 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                    >
                      <span>Fundi</span>
                      <span>{getSortIcon('name')}</span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button 
                      onClick={() => handleSort('service')}
                      className="flex items-center space-x-2 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                    >
                      <span>Service</span>
                      <span>{getSortIcon('service')}</span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button 
                      onClick={() => handleSort('location')}
                      className="flex items-center space-x-2 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                    >
                      <span>Location</span>
                      <span>{getSortIcon('location')}</span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button 
                      onClick={() => handleSort('rating')}
                      className="flex items-center space-x-2 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                    >
                      <span>Rating</span>
                      <span>{getSortIcon('rating')}</span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button 
                      onClick={() => handleSort('hourlyRate')}
                      className="flex items-center space-x-2 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                    >
                      <span>Rate</span>
                      <span>{getSortIcon('hourlyRate')}</span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">Experience</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedFundis.map((fundi, index) => (
                  <tr key={fundi.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                          {fundi.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{fundi.name}</div>
                          {fundi.verified && (
                            <div className="flex items-center text-xs text-green-600">
                              <span className="mr-1">✓</span>
                              <span>Verified</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{fundi.service}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">📍 {fundi.location}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        <span className="font-semibold">{fundi.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">KSh {fundi.hourlyRate}/hr</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{fundi.experience}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        fundi.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {fundi.available ? '🟢 Available' : '🔴 Busy'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewContact(fundi)}
                        disabled={!fundi.available}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          canViewContact(fundi.id)
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {canViewContact(fundi.id) ? (
                          <span className="flex items-center">
                            <span className="mr-1">📞</span>
                            Contact
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <span className="mr-1">💳</span>
                            Pay KSh 50
                          </span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default FundiTable

