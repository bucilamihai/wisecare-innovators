# # BERT - gives hidden states and pooled output
# from transformers import BertTokenizer, BertModel
#
# tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
# model = BertModel.from_pretrained("bert-base-uncased")
# text = "Replace me by any text you'd like."
# encoded_input = tokenizer(text, return_tensors='pt')
# output = model(**encoded_input)
#
# print("Hidden States (last layer for each token):", output.last_hidden_state)
# print("Pooled Output (representation for [CLS] token):", output.pooler_output)



# # DialoGPT Endpoint
# tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-large")
# model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-large")
#
# if tokenizer.pad_token is None:
#     tokenizer.pad_token = tokenizer.eos_token
#
# @app.route('/chat', methods=['POST'])
# def chat():
#     data = request.json
#     user_message = data.get("message")
#
#     # Tokenize input and set attention mask
#     inputs = tokenizer(user_message, return_tensors="pt", padding=True, truncation=True)
#     input_ids = inputs['input_ids']
#     attention_mask = inputs['attention_mask']
#
#     # Generate response
#     outputs = model.generate(
#         input_ids,
#         attention_mask=attention_mask,
#         max_length=50,
#         pad_token_id=tokenizer.pad_token_id
#     )
#     response = tokenizer.decode(outputs[0], skip_special_tokens=True)
#
#     # Return the response as JSON
#     return jsonify({"response": response + " (DialoGPT)"})



# # GPT-2 - Kind of repetitive, not very useful
# from transformers import GPT2Tokenizer, GPT2LMHeadModel
#
# # Load pre-trained GPT-2 tokenizer and model
# tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
# model = GPT2LMHeadModel.from_pretrained("gpt2")
#
# # Input text
# text = "What are you doing today?"
#
# # Encode input and generate text
# input_ids = tokenizer.encode(text, return_tensors='pt')
# output = model.generate(input_ids, max_length=50, num_return_sequences=1)
#
# # Decode the generated text
# generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
#
# # Print the generated sentence
# print(generated_text)



# from transformers import T5Tokenizer, T5ForConditionalGeneration
#
# # Load pre-trained T5 model and tokenizer
# tokenizer = T5Tokenizer.from_pretrained("t5-base")
# model = T5ForConditionalGeneration.from_pretrained("t5-base")
#
# # Input text
# text = "chat: How's the weather today?"
#
# # Tokenize input and generate response
# input_ids = tokenizer.encode(text, return_tensors="pt")
# outputs = model.generate(input_ids, max_length=50)
#
# # Decode the generated response
# response = tokenizer.decode(outputs[0], skip_special_tokens=True)
# print(response)



# Blenderbot - EXCELENT RESPONSES, but it's too slow
# from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration
#
# # Load BlenderBot model and tokenizer
# tokenizer = BlenderbotTokenizer.from_pretrained('facebook/blenderbot-400M-distill')
# model = BlenderbotForConditionalGeneration.from_pretrained('facebook/blenderbot-400M-distill')
#
# # Input text for chat
# text = "Hello! How are you today?"
#
# # Tokenize input and generate response
# inputs = tokenizer(text, return_tensors='pt')
# reply_ids = model.generate(**inputs)
#
# # Decode the generated reply
# response = tokenizer.decode(reply_ids[0], skip_special_tokens=True)
# print(response)




# import kagglehub
#
# # Download latest version
# path = kagglehub.dataset_download("thedevastator/dailydialog-unlock-the-conversation-potential-in")
#
# print("Path to dataset files:", path)




import pandas as pd

# Path to the dataset files
dataset_path = "C:/Users/razva/.cache/kagglehub/datasets/thedevastator/dailydialog-unlock-the-conversation-potential-in/versions/2"

# Load the dataset (assuming it's a CSV or can be loaded directly into pandas)
dialog_data = pd.read_csv(f"{dataset_path}/train.csv")  # Replace with actual filename
print(dialog_data.head())




# Define keywords relevant to elderly conversations
keywords = [
    "retirement", "retire", "retired", "health", "healthy", "doctor", "doctors", "medicine",
    "medicines", "appointment", "appointments", "pain", "pains", "painful", "exercise",
    "exercises", "exercising", "nutrition", "nutritious", "diet", "diets", "caregiver",
    "caregivers", "mobility", "mobile", "walker", "walkers", "wheelchair", "wheelchairs",
    "chronic", "chronically", "therapy", "therapies", "therapeutic", "memory", "memories",
    "vision", "visual", "hearing", "hearing aid", "retirement home", "retirement homes",
    "nursing home", "nursing homes", "checkup", "checkups", "blood pressure", "diabetes",
    "diabetic", "alzheimer’s", "dementia", "arthritic", "arthritis", "physical therapy",
    "rehabilitation", "hospital", "hospitals", "pharmacy", "pharmacies", "prescription",
    "prescriptions", "illness", "illnesses", "disease", "diseases",
    "family", "families", "grandchildren", "grandchild", "grandkids", "grandson",
    "granddaughter", "children", "child", "kids", "kid", "nephew", "niece", "spouse",
    "spouses", "marriage", "married", "partner", "partners", "relative", "relatives",
    "friends", "friend", "loved one", "loved ones", "visit", "visits", "visiting",
    "reunion", "reunions", "celebration", "celebrations", "wedding", "weddings",
    "babysit", "babysitting", "holiday", "holidays", "anniversary", "anniversaries",
    "gathering", "gatherings", "companion", "companionship",
    "memory", "memories", "past", "childhood", "young", "younger", "younger years",
    "old days", "good times", "story", "stories", "history", "histories", "war",
    "wars", "travel", "travels", "traveling", "adventure", "adventures", "experience",
    "experiences", "lesson", "lessons", "achievement", "achievements", "struggle",
    "struggles", "wisdom", "wise", "education", "educational", "youth", "youthful",
    "nostalgia", "nostalgic", "reflection", "reflections", "journey", "journeys", "time",
    "times",
    "pension", "pensions", "savings", "saving", "save", "saved", "insurance", "insured",
    "budget", "budgets", "fixed income", "expenses", "expense", "estate", "inheritance",
    "inheritances", "will", "wills", "property", "properties", "investment", "investments",
    "invest", "invested", "social security", "tax", "taxes", "golden years", "finances",
    "financial", "retirement plan", "medical bills", "trust fund", "legacy", "legacies",
    "hobby", "hobbies", "gardening", "garden", "gardens", "knitting", "knit", "reading",
    "read", "reads", "book", "books", "writing", "write", "writes", "tv", "television",
    "radios", "radio", "music", "musical", "piano", "art", "arts", "painting", "paint",
    "paintings", "drawing", "draw", "draws", "photography", "photographs", "photo",
    "photos", "cook", "cooking", "bake", "baking", "bakes", "walk", "walking", "walks",
    "golf", "fishing", "fish", "bridge", "cards", "card", "puzzles", "puzzle", "sudoku",
    "sewing", "sew", "quilting", "quilt", "craft", "crafts", "crafting", "scrapbooking",
    "scrapbook", "birdwatching", "birdwatch", "antique", "antiques", "history channel",
    "phone", "phones", "smartphone", "smartphones", "computer", "computers", "internet",
    "email", "emails", "facebook", "skype", "whatsapp", "video call", "video calls",
    "text", "texts", "texting", "app", "apps", "social media", "picture", "pictures",
    "zoom", "virtual", "camera", "cameras", "online shopping", "streaming",
    "stream", "streams",
    "church", "churches", "volunteer", "volunteering", "charity", "charities", "community",
    "communities", "event", "events", "club", "clubs", "senior center", "senior centers",
    "meeting", "meetings", "gathering", "gatherings", "festival", "festivals", "group",
    "groups", "support group", "support groups", "charitable", "outreach", "activity",
    "activities", "neighbor", "neighbors",
    "lonely", "loneliness", "grateful", "gratefulness", "thankful", "thankfulness",
    "happy", "happiness", "sad", "sadness", "loss", "grief", "grieving", "mourning",
    "reflect", "reflects", "love", "loving", "hope", "hopeful", "hopes", "joy", "peace",
    "comfort", "sorrow", "empathy", "sympathy", "understanding", "depression",
    "companionship", "forgiveness", "reminisce", "reminiscing", "gratitude", "grateful",
    "help", "helps", "helping", "assistance", "assist", "assisted", "care", "cares",
    "caring", "support", "supports", "supported", "aid", "aiding", "home help",
    "housekeeping", "meals", "transportation", "transport", "nurse", "nurses",
    "caretaker", "caretakers", "respite care", "home visits", "visits", "meals on wheels",
    "elder care", "medicare", "medicaid", "home safety", "safe home",
    "aging", "aged", "elder", "elders", "senior", "seniors", "old", "older", "age",
    "aging gracefully", "retirement age", "golden years", "aging population", "geriatric",
    "gerontology", "longevity", "senior living", "life expectancy", "centenarian"
]


# Filter dialogues containing these keywords
def contains_keywords(text):
    return any(keyword in text.lower() for keyword in keywords)

# Apply filter
dialog_data['relevant'] = dialog_data['dialogue'].apply(contains_keywords)
elder_conversations = dialog_data[dialog_data['relevant']]

# Save relevant conversations to a new dataset
elder_conversations.to_csv("elderly_relevant_conversations.csv", index=False)
print("Filtered dataset saved as 'elderly_relevant_conversations.csv'.")