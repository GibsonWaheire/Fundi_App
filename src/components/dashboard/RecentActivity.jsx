export default function RecentActivity() {
  const recentJobs = [
    {
      id: 1,
      title: 'Kitchen Sink Repair',
      status: 'In Progress',
      location: 'Westlands, Nairobi',
      budget: 'KSh 2,500',
      timeAgo: '2 hours ago'
    },
    {
      id: 2,
      title: 'House Painting',
      status: 'Completed',
      location: 'Karen, Nairobi',
      budget: 'KSh 18,000',
      timeAgo: '1 day ago'
    },
    {
      id: 3,
      title: 'Electrical Wiring',
      status: 'Pending',
      location: 'Kilimani, Nairobi',
      budget: 'KSh 6,500',
      timeAgo: '3 days ago'
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
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.budget}</span>
                    <span>⏰ {job.timeAgo}</span>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
