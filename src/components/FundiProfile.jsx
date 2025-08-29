import { useState } from 'react'
import { Link } from 'react-router-dom'
import MpesaPaymentModal from './MpesaPaymentModal'

const FundiProfile = () => {
  const [selectedFundi, setSelectedFundi] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProfession, setSelectedProfession] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [hasPaid, setHasPaid] = useState(false)

  const fundis = [
    {
      id: 1,
      name: "John Kamau",
      profession: "Plumber",
      rating: 4.8,
      experience: "8 years",
      location: "Nairobi, Westlands",
      hourlyRate: "KSh 800",
      image: "/assets/fundi 1.webp",
      skills: ["Pipe Installation", "Leak Repair", "Water Heater", "Drainage", "Bathroom Fittings"],
      reviews: [
        { user: "Mary N.", rating: 5, comment: "Excellent work, very professional and completed the job on time.", date: "2 days ago" },
        { user: "David K.", rating: 4, comment: "Good quality work, fixed our plumbing issues efficiently.", date: "1 week ago" }
      ],
      completedProjects: 127,
      responseTime: "Within 2 hours",
      verified: true
    },
    {
      id: 2,
      name: "Peter Mwangi",
      profession: "Electrician",
      rating: 4.6,
      experience: "12 years",
      location: "Nairobi, Karen",
      hourlyRate: "KSh 1000",
      image: "/assets/fundi 2.jpeg",
      skills: ["Wiring", "Installation", "Repair", "Maintenance", "Solar Systems"],
      reviews: [
        { user: "Sarah W.", rating: 5, comment: "Very skilled electrician, installed our solar system perfectly.", date: "3 days ago" },
        { user: "James M.", rating: 4, comment: "Professional and reliable, highly recommended.", date: "2 weeks ago" }
      ],
      completedProjects: 89,
      responseTime: "Within 1 hour",
      verified: true
    },
    {
      id: 3,
      name: "Amina Hassan",
      profession: "Mason",
      rating: 4.9,
      experience: "15 years",
      location: "Mombasa, Nyali",
      hourlyRate: "KSh 900",
      image: "/assets/fundi 3.jpeg",
      skills: ["Brick Laying", "Tiling", "Plastering", "Construction", "Renovation"],
      reviews: [
        { user: "Fatima A.", rating: 5, comment: "Outstanding masonry work, transformed our home completely.", date: "1 week ago" },
        { user: "Omar K.", rating: 5, comment: "Highly recommended, excellent craftsmanship and attention to detail.", date: "3 weeks ago" }
      ],
      completedProjects: 156,
      responseTime: "Within 3 hours",
      verified: true
    },
    {
      id: 4,
      name: "David Ochieng",
      profession: "Carpenter",
      rating: 4.7,
      experience: "10 years",
      location: "Nairobi, Kilimani",
      hourlyRate: "KSh 750",
      image: "/assets/fundi 4.jpeg",
      skills: ["Furniture Making", "Cabinet Installation", "Wood Repair", "Custom Designs"],
      reviews: [
        { user: "Grace L.", rating: 5, comment: "Amazing carpenter, created beautiful custom furniture for us.", date: "4 days ago" },
        { user: "Michael O.", rating: 4, comment: "Great work quality and very professional.", date: "1 week ago" }
      ],
      completedProjects: 94,
      responseTime: "Within 4 hours",
      verified: true
    }
  ]

  const professions = ['all', 'plumber', 'electrician', 'mason', 'carpenter', 'painter']
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

        {/* Fundi Grid */}
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
                        <span className="text-sm text-gray-500 ml-2">({fundi.completedProjects} projects)</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>📍 {fundi.location}</span>
                        <span>💰 {fundi.hourlyRate}/hr</span>
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
                        <span className="text-2xl font-bold text-blue-600">
                          {filteredFundis[selectedFundi].hourlyRate}/hr
                        </span>
                      </div>
                      <div className="flex space-x-4">
                        {hasPaid ? (
                          <>
                            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                              📞 Contact Now
                            </button>
                            <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-200">
                              📅 Book Appointment
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => setShowPaymentModal(true)}
                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                          >
                            💳 Pay KSh 50 to View Full Profile
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
                      <div className="text-2xl font-bold text-green-600">{filteredFundis[selectedFundi].responseTime}</div>
                      <div className="text-sm text-green-600">Response Time</div>
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
                    ) : (
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
      </div>

      {/* M-Pesa Payment Modal */}
      <MpesaPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        fundiName={filteredFundis[selectedFundi]?.name || ''}
        amount={50}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  )
}

export default FundiProfile
