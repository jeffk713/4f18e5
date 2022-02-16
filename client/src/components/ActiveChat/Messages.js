import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  const getOtherUsersLastReadMessageId = (messages) => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].senderId === userId && messages[i].isRead) {
        return messages[i].id
      }
    }
  }
 console.log("MESSAGE PROPS", messages)
  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble 
            key={message.id}
            id={message.id}
            text={message.text}
            time={time}
            lastReadMessageId={getOtherUsersLastReadMessageId(messages)}
            otherUser={otherUser}
          />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
