from persistence.db_config import db
from domain.user import User

class UserRepository:
    def addUser(self, user):
        db.session.add(user)
        db.session.commit()
    
    def getUserById(self, id):
        return User.query.filter_by(id=id).first()
    
    def getUserByEmail(self, email):
        return User.query.filter_by(email=email).first()
    
    def updateUser(self, user):
        db.session.commit()

    def deleteUser(self, user):
        db.session.delete(user)
        db.session.commit()

    def getAllUsers(self):
        return User.query.all()