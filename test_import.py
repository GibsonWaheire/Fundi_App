#!/usr/bin/env python3
"""
Test script to verify Flask app imports work correctly
"""

import sys
import os

print("🔍 Python version:", sys.version)
print("📁 Current directory:", os.getcwd())
print("📋 Available files:", os.listdir('.'))

try:
    print("\n🔄 Attempting to import Flask app...")
    from flask_backend_template import app
    print("✅ SUCCESS: Flask app imported successfully!")
    print(f"📱 App name: {app.name}")
    print(f"🔗 App URL map: {app.url_map}")
    
except ImportError as e:
    print(f"❌ FAILED: Import error - {e}")
    print(f"🔍 Error type: {type(e).__name__}")
    
    # Try to import individual components
    try:
        import flask
        print("✅ Flask package available")
    except ImportError:
        print("❌ Flask package not available")
    
    try:
        import flask_sqlalchemy
        print("✅ Flask-SQLAlchemy available")
    except ImportError:
        print("❌ Flask-SQLAlchemy not available")

print("\n🏁 Import test completed")
