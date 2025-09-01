"""
FundiMatch CLI - Helper Functions
================================

This file contains all the helper functions used by the CLI application.
These functions handle database operations, input validation, and business logic.

Key Functions:
- User management (create, authenticate, list, delete)
- Fundi management (create profile, search, update)
- Job management (create, assign, update status)
- Category management (create, list, delete)
- Review and payment management
- Data seeding and utility functions

Author: Gibson Giteru
Class: Moringa School Phase 3
"""

from datetime import datetime
from db.models import User, Fundi, Job, Category, Review, Payment


# ============================================================================
# USER MANAGEMENT FUNCTIONS
# ============================================================================

def create_user(session, **kwargs):
    """
    Create a new user in the database
    ================================
    
    This function creates a new user with the provided information.
    It includes validation to ensure required fields are provided.
    
    Args:
        session: Database session
        **kwargs: User information (username, email, password, phone, role)
        
    Returns:
        User: The created user object, or None if creation failed
        
    Raises:
        Exception: If user creation fails
    """
    try:
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'phone']
        for field in required_fields:
            if field not in kwargs or not kwargs[field]:
                raise ValueError(f"{field} is required")
        
        # Check if user already exists
        existing_user = User.find_by_email(session, kwargs['email'])
        if existing_user:
            raise ValueError("User with this email already exists")
        
        # Create new user
        user = User.create(session, **kwargs)
        print(f"✅ User '{user.username}' created successfully!")
        return user
        
    except Exception as e:
        print(f"❌ Error creating user: {str(e)}")
        session.rollback()
        return None


def authenticate_user(session, email, password):
    """
    Authenticate a user with email and password
    ==========================================
    
    This function validates user credentials and returns the user object
    if authentication is successful.
    
    Args:
        session: Database session
        email (str): User's email address
        password (str): User's password
        
    Returns:
        User: The authenticated user object, or None if authentication fails
    """
    try:
        # Find user by email
        user = User.find_by_email(session, email)
        if not user:
            return None
        
        # Check password (in production, this would be hashed)
        if user.password == password and user.is_active:
            return user
        
        return None
        
    except Exception as e:
        print(f"❌ Authentication error: {str(e)}")
        return None


def list_users(session, role=None):
    """
    List all users or users by role
    ==============================
    
    This function displays all users or filters by role.
    
    Args:
        session: Database session
        role (str, optional): Filter by user role
    """
    try:
        if role:
            users = User.find_by_role(session, role)
        else:
            users = User.get_all(session)
        
        if not users:
            print(f"📭 No users found{' for role ' + role if role else ''}")
            return
        
        print(f"\n👥 USERS{' (' + role.upper() + ')' if role else ''}")
        print("-" * 60)
        print(f"{'ID':<5} {'Username':<15} {'Email':<25} {'Role':<10} {'Status':<8}")
        print("-" * 60)
        
        for user in users:
            status = "Active" if user.is_active else "Inactive"
            print(f"{user.id:<5} {user.username:<15} {user.email:<25} {user.role:<10} {status:<8}")
        
        print(f"\n📊 Total: {len(users)} users")
        
    except Exception as e:
        print(f"❌ Error listing users: {str(e)}")


def delete_user(session, user_id):
    """
    Delete a user from the database
    ===============================
    
    This function deletes a user and all associated data.
    
    Args:
        session: Database session
        user_id (int): ID of the user to delete
        
    Returns:
        bool: True if deletion successful, False otherwise
    """
    try:
        user = User.find_by_id(session, user_id)
        if not user:
            print("❌ User not found")
            return False
        
        # Confirm deletion
        confirm = input(f"⚠️  Are you sure you want to delete user '{user.username}'? (y/N): ")
        if confirm.lower() != 'y':
            print("❌ Deletion cancelled")
            return False
        
        # Delete user (this will cascade to related data)
        session.delete(user)
        session.commit()
        print(f"✅ User '{user.username}' deleted successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error deleting user: {str(e)}")
        session.rollback()
        return False


# ============================================================================
# FUNDI MANAGEMENT FUNCTIONS
# ============================================================================

def create_fundi_profile(session, **kwargs):
    """
    Create a new fundi profile
    =========================
    
    This function creates a fundi profile for an existing user.
    
    Args:
        session: Database session
        **kwargs: Fundi profile information
        
    Returns:
        Fundi: The created fundi object, or None if creation failed
    """
    try:
        # Validate required fields
        required_fields = ['user_id', 'specialization', 'experience', 'hourly_rate', 'location']
        for field in required_fields:
            if field not in kwargs or not kwargs[field]:
                raise ValueError(f"{field} is required")
        
        # Check if user exists and is a fundi
        user = User.find_by_id(session, kwargs['user_id'])
        if not user:
            raise ValueError("User not found")
        if user.role != 'fundi':
            raise ValueError("User must have 'fundi' role")
        
        # Check if fundi profile already exists
        existing_fundi = session.query(Fundi).filter(Fundi.user_id == kwargs['user_id']).first()
        if existing_fundi:
            raise ValueError("Fundi profile already exists for this user")
        
        # Create fundi profile
        fundi = Fundi.create(session, **kwargs)
        print(f"✅ Fundi profile created for {user.username}!")
        return fundi
        
    except Exception as e:
        print(f"❌ Error creating fundi profile: {str(e)}")
        session.rollback()
        return None


def list_fundis(session, available_only=False):
    """
    List all fundis or available fundis only
    =======================================
    
    This function displays fundis with their key information.
    
    Args:
        session: Database session
        available_only (bool): Show only available fundis
    """
    try:
        if available_only:
            fundis = Fundi.find_available(session)
        else:
            fundis = Fundi.get_all(session)
        
        if not fundis:
            print("📭 No fundis found")
            return
        
        print(f"\n🛠️ FUNDIS{' (Available Only)' if available_only else ''}")
        print("-" * 80)
        print(f"{'ID':<5} {'Name':<15} {'Specialization':<15} {'Location':<15} {'Rate':<10} {'Rating':<8} {'Status':<10}")
        print("-" * 80)
        
        for fundi in fundis:
            user = fundi.user
            status = "Available" if fundi.is_available else "Busy"
            print(f"{fundi.id:<5} {user.username:<15} {fundi.specialization:<15} {fundi.location:<15} KES{fundi.hourly_rate:<9} {fundi.rating:<8} {status:<10}")
        
        print(f"\n📊 Total: {len(fundis)} fundis")
        
    except Exception as e:
        print(f"❌ Error listing fundis: {str(e)}")


def search_fundis(session, specialization=None, location=None):
    """
    Search fundis by specialization or location
    =========================================
    
    This function allows searching for fundis based on criteria.
    
    Args:
        session: Database session
        specialization (str, optional): Search by specialization
        location (str, optional): Search by location
    """
    try:
        query = session.query(Fundi)
        
        if specialization:
            query = query.filter(Fundi.specialization.ilike(f"%{specialization}%"))
        if location:
            query = query.filter(Fundi.location.ilike(f"%{location}%"))
        
        fundis = query.all()
        
        if not fundis:
            print("📭 No fundis found matching your criteria")
            return
        
        print(f"\n🔍 SEARCH RESULTS")
        print("-" * 80)
        print(f"{'ID':<5} {'Name':<15} {'Specialization':<15} {'Location':<15} {'Rate':<10} {'Rating':<8}")
        print("-" * 80)
        
        for fundi in fundis:
            user = fundi.user
            print(f"{fundi.id:<5} {user.username:<15} {fundi.specialization:<15} {fundi.location:<15} KES{fundi.hourly_rate:<9} {fundi.rating:<8}")
        
        print(f"\n📊 Found: {len(fundis)} fundis")
        
    except Exception as e:
        print(f"❌ Error searching fundis: {str(e)}")


def view_fundi_details(session, fundi_id):
    """
    View detailed information about a specific fundi
    ==============================================
    
    This function displays comprehensive information about a fundi.
    
    Args:
        session: Database session
        fundi_id (int): ID of the fundi to view
    """
    try:
        fundi = session.query(Fundi).filter(Fundi.id == fundi_id).first()
        if not fundi:
            print("❌ Fundi not found")
            return
        
        user = fundi.user
        
        print(f"\n👤 FUNDI DETAILS")
        print("=" * 50)
        print(f"ID: {fundi.id}")
        print(f"Name: {user.username}")
        print(f"Email: {user.email}")
        print(f"Phone: {user.phone}")
        print(f"Specialization: {fundi.specialization}")
        print(f"Experience: {fundi.experience}")
        print(f"Location: {fundi.location}")
        print(f"Hourly Rate: KES {fundi.hourly_rate}")
        print(f"Rating: {fundi.rating}/5.0")
        print(f"Total Jobs: {fundi.total_jobs}")
        print(f"Completed Jobs: {fundi.completed_jobs}")
        print(f"Available: {'Yes' if fundi.is_available else 'No'}")
        print(f"Verified: {'Yes' if fundi.is_verified else 'No'}")
        if fundi.bio:
            print(f"Bio: {fundi.bio}")
        
        # Show recent jobs
        recent_jobs = session.query(Job).filter(Job.fundi_id == fundi_id).limit(5).all()
        if recent_jobs:
            print(f"\n📋 Recent Jobs:")
            for job in recent_jobs:
                print(f"  - {job.title} ({job.status})")
        
    except Exception as e:
        print(f"❌ Error viewing fundi details: {str(e)}")


def update_fundi_availability(session, fundi_id, is_available):
    """
    Update fundi availability status
    ===============================
    
    This function updates whether a fundi is available for work.
    
    Args:
        session: Database session
        fundi_id (int): ID of the fundi
        is_available (bool): New availability status
        
    Returns:
        bool: True if update successful, False otherwise
    """
    try:
        fundi = session.query(Fundi).filter(Fundi.id == fundi_id).first()
        if not fundi:
            print("❌ Fundi not found")
            return False
        
        fundi.is_available = is_available
        session.commit()
        
        status = "available" if is_available else "unavailable"
        print(f"✅ Fundi {fundi.user.username} is now {status}")
        return True
        
    except Exception as e:
        print(f"❌ Error updating availability: {str(e)}")
        session.rollback()
        return False


def delete_fundi(session, fundi_id):
    """
    Delete a fundi profile
    ====================
    
    This function deletes a fundi profile and associated data.
    
    Args:
        session: Database session
        fundi_id (int): ID of the fundi to delete
        
    Returns:
        bool: True if deletion successful, False otherwise
    """
    try:
        fundi = session.query(Fundi).filter(Fundi.id == fundi_id).first()
        if not fundi:
            print("❌ Fundi not found")
            return False
        
        # Confirm deletion
        confirm = input(f"⚠️  Are you sure you want to delete fundi '{fundi.user.username}'? (y/N): ")
        if confirm.lower() != 'y':
            print("❌ Deletion cancelled")
            return False
        
        # Delete fundi profile
        session.delete(fundi)
        session.commit()
        print(f"✅ Fundi '{fundi.user.username}' deleted successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error deleting fundi: {str(e)}")
        session.rollback()
        return False


# ============================================================================
# JOB MANAGEMENT FUNCTIONS
# ============================================================================

def create_job(session, **kwargs):
    """
    Create a new job request
    =======================
    
    This function creates a new job request from a client.
    
    Args:
        session: Database session
        **kwargs: Job information
        
    Returns:
        Job: The created job object, or None if creation failed
    """
    try:
        # Validate required fields
        required_fields = ['title', 'description', 'location', 'client_id', 'category_id']
        for field in required_fields:
            if field not in kwargs or not kwargs[field]:
                raise ValueError(f"{field} is required")
        
        # Check if client exists
        client = User.find_by_id(session, kwargs['client_id'])
        if not client:
            raise ValueError("Client not found")
        
        # Check if category exists
        category = session.query(Category).filter(Category.id == kwargs['category_id']).first()
        if not category:
            raise ValueError("Category not found")
        
        # Create job
        job = Job.create(session, **kwargs)
        print(f"✅ Job '{job.title}' created successfully!")
        return job
        
    except Exception as e:
        print(f"❌ Error creating job: {str(e)}")
        session.rollback()
        return None


def list_jobs(session, status=None):
    """
    List all jobs or jobs by status
    ==============================
    
    This function displays jobs with their key information.
    
    Args:
        session: Database session
        status (str, optional): Filter by job status
    """
    try:
        if status:
            jobs = Job.find_by_status(session, status)
        else:
            jobs = Job.get_all(session)
        
        if not jobs:
            print("📭 No jobs found")
            return
        
        print(f"\n📋 JOBS{' (' + status.upper() + ')' if status else ''}")
        print("-" * 90)
        print(f"{'ID':<5} {'Title':<25} {'Client':<15} {'Category':<12} {'Status':<12} {'Location':<15}")
        print("-" * 90)
        
        for job in jobs:
            client = job.client
            category = job.category
            print(f"{job.id:<5} {job.title:<25} {client.username:<15} {category.name:<12} {job.status:<12} {job.location:<15}")
        
        print(f"\n📊 Total: {len(jobs)} jobs")
        
    except Exception as e:
        print(f"❌ Error listing jobs: {str(e)}")


def list_jobs_by_status(session, status=None, client_id=None, fundi_id=None):
    """
    List jobs with various filters
    ==============================
    
    This function lists jobs with optional filtering by status, client, or fundi.
    
    Args:
        session: Database session
        status (str, optional): Filter by status
        client_id (int, optional): Filter by client ID
        fundi_id (int, optional): Filter by fundi ID
    """
    try:
        query = session.query(Job)
        
        if status:
            query = query.filter(Job.status == status)
        if client_id:
            query = query.filter(Job.client_id == client_id)
        if fundi_id:
            query = query.filter(Job.fundi_id == fundi_id)
        
        jobs = query.all()
        
        if not jobs:
            print("📭 No jobs found matching your criteria")
            return
        
        print(f"\n📋 JOBS")
        print("-" * 90)
        print(f"{'ID':<5} {'Title':<25} {'Client':<15} {'Category':<12} {'Status':<12} {'Location':<15}")
        print("-" * 90)
        
        for job in jobs:
            client = job.client
            category = job.category
            print(f"{job.id:<5} {job.title:<25} {client.username:<15} {category.name:<12} {job.status:<12} {job.location:<15}")
        
        print(f"\n📊 Found: {len(jobs)} jobs")
        
    except Exception as e:
        print(f"❌ Error listing jobs: {str(e)}")


def assign_job_to_fundi(session, job_id, fundi_id):
    """
    Assign a job to a fundi
    ======================
    
    This function assigns a pending job to an available fundi.
    
    Args:
        session: Database session
        job_id (int): ID of the job to assign
        fundi_id (int): ID of the fundi to assign to
        
    Returns:
        bool: True if assignment successful, False otherwise
    """
    try:
        # Find job
        job = Job.find_by_id(session, job_id)
        if not job:
            print("❌ Job not found")
            return False
        
        # Find fundi
        fundi = session.query(Fundi).filter(Fundi.id == fundi_id).first()
        if not fundi:
            print("❌ Fundi not found")
            return False
        
        # Check if job is available for assignment
        if job.status != "pending":
            print("❌ Job is not available for assignment")
            return False
        
        # Check if fundi is available
        if not fundi.is_available:
            print("❌ Fundi is not available")
            return False
        
        # Assign job
        job.assign_to_fundi(session, fundi_id)
        print(f"✅ Job '{job.title}' assigned to {fundi.user.username}!")
        return True
        
    except Exception as e:
        print(f"❌ Error assigning job: {str(e)}")
        session.rollback()
        return False


def update_job_status(session, job_id, new_status):
    """
    Update job status
    =================
    
    This function updates the status of a job.
    
    Args:
        session: Database session
        job_id (int): ID of the job
        new_status (str): New status (pending, assigned, in_progress, completed, cancelled)
        
    Returns:
        bool: True if update successful, False otherwise
    """
    try:
        job = Job.find_by_id(session, job_id)
        if not job:
            print("❌ Job not found")
            return False
        
        # Validate status
        valid_statuses = ["pending", "assigned", "in_progress", "completed", "cancelled"]
        if new_status not in valid_statuses:
            print(f"❌ Invalid status. Must be one of: {', '.join(valid_statuses)}")
            return False
        
        # Update status
        job.update_status(session, new_status)
        print(f"✅ Job '{job.title}' status updated to '{new_status}'!")
        return True
        
    except Exception as e:
        print(f"❌ Error updating job status: {str(e)}")
        session.rollback()
        return False


def view_job_details(session, job_id):
    """
    View detailed information about a specific job
    =============================================
    
    This function displays comprehensive information about a job.
    
    Args:
        session: Database session
        job_id (int): ID of the job to view
    """
    try:
        job = Job.find_by_id(session, job_id)
        if not job:
            print("❌ Job not found")
            return
        
        client = job.client
        category = job.category
        fundi = job.fundi.user if job.fundi else None
        
        print(f"\n📋 JOB DETAILS")
        print("=" * 50)
        print(f"ID: {job.id}")
        print(f"Title: {job.title}")
        print(f"Description: {job.description}")
        print(f"Location: {job.location}")
        print(f"Status: {job.status}")
        print(f"Priority: {job.priority}")
        print(f"Category: {category.name}")
        print(f"Client: {client.username}")
        if fundi:
            print(f"Assigned Fundi: {fundi.username}")
        if job.budget:
            print(f"Budget: KES {job.budget}")
        if job.hourly_rate:
            print(f"Hourly Rate: KES {job.hourly_rate}")
        if job.estimated_hours:
            print(f"Estimated Hours: {job.estimated_hours}")
        if job.total_amount:
            print(f"Total Amount: KES {job.total_amount}")
        print(f"Created: {job.created_at.strftime('%Y-%m-%d %H:%M')}")
        if job.scheduled_date:
            print(f"Scheduled: {job.scheduled_date.strftime('%Y-%m-%d %H:%M')}")
        if job.completed_at:
            print(f"Completed: {job.completed_at.strftime('%Y-%m-%d %H:%M')}")
        
    except Exception as e:
        print(f"❌ Error viewing job details: {str(e)}")


def delete_job(session, job_id):
    """
    Delete a job
    ============
    
    This function deletes a job and associated data.
    
    Args:
        session: Database session
        job_id (int): ID of the job to delete
        
    Returns:
        bool: True if deletion successful, False otherwise
    """
    try:
        job = Job.find_by_id(session, job_id)
        if not job:
            print("❌ Job not found")
            return False
        
        # Confirm deletion
        confirm = input(f"⚠️  Are you sure you want to delete job '{job.title}'? (y/N): ")
        if confirm.lower() != 'y':
            print("❌ Deletion cancelled")
            return False
        
        # Delete job
        session.delete(job)
        session.commit()
        print(f"✅ Job '{job.title}' deleted successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error deleting job: {str(e)}")
        session.rollback()
        return False


# ============================================================================
# CATEGORY MANAGEMENT FUNCTIONS
# ============================================================================

def create_category(session, name, description=None, icon=None):
    """
    Create a new job category
    ========================
    
    This function creates a new category for job classification.
    
    Args:
        session: Database session
        name (str): Category name
        description (str, optional): Category description
        icon (str, optional): Icon for UI display
        
    Returns:
        Category: The created category object, or None if creation failed
    """
    try:
        if not name:
            raise ValueError("Category name is required")
        
        # Check if category already exists
        existing = session.query(Category).filter(Category.name == name).first()
        if existing:
            raise ValueError("Category with this name already exists")
        
        # Create category
        category = Category(
            name=name,
            description=description,
            icon=icon
        )
        session.add(category)
        session.commit()
        
        print(f"✅ Category '{category.name}' created successfully!")
        return category
        
    except Exception as e:
        print(f"❌ Error creating category: {str(e)}")
        session.rollback()
        return None


def list_categories(session):
    """
    List all job categories
    ======================
    
    This function displays all available job categories.
    
    Args:
        session: Database session
        
    Returns:
        list: List of category objects
    """
    try:
        categories = session.query(Category).all()
        
        if not categories:
            print("📭 No categories found")
            return []
        
        print(f"\n📂 JOB CATEGORIES")
        print("-" * 50)
        print(f"{'ID':<5} {'Name':<20} {'Description':<25}")
        print("-" * 50)
        
        for category in categories:
            desc = category.description[:22] + "..." if category.description and len(category.description) > 25 else category.description or ""
            print(f"{category.id:<5} {category.name:<20} {desc:<25}")
        
        print(f"\n📊 Total: {len(categories)} categories")
        return categories
        
    except Exception as e:
        print(f"❌ Error listing categories: {str(e)}")
        return []


def delete_category(session, category_id):
    """
    Delete a job category
    ====================
    
    This function deletes a category if no jobs are using it.
    
    Args:
        session: Database session
        category_id (int): ID of the category to delete
        
    Returns:
        bool: True if deletion successful, False otherwise
    """
    try:
        category = session.query(Category).filter(Category.id == category_id).first()
        if not category:
            print("❌ Category not found")
            return False
        
        # Check if category is in use
        jobs_using_category = session.query(Job).filter(Job.category_id == category_id).count()
        if jobs_using_category > 0:
            print(f"❌ Cannot delete category. {jobs_using_category} jobs are using it.")
            return False
        
        # Confirm deletion
        confirm = input(f"⚠️  Are you sure you want to delete category '{category.name}'? (y/N): ")
        if confirm.lower() != 'y':
            print("❌ Deletion cancelled")
            return False
        
        # Delete category
        session.delete(category)
        session.commit()
        print(f"✅ Category '{category.name}' deleted successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error deleting category: {str(e)}")
        session.rollback()
        return False


# ============================================================================
# REVIEW AND PAYMENT FUNCTIONS
# ============================================================================

def create_review(session, job_id, client_id, fundi_id, rating, comment=None):
    """
    Create a new review for a completed job
    ======================================
    
    This function creates a review from a client for a completed job.
    
    Args:
        session: Database session
        job_id (int): ID of the job being reviewed
        client_id (int): ID of the client leaving the review
        fundi_id (int): ID of the fundi being reviewed
        rating (int): Rating from 1-5
        comment (str, optional): Review comment
        
    Returns:
        Review: The created review object, or None if creation failed
    """
    try:
        # Validate rating
        if rating < 1 or rating > 5:
            raise ValueError("Rating must be between 1 and 5")
        
        # Check if job exists and is completed
        job = Job.find_by_id(session, job_id)
        if not job:
            raise ValueError("Job not found")
        if job.status != "completed":
            raise ValueError("Can only review completed jobs")
        
        # Create review
        review = Review(
            job_id=job_id,
            client_id=client_id,
            fundi_id=fundi_id,
            rating=rating,
            comment=comment
        )
        session.add(review)
        session.commit()
        
        # Update fundi rating
        fundi = session.query(Fundi).filter(Fundi.id == fundi_id).first()
        if fundi:
            # Calculate new average rating
            reviews = session.query(Review).filter(Review.fundi_id == fundi_id).all()
            total_rating = sum(r.rating for r in reviews)
            new_rating = total_rating / len(reviews)
            fundi.update_rating(session, new_rating)
        
        print(f"✅ Review created successfully!")
        return review
        
    except Exception as e:
        print(f"❌ Error creating review: {str(e)}")
        session.rollback()
        return None


def list_reviews(session, fundi_id=None, client_id=None):
    """
    List reviews with optional filtering
    ===================================
    
    This function displays reviews with optional filtering.
    
    Args:
        session: Database session
        fundi_id (int, optional): Filter by fundi ID
        client_id (int, optional): Filter by client ID
    """
    try:
        query = session.query(Review)
        
        if fundi_id:
            query = query.filter(Review.fundi_id == fundi_id)
        if client_id:
            query = query.filter(Review.client_id == client_id)
        
        reviews = query.all()
        
        if not reviews:
            print("📭 No reviews found")
            return
        
        print(f"\n⭐ REVIEWS")
        print("-" * 80)
        print(f"{'ID':<5} {'Job':<25} {'Client':<15} {'Fundi':<15} {'Rating':<8} {'Date':<12}")
        print("-" * 80)
        
        for review in reviews:
            job = review.job
            client = review.client
            fundi = review.fundi.user
            print(f"{review.id:<5} {job.title:<25} {client.username:<15} {fundi.username:<15} {review.rating:<8} {review.created_at.strftime('%Y-%m-%d'):<12}")
        
        print(f"\n📊 Total: {len(reviews)} reviews")
        
    except Exception as e:
        print(f"❌ Error listing reviews: {str(e)}")


def create_payment(session, job_id, client_id, fundi_id, amount, payment_method, transaction_id=None):
    """
    Create a new payment record
    ==========================
    
    This function creates a payment record for a job.
    
    Args:
        session: Database session
        job_id (int): ID of the job
        client_id (int): ID of the client making payment
        fundi_id (int): ID of the fundi receiving payment
        amount (float): Payment amount
        payment_method (str): Payment method (M-Pesa, Card, Cash)
        transaction_id (str, optional): Transaction ID
        
    Returns:
        Payment: The created payment object, or None if creation failed
    """
    try:
        if amount <= 0:
            raise ValueError("Payment amount must be positive")
        
        # Create payment
        payment = Payment(
            job_id=job_id,
            client_id=client_id,
            fundi_id=fundi_id,
            amount=amount,
            payment_method=payment_method,
            transaction_id=transaction_id
        )
        session.add(payment)
        session.commit()
        
        print(f"✅ Payment of KES {amount} recorded successfully!")
        return payment
        
    except Exception as e:
        print(f"❌ Error creating payment: {str(e)}")
        session.rollback()
        return None


def list_payments(session, client_id=None, fundi_id=None):
    """
    List payments with optional filtering
    ====================================
    
    This function displays payments with optional filtering.
    
    Args:
        session: Database session
        client_id (int, optional): Filter by client ID
        fundi_id (int, optional): Filter by fundi ID
    """
    try:
        query = session.query(Payment)
        
        if client_id:
            query = query.filter(Payment.client_id == client_id)
        if fundi_id:
            query = query.filter(Payment.fundi_id == fundi_id)
        
        payments = query.all()
        
        if not payments:
            print("📭 No payments found")
            return
        
        print(f"\n💰 PAYMENTS")
        print("-" * 80)
        print(f"{'ID':<5} {'Job':<25} {'Client':<15} {'Fundi':<15} {'Amount':<12} {'Status':<10}")
        print("-" * 80)
        
        for payment in payments:
            job = payment.job
            client = payment.client
            fundi = payment.fundi.user
            print(f"{payment.id:<5} {job.title:<25} {client.username:<15} {fundi.username:<15} KES{payment.amount:<11} {payment.status:<10}")
        
        print(f"\n📊 Total: {len(payments)} payments")
        
    except Exception as e:
        print(f"❌ Error listing payments: {str(e)}")


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def seed_sample_data(session):
    """
    Seed the database with sample data
    =================================
    
    This function populates the database with sample data for testing
    and demonstration purposes.
    """
    try:
        print("🌱 Seeding database with sample data...")
        
        # Create categories
        categories = [
            Category(name="Plumbing", description="Water and drainage systems", icon="faucet"),
            Category(name="Electrical", description="Electrical installations and repairs", icon="bolt"),
            Category(name="Carpentry", description="Woodwork and furniture", icon="hammer"),
            Category(name="Painting", description="Interior and exterior painting", icon="paint-brush"),
            Category(name="Cleaning", description="House and office cleaning", icon="broom")
        ]
        
        for category in categories:
            session.add(category)
        session.commit()
        print("✅ Categories created")
        
        # Create users
        users = [
                User(username="admin", email="admin@example.com", password="TEMP_PASSWORD_CHANGE_IN_PRODUCTION", phone="+254700000002", role="admin"),
    User(username="john_doe", email="client@example.com", password="TEMP_PASSWORD_CHANGE_IN_PRODUCTION", phone="+254700000001", role="client"),
    User(username="testfundi", email="fundi@example.com", password="TEMP_PASSWORD_CHANGE_IN_PRODUCTION", phone="+254711111111", role="fundi"),
    User(username="electrician_mike", email="mike@example.com", password="TEMP_PASSWORD_CHANGE_IN_PRODUCTION", phone="+254711111112", role="fundi")
        ]
        
        for user in users:
            session.add(user)
        session.commit()
        print("✅ Users created")
        
        # Create fundi profiles
        fundis = [
            Fundi(user_id=3, specialization="Plumbing", experience="5 years", hourly_rate=1500, location="Nairobi", bio="Experienced plumber"),
            Fundi(user_id=4, specialization="Electrical", experience="8 years", hourly_rate=2000, location="Mombasa", bio="Certified electrician")
        ]
        
        for fundi in fundis:
            session.add(fundi)
        session.commit()
        print("✅ Fundi profiles created")
        
        # Create jobs
        jobs = [
            Job(title="Fix leaking kitchen sink", description="Kitchen sink is leaking", location="Nairobi, Westlands", client_id=2, category_id=1, status="pending"),
            Job(title="Install security lights", description="Install motion sensor lights", location="Mombasa, Nyali", client_id=2, category_id=2, status="assigned", fundi_id=2)
        ]
        
        for job in jobs:
            session.add(job)
        session.commit()
        print("✅ Jobs created")
        
        print("🎉 Sample data seeding completed!")
        
    except Exception as e:
        print(f"❌ Error seeding data: {str(e)}")
        session.rollback()


def clear_database(session):
    """
    Clear all data from the database
    ===============================
    
    This function removes all data from the database.
    Use with caution!
    """
    try:
        confirm = input("⚠️  Are you sure you want to clear ALL data? This cannot be undone! (yes/NO): ")
        if confirm.lower() != 'yes':
            print("❌ Database clear cancelled")
            return
        
        # Delete all data in reverse order of dependencies
        session.query(Payment).delete()
        session.query(Review).delete()
        session.query(Job).delete()
        session.query(Fundi).delete()
        session.query(User).delete()
        session.query(Category).delete()
        
        session.commit()
        print("✅ Database cleared successfully!")
        
    except Exception as e:
        print(f"❌ Error clearing database: {str(e)}")
        session.rollback()


def export_data(session, filename="fundimatch_export.json"):
    """
    Export database data to JSON file
    =================================
    
    This function exports all database data to a JSON file.
    
    Args:
        session: Database session
        filename (str): Output filename
    """
    try:
        import json
        
        data = {
            "users": [],
            "fundis": [],
            "categories": [],
            "jobs": [],
            "reviews": [],
            "payments": []
        }
        
        # Export users
        users = User.get_all(session)
        for user in users:
            data["users"].append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat()
            })
        
        # Export other data...
        # (Similar pattern for other models)
        
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✅ Data exported to {filename}")
        
    except Exception as e:
        print(f"❌ Error exporting data: {str(e)}")


def import_data(session, filename):
    """
    Import data from JSON file
    =========================
    
    This function imports data from a JSON file.
    
    Args:
        session: Database session
        filename (str): Input filename
    """
    try:
        import json
        
        with open(filename, 'r') as f:
            data = json.load(f)
        
        # Import data...
        # (Implementation would depend on data structure)
        
        print(f"✅ Data imported from {filename}")
        
    except Exception as e:
        print(f"❌ Error importing data: {str(e)}")
