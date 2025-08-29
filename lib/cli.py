#!/usr/bin/env python3
"""
FundiMatch CLI - Simple command-line interface for managing fundis and jobs.
This CLI demonstrates basic database operations with SQLAlchemy ORM.
"""

import sys
from helpers import (
    list_fundis, create_fundi, delete_fundi, search_fundi_by_skill,
    list_jobs, create_job, delete_job, update_job_status,
    view_jobs_for_fundi, match_and_assign_job, get_pending_jobs, seed_sample_data
)
from db.models import get_session


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
    print("1) Create Fundi")
    print("2) List Fundis") 
    print("3) Search Fundis by Skill")
    print("4) Delete Fundi")
    print("5) Create Job")
    print("6) List Jobs")
    print("7) Update Job Status")
    print("8) View Jobs for a Fundi")
    print("9) Match & Assign Job")
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


def handle_create_fundi():
    """Handle creating a new fundi"""
    print("\n➕ CREATE NEW FUNDI")
    print("-" * 30)
    
    name = get_input("Enter fundi name: ")
    if not name:
        print("❌ Name cannot be empty")
        return
    
    phone = get_input("Enter phone number: ")
    if not phone:
        print("❌ Phone cannot be empty")
        return
    
    skill = get_input("Enter skill (e.g., electrician, plumber): ")
    if not skill:
        print("❌ Skill cannot be empty")
        return
    
    rating_input = get_input("Enter rating (0.0-5.0, press Enter for 0.0): ")
    rating = 0.0
    if rating_input:
        try:
            rating = float(rating_input)
            if rating < 0.0 or rating > 5.0:
                print("❌ Rating must be between 0.0 and 5.0")
                return
        except ValueError:
            print("❌ Rating must be a number")
            return
    
    # Get database session and create fundi
    session = get_session()
    try:
        fundi = create_fundi(session, name, phone, skill, rating)
        print(f"✅ Fundi created successfully!")
        print(f"   ID: {fundi.id} | Name: {fundi.name} | Skill: {fundi.skill} | Rating: {fundi.rating}")
    except ValueError as e:
        print(f"❌ Error: {e}")
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
        fundis = list_fundis(session)
        if not fundis:
            print("📭 No fundis found in the database")
            return
        
        for fundi in fundis:
            print(f"ID: {fundi.id} | {fundi.name} | {fundi.skill} | Rating: {fundi.rating} | Phone: {fundi.phone}")
        
        print(f"\n📊 Total: {len(fundis)} fundis")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        session.close()


def handle_search_fundis():
    """Handle searching fundis by skill"""
    print("\n🔍 SEARCH FUNDIS BY SKILL")
    print("-" * 30)
    
    skill = get_input("Enter skill to search: ")
    if not skill:
        print("❌ Skill cannot be empty")
        return
    
    session = get_session()
    try:
        fundis = search_fundi_by_skill(session, skill)
        if not fundis:
            print(f"📭 No fundis found with skill '{skill}'")
            return
        
        print(f"\n🔍 Results for skill '{skill}':")
        print("-" * 50)
        for fundi in fundis:
            print(f"ID: {fundi.id} | {fundi.name} | {fundi.skill} | Rating: {fundi.rating}")
        
        print(f"\n📊 Found {len(fundis)} fundis")
        
    except ValueError as e:
        print(f"❌ Error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
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
    except ValueError as e:
        print(f"❌ Error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        session.close()


def handle_create_job():
    """Handle creating a new job"""
    print("\n➕ CREATE NEW JOB")
    print("-" * 30)
    
    title = get_input("Enter job title: ")
    if not title:
        print("❌ Title cannot be empty")
        return
    
    description = get_input("Enter job description: ")
    if not description:
        print("❌ Description cannot be empty")
        return
    
    session = get_session()
    try:
        job = create_job(session, title, description)
        print(f"✅ Job created successfully!")
        print(f"   ID: {job.id} | Title: {job.title} | Status: {job.status}")
    except ValueError as e:
        print(f"❌ Error: {e}")
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
        jobs = list_jobs(session)
        if not jobs:
            print("📭 No jobs found in the database")
            return
        
        for job in jobs:
            fundi_info = f" - Assigned to {job.fundi.name}" if job.fundi else " - Unassigned"
            print(f"ID: {job.id} | {job.title} | Status: {job.status}{fundi_info}")
        
        print(f"\n📊 Total: {len(jobs)} jobs")
        
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
    print("3) completed")
    
    status_choice = get_input("Select status (1-3): ")
    status_map = {"1": "pending", "2": "assigned", "3": "completed"}
    
    if status_choice not in status_map:
        print("❌ Invalid status choice")
        return
    
    status = status_map[status_choice]
    
    session = get_session()
    try:
        job = update_job_status(session, job_id, status)
        print(f"✅ Job status updated successfully!")
        print(f"   ID: {job.id} | Title: {job.title} | New Status: {job.status}")
    except ValueError as e:
        print(f"❌ Error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        session.close()


def handle_view_fundi_jobs():
    """Handle viewing jobs for a specific fundi"""
    print("\n📋 VIEW FUNDI JOBS")
    print("-" * 30)
    
    fundi_id = get_number("Enter fundi ID (or 'q' to quit): ")
    if fundi_id is None:
        return
    
    session = get_session()
    try:
        jobs = view_jobs_for_fundi(session, fundi_id)
        if not jobs:
            print(f"📭 No jobs found for fundi ID {fundi_id}")
            return
        
        print(f"\n📋 Jobs for fundi ID {fundi_id}:")
        print("-" * 50)
        for job in jobs:
            print(f"ID: {job.id} | {job.title} | Status: {job.status}")
        
        print(f"\n📊 Total: {len(jobs)} jobs")
        
    except ValueError as e:
        print(f"❌ Error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        session.close()


def handle_match_job():
    """Handle matching and assigning a job"""
    print("\n🔗 MATCH & ASSIGN JOB")
    print("-" * 30)
    
    # Show pending jobs first
    session = get_session()
    try:
        pending_jobs = get_pending_jobs(session)
        if not pending_jobs:
            print("📭 No pending jobs available for assignment")
            return
        
        print("Available pending jobs:")
        for job in pending_jobs:
            print(f"ID: {job.id} | {job.title}")
        
        job_id = get_number("\nEnter job ID to assign (or 'q' to quit): ")
        if job_id is None:
            return
        
        # Try to match and assign
        success, message, assigned_fundi = match_and_assign_job(session, job_id)
        if success:
            print(f"✅ {message}")
            if assigned_fundi:
                print(f"   Fundi: {assigned_fundi.name} | Skill: {assigned_fundi.skill} | Rating: {assigned_fundi.rating}")
        else:
            print(f"❌ {message}")
            
    except ValueError as e:
        print(f"❌ Error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
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
        result = seed_sample_data(session)
        print(f"✅ {result}")
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
    finally:
        session.close()


def main():
    """Main CLI loop"""
    print_welcome()
    
    while True:
        print_menu()
        choice = get_input("Select option (0-9, S): ").upper()
        
        if choice == "0":
            print("\n👋 Thank you for using FundiMatch CLI!")
            print("   Goodbye!")
            break
        elif choice == "1":
            handle_create_fundi()
        elif choice == "2":
            handle_list_fundis()
        elif choice == "3":
            handle_search_fundis()
        elif choice == "4":
            handle_delete_fundi()
        elif choice == "5":
            handle_create_job()
        elif choice == "6":
            handle_list_jobs()
        elif choice == "7":
            handle_update_job_status()
        elif choice == "8":
            handle_view_fundi_jobs()
        elif choice == "9":
            handle_match_job()
        elif choice == "S":
            handle_seed_data()
        else:
            print("❌ Invalid option. Please select 0-9 or S")


if __name__ == "__main__":
    main()
