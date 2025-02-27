# 🌟 Elderly Care Platform:
**GoldenMate** is a **mobile application** designed to keep **elderly people** mentally *active* and *happy*. </br>
It features a **RoboBuddy**, an **AI-powered** companion that engages users in *conversation* and reminds them of important *events* and *timestamps*. 🎉

<div align="center">
  <img src="https://github.com/user-attachments/assets/894b9ce8-59d8-4cc0-b2ac-2516bff7dae3" alt="RoboBuddy" width="150"/>
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/8986352b-9b39-44bf-8aec-5e52c476ec2f" alt="App Logo" width="150"/>
</div>

## 👥 Team Members & Roles
 - **[Bucilă Mihai](https://github.com/bucilamihai)**: 
   - **Business**: Project management, business strategy, user acquisition, and stakeholder relations.
   - **Tech**: UI/UX designer responsible for the app’s user interface, focusing on creating an easy-to-use and accessible experience for elderly users.
 - **[Călăuz Răzvan](https://github.com/Razvanix445)**: 
   - **Tech**: Data scientist, developing RoboBuddy’s AI chat and game functionalities, focusing on improving the AI's natural language understanding and creating interactive, entertaining games for the user.
 - **[Chelaru Laurențiu](https://github.com/Kaensy)**: 
   - **Tech**: Data scientist, focusing on health data processing, analysis and recommendation generation, responsible for developing algorithms to analyze user-entered health metrics (like heart rate, blood sugar, and general wellness) and providing actionable recommendations to support healthy lifestyle choices.

## 🛠️ Working Environment
 - **AI model**: 
   - Python-based AI model that supports RoboBuddy’s health recommendation engine, conversational, and gaming abilities 🧠💬
   - **Scientific tools for AI model**: 
        - **Health Data Processing, Analysis, and Recommendation**:
            - *Data Management and Analysis*: Pandas and NumPy to handle health metrics and derive insights.
            - *Machine Learning Frameworks*: Scikit-learn, TensorFlow, or PyTorch to train and deploy models that analyze health patterns and offer lifestyle recommendations.
            - *Visualization*: Matplotlib or Seaborn to create user-friendly graphs and visual summaries of health trends over time.
        - **Conversational AI and Gaming**:
            - *NLP Tools*: NLTK, SpaCy, and BERT for natural language processing tasks, ensuring smooth conversational flow and relevant responses.
            - *Game Logic and Development*: Custom Python-based game scripts with adjustable difficulty levels for games like trivia, memory games, and Sudoku.
 - **Backend**: 
   - Python 🔐
   - Set up user authentication, integrate with AI model, and manage data storage.
 - **Frontend**: 
   - Ionic React 📱
   - Design the user interface and integrate it with the backend, ensuring accessibility for elderly users.

## 📋 Backlog

1. **LOGIN**: 
   - Users can log in with their name (and other credentials (ex., email, phone number or social media account)).
2. **CRUD Operations**: 
   - Manage users: Add, remove and update user profiles easily.
3. **Health care**:
    - Dedicated section for users to enter health-related data such as heart rate, blood sugar levels, overall health status and mood. Based on these metrics, the app provides recommendations for lifestyle improvements, including suggestions to consult a doctor if needed, advice on maintaining a balanced diet or tips for regular physical activity 🩺🥗🏃
4. **Notifications**: 
   - Timely alerts for important events, such as medication reminders, birthdays or appointments 🔔
5. **AI-inference**: 
   - RoboBuddy engages in meaningful conversations, plays games (like trivia or memory games, (Sudoku), X-and-O) to keep users entertained and mentally stimulated 🎮🧠
6. **Backup**: 
   - Automatic cloud backup of user data to prevent loss in case of device issues.
   - ex. **Firebase** or **Amazon S3** (each night, the app could automatically upload a copy of user data to the cloud)
7. **Cloud Storage**: 
   - Secure storage for personal data, such as notes, important dates, and user preferences ☁️
   - ex. Encryption with **Amazon S3**
8. **Offline Functionalities**: 
   - Basic features like playing games or setting reminders work even without internet access 🚫🌐
   - ex. **SQLite** for local storage
