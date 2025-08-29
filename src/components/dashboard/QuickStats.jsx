export default function QuickStats() {
  const stats = [
    { label: 'Active Jobs', value: '8', icon: '📋', color: 'from-blue-500 to-blue-600' },
    { label: 'Available Fundis', value: '24', icon: '👷', color: 'from-green-500 to-green-600' },
    { label: 'Completed Projects', value: '15', icon: '✅', color: 'from-purple-500 to-purple-600' },
    { label: 'Total Spent', value: 'KSh 45K', icon: '💰', color: 'from-orange-500 to-orange-600' }
  ]

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-xl shadow-sm`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
