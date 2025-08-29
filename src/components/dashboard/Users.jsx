import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Users() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const users = [
    {
      id: 1,
      name: 'John Kamau',
      email: 'john@fundimatch.com',
      phone: '+254 700 123 456',
      type: 'fundi',
      skill: 'Electrician',
      status: 'active',
      joined: '2024-12-15',
      lastActive: '2025-01-20 14:30',
      rating: 4.2,
      jobsCompleted: 15
    },
    {
      id: 2,
      name: 'Mary Wanjiku',
      email: 'mary@fundimatch.com',
      phone: '+254 700 234 567',
      type: 'fundi',
      skill: 'Plumber',
      status: 'active',
      joined: '2024-11-20',
      lastActive: '2025-01-20 16:45',
      rating: 4.5,
      jobsCompleted: 22
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+254 700 345 678',
      type: 'customer',
      status: 'active',
      joined: '2024-12-01',
      lastActive: '2025-01-20 12:15',
      jobsPosted: 8,
      totalSpent: 'KES 45,000'
    },
    {
      id: 4,
      name: 'Mike Ochieng',
      email: 'mike@example.com',
      phone: '+254 700 456 789',
      type: 'customer',
      status: 'active',
      joined: '2024-11-10',
      lastActive: '2025-01-20 09:30',
      jobsPosted: 12,
      totalSpent: 'KES 78,000'
    },
    {
      id: 5,
      name: 'Peter Mwangi',
      email: 'peter@fundimatch.com',
      phone: '+254 700 567 890',
      type: 'fundi',
      skill: 'Mason',
      status: 'inactive',
      joined: '2024-10-15',
      lastActive: '2025-01-15 18:20',
      rating: 3.8,
      jobsCompleted: 8
    }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || user.type === activeTab
    return matchesSearch && matchesTab
  })

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'fundi': return 'bg-blue-100 text-blue-800'
      case 'customer': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Monitor and manage all platform users</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('fundi')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'fundi' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fundis ({users.filter(u => u.type === 'fundi').length})
            </button>
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'customer' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Customers ({users.filter(u => u.type === 'customer').length})
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">{user.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(user.type)}`}>
                      {user.type}
                    </span>
                    {user.skill && (
                      <div className="text-xs text-gray-500 mt-1">{user.skill}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.joined).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.type === 'fundi' ? (
                      <div>
                        <div className="text-sm text-gray-900">⭐ {user.rating}/5.0</div>
                        <div className="text-xs text-gray-500">{user.jobsCompleted} jobs</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm text-gray-900">{user.jobsPosted} jobs</div>
                        <div className="text-xs text-gray-500">{user.totalSpent}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Suspend</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
