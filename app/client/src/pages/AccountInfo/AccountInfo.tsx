import {
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonButton,
  IonInput,
  IonIcon,
  IonContent,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonText,
} from "@ionic/react";
import "./AccountInfo.css";
import React, { useState } from "react";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { updateUser } from "../../services/api";

const AccountInfo: React.FC = () => {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [fade, setFade] = useState(false);

  const handleButtonClick = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: CustomEvent, field: string) => {
    const value = (e.target as HTMLInputElement).value;
    if (field === "firstName") setFirstName(value);
    if (field === "lastName") setLastName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    // if (field === "profilePicture") setProfilePicture(value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setDateOfBirth("");
    setGender("");
    setProfilePhoto(null);
  };

  const handleUpdateUser = async () => {
    const id = localStorage.getItem("loggedUserId");
    const userData = {
      id,
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      gender,
      profilePhoto,
    };
    console.log(userData);
    if (
      !firstName &&
      !lastName &&
      !email &&
      !password &&
      !dateOfBirth &&
      !gender &&
      !profilePhoto
    ) {
      setError(true);
      setErrorMessage("Please fill at least one field in order to update.");
      setFade(true);

      setTimeout(() => {}, 1000);

      setTimeout(() => {
        setFade(false);
        setErrorMessage("");
      }, 3000);
      return;
    }
    const response = await updateUser(userData);
    if (response.ok) {
      // clear the form
      clearForm();
      setError(false);
      setErrorMessage("Successfully updated your personal details.");
      setFade(true);

      setTimeout(() => {}, 1000);

      setTimeout(() => {
        setFade(false);
        setErrorMessage("");
      }, 3000);
    } else {
      console.log(response.error);
      setError(true);
      setErrorMessage(response.error || "An unknown error occurred.");
      setFade(true);

      setTimeout(() => {}, 1000);

      setTimeout(() => {
        setFade(false);
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Account information</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ "--background": "#EFEFEF", color: "black" }}>
        <div
          style={{
            textAlign: "center",
            marginTop: "6rem",
            marginBottom: "4rem",
          }}
        ></div>

        <div
          style={{
            maxWidth: "800px",
            margin: "2rem auto",
            textAlign: "center",
            "--background": "#EFEFEF",
            color: "black",
          }}
        >
          <IonItem className="custom-input">
            <IonInput
              placeholder="First name..."
              type="text"
              value={firstName}
              onInput={(e) => handleInputChange(e as any, "firstName")}
            />
          </IonItem>
          <IonItem className="custom-input">
            <IonInput
              placeholder="Last name..."
              type="text"
              value={lastName}
              onInput={(e) => handleInputChange(e as any, "lastName")}
            />
          </IonItem>
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
              onInput={(e) => handleInputChange(e as any, "password")}
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
          <IonItem className="custom-input">
            <IonDatetime
              className="date-picker"
              value={dateOfBirth || "1970-01-01"}
              min="1900-01-01"
              max="2100-12-31"
              presentation="date"
              onIonChange={(e) => {
                setDateOfBirth(e.detail.value);
              }}
            />
          </IonItem>
          <IonItem className="custom-input">
            <IonSelect
              className="custom-select"
              value={gender}
              placeholder="Gender..."
              onIonChange={(e) => {
                if (e && e.detail) {
                  const selectedValue = e.detail.value;
                  setGender(selectedValue);
                }
              }}
              interface="popover"
              interfaceOptions={{ cssClass: "custom-popover" }}
            >
              <IonSelectOption value="male">Male</IonSelectOption>
              <IonSelectOption value="female">Female</IonSelectOption>
              <IonSelectOption value="prefer not to say">
                Prefer not to say
              </IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem className="custom-input">
            <IonButton onClick={handleButtonClick}>Upload Photo</IonButton>
            {/* Hidden file input */}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {profilePhoto && (
              <img
                src={profilePhoto}
                alt="Profile"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            )}
          </IonItem>

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
                color: error ? "red" : "green",
                fontSize: "18px",
                fontWeight: "bold",
                transition: "opacity 0.5s",
                opacity: fade ? 1 : 0,
              }}
            >
              {errorMessage}
            </IonText>
          </div>

          <IonButton onClick={handleUpdateUser}>
            Update your personal details
          </IonButton>
        </div>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton
            className="center-button"
            onClick={() => history.push("/home")}
          >
            Back
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default AccountInfo;
