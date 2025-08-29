# FundiMatch CLI - Simple Fundi Management System

A beginner-friendly command-line interface for managing fundis (contractors) and jobs using Python and SQLAlchemy ORM.

## 🎯 What This Project Teaches

- **CLI Development**: Building interactive command-line applications
- **SQLAlchemy ORM**: Working with databases using Python objects
- **One-to-Many Relationships**: Understanding how Fundis can have multiple Jobs
- **Input Validation**: Safely handling user input without crashes
- **Database Operations**: Create, Read, Update, Delete (CRUD) operations

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install pipenv if you don't have it
pip install pipenv

# Install project dependencies
pipenv install

# Activate virtual environment
pipenv shell
```

### 2. Run the CLI
```bash
python lib/cli.py
```

## 📋 Available Commands

1. **Create Fundi** - Add a new contractor
2. **List Fundis** - View all fundis in the system
3. **Search Fundis by Skill** - Find fundis with specific skills
4. **Delete Fundi** - Remove a fundi from the system
5. **Create Job** - Add a new work request
6. **List Jobs** - View all jobs
7. **Update Job Status** - Change job status (pending/assigned/completed)
8. **View Jobs for a Fundi** - See all jobs assigned to a specific fundi
9. **Match & Assign Job** - Automatically assign a job to the best available fundi
10. **Seed Sample Data** - Add sample fundis and jobs to get started

## 🗄️ Database Structure

### Fundi Model
- `id`: Unique identifier
- `name`: Fundi's name
- `phone`: Phone number (unique)
- `skill`: Type of work (electrician, plumber, etc.)
- `rating`: Rating from 0.0 to 5.0

### Job Model
- `id`: Unique identifier
- `title`: Job title
- `description`: Job description
- `status`: Current status (pending/assigned/completed)
- `fundi_id`: Links to assigned fundi (optional)

## 🔗 Relationships

- **One Fundi** can have **Many Jobs**
- When a fundi is deleted, all their jobs are also deleted
- Jobs can exist without being assigned to a fundi

## 🧪 Sample Data

Use option "S" to seed the database with:
- 4 sample fundis (electrician, plumber, mason, carpenter)
- 4 sample jobs (some pending, one assigned)
- Kenyan-themed names and realistic scenarios

## 💡 Learning Points

### Why Use Sessions?
- Sessions manage database connections
- They track changes and commit them together
- Always close sessions when done

### Why Separate Helpers from CLI?
- **CLI**: Handles user input/output and menu logic
- **Helpers**: Handle database operations and business logic
- This separation makes code easier to understand and test

### Simple Matching Algorithm
The job matching system:
1. Finds fundis with skills matching the job title
2. Picks the fundi with the fewest active jobs
3. Assigns the job and updates the database

## 🚨 Error Handling

- Input validation prevents crashes
- Friendly error messages explain what went wrong
- Database errors are caught and displayed clearly
- Users can always return to the main menu

## 📁 Project Structure

```
.
├── Pipfile                    # Python dependencies
├── CLI_README.md             # This file
└── lib/
    ├── cli.py                # Main CLI interface
    ├── helpers.py             # Database operations
    └── db/
        └── models.py          # SQLAlchemy models
```

## 🔧 Troubleshooting

### Common Issues:
1. **Import Errors**: Make sure you're in the project root directory
2. **Database Locked**: Close any other Python processes
3. **Permission Errors**: Check file permissions in the project directory

### Reset Database:
```bash
# Remove the database file
rm fundimatch.db

# Run the CLI again - it will create a new database
python lib/cli.py
```

## 🎓 Next Steps

After mastering this CLI:
- Add more complex matching algorithms
- Implement user authentication
- Add data export/import features
- Build a web interface using Flask or Django

---

**Happy Learning! 🎉**

This project demonstrates fundamental concepts that you'll use in larger applications.
