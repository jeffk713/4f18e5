from django.db import models

from . import utils
from .conversation import Conversation
from .chat import Chat


class Message(utils.CustomModel):
    text = models.TextField(null=False)
    senderId = models.IntegerField(null=False)
    chat = models.ForeignKey(
        Chat,
        null=True,
        on_delete=models.CASCADE,
        db_column="chatId",
        related_name="messages",
        related_query_name="message"
    )
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)