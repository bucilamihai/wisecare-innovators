from persistence.db_config import db
from domain.text_history import TextHistory

class TextHistoryRepository:
    def addTextHistory(self, text_history):
        db.session.add(text_history)
        db.session.commit()
    
    def getTextHistoryById(self, id):
        return TextHistory.query.filter_by(id=id).first()
    
    def getTextHistoryByUserId(self, user_id):
        return TextHistory.query.filter_by(user_id=user_id).all()
    
    def updateTextHistory(self):
        db.session.commit()

    def deleteTextHistory(self, text_history):
        db.session.delete(text_history)
        db.session.commit()

    def getAllTextHistories(self):
        return TextHistory.query.all()