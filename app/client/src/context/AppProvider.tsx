import React, { createContext, useState, useEffect } from "react";

// Define the context interface
interface AppContextProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  messages: Array<{ sender: string; text: string }>;
  setMessages: (messages: Array<{ sender: string; text: string }>) => void;
}

// Initial context values
export const AppContext = createContext<AppContextProps>({
  voices: [],
  selectedVoice: "",
  setSelectedVoice: () => {},
  messages: [],
  setMessages: () => {},
});

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([]);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const fetchVoices = () => {
        const synthVoices = window.speechSynthesis.getVoices();
        setVoices(synthVoices);
      };

      // Fetch voices initially
      fetchVoices();

      // Listen for the `voiceschanged` event
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = fetchVoices;
      }
    }
  }, []);

  return (
      <AppContext.Provider value={{ voices, selectedVoice, setSelectedVoice, messages, setMessages }}>
        {children}
      </AppContext.Provider>
  );
};

export default AppProvider;