#!/usr/bin/env python3
"""
FundiMatch CLI - Simple command-line interface for managing fundis and jobs.
This CLI demonstrates basic database operations with SQLAlchemy ORM.
"""

import sys
from helpers import (
    list_fundis, create_fundi_profile, delete_fundi, search_fundis,
    list_jobs, create_job, delete_job, update_job_status,
    view_job_details, assign_job_to_fundi, list_jobs_by_status, seed_sample_data,
    create_user, list_users, delete_user, list_categories, create_category
)
from db.models import get_session, User, Fundi, Job, Category


def print_welcome():
    """Show welcome message"""
    print("\n" + "="*50)
    print("🛠️  FUNDIMATCH CLI - Fundi Management System")
    print("="*50)
    print("Welcome! This CLI helps you manage fundis (contractors) and jobs.")
    print("All data is stored in a SQLite database called 'fundimatch.db'")
    print("="*50)


def print_menu():
    """Show the main menu"""
    print("\n📋 MAIN MENU")
    print("1) Create User")
    print("2) List Users") 
    print("3) Create Fundi Profile")
    print("4) List Fundis")
    print("5) Search Fundis")
    print("6) Delete Fundi")
    print("7) Create Job")
    print("8) List Jobs")
    print("9) Update Job Status")
    print("10) View Job Details")
    print("11) Assign Job to Fundi")
    print("12) List Categories")
    print("S) Seed Sample Data")
    print("0) Exit")
    print("-" * 30)


def get_input(prompt):
    """Get user input safely - never crash on bad input"""
    try:
        return input(prompt).strip()
    except (KeyboardInterrupt, EOFError):
        print("\n\n👋 Goodbye!")
        sys.exit(0)


def get_number(prompt):
    """Get a number from user input"""
    while True:
        try:
            user_input = get_input(prompt)
            if user_input.lower() == 'q':
                return None
            return int(user_input)
        except ValueError:
            print("❌ Please enter a valid number (or 'q' to quit)")


def handle_create_user():
    """Handle creating a new user"""
    print("\n➕ CREATE NEW USER")
    print("-" * 30)
    
    username = get_input("Enter username: ")
    if not username:
        print("❌ Username cannot be empty")
        return
    
    email = get_input("Enter email: ")
    if not email:
        print("❌ Email cannot be empty")
        return
    
    password = get_input("Enter password: ")
    if not password:
        print("❌ Password cannot be empty")
        return
    
    phone = get_input("Enter phone number: ")
    if not phone:
        print("❌ Phone cannot be empty")
        return
    
    print("\nAvailable roles:")
    print("1) client")
    print("2) fundi") 
    print("3) admin")
    
    role_choice = get_input("Select role (1-3): ")
    role_map = {"1": "client", "2": "fundi", "3": "admin"}
    
    if role_choice not in role_map:
        print("❌ Invalid role choice")
        return
    
    role = role_map[role_choice]
    
    # Get database session and create user
    session = get_session()
    try:
        user = create_user(session, username=username, email=email, password=password, phone=phone, role=role)
        if user:
            print(f"✅ User created successfully!")
            print(f"   ID: {user.id} | Username: {user.username} | Role: {user.role}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        session.close()


def handle_list_users():
    """Handle listing all users"""
    print("\n👥 ALL USERS")
    print("-" * 50)
    
    session = get_session()
    try:
        list_users(session)
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        session.close()


def handle_create_fundi_profile():
    """Handle creating a new fundi profile"""
    print("\n➕ CREATE FUNDI PROFILE")
    print("-" * 30)
    
    # First, show available users with fundi role
    session = get_session()
    try:
        fundi_users = User.find_by_role(session, 'fundi')
        if not fundi_users:
            print("❌ No users with 'fundi' role found. Please create a fundi user first.")
            return
        
        print("Available fundi users:")
        for user in fundi_users:
            print(f"ID: {user.id} | {user.username} | {user.email}")
        
        user_id = get_number("Enter user ID to create fundi profile: ")
        if user_id is None:
            return
        
        # Check if user exists and is a fundi
        user = User.find_by_id(session, user_id)
        if not user or user.role != 'fundi':
            print("❌ User not found or not a fundi")
            return
        
        specialization = get_input("Enter specialization (e.g., plumbing, electrical): ")
        if not specialization:
            print("❌ Specialization cannot be empty")
            return
        
        experience = get_input("Enter experience (e.g., 5 years): ")
        if not experience:
            print("❌ Experience cannot be empty")
            return
        
        hourly_rate_input = get_input("Enter hourly rate (KES): ")
        if not hourly_rate_input:
            print("❌ Hourly rate cannot be empty")
            return
        
        try:
            hourly_rate = float(hourly_rate_input)
        except ValueError:
            print("❌ Hourly rate must be a number")
            return
        
        location = get_input("Enter location: ")
        if not location:
            print("❌ Location cannot be empty")
            return
        
        bio = get_input("Enter bio (optional): ")
        
        # Create fundi profile
        fundi = create_fundi_profile(
            session, 
            user_id=user_id,
            specialization=specialization,
            experience=experience,
            hourly_rate=hourly_rate,
            location=location,
            bio=bio
        )
        
        if fundi:
            print(f"✅ Fundi profile created successfully!")
            print(f"   ID: {fundi.id} | User: {user.username} | Specialization: {fundi.specialization}")
            
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        session.close()


def handle_list_fundis():
    """Handle listing all fundis"""
    print("\n👷 ALL FUNDIS")
    print("-" * 50)
    
    session = get_session()
    try:
        list_fundis(session)
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        session.close()


def handle_search_fundis():
    """Handle searching fundis"""
    print("\n🔍 SEARCH FUNDIS")
    print("-" * 30)
    
    specialization = get_input("Enter specialization to search (or press Enter to skip): ")
    location = get_input("Enter location to search (or press Enter to skip): ")
    
    if not specialization and not location:
        print("❌ Please provide at least one search criteria")
        return
    
    session = get_session()
    try:
        search_fundis(session, specialization=specialization, location=location)
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        session.close()


def handle_delete_fundi():
    """Handle deleting a fundi"""
    print("\n🗑️  DELETE FUNDI")
    print("-" * 30)
    
    fundi_id = get_number("Enter fundi ID to delete (or 'q' to quit): ")
    if fundi_id is None:
        return
    
    session = get_session()
    try:
        success = delete_fundi(session, fundi_id)
        if success:
            print(f"✅ Fundi with ID {fundi_id} deleted successfully!")
        else:
            print(f"❌ Failed to delete fundi with ID {fundi_id}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        session.close()


def handle_create_job():
    """Handle creating a new job"""
    print("\n➕ CREATE NEW JOB")
    print("-" * 30)
    
    # Show available categories
    session = get_session()
    try:
        categories = list_categories(session)
        if not categories:
            print("❌ No categories found. Please create categories first.")
            return
        
        # Show available clients
        clients = User.find_by_role(session, 'client')
        if not clients:
            print("❌ No clients found. Please create client users first.")
            return
        
        print("Available clients:")
        for client in clients:
            print(f"ID: {client.id} | {client.username} | {client.email}")
        
        client_id = get_number("Enter client ID: ")
        if client_id is None:
            return
        
        # Check if client exists
        client = User.find_by_id(session, client_id)
        if not client or client.role != 'client':
            print("❌ Client not found")
            return
        
        title = get_input("Enter job title: ")
        if not title:
            print("❌ Title cannot be empty")
            return
        
        description = get_input("Enter job description: ")
        if not description:
            print("❌ Description cannot be empty")
            return
        
        location = get_input("Enter job location: ")
        if not location:
            print("❌ Location cannot be empty")
            return
        
        category_id = get_number("Enter category ID: ")
        if category_id is None:
            return
        
        # Check if category exists
        category = session.query(Category).filter(Category.id == category_id).first()
        if not category:
            print("❌ Category not found")
            return
        
        # Create job
        job = create_job(
            session, 
            title=title,
            description=description,
            location=location,
            client_id=client_id,
            category_id=category_id
        )
        
        if job:
            print(f"✅ Job created successfully!")
            print(f"   ID: {job.id} | Title: {job.title} | Status: {job.status}")
            
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        session.close()


def handle_list_jobs():
    """Handle listing all jobs"""
    print("\n📋 ALL JOBS")
    print("-" * 50)
    
    session = get_session()
    try:
        list_jobs(session)
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        session.close()


def handle_update_job_status():
    """Handle updating job status"""
    print("\n🔄 UPDATE JOB STATUS")
    print("-" * 30)
    
    job_id = get_number("Enter job ID (or 'q' to quit): ")
    if job_id is None:
        return
    
    print("\nAvailable statuses:")
    print("1) pending")
    print("2) assigned") 
    print("3) in_progress")
    print("4) completed")
    print("5) cancelled")
    
    status_choice = get_input("Select status (1-5): ")
    status_map = {"1": "pending", "2": "assigned", "3": "in_progress", "4": "completed", "5": "cancelled"}
    
    if status_choice not in status_map:
        print("❌ Invalid status choice")
        return
    
    status = status_map[status_choice]
    
    session = get_session()
    try:
        success = update_job_status(session, job_id, status)
        if success:
            print(f"✅ Job status updated successfully!")
        else:
            print(f"❌ Failed to update job status")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        session.close()


def handle_view_job_details():
    """Handle viewing job details"""
    print("\n📋 VIEW JOB DETAILS")
    print("-" * 30)
    
    job_id = get_number("Enter job ID (or 'q' to quit): ")
    if job_id is None:
        return
    
    session = get_session()
    try:
        view_job_details(session, job_id)
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        session.close()


def handle_assign_job():
    """Handle assigning a job to a fundi"""
    print("\n🔗 ASSIGN JOB TO FUNDI")
    print("-" * 30)
    
    # Show pending jobs first
    session = get_session()
    try:
        pending_jobs = list_jobs_by_status(session, "pending")
        if not pending_jobs:
            print("📭 No pending jobs available for assignment")
            return
        
        # Show available fundis
        available_fundis = Fundi.find_available(session)
        if not available_fundis:
            print("📭 No available fundis found")
            return
        
        print("Available fundis:")
        for fundi in available_fundis:
            print(f"ID: {fundi.id} | {fundi.user.username} | {fundi.specialization}")
        
        job_id = get_number("Enter job ID to assign: ")
        if job_id is None:
            return
        
        fundi_id = get_number("Enter fundi ID to assign to: ")
        if fundi_id is None:
            return
        
        # Try to assign job
        success = assign_job_to_fundi(session, job_id, fundi_id)
        if success:
            print(f"✅ Job assigned successfully!")
        else:
            print(f"❌ Failed to assign job")
            
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        session.close()


def handle_list_categories():
    """Handle listing categories"""
    print("\n📂 JOB CATEGORIES")
    print("-" * 30)
    
    session = get_session()
    try:
        list_categories(session)
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        session.close()


def handle_seed_data():
    """Handle seeding sample data"""
    print("\n🌱 SEED SAMPLE DATA")
    print("-" * 30)
    
    confirm = get_input("This will add sample fundis and jobs. Continue? (y/n): ")
    if confirm.lower() != 'y':
        print("❌ Seeding cancelled")
        return
    
    session = get_session()
    try:
        seed_sample_data(session)
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
    finally:
        session.close()


def main():
    """Main CLI loop"""
    print_welcome()
    
    while True:
        print_menu()
        choice = get_input("Select option (0-12, S): ").upper()
        
        if choice == "0":
            print("\n👋 Thank you for using FundiMatch CLI!")
            print("   Goodbye!")
            break
        elif choice == "1":
            handle_create_user()
        elif choice == "2":
            handle_list_users()
        elif choice == "3":
            handle_create_fundi_profile()
        elif choice == "4":
            handle_list_fundis()
        elif choice == "5":
            handle_search_fundis()
        elif choice == "6":
            handle_delete_fundi()
        elif choice == "7":
            handle_create_job()
        elif choice == "8":
            handle_list_jobs()
        elif choice == "9":
            handle_update_job_status()
        elif choice == "10":
            handle_view_job_details()
        elif choice == "11":
            handle_assign_job()
        elif choice == "12":
            handle_list_categories()
        elif choice == "S":
            handle_seed_data()
        else:
            print("❌ Invalid option. Please select 0-12 or S")


if __name__ == "__main__":
    main()
