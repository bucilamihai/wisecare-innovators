import React, { useContext, useState } from "react";
import {
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonContent,
  IonButton,
  IonText,
} from "@ionic/react";
import Menu from "../../components/Menu";
import { AppContext } from "../../context/AppProvider";
import "./Settings.css";

const Settings: React.FC = () => {
  const { voices, selectedVoice, setSelectedVoice } = useContext(AppContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    setIsDropdownOpen(false); // Close dropdown
  };

  const handleLogout = () => {
    localStorage.clear();
    // alert("You have been logged out.");
    window.location.href = "/login";
  };

  return (
    <IonPage>
      <IonToolbar>
        <IonTitle>Settings</IonTitle>
      </IonToolbar>
      <IonContent style={{ "--background": "#F9F9F9", color: "black" }}>
        <div
          style={{
            flex: 1,
            margin: "35px",
            padding: "1rem",
            textAlign: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "calc(100vh - 160px)",
          }}
        >
          {/* Section Title */}
          <div style={{ marginBottom: "1rem" }}>
            <IonText
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#28a745",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Voice Settings
            </IonText>

            {/* Custom Voice Dropdown */}
            <div
              style={{
                position: "relative",
                top: "55px",
                display: "inline-block",
                width: "100%",
              }}
            >
              <IonButton
                expand="block"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  width: "100%",
                  border: "2px solid #28a745",
                  borderRadius: "15px",
                  padding: "10px",
                  backgroundColor: "#F8F8F8",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#1E1E1E",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {selectedVoice || "Select Voice"}
                <span style={{ fontSize: "20px" }}>
                  {isDropdownOpen ? "▲" : "▼"}
                </span>
              </IonButton>

              {isDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "50px",
                    left: 0,
                    right: 0,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E0E0E0",
                    borderRadius: "10px",
                    zIndex: 1000,
                    maxHeight: "200px",
                    overflowY: "auto",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {voices.map((voice) => (
                    <div
                      key={voice.name}
                      onClick={() => handleVoiceChange(voice.name)}
                      style={{
                        padding: "10px 15px",
                        margin: "5px",
                        borderRadius: "10px",
                        backgroundColor:
                          selectedVoice === voice.name ? "#28a745" : "#FFFFFF",
                        color:
                          selectedVoice === voice.name ? "#FFFFFF" : "#1E1E1E",
                        fontSize: "16px",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {voice.name} ({voice.lang})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <IonButton className="custom-button" onClick={handleLogout}>
            Log Out
          </IonButton>
        </div>
      </IonContent>
      <IonFooter translucent={true}>
        <Menu />
      </IonFooter>
    </IonPage>
  );
};

export default Settings;
