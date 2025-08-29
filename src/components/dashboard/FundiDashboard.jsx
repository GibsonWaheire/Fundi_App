import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function FundiDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.username}!</h1>
            <p className="text-blue-100">Ready to tackle today's jobs?</p>
            <div className="mt-3 flex items-center space-x-4">
                              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {user?.specialization} • Rating: {user?.rating}/5.0
                </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                Available for work
              </span>
            </div>
          </div>
                      <div className="text-right">
              <div className="text-3xl font-bold">KES 0</div>
              <div className="text-blue-100 text-sm">Today's earnings</div>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week's Earnings</p>
              <p className="text-2xl font-bold text-gray-900">KES 15,000</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900">KES 45,000</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/dashboard/jobs')}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span className="text-2xl mb-2">📋</span>
            <span className="text-sm font-medium text-gray-700">View Jobs</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/availability')}
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <span className="text-2xl mb-2">📅</span>
            <span className="text-sm font-medium text-gray-700">Set Schedule</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/messages')}
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <span className="text-2xl mb-2">💬</span>
            <span className="text-sm font-medium text-gray-700">Messages</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/payments')}
            className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <span className="text-2xl mb-2">💰</span>
            <span className="text-sm font-medium text-gray-700">View Earnings</span>
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Job Completion Rate</span>
              <span className="font-semibold text-green-600">95%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Rating</span>
              <span className="font-semibold text-yellow-600">4.2/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Response Time</span>
              <span className="font-semibold text-blue-600">2.3 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Repeat Clients</span>
              <span className="font-semibold text-purple-600">8</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Fix electrical wiring</h3>
                <p className="text-sm text-gray-600">Westlands, Nairobi</p>
                <p className="text-xs text-blue-600">KES 5,000</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                In Progress
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Install security lights</h3>
                <p className="text-sm text-gray-600">Kilimani, Nairobi</p>
                <p className="text-xs text-blue-600">KES 8,000</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Electrical inspection - 9:00 AM</h3>
              <p className="text-sm text-gray-600">Karen, Nairobi • Client: Sarah Johnson</p>
            </div>
            <span className="text-sm text-blue-600 font-medium">KES 3,000</span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Wiring installation - 2:00 PM</h3>
              <p className="text-sm text-gray-600">Westlands, Nairobi • Client: Mike Ochieng</p>
            </div>
            <span className="text-sm text-green-600 font-medium">KES 5,000</span>
          </div>
        </div>
      </div>
    </div>
  )
}
