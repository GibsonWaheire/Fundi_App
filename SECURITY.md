# Security Configuration

## Overview
This project has been configured with security best practices to protect sensitive information like Firebase API keys and database credentials.

## Security Measures Implemented

### 1. Environment Variables
- All Firebase configuration is now stored in environment variables
- Sensitive data is no longer hardcoded in source files
- Environment variables are prefixed with `VITE_` for Vite.js compatibility

### 2. Git Ignore Configuration
The following sensitive files are now excluded from version control:
- `.env` - Environment variables file
- `db.json` - Database file
- `*.db` - Any database files
- `fundimatch.db` - Specific database file
- `firebase-config.js` - Root Firebase config (now redirects to secure version)
- `src/firebase-config.js` - Firebase config with environment variables

### 3. Firebase Configuration
- Firebase config now uses `import.meta.env` to access environment variables
- Validation ensures all required environment variables are present
- Configuration is centralized in `src/firebase-config.js`

## Environment Variables Required

Create a `.env` file in the root directory with the following variables:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_DATABASE_URL=your_database_url
```

## Important Notes

1. **Never commit `.env` files** - They contain sensitive information
2. **Use `env.example`** - This file shows the required variables without real values
3. **Rotate API keys regularly** - Change Firebase API keys periodically
4. **Monitor access** - Keep track of who has access to your Firebase project

## Development Setup

1. Copy `env.example` to `.env`
2. Fill in your actual Firebase credentials
3. Ensure `.env` is in your `.gitignore`
4. Test the application to ensure Firebase connection works

## Production Deployment

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Never expose environment variables in client-side code
3. Use Firebase Security Rules to restrict database access
4. Enable Firebase Authentication for user management
