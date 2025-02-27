import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { chatWithBot } from "../services/api.ts"; // Import getInitialMessage

type SpeechRecognition =
  | (typeof window)["webkitSpeechRecognition"]
  | (typeof window)["SpeechRecognition"];

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

const ChatComponent: React.FC = () => {
  const [input, setInput] = useState<string>(""); // State for input text
  const [messages, setMessages] = useState<
    Array<{ sender: string; text: string }>
  >([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );

  // => Start or stop recording
  const toggleRecording = () => {
    if (!recognition) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition not supported in this browser.");
        return;
      }
      const newRecognition = new SpeechRecognition();
      newRecognition.lang = "en-US";
      newRecognition.interimResults = false;
      newRecognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput((prevInput) => `${prevInput} ${transcript}`.trim());
        setInput(transcript);
      };
      newRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
      setRecognition(newRecognition);
      newRecognition.start();
      setIsRecording(true);
    } else {
      recognition.stop();
      setRecognition(null);
      setIsRecording(false);
    }
  };
  // <= END

  // Function to handle sending messages
  const handleSendMessage = async () => {
    if (input.trim() === "") return; // Prevent sending empty messages

    // Add user message to messages list
    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setInput("");

    // Send message to backend and get response
    const botResponse = await chatWithBot(input);
    const botMessage = { sender: "bot", text: botResponse };

    // Update messages list with bot's response
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chat with AI</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Display messages */}
        <IonList>
          {messages.map((msg, index) => (
            <IonItem
              key={index}
              color={msg.sender === "user" ? "primary" : "secondary"}
            >
              <IonLabel>
                <p>
                  <strong>{msg.sender === "user" ? "You" : "AI"}:</strong>{" "}
                  {msg.text}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        {/* Input for sending a new message */}
        <IonInput
          placeholder="Type your message or press the mic"
          value={input}
          onIonChange={(e) => setInput(e.detail.value!)}
        />
        <IonButton expand="block" onClick={handleSendMessage}>
          Send
        </IonButton>
        <IonButton
          expand="block"
          color={isRecording ? "danger" : "primary"}
          onClick={toggleRecording}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ChatComponent;
