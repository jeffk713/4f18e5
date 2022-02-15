from django.contrib.auth.middleware import get_user
from django.db.models import Max, Q
from django.db.models.query import Prefetch
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import Conversation, Message
from online_users import online_users
from rest_framework.views import APIView
from rest_framework.request import Request


class Conversations(APIView):
    """get all conversations for a user, include latest message text for preview, and all messages
    include other user model so we have info on username/profile pic (don't include current user info)
    TODO: for scalability, implement lazy loading"""

    def get(self, request: Request):
        # try:
            user = get_user(request)

            if user.is_anonymous:
                return HttpResponse(status=401)
            user_id = user.id

            conversations = (
                Conversation.objects.filter(Q(user1=user_id) | Q(user2=user_id))
                .prefetch_related(
                    Prefetch(
                        "messages", queryset=Message.objects.order_by("createdAt")
                    )
                )
                .all()
            )

            conversations_response = []

            def get_unread_message_dict(messages):
                # get message list ordered from lateset to oldest
                reversed_messages = messages
                reversed_messages.reverse()
                unread_messages = []
                sender_id = None

                for msg in reversed_messages:
                    if not msg["isRead"]:
                        unread_messages.append(msg)
                        sender_id = msg["senderId"]
                    else:
                        break

                return { "numOfUnreadMessages": len(unread_messages), "senderId": sender_id }

            for convo in conversations:
                convo_dict = {
                    "id": convo.id,
                    "messages": [
                        message.to_dict(["id", "text", "senderId", "createdAt", "isRead"])
                        for message in convo.messages.all()
                    ],
                    "unreadMessageData": get_unread_message_dict([
                        message.to_dict() for message in convo.messages.all()
                    ]),
                }
                
                # set properties for notification count and latest message preview
                num_of_messages = len(convo_dict["messages"])
                convo_dict["latestMessageText"] = convo_dict["messages"][num_of_messages-1]["text"]

                # set a property "otherUser" so that frontend will have easier access
                user_fields = ["id", "username", "photoUrl"]
                if convo.user1 and convo.user1.id != user_id:
                    convo_dict["otherUser"] = convo.user1.to_dict(user_fields)
                elif convo.user2 and convo.user2.id != user_id:
                    convo_dict["otherUser"] = convo.user2.to_dict(user_fields)

                # set property for online status of the other user
                if convo_dict["otherUser"]["id"] in online_users:
                    convo_dict["otherUser"]["online"] = True
                else:
                    convo_dict["otherUser"]["online"] = False

                conversations_response.append(convo_dict)
            conversations_response.sort(
                key=lambda convo: convo["messages"][len(convo["messages"])-1]["createdAt"],
                reverse=True,
            )

            return JsonResponse(
                conversations_response,
                safe=False,
            )
        # except Exception as e:
        #     return HttpResponse(status=500)
