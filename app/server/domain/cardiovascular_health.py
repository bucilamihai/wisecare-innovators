from persistence.db_config import db

class CardiovascularHealth(db.Model):
    __tablename__ = 'cardiovascular_health'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(255), nullable=False)
    height = db.Column(db.Float, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    systolic = db.Column(db.Integer, nullable=False)
    diastolic = db.Column(db.Integer, nullable=False)
    smoke = db.Column(db.Integer, nullable=True)
    alcohol = db.Column(db.Integer, nullable=True)
    active = db.Column(db.Integer, nullable=True)
    cholesterol = db.Column(db.Integer, nullable=True)
    glucose = db.Column(db.Integer, nullable=True)
    prediction = db.Column(db.Integer, nullable=False)
    probability = db.Column(db.Float, nullable=False)
    risk_level = db.Column(db.String(255), nullable=False)

    def __init__(self, user_id, age, gender, height, weight, systolic, diastolic, prediction, probability, risk_level, smoke=None, alcohol=None, active=None, cholesterol=None, glucose=None):
        self.user_id = user_id
        self.age = age
        self.gender = gender
        self.height = height
        self.weight = weight
        self.systolic = systolic
        self.diastolic = diastolic
        self.prediction = prediction
        self.probability = probability
        self.risk_level = risk_level
        self.smoke = smoke
        self.alcohol = alcohol
        self.active = active
        self.cholesterol = cholesterol
        self.glucose = glucose
            
    def toDict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "age": self.age,
            "gender": self.gender,
            "height": self.height,
            "weight": self.weight,
            "systolic": self.systolic,
            "diastolic": self.diastolic,
            "smoke": self.smoke,
            "alcohol": self.alcohol,
            "active": self.active,
            "cholesterol": self.cholesterol,
            "glucose": self.glucose,
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
    
    def getHeight(self):
        return self.height
    
    def getWeight(self):
        return self.weight
    
    def getSystolic(self):
        return self.systolic
    
    def getDiastolic(self):
        return self.diastolic
    
    def getSmoke(self):
        return self.smoke
    
    def getAlcohol(self):
        return self.alcohol
    
    def getActive(self):
        return self.active
    
    def getCholesterol(self):
        return self.cholesterol
    
    def getGlucose(self):
        return self.glucose
    
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

    def setHeight(self, height):
        self.height = height

    def setWeight(self, weight):
        self.weight = weight

    def setSystolic(self, systolic):
        self.systolic = systolic
       
    def setDiastolic(self, diastolic):
        self.diastolic = diastolic

    def setSmoke(self, smoke):
        self.smoke = smoke

    def setAlcohol(self, alcohol):
        self.alcohol = alcohol

    def setActive(self, active):
        self.active = active

    def setCholesterol(self, cholesterol):
        self.cholesterol = cholesterol

    def setGlucose(self, glucose):
        self.glucose = glucose

    def setPrediction(self, prediction):
        self.prediction = prediction

    def setProbability(self, probability):
        self.probability = probability

    def setRiskLevel(self, risk_level):
        self.risk_level = risk_level