# 🚀 FundiMatch Deployment Guide - Render
=========================================

## Why Render is Perfect for This Project

✅ **Free Tier Available** - Great for development/testing  
✅ **Auto-deploys from GitHub** - Push code, auto-deploy  
✅ **Managed PostgreSQL** - No database setup needed  
✅ **HTTPS by default** - Secure out of the box  
✅ **Environment variables** - Easy configuration  
✅ **Static site hosting** - Perfect for React frontend  

## 📋 Prerequisites

1. **GitHub Repository** - Your code must be on GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Firebase Project** - For authentication (already set up)

## 🗄️ Database Setup (PostgreSQL)

### Step 1: Create PostgreSQL Database
1. Go to Render Dashboard → "New" → "PostgreSQL"
2. Name: `fundimatch-db`
3. Database Name: `fundimatch`
4. User: `fundimatch_user`
5. Plan: Free
6. Click "Create Database"

### Step 2: Get Database URL
- After creation, copy the "External Database URL"
- Format: `postgresql://username:password@host:port/database`

## 🖥️ Backend Deployment (Flask API)

### Step 1: Create Web Service
1. Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Name: `fundimatch-api`
4. Environment: Python
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `gunicorn flask_backend_template:app --bind 0.0.0.0:$PORT`

### Step 2: Environment Variables
Set these in Render Dashboard → Your Service → Environment:

```
DATABASE_URL=<your-postgresql-url-from-step-2>
SECRET_KEY=<generate-a-strong-secret-key>
FLASK_ENV=production
GOOGLE_CLIENT_ID=YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com
```

### Step 3: Health Check
- Health Check Path: `/api/health`
- This ensures your service stays running

## 🌐 Frontend Deployment (React)

### Step 1: Create Static Site
1. Render Dashboard → "New" → "Static Site"
2. Connect same GitHub repository
3. Name: `fundimatch-frontend`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`

### Step 2: Frontend Environment Variables
```
VITE_API_BASE=https://fundimatch-api.onrender.com/api
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

### Step 3: Routing Configuration
Add redirect rules for React Router:
- Source: `/*`
- Destination: `/index.html`
- Action: `Rewrite`

## 🔑 Google Authentication Setup

### Update Firebase Configuration
1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your Render domains:
   - `fundimatch-frontend.onrender.com`
   - `fundimatch-api.onrender.com`

### Update Google Cloud Console
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add authorized origins:
   - `https://fundimatch-frontend.onrender.com`
4. Add authorized redirect URIs:
   - `https://fundimatch-frontend.onrender.com`

## 📦 Using render.yaml (Recommended)

We've already created a `render.yaml` file for you! This automates the entire deployment:

### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: prepare for Render deployment"
git push origin main
```

### Step 2: Connect to Render
1. Render Dashboard → "New" → "Blueprint"
2. Connect your GitHub repository
3. Select `render.yaml`
4. Click "Apply"

### Step 3: Set Secret Environment Variables
After deployment, manually set these in each service:
- `GOOGLE_CLIENT_ID` (Backend)
- `VITE_FIREBASE_API_KEY` (Frontend)

## 🔄 Database Migration

### Initialize Database Tables
Your Flask app will create tables automatically on first run, but you can also:

```bash
# Local test first
python flask_backend_template.py

# Or create a migration script
python -c "
from flask_backend_template import app, db
with app.app_context():
    db.create_all()
    print('Tables created successfully!')
"
```

## 🚀 Deployment URLs

After successful deployment:
- **API**: `https://fundimatch-api.onrender.com`
- **Frontend**: `https://fundimatch-frontend.onrender.com`
- **Health Check**: `https://fundimatch-api.onrender.com/api/health`

## 🔧 Production Benefits

### vs Local Development:
- ✅ **Real Database** - PostgreSQL instead of SQLite
- ✅ **HTTPS** - Secure connections
- ✅ **Auto-scaling** - Handles traffic spikes
- ✅ **Monitoring** - Built-in logs and metrics
- ✅ **Custom Domain** - Can add your own domain later

### Performance:
- ✅ **CDN** - Fast static asset delivery
- ✅ **Caching** - Automatic HTTP caching
- ✅ **Compression** - Gzip enabled by default

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check `requirements.txt` has all dependencies
   - Verify Python version compatibility

2. **Database Connection Issues**
   - Ensure DATABASE_URL is correctly set
   - Check PostgreSQL service is running

3. **CORS Errors**
   - Verify frontend URL in Flask CORS configuration
   - Check environment variables are set correctly

4. **Google Auth Fails**
   - Verify authorized domains in Firebase/Google Cloud
   - Check GOOGLE_CLIENT_ID is set correctly

## 💡 Next Steps

1. **Custom Domain** - Add your own domain name
2. **Monitoring** - Set up alerts for downtime
3. **Backups** - Configure database backups
4. **Scaling** - Upgrade to paid plans for more resources

## 🎯 Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] PostgreSQL database created
- [ ] Backend service deployed with environment variables
- [ ] Frontend static site deployed with environment variables
- [ ] Google/Firebase domains updated
- [ ] Health checks passing
- [ ] Test authentication flow
- [ ] Test API endpoints

Ready to deploy? The render.yaml file makes it super easy! 🚀
