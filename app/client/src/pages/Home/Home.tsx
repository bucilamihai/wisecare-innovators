import {
  IonButton,
  IonContent,
  IonFooter,
  IonPage,
} from "@ionic/react";
import "./Home.css";
import Menu from "../../components/Menu";
import { useHistory } from "react-router-dom";
import defaultProfilePicture from "../../images/stockUserProfilePicture.svg";
import { useState, useEffect } from "react";
import { getUser, getReminders } from "../../services/api";

const Home: React.FC = () => {
  const history = useHistory();
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [upcomingReminder, setUpcomingReminder] = useState<any>(null);
  const [tipOfTheDay, setTipOfTheDay] = useState<string>("");

  // Predefined list of elderly-related tips
  const tips = [
    "Stay hydrated by drinking at least 8 glasses of water daily.",
    "Engage in light physical activity, such as a short walk or stretching exercises.",
    "Eat a balanced diet rich in fruits, vegetables, and whole grains.",
    "Keep your mind active by solving puzzles, reading, or learning something new.",
    "Ensure your home is free of hazards to prevent falls, such as loose rugs or cluttered pathways.",
    "Maintain regular check-ups with your healthcare provider.",
    "Stay socially connected by calling or visiting friends and family.",
    "Practice relaxation techniques, such as deep breathing or meditation, to reduce stress.",
    "Ensure you are taking medications as prescribed and keeping them organized.",
    "Get adequate sleep to keep your energy levels up and your mind sharp.",
  ];

  // Function to get the tip of the day
  const fetchTipOfTheDay = () => {
    const dayIndex = new Date().getDate() % tips.length; // Rotate through tips based on the day of the month
    setTipOfTheDay(tips[dayIndex]);
    console.log("Tip of the Day:", tips[dayIndex]);
  };

  // Function to fetch user data
  const updateUserData = async () => {
    const user = await getUser(localStorage.getItem("loggedUserId"));
    console.log("User Data:", user.data.data);
    setUserName(user.data.data.firstname + " " + user.data.data.lastname);
    setProfilePicture(user.data.data.profilePicture || null);
  };

  // Function to fetch reminders and find the most upcoming one
  const fetchUpcomingReminder = async () => {
    const userId = localStorage.getItem("loggedUserId");
    const response = await getReminders(userId);

    if (response.ok) {
      console.log("Reminders Response:", response.data);

      const reminders = response.data.data;

      // Ensure reminders is an array and contains data
      if (!Array.isArray(reminders) || reminders.length === 0) {
        console.log("No reminders available.");
        setUpcomingReminder(null);
        return;
      }

      const now = new Date();
      console.log("Current Time:", now);

      // Filter reminders to only those with future deadlines
      const filteredReminders = reminders.filter((reminder: any) => {
        const deadline = new Date(reminder.deadline); // Parse deadline string
        console.log("Parsed Deadline:", deadline, "Now:", now);
        return deadline > now; // Keep reminders with deadlines in the future
      });

      console.log("Filtered Reminders (Future Deadlines):", filteredReminders);

      // Sort the filtered reminders by closest deadline
      const sortedReminders = filteredReminders.sort((a: any, b: any) => {
        const dateA = new Date(a.deadline).getTime();
        const dateB = new Date(b.deadline).getTime();
        return dateA - dateB; // Sort by earliest deadline
      });

      console.log("Sorted Reminders (Closest Deadline First):", sortedReminders);

      // Select the most upcoming reminder
      const upcoming = sortedReminders[0];
      console.log("Upcoming Reminder:", upcoming);

      setUpcomingReminder(upcoming || null);
    } else {
      console.error("Failed to fetch reminders:", response.error);
      setUpcomingReminder(null);
    }
  };

  // UseEffect to fetch user data, reminders, and tip of the day
  useEffect(() => {
    updateUserData();
    fetchUpcomingReminder();
    fetchTipOfTheDay();
  }, []);

  return (
      <IonPage>
        <IonContent style={{ "--background": "#efefef", color: "black", position: "relative" }}>
          {/* Profile Picture in the Top-Right Corner */}
          <IonButton
              className="transparent-button"
              color="transparent"
              onClick={() => history.push("/account")}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                padding: 0,
                width: "128px",
                height: "128px",
                zIndex: 10,
              }}
          >
            <img
                src={
                  profilePicture
                      ? `data:image/jpeg;base64,${profilePicture}`
                      : defaultProfilePicture
                }
                alt="User photo"
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
            />
          </IonButton>

          {/* Centered Welcome Text */}
          <div
              style={{
                textAlign: "center",
                marginTop: "180px",
              }}
          >
            <h1 style={{ fontSize: "34px", margin: 0, color: "black" }}>Welcome back!</h1>
            <h2 style={{ fontSize: "28px", margin: "8px 0", color: "#666" }}>
              {userName || "User name"}
            </h2>
          </div>

          {/* Tip of the Day */}
          {tipOfTheDay && (
              <div
                  className="reminder-box"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "40px",
                  }}
              >
                <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      width: "100%", // Make the box take up as much space as possible
                      maxWidth: "800px", // Limit the maximum size
                      backgroundColor: "white",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                  <h3 style={{ fontSize: "24px", color: "black", marginBottom: "16px" }}>
                    Tip of the Day
                  </h3>
                  <p style={{ fontSize: "18px", color: "#555", margin: 0 }}>{tipOfTheDay}</p>
                </div>
              </div>
          )}

          {/* Upcoming Reminder */}
          {upcomingReminder ? (
              <div
                  className="reminder-box"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "40px",
                  }}
              >
                <div
                    style={{
                      padding: "20px",
                      width: "100%", // Make the box take up as much space as possible
                      maxWidth: "800px", // Limit the maximum size
                      backgroundColor: "white",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      textAlign: "left",
                    }}
                >
                  <h3 style={{ fontSize: "24px", color: "black", marginBottom: "16px", textAlign: "center", }}>
                    Upcoming Reminder
                  </h3>
                  <div>
                    <h4 style={{ margin: "0 0 10px", fontSize: "20px", color: "#333" }}>
                      {upcomingReminder.title}
                    </h4>
                    <p style={{ margin: "0 0 10px", fontSize: "16px", color: "#555" }}>
                      {upcomingReminder.description}
                    </p>
                    <p style={{ margin: "0", fontSize: "14px", color: "#777" }}>
                      <strong>Deadline:</strong> {new Date(upcomingReminder.deadline).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
          ) : (
              <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100px",
                    textAlign: "center",
                    marginTop: "40px",
                  }}
              >
                <p style={{ fontSize: "18px", color: "#666" }}>No upcoming reminders found.</p>
              </div>
          )}
        </IonContent>

        <IonFooter translucent={true}>
          <Menu />
        </IonFooter>
      </IonPage>
  );
};

export default Home;
