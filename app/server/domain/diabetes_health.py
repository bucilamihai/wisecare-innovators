from persistence.db_config import db

class DiabetesHealth(db.Model):
    __tablename__ = 'diabetes_health'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(255), nullable=False)
    bmi = db.Column(db.Float, nullable=False)
    glucose_level = db.Column(db.Float, nullable=False)
    hypertension = db.Column(db.Integer, nullable=True)
    heart_disease = db.Column(db.Integer, nullable=True)
    smoking_history = db.Column(db.String(255), nullable=True)
    HbA1c = db.Column(db.Float, nullable=True)
    prediction = db.Column(db.Integer, nullable=False)
    probability = db.Column(db.Float, nullable=False)
    risk_level = db.Column(db.String(255), nullable=False)


    def __init__(self, user_id, age, gender, bmi, glucose_level, prediction, probability, risk_level, id=None, hypertension=None, heart_disease=None, smoking_history=None, HbA1c=None):
        self.user_id = user_id
        self.age = age
        self.gender = gender
        self.bmi = bmi
        self.glucose_level = glucose_level
        self.prediction = prediction
        self.probability = probability
        self.risk_level = risk_level
        self.id = id
        self.hypertension = hypertension
        self.heart_disease = heart_disease
        self.smoking_history = smoking_history
        self.HbA1c = HbA1c

    def toDict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "age": self.age,
            "gender": self.gender,
            "bmi": self.bmi,
            "glucose_level": self.glucose_level,
            "hypertension": self.hypertension,
            "heart_disease": self.heart_disease,
            "smoking_history": self.smoking_history,
            "HbA1c": self.HbA1c,
            "prediction": self.prediction,
            "probability": self.probability,
            "risk_level": self.risk_level
        }
    
    def getId(self):
        return self.id

    def getUserId(self):
        return self.user_id

    def getAge(self):
        return self.age

    def getGender(self):
        return self.gender

    def getBmi(self):
        return self.bmi

    def getGlucoseLevel(self):
        return self.glucose_level

    def getHypertension(self):
        return self.hypertension

    def getHeartDisease(self):
        return self.heart_disease

    def getSmokingHistory(self):
        return self.smoking_history

    def getHbA1c(self):
        return self.HbA1c

    def getPrediction(self):
        return self.prediction

    def getProbability(self):
        return self.probability

    def getRiskLevel(self):
        return self.risk_level

    def setAge(self, age):
        self.age = age

    def setGender(self, gender):
        self.gender = gender

    def setBmi(self, bmi):
        self.bmi = bmi

    def setGlucoseLevel(self, glucose_level):
        self.glucose_level = glucose_level

    def setHypertension(self, hypertension):
        self.hypertension = hypertension

    def setHeartDisease(self, heart_disease):
        self.heart_disease = heart_disease

    def setSmokingHistory(self, smoking_history):
        self.smoking_history = smoking_history

    def setHbA1c(self, HbA1c):
        self.HbA1c = HbA1c

    def setPrediction(self, prediction):
        self.prediction = prediction

    def setProbability(self, probability):
        self.probability = probability

    def setRiskLevel(self, risk_level):
        self.risk_level = risk_level