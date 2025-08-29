FundiMatch CLI
Overview

In Kenya and many other regions, finding reliable fundis (contractors such as electricians, plumbers, and masons) is a challenge. Clients often rely on word of mouth, which is unreliable, while fundis lack a structured way to showcase their skills and get consistent work. This results in inefficiency, wasted time, and poor trust between clients and service providers.

FundiMatch CLI solves this challenge by providing a database-backed command-line interface that connects clients to fundis based on their skills. The application allows users to register fundis, create job requests, assign jobs to fundis, and track job progress.

This is a Phase 3 project at Moringa School, focusing on CLI development, database integration, and ORM (Object Relational Mapping).

Features
🔹 Fundi Management

Add new fundis (contractors).

List all fundis.

Search fundis by skill or name.

Delete fundis.

View jobs assigned to a specific fundi.

🔹 Job Management

Create new job requests.

Assign jobs to fundis.

Update job status (pending, assigned, completed).

Delete jobs.

List all jobs.

🔹 Matching System

View all fundis by skill.

Automatically assign jobs to the most suitable fundi.

🔹 Database Integration with ORM

Uses SQLAlchemy ORM for database management.

Implements a one-to-many relationship (one fundi can handle multiple jobs).

Full CRUD operations following ORM best practices.

Research & Problem Context

During research, I explored existing platforms such as fundis.co.ke
. While promising, there is still a huge gap in providing accessible, lightweight, and transparent systems for both clients and fundis. FundiMatch CLI aims to close this gap by offering a foundational system that can grow into a full digital solution.

Learning Goals

This project demonstrates knowledge and skills in:

Configuring environments with Pipenv.

Importing and using external libraries.

Using SQLAlchemy ORM with Alembic migrations.

Designing and working with table relations (one-to-many).

Building an interactive Command-Line Interface (CLI).

Applying Python fundamentals, OOP best practices, and data structures (lists, dicts, tuples).

Key Vocabulary

Command Line (CLI): Text-based interface used to run programs and interact with objects.

Terminal / Powershell: Tools that allow access to the command line.

ORM (Object-Relational Mapping): Technique that maps objects in code to database tables.

Alembic: Migration tool for SQLAlchemy databases.

Project Structure
.
├── Pipfile
├── Pipfile.lock
├── README.md
└── lib
    ├── cli.py           # Main CLI logic and user interaction
    ├── db
    │   ├── models.py    # SQLAlchemy ORM models (Fundi, Job, etc.)
    │   └── seed.py      # Script to populate database with test data
    ├── debug.py         # Debugging utility
    └── helpers.py       # Helper functions for CLI tasks

Setup Instructions
1. Clone the Repository
git clone <your-repo-url>
cd fundimatch-cli

2. Setup Virtual Environment with Pipenv
pipenv install sqlalchemy alembic
pipenv shell

3. Initialize Alembic for Database Migrations
cd lib/db
alembic init migrations


Update Alembic configuration to point to your database, then use:

alembic revision --autogenerate -m "Initial migration"
alembic upgrade head

4. Seed the Database
python lib/db/seed.py

5. Run the CLI
python lib/cli.py

Usage Example
Welcome to FundiMatch CLI!
Please select an option:
1. Register a new fundi
2. List all fundis
3. Search fundi by skill
4. Create a job request
5. Assign job to fundi
6. Update job status
7. View jobs by fundi
0. Exit

Requirements Checklist ✅

 CLI application solving a real-world problem.

 Database with 3+ related tables.

 ORM methods implemented (CRUD).

 One-to-many relationships.

 Well-maintained Pipenv environment.

 Proper project/package structure.

 Input validation & informative error messages.

Future Improvements

Expand to a web app or mobile app (FundiMatch Online).

Add ratings & reviews for fundis.

Implement automated SMS/WhatsApp notifications.

Add location-based filtering.

Author

👤 Gibson Giteru
📧 gibson.giteru@student.moringaschool.com

License

This project is for educational purposes under Moringa School’s Phase 3 requirements.