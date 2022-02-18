from django.db import models


class Chat(utils.CustomModel):
    isGroupChat = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)
