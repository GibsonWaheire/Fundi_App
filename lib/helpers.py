"""
Simple helper functions for FundiMatch CLI.
These functions handle the database work and return plain data.
The CLI handles all user input and printing.
"""

from db.models import Fundi, Job, get_session


def list_fundis(session):
    """Get all fundis from the database"""
    return Fundi.get_all(session)


def create_fundi(session, name, phone, skill, rating=0.0):
    """Create a new fundi and save to database"""
    # Basic validation
    if not name or len(name.strip()) < 2:
        raise ValueError("Name must be at least 2 characters long")
    
    if not phone or len(phone) < 10:
        raise ValueError("Phone number must be at least 10 characters")
    
    if not skill or len(skill.strip()) < 2:
        raise ValueError("Skill must be at least 2 characters long")
    
    if rating < 0.0 or rating > 5.0:
        raise ValueError("Rating must be between 0.0 and 5.0")
    
    # Check if phone already exists
    existing = session.query(Fundi).filter(Fundi.phone == phone).first()
    if existing:
        raise ValueError("Phone number already registered")
    
    # Create and save the fundi
    fundi = Fundi.create(session, name=name.strip(), phone=phone, skill=skill.strip(), rating=rating)
    return fundi


def delete_fundi(session, fundi_id):
    """Delete a fundi by ID"""
    if fundi_id <= 0:
        raise ValueError("Invalid fundi ID")
    
    fundi = Fundi.find_by_id(session, fundi_id)
    if not fundi:
        raise ValueError("Fundi not found")
    
    return fundi.delete(session)


def search_fundi_by_skill(session, skill):
    """Find fundis with a specific skill"""
    if not skill or len(skill.strip()) < 2:
        raise ValueError("Skill search term must be at least 2 characters")
    
    return Fundi.find_by_skill(session, skill.strip())


def list_jobs(session):
    """Get all jobs from the database"""
    return Job.get_all(session)


def create_job(session, title, description):
    """Create a new job"""
    if not title or len(title.strip()) < 5:
        raise ValueError("Job title must be at least 5 characters long")
    
    if not description or len(description.strip()) < 10:
        raise ValueError("Job description must be at least 10 characters long")
    
    job = Job.create(session, title=title.strip(), description=description.strip())
    return job


def delete_job(session, job_id):
    """Delete a job by ID"""
    if job_id <= 0:
        raise ValueError("Invalid job ID")
    
    job = Job.find_by_id(session, job_id)
    if not job:
        raise ValueError("Job not found")
    
    return job.delete(session)


def update_job_status(session, job_id, status):
    """Update a job's status"""
    if job_id <= 0:
        raise ValueError("Invalid job ID")
    
    valid_statuses = ["pending", "assigned", "completed"]
    if status.lower() not in valid_statuses:
        raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")
    
    job = Job.find_by_id(session, job_id)
    if not job:
        raise ValueError("Job not found")
    
    job.status = status.lower()
    session.commit()
    return job


def view_jobs_for_fundi(session, fundi_id):
    """Get all jobs assigned to a specific fundi"""
    if fundi_id <= 0:
        raise ValueError("Invalid fundi ID")
    
    fundi = Fundi.find_by_id(session, fundi_id)
    if not fundi:
        raise ValueError("Fundi not found")
    
    return fundi.jobs


def match_and_assign_job(session, job_id):
    """
    Simple matching: assign job to first fundi with matching skill.
    If multiple fundis have the skill, pick the one with fewest active jobs.
    """
    if job_id <= 0:
        raise ValueError("Invalid job ID")
    
    job = Job.find_by_id(session, job_id)
    if not job:
        raise ValueError("Job not found")
    
    if job.status != "pending":
        raise ValueError(f"Job is already {job.status}")
    
    if job.fundi_id:
        raise ValueError("Job is already assigned")
    
    # Find fundis with matching skill
    matching_fundis = []
    for fundi in Fundi.get_all(session):
        if fundi.skill.lower() in job.title.lower() or job.title.lower() in fundi.skill.lower():
            # Count active jobs (pending or assigned)
            active_jobs = len([j for j in fundi.jobs if j.status in ["pending", "assigned"]])
            matching_fundis.append((fundi, active_jobs))
    
    if not matching_fundis:
        return False, "No suitable fundis found for this job", None
    
    # Pick fundi with fewest active jobs
    matching_fundis.sort(key=lambda x: x[1])  # Sort by number of active jobs
    best_fundi = matching_fundis[0][0]
    
    # Assign the job
    job.fundi_id = best_fundi.id
    job.status = "assigned"
    session.commit()
    
    return True, f"Job assigned to {best_fundi.name} ({best_fundi.skill})", best_fundi


def get_pending_jobs(session):
    """Get all pending jobs that can be assigned"""
    jobs = Job.find_by_status(session, "pending")
    return [job for job in jobs if not job.fundi_id]


def seed_sample_data(session):
    """Add sample fundis and jobs to the database"""
    # Check if data already exists
    if session.query(Fundi).count() > 0:
        return "Database already has data. Skipping seed."
    
    # Create sample fundis
    fundis_data = [
        {"name": "John Kamau", "phone": "+254700123456", "skill": "electrician", "rating": 4.5},
        {"name": "Mary Wanjiku", "phone": "+254700123457", "skill": "plumber", "rating": 4.2},
        {"name": "Peter Mwangi", "phone": "+254700123458", "skill": "mason", "rating": 4.0},
        {"name": "Jane Akinyi", "phone": "+254700123459", "skill": "carpenter", "rating": 4.3}
    ]
    
    fundis = []
    for fundi_data in fundis_data:
        fundi = Fundi.create(session, **fundi_data)
        fundis.append(fundi)
    
    # Create sample jobs
    jobs_data = [
        {"title": "Fix electrical wiring", "description": "Need to fix faulty wiring in kitchen"},
        {"title": "Install new taps", "description": "Replace old bathroom taps with modern ones"},
        {"title": "Build garden wall", "description": "Construct a 2-meter wall around the garden"},
        {"title": "Repair wooden door", "description": "Fix hinges and lock on front door"}
    ]
    
    for job_data in jobs_data:
        Job.create(session, **job_data)
    
    # Assign one job to show the relationship
    if fundis and session.query(Job).count() > 0:
        first_job = session.query(Job).first()
        first_job.fundi_id = fundis[0].id
        first_job.status = "assigned"
        session.commit()
    
    return f"Created {len(fundis)} fundis and {len(jobs_data)} jobs with sample data!"
