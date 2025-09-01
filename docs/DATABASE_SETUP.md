# 🗄️ FundiMatch Database Setup Guide

This guide ensures your database is properly configured and working for both the CLI and web application.

## 📊 Database Architecture

FundiMatch uses a **dual database system**:
- **CLI Application**: SQLite database (`fundimatch.db`) with SQLAlchemy ORM
- **Web Application**: JSON Server (`db.json`) for RESTful API

## 🔧 Database Setup Steps

### 1. CLI Database (SQLite)

#### Install Dependencies
```bash
# Install Python dependencies
pipenv install

# Activate virtual environment
pipenv shell
```

#### Initialize Database
```bash
# Run the seeding script to create tables and populate data
pipenv run python lib/db/seed.py
```

#### Test CLI Database
```bash
# Run the CLI application
pipenv run python lib/main.py
```

**Expected Output:**
```
🚀 FundiMatch CLI - Database Seeding Tool
==================================================

1️⃣ Creating default admin user...
✅ Admin user already exists

2️⃣ Seeding database with db.json data...
🌱 Starting database seeding process...
✅ Database seeding completed successfully!

📊 Summary:
  👥 Users: 7
  🛠️ Fundis: 4
  📂 Categories: 5
  📋 Jobs: 3
  ⭐ Reviews: 2
  💰 Payments: 2
```

### 2. Web Application Database (JSON Server)

#### Install JSON Server
```bash
# Install JSON Server globally
npm install -g json-server
```

#### Start JSON Server
```bash
# Start JSON Server on port 3001
npx json-server --watch db.json --port 3001
```

**Expected Output:**
```
  \{^_^}/ hi!

  Loading db.json
  Done

  Resources
  http://localhost:3001/users
  http://localhost:3001/fundis
  http://localhost:3001/bookings
  http://localhost:3001/reviews
  http://localhost:3001/payments
  http://localhost:3001/categories

  Home
  http://localhost:3001

  Type s + enter at any time to create a snapshot of the database
```

#### Test Web Database
```bash
# Test API endpoints
curl http://localhost:3001/users
curl http://localhost:3001/fundis
curl http://localhost:3001/bookings
```

### 3. Frontend Development Server

#### Start React Development Server
```bash
# Start the React development server
npm run dev
```

**Expected Output:**
```
  VITE v7.1.2  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## 🔐 Login Credentials

### CLI Application
- **Admin**: `admin@fundi.com` / `admin123`
- **Client**: `test@example.com` / `password123`
- **Fundi**: `fundi@example.com` / `fundi123`

### Web Application
- **Admin**: `admin@fundi.com` / `admin123@#`
- **Client**: `test@example.com` / `password123@#`
- **Fundi**: `fundi@example.com` / `fundi123@#`

## 🚀 Complete Startup Sequence

### Option 1: Manual Startup
```bash
# Terminal 1: Start JSON Server
npx json-server --watch db.json --port 3001

# Terminal 2: Start React Development Server
npm run dev

# Terminal 3: Run CLI (optional)
pipenv run python lib/main.py
```

### Option 2: Automated Startup Script
```bash
# Create startup script
cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting FundiMatch Application..."

# Start JSON Server in background
echo "📊 Starting JSON Server..."
npx json-server --watch db.json --port 3001 &
JSON_SERVER_PID=$!

# Wait a moment for JSON Server to start
sleep 2

# Start React Development Server
echo "🌐 Starting React Development Server..."
npm run dev &
REACT_PID=$!

echo "✅ All services started!"
echo "📊 JSON Server: http://localhost:3001"
echo "🌐 React App: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
wait

# Cleanup on exit
echo "🛑 Stopping services..."
kill $JSON_SERVER_PID $REACT_PID 2>/dev/null
echo "👋 Goodbye!"
EOF

# Make executable and run
chmod +x start-all.sh
./start-all.sh
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Database File Not Found
```bash
# Check if database files exist
ls -la lib/db/fundimatch.db
ls -la db.json

# If missing, run seeding script
pipenv run python lib/db/seed.py
```

#### 2. Port Already in Use
```bash
# Check what's using port 3001
lsof -i :3001

# Kill process if needed
kill -9 <PID>

# Or use different port
npx json-server --watch db.json --port 3002
```

#### 3. Python Dependencies Missing
```bash
# Reinstall dependencies
pipenv --rm
pipenv install
```

#### 4. Node Modules Missing
```bash
# Reinstall node modules
rm -rf node_modules package-lock.json
npm install
```

### Database Verification

#### Check CLI Database
```bash
# Verify SQLite database
sqlite3 lib/db/fundimatch.db ".tables"
sqlite3 lib/db/fundimatch.db "SELECT COUNT(*) FROM users;"
```

#### Check Web Database
```bash
# Verify JSON Server is running
curl http://localhost:3001/users | jq length
curl http://localhost:3001/fundis | jq length
```

## 📁 Database Files

### SQLite Database (CLI)
- **Location**: `lib/db/fundimatch.db`
- **Schema**: Defined in `lib/db/models.py`
- **Seeding**: `lib/db/seed.py`

### JSON Database (Web)
- **Location**: `db.json`
- **Schema**: JSON structure
- **API**: RESTful endpoints via JSON Server

## 🔄 Data Synchronization

The CLI and web applications use separate databases but can share data:

### CLI → Web
```bash
# Export CLI data to JSON
pipenv run python lib/helpers.py export_data
```

### Web → CLI
```bash
# Import JSON data to CLI
pipenv run python lib/db/seed.py
```

## 🛡️ Security Notes

- **CLI Database**: Local SQLite file, no network access required
- **Web Database**: JSON Server for development only
- **Production**: Use proper database (PostgreSQL, MySQL) with authentication
- **Environment Variables**: Keep API config in `.env` file

## ✅ Verification Checklist

- [ ] SQLite database created (`lib/db/fundimatch.db`)
- [ ] Database seeded with sample data
- [ ] CLI application runs without errors
- [ ] JSON Server starts on port 3001
- [ ] React development server starts on port 5173
- [ ] API endpoints respond correctly
- [ ] Login credentials work for all user types
- [ ] Database files are in `.gitignore`

## 🆘 Getting Help

If you encounter issues:

1. **Check logs**: Look for error messages in terminal output
2. **Verify ports**: Ensure no conflicts on ports 3001 and 5173
3. **Reinstall dependencies**: Clean install of Python and Node dependencies
4. **Reset databases**: Delete and recreate database files
5. **Check environment**: Ensure all environment variables are set

---

**🎉 Your database is now ready to use!** Both the CLI and web application should be fully functional with proper data persistence.
