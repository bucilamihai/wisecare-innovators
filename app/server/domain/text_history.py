from persistence.db_config import db

class TextHistory(db.Model):
    __tablename__ = 'text_histories'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    text = db.Column(db.String(65535), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    sentiment = db.Column(db.String(255), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __init__(self, text, date, sentiment, user_id, id=None):
        self.text = text
        self.date = date
        self.user_id = user_id
        self.sentiment = sentiment
        self.id = id

    def toDict(self):
        return {
            "id": self.id,
            "text": self.text,
            "date": self.date,
            "sentiment": self.sentiment,
            "user_id": self.user_id
        }

    def getId(self):
        return self.id
    
    def getText(self):
        return self.text
    
    def getDate(self):
        return self.date
    
    def getSentiment(self):
        return self.sentiment
    
    def getUserId(self):
        return self.user_id
    
    def setText(self, text):
        self.text = text

    def setDate(self, date):
        self.date = date

    def setSentiment(self, sentiment):
        self.sentiment = sentiment
