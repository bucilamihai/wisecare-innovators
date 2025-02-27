import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
import logging

class DiabetesPredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.required_features = ['age', 'gender', 'bmi', 'blood_glucose_level']
        self.optional_features = ['hypertension', 'heart_disease', 'smoking_history', 
                                'HbA1c_level']
        self.all_features = self.required_features + self.optional_features
        self.smoking_categories = None
        self.feature_names = None
        self.setup_logging()
    
    def setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)

    def preprocess_data(self, data, is_training=False):
        try:
            df = data.copy()
            
            # Handle missing optional features
            for feature in self.optional_features:
                if feature not in df.columns:
                    if feature in ['hypertension', 'heart_disease']:
                        df[feature] = 0
                    elif feature == 'smoking_history':
                        df[feature] = 'never'
                    else:
                        df[feature] = 0
            
            # Handle categorical variables
            if is_training:
                df['gender'] = self.label_encoder.fit_transform(df['gender'].astype(str))
            else:
                df['gender'] = self.label_encoder.transform(df['gender'].astype(str))
            
            # Handle smoking history
            if is_training:
                self.smoking_categories = sorted(df['smoking_history'].unique())
            
            # Create dummy variables for smoking history
            for category in self.smoking_categories or []:
                df[f'smoking_{category}'] = (df['smoking_history'] == category).astype(int)
            
            # Drop original smoking_history column
            if 'smoking_history' in df.columns:
                df = df.drop('smoking_history', axis=1)
            
            # Scale numerical features
            numerical_features = ['age', 'bmi', 'blood_glucose_level']
            if 'HbA1c_level' in df.columns:
                numerical_features.append('HbA1c_level')
            
            if numerical_features:
                if is_training:
                    df[numerical_features] = self.scaler.fit_transform(df[numerical_features])
                else:
                    df[numerical_features] = self.scaler.transform(df[numerical_features])
            
            # Drop the target variable if present (should only be present during training)
            if 'diabetes' in df.columns:
                df = df.drop('diabetes', axis=1)
            
            if is_training:
                # Store feature names in order after all preprocessing
                self.feature_names = df.columns.tolist()
                self.logger.info(f"Training features order: {self.feature_names}")
            else:
                # Ensure all features exist and are in correct order
                for feature in self.feature_names:
                    if feature not in df.columns:
                        df[feature] = 0
                df = df[self.feature_names]
                self.logger.info(f"Prediction features order: {df.columns.tolist()}")
            
            return df
            
        except Exception as e:
            self.logger.error(f"Error in preprocessing data: {str(e)}")
            raise

    def train(self, data_path):
        try:
            self.logger.info("Starting model training...")
            data = pd.read_csv(data_path)
            
            X = self.preprocess_data(data, is_training=True)
            y = data['diabetes']
            
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42
            )
            
            self.model.fit(X_train, y_train)
            
            test_pred = self.model.predict(X_test)
            metrics = self.calculate_metrics(y_test, test_pred)
            
            self.logger.info("Model training completed successfully")
            self.logger.info(f"Model metrics: {metrics}")
            
            return metrics
            
        except Exception as e:
            self.logger.error(f"Error in training model: {str(e)}")
            raise

    def predict(self, features_dict):
        try:
            if self.model is None:
                raise ValueError("Model not trained. Please train the model first.")
            
            # Validate required features
            missing_features = set(self.required_features) - set(features_dict.keys())
            if missing_features:
                raise ValueError(f"Missing required features: {missing_features}")
            
            input_df = pd.DataFrame([features_dict])
            processed_input = self.preprocess_data(input_df, is_training=False)
            
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
        """Calculate model performance metrics."""
        return {
            'accuracy': accuracy_score(y_true, y_pred),
            'precision': precision_score(y_true, y_pred),
            'recall': recall_score(y_true, y_pred),
            'f1': f1_score(y_true, y_pred)
        }

    def get_risk_level(self, probability):
        """Convert probability to risk level."""
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
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'label_encoder': self.label_encoder,
            'smoking_categories': self.smoking_categories,
            'feature_names': self.feature_names
        }
        joblib.dump(model_data, path)
        self.logger.info(f"Model saved to {path}")

    def load_model(self, path):
        """Load a trained model from a file."""
        model_data = joblib.load(path)
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.label_encoder = model_data['label_encoder']
        self.smoking_categories = model_data['smoking_categories']
        self.feature_names = model_data['feature_names']
        self.logger.info(f"Model loaded from {path}")
    
    def analyze_risk_factors(self, features_dict, probability):
        risk_factors = []
        
        # Blood Glucose Analysis
        if features_dict['blood_glucose_level'] > 140:  # Using common threshold for post-meal glucose
            risk_factors.append({
                'factor': 'blood_glucose',
                'current_value': features_dict['blood_glucose_level'],
                'normal_range': {
                    'fasting': {'min': 70, 'max': 100},
                    'post_meal': {'min': 70, 'max': 140}
                }
            })

        # HbA1c Analysis (if provided)
        if 'HbA1c_level' in features_dict and features_dict['HbA1c_level'] > 5.7:
            risk_factors.append({
                'factor': 'HbA1c',
                'current_value': features_dict['HbA1c_level'],
                'normal_range': {'min': 4.0, 'max': 5.7}
            })
        
        # BMI Analysis
        if features_dict['bmi'] >= 25:
            risk_factors.append({
                'factor': 'bmi',
                'current_value': features_dict['bmi'],
                'normal_range': {'min': 18.5, 'max': 24.9}
            })
        
        # Hypertension Check
        if features_dict.get('hypertension', 0) == 1:
            risk_factors.append({
                'factor': 'hypertension',
                'current_value': 'present',
                'optimal_value': 'not present'
            })
        
        # Smoking Status Check
        if features_dict.get('smoking_history', 'never') in ['current', 'ever', 'former']:
            risk_factors.append({
                'factor': 'smoking',
                'current_value': features_dict.get('smoking_history'),
                'optimal_value': 'never'
            })

        return risk_factors