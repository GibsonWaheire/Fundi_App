import { useAuth } from '../../contexts/AuthContext'

export default function ClientDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-green-100">Find the perfect fundi for your next project</p>
            <div className="mt-3 flex items-center space-x-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                Customer Account
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                Ready to hire
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">2</div>
            <div className="text-green-100 text-sm">Active projects</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏗️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Projects</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">KES 45,000</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <span className="text-2xl mb-2">🔍</span>
            <span className="text-sm font-medium text-gray-700">Find Fundis</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <span className="text-2xl mb-2">📋</span>
            <span className="text-sm font-medium text-gray-700">Post Job</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <span className="text-2xl mb-2">💬</span>
            <span className="text-sm font-medium text-gray-700">Messages</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <span className="text-2xl mb-2">📅</span>
            <span className="text-sm font-medium text-gray-700">Bookings</span>
          </button>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Kitchen renovation</h3>
              <p className="text-sm text-gray-600">Assigned to John Kamau (Electrician)</p>
              <p className="text-xs text-blue-600">KES 25,000</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              In Progress
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Bathroom plumbing</h3>
              <p className="text-sm text-gray-600">Assigned to Mary Wanjiku (Plumber)</p>
              <p className="text-xs text-blue-600">KES 15,000</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Completed
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Fundis */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Fundis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👨‍🔧</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Peter Mwangi</h3>
                <p className="text-sm text-gray-600">Mason • Rating: 4.0</p>
                <p className="text-xs text-blue-600">Available now</p>
              </div>
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👩‍🎨</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Jane Akinyi</h3>
                <p className="text-sm text-gray-600">Painter • Rating: 4.3</p>
                <p className="text-xs text-blue-600">Available now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
