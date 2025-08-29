import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Availability() {
  const { user } = useAuth()
  const [availability, setAvailability] = useState({
    monday: { available: true, startTime: '08:00', endTime: '17:00' },
    tuesday: { available: true, startTime: '08:00', endTime: '17:00' },
    wednesday: { available: true, startTime: '08:00', endTime: '17:00' },
    thursday: { available: true, startTime: '08:00', endTime: '17:00' },
    friday: { available: true, startTime: '08:00', endTime: '17:00' },
    saturday: { available: false, startTime: '09:00', endTime: '15:00' },
    sunday: { available: false, startTime: '10:00', endTime: '14:00' }
  })

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ]

  const handleDayToggle = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available
      }
    }))
  }

  const handleTimeChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving availability:', availability)
    alert('Availability updated successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Set Your Availability</h1>
        <p className="text-gray-600">Manage your working hours and availability for clients</p>
      </div>

      {/* Availability Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="space-y-4">
          {days.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={availability[key].available}
                  onChange={() => handleDayToggle(key)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="font-medium text-gray-900">{label}</span>
              </div>
              
              {availability[key].available && (
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={availability[key].startTime}
                    onChange={(e) => handleTimeChange(key, 'startTime', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={availability[key].endTime}
                    onChange={(e) => handleTimeChange(key, 'endTime', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Availability
          </button>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
              const newAvailability = { ...availability }
              weekdays.forEach(day => {
                newAvailability[day] = { available: true, startTime: '08:00', endTime: '17:00' }
              })
              setAvailability(newAvailability)
            }}
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
          >
            <div className="font-medium text-gray-900">Weekdays Only</div>
            <div className="text-sm text-gray-600">Mon-Fri, 8AM-5PM</div>
          </button>
          
          <button
            onClick={() => {
              const newAvailability = { ...availability }
              Object.keys(newAvailability).forEach(day => {
                newAvailability[day] = { available: true, startTime: '09:00', endTime: '18:00' }
              })
              setAvailability(newAvailability)
            }}
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <div className="font-medium text-gray-900">Full Week</div>
            <div className="text-sm text-gray-600">Every day, 9AM-6PM</div>
          </button>
          
          <button
            onClick={() => {
              const newAvailability = { ...availability }
              Object.keys(newAvailability).forEach(day => {
                newAvailability[day] = { available: false, startTime: '09:00', endTime: '17:00' }
              })
              setAvailability(newAvailability)
            }}
            className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left"
          >
            <div className="font-medium text-gray-900">Unavailable</div>
            <div className="text-sm text-gray-600">Set as unavailable</div>
          </button>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h2>
        <div className="flex items-center space-x-4">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-gray-900 font-medium">Available for work</span>
          <span className="text-gray-600">• Next available: Today, 8:00 AM</span>
        </div>
      </div>
    </div>
  )
}
