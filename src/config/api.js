// API Configuration for FundiMatch
// This file manages API endpoints for different environments

const API_CONFIG = {
  // Development: JSON Server
  development: {
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    endpoints: {
      users: '/users',
      fundis: '/fundis',
      bookings: '/bookings',
      reviews: '/reviews',
      payments: '/payments',
      categories: '/categories',
      fundiUnlocks: '/fundi_unlocks'
    }
  },
  
  // Production: Flask API (future)
  production: {
    baseURL: 'https://your-flask-api.onrender.com/api',
    endpoints: {
      users: '/users',
      fundis: '/fundis',
      bookings: '/bookings',
      reviews: '/reviews',
      payments: '/payments',
      categories: '/categories',
      fundiUnlocks: '/fundi_unlocks'
    }
  }
};

// Get current environment
const getEnvironment = () => {
  return import.meta.env.MODE || 'development';
};

// Get API configuration for current environment
export const getApiConfig = () => {
  const env = getEnvironment();
  return API_CONFIG[env] || API_CONFIG.development;
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  const config = getApiConfig();
  const envBase = import.meta.env.VITE_API_BASE;
  const base = envBase || config.baseURL;
  return `${base}${config.endpoints[endpoint] || endpoint}`;
};

// Export current environment for debugging
export const currentEnvironment = getEnvironment();
