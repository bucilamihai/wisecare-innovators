from persistence.db_config import db
from domain.diabetes_health import DiabetesHealth

class DiabetesHealthRepository: 
    def addDiabetesHealth(self, diabetes_health):
        db.session.add(diabetes_health)
        db.session.commit()

    def getAll(self):
        return DiabetesHealth.query.all()

    def getByUserId(self, userId):
        return DiabetesHealth.query.filter_by(user_id=userId).all()
    
    def getById(self, id):
        return DiabetesHealth.query.filter_by(id=id).first()
    
    def updateDiabetesHealth(self):
        db.session.commit()

    def deleteDiabetesHealth(self):
        db.session.delete(self)
        db.session.commit()
    