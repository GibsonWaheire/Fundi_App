import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import MpesaPaymentModal from './MpesaPaymentModal'

const FundiProfile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedFundi, setSelectedFundi] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProfession, setSelectedProfession] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [hasPaid, setHasPaid] = useState(false)
  const [fundis, setFundis] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch fundis data from API
  useEffect(() => {

    const fetchFundis = async () => {
      try {
        // Fetch fundis, bookings, and reviews data
        const [fundisResponse, bookingsResponse, reviewsResponse] = await Promise.all([
          fetch('http://localhost:3001/fundis'),
          fetch('http://localhost:3001/bookings'),
          fetch('http://localhost:3001/reviews')
        ])
        
        const fundisData = await fundisResponse.json()
        const bookingsData = await bookingsResponse.json()
        const reviewsData = await reviewsResponse.json()
        
        // Transform the data to include pricing options and additional fields
        const transformedFundis = fundisData.map(fundi => {
          // Calculate completed projects for this fundi
          const fundiBookings = bookingsData.filter(booking => booking.fundi_id === fundi.id)
          const completedProjects = fundiBookings.filter(booking => booking.status === 'completed').length
          const totalProjects = fundiBookings.length
          
          // Get reviews for this fundi
          const fundiReviews = reviewsData.filter(review => review.fundi_id === fundi.id)
          
          // Convert hourly rate to daily rate (8 hours work day)
          // Ensure daily rate is between 1500-4000
          let dailyRate = Math.round(fundi.hourly_rate * 8)
          if (dailyRate < 1500) dailyRate = 1500
          if (dailyRate > 4000) dailyRate = 4000
          
          return {
            id: fundi.id,
            name: fundi.username,
            profession: fundi.specialization,
            rating: fundi.rating || 4.5,
            experience: fundi.experience,
            location: fundi.location,
            // Real pricing structure - daily rate only
            dailyRate: `KSh ${dailyRate}`,
            pricingType: 'daily', // All fundis use daily rates
            image: `/assets/fundi ${(fundi.id % 7) + 1}.${fundi.id % 2 === 0 ? 'webp' : 'jpeg'}`,
            skills: getSkillsBySpecialization(fundi.specialization),
            reviews: fundiReviews.length > 0 ? fundiReviews.map(review => ({
              user: `Client ${review.client_id}`,
              rating: review.rating,
              comment: review.comment,
              date: new Date(review.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })
            })) : generateDefaultReviews(fundi.specialization),
            completedProjects: completedProjects,
            totalProjects: totalProjects,
            responseTime: `Within ${Math.floor(Math.random() * 4) + 1} hours`,
            verified: true,
            bio: fundi.bio,
            phone: fundi.phone,
            email: fundi.email,
            isAvailable: fundi.is_available,
            hourlyRate: fundi.hourly_rate // Keep original for reference
          }
        })
        
        setFundis(transformedFundis)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching fundis:', error)
        setLoading(false)
      }
    }

    fetchFundis()
  }, [])

  // Helper function to get skills based on specialization
  const getSkillsBySpecialization = (specialization) => {
    const skillsMap = {
      'Plumbing': ['Pipe Installation', 'Leak Repair', 'Water Heater', 'Drainage', 'Bathroom Fittings', 'Kitchen Plumbing'],
      'Electrical': ['Wiring', 'Installation', 'Repair', 'Maintenance', 'Solar Systems', 'Lighting'],
      'Carpentry': ['Furniture Making', 'Cabinet Installation', 'Wood Repair', 'Custom Designs', 'Door Installation'],
      'Painting': ['Interior Painting', 'Exterior Painting', 'Wallpaper', 'Color Consultation', 'Surface Preparation'],
      'Construction': ['Brick Laying', 'Tiling', 'Plastering', 'Renovation', 'Foundation Work', 'Roofing']
    }
    return skillsMap[specialization] || ['General Repairs', 'Installation', 'Maintenance']
  }

  // Helper function to generate default reviews when no real reviews exist
  const generateDefaultReviews = (specialization) => {
    const reviewTemplates = {
      'Plumbing': [
        { user: "Mary N.", rating: 5, comment: "Excellent plumbing work, very professional and completed the job on time.", date: "2 days ago" },
        { user: "David K.", rating: 4, comment: "Good quality work, fixed our plumbing issues efficiently.", date: "1 week ago" }
      ],
      'Electrical': [
        { user: "Sarah W.", rating: 5, comment: "Very skilled electrician, installed our solar system perfectly.", date: "3 days ago" },
        { user: "James M.", rating: 4, comment: "Professional and reliable, highly recommended.", date: "2 weeks ago" }
      ],
      'Carpentry': [
        { user: "Grace L.", rating: 5, comment: "Amazing carpenter, created beautiful custom furniture for us.", date: "4 days ago" },
        { user: "Michael O.", rating: 4, comment: "Great work quality and very professional.", date: "1 week ago" }
      ],
      'Painting': [
        { user: "Alice P.", rating: 5, comment: "Outstanding painting work, transformed our home completely.", date: "1 week ago" },
        { user: "Bob R.", rating: 4, comment: "Excellent color choices and clean work.", date: "2 weeks ago" }
      ],
      'Construction': [
        { user: "Fatima A.", rating: 5, comment: "Outstanding masonry work, transformed our home completely.", date: "1 week ago" },
        { user: "Omar K.", rating: 5, comment: "Highly recommended, excellent craftsmanship and attention to detail.", date: "3 weeks ago" }
      ]
    }
    return reviewTemplates[specialization] || [
      { user: "John D.", rating: 4, comment: "Good work, professional service.", date: "1 week ago" },
      { user: "Jane S.", rating: 5, comment: "Excellent service, highly recommended.", date: "2 weeks ago" }
    ]
  }

  const professions = ['all', 'plumbing', 'electrical', 'carpentry', 'painting', 'construction']
  const locations = ['all', 'nairobi', 'mombasa', 'kisumu', 'nakuru']

  const filteredFundis = fundis.filter(fundi => {
    const matchesSearch = fundi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fundi.profession.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProfession = selectedProfession === 'all' || fundi.profession.toLowerCase() === selectedProfession
    const matchesLocation = selectedLocation === 'all' || fundi.location.toLowerCase().includes(selectedLocation)
    
    return matchesSearch && matchesProfession && matchesLocation
  })

  const handlePaymentSuccess = () => {
    setHasPaid(true)
    setShowPaymentModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Skilled Fundis</h1>
            <p className="text-xl text-gray-600">Connect with verified professionals for your projects</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search fundis by name or profession..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <select
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Professions</option>
              {professions.slice(1).map(profession => (
                <option key={profession} value={profession}>
                  {profession.charAt(0).toUpperCase() + profession.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Locations</option>
              {locations.slice(1).map(location => (
                <option key={location} value={location}>
                  {location.charAt(0).toUpperCase() + location.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading fundis...</p>
          </div>
        )}

        {/* No Fundis Found */}
        {!loading && fundis.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No fundis found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or check back later</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedProfession('all')
                setSelectedLocation('all')
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Fundi Grid */}
        {!loading && fundis.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fundi List */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Fundis ({filteredFundis.length})</h2>
            <div className="space-y-4">
              {filteredFundis.map((fundi, index) => (
                <div
                  key={fundi.id}
                  onClick={() => setSelectedFundi(index)}
                  className={`bg-white p-6 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 border-2 ${
                    selectedFundi === index 
                      ? 'border-blue-500 shadow-xl transform scale-105' 
                      : 'border-gray-100 hover:shadow-xl hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={fundi.image}
                        alt={fundi.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                      {fundi.verified && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{fundi.name}</h3>
                      <p className="text-gray-600">{fundi.profession}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < fundi.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">{fundi.rating}</span>
                        <span className="text-sm text-gray-500 ml-2">({fundi.completedProjects} completed)</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>📍 {fundi.location}</span>
                        <span>💰 {fundi.dailyRate}/day</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fundi Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              {filteredFundis[selectedFundi] && (
                <div>
                  {/* Header */}
                  <div className="flex items-start space-x-6 mb-8">
                    <div className="relative">
                      <img
                        src={filteredFundis[selectedFundi].image}
                        alt={filteredFundis[selectedFundi].name}
                        className="w-32 h-32 rounded-2xl object-cover border-4 border-gray-100 shadow-lg"
                      />
                      {filteredFundis[selectedFundi].verified && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-sm font-bold">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {filteredFundis[selectedFundi].name}
                      </h2>
                      <p className="text-xl text-gray-600 mb-4">
                        {filteredFundis[selectedFundi].profession}
                      </p>
                      <div className="flex items-center space-x-6 mb-4">
                        <div className="flex items-center">
                          <span className="text-yellow-400 text-2xl">★</span>
                          <span className="ml-2 text-xl font-bold">{filteredFundis[selectedFundi].rating}</span>
                        </div>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{filteredFundis[selectedFundi].experience} experience</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{filteredFundis[selectedFundi].location}</span>
                      </div>
                      <div className="mb-6">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-blue-600">
                            {filteredFundis[selectedFundi].dailyRate}/day
                          </span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            Daily Rate
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        {hasPaid ? (
                          <>
                            <button 
                              onClick={() => setShowContactModal(true)}
                              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                              📞 Contact Now
                            </button>
                            <button 
                              onClick={() => setShowBookingModal(true)}
                              className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-200"
                            >
                              📅 Book Appointment
                            </button>
                          </>
                        ) : user ? (
                          <button 
                            onClick={() => setShowPaymentModal(true)}
                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                          >
                            💳 Pay KSh 50 to View Full Profile
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              alert('Please sign up to view fundi contact details.')
                              window.location.href = '/'
                            }}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                          >
                            📝 Sign Up to View Contact
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">{filteredFundis[selectedFundi].completedProjects}</div>
                      <div className="text-sm text-blue-600">Completed Projects</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <div className="text-2xl font-bold text-green-600">{filteredFundis[selectedFundi].totalProjects}</div>
                      <div className="text-sm text-green-600">Total Projects</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600">{filteredFundis[selectedFundi].experience}</div>
                      <div className="text-sm text-purple-600">Experience</div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                    {hasPaid ? (
                      <div className="flex flex-wrap gap-3">
                        {filteredFundis[selectedFundi].skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : user ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🔒</div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Skills & Reviews Locked</h4>
                        <p className="text-gray-600 mb-4">Pay KSh 50 to unlock detailed skills, reviews, and contact information</p>
                        <button 
                          onClick={() => setShowPaymentModal(true)}
                          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                          💳 Unlock Full Profile
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🔒</div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Skills & Reviews Locked</h4>
                        <p className="text-gray-600 mb-4">Sign up to unlock detailed skills, reviews, and contact information</p>
                        <button 
                          onClick={() => {
                            alert('Please sign up to view fundi details.')
                            window.location.href = '/'
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                          📝 Sign Up to Unlock
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reviews */}
                  {hasPaid && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                      <div className="space-y-4">
                        {filteredFundis[selectedFundi].reviews.map((review, index) => (
                          <div key={index} className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                  {review.user.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{review.user}</h4>
                                  <p className="text-sm text-gray-500">{review.date}</p>
                                </div>
                              </div>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed italic">
                              "{review.comment}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* M-Pesa Payment Modal */}
      <MpesaPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        fundiName={filteredFundis[selectedFundi]?.name || ''}
        amount={50}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Contact Details Modal */}
      {showContactModal && filteredFundis[selectedFundi] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4">
                {filteredFundis[selectedFundi].profession === 'Plumbing' ? '🚰' : 
                 filteredFundis[selectedFundi].profession === 'Electrical' ? '⚡' : 
                 filteredFundis[selectedFundi].profession === 'Carpentry' ? '🪑' : 
                 filteredFundis[selectedFundi].profession === 'Painting' ? '🎨' : '🔧'}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{filteredFundis[selectedFundi].name}</h3>
              <p className="text-gray-600 mb-6">{filteredFundis[selectedFundi].profession}</p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">📞 Phone:</span>
                  <span className="font-medium">{filteredFundis[selectedFundi].phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">📧 Email:</span>
                  <span className="font-medium">{filteredFundis[selectedFundi].email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">📍 Location:</span>
                  <span className="font-medium">{filteredFundis[selectedFundi].location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">💰 Daily Rate:</span>
                  <span className="font-medium">{filteredFundis[selectedFundi].dailyRate}</span>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 text-sm">
                  💡 <strong>Tip:</strong> Save these contact details! You can now call or email this fundi directly.
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
                  onClick={() => {
                    setShowContactModal(false)
                    setShowBookingModal(true)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && filteredFundis[selectedFundi] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Appointment</h3>
              <p className="text-gray-600">Schedule a session with {filteredFundis[selectedFundi].name}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <input
                  type="text"
                  value={filteredFundis[selectedFundi].profession}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe your project or issue..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Your address or location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Days</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="1">1 day</option>
                  <option value="2">2 days</option>
                  <option value="3">3 days</option>
                  <option value="4">4 days</option>
                  <option value="5">5 days</option>
                  <option value="6">6 days</option>
                  <option value="7">1 week</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle booking submission
                  alert('Booking request sent! The fundi will contact you soon.')
                  setShowBookingModal(false)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Booking Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FundiProfile
