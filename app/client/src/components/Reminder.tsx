import React from "react";
import { FaTrash } from "react-icons/fa";

export interface ReminderProps {
  id: number;
  title: string;
  description: string;
  deadline: string;
  type: string;
  priority: string;
  onDelete: () => void;
}

const Reminder: React.FC<ReminderProps> = ({
  id,
  title,
  description,
  deadline,
  type,
  priority,
  onDelete,
}) => {
  return (
    <div className="reminder">
      <div className="reminder-content">
        <h3>{title}</h3>
        <p>{id}</p>
        <p>{description}</p>
        <p>
          <strong>Deadline:</strong> {deadline}
        </p>
      </div>
      <button className="delete-button" onClick={onDelete}>
        <FaTrash />
      </button>
    </div>
  );
};

export default Reminder;
