import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonText,
  IonImg,
  IonIcon,
} from "@ionic/react";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { loginUser } from "../../services/api";
import { useHistory } from "react-router-dom";
import "./Login.css";
import roboDefault from "../../images/Default_RoboBuddy.svg";
import roboSurprised from "../../images/Surprised_RoboBuddy.svg";
import roboConfused from "../../images/Confused_RoboBuddy.svg";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [face, setFace] = useState("default");
  const [errorMessage, setErrorMessage] = useState("");
  const [fade, setFade] = useState(false);
  const history = useHistory();

  let typingTimeout: NodeJS.Timeout | undefined;

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: CustomEvent, field: string) => {
    const value = (e.target as HTMLInputElement).value;

    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    setIsTyping(true);
    setFace("surprised");

    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      setIsTyping(false);
      setFace("default");
    }, 1000);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      setFace("confused");
      setFade(true);

      setTimeout(() => {
        setFace("default");
      }, 1000);

      setTimeout(() => {
        setFade(false);
        setErrorMessage("");
      }, 3000);

      return;
    }

    const userData = { email, password };
    const response = await loginUser(userData);

    if (response.ok) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("loggedUserId", response.data.data.id);
      history.push("/home");
      history.go(0);
    } else {
      setErrorMessage(response.error || "An unknown error occurred.");
      setFace("confused");
      setFade(true);

      setTimeout(() => {
        setFace("default");
      }, 1000);

      setTimeout(() => {
        setFade(false);
        setErrorMessage("");
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, []);

  const handleRegisterRedirect = () => {
    history.push("/register");
  };

  return (
    <IonPage>
      <IonContent style={{ "--background": "#EFEFEF", color: "black" }}>
        <div
          style={{
            textAlign: "center",
            marginTop: "6rem",
            marginBottom: "4rem",
          }}
        >
          {face === "confused" && (
            <img
              src={roboConfused}
              alt="Confused Icon"
              style={{ width: "120px", height: "120px" }}
            />
          )}
          {face === "default" && (
            <img
              src={roboDefault}
              alt="Idle Icon"
              style={{ width: "120px", height: "120px" }}
            />
          )}
          {face === "surprised" && (
            <img
              src={roboSurprised}
              alt="Surprised Icon"
              style={{ width: "120px", height: "120px" }}
            />
          )}
        </div>

        <div
          style={{
            maxWidth: "400px",
            margin: "2rem auto",
            textAlign: "center",
            "--background": "#EFEFEF",
            color: "black",
          }}
        >
          <IonItem className="custom-input">
            <IonInput
              placeholder="E-mail..."
              type="text"
              value={email}
              onInput={(e) => handleInputChange(e as any, "email")}
            />
          </IonItem>
          <IonItem className="custom-input" style={{ marginBottom: "1rem" }}>
            <IonInput
              placeholder="Password..."
              type={showPassword ? "text" : "password"}
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            />
            <IonButton
              style={{ color: "black" }}
              fill="clear"
              slot="end"
              onClick={handleTogglePasswordVisibility}
            >
              <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
            </IonButton>
          </IonItem>

          <IonText
            style={{
              display: "block",
              textAlign: "right",
              marginTop: "5px",
              marginBottom: "3rem",
              color: "blue",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Forgot password?
          </IonText>

          <div
            style={{
              height: "20px",
              marginBottom: "10px",
            }}
          >
            <IonText
              className={`error-message ${fade ? "fade-in" : "fade-out"}`}
              style={{
                display: "block",
                color: "red",
                fontSize: "18px",
                fontWeight: "bold",
                transition: "opacity 0.5s",
                opacity: fade ? 1 : 0,
              }}
            >
              {errorMessage}
            </IonText>
          </div>

          <IonButton
            expand="block"
            color="success"
            style={{
              width: "250px",
              height: "50px",
              margin: "10px auto",
              borderRadius: "25px",
              fontSize: "22px",
              fontWeight: "bold",
              textTransform: "none",
            }}
            onClick={handleLogin}
          >
            Login
          </IonButton>
          <IonText
            style={{
              margin: "1.5rem 0",
              display: "block",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            or
          </IonText>
          <IonText
            className="create-account-link"
            onClick={handleRegisterRedirect}
          >
            Create an account
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
