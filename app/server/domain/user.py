from persistence.db_config import db
from domain.reminder import Reminder
from domain.text_history import TextHistory
from domain.cardiovascular_health import CardiovascularHealth
from domain.diabetes_health import DiabetesHealth

class User(db.Model): 
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    firstname = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=True)
    gender = db.Column(db.String(255), nullable=True)
    profile_picture = db.Column(db.LargeBinary, nullable=True)

    reminders = db.relationship('Reminder', backref='user', lazy=True)
    text_histories = db.relationship('TextHistory', backref='user', lazy=True)
    cardiovascular_health = db.relationship('CardiovascularHealth', backref='user', lazy=True)
    diabetes_health = db.relationship('DiabetesHealth', backref='user', lazy=True)

    def __init__(self, firstname, lastname, email, password, id=None, date_of_birth=None, gender=None, profile_picture=None):
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.password = password
        self.id = id
        self.date_of_birth = date_of_birth
        self.gender = gender
        self.profile_picture = profile_picture

    def toDict(self):
        return {
            "id": self.id,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "email": self.email,
            "dateOfBirth": self.date_of_birth,
            "profilePicture": self.profile_picture
        }

    def getId(self):
        return self.id
    
    def getFirstname(self):
        return self.firstname
    
    def getLastname(self):
        return self.lastname
    
    def getEmail(self):
        return self.email
    
    def getPassword(self):
        return self.password
    
    def getDateOfBirth(self):
        return self.date_of_birth
     
    def getGender(self):
        return self.gender
    
    def getProfilePicture(self):
        return self.profile_picture
    
    def setEmail(self, email):
        self.email = email

    def setPassword(self, password):
        self.password = password

    def setDateOfBirth(self, date_of_birth):
        self.date_of_birth = date_of_birth
    
    def setGender(self, gender):
        self.gender = gender
    
    def setProfilePicture(self, profile_picture):
        self.profile_picture = profile_picture
