export default function Reviews() {
  const reviews = [
    {
      id: 1,
      service: 'Kitchen Sink Repair',
      fundi: 'John Kamau',
      rating: 5,
      comment: 'Excellent work! John was professional, punctual, and fixed the issue quickly. Highly recommend!',
      date: '2025-01-20',
      response: 'Thank you for the kind words! It was a pleasure working with you.'
    },
    {
      id: 2,
      service: 'House Painting',
      fundi: 'Sarah Wanjiku',
      rating: 4,
      comment: 'Great painting job, very neat work. Only giving 4 stars because it took a bit longer than expected.',
      date: '2025-01-18',
      response: 'Thank you for the feedback. We\'ll work on improving our timing for future projects.'
    },
    {
      id: 3,
      service: 'Electrical Wiring',
      fundi: 'Mike Ochieng',
      rating: 5,
      comment: 'Outstanding electrical work. Mike was very knowledgeable and safety-conscious.',
      date: '2025-01-15',
      response: 'Safety is our top priority. Thank you for trusting us with your electrical needs!'
    }
  ]

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ))
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews & Ratings</h1>
        <p className="text-gray-600">Manage your feedback and see fundi responses</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-xl text-white">
              ⭐
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.7</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-xl text-white">
              🌟
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">5-Star Reviews</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-xl text-white">
              🏆
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">With Responses</p>
              <p className="text-2xl font-bold text-gray-900">10</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-xl text-white">
              💬
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Reviews</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{review.service}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span>👷</span>
                  <span className="font-medium">{review.fundi}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
              
              {review.response && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600 font-medium">Response from {review.fundi}:</span>
                  </div>
                  <p className="text-blue-800">{review.response}</p>
                </div>
              )}
              
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Edit Review
                </button>
                <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Guidelines</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-2">✅ What to include:</h4>
            <ul className="space-y-1">
              <li>• Quality of work performed</li>
              <li>• Professionalism and punctuality</li>
              <li>• Value for money</li>
              <li>• Overall experience</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">❌ What to avoid:</h4>
            <ul className="space-y-1">
              <li>• Personal information</li>
              <li>• Inappropriate language</li>
              <li>• False statements</li>
              <li>• Spam or promotional content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
