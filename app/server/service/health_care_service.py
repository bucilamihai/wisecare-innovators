from persistence.diabetes_health_repository import DiabetesHealthRepository
from persistence.cardiovascular_health_repository import CardiovascularHealthRepository
from domain.diabetes_health import DiabetesHealth
from domain.cardiovascular_health import CardiovascularHealth
import aiModels.HealthDataProcessing.main as health_models

class HealthCareService:
    def __init__(self):
        self.diabetes_repository = DiabetesHealthRepository()
        self.cardiovascular_repository = CardiovascularHealthRepository()

    def addDiabetesHealth(self, user_id, age, gender, bmi, glucose_level, prediction=None, probability=None, risk_level=None, hypertension=None, heart_disease=None, smoking_history=None, HbA1c=None): 
        # Get prediction from model if not provided
        if prediction is None or probability is None or risk_level is None:
            # Create features dictionary for prediction
            features = {
                'age': age,
                'gender': gender,
                'bmi': bmi,
                'blood_glucose_level': glucose_level,
                'smoking_history': smoking_history if smoking_history else 'never',
                'hypertension': hypertension if hypertension is not None else 0,
                'heart_disease': heart_disease if heart_disease is not None else 0,
                'HbA1c_level': HbA1c if HbA1c is not None else 0
            }
            
            # Get prediction from model
            result = health_models.diabetes_result
            prediction = result.get('prediction', 0)
            probability = result.get('probability', 0.0)
            risk_level = result.get('risk_level', 'Low')

        diabetes_health = DiabetesHealth(
            user_id, age, gender, bmi, glucose_level, 
            prediction, probability, risk_level,
            hypertension, heart_disease, smoking_history, HbA1c
        )
        self.diabetes_repository.addDiabetesHealth(diabetes_health)

    def addCardiovascularHealth(self, user_id, age, gender, height, weight, systolic, diastolic, prediction=None, probability=None, risk_level=None, smoke=None, alcohol=None, active=None, cholesterol=None, glucose=None): 
        # Get prediction from model if not provided
        if prediction is None or probability is None or risk_level is None:
            # Create features dictionary for prediction
            features = {
                'age_years': age,
                'gender': gender,
                'height': height,
                'weight': weight,
                'ap_hi': systolic,
                'ap_lo': diastolic,
                'cholesterol': cholesterol if cholesterol is not None else 1,
                'gluc': glucose if glucose is not None else 1,
                'smoke': smoke if smoke is not None else 0,
                'alco': alcohol if alcohol is not None else 0,
                'active': active if active is not None else 0
            }
            
            # Get prediction from model
            result = health_models.cardiovascular_result
            prediction = result.get('prediction', 0)
            probability = result.get('probability', 0.0)
            risk_level = result.get('risk_level', 'Low')

        # Modified constructor call - removed id parameter
        cardiovascular_health = CardiovascularHealth(
            user_id=user_id, 
            age=age, 
            gender=gender, 
            height=height, 
            weight=weight, 
            systolic=systolic, 
            diastolic=diastolic,
            prediction=prediction, 
            probability=probability, 
            risk_level=risk_level,
            smoke=smoke, 
            alcohol=alcohol, 
            active=active, 
            cholesterol=cholesterol, 
            glucose=glucose
        )
        self.cardiovascular_repository.addCardiovascularHealth(cardiovascular_health)

    def getLatestDiabetesHealth(self, user_id):
        """
        Get the most recent diabetes health record for a user
        """
        records = self.diabetes_repository.getByUserId(user_id)
        if not records:
            return None
        # Return the most recent record (assuming records are ordered by ID)
        return max(records, key=lambda x: x.getId())

    def getLatestCardiovascularHealth(self, user_id):
        """
        Get the most recent cardiovascular health record for a user
        """
        records = self.cardiovascular_repository.getByUserId(user_id)
        if not records:
            return None
        # Return the most recent record (assuming records are ordered by ID)
        return max(records, key=lambda x: x.getId())