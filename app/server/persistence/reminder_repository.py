from persistence.db_config import db
from domain.reminder import Reminder

class ReminderRepository:
    def addReminder(self, reminder):
        db.session.add(reminder)
        db.session.commit()

    def getReminderById(self, id):
        return Reminder.query.filter_by(id=id).first()
    
    def getRemindersByUserId(self, user_id):
        return Reminder.query.filter_by(user_id=user_id).all()

    def updateReminder(self):
        db.session.commit()

    def deleteReminder(self, reminder):
        db.session.delete(reminder)
        db.session.commit()

    def getAllReminders(self):
        return Reminder.query.all()