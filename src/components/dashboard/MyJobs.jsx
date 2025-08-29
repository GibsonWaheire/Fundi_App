import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function MyJobs() {
  const { user } = useAuth()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Comprehensive job data for different user types
  const allJobs = [
    {
      id: 1,
      title: 'Kitchen Sink Repair',
      status: 'in_progress',
      location: 'Westlands, Nairobi',
      budget: 'KES 2,500',
      timeAgo: '2 hours ago',
      fundi: 'John Kamau',
      client: 'Sarah Johnson',
      category: 'Plumbing',
      description: 'Fix leaking kitchen sink and replace faucet',
      priority: 'medium',
      assignedDate: '2025-01-20',
      estimatedCompletion: '2025-01-22',
      actualCompletion: null,
      rating: null,
      review: null
    },
    {
      id: 2,
      title: 'House Painting',
      status: 'completed',
      location: 'Karen, Nairobi',
      budget: 'KES 18,000',
      timeAgo: '1 day ago',
      fundi: 'Mary Wanjiku',
      client: 'Mike Ochieng',
      category: 'Painting',
      description: 'Paint entire house interior and exterior',
      priority: 'high',
      assignedDate: '2025-01-15',
      estimatedCompletion: '2025-01-19',
      actualCompletion: '2025-01-19',
      rating: 5,
      review: 'Excellent work! Very professional and clean finish.'
    },
    {
      id: 3,
      title: 'Electrical Wiring',
      status: 'pending',
      location: 'Kilimani, Nairobi',
      budget: 'KES 6,500',
      timeAgo: '3 days ago',
      fundi: null,
      client: 'David Kimani',
      category: 'Electrical',
      description: 'Install new electrical wiring for kitchen renovation',
      priority: 'high',
      assignedDate: null,
      estimatedCompletion: null,
      actualCompletion: null,
      rating: null,
      review: null
    },
    {
      id: 4,
      title: 'Security Lights Installation',
      status: 'completed',
      location: 'Lavington, Nairobi',
      budget: 'KES 8,000',
      timeAgo: '5 days ago',
      fundi: 'John Kamau',
      client: 'Jane Akinyi',
      category: 'Electrical',
      description: 'Install motion sensor security lights around the house',
      priority: 'medium',
      assignedDate: '2025-01-10',
      estimatedCompletion: '2025-01-12',
      actualCompletion: '2025-01-12',
      rating: 4,
      review: 'Good work, lights are working perfectly.'
    },
    {
      id: 5,
      title: 'Bathroom Renovation',
      status: 'in_progress',
      location: 'Kilimani, Nairobi',
      budget: 'KES 25,000',
      timeAgo: '1 week ago',
      fundi: 'Peter Mwangi',
      client: 'Sarah Johnson',
      category: 'Masonry',
      description: 'Complete bathroom renovation including tiles and fixtures',
      priority: 'high',
      assignedDate: '2025-01-13',
      estimatedCompletion: '2025-01-25',
      actualCompletion: null,
      rating: null,
      review: null
    }
  ]

  // Filter jobs based on user type
  const getJobsForUser = () => {
    if (!user) return []
    
    if (user.type === 'admin') {
      return allJobs // Admin sees all jobs
    } else if (user.type === 'fundi') {
      return allJobs.filter(job => job.fundi === user.name) // Fundi sees their assigned jobs
    } else {
      return allJobs.filter(job => job.client === user.name) // Client sees their posted jobs
    }
  }

  const jobs = getJobsForUser()

  // Filter jobs based on status and search
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = activeFilter === 'all' || job.status === activeFilter
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_progress': return 'In Progress'
      case 'completed': return 'Completed'
      case 'pending': return 'Pending'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  // Calculate stats based on user type
  const getStats = () => {
    const userJobs = getJobsForUser()
    const activeJobs = userJobs.filter(job => job.status === 'in_progress').length
    const completedJobs = userJobs.filter(job => job.status === 'completed').length
    const pendingJobs = userJobs.filter(job => job.status === 'pending').length
    
    if (user?.type === 'fundi') {
      const totalEarnings = userJobs
        .filter(job => job.status === 'completed')
        .reduce((sum, job) => sum + parseInt(job.budget.replace('KES ', '').replace(',', '')), 0)
      
      const avgRating = userJobs
        .filter(job => job.rating)
        .reduce((sum, job) => sum + job.rating, 0) / userJobs.filter(job => job.rating).length || 0
      
      return {
        active: activeJobs,
        completed: completedJobs,
        earnings: `KES ${totalEarnings.toLocaleString()}`,
        rating: avgRating.toFixed(1)
      }
    } else if (user?.type === 'admin') {
      const totalValue = userJobs
        .reduce((sum, job) => sum + parseInt(job.budget.replace('KES ', '').replace(',', '')), 0)
      
      return {
        active: activeJobs,
        completed: completedJobs,
        totalValue: `KES ${totalValue.toLocaleString()}`,
        pending: pendingJobs
      }
    } else {
      const totalSpent = userJobs
        .filter(job => job.status === 'completed')
        .reduce((sum, job) => sum + parseInt(job.budget.replace('KES ', '').replace(',', '')), 0)
      
      const avgRating = userJobs
        .filter(job => job.rating)
        .reduce((sum, job) => sum + job.rating, 0) / userJobs.filter(job => job.rating).length || 0
      
      return {
        active: activeJobs,
        completed: completedJobs,
        spent: `KES ${totalSpent.toLocaleString()}`,
        rating: avgRating.toFixed(1)
      }
    }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {user?.type === 'admin' ? 'All Jobs' : 'My Jobs'}
            </h1>
            <p className="text-gray-600">
              {user?.type === 'admin' ? 'Monitor and manage all platform jobs' : 'Manage your projects and track progress'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{jobs.length}</div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </div>
            {user?.type === 'admin' && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add Job
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {user?.type === 'fundi' ? 'Total Earnings' : user?.type === 'admin' ? 'Total Value' : 'Total Spent'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.type === 'fundi' ? stats.earnings : user?.type === 'admin' ? stats.totalValue : stats.spent}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {user?.type === 'admin' ? 'Pending Jobs' : 'Avg Rating'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.type === 'admin' ? stats.pending : stats.rating}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{user?.type === 'admin' ? '⏳' : '⭐'}</span>
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
              All ({jobs.length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'pending' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({jobs.filter(job => job.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveFilter('in_progress')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'in_progress' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Progress ({jobs.filter(job => job.status === 'in_progress').length})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'completed' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({jobs.filter(job => job.status === 'completed').length})
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
          </h2>
        </div>
                  <div className="divide-y divide-gray-200">
            {filteredJobs.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}>
                          {getStatusLabel(job.status)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>
                          {job.priority} Priority
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          <span>{job.budget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🏷️</span>
                          <span>{job.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{user?.type === 'fundi' ? '👤' : '👷'}</span>
                          <span>{user?.type === 'fundi' ? job.client : job.fundi || 'Unassigned'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Posted {job.timeAgo}</span>
                        {job.assignedDate && (
                          <span>• Assigned {new Date(job.assignedDate).toLocaleDateString()}</span>
                        )}
                        {job.estimatedCompletion && (
                          <span>• Due {new Date(job.estimatedCompletion).toLocaleDateString()}</span>
                        )}
                        {job.actualCompletion && (
                          <span>• Completed {new Date(job.actualCompletion).toLocaleDateString()}</span>
                        )}
                      </div>
                      
                      {job.rating && (
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className="text-yellow-400">
                                {star <= job.rating ? '⭐' : '☆'}
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({job.rating}/5)</span>
                        </div>
                      )}
                      
                      {job.review && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700 italic">"{job.review}"</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        View Details
                      </button>
                      {user?.type === 'admin' && (
                        <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          Edit
                        </button>
                      )}
                      {user?.type === 'fundi' && job.status === 'in_progress' && (
                        <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                          Mark Complete
                        </button>
                      )}
                      {user?.type === 'customer' && job.status === 'completed' && !job.rating && (
                        <button className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                          Rate & Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
      </div>
    </div>
  )
}
