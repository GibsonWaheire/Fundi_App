# FundiMatch CLI - Professional Fundi Management System

## 📋 Project Overview

**FundiMatch CLI** is a comprehensive command-line interface application that demonstrates advanced database management, user authentication, and role-based access control. This project showcases the skills learned in Moringa School's Phase 3 curriculum.

### 🎯 Problem Statement

In Kenya and many other regions, finding reliable fundis (contractors such as electricians, plumbers, and masons) is a significant challenge. Clients often rely on word of mouth, which is unreliable, while fundis lack a structured way to showcase their skills and get consistent work. This results in inefficiency, wasted time, and poor trust between clients and service providers.

**FundiMatch CLI** solves this challenge by providing a database-backed command-line interface that connects clients to fundis based on their skills, experience, and availability.

### 🚀 Key Features

- **🔐 User Authentication & Authorization**: Role-based access control (Admin, Client, Fundi)
- **👥 User Management**: Complete CRUD operations for all user types
- **🛠️ Fundi Management**: Professional profiles with skills, ratings, and availability
- **📋 Job Management**: Create, assign, and track job progress
- **📂 Category System**: Organized service categories for better matching
- **⭐ Review System**: Client feedback and rating system
- **💰 Payment Tracking**: Financial transaction management
- **📊 Analytics**: System statistics and reporting

## 🏗️ Architecture & Design

### Database Schema

The application uses **SQLAlchemy ORM** with the following models:

```
📊 Database Structure:
├── users (User authentication and profiles)
├── fundis (Extended user profiles for service providers)
├── categories (Service categories like Plumbing, Electrical)
├── jobs (Work requests and assignments)
├── reviews (Client feedback and ratings)
└── payments (Financial transactions)
```

### Key Relationships

- **One-to-Many**: User → Jobs (one user can create many jobs)
- **One-to-Many**: Fundi → Jobs (one fundi can handle many jobs)
- **One-to-Many**: Category → Jobs (one category can have many jobs)
- **One-to-Many**: Job → Reviews (one job can have multiple reviews)
- **One-to-Many**: Job → Payments (one job can have multiple payments)

## 🛠️ Technology Stack

- **Python 3.8+**: Core programming language
- **SQLAlchemy ORM**: Database abstraction and management
- **SQLite**: Lightweight database for development
- **Pipenv**: Virtual environment and dependency management
- **Alembic**: Database migrations (optional)

## 📁 Project Structure

```
FundiMatch CLI/
├── lib/
│   ├── main.py              # Main application entry point (NEW)
│   ├── cli.py               # Legacy CLI (for reference)
│   ├── helpers.py           # Helper functions and business logic (UPDATED)
│   └── db/
│       ├── models.py        # SQLAlchemy ORM models (UPDATED)
│       ├── migrations/      # Database migration files
│       └── seed.py          # Sample data population (NEW)
├── Pipfile                  # Python dependencies
├── Pipfile.lock            # Locked dependency versions
├── fundimatch.db           # SQLite database file
├── db.json                 # Web app data (used for seeding)
├── README.md               # Main project documentation
└── CLI_README.md           # CLI-specific documentation
```

## 🚀 Installation & Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Git (for cloning the repository)

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd FundiMatch-CLI
   ```

2. **Setup Virtual Environment with Pipenv**
   ```bash
   # Install pipenv if not already installed
   pip install pipenv
   
   # Install dependencies
   pipenv install
   
   # Activate virtual environment
   pipenv shell
   ```

3. **Initialize Database**
   ```bash
   # Seed the database with sample data from db.json
   python lib/db/seed.py
   ```

4. **Run the Application**
   ```bash
   # Run the main CLI application
   python lib/main.py
   
   # Or run the legacy CLI
   python lib/cli.py
   ```

## 🎮 Usage Guide

### Starting the Application

```bash
python lib/main.py
```

You'll see the welcome screen:
```
🛠️  FUNDIMATCH CLI - Professional Fundi Management System
============================================================
📋 This CLI helps you manage fundis, jobs, and clients
🔐 Features: User authentication, role-based access, job matching
💾 Database: SQLite with SQLAlchemy ORM
👨‍💻 Author: Gibson Giteru (Moringa School Phase 3)
============================================================
```

### User Roles & Access Levels

#### 👤 Guest (Not Logged In)
- Login to existing account
- Register as new client
- Register as new fundi
- View available fundis
- View job categories

#### 👤 Client
- Find and hire fundis
- Create job requests
- View job status and progress
- Leave reviews for completed jobs
- View payment history
- Update profile information

#### 🛠️ Fundi
- View assigned jobs
- Update job status and progress
- Set availability status
- View client reviews and ratings
- Track earnings and payments
- Update professional profile

#### 🔧 Admin
- Manage all users (create, update, delete)
- Manage fundi profiles
- Monitor all jobs and assignments
- Manage service categories
- View system statistics
- Database maintenance

### Key Commands & Features

#### User Management
```bash
# Register as client
1) Register as Client
   → Enter username, email, password, phone
   → Account created and auto-login

# Register as fundi
3) Register as Fundi
   → Create user account
   → Create professional profile
   → Set specialization, experience, rates
```

#### Job Management
```bash
# Create job request (Client)
2) Create Job Request
   → Enter job title, description, location
   → Select service category
   → Job created and available for fundis

# Assign job to fundi (Admin)
3) Manage Jobs
   → View pending jobs
   → Assign to available fundis
   → Track job progress
```

#### Fundi Operations
```bash
# Update job status (Fundi)
2) Update Job Status
   → pending → assigned → in_progress → completed
   → Automatic status tracking and timestamps

# View earnings (Fundi)
5) View My Earnings
   → Track completed jobs
   → View payment history
   → Calculate total earnings
```

## 📊 Database Operations

### CRUD Operations Demonstrated

#### Create (C)
- User registration with validation
- Fundi profile creation
- Job request creation
- Category management
- Review and payment records

#### Read (R)
- User authentication and lookup
- Fundi search by specialization
- Job filtering by status
- Review aggregation
- Payment history tracking

#### Update (U)
- Job status updates
- Fundi availability changes
- User profile updates
- Rating calculations

#### Delete (D)
- User account deletion
- Fundi profile removal
- Job cancellation
- Category cleanup

### Advanced Features

#### 🔍 Search & Filtering
```python
# Find fundis by specialization
fundis = Fundi.find_by_specialization(session, "Electrical")

# Find jobs by status
pending_jobs = Job.find_by_status(session, "pending")

# Find user by role
clients = User.find_by_role(session, "client")
```

#### 📈 Analytics & Reporting
```python
# System statistics
total_users = len(User.get_all(session))
total_jobs = len(Job.get_all(session))
completion_rate = len(completed_jobs) / len(total_jobs) * 100
```

## 🧪 Testing & Sample Data

### Seeding Sample Data

The application includes a comprehensive data seeding function that imports data from `db.json`:

```bash
# Run the seeding script
python lib/db/seed.py

# This will:
# 1. Create default admin user
# 2. Import all users from db.json
# 3. Create fundi profiles
# 4. Create categories
# 5. Create jobs and relationships
# 6. Create reviews and payments
```

### Sample Data Structure

```python
# Sample Users
admin = User(username="admin", email="admin@example.com", role="admin")
client = User(username="testuser", email="client@example.com", role="client")
fundi = User(username="testfundi", email="fundi@example.com", role="fundi")

# Sample Categories
categories = ["Plumbing", "Electrical", "Carpentry", "Painting", "Cleaning"]

# Sample Jobs
job = Job(title="Fix leaking sink", description="Kitchen sink repair", 
          status="pending", client_id=client.id, category_id=1)
```

### Login Credentials

After seeding, you can use the sample data provided in the database. The seeding script creates default users for testing purposes. Contact the developer for access credentials.

## 🔧 Development & Customization

### Adding New Features

#### 1. Database Models
```python
# Add new model in lib/db/models.py
class NewFeature(Base):
    __tablename__ = "new_features"
    id = Column(Integer, primary_key=True, index=True)
    # Add your fields here
```

#### 2. Helper Functions
```python
# Add helper functions in lib/helpers.py
def new_feature_function(session, **kwargs):
    """Documentation for new feature"""
    try:
        # Implementation here
        pass
    except Exception as e:
        print(f"❌ Error: {str(e)}")
```

#### 3. CLI Integration
```python
# Add to main.py in appropriate menu handler
def handle_new_feature(self):
    """Handle new feature in CLI"""
    # Implementation here
```

### Database Migrations

For production use, implement proper migrations:

```bash
# Initialize Alembic
alembic init migrations

# Create migration
alembic revision --autogenerate -m "Add new feature"

# Apply migration
alembic upgrade head
```

## 📚 Learning Objectives Demonstrated

### Python Fundamentals
- ✅ Object-Oriented Programming (Classes, Inheritance)
- ✅ Error Handling (Try-Catch, Exception Management)
- ✅ Data Structures (Lists, Dictionaries, Tuples)
- ✅ File I/O and JSON handling
- ✅ Module imports and package structure

### Database & ORM
- ✅ SQLAlchemy ORM implementation
- ✅ Database relationships (One-to-Many, Many-to-Many)
- ✅ CRUD operations with proper error handling
- ✅ Database session management
- ✅ Query optimization and filtering

### CLI Development
- ✅ Command-line interface design
- ✅ User input validation and sanitization
- ✅ Menu-driven navigation
- ✅ Interactive user experience
- ✅ Error recovery and graceful degradation

### Software Engineering
- ✅ Project structure and organization
- ✅ Code documentation and comments
- ✅ Version control with Git
- ✅ Dependency management with Pipenv
- ✅ Testing and debugging practices

## 🎓 Presentation Notes

### Key Points to Highlight

1. **Problem-Solving Approach**
   - Identified real-world problem in Kenya
   - Researched existing solutions (fundis.co.ke)
   - Designed comprehensive solution

2. **Technical Implementation**
   - SQLAlchemy ORM for database abstraction
   - Role-based access control
   - Comprehensive CRUD operations
   - Error handling and validation

3. **User Experience**
   - Intuitive CLI interface
   - Role-specific menus
   - Clear feedback and error messages
   - Comprehensive help system

4. **Scalability & Extensibility**
   - Modular code structure
   - Easy to add new features
   - Database migration support
   - Production-ready architecture

### Demo Script

1. **Start Application**
   ```bash
   python lib/main.py
   ```

2. **Show Guest Features**
   - View available fundis
   - Browse categories
   - Demonstrate registration process

3. **Client Workflow**
   - Register as client
   - Create job request
   - Show job tracking

4. **Fundi Workflow**
   - Register as fundi
   - Create professional profile
   - Show job management

5. **Admin Features**
   - Login as admin
   - Show user management
   - Display system statistics

6. **Database Operations**
   - Show sample data
   - Demonstrate search functionality
   - Display relationships

## 🚀 Future Enhancements

### Phase 4 Improvements
- **Web Application**: Convert CLI to web interface
- **Mobile App**: React Native or Flutter implementation
- **Real-time Notifications**: SMS/WhatsApp integration
- **Payment Integration**: M-Pesa API integration
- **Location Services**: GPS-based fundi matching
- **Advanced Analytics**: Business intelligence dashboard

### Technical Upgrades
- **Authentication**: JWT tokens and password hashing
- **API Development**: RESTful API for web/mobile apps
- **Cloud Deployment**: AWS/Azure hosting
- **Performance**: Database optimization and caching
- **Security**: Input validation and SQL injection prevention

## 👨‍💻 Author Information

**Name**: Gibson Giteru  
**Email**: gibson.giteru@student.moringaschool.com  
**School**: Moringa School  
**Phase**: 3 - CLI Development  
**Project**: FundiMatch CLI  

## 📄 License

This project is created for educational purposes under Moringa School's Phase 3 requirements. All code and documentation are provided as-is for learning and demonstration purposes.

---

**🎉 Thank you for exploring FundiMatch CLI! This project demonstrates the power of combining database management, user authentication, and command-line interfaces to solve real-world problems.**
