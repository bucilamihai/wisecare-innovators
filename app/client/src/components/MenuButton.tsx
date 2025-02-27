import React from "react";
interface MenuButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ label, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: "20%",
        backgroundColor: "transparent",
        border: "none",
        display: "column",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        fontSize: "12px",
        cursor: "pointer",
      }}
    >
      <div style={{ fontSize: "24px" }}>{icon}</div>
      <span style={{ fontSize: "16px", marginTop: "5px" }}>{label}</span>
    </button>
  );
};

export default MenuButton;
