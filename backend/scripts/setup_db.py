"""
Script to initialize the SQLite database and create tables.
Run this script before starting the FastAPI server for the first time.
"""

from ..database import engine, Base
from ..models import (
    Proyecto,
    Personaje,
    Narrativa,
    Trama,
    EstructuraNarrativa,
)
import os


def create_tables():
    """Create all database tables."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")


def drop_tables():
    """Drop all database tables (WARNING: This will delete all data!)."""
    import sys
    print("WARNING: This will delete ALL data in the database!")
    confirm = input("Are you sure? (yes/no): ")
    if confirm.lower() == "yes":
        print("Dropping database tables...")
        Base.metadata.drop_all(bind=engine)
        print("Tables dropped successfully!")
    else:
        print("Operation cancelled.")
        sys.exit(1)


def check_db_exists():
    """Check if the database file exists."""
    db_url = str(engine.url)
    if db_url.startswith("sqlite:///"):
        db_path = db_url.replace("sqlite:///", "")
        return os.path.exists(db_path)
    return False


def main():
    """Main function."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Database setup script for Guiones")
    parser.add_argument("--drop", action="store_true", help="Drop all tables (WARNING: deletes all data!)")
    parser.add_argument("--force", action="store_true", help="Force table creation even if database exists")
    
    args = parser.parse_args()
    
    if args.drop:
        drop_tables()
    
    if not check_db_exists() or args.force:
        create_tables()
    else:
        print("Database already exists. Use --force to recreate tables or --drop to delete all data.")


if __name__ == "__main__":
    main()
