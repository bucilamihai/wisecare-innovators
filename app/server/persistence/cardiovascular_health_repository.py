from persistence.db_config import db
from domain.cardiovascular_health import CardiovascularHealth

class CardiovascularHealthRepository: 
    def addCardiovascularHealth(self, cardiovascular_health):
        db.session.add(cardiovascular_health)
        db.session.commit()

    def getAll(self):
        return CardiovascularHealth.query.all()

    def getByUserId(self, userId):
        return CardiovascularHealth.query.filter_by(user_id=userId).all()
    
    def getById(self, id):
        return CardiovascularHealth.cardiovascular_health.query.filter_by(id=id).first()
    
    def updateCardiovascularHealth(self):
        db.session.commit()

    def deleteCardiovascularHealth(self):
        db.session.delete(self)
        db.session.commit()
    