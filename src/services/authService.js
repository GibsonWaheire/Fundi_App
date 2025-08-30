// Authentication service for FundiMatch
// This service handles user authentication against the db.json file

export const authService = {
  // Validate user credentials across all user types (admin, client, fundi)
  async validateUser(email, password) {
    try {
      // Fetch all user types
      const [usersResponse, fundisResponse] = await Promise.all([
        fetch('http://localhost:3001/users'),
        fetch('http://localhost:3001/fundis')
      ])
      
      const users = await usersResponse.json()
      const fundis = await fundisResponse.json()
      
      // Combine all users and fundis into one array
      const allUsers = [...users, ...fundis]
      
      // Find user with matching email and password
      const user = allUsers.find(u => 
        u.email === email && u.password === password && u.is_active !== false
      )
      
      if (user) {
        // Remove password from user object before returning
        const { password, ...userWithoutPassword } = user
        return { success: true, user: userWithoutPassword }
      } else {
        return { success: false, error: 'Invalid email or password' }
      }
    } catch (error) {
      console.error('Authentication error:', error)
      return { success: false, error: 'Authentication failed' }
    }
  },

  // Get user by email (for registration validation) - checks all user types
  async getUserByEmail(email) {
    try {
      // Fetch all user types
      const [usersResponse, fundisResponse] = await Promise.all([
        fetch('http://localhost:3001/users'),
        fetch('http://localhost:3001/fundis')
      ])
      
      const users = await usersResponse.json()
      const fundis = await fundisResponse.json()
      
      // Combine all users and fundis into one array
      const allUsers = [...users, ...fundis]
      
      return allUsers.find(u => u.email === email)
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  },

  // Get all fundis (for client dashboard)
  async getAllFundis() {
    try {
      const response = await fetch('http://localhost:3001/fundis')
      return await response.json()
    } catch (error) {
      console.error('Error fetching fundis:', error)
      return []
    }
  },

  // Get available fundis only
  async getAvailableFundis() {
    try {
      const response = await fetch('http://localhost:3001/fundis?is_available=true')
      return await response.json()
    } catch (error) {
      console.error('Error fetching available fundis:', error)
      return []
    }
  },

  // Get fundis by specialization
  async getFundisBySpecialization(specialization) {
    try {
      const response = await fetch(`http://localhost:3001/fundis?specialization=${specialization}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching fundis by specialization:', error)
      return []
    }
  },

  // Register new user (client)
  async registerUser(userData) {
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          id: Date.now(),
          role: 'client',
          created_at: new Date().toISOString(),
          is_active: true
        })
      })
      
      if (response.ok) {
        const newUser = await response.json()
        const { password, ...userWithoutPassword } = newUser
        return { success: true, user: userWithoutPassword }
      } else {
        return { success: false, error: 'Registration failed' }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Registration failed' }
    }
  },

  // Register new fundi
  async registerFundi(fundiData) {
    try {
      const response = await fetch('http://localhost:3001/fundis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...fundiData,
          id: Date.now(),
          role: 'fundi',
          created_at: new Date().toISOString(),
          is_active: true,
          is_available: true,
          rating: 0,
          hourly_rate: fundiData.hourly_rate || 1000
        })
      })
      
      if (response.ok) {
        const newFundi = await response.json()
        const { password, ...fundiWithoutPassword } = newFundi
        return { success: true, user: fundiWithoutPassword }
      } else {
        return { success: false, error: 'Fundi registration failed' }
      }
    } catch (error) {
      console.error('Fundi registration error:', error)
      return { success: false, error: 'Fundi registration failed' }
    }
  },

  // Get all users (for admin dashboard)
  async getAllUsers() {
    try {
      const response = await fetch('http://localhost:3001/users')
      return await response.json()
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  },

  // Get all fundis (for admin dashboard)
  async getAllFundisForAdmin() {
    try {
      const response = await fetch('http://localhost:3001/fundis')
      return await response.json()
    } catch (error) {
      console.error('Error fetching fundis:', error)
      return []
    }
  },

  // Create booking
  async createBooking(bookingData) {
    try {
      const response = await fetch('http://localhost:3001/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          id: Date.now(),
          created_at: new Date().toISOString(),
          status: 'pending',
          is_paid: false
        })
      })
      
      if (response.ok) {
        return { success: true, booking: await response.json() }
      } else {
        return { success: false, error: 'Booking creation failed' }
      }
    } catch (error) {
      console.error('Booking creation error:', error)
      return { success: false, error: 'Booking creation failed' }
    }
  },

  // Get user's bookings
  async getUserBookings(userId) {
    try {
      const response = await fetch(`http://localhost:3001/bookings?client_id=${userId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      return []
    }
  },

  // Get fundi's bookings
  async getFundiBookings(fundiId) {
    try {
      const response = await fetch(`http://localhost:3001/bookings?fundi_id=${fundiId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching fundi bookings:', error)
      return []
    }
  }
}
