from persistence.user_repository import UserRepository
from domain.user import User
import base64
from datetime import datetime

class UserService:
    def __init__(self):
        self.repository = UserRepository()

    def addUser(self, firstname, lastname, email, password):
        user = User(firstname, lastname, email, password)
        if(self.repository.getUserByEmail(user.email)):
            raise Exception("User email already exists!")
        self.repository.addUser(user)

    def getUserById(self, id):
        user = self.repository.getUserById(id)
        if not user:
            raise Exception("User not found!")
        
        if user.profile_picture:
            user.profile_picture = base64.b64encode(user.profile_picture).decode('utf-8')
        return user

    def getUserByEmail(self, email, password):
        user = self.repository.getUserByEmail(email)
        if not user:
            raise Exception("User not found!")
        if user.password != password:
            raise Exception("Invalid password!")
        
        if user.profile_picture:
            user.profile_picture = base64.b64encode(user.profile_picture).decode('utf-8')
        return user
    
    def updateUser(self, id, firstname, lastname, email, password, date_of_birth, gender, profile_picture):
        user = self.repository.getUserById(id)
        if not user:
            raise Exception("User not found!")
        if firstname:
            user.firstname = firstname
        if lastname:
            user.lastname = lastname
        if email:
            if(self.repository.getUserByEmail(email)):
                raise Exception("User email already exists!")
            user.email = email
        if password:
            user.password = password
        if date_of_birth:
            user.date_of_birth = datetime.strptime(date_of_birth, "%Y-%m-%d").date()
        if gender:
            user.gender = gender
        if profile_picture:
            profile_picture_bytes = base64.b64decode(profile_picture.split(",")[1])
            user.profile_picture = profile_picture_bytes
        self.repository.updateUser(user)

        if user.profile_picture:
            encoded_picture = base64.b64encode(user.profile_picture).decode('utf-8')
            user.profile_picture = f"data:image/png;base64,{encoded_picture}"

        return user