import pandas as pd
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration, Trainer, TrainingArguments
from datasets import Dataset

# Load your dataset
file_path = "elderly_dataset.csv"
df = pd.read_csv(file_path)

# Select only the necessary columns
df = df[['user_input', 'ai_response']]

# Rename columns to match the Hugging Face format
df.rename(columns={"user_input": "input", "ai_response": "output"}, inplace=True)

# Prepare the dataset for Hugging Face's Trainer
def preprocess_function(examples):
    model_inputs = tokenizer(examples['input'], truncation=True, padding="max_length", max_length=128)
    labels = tokenizer(examples['output'], truncation=True, padding="max_length", max_length=128)
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

# Convert to Hugging Face Dataset format
dataset = Dataset.from_pandas(df)
tokenizer = BlenderbotTokenizer.from_pretrained("facebook/blenderbot-400M-distill")
dataset = dataset.map(preprocess_function, batched=True)

# Split into train and validation sets
train_test_split = dataset.train_test_split(test_size=0.2)
train_dataset = train_test_split["train"]
eval_dataset = train_test_split["test"]

# Load the pre-trained BlenderBot model
model = BlenderbotForConditionalGeneration.from_pretrained("facebook/blenderbot-400M-distill")

# Define training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=5e-5,
    per_device_train_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    save_total_limit=2,
    logging_dir="./logs",
    load_best_model_at_end=True,
    metric_for_best_model="eval_loss",
)

# Define the Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
)

# Fine-tune the model
trainer.train()

# Save the fine-tuned model
model.save_pretrained("./fine_tuned_blenderbot")
tokenizer.save_pretrained("./fine_tuned_blenderbot")

print("Model fine-tuning complete and saved!")
