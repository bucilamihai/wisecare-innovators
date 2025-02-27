import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import joblib
import logging

class CardiovascularDiseasePredictor:
    def __init__(self):
        """Initialize the CardiovascularDiseasePredictor with necessary components."""
        self.model = None
        self.scaler = StandardScaler()
        self.required_features = ['age_years', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo']
        self.optional_features = ['cholesterol', 'gluc', 'smoke', 'alco', 'active']
        self.all_features = self.required_features + self.optional_features
        self.setup_logging()
    
    def setup_logging(self):
        """Set up logging configuration."""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)

    def preprocess_data(self, data):
        """
        Preprocess the input data for training or prediction.
        
        Args:
            data (pd.DataFrame): Input data containing features
            
        Returns:
            pd.DataFrame: Preprocessed data
        """
        try:
            df = data.copy()
        
            # Convert age from days to years if necessary
            if 'age' in df.columns and 'age_years' not in df.columns:
                df['age_years'] = df['age'] / 365.25
            
            # Handle missing optional features
            for feature in self.optional_features:
                if feature not in df.columns:
                    df[feature] = 0  # Default value for missing optional features
            
            # Select features for model
            features_df = df[self.all_features].copy()
            
            # Calculate BMI after selecting features
            features_df['bmi'] = df['weight'] / ((df['height'] / 100) ** 2)
            
            # Scale the numerical features, including the newly calculated BMI
            numerical_features = ['age_years', 'height', 'weight', 'ap_hi', 'ap_lo', 'bmi']
            features_df[numerical_features] = self.scaler.fit_transform(features_df[numerical_features])
            
            return features_df
        
        except Exception as e:
            self.logger.error(f"Error in preprocessing data: {str(e)}")
            raise

    def train(self, data_path):
        """
        Train the cardiovascular disease prediction model.
        
        Args:
            data_path (str): Path to the training data CSV file
        """
        try:
            # Load and preprocess data
            data = pd.read_csv(data_path)
            X = self.preprocess_data(data)
            y = data['cardio']
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Train model
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42
            )
            self.model.fit(X_train, y_train)
            
            # Evaluate model
            train_pred = self.model.predict(X_train)
            test_pred = self.model.predict(X_test)
            
            # Calculate metrics
            metrics = self.calculate_metrics(y_test, test_pred)
            
            self.logger.info("Model training completed successfully")
            self.logger.info(f"Model metrics: {metrics}")
            
            return metrics
            
        except Exception as e:
            self.logger.error(f"Error in training model: {str(e)}")
            raise

    def predict(self, features_dict):
        """
        Make a prediction for cardiovascular disease.
        
        Args:
            features_dict (dict): Dictionary containing patient features
            
        Returns:
            dict: Prediction results including probability
        """
        try:
            if self.model is None:
                raise ValueError("Model not trained. Please train the model first.")
            
            # Create DataFrame from input features
            input_df = pd.DataFrame([features_dict])
            
            # Preprocess input data
            processed_input = self.preprocess_data(input_df)
            
            # Make prediction
            prediction = self.model.predict(processed_input)[0]
            probability = self.model.predict_proba(processed_input)[0]
            
            # Analyze risk factors if probability is concerning
            risk_factors = []
            if probability[1] >= 0.2:  # If risk is moderate or higher
                risk_factors = self.analyze_risk_factors(features_dict, probability[1])

            result = {
                'prediction': int(prediction),
                'probability': float(probability[1]),
                'risk_level': self.get_risk_level(probability[1]),
                'risk_factors': risk_factors
            }
            
            return result
            
        except Exception as e:
            self.logger.error(f"Error in making prediction: {str(e)}")
            raise

    def calculate_metrics(self, y_true, y_pred):
        """
        Calculate model performance metrics.
        
        Args:
            y_true: True labels
            y_pred: Predicted labels
            
        Returns:
            dict: Dictionary containing various metrics
        """
        return {
            'accuracy': accuracy_score(y_true, y_pred),
            'precision': precision_score(y_true, y_pred),
            'recall': recall_score(y_true, y_pred),
            'f1': f1_score(y_true, y_pred)
        }

    def get_risk_level(self, probability):
        """
        Convert probability to risk level.
        
        Args:
            probability (float): Prediction probability
            
        Returns:
            str: Risk level category
        """
        if probability < 0.2:
            return "Low"
        elif probability < 0.5:
            return "Moderate"
        elif probability < 0.8:
            return "High"
        else:
            return "Very High"

    def save_model(self, path):
        """Save the trained model to a file."""
        if self.model is None:
            raise ValueError("No trained model to save")
        joblib.dump((self.model, self.scaler), path)
        self.logger.info(f"Model saved to {path}")

    def load_model(self, path):
        """Load a trained model from a file."""
        self.model, self.scaler = joblib.load(path)
        self.logger.info(f"Model loaded from {path}")

    def validate_input(self, features_dict):
        """
        Validate input features before prediction.
        
        Args:
            features_dict (dict): Dictionary containing patient features
            
        Returns:
            bool: True if valid, raises ValueError if invalid
        """
        # Check required features
        for feature in self.required_features:
            if feature not in features_dict:
                raise ValueError(f"Missing required feature: {feature}")
        
        # Validate age
        if features_dict['age_years'] < 0 or features_dict['age_years'] > 120:
            raise ValueError("Invalid age value")
        
        # Validate blood pressure
        if features_dict['ap_hi'] < 50 or features_dict['ap_hi'] > 250:
            raise ValueError("Invalid systolic blood pressure value")
        if features_dict['ap_lo'] < 30 or features_dict['ap_lo'] > 200:
            raise ValueError("Invalid diastolic blood pressure value")
        
        # Validate height and weight
        if features_dict['height'] < 50 or features_dict['height'] > 250:
            raise ValueError("Invalid height value")
        if features_dict['weight'] < 20 or features_dict['weight'] > 300:
            raise ValueError("Invalid weight value")
        
        return True
    
    def analyze_risk_factors(self, features_dict, probability):
        risk_factors = []
        
        # Blood Pressure Analysis
        if features_dict['ap_hi'] >= 140 or features_dict['ap_lo'] >= 90:
            risk_factors.append({
                'factor': 'blood_pressure',
                'current_value': {
                    'systolic': features_dict['ap_hi'],
                    'diastolic': features_dict['ap_lo']
                },
                'normal_range': {
                    'systolic': {'min': 90, 'max': 120},
                    'diastolic': {'min': 60, 'max': 80}
                }
            })

        # BMI Analysis
        bmi = features_dict['weight'] / ((features_dict['height'] / 100) ** 2)
        if bmi >= 25:
            risk_factors.append({
                'factor': 'bmi',
                'current_value': round(bmi, 1),
                'normal_range': {'min': 18.5, 'max': 24.9}
            })
        
        # Cholesterol Analysis (if provided)
        if 'cholesterol' in features_dict and features_dict['cholesterol'] > 1:
            cholesterol_meanings = {
                1: "Normal",
                2: "Above Normal",
                3: "Well Above Normal"
            }
            risk_factors.append({
                'factor': 'cholesterol',
                'current_value': {
                    'level': features_dict['cholesterol'],
                    'meaning': cholesterol_meanings[features_dict['cholesterol']]
                },
                'normal_range': {
                    'level': 1,
                    'meaning': 'Normal'
                }
            })

        # Lifestyle Factors
        if features_dict.get('smoke', 0) == 1:
            risk_factors.append({
                'factor': 'smoking',
                'current_value': 'active',
                'optimal_value': 'none'
            })
        
        if features_dict.get('active', 0) == 0:
            risk_factors.append({
                'factor': 'physical_activity',
                'current_value': 'inactive',
                'optimal_value': 'active'
            })

        return risk_factors