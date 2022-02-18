export const getOtherUsersLastReadMessageId = (messages, userId) => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].senderId === userId && messages[i].isRead) {
      return messages[i].id
    }
  }
}