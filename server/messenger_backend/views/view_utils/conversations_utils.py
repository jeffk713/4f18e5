class ConversationsUtils():
    def get_unread_message_dict(messages):
        unread_messages = []
        sender_id = None

        for msg in reversed(messages):
            if not msg["isRead"]:
                unread_messages.append(msg)
                sender_id = msg["senderId"]
            else:
                break

        return { "numOfUnreadMessages": len(unread_messages), "senderId": sender_id }