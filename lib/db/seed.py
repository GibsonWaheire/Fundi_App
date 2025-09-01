#!/usr/bin/env python3
"""
FundiMatch CLI - Database Seeding Script
=======================================

This script populates the SQLite database with sample data from db.json.
It creates users, fundis, categories, jobs, reviews, and payments for testing.

Author: Gibson Giteru
Class: Moringa School Phase 3
"""

import json
import os
import sys
from datetime import datetime

# Add the lib directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import get_session, User, Fundi, Category, Job, Review, Payment


def load_json_data():
    """
    Load data from db.json file
    ==========================
    
    This function reads the db.json file and returns the data.
    
    Returns:
        dict: Data from db.json file
    """
    try:
        # Get the path to db.json (two levels up from lib/db/)
        db_json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'db.json')
        
        with open(db_json_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ db.json file not found!")
        return None
    except json.JSONDecodeError:
        print("❌ Invalid JSON in db.json file!")
        return None


def seed_database():
    """
    Seed the database with data from db.json
    =======================================
    
    This function populates the SQLite database with all the data
    from the db.json file, maintaining relationships and data integrity.
    """
    print("🌱 Starting database seeding process...")
    
    # Load data from db.json
    data = load_json_data()
    if not data:
        print("❌ Failed to load data from db.json")
        return False
    
    # Get database session
    session = get_session()
    
    try:
        # Clear existing data (optional - comment out if you want to keep existing data)
        print("🧹 Clearing existing data...")
        session.query(Payment).delete()
        session.query(Review).delete()
        session.query(Job).delete()
        session.query(Fundi).delete()
        session.query(User).delete()
        session.query(Category).delete()
        session.commit()
        print("✅ Existing data cleared")
        
        # Create categories
        print("📂 Creating categories...")
        categories_data = data.get('categories', [])
        categories = {}
        
        for cat_data in categories_data:
            category = Category(
                name=cat_data['name'],
                description=cat_data['description'],
                icon=cat_data['icon']
            )
            session.add(category)
            session.commit()  # Commit to get the ID
            categories[cat_data['name']] = category
            print(f"  ✅ Created category: {category.name}")
        
        # Create users from users array
        print("👥 Creating users...")
        users_data = data.get('users', [])
        users = {}
        
        for user_data in users_data:
            user = User(
                username=user_data['username'],
                email=user_data['email'],
                password=user_data['password'],
                phone=user_data['phone'],
                role=user_data['role'],
                is_active=user_data['is_active'],
                created_at=datetime.fromisoformat(user_data['created_at'].replace('Z', '+00:00'))
            )
            session.add(user)
            session.commit()  # Commit to get the ID
            users[user_data['email']] = user
            print(f"  ✅ Created user: {user.username} ({user.role})")
        
        # Create fundi users from fundis data
        print("👥 Creating fundi users...")
        fundis_data = data.get('fundis', [])
        
        for fundi_data in fundis_data:
            # Check if user already exists
            if fundi_data['email'] not in users:
                user = User(
                    username=fundi_data['username'],
                    email=fundi_data['email'],
                    password=fundi_data['password'],
                    phone=fundi_data['phone'],
                    role=fundi_data['role'],
                    is_active=fundi_data['is_active'],
                    created_at=datetime.fromisoformat(fundi_data['created_at'].replace('Z', '+00:00'))
                )
                session.add(user)
                session.commit()  # Commit to get the ID
                users[fundi_data['email']] = user
                print(f"  ✅ Created fundi user: {user.username} ({user.role})")
        
        # Create fundi profiles
        print("🛠️ Creating fundi profiles...")
        fundis = {}
        
        for fundi_data in fundis_data:
            # Find the corresponding user
            user = users.get(fundi_data['email'])
            if not user:
                print(f"  ⚠️  User not found for fundi: {fundi_data['email']}")
                continue
            
            fundi = Fundi(
                user_id=user.id,
                specialization=fundi_data['specialization'],
                experience=fundi_data['experience'],
                hourly_rate=fundi_data['hourly_rate'],
                location=fundi_data['location'],
                bio=fundi_data['bio'],
                rating=fundi_data['rating'],
                is_available=fundi_data['is_available'],
                created_at=datetime.fromisoformat(fundi_data['created_at'].replace('Z', '+00:00'))
            )
            session.add(fundi)
            session.commit()  # Commit to get the ID
            fundis[fundi_data['email']] = fundi
            print(f"  ✅ Created fundi profile: {user.username} ({fundi.specialization})")
        
        # Create jobs
        print("📋 Creating jobs...")
        jobs_data = data.get('bookings', [])  # Note: bookings in db.json are jobs in CLI
        jobs = {}
        
        for job_data in jobs_data:
            # Find client by ID (map to users)
            client = None
            if job_data['client_id'] == 1:
                client = users.get('test@example.com')
            elif job_data['client_id'] == 2:
                client = users.get('john@example.com')
            
            # Find fundi by ID
            fundi = None
            if job_data.get('fundi_id'):
                fundi_obj = session.query(Fundi).filter(Fundi.id == job_data['fundi_id']).first()
                if fundi_obj:
                    fundi = fundi_obj
            
            # Find category by name
            category = categories.get(job_data['service_type'])
            if not category:
                print(f"  ⚠️  Category not found: {job_data['service_type']}")
                continue
            
            # Map status
            status_mapping = {
                'confirmed': 'assigned',
                'pending': 'pending',
                'completed': 'completed'
            }
            status = status_mapping.get(job_data['status'], 'pending')
            
            job = Job(
                title=job_data['description'],
                description=job_data['description'],
                location=job_data['location'],
                status=status,
                priority='medium',
                budget=job_data.get('total_amount'),
                hourly_rate=job_data.get('hourly_rate'),
                estimated_hours=job_data.get('estimated_hours'),
                total_amount=job_data.get('total_amount'),
                client_id=client.id if client else 1,  # Default to first user if mapping fails
                fundi_id=fundi.id if fundi else None,
                category_id=category.id,
                created_at=datetime.fromisoformat(job_data['created_at'].replace('Z', '+00:00')),
                scheduled_date=datetime.fromisoformat(job_data['scheduled_date'].replace('Z', '+00:00')) if job_data.get('scheduled_date') else None
            )
            session.add(job)
            session.commit()  # Commit to get the ID
            jobs[job_data['id']] = job
            print(f"  ✅ Created job: {job.title}")
        
        # Create reviews
        print("⭐ Creating reviews...")
        reviews_data = data.get('reviews', [])
        
        for review_data in reviews_data:
            # Find the job
            job = jobs.get(review_data['booking_id'])
            if not job:
                print(f"  ⚠️  Job not found for review: {review_data['booking_id']}")
                continue
            
            # Find client and fundi by ID mapping
            client = None
            if review_data['client_id'] == 1:
                client = users.get('test@example.com')
            
            fundi = None
            if review_data['fundi_id'] == 1:
                fundi = fundis.get('fundi@example.com')
            elif review_data['fundi_id'] == 4:
                fundi = fundis.get('sam@example.com')
            
            if not client or not fundi:
                print(f"  ⚠️  Client or fundi not found for review")
                continue
            
            review = Review(
                job_id=job.id,
                client_id=client.id,
                fundi_id=fundi.id,
                rating=review_data['rating'],
                comment=review_data['comment'],
                created_at=datetime.fromisoformat(review_data['created_at'].replace('Z', '+00:00'))
            )
            session.add(review)
            print(f"  ✅ Created review: {review.rating} stars")
        
        # Create payments
        print("💰 Creating payments...")
        payments_data = data.get('payments', [])
        
        for payment_data in payments_data:
            # Find the job
            job = jobs.get(payment_data['booking_id'])
            if not job:
                print(f"  ⚠️  Job not found for payment: {payment_data['booking_id']}")
                continue
            
            # Find client and fundi by ID mapping
            client = None
            if payment_data['client_id'] == 1:
                client = users.get('test@example.com')
            
            fundi = None
            if payment_data['fundi_id'] == 1:
                fundi = fundis.get('fundi@example.com')
            elif payment_data['fundi_id'] == 4:
                fundi = fundis.get('sam@example.com')
            
            if not client or not fundi:
                print(f"  ⚠️  Client or fundi not found for payment")
                continue
            
            payment = Payment(
                job_id=job.id,
                client_id=client.id,
                fundi_id=fundi.id,
                amount=payment_data['amount'],
                payment_method=payment_data['payment_method'],
                transaction_id=payment_data['transaction_id'],
                status=payment_data['status'],
                created_at=datetime.fromisoformat(payment_data['created_at'].replace('Z', '+00:00'))
            )
            session.add(payment)
            print(f"  ✅ Created payment: KES {payment.amount}")
        
        # Commit all changes
        session.commit()
        
        print("\n🎉 Database seeding completed successfully!")
        print("\n📊 Summary:")
        print(f"  👥 Users: {len(users)}")
        print(f"  🛠️ Fundis: {len(fundis)}")
        print(f"  📂 Categories: {len(categories)}")
        print(f"  📋 Jobs: {len(jobs)}")
        print(f"  ⭐ Reviews: {len(reviews_data)}")
        print(f"  💰 Payments: {len(payments_data)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error seeding database: {str(e)}")
        session.rollback()
        return False
    finally:
        session.close()


def create_default_admin():
    """
    Create a default admin user if none exists
    =========================================
    
    This function creates a default admin user for testing purposes.
    """
    session = get_session()
    
    try:
        # Check if admin exists
        admin = User.find_by_email(session, "admin@fundi.com")
        if admin:
            print("✅ Admin user already exists")
            return
        
        # Create default admin
        admin = User(
            username="admin",
            email="admin@fundi.com",
            password="TEMP_PASSWORD_CHANGE_IN_PRODUCTION",
            phone="+254700000002",
            role="admin",
            is_active=True
        )
        session.add(admin)
        session.commit()
        print("✅ Default admin user created")
        print("  📧 Email: admin@fundi.com")
        print("  🔑 Password: TEMP_PASSWORD_CHANGE_IN_PRODUCTION")
        
    except Exception as e:
        print(f"❌ Error creating admin: {str(e)}")
        session.rollback()
    finally:
        session.close()


def main():
    """
    Main function to run the seeding process
    =======================================
    
    This function orchestrates the entire seeding process.
    """
    print("🚀 FundiMatch CLI - Database Seeding Tool")
    print("=" * 50)
    
    # First, create default admin
    print("\n1️⃣ Creating default admin user...")
    create_default_admin()
    
    # Then seed with data from db.json
    print("\n2️⃣ Seeding database with db.json data...")
    success = seed_database()
    
    if success:
        print("\n✅ Seeding completed successfully!")
        print("\n🎮 You can now run the CLI:")
        print("   python lib/main.py")
        print("\n🔐 Login credentials:")
        print("   Admin: admin@fundi.com / TEMP_PASSWORD_CHANGE_IN_PRODUCTION")
        print("   Client: test@example.com / TEMP_PASSWORD_CHANGE_IN_PRODUCTION")
        print("   Fundi: fundi@example.com / TEMP_PASSWORD_CHANGE_IN_PRODUCTION")
    else:
        print("\n❌ Seeding failed. Please check the error messages above.")


if __name__ == "__main__":
    main()
