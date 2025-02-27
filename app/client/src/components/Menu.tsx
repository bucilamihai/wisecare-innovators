import React from "react";
import { IonToolbar } from "@ionic/react";
import MenuButton from "./MenuButton";
import { useHistory } from "react-router-dom";

// Import SVGs as plain images
import homeIcon from "../images/home.svg";
import healthIcon from "../images/health.svg";
import chatIcon from "../images/chat.svg";
import remindersIcon from "../images/reminders.svg";
import settingsIcon from "../images/settings.svg";

const Menu: React.FC = () => {
  const history = useHistory();

  const menuItems = [
    { label: "Home", icon: homeIcon, path: "/home" },
    { label: "Health", icon: healthIcon, path: "/health" },
    { label: "Chat", icon: chatIcon, path: "/chat" },
    { label: "Reminders", icon: remindersIcon, path: "/reminders" },
    { label: "Settings", icon: settingsIcon, path: "/settings" },
  ];

  return (
    <IonToolbar
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        "--background": "#444444",
        padding: "10px 0",
      }}
    >
      {menuItems.map((item) => (
        <MenuButton
          key={item.label}
          label={item.label}
          icon={
            <img
              src={item.icon}
              alt={item.label}
              style={{ width: "35px", height: "35px" }}
            />
          }
          onClick={() => history.push(item.path)}
        />
      ))}
    </IonToolbar>
  );
};

export default Menu;
