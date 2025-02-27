from persistence.reminder_repository import ReminderRepository
from domain.reminder import Reminder

class ReminderService: 
    def __init__(self):
        self.repository = ReminderRepository()

    def addReminder(self, title, description, deadline, type, priority, user_id):
        reminder = Reminder(title, description, deadline, type, priority, user_id)
        self.repository.addReminder(reminder)

    def getRemindersByUserId(self, user_id):
        return self.repository.getRemindersByUserId(user_id)

    def deleteReminder(self, id):
        reminder = self.repository.getReminderById(id)
        self.repository.deleteReminder(reminder)