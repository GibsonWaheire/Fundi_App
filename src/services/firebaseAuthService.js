import { auth, googleProvider } from './firebaseClient'
import { signInWithPopup, sendPasswordResetEmail } from 'firebase/auth'
import { buildApiUrl } from '../config/api'

export const firebaseAuthService = {
  async signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    const idToken = await user.getIdToken()
    
    // Send ID token to backend for verification and user sync
    const response = await fetch(`${buildApiUrl('')}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken })
    })
    
    if (!response.ok) {
      throw new Error('Failed to verify Google token')
    }
    
    const result_data = await response.json()
    if (!result_data.success) {
      throw new Error(result_data.error || 'Google authentication failed')
    }
    
    return { user: result_data.user, firebaseUser: user }
  },

  async sendResetEmail(email) {
    await sendPasswordResetEmail(auth, email)
    return true
  }
}


