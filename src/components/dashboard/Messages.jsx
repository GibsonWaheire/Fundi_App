export default function Messages() {
  const conversations = [
    {
      id: 1,
      fundi: 'John Kamau',
      service: 'Kitchen Sink Repair',
      lastMessage: 'I can come tomorrow at 10 AM. Is that okay?',
      timeAgo: '2 hours ago',
      unread: 2,
      avatar: '👷',
      status: 'online'
    },
    {
      id: 2,
      fundi: 'Sarah Wanjiku',
      service: 'House Painting',
      lastMessage: 'The paint job is complete. Please review when you get home.',
      timeAgo: '1 day ago',
      unread: 0,
      avatar: '🎨',
      status: 'offline'
    },
    {
      id: 3,
      fundi: 'Mike Ochieng',
      service: 'Electrical Wiring',
      lastMessage: 'I need to reschedule to next week due to an emergency.',
      timeAgo: '3 days ago',
      unread: 1,
      avatar: '⚡',
      status: 'online'
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Chat with fundis and manage your conversations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Chats</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-xl text-white">
              💬
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-xl text-white">
              🔴
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Online Fundis</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-xl text-white">
              🟢
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Chats</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-xl text-white">
              📱
            </div>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Conversations</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {conversations.map((conversation) => (
            <div key={conversation.id} className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl text-white">
                    {conversation.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    conversation.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{conversation.fundi}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{conversation.timeAgo}</span>
                      {conversation.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{conversation.service}</p>
                  <p className="text-sm text-gray-900 truncate">{conversation.lastMessage}</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Open Chat
                  </button>
                  <button className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    Archive
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
            <span>📝</span>
            New Message
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
            <span>🔍</span>
            Search Messages
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
            <span>📱</span>
            Download Chat History
          </button>
        </div>
      </div>
    </div>
  )
}
