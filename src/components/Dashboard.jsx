import { useState } from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'Active Jobs', value: '12', change: '+2', icon: '📋', color: 'from-blue-500 to-blue-600' },
    { label: 'Available Fundis', value: '45', change: '+5', icon: '👷', color: 'from-green-500 to-green-600' },
    { label: 'Completed Projects', value: '28', change: '+3', icon: '✅', color: 'from-purple-500 to-purple-600' },
    { label: 'Total Revenue', value: 'KSh 156K', change: '+12%', icon: '💰', color: 'from-orange-500 to-orange-600' }
  ]

  const recentJobs = [
    {
      id: 1,
      title: 'Plumbing Repair Needed',
      description: 'Urgent plumbing repair in Westlands area. Leaking pipe under kitchen sink.',
      status: 'Active',
      location: 'Nairobi, Westlands',
      budget: 'KSh 3,500',
      applicants: 8,
      timeAgo: '2 hours ago'
    },
    {
      id: 2,
      title: 'House Painting Project',
      description: 'Complete house painting in Karen. 4 bedrooms, living room, and kitchen.',
      status: 'Pending',
      location: 'Nairobi, Karen',
      budget: 'KSh 25,000',
      applicants: 12,
      timeAgo: '1 day ago'
    },
    {
      id: 3,
      title: 'Electrical Installation',
      description: 'New electrical wiring for home office. Need 6 power outlets and lighting.',
      status: 'In Progress',
      location: 'Nairobi, Kilimani',
      budget: 'KSh 8,500',
      applicants: 6,
      timeAgo: '3 days ago'
    }
  ]

  const topFundis = [
    { id: 1, name: 'John Kamau', profession: 'Plumber', rating: 4.9, completed: 127, image: '/assets/fundi 1.webp' },
    { id: 2, name: 'Peter Mwangi', profession: 'Electrician', rating: 4.8, completed: 89, image: '/assets/fundi 2.jpeg' },
    { id: 3, name: 'Amina Hassan', profession: 'Mason', rating: 4.9, completed: 156, image: '/assets/fundi 3.jpeg' },
    { id: 4, name: 'David Ochieng', profession: 'Carpenter', rating: 4.7, completed: 94, image: '/assets/fundi 4.jpeg' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200'
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-xl text-gray-600">Welcome back! Here's what's happening with your projects.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {['overview', 'jobs', 'fundis', 'messages', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Recent Jobs */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Recent Job Postings</h3>
                  </div>
                  <div className="space-y-4">
                    {recentJobs.map((job) => (
                      <div key={job.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                                {job.status}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{job.description}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <span>📍 {job.location}</span>
                              <span>💰 {job.budget}</span>
                              <span>👥 {job.applicants} applicants</span>
                              <span>⏰ {job.timeAgo}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Fundis */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Fundis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {topFundis.map((fundi) => (
                      <div key={fundi.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-200">
                        <div className="text-center">
                          <img
                            src={fundi.image}
                            alt={fundi.name}
                            className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-gray-200"
                          />
                          <h4 className="font-semibold text-gray-900 mb-1">{fundi.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{fundi.profession}</p>
                          <div className="flex items-center justify-center gap-1 mb-2">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm font-medium">{fundi.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">{fundi.completed} projects</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Job Management</h3>
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h4>
                          <p className="text-gray-600 mb-3">{job.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>📍 {job.location}</span>
                            <span>💰 {job.budget}</span>
                            <span>👥 {job.applicants} applicants</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'fundis' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Fundis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topFundis.map((fundi) => (
                    <div key={fundi.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={fundi.image}
                          alt={fundi.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{fundi.name}</h4>
                          <p className="text-gray-600">{fundi.profession}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm font-medium">{fundi.rating}</span>
                            <span className="text-gray-500 text-sm">({fundi.completed} projects)</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                        Contact Fundi
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No New Messages</h3>
                <p className="text-gray-600">You're all caught up! New messages will appear here.</p>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">Detailed analytics and insights coming soon!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              📝 Post New Job
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              💬 Contact Support
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-xl hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              ⚙️ Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
