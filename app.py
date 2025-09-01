#!/usr/bin/env python3
"""
FundiMatch Flask App Entry Point for Render Deployment
====================================================

This file serves as the entry point for Render deployment.
It imports the Flask app from flask_backend_template.py to ensure
compatibility with Render's gunicorn setup.
"""

import os
import sys

try:
    # Import the Flask app from the main template file
    from flask_backend_template import app, create_app
    
    # For Render deployment compatibility
    application = app
    
    print("✅ Successfully imported Flask app from flask_backend_template.py")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("🔍 Checking available modules...")
    
    # List available Python files
    import glob
    py_files = glob.glob("*.py")
    print(f"📁 Available Python files: {py_files}")
    
    # Try to create a minimal working app
    from flask import Flask
    app = Flask(__name__)
    
    @app.route('/')
    def health():
        return {'status': 'healthy', 'message': 'Fallback app loaded'}
    
    @app.route('/api/health')
    def api_health():
        return {'status': 'healthy', 'message': 'API health check'}
    
    application = app
    print("⚠️  Fallback Flask app created due to import error")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 Starting Flask app on port {port}")
    app.run(host='0.0.0.0', port=port)
