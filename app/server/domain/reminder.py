from persistence.db_config import db
from datetime import datetime

class Reminder(db.Model):
    __tablename__ = 'reminders'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    deadline = db.Column(db.DateTime, nullable=False)
    type = db.Column(db.String(255), nullable=False)
    priority = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __init__(self, title, description, deadline, type, priority, user_id, id=None):
        self.title = title
        self.description = description
        self.deadline = deadline
        self.type = type
        self.priority = priority
        self.user_id = user_id
        self.id = id
        
    def toDict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "deadline": self.deadline,
            "type": self.type,
            "priority": self.priority,
            "user_id": self.user_id
        }

    def getId(self):
        return self.id
    
    def getTitle(self):
        return self.title
    
    def getDescription(self):
        return self.description
    
    def getDeadline(self):
        return self.deadline
    
    def getType(self):
        return self.type

    def getPriority(self):
        return self.priority
    
    def getUserId(self):
        return self.user_id
    
    def setTitle(self, title):
        self.title = title

    def setDescription(self, description):
        self.description = description

    def setDeadline(self, deadline):
        self.deadline = deadline

    def setType(self, type):
        self.type = type

    def setPriority(self, priority):
        self.priority = priority