import axios from "axios";

// Configure the base URL for the API
const api = axios.create({
  baseURL: "http://192.168.250.89:5000",
});

// Configuration for axios
api.defaults.headers.common["Content-Type"] = "application/json";
api.defaults.headers.common["Accept"] = "application/json";

export const registerUser = async (userData: any) => {
  try {
    const response = await api.post("/register", userData);
    return { ok: true };
  } catch (error) {
    console.error("Error occurred during API call:", error); // Log the full error
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return { ok: false, error: error.response.data.error };
      } else {
        return { ok: false, error: error.message };
      }
    } else {
      return { ok: false, error: error };
    }
  }
};

export const loginUser = async (userData: any) => {
  try {
    const response = await api.post("/login", userData);
    return { ok: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return { ok: false, error: error.response.data.error };
      } else {
        return { ok: false, error: error.message };
      }
    } else {
      return { ok: false, error: error };
    }
  }
};

export const updateUser = async (userData: any) => {
  try {
    const response = await api.put("/update_user", userData);
    return { ok: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return { ok: false, error: error.response.data.error };
      } else {
        return { ok: false, error: error.message };
      }
    } else {
      return { ok: false, error: error };
    }
  }
};

export const getUser = async (userId: any) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return { ok: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return { ok: false, error: error.response.data.error };
      } else {
        return { ok: false, error: error.message };
      }
    } else {
      return { ok: false, error: error };
    }
  }
};

// Reminder functions

// add reminder
export const addReminder = async (reminderData: any) => {
  try {
    const response = await api.post("/reminder", reminderData);
    console.log(response.data);
    return { ok: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return { ok: false, error: error.response.data.error };
      } else {
        return { ok: false, error: error.message };
      }
    } else {
      return { ok: false, error: error };
    }
  }
};

// get reminders by user id
export const getReminders = async (userId: any) => {
  try {
    const response = await api.get(`/reminders/${userId}`);
    return { ok: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return { ok: false, error: error.response.data.error };
      } else {
        return { ok: false, error: error.message };
      }
    } else {
      return { ok: false, error: error };
    }
  }
};

// delete reminder by id
export const deleteReminder = async (id: any) => {
  try {
    console.log(id);
    const response = await api.delete(`/reminder/${id}`);
    return { ok: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return { ok: false, error: error.response.data.error };
      } else {
        return { ok: false, error: error.message };
      }
    } else {
      return { ok: false, error: error };
    }
  }
};

// Function to send a message to the chatbot (for user-initiated conversations)
export const chatWithBot = async (message: string) => {
  try {
    const response = await api.post("/chat", { message });
    return response.data.response;
  } catch (error) {
    console.error("Error communicating with the chatbot API:", error);
    return "Sorry, I'm having trouble responding at the moment.";
  }
};

// Function to transcribe audio using the backend
export const transcribeAudio = async (audioBlob: Blob) => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    const response = await api.post("/transcribe", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data && response.data.transcription) {
      return response.data.transcription;
    } else {
      throw new Error("No transcription found in the response.");
    }
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
  }
};

export const saveConversation = async () => {
  try {
    const response = await api.post("/save_conversation");
    return response.data;
  } catch (error) {
    console.error("Error saving the conversation:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return { ok: false, error: error.response.data.error };
      } else {
        return { ok: false, error: error.message };
      }
    } else {
      return { ok: false, error: error };
    }
  }
};

// Health Data Types
export interface HealthData {
  userId: number;
  age: number;
  gender: string;
  height: number;
  weight: number;
  systolic: number;
  diastolic: number;
  glucose: number;
  cholesterol: number;
  smoking: string;
  active: number;
  alcohol: number;
}

// Function to save health data
export const saveHealthData = async (healthData: HealthData) => {
  try {
    const response = await api.post("/health/save", healthData);
    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Error saving health data:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return { ok: false, error: error.response.data.error };
      } else {
        return { ok: false, error: error.message };
      }
    } else {
      return { ok: false, error: error };
    }
  }
};

// Function to retrieve user's health data
export const getHealthData = async (id: any) => {
  try {
    const response = await api.get(`/health/get/${id}`);
    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Error retrieving health data:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return { ok: false, error: error.response.data.error };
      } else {
        return { ok: false, error: error.message };
      }
    } else {
      return { ok: false, error: error };
    }
  }
};
