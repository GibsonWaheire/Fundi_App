import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">System Administration</h1>
            <p className="text-red-100">Monitor and manage the entire platform</p>
            <div className="mt-3 flex items-center space-x-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                System Administrator
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                Full Access
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">3</div>
            <div className="text-red-100 text-sm">Active sessions</div>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-xs text-green-600">+3 this week</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Fundis</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-xs text-blue-600">8 available</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🛠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-xs text-yellow-600">3 pending</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Platform Revenue</p>
              <p className="text-2xl font-bold text-gray-900">KES 125K</p>
              <p className="text-xs text-purple-600">This month</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Management Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Management</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/dashboard/users')}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span className="text-2xl mb-2">👥</span>
            <span className="text-sm font-medium text-gray-700">All Users</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/fundis')}
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <span className="text-2xl mb-2">🛠️</span>
            <span className="text-sm font-medium text-gray-700">Fundi Management</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/jobs')}
            className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <span className="text-2xl mb-2">📋</span>
            <span className="text-sm font-medium text-gray-700">Job Monitoring</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/reports')}
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <span className="text-2xl mb-2">📊</span>
            <span className="text-sm font-medium text-gray-700">Analytics</span>
          </button>
        </div>
      </div>

      {/* System Synchronization Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Synchronization</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Fundi Profiles</span>
              </div>
              <span className="text-sm text-green-600">Synced</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Client Data</span>
              </div>
              <span className="text-sm text-green-600">Synced</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Job Assignments</span>
              </div>
              <span className="text-sm text-green-600">Synced</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Payment Processing</span>
              </div>
              <span className="text-sm text-yellow-600">Processing</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm">✅</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New fundi registered</p>
                <p className="text-xs text-gray-600">John Kamau (Electrician) - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm">📋</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Job assigned</p>
                <p className="text-xs text-gray-600">Electrical work to Mary Wanjiku - 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm">💰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Payment completed</p>
                <p className="text-xs text-gray-600">KES 25,000 for kitchen renovation - 6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health & Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health & Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Database</span>
            </div>
            <p className="text-xs text-green-600">99.9% uptime</p>
            <p className="text-xs text-gray-500 mt-1">Last sync: 2 min ago</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Authentication</span>
            </div>
            <p className="text-xs text-green-600">Secure & active</p>
            <p className="text-xs text-gray-500 mt-1">24/7 monitoring</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">API Services</span>
            </div>
            <p className="text-xs text-green-600">Response: 45ms</p>
            <p className="text-xs text-gray-500 mt-1">All endpoints OK</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Matching Engine</span>
            </div>
            <p className="text-xs text-green-600">Active & optimized</p>
            <p className="text-xs text-gray-500 mt-1">Real-time sync</p>
          </div>
        </div>
      </div>
    </div>
  )
}
