from persistence.text_history_repository import TextHistoryRepository
from domain.text_history import TextHistory

class TextHistoryService:
    def __init__(self):
        self.repository = TextHistoryRepository()

    def addTextHistory(self, text, date, sentiment, user_id):
        text_history = TextHistory(text, date, sentiment, user_id)
        self.repository.addTextHistory(text_history)

