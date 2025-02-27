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
  IonIcon,
} from "@ionic/react";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import React, { useState } from "react";
import { registerUser } from "../../services/api";
import { useHistory } from "react-router";
import "./Registration.css";

const Registration: React.FC = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fade, setFade] = useState(false);
  const history = useHistory();

  const handleTogglePasswordVisibility = (type: string) => {
    if (type === "password") setShowPassword(!showPassword);
    if (type === "confirmPassword")
      setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async () => {
    setFade(false);

    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      triggerFadeOut();
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      triggerFadeOut();
      return;
    }

    const userData = {
      firstname,
      lastname,
      email,
      password,
      confirm_password: confirmPassword,
    };
    const response = await registerUser(userData);

    if (response.ok) {
      // setErrorMessage("User registered successfully.");
      // triggerFadeOut();
      history.push("/login");
    } else {
      setErrorMessage(response.error || "An unknown error occurred.");
      triggerFadeOut();
    }
  };

  const triggerFadeOut = () => {
    setTimeout(() => {
      setFade(true);
    }, 2000);
    setTimeout(() => {
      setErrorMessage("");
      setFade(false);
    }, 3000);
  };

  return (
    <IonPage>
      <IonContent style={{ "--background": "#EFEFEF", color: "black" }}>
        {/* Title */}
        <div
          style={{
            textAlign: "center",
            marginTop: "6rem",
            marginBottom: "3rem",
            color: "black",
          }}
        >
          <IonTitle style={{ fontSize: "30px", fontWeight: "bold" }}>
            Register
          </IonTitle>
        </div>

        {/* Registration Form */}
        <div
          style={{
            maxWidth: "400px",
            margin: "2rem auto",
            textAlign: "center",
            "--background": "#EFEFEF",
            color: "black",
          }}
        >
          <IonItem className="custom-input" style={{ marginBottom: "35px" }}>
            <IonInput
              placeholder="First name"
              type="text"
              value={firstname}
              onInput={(e) =>
                setFirstname((e.target as HTMLInputElement).value)
              }
            />
          </IonItem>
          <IonItem className="custom-input" style={{ marginBottom: "35px" }}>
            <IonInput
              placeholder="Last name"
              type="text"
              value={lastname}
              onInput={(e) => setLastname((e.target as HTMLInputElement).value)}
            />
          </IonItem>
          <IonItem className="custom-input" style={{ marginBottom: "35px" }}>
            <IonInput
              placeholder="E-mail"
              type="text"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            />
          </IonItem>
          <IonItem className="custom-input" style={{ marginBottom: "35px" }}>
            <IonInput
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            />
            <IonButton
              style={{ color: "black" }}
              fill="clear"
              slot="end"
              onClick={() => handleTogglePasswordVisibility("password")}
            >
              <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
            </IonButton>
          </IonItem>
          <IonItem className="custom-input" style={{ marginBottom: "30px" }}>
            <IonInput
              placeholder="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onInput={(e) =>
                setConfirmPassword((e.target as HTMLInputElement).value)
              }
            />
            <IonButton
              style={{ color: "black" }}
              fill="clear"
              slot="end"
              onClick={() => handleTogglePasswordVisibility("confirmPassword")}
            >
              <IonIcon
                icon={showConfirmPassword ? eyeOffOutline : eyeOutline}
              />
            </IonButton>
          </IonItem>

          {/* Error Message */}
          <div
            style={{
              height: "24px", // Reserve space for error
              fontSize: "16px",
              fontWeight: "bold",
              color: "red",
              opacity: fade ? 0 : 1, // Handle fade-out effect
              transition: "opacity 2s ease", // Smooth fade-out
              marginBottom: "1rem",
            }}
          >
            {errorMessage}
          </div>

          {/* Register Button */}
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
            onClick={handleRegister}
          >
            Register
          </IonButton>

          {/* Login Redirect */}
          <IonText
            style={{
              marginTop: "1.5rem",
              display: "block",
              fontSize: "18px",
              fontWeight: "bold",
              color: "blue",
              cursor: "pointer",
            }}
            onClick={() => history.push("/login")}
          >
            Already have an account? Log in
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Registration;
