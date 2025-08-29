import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Reports() {
  const { user } = useAuth()
  const [activePeriod, setActivePeriod] = useState('month')

  const analytics = {
    overview: {
      totalUsers: 24,
      activeFundis: 12,
      totalJobs: 45,
      platformRevenue: 'KES 125,000',
      growthRate: '+15%',
      completionRate: '92%'
    },
    topFundis: [
      { name: 'Mary Wanjiku', skill: 'Plumber', jobs: 22, earnings: 'KES 120,000', rating: 4.5 },
      { name: 'John Kamau', skill: 'Electrician', jobs: 15, earnings: 'KES 75,000', rating: 4.2 },
      { name: 'Jane Akinyi', skill: 'Painter', jobs: 12, earnings: 'KES 65,000', rating: 4.0 },
      { name: 'Peter Mwangi', skill: 'Mason', jobs: 8, earnings: 'KES 35,000', rating: 3.8 }
    ],
    topSkills: [
      { skill: 'Electrical Work', demand: 35, supply: 8, avgPrice: 'KES 5,200' },
      { skill: 'Plumbing', demand: 28, supply: 6, avgPrice: 'KES 4,800' },
      { skill: 'Painting', demand: 22, supply: 4, avgPrice: 'KES 3,500' },
      { skill: 'Masonry', demand: 18, supply: 3, avgPrice: 'KES 6,200' },
      { skill: 'Carpentry', demand: 15, supply: 2, avgPrice: 'KES 4,500' }
    ],
    recentActivity: [
      { type: 'registration', user: 'David Kimani', action: 'joined as Carpenter', time: '2 hours ago' },
      { type: 'job', user: 'Sarah Johnson', action: 'posted Electrical work job', time: '4 hours ago' },
      { type: 'completion', user: 'Mary Wanjiku', action: 'completed Plumbing job', time: '6 hours ago' },
      { type: 'payment', user: 'Mike Ochieng', action: 'paid KES 25,000', time: '8 hours ago' },
      { type: 'review', user: 'Jane Doe', action: 'gave 5-star review', time: '12 hours ago' }
    ]
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'registration': return '👤'
      case 'job': return '📋'
      case 'completion': return '✅'
      case 'payment': return '💰'
      case 'review': return '⭐'
      default: return '📝'
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'registration': return 'bg-blue-100'
      case 'job': return 'bg-green-100'
      case 'completion': return 'bg-purple-100'
      case 'payment': return 'bg-yellow-100'
      case 'review': return 'bg-pink-100'
      default: return 'bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
            <p className="text-gray-600">Platform insights and performance metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={activePeriod}
              onChange={(e) => setActivePeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Platform Growth</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.growthRate}</p>
              <p className="text-xs text-green-600">vs last period</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Job Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.completionRate}</p>
              <p className="text-xs text-blue-600">of all jobs</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Platform Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.platformRevenue}</p>
              <p className="text-xs text-purple-600">this period</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Fundis</h2>
          <div className="space-y-4">
            {analytics.topFundis.map((fundi, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{fundi.name}</div>
                    <div className="text-xs text-gray-500">{fundi.skill}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">⭐ {fundi.rating}</div>
                  <div className="text-xs text-gray-500">{fundi.jobs} jobs</div>
                  <div className="text-xs text-blue-600">{fundi.earnings}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Skill Demand Analysis</h2>
          <div className="space-y-4">
            {analytics.topSkills.map((skill, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                  <span className="text-sm text-blue-600">{skill.avgPrice}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Demand: {skill.demand} jobs</span>
                  <span>Supply: {skill.supply} fundis</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(skill.demand / 40) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Platform Activity</h2>
        <div className="space-y-4">
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center`}>
                <span className="text-sm">{getActivityIcon(activity.type)}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                <p className="text-xs text-gray-600">{activity.action}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Synchronization Report */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Synchronization Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Fundi Profiles</span>
            </div>
            <p className="text-xs text-green-600">100% synced</p>
            <p className="text-xs text-gray-500 mt-1">Last sync: 2 min ago</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Client Data</span>
            </div>
            <p className="text-xs text-green-600">100% synced</p>
            <p className="text-xs text-gray-500 mt-1">Last sync: 1 min ago</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Job Assignments</span>
            </div>
            <p className="text-xs text-green-600">100% synced</p>
            <p className="text-xs text-gray-500 mt-1">Last sync: 30 sec ago</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-yellow-800">Payment Processing</span>
            </div>
            <p className="text-xs text-yellow-600">Processing...</p>
            <p className="text-xs text-gray-500 mt-1">ETA: 5 min</p>
          </div>
        </div>
      </div>
    </div>
  )
}
