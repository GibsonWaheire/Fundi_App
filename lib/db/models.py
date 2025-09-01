"""
FundiMatch CLI - Database Models with SQLAlchemy ORM
===================================================

This file defines the database structure for the FundiMatch application.
It demonstrates Object-Relational Mapping (ORM) concepts and database relationships.

Key Concepts Demonstrated:
- SQLAlchemy ORM for database operations
- One-to-many relationships (User -> Jobs, Fundi -> Jobs)
- Many-to-many relationships (Jobs <-> Categories)
- Database migrations and schema management
- CRUD operations with proper error handling

Author: Gibson Giteru
Class: Moringa School Phase 3
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, Boolean, DateTime, Text
from sqlalchemy.orm import relationship, sessionmaker, declarative_base
from sqlalchemy.sql import func
from datetime import datetime

# Database Configuration
# Using SQLite for development - easy to set up and portable
DATABASE_URL = "sqlite:///fundimatch.db"

# Create database engine - this is our connection to the database
engine = create_engine(DATABASE_URL, echo=False)

# Session factory - creates database sessions for transactions
SessionLocal = sessionmaker(autoflush=False, bind=engine)

# Base class for all our models - provides common functionality
Base = declarative_base()


class User(Base):
    """
    User Model - Represents all users in the system
    ===============================================
    
    This model handles three types of users:
    - Admin: System administrators with full access
    - Client: Customers who need fundi services
    - Fundi: Service providers/contractors
    
    Demonstrates:
    - Role-based access control
    - User authentication fields
    - Timestamp tracking
    """
    
    __tablename__ = "users"
    
    # Primary key - unique identifier for each user
    id = Column(Integer, primary_key=True, index=True)
    
    # User authentication and profile information
    username = Column(String(100), nullable=False, unique=True)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(255), nullable=False)  # In production, this would be hashed
    phone = Column(String(15), nullable=False)
    
    # User role - determines access level and functionality
    role = Column(String(20), nullable=False, default="client")  # admin, client, fundi
    
    # Account status and timestamps
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    jobs_created = relationship("Job", back_populates="client", foreign_keys="Job.client_id")
    
    def __repr__(self):
        """String representation for debugging and logging"""
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}')>"
    
    @classmethod
    def create(cls, session, **kwargs):
        """Create a new user and save to database"""
        user = cls(**kwargs)
        session.add(user)
        session.commit()
        return user
    
    @classmethod
    def get_all(cls, session):
        """Get all users from database"""
        return session.query(cls).all()
    
    @classmethod
    def find_by_email(cls, session, email):
        """Find user by email address"""
        return session.query(cls).filter(cls.email == email).first()
    
    @classmethod
    def find_by_role(cls, session, role):
        """Find all users with specific role"""
        return session.query(cls).filter(cls.role == role).all()

    @classmethod
    def find_by_id(cls, session, user_id):
        """Find user by ID"""
        return session.query(cls).filter(cls.id == user_id).first()


class Fundi(Base):
    """
    Fundi Model - Represents service providers/contractors
    ===================================================
    
    This model extends the User model with fundi-specific information.
    Fundis are service providers who can be hired for various jobs.
    
    Demonstrates:
    - Extended user functionality
    - Professional profile management
    - Rating and review system
    - Availability tracking
    """
    
    __tablename__ = "fundis"
    
    # Primary key and user relationship
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Professional information
    specialization = Column(String(100), nullable=False)  # e.g., "Electrical", "Plumbing"
    experience = Column(String(50), nullable=False)       # e.g., "5 years", "10+ years"
    hourly_rate = Column(Float, nullable=False)           # Rate in local currency
    location = Column(String(100), nullable=False)        # Service area
    bio = Column(Text, nullable=True)                      # Professional description
    
    # Performance metrics
    rating = Column(Float, default=0.0, nullable=False)   # Average rating (0.0-5.0)
    total_jobs = Column(Integer, default=0, nullable=False)
    completed_jobs = Column(Integer, default=0, nullable=False)
    
    # Availability and status
    is_available = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", backref="fundi_profile")
    jobs_assigned = relationship("Job", back_populates="fundi", foreign_keys="Job.fundi_id")
    reviews = relationship("Review", back_populates="fundi")
    
    def __repr__(self):
        """String representation for debugging"""
        return f"<Fundi(id={self.id}, specialization='{self.specialization}', rating={self.rating})>"
    
    @classmethod
    def create(cls, session, **kwargs):
        """Create a new fundi profile"""
        fundi = cls(**kwargs)
        session.add(fundi)
        session.commit()
        return fundi
    
    @classmethod
    def get_all(cls, session):
        """Get all fundis"""
        return session.query(cls).all()
    
    @classmethod
    def find_by_specialization(cls, session, specialization):
        """Find fundis by specialization"""
        return session.query(cls).filter(cls.specialization.ilike(f"%{specialization}%")).all()
    
    @classmethod
    def find_available(cls, session):
        """Find all available fundis"""
        return session.query(cls).filter(cls.is_available == True).all()
    
    def update_rating(self, session, new_rating):
        """Update fundi rating"""
        self.rating = new_rating
        session.commit()
        return self


class Category(Base):
    """
    Category Model - Service categories for jobs
    ==========================================
    
    This model defines different service categories that fundis can specialize in.
    Examples: Plumbing, Electrical, Carpentry, Painting, etc.
    
    Demonstrates:
    - Many-to-many relationships
    - Service categorization
    - Icon and description management
    """
    
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)  # For UI display
    
    # Relationships
    jobs = relationship("Job", back_populates="category")
    
    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}')>"


class Job(Base):
    """
    Job Model - Represents work requests and assignments
    ==================================================
    
    This model connects clients with fundis through job requests.
    Jobs can be created by clients and assigned to fundis.
    
    Demonstrates:
    - Many-to-many relationships
    - Status tracking
    - Financial calculations
    - Timeline management
    """
    
    __tablename__ = "jobs"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Job details
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(200), nullable=False)
    
    # Job status and timeline
    status = Column(String(20), default="pending", nullable=False)  # pending, assigned, in_progress, completed, cancelled
    priority = Column(String(20), default="medium", nullable=False)  # low, medium, high
    
    # Financial information
    budget = Column(Float, nullable=True)
    hourly_rate = Column(Float, nullable=True)
    estimated_hours = Column(Float, nullable=True)
    total_amount = Column(Float, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    scheduled_date = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Foreign keys and relationships
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    fundi_id = Column(Integer, ForeignKey("fundis.id"), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    
    # Relationships
    client = relationship("User", back_populates="jobs_created", foreign_keys=[client_id])
    fundi = relationship("Fundi", back_populates="jobs_assigned", foreign_keys=[fundi_id])
    category = relationship("Category", back_populates="jobs")
    reviews = relationship("Review", back_populates="job")
    
    def __repr__(self):
        return f"<Job(id={self.id}, title='{self.title}', status='{self.status}')>"
    
    @classmethod
    def create(cls, session, **kwargs):
        """Create a new job"""
        job = cls(**kwargs)
        session.add(job)
        session.commit()
        return job
    
    @classmethod
    def get_all(cls, session):
        """Get all jobs"""
        return session.query(cls).all()
    
    @classmethod
    def find_by_status(cls, session, status):
        """Find jobs by status"""
        return session.query(cls).filter(cls.status == status).all()
    
    @classmethod
    def find_by_client(cls, session, client_id):
        """Find jobs created by a specific client"""
        return session.query(cls).filter(cls.client_id == client_id).all()
    
    @classmethod
    def find_by_fundi(cls, session, fundi_id):
        """Find jobs assigned to a specific fundi"""
        return session.query(cls).filter(cls.fundi_id == fundi_id).all()
    
    def assign_to_fundi(self, session, fundi_id):
        """Assign job to a fundi"""
        self.fundi_id = fundi_id
        self.status = "assigned"
        session.commit()
        return self
    
    def update_status(self, session, new_status):
        """Update job status"""
        self.status = new_status
        if new_status == "completed":
            self.completed_at = func.now()
        session.commit()
        return self

    @classmethod
    def find_by_id(cls, session, job_id):
        """Find job by ID"""
        return session.query(cls).filter(cls.id == job_id).first()


class Review(Base):
    """
    Review Model - Client feedback and ratings
    =========================================
    
    This model stores client reviews and ratings for completed jobs.
    Helps build trust and reputation for fundis.
    
    Demonstrates:
    - Rating system implementation
    - Feedback collection
    - Relationship management
    """
    
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Review content
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text, nullable=True)
    
    # Relationships
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    fundi_id = Column(Integer, ForeignKey("fundis.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    job = relationship("Job", back_populates="reviews")
    client = relationship("User", foreign_keys=[client_id])
    fundi = relationship("Fundi", back_populates="reviews")
    
    def __repr__(self):
        return f"<Review(id={self.id}, rating={self.rating}, job_id={self.job_id})>"


class Payment(Base):
    """
    Payment Model - Financial transactions
    ====================================
    
    This model tracks payments for completed jobs.
    Includes payment methods, transaction IDs, and status tracking.
    
    Demonstrates:
    - Financial transaction management
    - Payment status tracking
    - Multiple payment methods
    """
    
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Payment details
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), nullable=False)  # M-Pesa, Card, Cash
    transaction_id = Column(String(100), nullable=True)
    status = Column(String(20), default="pending", nullable=False)  # pending, completed, failed
    
    # Relationships
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    fundi_id = Column(Integer, ForeignKey("fundis.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    job = relationship("Job")
    client = relationship("User", foreign_keys=[client_id])
    fundi = relationship("Fundi")
    
    def __repr__(self):
        return f"<Payment(id={self.id}, amount={self.amount}, status='{self.status}')>"


def get_session():
    """
    Get a new database session
    =========================
    
    This function creates a new database session for performing operations.
    Always use this function to get a session, never create SessionLocal() directly.
    
    Returns:
        Session: A new database session
    """
    return SessionLocal()


# Database initialization
# This creates all tables when the models are imported
# In production, you would use Alembic migrations instead
Base.metadata.create_all(bind=engine)
