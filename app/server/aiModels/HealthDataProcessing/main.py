import os
from aiModels.HealthDataProcessing.cardiovascular import CardiovascularDiseasePredictor
from aiModels.HealthDataProcessing.diabetes import DiabetesPredictor

# Get the absolute path to the data file
current_dir = os.path.dirname(os.path.abspath(__file__))
data_path_cardiovascular = os.path.join(current_dir, 'DataSets', 'Cardiovascular', 'cardio_data_processed.csv')
data_path_diabetus = os.path.join(current_dir, 'DataSets', 'Diabetes', 'diabetes_prediction_dataset.csv')


# Initialize predictor
predictor_cardiovascular = CardiovascularDiseasePredictor()
predictor_cardiovascular.train(data_path_cardiovascular)

predictor_diabetus = DiabetesPredictor()
predictor_diabetus.train(data_path_diabetus)


# Make a prediction for CARDIOVASCULAR DISEASE
patient_data_cardiovascular = {
    'age_years': 65,
    'gender': 1,
    'height': 165,
    'weight': 70,
    'ap_hi': 128,
    'ap_lo': 80,
    'smoke': 0,
    'alco': 0,
    'active': 1
    # cholesterol and gluc are optional
}

cardiovascular_result = predictor_cardiovascular.predict(patient_data_cardiovascular)
print("\n----------------------------------------------------------------------------------------------------------\n")
print(cardiovascular_result)  # Will show prediction, probability, and risk level


print("\n----------------------------------------------------------------------------------------------------------\n")
# Make a prediction for DIABETUS
# Example prediction with only required features
patient_data_diabetus = {
    'age': 55,
    'gender': 'Female',
    'bmi': 28.5,
    'blood_glucose_level': 100
}

# Example prediction with some optional features
patient_data_diabetus_with_optional = {
    'age': 55,
    'gender': 'Female',
    'bmi': 28.5,
    'hypertension': 0,
    'heart_disease': 0,
    'smoking_history': 'never',
    'HbA1c_level': 5.8,
    'blood_glucose_level': 100
}

patient_data = {
    # Required fields
    'age': 55,
    'gender': 'Male',
    'bmi': 35.5,                    # Severe obesity
    'blood_glucose_level': 190,     # Significantly elevated
    
    # Optional fields
    'hypertension': 1,              # Has hypertension
    'heart_disease': 1,             # Has heart disease
    'smoking_history': 'current',    
    'HbA1c_level': 7.2             # Diabetic range
}

result = predictor_diabetus.predict(patient_data_diabetus)
diabetes_result = result
print("Basic prediction:", result)

print("\n----------------------------------------------------------------------------------------------------------\n")

result_with_optional = predictor_diabetus.predict(patient_data_diabetus_with_optional)
print("Prediction with optional features:", result_with_optional)

print("\n----------------------------------------------------------------------------------------------------------\n")

print(patient_data)
result_elevated = predictor_diabetus.predict(patient_data)
print("Prediction with Elevated Inputs:", result_elevated)
