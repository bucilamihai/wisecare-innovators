from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

emotion_model_name = "bhadresh-savani/bert-base-go-emotion"
emotion_tokenizer = AutoTokenizer.from_pretrained(emotion_model_name)
emotion_model = AutoModelForSequenceClassification.from_pretrained(emotion_model_name)

emotion_analyzer = pipeline("text-classification", model=emotion_model, tokenizer=emotion_tokenizer)



# Analyzes emotions from the user message
def analyse_sentiment(user_message):
    result = emotion_analyzer(user_message)
    top_emotion = max(result, key=lambda x: x['score'])
    return {"label": top_emotion['label'], "score": top_emotion['score']}



# Computes overall sentiment for the daily conversation (just the user's messages)
def compute_overall_sentiment(sentiments):
    emotion_counts = {}
    emotion_scores = {}

    for sentiment in sentiments:
        label = sentiment['sentiment']['label']
        score = sentiment['sentiment']['score']

        if label not in emotion_counts:
            emotion_counts[label] = 0
            emotion_scores[label] = 0.0

        emotion_counts[label] += 1
        emotion_scores[label] += score

    for label in emotion_scores:
        emotion_scores[label] /= emotion_counts[label]

    dominant_emotion = max(emotion_counts, key=emotion_counts.get)

    overall_score = emotion_scores[dominant_emotion]

    return {
        "dominant_emotion": dominant_emotion,
        "score": overall_score,
        "emotion_distribution": emotion_counts
    }