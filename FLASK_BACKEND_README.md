# 🐍 FundiMatch Flask Backend Setup

This guide explains how to transition from JSON Server to a proper Flask backend for your FundiMatch application.

## 🎯 **Why Flask Backend?**

### **Current Setup (Development):**
```
🌐 React App → 📄 db.json (JSON Server) → 🗄️ SQLite (CLI)
```

### **Future Setup (Production):**
```
🌐 React App → 🐍 Flask API → 🗄️ PostgreSQL/MySQL
```

## 🚀 **Quick Start**

### **1. Install Flask Dependencies**
```bash
# Install Flask requirements
pip install -r requirements.txt

# Or use pipenv
pipenv install -r requirements.txt
```

### **2. Run Flask Backend**
```bash
# Development mode
python flask_backend_template.py

# Or with pipenv
pipenv run python flask_backend_template.py
```

### **3. Update Frontend Configuration**
```bash
# Change environment to production
# Edit src/config/api.js and set environment to 'production'
```

## 📊 **API Endpoints**

The Flask backend provides the same endpoints as JSON Server:

### **Users**
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

### **Fundis**
- `GET /api/fundis` - Get all fundis
- `POST /api/fundis` - Create new fundi

### **Bookings/Jobs**
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking

### **Categories**
- `GET /api/categories` - Get all categories

### **Reviews**
- `GET /api/reviews` - Get all reviews

### **Payments**
- `GET /api/payments` - Get all payments

### **Authentication**
- `POST /api/auth/login` - User login

### **Health Check**
- `GET /api/health` - API health status

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Database configuration
DATABASE_URL=postgresql://user:password@localhost:5432/fundimatch

# Security
SECRET_KEY=your-secret-key-here

# Environment
FLASK_ENV=production
```

### **Database Setup**
```bash
# Create database tables
python -c "
from flask_backend_template import app, db
with app.app_context():
    db.create_all()
    print('Database tables created!')
"
```

## 🚀 **Deployment on Render**

### **1. Connect to Render**
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service

### **2. Configure Service**
- **Name**: `fundimatch-api`
- **Environment**: `Python`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn flask_backend_template:app`

### **3. Environment Variables**
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/fundimatch
SECRET_KEY=your-generated-secret-key
FLASK_ENV=production
```

### **4. Deploy**
- Render will automatically deploy when you push to main
- Check the deployment logs for any issues

## 🔄 **Migration from JSON Server**

### **Step 1: Test Flask Backend Locally**
```bash
# Start Flask backend
python flask_backend_template.py

# Test endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/users
```

### **Step 2: Update Frontend Configuration**
```javascript
// src/config/api.js
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3001',  // JSON Server
  },
  production: {
    baseURL: 'http://localhost:5000/api',  // Flask (local)
  }
};
```

### **Step 3: Test Frontend with Flask**
```bash
# Start Flask backend
python flask_backend_template.py

# Start React app
npm run dev

# Test registration/login in React app
```

### **Step 4: Deploy to Production**
```bash
# Update production URL in config
baseURL: 'https://your-flask-api.onrender.com/api'

# Deploy to Render
git add .
git commit -m "Add Flask backend"
git push origin main
```

## 🗄️ **Database Migration**

### **From SQLite to PostgreSQL**
```bash
# Export data from SQLite
python -c "
from lib.db.models import *
from lib.db.models import get_session
import json

session = get_session()
users = session.query(User).all()
data = [{'id': u.id, 'username': u.username, 'email': u.email} for u in users]
print(json.dumps(data, indent=2))
"

# Import to PostgreSQL (via Flask API)
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123","phone":"+254700000000","role":"client"}'
```

## 🔐 **Security Considerations**

### **Password Hashing**
```python
# In production, hash passwords
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt(app)

# Hash password before saving
hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

# Verify password
is_valid = bcrypt.check_password_hash(hashed_password, password)
```

### **JWT Authentication**
```python
# Add JWT tokens for authentication
import jwt
from datetime import datetime, timedelta

def create_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
```

## 🧪 **Testing**

### **API Testing**
```bash
# Test all endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/users
curl http://localhost:5000/api/fundis
curl http://localhost:5000/api/bookings
```

### **Frontend Testing**
1. Start Flask backend: `python flask_backend_template.py`
2. Start React app: `npm run dev`
3. Test registration and login
4. Test all CRUD operations

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Port Already in Use**
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
export PORT=5001
python flask_backend_template.py
```

#### **Database Connection Issues**
```bash
# Check database URL
echo $DATABASE_URL

# Test database connection
python -c "
from flask_backend_template import app, db
with app.app_context():
    try:
        db.engine.connect()
        print('Database connection successful!')
    except Exception as e:
        print(f'Database connection failed: {e}')
"
```

#### **CORS Issues**
```python
# Ensure CORS is properly configured
from flask_cors import CORS
CORS(app, origins=['http://localhost:5173', 'https://your-frontend-domain.com'])
```

## 📈 **Performance Optimization**

### **Database Optimization**
```python
# Add database indexes
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, index=True)  # Add index
    username = db.Column(db.String(100), index=True)  # Add index
```

### **Caching**
```python
# Add Redis caching for better performance
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'redis'})

@app.route('/api/users')
@cache.cached(timeout=300)  # Cache for 5 minutes
def get_users():
    # Your code here
    pass
```

## 🎉 **Next Steps**

1. **Test Flask backend locally**
2. **Update frontend configuration**
3. **Deploy to Render**
4. **Set up PostgreSQL database**
5. **Add authentication and security**
6. **Optimize performance**

---

**🚀 Your Flask backend is ready!** 

This setup provides a solid foundation for your production FundiMatch application with proper database management, security, and scalability.
