# 🔄 FundiMatch Automated Database Sync Guide

This guide explains how to set up and use the **automated database synchronization** system that eliminates the need for manual sync between your web application and CLI database.

## 🎯 What is Auto-Sync?

The auto-sync system automatically detects changes in your `db.json` file and syncs them to your SQLite database (CLI) without any manual intervention.

### 🔄 Before vs After

**Before (Manual Sync):**
```
🌐 Add data via React → 📄 db.json updated → 🔄 Manual: pipenv run python lib/db/seed.py → 🗄️ SQLite updated
```

**After (Auto-Sync):**
```
🌐 Add data via React → 📄 db.json updated → ⚡ Auto-sync detects change → 🗄️ SQLite updated automatically
```

## 🚀 Quick Start

### Option 1: Use the Auto-Sync Startup Script (Recommended)

```bash
# Start everything with auto-sync
./start-auto-sync.sh
```

This will start:
- ✅ JSON Server (port 3001)
- ✅ Auto-sync watcher (Python)
- ✅ React Development Server (port 5173)

### Option 2: Manual Setup

```bash
# Terminal 1: Start JSON Server
npx json-server --watch db.json --port 3001

# Terminal 2: Start Auto-Sync
pipenv run python lib/db/auto_sync.py --watch --interval 3

# Terminal 3: Start React App
npm run dev
```

## 🔧 Auto-Sync Commands

### Start Auto-Sync Watcher
```bash
# Watch for changes every 3 seconds
pipenv run python lib/db/auto_sync.py --watch --interval 3

# Watch for changes every 5 seconds (default)
pipenv run python lib/db/auto_sync.py --watch

# Watch for changes every 1 second (fast sync)
pipenv run python lib/db/auto_sync.py --watch --interval 1
```

### Single Sync Operation
```bash
# Perform one-time sync
pipenv run python lib/db/auto_sync.py --sync
```

### Custom Configuration
```bash
# Use custom db.json path
pipenv run python lib/db/auto_sync.py --watch --db-json /path/to/db.json

# Combine options
pipenv run python lib/db/auto_sync.py --watch --interval 2 --db-json ./db.json
```

## 📊 How It Works

### 1. File Change Detection
- Auto-sync calculates MD5 hash of `db.json`
- Compares with previous hash
- Triggers sync when hash changes

### 2. Automatic Sync Process
```
🔄 Change detected in db.json
    ↓
🧹 Clear existing SQLite data
    ↓
📂 Create categories from JSON
    ↓
👥 Create users from JSON
    ↓
🛠️ Create fundi profiles from JSON
    ↓
📋 Create jobs from JSON
    ↓
✅ Commit all changes to SQLite
```

### 3. Logging and Monitoring
- All sync operations are logged to `auto_sync.log`
- Console output shows sync progress
- Error handling and recovery

## 🧪 Testing Auto-Sync

### Test 1: Add User via Web Interface
```bash
# Add a new user through API
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "username":"test_user",
    "email":"test@example.com",
    "password":"test123",
    "phone":"+254700000000",
    "role":"client",
    "created_at":"2024-08-30T12:00:00.000Z",
    "is_active":true
  }'

# Check if auto-sync picked it up
sqlite3 lib/db/fundimatch.db "SELECT COUNT(*) FROM users;"
```

### Test 2: Add Data via React App
1. Open your React app at `http://localhost:5173`
2. Register a new user or add data
3. Check CLI database for automatic sync

### Test 3: Monitor Sync Logs
```bash
# Watch sync logs in real-time
tail -f auto_sync.log

# Check recent sync activity
tail -20 auto_sync.log
```

## 📈 Performance and Configuration

### Sync Intervals
- **1 second**: Fast sync, high CPU usage
- **3 seconds**: Balanced (recommended)
- **5 seconds**: Conservative, low CPU usage
- **10+ seconds**: Very conservative

### Memory Usage
- Auto-sync uses minimal memory (~10-20MB)
- File watching is efficient
- No database locks during sync

### Error Handling
- Automatic retry on sync failures
- Logging of all errors
- Graceful degradation
- No data loss protection

## 🔍 Troubleshooting

### Auto-Sync Not Working
```bash
# Check if auto-sync is running
ps aux | grep auto_sync

# Check logs for errors
tail -50 auto_sync.log

# Restart auto-sync
pkill -f auto_sync
pipenv run python lib/db/auto_sync.py --watch
```

### Sync Not Detecting Changes
```bash
# Check file permissions
ls -la db.json

# Check file hash manually
md5 db.json

# Restart with verbose logging
pipenv run python lib/db/auto_sync.py --watch --interval 1
```

### Database Lock Issues
```bash
# Check if CLI is using database
lsof lib/db/fundimatch.db

# Kill any processes using the database
pkill -f "sqlite3.*fundimatch.db"
```

## 🛡️ Security Considerations

### File Permissions
```bash
# Ensure db.json is readable
chmod 644 db.json

# Ensure auto_sync.py is executable
chmod +x lib/db/auto_sync.py
```

### Environment Variables
- Auto-sync uses the same environment as CLI
- No additional credentials needed
- Uses local file system only

### Production Considerations
- Auto-sync is for development only
- Use proper database replication in production
- Consider using database triggers for real-time sync

## 📋 Best Practices

### 1. Development Workflow
```bash
# Start all services with auto-sync
./start-auto-sync.sh

# Add data through React app
# Auto-sync automatically updates CLI database
# Use CLI for data analysis and management
```

### 2. Monitoring
```bash
# Monitor sync activity
tail -f auto_sync.log

# Check sync status
sqlite3 lib/db/fundimatch.db "SELECT COUNT(*) FROM users;"
curl http://localhost:3001/users | grep username | wc -l
```

### 3. Backup and Recovery
```bash
# Backup before major changes
cp db.json db.json.backup
cp lib/db/fundimatch.db lib/db/fundimatch.db.backup

# Restore if needed
cp db.json.backup db.json
cp lib/db/fundimatch.db.backup lib/db/fundimatch.db
```

## 🎉 Benefits of Auto-Sync

### ✅ **No More Manual Sync**
- Eliminates `pipenv run python lib/db/seed.py`
- Automatic detection of changes
- Real-time synchronization

### ✅ **Seamless Development**
- Add data via web → instantly available in CLI
- No interruption to workflow
- Consistent data across applications

### ✅ **Reliable and Fast**
- File-based change detection
- Efficient sync algorithms
- Error recovery and logging

### ✅ **Easy to Use**
- Simple startup script
- Configurable sync intervals
- Clear logging and monitoring

## 🚀 Next Steps

1. **Start using auto-sync**: `./start-auto-sync.sh`
2. **Test the system**: Add data via web interface
3. **Monitor logs**: `tail -f auto_sync.log`
4. **Customize settings**: Adjust sync intervals as needed

---

**🎉 Congratulations! Your database now syncs automatically!** 

No more manual sync commands needed. Just add data through your React app and it will automatically appear in your CLI database! 🚀
