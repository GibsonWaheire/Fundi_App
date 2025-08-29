// Authentication service for FundiMatch
// This service handles user authentication against the db.json file

export const authService = {
  // Validate user credentials
  async validateUser(email, password) {
    try {
      const response = await fetch('/db.json')
      const data = await response.json()
      
      // Find user with matching email and password
      const user = data.users.find(u => 
        u.email === email && u.password === password
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

  // Get user by email (for registration validation)
  async getUserByEmail(email) {
    try {
      const response = await fetch('/db.json')
      const data = await response.json()
      
      return data.users.find(u => u.email === email)
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }
}
