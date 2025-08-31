#!/usr/bin/env python3
"""
FundiMatch Flask Backend Template
=================================

This is a template for your future Flask backend that will replace JSON Server.
It provides the same API endpoints as JSON Server but with a proper database.

Features:
- RESTful API endpoints
- SQLAlchemy ORM (same as CLI)
- User authentication
- CORS support for React frontend
- Ready for deployment on Render

Author: Gibson Giteru
Class: Moringa School Phase 3
"""

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///fundimatch.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# Initialize extensions
db = SQLAlchemy(app)
CORS(app)  # Enable CORS for React frontend

# Import models (same as CLI)
# We need to redefine the models for Flask-SQLAlchemy
class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True, index=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="client")
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class Fundi(db.Model):
    __tablename__ = "fundis"
    
    id = db.Column(db.Integer, primary_key=True, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    experience = db.Column(db.String(50), nullable=False)
    hourly_rate = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Float, default=0.0, nullable=False)
    total_jobs = db.Column(db.Integer, default=0, nullable=False)
    completed_jobs = db.Column(db.Integer, default=0, nullable=False)
    is_available = db.Column(db.Boolean, default=True, nullable=False)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    user = db.relationship("User", backref="fundi_profile")

class Category(db.Model):
    __tablename__ = "categories"
    
    id = db.Column(db.Integer, primary_key=True, index=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    icon = db.Column(db.String(50), nullable=True)

class Job(db.Model):
    __tablename__ = "jobs"
    
    id = db.Column(db.Integer, primary_key=True, index=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(20), default="pending", nullable=False)
    priority = db.Column(db.String(20), default="medium", nullable=False)
    budget = db.Column(db.Float, nullable=True)
    hourly_rate = db.Column(db.Float, nullable=True)
    estimated_hours = db.Column(db.Float, nullable=True)
    total_amount = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    scheduled_date = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    client_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    fundi_id = db.Column(db.Integer, db.ForeignKey("fundis.id"), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
    
    client = db.relationship("User", foreign_keys=[client_id])
    fundi = db.relationship("Fundi", foreign_keys=[fundi_id])
    category = db.relationship("Category")

class Review(db.Model):
    __tablename__ = "reviews"
    
    id = db.Column(db.Integer, primary_key=True, index=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    fundi_id = db.Column(db.Integer, db.ForeignKey("fundis.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    job = db.relationship("Job", backref="reviews")
    client = db.relationship("User", foreign_keys=[client_id])
    fundi = db.relationship("Fundi", backref="reviews")

class Payment(db.Model):
    __tablename__ = "payments"
    
    id = db.Column(db.Integer, primary_key=True, index=True)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    transaction_id = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(20), default="pending", nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    fundi_id = db.Column(db.Integer, db.ForeignKey("fundis.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    job = db.relationship("Job")
    client = db.relationship("User", foreign_keys=[client_id])
    fundi = db.relationship("Fundi")

# API Routes
# ==========

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users"""
    try:
        users = User.query.all()
        return jsonify([{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'phone': user.phone,
            'role': user.role,
            'is_active': user.is_active,
            'created_at': user.created_at.isoformat()
        } for user in users])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400
        
        # Create new user
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=data['password'],  # In production, hash this!
            phone=data['phone'],
            role=data.get('role', 'client'),
            is_active=data.get('is_active', True)
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Return user without password
        return jsonify({
            'id': new_user.id,
            'username': new_user.username,
            'email': new_user.email,
            'phone': new_user.phone,
            'role': new_user.role,
            'is_active': new_user.is_active,
            'created_at': new_user.created_at.isoformat()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/fundis', methods=['GET'])
def get_fundis():
    """Get all fundis"""
    try:
        fundis = Fundi.query.all()
        return jsonify([{
            'id': fundi.id,
            'username': fundi.user.username,
            'email': fundi.user.email,
            'phone': fundi.user.phone,
            'role': fundi.user.role,
            'specialization': fundi.specialization,
            'experience': fundi.experience,
            'hourly_rate': fundi.hourly_rate,
            'location': fundi.location,
            'bio': fundi.bio,
            'rating': fundi.rating,
            'is_available': fundi.is_available,
            'is_active': fundi.user.is_active,
            'created_at': fundi.created_at.isoformat()
        } for fundi in fundis])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/fundis', methods=['POST'])
def create_fundi():
    """Create a new fundi"""
    try:
        data = request.get_json()
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400
        
        # Create user first
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            phone=data['phone'],
            role='fundi',
            is_active=True
        )
        db.session.add(new_user)
        db.session.commit()
        
        # Create fundi profile
        new_fundi = Fundi(
            user_id=new_user.id,
            specialization=data['specialization'],
            experience=data['experience'],
            hourly_rate=data['hourly_rate'],
            location=data['location'],
            bio=data.get('bio', ''),
            rating=data.get('rating', 0.0),
            is_available=data.get('is_available', True)
        )
        
        db.session.add(new_fundi)
        db.session.commit()
        
        return jsonify({
            'id': new_fundi.id,
            'username': new_user.username,
            'email': new_user.email,
            'phone': new_user.phone,
            'role': new_user.role,
            'specialization': new_fundi.specialization,
            'experience': new_fundi.experience,
            'hourly_rate': new_fundi.hourly_rate,
            'location': new_fundi.location,
            'bio': new_fundi.bio,
            'rating': new_fundi.rating,
            'is_available': new_fundi.is_available,
            'is_active': new_user.is_active,
            'created_at': new_fundi.created_at.isoformat()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    """Get all bookings/jobs"""
    try:
        jobs = Job.query.all()
        return jsonify([{
            'id': job.id,
            'description': job.title,
            'location': job.location,
            'status': job.status,
            'client_id': job.client_id,
            'fundi_id': job.fundi_id,
            'service_type': job.category.name if job.category else 'General',
            'total_amount': job.total_amount,
            'hourly_rate': job.hourly_rate,
            'estimated_hours': job.estimated_hours,
            'created_at': job.created_at.isoformat(),
            'scheduled_date': job.scheduled_date.isoformat() if job.scheduled_date else None
        } for job in jobs])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    """Create a new booking/job"""
    try:
        data = request.get_json()
        
        new_job = Job(
            title=data['description'],
            description=data['description'],
            location=data['location'],
            status='pending',
            priority='medium',
            budget=data.get('total_amount'),
            hourly_rate=data.get('hourly_rate'),
            estimated_hours=data.get('estimated_hours'),
            total_amount=data.get('total_amount'),
            client_id=data['client_id'],
            fundi_id=data.get('fundi_id'),
            category_id=data.get('category_id', 1)  # Default category
        )
        
        db.session.add(new_job)
        db.session.commit()
        
        return jsonify({
            'id': new_job.id,
            'description': new_job.title,
            'location': new_job.location,
            'status': new_job.status,
            'client_id': new_job.client_id,
            'fundi_id': new_job.fundi_id,
            'service_type': new_job.category.name if new_job.category else 'General',
            'total_amount': new_job.total_amount,
            'hourly_rate': new_job.hourly_rate,
            'estimated_hours': new_job.estimated_hours,
            'created_at': new_job.created_at.isoformat(),
            'scheduled_date': new_job.scheduled_date.isoformat() if new_job.scheduled_date else None
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    try:
        categories = Category.query.all()
        return jsonify([{
            'id': category.id,
            'name': category.name,
            'description': category.description,
            'icon': category.icon
        } for category in categories])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    """Get all reviews"""
    try:
        reviews = Review.query.all()
        return jsonify([{
            'id': review.id,
            'rating': review.rating,
            'comment': review.comment,
            'job_id': review.job_id,
            'client_id': review.client_id,
            'fundi_id': review.fundi_id,
            'created_at': review.created_at.isoformat()
        } for review in reviews])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/payments', methods=['GET'])
def get_payments():
    """Get all payments"""
    try:
        payments = Payment.query.all()
        return jsonify([{
            'id': payment.id,
            'amount': payment.amount,
            'payment_method': payment.payment_method,
            'transaction_id': payment.transaction_id,
            'status': payment.status,
            'job_id': payment.job_id,
            'client_id': payment.client_id,
            'fundi_id': payment.fundi_id,
            'created_at': payment.created_at.isoformat()
        } for payment in payments])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Authentication endpoint
@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login"""
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']
        
        # Check users table
        user = User.query.filter_by(email=email, password=password).first()
        
        if user and user.is_active:
            return jsonify({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'phone': user.phone,
                    'role': user.role,
                    'is_active': user.is_active
                }
            })
        
        return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'FundiMatch API is running'})

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Run the app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
