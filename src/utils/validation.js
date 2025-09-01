// Input validation utilities for FundiMatch
// This file provides comprehensive validation functions for user inputs

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Password is required'] }
  }

  const errors = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates Kenyan phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false
  
  const trimmedPhone = phone.trim()
  
  // Accept multiple Kenyan phone formats:
  // +254XXXXXXXXX (international format)
  // 07XXXXXXXX (local format starting with 07)
  // 01XXXXXXXX (local format starting with 01)
  // 254XXXXXXXXX (without +)
  
  const phoneRegex = /^(\+254|254|07|01)\d{8,9}$/
  
  if (phoneRegex.test(trimmedPhone)) {
    return true
  }
  
  // Also accept +254XXXXXXXXX format (9 digits after +254)
  const internationalRegex = /^\+254[17]\d{8}$/
  return internationalRegex.test(trimmedPhone)
}

/**
 * Validates username format
 * @param {string} username - Username to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return { isValid: false, errors: ['Username is required'] }
  }

  const errors = []
  const trimmedUsername = username.trim()
  
  if (trimmedUsername.length < 3) {
    errors.push('Username must be at least 3 characters long')
  }
  
  if (trimmedUsername.length > 50) {
    errors.push('Username must be less than 50 characters')
  }
  
  if (!/^[a-zA-Z0-9_\s]+$/.test(trimmedUsername)) {
    errors.push('Username can only contain letters, numbers, spaces, and underscores')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates hourly rate
 * @param {number} rate - Hourly rate to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validateHourlyRate = (rate) => {
  if (rate === null || rate === undefined) {
    return { isValid: false, errors: ['Hourly rate is required'] }
  }

  const numRate = Number(rate)
  const errors = []
  
  if (isNaN(numRate)) {
    errors.push('Hourly rate must be a valid number')
  } else if (numRate < 100) {
    errors.push('Hourly rate must be at least KES 100')
  } else if (numRate > 10000) {
    errors.push('Hourly rate cannot exceed KES 10,000')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates location
 * @param {string} location - Location to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validateLocation = (location) => {
  if (!location || typeof location !== 'string') {
    return { isValid: false, errors: ['Location is required'] }
  }

  const errors = []
  const trimmedLocation = location.trim()
  
  if (trimmedLocation.length < 3) {
    errors.push('Location must be at least 3 characters long')
  }
  
  if (trimmedLocation.length > 100) {
    errors.push('Location must be less than 100 characters')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitizes input to prevent XSS attacks
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Validates form data for user registration
 * @param {object} formData - Form data object
 * @returns {object} - Validation result with isValid and errors
 */
export const validateRegistrationForm = (formData) => {
  const errors = {}
  
  // Validate username
  const usernameValidation = validateUsername(formData.name)
  if (!usernameValidation.isValid) {
    errors.name = usernameValidation.errors
  }
  
  // Validate email
  if (!validateEmail(formData.email)) {
    errors.email = ['Please enter a valid email address']
  }
  
  // Validate password
  const passwordValidation = validatePassword(formData.password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors
  }
  
  // Validate confirm password
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = ['Passwords do not match']
  }
  
  // Validate phone
  if (!validatePhone(formData.phone)) {
    errors.phone = ['Please enter a valid Kenyan phone number (+254XXXXXXXXX)']
  }
  
  // Validate fundi-specific fields if registering as fundi
  if (formData.userType === 'fundi') {
    const locationValidation = validateLocation(formData.location)
    if (!locationValidation.isValid) {
      errors.location = locationValidation.errors
    }
    
    const rateValidation = validateHourlyRate(formData.hourly_rate)
    if (!rateValidation.isValid) {
      errors.hourly_rate = rateValidation.errors
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates form data for user login
 * @param {object} formData - Form data object
 * @returns {object} - Validation result with isValid and errors
 */
export const validateLoginForm = (formData) => {
  const errors = {}
  
  // Validate email
  if (!validateEmail(formData.email)) {
    errors.email = ['Please enter a valid email address']
  }
  
  // Validate password
  if (!formData.password || formData.password.length < 1) {
    errors.password = ['Password is required']
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates job creation form
 * @param {object} formData - Form data object
 * @returns {object} - Validation result with isValid and errors
 */
export const validateJobForm = (formData) => {
  const errors = {}
  
  // Validate title
  if (!formData.title || formData.title.trim().length < 5) {
    errors.title = ['Job title must be at least 5 characters long']
  }
  
  // Validate description
  if (!formData.description || formData.description.trim().length < 10) {
    errors.description = ['Job description must be at least 10 characters long']
  }
  
  // Validate location
  const locationValidation = validateLocation(formData.location)
  if (!locationValidation.isValid) {
    errors.location = locationValidation.errors
  }
  
  // Validate budget (optional but if provided, must be valid)
  if (formData.budget) {
    const numBudget = Number(formData.budget)
    if (isNaN(numBudget) || numBudget < 0) {
      errors.budget = ['Budget must be a valid positive number']
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates review form
 * @param {object} formData - Form data object
 * @returns {object} - Validation result with isValid and errors
 */
export const validateReviewForm = (formData) => {
  const errors = {}
  
  // Validate rating
  const rating = Number(formData.rating)
  if (isNaN(rating) || rating < 1 || rating > 5) {
    errors.rating = ['Rating must be between 1 and 5']
  }
  
  // Validate comment (optional but if provided, must be reasonable length)
  if (formData.comment && formData.comment.trim().length > 500) {
    errors.comment = ['Comment must be less than 500 characters']
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateUsername,
  validateHourlyRate,
  validateLocation,
  sanitizeInput,
  validateRegistrationForm,
  validateLoginForm,
  validateJobForm,
  validateReviewForm
}
