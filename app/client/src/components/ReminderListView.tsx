import React from "react";
import Reminder from "./Reminder";
import { ReminderProps } from "./Reminder";

interface ReminderListViewProps {
  reminders: ReminderProps[];
}

const ReminderListView: React.FC<ReminderListViewProps> = ({ reminders }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {reminders.map((reminder, index) => (
        <Reminder
          key={index}
          title={reminder.title}
          description={reminder.description}
          deadline={reminder.deadline}
          onDelete={reminder.onDelete}
        />
      ))}
    </div>
  );
};

export default ReminderListView;
