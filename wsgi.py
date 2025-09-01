# wsgi.py at repo root
try:
    # Preferred: app factory
    from flask_backend_template import create_app
    app = create_app()
except ImportError:
    # Fallback: direct app object inside the same module
    from flask_backend_template import app  # must be a Flask instance named "app"

if __name__ == "__main__":
    app.run()
