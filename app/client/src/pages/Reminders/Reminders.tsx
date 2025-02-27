import {
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonDatetime,
} from "@ionic/react";
import "./Reminders.css";
import Menu from "../../components/Menu";
import ReminderListView from "../../components/ReminderListView";
import { ReminderProps } from "../../components/Reminder";
import { add } from "ionicons/icons";
import { useEffect, useState } from "react";
import { addReminder, getReminders, deleteReminder } from "../../services/api";

const Reminders: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [fade, setFade] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [trigger, setTrigger] = useState(0);

  const handleAddReminder = () => {
    if (!title || !description || !deadline || !type || !priority) {
      setErrorMessage("All fields are required.");
      setError(true);
      setFade(true);
      setTimeout(() => {
        setFade(false);
      }, 3000);
    } else {
      const userId = localStorage.getItem("loggedUserId");
      const reminderData = {
        title,
        description,
        deadline,
        type,
        priority,
        userId,
      };
      addReminder(reminderData)
        .then(() => {
          getRemindersByUserId();
          setErrorMessage("Reminder added successfully.");
          setError(false);
          setFade(true);

          setTimeout(() => {
            setFade(false);
            setShowModal(false);
          }, 3000);
        })
        .catch((error) => {
          setErrorMessage("Failed to add reminder.");
          setError(true);
          setFade(true);
          setTimeout(() => {
            setFade(false);
          }, 3000);
          console.error(error);
        });
    }
  };

  const deleteReminderById = async (id: any) => {
    console.log(id);
    const response = await deleteReminder(id);
    if (response.ok) {
      getRemindersByUserId();
    } else {
      console.error(response.error);
    }
  };

  const getRemindersByUserId = async () => {
    const userId = localStorage.getItem("loggedUserId");
    const response = await getReminders(userId);
    if (response.ok) {
      console.log(response.data);
      setReminders(
        response.data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          deadline: item.deadline,
          type: item.type,
          priority: item.priority,
          onDelete: () => deleteReminderById(item.id),
        })),
      );
    } else {
      console.error(response.error);
    }
  };

  useEffect(() => {
    getRemindersByUserId();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Reminders</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ "--background": "#EFEFEF", color: "black" }}>
        <div
          style={{
            maxWidth: "800px",
            margin: "2rem auto",
            background: "#EFEFEF",
            color: "black",
          }}
        >
          <ReminderListView reminders={reminders} />
        </div>

        <IonFab
          vertical="bottom"
          horizontal="end"
          slot="fixed"
          className="custom-fab"
        >
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Add Reminder</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent style={{ "--background": "#EFEFEF", color: "black" }}>
            <div
              style={{
                textAlign: "center",
                marginTop: "2rem",
                marginBottom: "2rem",
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
                  placeholder="Title..."
                  type="text"
                  value={title}
                  onIonChange={(e) => setTitle(e.detail.value!)}
                />
              </IonItem>
              <IonItem className="custom-input">
                <IonInput
                  placeholder="Description..."
                  type="text"
                  value={description}
                  onIonChange={(e) => setDescription(e.detail.value!)}
                />
              </IonItem>
              <IonItem className="custom-input">
                <IonDatetime
                  className="date-picker"
                  value={deadline}
                  min="1900-01-01"
                  max="2100-12-31"
                  onIonChange={(e) => setDeadline(e.detail.value!)}
                />
              </IonItem>
              <IonItem className="custom-input">
                <IonInput
                  placeholder="Type..."
                  type="text"
                  value={type}
                  onIonChange={(e) => setType(e.detail.value!)}
                />
              </IonItem>
              <IonItem className="custom-input">
                <IonInput
                  placeholder="Priority..."
                  type="text"
                  value={priority}
                  onIonChange={(e) => setPriority(e.detail.value!)}
                />
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

              <IonButton onClick={handleAddReminder}>Add Reminder</IonButton>
            </div>
          </IonContent>
          <IonFooter>
            <IonToolbar>
              <IonButton
                className="center-button"
                onClick={() => setShowModal(false)}
              >
                Close
              </IonButton>
            </IonToolbar>
          </IonFooter>
        </IonModal>
      </IonContent>

      <IonFooter translucent={true}>
        <Menu />
      </IonFooter>
    </IonPage>
  );
};

export default Reminders;
