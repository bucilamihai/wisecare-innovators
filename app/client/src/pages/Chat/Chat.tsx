import React, {useContext, useEffect, useState} from "react";
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
    IonFooter,
    IonIcon, IonSelectOption, IonSelect, IonAvatar,
} from "@ionic/react";
import { chatWithBot, transcribeAudio, saveConversation } from "../../services/api.ts";
import Menu from "../../components/Menu";
import {send, mic, micOff, gameController, airplane, apps, grid, personCircle} from "ionicons/icons";
import {useHistory} from "react-router-dom";
import userImage from "../../images/Profile_Picture.png";
import botImage from "../../images/RoboBuddy_Picture.png";
import joystickImage from "../../images/Joystick.svg";
import sudokuImage from "../../images/Sudoku.svg";
import ticTacToeImage from "../../images/TicTacToe.svg";
import planesImage from "../../images/Planes.svg";
import micOnImage from "../../images/mic_on.svg";
import micOffImage from "../../images/mic_off.svg";
import sendImage from "../../images/send.svg"
import {AppContext} from "../../context/AppProvider.tsx";
import "./Chat.css"

const convertToWav = async (audioBlob: Blob): Promise<Blob> => {
    const audioBuffer = await new AudioContext().decodeAudioData(await audioBlob.arrayBuffer());
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;

    // Prepare WAV file headers and data
    const bufferLength = audioBuffer.length * numChannels * 2 + 44;
    const buffer = new ArrayBuffer(bufferLength);
    const view = new DataView(buffer);

    // Write WAV header
    view.setUint32(0, 0x52494646, false); // RIFF
    view.setUint32(4, bufferLength - 8, true); // File size
    view.setUint32(8, 0x57415645, false); // WAVE
    view.setUint32(12, 0x666d7420, false); // fmt
    view.setUint32(16, 16, true); // Subchunk size
    view.setUint16(20, 1, true); // Audio format (PCM)
    view.setUint16(22, numChannels, true); // Channels
    view.setUint32(24, sampleRate, true); // Sample rate
    view.setUint32(28, sampleRate * numChannels * 2, true); // Byte rate
    view.setUint16(32, numChannels * 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample
    view.setUint32(36, 0x64617461, false); // data
    view.setUint32(40, bufferLength - 44, true); // Data size

    // Write PCM data
    let offset = 44;
    const channelData = [];
    for (let i = 0; i < numChannels; i++) {
        channelData.push(audioBuffer.getChannelData(i));
    }
    for (let i = 0; i < audioBuffer.length; i++) {
        for (let c = 0; c < numChannels; c++) {
            view.setInt16(offset, channelData[c][i] * 0x7fff, true);
            offset += 2;
        }
    }

    return new Blob([buffer], { type: "audio/wav" });
};

const Chat: React.FC = () => {
    const [input, setInput] = useState<string>("");
    const { messages, setMessages } = useContext(AppContext);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null); // URL for recorded audio
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    );
    const { voices, selectedVoice } = useContext(AppContext);

    const [showGameButtons, setShowGameButtons] = useState(false);
    const history = useHistory();

    const toggleGameButtons = () => {
        setShowGameButtons((prev) => !prev);
    };

    // const handleJoystickClick = () => {
    //   setShowGameButtons(!showGameButtons);
    // };

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ sender: "bot", text: "Hello, how can I help you today?" }]);
        }
    }, [messages, setMessages]);

    const navigateToGame = (game: string) => {
        history.push(`/${game}`);
    };

    // => Start or stop recording
    const toggleRecording = async () => {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);
                const audioChunks: Blob[] = [];

                recorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };

                recorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                    const wavBlob = await convertToWav(audioBlob);
                    const url = URL.createObjectURL(wavBlob);
                    setAudioURL(url);
                    await handleTranscription(wavBlob);
                };

                recorder.start();
                setMediaRecorder(recorder);
                setIsRecording(true);
            } catch (error) {
                console.error("Error accessing microphone:", error);
                alert("Could not access microphone.");
            }
        } else {
            mediaRecorder?.stop();
            setIsRecording(false);
        }
    };
    // <= END

    // => Handle transcription
    const handleTranscription = async (audioBlob: Blob) => {
        try {
            const transcription = await transcribeAudio(audioBlob);
            setInput(transcription);
        } catch (error) {
            alert("Could not transcribe audio. Please try again.");
        }
    };
    // <= END

    // => Function to handle sending messages
    const handleSendMessage = async () => {
        if (input.trim() === "") return; // Prevent sending empty messages

        const userMessage = { sender: "user", text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput("");

        // Add typing indicator as a bot message
        const typingMessage = { sender: "bot", text: "..." };
        setMessages((prev) => [...prev, typingMessage]);

        // Send message to backend and get response
        // const botResponse = await chatWithBot(input);
        setTimeout(async () => {
            const botResponse = await chatWithBot(input);
            const botMessage = { sender: "bot", text: botResponse };
            setMessages((prev) => [
                ...prev.slice(0, -1),
                { sender: "bot", text: botResponse },
            ]);
            textToSpeech(botResponse);
        }, 2000);
    };
    // <= END

    // => Text-to-Speech function
    const textToSpeech = (text: string) => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(text);

            const voice = voices.find((v) => v.name === selectedVoice);
            if (voice) {
                utterance.voice = voice;
            }

            utterance.lang = "en-US"; // Set language
            utterance.pitch = 1; // Adjust pitch (0 to 2, 1 is default)
            utterance.rate = 1; // Adjust rate (0.1 to 10, 1 is default)
            speechSynthesis.speak(utterance);
        } else {
            console.error("Text-to-Speech is not supported in this browser.");
        }
    };
    // <= END

    // => Function to handle saving the conversation
    const handleSaveConversation = async () => {
        try {
            const response = await saveConversation();
            if (response.message) {
                // alert(response.message);
                setMessages([]);
            } else {
                alert("Could not save the conversation.");
            }
        } catch (error) {
            alert("An error occurred while saving the conversation.");
        }
    };
    // <= END

    return (
        <IonPage style={{ backgroundColor: "#EFEFEF", color: "black" }}>

            <IonContent
                style={{"--background": "#EFEFEF", color: "black", display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
                {/* Display messages */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        overflowY: "auto",
                        marginTop: "50px",
                        padding: "10px",
                        backgroundColor: "#EFEFEF",
                    }}
                >
                    <IonButton
                        style={{
                            position: "absolute",
                            right: "15px", // Align to the right of the screen
                            top: "15px", // Optional: Adjust distance from the bottom
                            width: "100px", // Smaller width
                            height: "40px", // Adjust height for smaller size
                            fontSize: "14px", // Smaller font size
                            fontWeight: "bold",
                            borderRadius: "5px", // Optional: Rounded corners
                            "--background": "red",
                        }}
                        onClick={handleSaveConversation}
                    >
                        Reset
                    </IonButton>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                                alignItems: "center",
                                marginBottom: "15px", // Spacing between messages
                                paddingLeft: msg.sender === "bot" ? "10px" : "0px",
                                paddingRight: msg.sender === "user" ? "10px" : "0px",
                            }}
                        >
                            {msg.sender === "bot" && (
                                <IonAvatar
                                    style={{
                                        marginRight: "10px",
                                        width: "50px",
                                        height: "50px",
                                    }}
                                >
                                    <img
                                        src={botImage}
                                        alt="Bot"
                                        style={{
                                            borderRadius: "50%",
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </IonAvatar>
                            )}

                            <div
                                style={{
                                    maxWidth: "70%",
                                    padding: "10px 15px",
                                    borderRadius: "20px",
                                    backgroundColor: msg.sender === "user" ? "#FFAA55" : "#00DDAA",
                                    color: msg.sender === "user" ? "black" : "black",
                                    wordWrap: "break-word",
                                }}
                            >
                                {/* Typing indicator */}
                                {msg.text === "..." ? (
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                ) : (
                                    msg.text
                                )}
                            </div>

                            {msg.sender === "user" && (
                                <IonAvatar
                                    style={{
                                        marginLeft: "10px",
                                        width: "50px",
                                        height: "50px",
                                    }}
                                >
                                    <img
                                        src={userImage}
                                        alt="User"
                                        style={{
                                            borderRadius: "50%",
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </IonAvatar>
                            )}
                        </div>
                    ))}
                </div>

                {/*/!* Playback recorded audio *!/*/}
                {/*{audioURL && (*/}
                {/*    <div style={{ color: "black" }}>*/}
                {/*      <h4>Recorded Audio:</h4>*/}
                {/*      <audio controls src={audioURL}></audio>*/}
                {/*    </div>*/}
                {/*)}*/}

            </IonContent>
            <IonFooter
                style={{
                    backgroundColor: "transparent", // Make footer background transparent
                    backdropFilter: "none", // Remove blur effect
                    boxShadow: "none", // Remove shadow
                    border: "none", // Remove border
                    padding: "0", // Remove internal padding
                }}
            >
                <div
                    style={{
                        padding: "10px",
                        position: "relative",
                        "--background": "transparent",
                    }}
                >
                    {/* Joystick and Game Buttons */}
                    <div
                        style={{
                            position: "absolute",
                            top: "15px",
                            right: "50px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                        }}
                    >
                        {showGameButtons && (
                            <>
                                {/* Sudoku Button */}
                                <IonButton
                                    onClick={() => navigateToGame("sudoku")}
                                    className="game-button sudoku"
                                    fill="clear"
                                    style={{
                                        marginBottom: "10px",
                                        padding: "0",
                                        width: "70px",
                                        height: "70px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                    }}
                                >
                                    <img
                                        src={sudokuImage}
                                        alt="Sudoku"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </IonButton>

                                {/* Tic Tac Toe Button */}
                                <IonButton
                                    onClick={() => navigateToGame("tic-tac-toe")}
                                    className="game-button tic-tac-toe"
                                    fill="clear"
                                    style={{
                                        marginBottom: "10px",
                                        padding: "0",
                                        width: "70px",
                                        height: "70px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                    }}
                                >
                                    <img
                                        src={ticTacToeImage}
                                        alt="Tic Tac Toe"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </IonButton>

                                {/* Planes Button */}
                                <IonButton
                                    onClick={() => navigateToGame("planes")}
                                    className="game-button planes"
                                    fill="clear"
                                    style={{
                                        marginBottom: "10px",
                                        padding: "0",
                                        width: "70px",
                                        height: "70px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                    }}
                                >
                                    <img
                                        src={planesImage}
                                        alt="Planes"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </IonButton>
                            </>
                        )}

                        {/* Joystick Button */}
                        <IonButton
                            onClick={toggleGameButtons}
                            className="joystick-button"
                            fill="clear"
                            style={{
                                padding: "0",
                                width: "80px",
                                height: "80px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "50%",
                                overflow: "hidden",
                            }}
                        >
                            <img
                                src={joystickImage}
                                alt="Joystick"
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                }}
                            />
                        </IonButton>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px", // Increase spacing
                            padding: "15px", // Add padding around the section
                            backgroundColor: "#f9f9f9", // Light background for visibility
                            borderRadius: "15px", // Rounded corners for a softer look
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                        }}
                    >
                        {/* Input Field */}
                        <IonInput
                            placeholder="Type your message here..."
                            value={input}
                            onIonChange={(e) => setInput(e.detail.value!)}
                            style={{
                                flex: 1,
                                padding: "15px", // Larger padding for easier typing
                                textIndent: "10px",
                                borderRadius: "25px", // More rounded input field
                                border: "2px solid #cccccc", // Thicker border for visibility
                                fontSize: "18px", // Larger text for readability
                                color: "black",
                                backgroundColor: "white", // Ensure contrast against the background
                            }}
                        />

                        {/* Recording Button */}
                        <IonButton
                            onClick={toggleRecording}
                            style={{
                                width: "60px", // Keep button size
                                height: "60px",
                                "--background": "transparent",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "50%",
                                padding: "0", // Remove internal padding
                                overflow: "hidden", // Ensure no clipping
                            }}
                        >
                            <img
                                src={isRecording ? micOffImage : micOnImage}
                                alt="Record Button"
                                style={{
                                    width: "100%", // Icon fully occupies button width
                                    height: "100%", // Icon fully occupies button height
                                    objectFit: "contain", // Preserve aspect ratio
                                }}
                            />
                        </IonButton>

                        {/* Send Button */}
                        <IonButton
                            onClick={handleSendMessage}
                            style={{
                                width: "60px", // Keep button size
                                height: "60px",
                                "--background": "transparent",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "50%",
                                padding: "0", // Remove internal padding
                                overflow: "hidden", // Ensure no clipping
                            }}
                        >
                            <img
                                src={sendImage}
                                alt="Send Button"
                                style={{
                                    width: "100%", // Icon fully occupies button width
                                    height: "100%", // Icon fully occupies button height
                                    objectFit: "contain", // Preserve aspect ratio
                                }}
                            />
                        </IonButton>
                    </div>
                </div>
                <Menu/>
            </IonFooter>
        </IonPage>
    );
};

export default Chat;