import { Link } from 'react-router-dom'

export default function FundiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                🛠️ For Skilled Professionals
              </div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Join Our Network of
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Skilled Fundis</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Connect with clients, grow your business, and earn more with our professional platform designed specifically for skilled workers.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Earn More</h3>
                  <p className="text-gray-600 text-sm">Set your own rates and get paid directly through our secure platform</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Easy Management</h3>
                  <p className="text-gray-600 text-sm">Manage jobs, schedule, and payments all in one place</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Build Reputation</h3>
                  <p className="text-gray-600 text-sm">Get reviews and build your professional reputation</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Grow Business</h3>
                  <p className="text-gray-600 text-sm">Access more clients and expand your service area</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/fundi"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
              >
                Join as Fundi
              </Link>
              <Link 
                to="/fundi"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-200 text-center"
              >
                Fundi Sign In
              </Link>
            </div>
          </div>

          {/* Right Side - Image/Stats */}
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Active Fundis</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-3xl font-bold text-green-600 mb-2">KES 2M+</div>
                <div className="text-gray-600">Total Earnings</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">4.8★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-3xl font-bold text-yellow-600 mb-2">1000+</div>
                <div className="text-gray-600">Jobs Completed</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Mike Ochieng</div>
                  <div className="text-sm text-gray-600">Electrician • Nairobi</div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "FundiMatch has transformed my business. I've doubled my income and connected with amazing clients. The platform is easy to use and payments are always on time!"
              </p>
              <div className="flex items-center mt-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0 rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in just 3 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Create Profile</h3>
              <p className="text-gray-600">Sign up and create your professional profile with skills, experience, and rates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Get Jobs</h3>
              <p className="text-gray-600">Receive job requests from clients in your area and specialization</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Earn Money</h3>
              <p className="text-gray-600">Complete jobs, get paid securely, and build your reputation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
