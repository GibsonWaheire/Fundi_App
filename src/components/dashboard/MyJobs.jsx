export default function MyJobs() {
  const jobs = [
    {
      id: 1,
      title: 'Kitchen Sink Repair',
      status: 'In Progress',
      location: 'Westlands, Nairobi',
      budget: 'KSh 2,500',
      timeAgo: '2 hours ago',
      fundi: 'John Kamau',
      category: 'Plumbing'
    },
    {
      id: 2,
      title: 'House Painting',
      status: 'Completed',
      location: 'Karen, Nairobi',
      budget: 'KSh 18,000',
      timeAgo: '1 day ago',
      fundi: 'Sarah Wanjiku',
      category: 'Painting'
    },
    {
      id: 3,
      title: 'Electrical Wiring',
      status: 'Pending',
      location: 'Kilimani, Nairobi',
      budget: 'KSh 6,500',
      timeAgo: '3 days ago',
      fundi: 'Mike Ochieng',
      category: 'Electrical'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
        <p className="text-gray-600">Manage your projects and track progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-xl text-white">
              📋
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-xl text-white">
              ✅
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">KSh 45K</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-xl text-white">
              💰
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-xl text-white">
              ⭐
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Jobs</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {jobs.map((job) => (
            <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
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
                      <span>👷</span>
                      <span>{job.fundi}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🏷️</span>
                      <span>{job.category}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Posted {job.timeAgo}
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    View Details
                  </button>
                  <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
