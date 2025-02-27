import os
import sys

import aiModels.HealthDataProcessing.main as health_models
import assemblyai as aai

from aiModels.SentimentAnalyser.analyse_sentiment import analyse_sentiment, compute_overall_sentiment
from persistence.db_config import createApp
from service.user_service import UserService
from flask import Flask, request, jsonify, session, make_response
from flask_cors import CORS
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration, Trainer, TrainingArguments, pipeline
from datasets import load_dataset
import pandas as pd
from transformers import AutoTokenizer, AutoModelForCausalLM
import openai
from service.health_care_service import HealthCareService
from service.reminder_service import ReminderService
import jwt
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash

# Initialize Flask app
app = createApp()
app.config['SECRET_KEY'] = 'your_secret_key'
CORS(app, resources={r"/*": {"origins": "*"}})

user_service = UserService()
reminder_service = ReminderService()
health_service = HealthCareService()

# BlenderBot Endpoint
tokenizer = BlenderbotTokenizer.from_pretrained('facebook/blenderbot-400M-distill')
model = BlenderbotForConditionalGeneration.from_pretrained('facebook/blenderbot-400M-distill')

# tokenizer = BlenderbotTokenizer.from_pretrained('aiModels/Chat/fine_tuned_blenderbot')
# model = BlenderbotForConditionalGeneration.from_pretrained('aiModels/Chat/fine_tuned_blenderbot')

sentiment_analyser = pipeline("sentiment-analysis")

conversation_history = []
user_sentiments = []

def create_token(user_id, email):
    """
    Create a JWT token for a given user
    """
    expiration_time = datetime.utcnow() + timedelta(hours=1)
    # token = jwt.encode(
    #     {'id': user_id, 'email': email, 'exp': expiration_time},
    #     app.config['SECRET_KEY'],
    #     algorithm='HS256'
    # )
    token = "token" + str(user_id)
    return token

@app.route('/')
def home():
    return "Welcome to the Elderly Care Platform!"



# Register Endpoint
@app.route('/register', methods=['POST']) 
def register():
    data = request.json
    print("Data:", data)
    firstname = data.get("firstname")
    lastname = data.get("lastname")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirm_password")

    if not firstname or not lastname or not email or not password or not confirm_password:
        return jsonify({"error": "Please provide all the required fields!"}), 400
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match!"}), 400
    # call service method to add user
    try:
        user_service.addUser(firstname, lastname, email, password)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    return jsonify({"message": "User registered successfully!"}), 200

# Login Endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Please provide all the required fields!"}), 400
    try:
        user = user_service.getUserByEmail(email, password)
        token = create_token(user.id, user.email)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    return jsonify({
        "message": "User logged in successfully!", 
        "token": token,
        "data": user.toDict()}), 200

#Update User Endpoint
@app.route('/update_user', methods=['PUT'])
def updateUser():
    # update firstname, lastname, email, password, date_of_birth, gender, profile_picture
    data = request.json
    id = data.get("id")
    if not id:
        return jsonify({"error": "User ID is required"}), 400
    firstname = data.get("firstName")
    lastname = data.get("lastName")
    email = data.get("email")
    password = data.get("password")
    date_of_birth = data.get("dateOfBirth")
    gender = data.get("gender")
    profile_picture = data.get("profilePhoto")
    try:
        user = user_service.updateUser(id, firstname, lastname, email, password, date_of_birth, gender, profile_picture)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    return jsonify({"message": "User updated successfully!", "data": user.toDict()}), 200

# Get user by ID Endpoint
@app.route('/user/<int:id>', methods=['GET']) 
def getUser(id):
    try:    
        user = user_service.getUserById(id)
        if not user:
            return jsonify({"error": "User not found!"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    # Return user data as a dictionary
    return jsonify({"message": "User found!", "data": user.toDict()}), 200

# Reminder Endpoints

# Add Reminder Endpoint
@app.route('/reminder', methods=['POST'])
def addReminder():
    data = request.json
    title = data.get("title")
    description = data.get("description")
    deadline = data.get("deadline")
    type = data.get("type")
    priority = data.get("priority")
    user_id = data.get("userId")
    if not title or not description or not deadline or not type or not priority or not user_id:
        return jsonify({"error": "Please provide all the required fields!"}), 400
    
    try:
        deadline = datetime.strptime(deadline, "%Y-%m-%dT%H:%M:%S")
    except ValueError:
        return jsonify({"error": "Invalid deadline format!"}), 400

    try:
        reminder_service.addReminder(title, description, deadline, type, priority, user_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    return jsonify({"message": "Reminder added successfully!"}), 200

# Get Reminders By User Id Endpoint
@app.route('/reminders/<int:id>', methods=['GET'])
def getRemindersByUserId(id):
    try:
        reminders = reminder_service.getRemindersByUserId(id)
        if not reminders:
            return jsonify({"error": "No reminders found!"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    reminders_list = []
    for reminder in reminders:
        reminders_list.append(reminder.toDict())
    return jsonify({"message": "Reminders found!", "data": reminders_list}), 200

# Delete Reminder Endpoint
@app.route('/reminder/<int:id>', methods=['DELETE'])
def deleteReminder(id):
    try:
        reminder_service.deleteReminder(id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    return jsonify({"message": "Reminder deleted successfully!"}), 200


# Chat Endpoint
@app.route('/chat', methods=['POST'])
def chat():
    global conversation_history, user_sentiments
    data = request.json
    user_message = data.get("message")

    predefined_response = check_predefined_responses(user_message)

    conversation_history.append(f"User: {user_message}")
    sentiment = analyse_sentiment(user_message)
    user_sentiments.append({"message": user_message, "sentiment": sentiment})

    history_input = " ".join(conversation_history[-4:])
    inputs = tokenizer(history_input, return_tensors='pt', padding=True, truncation=True)

    if (predefined_response == ""):
        reply_ids = model.generate(
            **inputs,
            max_length=100,
            do_sample=True,
            temperature=0.9,
            top_k=50,
            top_p=0.9,
            pad_token_id=tokenizer.eos_token_id
        )
        response = tokenizer.decode(reply_ids[0], skip_special_tokens=True)

        if "me" in response or "myself" in response or "my" in response or "I've" in response:
            print(f"Rejected Response: {response}")
            response = filter_response(response, user_message)

        conversation_history.append(f"AI: {response}")

        return jsonify({"response": response})
    else:
        conversation_history.append(f"AI: {predefined_response}")

        return jsonify({"response": predefined_response})

# Health Data Endpoints
@app.route('/health/save', methods=['POST'])
def save_health_data():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        if not data['userId']:
            return jsonify({"error": "User not authenticated"}), 401

        # Extract and validate data...
        try:
            health_service.addCardiovascularHealth(
                user_id=data['userId'],
                age=data['age'],
                gender=data['gender'],
                height=data['height'],
                weight=data['weight'],
                systolic=data['systolic'],
                diastolic=data['diastolic'],
                smoke=1 if data.get('smoking') == 'current' else 0,
                alcohol=data.get('alcohol', 0),
                active=data.get('active', 0),
                cholesterol=data.get('cholesterol', 1),
                glucose=data['glucose']
            )
        except Exception as e:
            print("Error saving cardiovascular health:", str(e))
            return jsonify({"error": f"Error saving cardiovascular data: {str(e)}"}), 500

        # Similar try-except block for diabetes health...
        try:
            bmi = data['weight'] / ((data['height'] / 100) ** 2)
            health_service.addDiabetesHealth(
                user_id=data['userId'],
                age=data['age'],
                gender=data['gender'],
                bmi=bmi,
                glucose_level=data['glucose'],
                smoking_history=data.get('smoking', 'never')
            )
        except Exception as e:
            print("Error saving diabetes health:", str(e))
            return jsonify({"error": f"Error saving diabetes data: {str(e)}"}), 500

        return jsonify({
            "message": "Health data saved successfully",
            "cardiovascular_risk": health_models.cardiovascular_result.get('risk_level'),
            "diabetes_risk": health_models.diabetes_result.get('risk_level')
        }), 200

    except Exception as e:
        print("Unexpected error in save_health_data:", str(e))
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


@app.route('/health/get/<int:id>', methods=['GET'])
def get_health_data(id):
    try:
        if not id:
            return jsonify({"error": "User not authenticated"}), 401

        # Get the most recent health records for both models
        try:
            cardiovascular = health_service.getLatestCardiovascularHealth(id)
            diabetes = health_service.getLatestDiabetesHealth(id)
        except Exception as e:
            return jsonify({"error": f"Error retrieving health data: {str(e)}"}), 500

        # If no data exists yet
        if not cardiovascular and not diabetes:
            return jsonify({"message": "No health data found"}), 404

        # Combine the data from both models
        response_data = {}
        
        if cardiovascular:
            cardio_dict = cardiovascular.toDict()
            response_data.update({
                'age': cardio_dict['age'],
                'gender': cardio_dict['gender'],
                'height': cardio_dict['height'],
                'weight': cardio_dict['weight'],
                'systolic': cardio_dict['systolic'],
                'diastolic': cardio_dict['diastolic'],
                'cholesterol': cardio_dict['cholesterol'],
                'glucose': cardio_dict['glucose'],
                'alcohol': cardio_dict['alcohol'],
                'active': cardio_dict['active'],
                'smoking': 'current' if cardio_dict['smoke'] == 1 else 'never',
                'cardiovascular_risk': cardio_dict['risk_level']
            })

        if diabetes:
            diabetes_dict = diabetes.toDict()
            if not cardiovascular:  # Only update these if we don't have cardio data
                response_data.update({
                    'age': diabetes_dict['age'],
                    'gender': diabetes_dict['gender'],
                    'glucose': diabetes_dict['glucose_level']
                })
            # Always update diabetes-specific fields
            response_data.update({
                'diabetes_risk': diabetes_dict['risk_level']
            })
            # Update smoking status from diabetes record if it exists
            if 'smoking_history' in diabetes_dict:
                response_data['smoking'] = diabetes_dict['smoking_history']

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

# Endpoint for Speech-to-Text Transcription
@app.route('/transcribe', methods=['POST'])
def transcribe():
    """Handles audio file uploads and transcribes the audio using Google Cloud Speech-to-Text."""
    try:
        # Ensure an audio file is included in the request
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file uploaded"}), 400

        audio_file = request.files['audio']
        audio_path = "temp_audio.wav"

        audio_file.save(audio_path)

        aai.settings.api_key = "7726073d81d2412cb0386f2775b05def"
        transcriber = aai.Transcriber()

        # This following line is for testing purposes, in case the API doesn't want to work anymore :))
        # transcript = transcriber.transcribe("https://assembly.ai/news.mp4")

        # Transcription to text using the API from a specific audio file
        transcript = transcriber.transcribe(audio_path)

        print(transcript.text)

        return jsonify({"transcription": transcript.text})

    except Exception as e:
        print(f"Error during transcription: {e}")
        return jsonify({"error": "Transcription failed"}), 500



# Endpoint for Saving the conversation at the end of the day
@app.route('/save_conversation', methods=['POST'])
def save_conversation():
    global conversation_history, user_sentiments

    overall_sentiment = compute_overall_sentiment(user_sentiments)

    save_to_database({
        "conversation": conversation_history,
        "sentiments": user_sentiments,
        "overall_sentiment": overall_sentiment
    })

    print(user_sentiments)

    print({
        "conversation": conversation_history,
        "sentiments": user_sentiments,
        "overall_sentiment": overall_sentiment
    })

    conversation_history = []
    user_sentiments = []

    return jsonify({
        "message": "Conversation and sentiment saved successfully!",
        "overall_sentiment": overall_sentiment
    })

def save_to_database(data):
    print("Saving to database:", data)







def filter_response(original_response, user_message):
    for _ in range(8):
        inputs = tokenizer(user_message, return_tensors='pt', padding=True, truncation=True)
        reply_ids = model.generate(
            **inputs,
            max_length=100,
            do_sample=True,
            temperature=0.9,
            top_k=50,
            top_p=0.9,
            pad_token_id=tokenizer.eos_token_id
        )
        new_response = tokenizer.decode(reply_ids[0], skip_special_tokens=True)

        if ("me" not in new_response and "myself" not in new_response and "I'm" not in
                new_response and "my" not in new_response and "I've" not in new_response and not
                new_response.lower().startswith("i ")):
            return new_response
        else:
            print(f"Rejected Response: {new_response}")

    return "I don't have an answer for this yet!"



def check_predefined_responses(user_message):
    if user_message.lower() == "hello!" or user_message.lower() == "hi!" or user_message.lower() == "hey!" or user_message.lower() == "hello" or user_message.lower() == "hi" or user_message.lower() == "hey":
        return "Hello! How are you?"
    elif "what" in user_message.lower() and "weather" in user_message.lower():
        return "It is [weather] today. Are you going out today?"
    elif "health" in user_message.lower() and "my" in user_message.lower():
        return f"Based on my data, you are doing {health_models.cardiovascular_result['risk_level']}. Do you have any symptoms?"
    elif "when" in user_message.lower() and "my" in user_message.lower() and ("pills" in user_message.lower() or "medicines" in user_message.lower() or "medication" in user_message.lower()):
        return "You need to take [medication] at [time]. Don't forget."
    elif "my blood sugar" in user_message.lower():
        return "Your blood sugar level is [blood sugar level]. Are you feeling okay?"
    elif ("my" in user_message.lower() or "i" in user_message.lower()) and ("cardiovascular" in user_message.lower() or "heart" in user_message.lower()):
        # return f"Your Cardiovascular Risk Disease Level is {health_models.cardiovascular_result['risk_level']}"
        return format_risk_response("Cardiovascular Disease", health_models.cardiovascular_result)
    elif ("my" in user_message.lower() or "i" in user_message.lower()) and "diabetes" in user_message.lower():
        # return f"Your Diabetes Risk Disease Level is {health_models.diabetes_result['risk_level']}"
        return format_risk_response("Diabetes", health_models.diabetes_result)
    else:
        return ""


def get_health_suggestions(risk_factors):
    suggestions = []
    for factor in risk_factors:
        if factor['factor'] == 'blood_pressure':
            if factor['current_value']['systolic'] > 140 or factor['current_value']['diastolic'] > 90:
                suggestions.append("Consider reducing salt intake and regular blood pressure monitoring. ")

        elif factor['factor'] == 'bmi' and factor['current_value'] > 25:
            suggestions.append("A balanced diet and regular exercise can help achieve a healthy weight. ")

        elif factor['factor'] == 'cholesterol':
            if factor['current_value']['level'] > 1:
                suggestions.append("Focus on heart-healthy foods low in saturated fats. ")

        elif factor['factor'] == 'smoking' and factor['current_value'] == 'current':
            suggestions.append("Consider a smoking cessation program to reduce health risks. ")

        elif factor['factor'] == 'physical_activity' and factor['current_value'] == 'inactive':
            suggestions.append("Start with simple activities like daily walks. ")

        elif factor['factor'] == 'blood_glucose' and factor['current_value'] > 140:
            suggestions.append("Regular blood sugar monitoring and balanced meals are important. ")

        elif factor['factor'] == 'HbA1c' and factor['current_value'] > 5.7:
            suggestions.append("Work with your healthcare provider on blood sugar management. ")

        elif factor['factor'] == 'hypertension' and factor['current_value'] == 'present':
            suggestions.append("Regular blood pressure monitoring and lifestyle changes can help. ")

    return suggestions


def format_risk_response(condition, result):
    response = f"Your {condition} Risk Level is {result['risk_level']}. \n\n"

    if result['risk_level'] != "Low" and result['risk_factors']:
        response += ""
        for factor in result['risk_factors']:
            if factor['factor'] == 'blood_pressure':
                response += f"Your Blood Pressure is {factor['current_value']['systolic']}/{factor['current_value']['diastolic']} "
                response += f"(Normal range: {factor['normal_range']['systolic']['min']}-{factor['normal_range']['systolic']['max']}/"
                response += f"{factor['normal_range']['diastolic']['min']}-{factor['normal_range']['diastolic']['max']}). \n"
            elif factor['factor'] == 'cholesterol':
                response += f"Your Cholesterol is {factor['current_value']['meaning']}. \n"
            else:
                response += f"Your {factor['factor'].title()} is {factor['current_value']}. \n"

        suggestions = get_health_suggestions(result['risk_factors'])
        if suggestions:
            for suggestion in suggestions:
                response += f"{suggestion} \n"

    return response


if __name__ == '__main__':
    app.run(host="192.168.250.89", port=5000)