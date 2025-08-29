"""
Simple SQLAlchemy models for FundiMatch CLI.
This file shows how to use SQLAlchemy ORM to work with databases.
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker, declarative_base

# Database setup - SQLite is perfect for learning and development
DATABASE_URL = "sqlite:///fundimatch.db"

# Create the database engine - this connects to our SQLite file
engine = create_engine(DATABASE_URL, echo=False)

# SessionLocal creates database sessions - think of it as a connection to the database
SessionLocal = sessionmaker(autoflush=False, bind=engine)

# Base is the parent class for all our models
Base = declarative_base()


class Fundi(Base):
    """
    Fundi model represents a contractor/craftsman.
    This is the "one" side of our one-to-many relationship with Jobs.
    """
    
    __tablename__ = "fundis"  # This is the table name in the database
    
    # Primary key - unique identifier for each fundi
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic fundi information
    name = Column(String(100), nullable=False)  # nullable=False means this field is required
    phone = Column(String(15), nullable=False, unique=True)  # unique=True means no two fundis can have the same phone
    skill = Column(String(50), nullable=False)  # e.g., "electrician", "plumber"
    rating = Column(Float, default=0.0, nullable=False)  # Rating from 0.0 to 5.0
    
    # Relationship: one fundi can have many jobs
    # cascade="all, delete-orphan" means if we delete a fundi, all their jobs are deleted too
    jobs = relationship("Job", back_populates="fundi", cascade="all, delete-orphan")
    
    def __repr__(self):
        """String representation of the fundi - useful for debugging"""
        return f"<Fundi(id={self.id}, name='{self.name}', skill='{self.skill}', rating={self.rating})>"
    
    @classmethod
    def create(cls, session, **kwargs):
        """Create a new fundi and save it to the database"""
        fundi = cls(**kwargs)  # Create new fundi object
        session.add(fundi)     # Add it to the session
        session.commit()        # Save changes to database
        return fundi
    
    @classmethod
    def get_all(cls, session):
        """Get all fundis from the database"""
        return session.query(cls).all()
    
    @classmethod
    def find_by_id(cls, session, fundi_id):
        """Find a fundi by their ID"""
        return session.query(cls).filter(cls.id == fundi_id).first()
    
    @classmethod
    def find_by_skill(cls, session, skill):
        """Find all fundis with a specific skill"""
        return session.query(cls).filter(cls.skill.ilike(f"%{skill}%")).all()
    
    def delete(self, session):
        """Delete this fundi from the database"""
        session.delete(self)
        session.commit()
        return True


class Job(Base):
    """
    Job model represents a work request.
    This is the "many" side of our one-to-many relationship with Fundis.
    """
    
    __tablename__ = "jobs"
    
    # Primary key - unique identifier for each job
    id = Column(Integer, primary_key=True, index=True)
    
    # Job details
    title = Column(String(200), nullable=False)
    description = Column(String(500), nullable=False)
    status = Column(String(20), default="pending", nullable=False)  # pending, assigned, or completed
    
    # Foreign key - links this job to a fundi (can be None if unassigned)
    fundi_id = Column(Integer, ForeignKey("fundis.id"), nullable=True)
    
    # Relationship: each job belongs to one fundi
    fundi = relationship("Fundi", back_populates="jobs")
    
    def __repr__(self):
        """String representation of the job"""
        return f"<Job(id={self.id}, title='{self.title}', status='{self.status}', fundi_id={self.fundi_id})>"
    
    @classmethod
    def create(cls, session, **kwargs):
        """Create a new job and save it to the database"""
        job = cls(**kwargs)
        session.add(job)
        session.commit()
        return job
    
    @classmethod
    def get_all(cls, session):
        """Get all jobs from the database"""
        return session.query(cls).all()
    
    @classmethod
    def find_by_id(cls, session, job_id):
        """Find a job by its ID"""
        return session.query(cls).filter(cls.id == job_id).first()
    
    @classmethod
    def find_by_status(cls, session, status):
        """Find all jobs with a specific status"""
        return session.query(cls).filter(cls.status == status).all()
    
    def delete(self, session):
        """Delete this job from the database"""
        session.delete(self)
        session.commit()
        return True


def get_session():
    """Get a new database session - use this to interact with the database"""
    return SessionLocal()


# Create all tables when this file is imported
# This is simpler than Alembic for learning purposes
Base.metadata.create_all(bind=engine)
