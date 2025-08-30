# FundiMatch CLI - Professional Presentation
## Gibson Giteru | Moringa School Phase 3

---

## 🎯 **Project Overview**

### **What is FundiMatch CLI?**
A comprehensive Command-Line Interface (CLI) application that manages a professional fundi (contractor) matching system. Built with Python, SQLAlchemy ORM, and modern CLI design patterns.

### **Core Purpose**
- Connect clients with skilled fundis (plumbers, electricians, carpenters, etc.)
- Manage job assignments and tracking
- Handle user authentication and role-based access
- Provide comprehensive reporting and analytics

---

## 🏗️ **Technical Architecture**

### **Technology Stack**
```
┌─────────────────┐
│   Python 3.x    │ ← Core Language
├─────────────────┤
│  SQLAlchemy ORM │ ← Database Layer
├─────────────────┤
│   SQLite DB     │ ← Data Storage
├─────────────────┤
│   Pipenv        │ ← Dependency Management
└─────────────────┘
```

### **Project Structure**
```
lib/
├── main.py           # Main application entry point
├── cli.py            # CLI interface and menu system
├── helpers.py        # Business logic and utilities
└── db/
    ├── models.py     # SQLAlchemy ORM models
    └── migrations/   # Database schema versions
```

---

## 🗄️ **Database Design**

### **Entity Relationship Diagram**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Users    │    │   Fundis    │    │    Jobs     │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ username    │    │ username    │    │ title       │
│ email       │    │ email       │    │ description │
│ password    │    │ password    │    │ status      │
│ phone       │    │ phone       │    │ client_id   │
│ role        │    │ specialization│   │ fundi_id    │
│ is_active   │    │ experience  │    │ budget      │
│ created_at  │    │ hourly_rate │    │ created_at  │
└─────────────┘    │ location    │    └─────────────┘
                   │ is_available│
                   └─────────────┘
                          │
                          │
                   ┌─────────────┐    ┌─────────────┐
                   │ Categories  │    │   Reviews   │
                   ├─────────────┤    ├─────────────┤
                   │ id (PK)     │    │ id (PK)     │
                   │ name        │    │ rating      │
                   │ description │    │ comment     │
                   └─────────────┘    │ job_id      │
                                      │ fundi_id    │
                                      └─────────────┘
```

### **Key Relationships**
- **One-to-Many**: User → Jobs (clients create jobs)
- **One-to-Many**: Fundi → Jobs (fundis assigned to jobs)
- **Many-to-Many**: Jobs ↔ Categories (jobs can have multiple categories)
- **One-to-Many**: Job → Reviews (jobs can have multiple reviews)

---

## 🔐 **Authentication & Authorization**

### **User Roles**
```python
# Three distinct user types with different permissions
ROLES = {
    "admin": "Full system access and management",
    "client": "Create jobs, hire fundis, leave reviews",
    "fundi": "View jobs, accept assignments, update status"
}
```

### **Session Management**
- Secure login/logout system
- Role-based menu access
- Session persistence during CLI session
- Automatic logout on inactivity

---

## 🎨 **User Interface Design**

### **Main Menu System**
```
🛠️  FUNDIMATCH CLI - Professional Fundi Management System
==========================================================
📋 This CLI helps you manage fundis, jobs, and clients
🔐 Features: User authentication, role-based access, job matching
💾 Database: SQLite with SQLAlchemy ORM
👨‍💻 Author: Gibson Giteru (Moringa School Phase 3)
==========================================================

🔐 Authentication Menu:
1. Login
2. Register
3. Exit

Please select an option (1-3): 
```

### **Role-Based Menus**
```python
# Admin Menu
1. User Management
2. Fundi Management  
3. Job Management
4. Category Management
5. Reviews & Payments
6. System Reports
7. Logout

# Client Menu
1. Browse Fundis
2. Post a Job
3. My Jobs
4. My Reviews
5. Profile Settings
6. Logout

# Fundi Menu
1. Available Jobs
2. My Assignments
3. Update Availability
4. My Reviews
5. Profile Settings
6. Logout
```

---

## 💾 **Database Operations (CRUD)**

### **Create Operations**
```python
# Creating a new user
def create_user(session, username, email, password, phone, role="client"):
    user = User(
        username=username,
        email=email,
        password=password,  # In production: hashed
        phone=phone,
        role=role
    )
    session.add(user)
    session.commit()
    return user
```

### **Read Operations**
```python
# Finding fundis by specialization
def search_fundis(session, specialization=None, location=None):
    query = session.query(Fundi)
    if specialization:
        query = query.filter(Fundi.specialization == specialization)
    if location:
        query = query.filter(Fundi.location == location)
    return query.all()
```

### **Update Operations**
```python
# Updating fundi availability
def update_fundi_availability(session, fundi_id, is_available):
    fundi = session.query(Fundi).filter(Fundi.id == fundi_id).first()
    if fundi:
        fundi.is_available = is_available
        session.commit()
        return True
    return False
```

### **Delete Operations**
```python
# Deleting a job with cascade
def delete_job(session, job_id):
    job = session.query(Job).filter(Job.id == job_id).first()
    if job:
        session.delete(job)
        session.commit()
        return True
    return False
```

---

## 🔍 **Advanced Features**

### **Search & Filtering**
- Fundi search by specialization, location, availability
- Job filtering by status, budget range, category
- User search by role, email, username

### **Data Validation**
```python
def validate_email(email):
    """Validate email format"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate Kenyan phone number"""
    import re
    pattern = r'^\+254[17]\d{8}$'
    return re.match(pattern, phone) is not None
```

### **Error Handling**
```python
try:
    user = create_user(session, username, email, password, phone)
    print(f"✅ User '{username}' created successfully!")
except Exception as e:
    print(f"❌ Error creating user: {str(e)}")
    session.rollback()
```

---

## 📊 **Reporting & Analytics**

### **System Reports**
- Total users by role
- Job completion rates
- Fundi performance metrics
- Revenue tracking
- Popular service categories

### **Data Export**
```python
def export_data(session, format="json"):
    """Export database data for backup or analysis"""
    data = {
        "users": [user.to_dict() for user in session.query(User).all()],
        "fundis": [fundi.to_dict() for fundi in session.query(Fundi).all()],
        "jobs": [job.to_dict() for job in session.query(Job).all()]
    }
    return data
```

---

## 🚀 **Key Technical Achievements**

### **1. Object-Relational Mapping (ORM)**
- Clean separation between database and application logic
- Type-safe database operations
- Automatic relationship management

### **2. Role-Based Access Control**
- Secure authentication system
- Granular permissions per user type
- Session management and security

### **3. Scalable Architecture**
- Modular code structure
- Separation of concerns
- Easy to extend and maintain

### **4. User Experience**
- Intuitive menu system
- Clear error messages
- Helpful prompts and validation

---

## 🧪 **Testing & Quality Assurance**

### **Input Validation**
- Email format validation
- Phone number validation
- Password strength requirements
- Data type checking

### **Error Handling**
- Graceful error recovery
- User-friendly error messages
- Database transaction rollback
- Session cleanup

### **Data Integrity**
- Foreign key constraints
- Unique constraints
- Required field validation
- Cascade operations

---

## 📈 **Performance & Optimization**

### **Database Optimization**
- Indexed primary keys
- Efficient query patterns
- Connection pooling
- Transaction management

### **Memory Management**
- Proper session cleanup
- Resource disposal
- Memory-efficient data structures

---

## 🔮 **Future Enhancements**

### **Planned Features**
- API integration with web application
- Real-time notifications
- Advanced analytics dashboard
- Multi-language support
- Cloud database integration

### **Scalability Improvements**
- PostgreSQL migration
- Caching layer
- Background job processing
- Microservices architecture

---

## 🎓 **Learning Outcomes**

### **Technical Skills Demonstrated**
- **Python Programming**: Advanced OOP, error handling, data structures
- **Database Design**: ERD, normalization, relationships
- **SQLAlchemy ORM**: Object-relational mapping, query optimization
- **CLI Development**: User interface design, input validation
- **Software Architecture**: Modular design, separation of concerns

### **Soft Skills Developed**
- **Problem Solving**: Complex system design and implementation
- **Documentation**: Comprehensive code comments and README
- **Project Management**: Feature planning and implementation
- **Testing**: Quality assurance and validation

---

## 🏆 **Project Highlights**

### **✅ Completed Successfully**
- Complete CRUD operations for all entities
- Multi-role authentication system
- Comprehensive error handling
- Professional CLI interface
- Database migration system
- Data validation and security
- Reporting and analytics
- Modular, maintainable code

### **🎯 Business Value**
- Streamlined fundi management
- Improved job matching efficiency
- Better client experience
- Data-driven decision making
- Scalable foundation for growth

---

## 📞 **Contact & Demo**

### **Author**: Gibson Giteru
### **Institution**: Moringa School Phase 3
### **Email**: g.waheir00@gmail.com
### **GitHub**: [Project Repository](https://github.com/GibsonWaheire/Fundi_App)

### **Live Demo**
```bash
# Navigate to project directory
cd Fundi_App/lib

# Install dependencies
pipenv install

# Run the CLI application
python main.py
```

---

## 🙏 **Thank You!**

**Questions & Discussion Welcome!**

*This presentation demonstrates a complete, production-ready CLI application with modern software engineering practices, comprehensive documentation, and professional-grade features.*
