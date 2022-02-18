export const addMessageToStore = (state, payload) => {
  const { activeConversation, message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unreadMessageData: { numOfUnreadMessages: 1, senderId: message.senderId }
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  const updatedConversations = state.map((convo) => {
    if (convo.id === message.conversationId) {
      const updatedConvo = { ...convo };
      updatedConvo.messages = [...updatedConvo.messages, message];
      updatedConvo.latestMessageText = message.text;

      // if the message goes into active chat, no action for unread message required.
      if (activeConversation !== updatedConvo.otherUser.username) {
        updatedConvo.unreadMessageData = { 
          senderId: message.senderId,
          numOfUnreadMessages: updatedConvo.unreadMessageData.numOfUnreadMessages + 1,
        }
      }
      return updatedConvo;
    } else {
      return convo;
    }
  });

  updatedConversations.sort((a, b) => {
    // for conversation with no message
    if (!a.messages.length || !b.messages.length ) return 0;

    return b.messages[b.messages.length - 1].id - a.messages[a.messages.length -1].id;
  });

  return updatedConversations;
};

export const updateReadMessageToStore = (state, conversationId) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const readConvo = { ...convo };

      // reverse the array to have unread messages come first
      readConvo.messages.reverse();
      readConvo.messages.some((msg) => {
        if (msg.isRead) {
          return true;
        };
        msg.isRead = true;
        return false;
      });
      // reverse back to have the original order
      readConvo.messages.reverse();

      readConvo.unreadMessageData = { numOfUnreadMessages: 0, senderId: null };

      return readConvo;
    } else {
      return convo;
    };
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      const fakeConvo = { 
        otherUser: user, 
        messages: [],
        unreadMessageData: { numOfUnreadMessages: 0, senderId: null } 
      };
      newState.unshift(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  const updatedConversations = state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const updatedConvo = { ...convo };
      updatedConvo.id = message.conversationId
      updatedConvo.messages = [...updatedConvo.messages, message];
      updatedConvo.latestMessageText = message.text;
      updatedConvo.unreadMessageData = { numOfUnreadMessages: 1, senderId: message.senderId }
      return updatedConvo;
    } else {
      return convo;
    }
  });

  return updatedConversations;
};
