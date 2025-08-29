import { useState } from 'react'
import PhoneLoginModal from '../PhoneLoginModal'
import MpesaPaymentModal from '../MpesaPaymentModal'

export default function FindFundis() {
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedFundi, setSelectedFundi] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedService, setSelectedService] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')

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

  const fundis = [
    {
      id: 1,
      name: 'John Kamau',
      service: 'Plumbing',
      location: 'Nairobi, Westlands',
      rating: 4.8,
      reviews: 127,
      hourlyRate: 'KSh 800',
      experience: '5+ years',
      verified: true,
      available: true,
      avatar: '👷',
      specialties: ['Pipe Repair', 'Drainage', 'Installation']
    },
    {
      id: 2,
      name: 'Sarah Wanjiku',
      service: 'Painting',
      location: 'Nairobi, Karen',
      rating: 4.9,
      reviews: 89,
      hourlyRate: 'KSh 600',
      experience: '3+ years',
      verified: true,
      available: true,
      avatar: '🎨',
      specialties: ['Interior', 'Exterior', 'Wallpaper']
    },
    {
      id: 3,
      name: 'Mike Ochieng',
      service: 'Electrical',
      location: 'Nairobi, Kilimani',
      rating: 4.7,
      reviews: 156,
      hourlyRate: 'KSh 1,000',
      experience: '7+ years',
      verified: true,
      available: false,
      avatar: '⚡',
      specialties: ['Wiring', 'Installation', 'Repairs']
    }
  ]

  const handleContactFundi = (fundi) => {
    setSelectedFundi(fundi)
    setIsPhoneModalOpen(true)
  }

  const handlePhoneSuccess = (userData) => {
    setIsPhoneModalOpen(false)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false)
    // Redirect to dashboard or show success message
  }

  const filteredFundis = fundis.filter(fundi => {
    const matchesSearch = fundi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fundi.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesService = selectedService === 'all' || fundi.service.toLowerCase() === selectedService
    const matchesLocation = selectedLocation === 'all' || fundi.location.toLowerCase().includes(selectedLocation)
    
    return matchesSearch && matchesService && matchesLocation
  })

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Fundis</h1>
        <p className="text-gray-600">Discover and connect with verified professionals in your area</p>
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
                  onClick={() => handleContactFundi(fundi)}
                  disabled={!fundi.available}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Contact Now
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
        phoneNumber={selectedFundi?.phone}
      />
    </div>
  )
}
