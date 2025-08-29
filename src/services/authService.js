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
  }
}
