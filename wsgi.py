# wsgi.py at repo root
try:
    # Preferred: app factory
    from flask_backend_template import create_app
    app = create_app()
except ImportError:
    # Fallback: direct app object inside the same module
    from flask_backend_template import app  # must be a Flask instance named "app"

# SECURITY: Ensure app is available at module level for gunicorn
if 'app' not in locals():
    # If neither import worked, create a minimal app
    from flask import Flask
    app = Flask(__name__)
    @app.route('/')
    def health():
        return {'status': 'error', 'message': 'Failed to import main app'}

if __name__ == "__main__":
    app.run()
