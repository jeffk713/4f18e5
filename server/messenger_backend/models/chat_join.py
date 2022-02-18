from django.db import models
from django.db.models import Q

from . import utils
from .user import User
from .chat import Chat


class ChatJoin(utils.CustomModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, 
        db_column="userId", 
        related_name="users",
        related_query_name="user"
    )
    chat = models.ForeignKey(
        Chat, on_delete=models.CASCADE, 
        db_column="chatId", 
        related_name="chats",
        related_query_name="chat"
    )
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)