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
from flask_bcrypt import Bcrypt
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from marshmallow import Schema, fields, validate, ValidationError
from datetime import datetime, timedelta
import os
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

# Initialize Flask app
app = Flask(__name__)

# Configuration
database_url = os.environ.get('DATABASE_URL', 'sqlite:///fundimatch.db')
# Fix for Render's PostgreSQL URL format
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# SECURITY: Must set SECRET_KEY environment variable in production
secret_key = os.environ.get('SECRET_KEY')
if not secret_key:
    if os.environ.get('FLASK_ENV') == 'production':
        raise ValueError("SECRET_KEY environment variable must be set in production")
    else:
        secret_key = 'dev-secret-key-change-in-production'
app.config['SECRET_KEY'] = secret_key

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# SECURITY: Add security headers
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

# SECURITY: Error handling middleware
@app.errorhandler(ValidationError)
def handle_validation_error(error):
    return jsonify({'error': 'Validation Error', 'details': error.messages}), 400

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad Request', 'message': str(error)}), 400

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal Server Error'}), 500

# SECURITY: Configure CORS for production
allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')
CORS(app, origins=allowed_origins)

# SECURITY: Input validation schemas
class UserSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=100))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8))
    phone = fields.Str(required=True, validate=validate.Regexp(r'^\+?[1-9]\d{1,14}$'))
    role = fields.Str(required=True, validate=validate.OneOf(['admin', 'client', 'fundi']))

class FundiSchema(Schema):
    specialization = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    experience = fields.Str(required=True, validate=validate.Length(min=2, max=50))
    hourly_rate = fields.Float(required=True, validate=validate.Range(min=0))
    location = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    bio = fields.Str(allow_none=True, validate=validate.Length(max=1000))

class JobSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=5, max=200))
    description = fields.Str(required=True, validate=validate.Length(min=10, max=2000))
    location = fields.Str(required=True, validate=validate.Length(min=2, max=200))
    budget = fields.Float(allow_none=True, validate=validate.Range(min=0))
    hourly_rate = fields.Float(allow_none=True, validate=validate.Range(min=0))

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

# Notification model
class Notification(db.Model):
    __tablename__ = "notifications"
    
    id = db.Column(db.Integer, primary_key=True, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # fundi_registered, job_created, job_assigned, status_changed
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    user = db.relationship("User")

# Notification helpers
def notify_admins_of_new_fundi(new_fundi):
    admins = User.query.filter_by(role='admin', is_active=True).all()
    for admin in admins:
        n = Notification(
            user_id=admin.id,
            title="New Fundi Registration",
            message=f"New fundi {new_fundi.user.username} ({new_fundi.specialization}) in {new_fundi.location}",
            type="fundi_registered"
        )
        db.session.add(n)
    db.session.commit()

def notify_clients_of_new_fundi(new_fundi):
    clients = User.query.filter_by(role='client', is_active=True).all()
    for client in clients:
        n = Notification(
            user_id=client.id,
            title="New Fundi Available",
            message=f"{new_fundi.specialization} fundi available in {new_fundi.location}",
            type="fundi_available"
        )
        db.session.add(n)
    db.session.commit()

def notify_on_job_created(job):
    admins = User.query.filter_by(role='admin', is_active=True).all()
    for admin in admins:
        n = Notification(
            user_id=admin.id,
            title="New Job Created",
            message=f"Job '{job.title}' created by client #{job.client_id}",
            type="job_created"
        )
        db.session.add(n)
    db.session.commit()

def notify_on_job_assigned(job):
    targets = []
    if job.fundi_id:
        fundi = Fundi.query.get(job.fundi_id)
        if fundi:
            targets.append(fundi.user_id)
    targets.append(job.client_id)
    for uid in targets:
        n = Notification(
            user_id=uid,
            title="Job Assigned",
            message=f"Job '{job.title}' assigned to fundi #{job.fundi_id}",
            type="job_assigned"
        )
        db.session.add(n)
    db.session.commit()

def notify_on_status_change(job):
    targets = [job.client_id]
    if job.fundi_id:
        fundi = Fundi.query.get(job.fundi_id)
        if fundi:
            targets.append(fundi.user_id)
    for uid in targets:
        n = Notification(
            user_id=uid,
            title="Job Status Updated",
            message=f"Job '{job.title}' is now {job.status}",
            type="status_changed"
        )
        db.session.add(n)
    db.session.commit()

# API Routes
# ==========

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users"""
    try:
        role = request.args.get('role')
        q = User.query
        if role:
            q = q.filter_by(role=role)
        users = q.all()
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
@limiter.limit("10 per minute")
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        
        # SECURITY: Validate input data
        schema = UserSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as e:
            return jsonify({'error': 'Validation Error', 'details': e.messages}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=validated_data['email']).first()
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400
        
        # SECURITY: Hash password before storing
        hashed_password = bcrypt.generate_password_hash(validated_data['password']).decode('utf-8')
        
        # Create new user
        new_user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            password=hashed_password,  # ✅ SECURE: Hashed password
            phone=validated_data['phone'],
            role=validated_data.get('role', 'client'),
            is_active=validated_data.get('is_active', True)
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
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/fundis', methods=['GET'])
def get_fundis():
    """Get all fundis"""
    try:
        is_available = request.args.get('is_available')
        specialization = request.args.get('specialization')
        location = request.args.get('location')

        q = Fundi.query
        if is_available is not None:
            q = q.filter(Fundi.is_available == (is_available.lower() == 'true'))
        if specialization:
            q = q.filter(Fundi.specialization.ilike(f"%{specialization}%"))
        if location:
            q = q.filter(Fundi.location.ilike(f"%{location}%"))

        fundis = q.all()
        return jsonify([{
            'id': fundi.id,
            'user_id': fundi.user_id,
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
@limiter.limit("10 per minute")
def create_fundi():
    """Create a new fundi"""
    try:
        data = request.get_json()
        
        # SECURITY: Validate user data
        user_schema = UserSchema()
        try:
            validated_user_data = user_schema.load({
                'username': data['username'],
                'email': data['email'],
                'password': data['password'],
                'phone': data['phone'],
                'role': 'fundi'
            })
        except ValidationError as e:
            return jsonify({'error': 'User Validation Error', 'details': e.messages}), 400
        
        # SECURITY: Validate fundi data
        fundi_schema = FundiSchema()
        try:
            validated_fundi_data = fundi_schema.load({
                'specialization': data['specialization'],
                'experience': data['experience'],
                'hourly_rate': data['hourly_rate'],
                'location': data['location'],
                'bio': data.get('bio', '')
            })
        except ValidationError as e:
            return jsonify({'error': 'Fundi Validation Error', 'details': e.messages}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=validated_user_data['email']).first()
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400
        
        # SECURITY: Hash password before storing
        hashed_password = bcrypt.generate_password_hash(validated_user_data['password']).decode('utf-8')
        
        # Create user first
        new_user = User(
            username=validated_user_data['username'],
            email=validated_user_data['email'],
            password=hashed_password,  # ✅ SECURE: Hashed password
            phone=validated_user_data['phone'],
            role='fundi',
            is_active=True
        )
        db.session.add(new_user)
        db.session.commit()
        
        # Create fundi profile
        new_fundi = Fundi(
            user_id=new_user.id,
            specialization=validated_fundi_data['specialization'],
            experience=validated_fundi_data['experience'],
            hourly_rate=validated_fundi_data['hourly_rate'],
            location=validated_fundi_data['location'],
            bio=validated_fundi_data.get('bio', ''),
            rating=data.get('rating', 0.0),
            is_available=data.get('is_available', True)
        )
        
        db.session.add(new_fundi)
        db.session.commit()

        # Trigger notifications
        notify_admins_of_new_fundi(new_fundi)
        notify_clients_of_new_fundi(new_fundi)
        
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
        client_id = request.args.get('client_id', type=int)
        fundi_id = request.args.get('fundi_id', type=int)
        status = request.args.get('status')

        q = Job.query
        if client_id:
            q = q.filter(Job.client_id == client_id)
        if fundi_id:
            q = q.filter(Job.fundi_id == fundi_id)
        if status:
            q = q.filter(Job.status == status)

        jobs = q.all()
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

        # Notify admins on job creation
        notify_on_job_created(new_job)

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

@app.route('/api/bookings/<int:job_id>/assign', methods=['PUT'])
def assign_booking(job_id):
    """Assign a job to a fundi"""
    try:
        data = request.get_json()
        fundi_id = data.get('fundi_id')
        job = Job.query.get_or_404(job_id)
        job.fundi_id = fundi_id
        job.status = 'assigned'
        db.session.commit()
        notify_on_job_assigned(job)
        return jsonify({'success': True})
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

@app.route('/api/bookings/<int:job_id>/status', methods=['PUT'])
def update_booking_status(job_id):
    """Update job status"""
    try:
        data = request.get_json()
        status = data.get('status')
        job = Job.query.get_or_404(job_id)
        job.status = status
        if status == 'completed':
            job.completed_at = datetime.utcnow()
        db.session.commit()
        notify_on_status_change(job)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notifications/<int:user_id>', methods=['GET'])
def get_user_notifications(user_id):
    """Get unread notifications for a user"""
    try:
        notifs = Notification.query.filter_by(user_id=user_id, is_read=False).order_by(Notification.created_at.desc()).all()
        return jsonify([{
            'id': n.id,
            'title': n.title,
            'message': n.message,
            'type': n.type,
            'is_read': n.is_read,
            'created_at': n.created_at.isoformat()
        } for n in notifs])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notifications/<int:notif_id>/read', methods=['PUT'])
def mark_notification_as_read(notif_id):
    try:
        n = Notification.query.get_or_404(notif_id)
        n.is_read = True
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/<role>/<int:user_id>', methods=['GET'])
def get_dashboard_data(role, user_id):
    """Role-based dashboard datasets"""
    try:
        if role == 'admin':
            totals = {
                'clients': User.query.filter_by(role='client').count(),
                'fundis': User.query.filter_by(role='fundi').count(),
                'admins': User.query.filter_by(role='admin').count(),
                'jobs_pending': Job.query.filter_by(status='pending').count(),
                'jobs_assigned': Job.query.filter_by(status='assigned').count(),
                'jobs_completed': Job.query.filter_by(status='completed').count()
            }
            latest_users = User.query.order_by(User.created_at.desc()).limit(5).all()
            latest_jobs = Job.query.order_by(Job.created_at.desc()).limit(5).all()
            return jsonify({
                'totals': totals,
                'latest_users': [{'id': u.id, 'username': u.username, 'role': u.role} for u in latest_users],
                'latest_jobs': [{'id': j.id, 'title': j.title, 'status': j.status} for j in latest_jobs]
            })
        elif role == 'client':
            available_fundis = Fundi.query.filter_by(is_available=True).order_by(Fundi.rating.desc()).limit(10).all()
            my_jobs = Job.query.filter_by(client_id=user_id).order_by(Job.created_at.desc()).limit(10).all()
            return jsonify({
                'available_fundis': [{'id': f.id, 'username': f.user.username, 'specialization': f.specialization, 'location': f.location, 'rating': f.rating} for f in available_fundis],
                'my_jobs': [{'id': j.id, 'title': j.title, 'status': j.status} for j in my_jobs]
            })
        elif role == 'fundi':
            my_profile = Fundi.query.filter_by(user_id=user_id).first()
            my_jobs = Job.query.filter_by(fundi_id=my_profile.id).order_by(Job.created_at.desc()).limit(10).all() if my_profile else []
            matching_jobs = Job.query.filter_by(status='pending').all()
            if my_profile:
                matching_jobs = [j for j in matching_jobs if (my_profile.location.lower() in j.location.lower())]
            return jsonify({
                'my_jobs': [{'id': j.id, 'title': j.title, 'status': j.status} for j in my_jobs],
                'matching_jobs': [{'id': j.id, 'title': j.title, 'status': j.status, 'location': j.location} for j in matching_jobs[:10]]
            })
        else:
            return jsonify({'error': 'Invalid role'}), 400
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

# Authentication endpoints
@app.route('/api/auth/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    """User login"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'error': 'Email and password required'}), 400
        
        # SECURITY: Find user by email only (don't expose password in query)
        user = User.query.filter_by(email=email).first()
        
        if user and user.is_active:
            # SECURITY: Verify password hash
            if bcrypt.check_password_hash(user.password, password):
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
        
        # SECURITY: Don't reveal which field is invalid
        return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/google', methods=['POST'])
@limiter.limit("10 per minute")
def google_auth():
    """Google Sign-In verification and user sync"""
    try:
        data = request.get_json()
        id_token_str = data.get('idToken')
        
        if not id_token_str:
            return jsonify({'error': 'ID token required'}), 400
        
        # Verify the Google ID token
        try:
            # SECURITY: Get Google Client ID from environment
            client_id = os.environ.get('GOOGLE_CLIENT_ID')
            if not client_id:
                return jsonify({'error': 'Google Client ID not configured'}), 500
            
            idinfo = id_token.verify_oauth2_token(
                id_token_str, 
                google_requests.Request(), 
                client_id
            )
            
            # ID token is valid. Get the user's Google Account ID from the decoded token.
            google_user_id = idinfo['sub']
            email = idinfo['email']
            name = idinfo.get('name', email)
            
        except ValueError:
            # Invalid token
            return jsonify({'error': 'Invalid Google token'}), 401
        
        # Check if user exists in our database
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # SECURITY: Create new user from Google account with secure password
            secure_password = bcrypt.generate_password_hash(os.urandom(32).hex()).decode('utf-8')
            user = User(
                username=name,
                email=email,
                password=secure_password,  # ✅ SECURE: Random secure password for Google users
                phone='',
                role='client',
                is_active=True
            )
            db.session.add(user)
            db.session.commit()
        
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

def create_app():
    """Application factory pattern for deployment"""
    return app

# For production deployment
application = app

if __name__ == '__main__':
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Run the app
    port = int(os.environ.get('PORT', 5000))
    # SECURITY: Disable debug mode in production
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
