export default function Payments() {
  const transactions = [
    {
      id: 1,
      service: 'Electrical Wiring Installation',
      client: 'Sarah Johnson',
      amount: 'KES 5,000',
      date: '2025-01-20',
      status: 'Completed',
      method: 'M-Pesa',
      reference: 'MPESA123456'
    },
    {
      id: 2,
      service: 'Security Lights Installation',
      client: 'Mike Ochieng',
      amount: 'KES 8,000',
      date: '2025-01-18',
      status: 'Completed',
      method: 'M-Pesa',
      reference: 'MPESA123457'
    },
    {
      id: 3,
      service: 'Electrical Inspection',
      client: 'David Kimani',
      amount: 'KES 3,000',
      date: '2025-01-15',
      status: 'Pending',
      method: 'M-Pesa',
      reference: 'MPESA123458'
    },
    {
      id: 4,
      service: 'Circuit Board Repair',
      client: 'Jane Akinyi',
      amount: 'KES 4,500',
      date: '2025-01-12',
      status: 'Completed',
      method: 'M-Pesa',
      reference: 'MPESA123459'
    },
    {
      id: 5,
      service: 'House Rewiring',
      client: 'Peter Mwangi',
      amount: 'KES 12,000',
      date: '2025-01-10',
      status: 'Completed',
      method: 'M-Pesa',
      reference: 'MPESA123460'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Failed': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings</h1>
        <p className="text-gray-600">Track your payments received and earnings history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Received</p>
              <p className="text-2xl font-bold text-gray-900">KES 45,000</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-xl text-white">
              💰
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">KES 15,000</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-xl text-white">
              📅
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">KES 8,000</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-xl text-white">
              ⏳
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-xl text-white">
              📊
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{transaction.service}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-2">
                      <span>👤</span>
                      <span>{transaction.client}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💳</span>
                      <span>{transaction.method}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🔢</span>
                      <span>{transaction.reference}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-xl font-bold text-gray-900 mb-2">{transaction.amount}</div>
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    View Details
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
