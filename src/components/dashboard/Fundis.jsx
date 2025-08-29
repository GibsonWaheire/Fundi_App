import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Fundis() {
  const { user } = useAuth()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const fundis = [
    {
      id: 1,
      name: 'John Kamau',
      email: 'john@fundimatch.com',
      phone: '+254 700 123 456',
      skill: 'Electrician',
      status: 'active',
      availability: 'available',
      rating: 4.2,
      jobsCompleted: 15,
      totalEarnings: 'KES 75,000',
      joined: '2024-12-15',
      lastActive: '2025-01-20 14:30',
      location: 'Nairobi',
      verified: true
    },
    {
      id: 2,
      name: 'Mary Wanjiku',
      email: 'mary@fundimatch.com',
      phone: '+254 700 234 567',
      skill: 'Plumber',
      status: 'active',
      availability: 'available',
      rating: 4.5,
      jobsCompleted: 22,
      totalEarnings: 'KES 120,000',
      joined: '2024-11-20',
      lastActive: '2025-01-20 16:45',
      location: 'Mombasa',
      verified: true
    },
    {
      id: 3,
      name: 'Peter Mwangi',
      email: 'peter@fundimatch.com',
      phone: '+254 700 567 890',
      skill: 'Mason',
      status: 'inactive',
      availability: 'unavailable',
      rating: 3.8,
      jobsCompleted: 8,
      totalEarnings: 'KES 35,000',
      joined: '2024-10-15',
      lastActive: '2025-01-15 18:20',
      location: 'Kisumu',
      verified: false
    },
    {
      id: 4,
      name: 'Jane Akinyi',
      email: 'jane@fundimatch.com',
      phone: '+254 700 678 901',
      skill: 'Painter',
      status: 'active',
      availability: 'available',
      rating: 4.0,
      jobsCompleted: 12,
      totalEarnings: 'KES 65,000',
      joined: '2024-12-01',
      lastActive: '2025-01-20 10:15',
      location: 'Nakuru',
      verified: true
    },
    {
      id: 5,
      name: 'David Kimani',
      email: 'david@fundimatch.com',
      phone: '+254 700 789 012',
      skill: 'Carpenter',
      status: 'pending',
      availability: 'unavailable',
      rating: 0,
      jobsCompleted: 0,
      totalEarnings: 'KES 0',
      joined: '2025-01-18',
      lastActive: '2025-01-18 09:00',
      location: 'Eldoret',
      verified: false
    }
  ]

  const filteredFundis = fundis.filter(fundi => {
    const matchesSearch = fundi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fundi.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fundi.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = activeFilter === 'all' || fundi.status === activeFilter
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAvailabilityColor = (availability) => {
    return availability === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getVerificationColor = (verified) => {
    return verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Fundi Management</h1>
            <p className="text-gray-600">Monitor and manage all registered fundis</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{fundis.length}</div>
              <div className="text-sm text-gray-600">Total Fundis</div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Fundi
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Fundis</p>
              <p className="text-2xl font-bold text-gray-900">{fundis.filter(f => f.status === 'active').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Now</p>
              <p className="text-2xl font-bold text-gray-900">{fundis.filter(f => f.availability === 'available').length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🛠️</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Verification</p>
              <p className="text-2xl font-bold text-gray-900">{fundis.filter(f => !f.verified).length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">KES 295K</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({fundis.length})
            </button>
            <button
              onClick={() => setActiveFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'active' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active ({fundis.filter(f => f.status === 'active').length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'pending' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({fundis.filter(f => f.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveFilter('inactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'inactive' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactive ({fundis.filter(f => f.status === 'inactive').length})
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search fundis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      {/* Fundis Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fundi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skill & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFundis.map((fundi) => (
                <tr key={fundi.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {fundi.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{fundi.name}</div>
                        <div className="text-sm text-gray-500">{fundi.email}</div>
                        <div className="text-xs text-gray-400">{fundi.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{fundi.skill}</div>
                    <div className="text-sm text-gray-500">{fundi.location}</div>
                    <div className="text-xs text-gray-400">Joined {new Date(fundi.joined).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(fundi.status)}`}>
                        {fundi.status}
                      </span>
                      <div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(fundi.availability)}`}>
                          {fundi.availability}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">⭐ {fundi.rating}/5.0</div>
                    <div className="text-xs text-gray-500">{fundi.jobsCompleted} jobs completed</div>
                    <div className="text-xs text-gray-400">Last active: {fundi.lastActive}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{fundi.totalEarnings}</div>
                    <div className="text-xs text-gray-500">Lifetime earnings</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(fundi.verified)}`}>
                      {fundi.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Edit</button>
                      <button className="text-yellow-600 hover:text-yellow-900">Verify</button>
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
