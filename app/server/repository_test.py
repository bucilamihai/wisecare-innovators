from persistence.db_config import createApp
from persistence.user_repository import UserRepository
from persistence.reminder_repository import ReminderRepository
from domain.user import User
from domain.reminder import Reminder
from datetime import datetime

app = createApp()

with app.app_context():
    userRepo = UserRepository()
    reminderRepo = ReminderRepository()

    # clean up database
    for user in userRepo.getAllUsers():
        userRepo.deleteUser(user)
    for reminder in reminderRepo.getAllReminders():
        reminderRepo.deleteReminder(reminder)

    userRepo.addUser(User("John", "Doe", "john.doe@gmail.com", "password"))
    userRepo.addUser(User("Jane", "Doe", "jane.doe@gmail.com", "password"))
    userRepo.addUser(User("Jane2", "Doe", "jane2.doe@gmail.com", "password"))
    reminderRepo.addReminder(Reminder("Buy milk", "from shop", datetime.now(), "", "", 1))
    reminderRepo.addReminder(Reminder("Call mom", "tell her hb", datetime.now(), "", "", 1))
    reminderRepo.addReminder(Reminder("Buy eggs", "to make a cake", datetime.now(), "", "", 2))
    reminderRepo.addReminder(Reminder("Call dad", "", datetime.now(), "", "", 2))
    assert(len(userRepo.getAllUsers()) == 3)
    assert(len(reminderRepo.getAllReminders()) == 4)
    assert(userRepo.getUserByEmail("john.doe@gmail.com").getFirstname() == "John")
    assert(reminderRepo.getReminderById(1).getTitle() == "Buy milk")
    assert(reminderRepo.getRemindersByUserId(1)[1].getTitle() == "Call mom")
    reminderRepo.deleteReminder(reminderRepo.getReminderById(1))
    assert(len(reminderRepo.getAllReminders()) == 3)
    userRepo.deleteUser(userRepo.getUserByEmail("jane.doe@gmail.com"))
    assert(len(userRepo.getAllUsers()) == 2)

    print("All tests passed!")