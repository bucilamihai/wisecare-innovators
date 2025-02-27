from app import app
from persistence.db_config import db
from domain.user import User
from domain.reminder import Reminder

with app.app_context():
    db.create_all()
    print("Database created successfully!")
