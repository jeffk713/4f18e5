export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  const updatedConversations = state.map((convo) => {
    if (convo.id === message.conversationId) {
      const updatedConvo = { ...convo };
      updatedConvo.messages = [...updatedConvo.messages, message];
      updatedConvo.latestMessageText = message.text;
      return updatedConvo;
    } else {
      return convo;
    }
  });

  updatedConversations.sort((a, b) => {
    return b.messages[b.messages.length - 1].id - a.messages[a.messages.length -1].id;
  });

  return updatedConversations;
};

export const updateReadMessageToStore = (state, conversationId) => {
  const readConvo = state.find((convo) => convo.id === conversationId);

  for (let i = readConvo.messages.length - 1; i >= 0; i--) {
    if (readConvo.messages[i].isRead){ 
      break;
    }
    readConvo.messages[i].isRead = true;
  };
  
  readConvo.unreadMessageData = { numOfUnreadMessages: 0, senderId: null }

  return state.map((convo) => {
    if (convo.id === conversationId) {
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
      let fakeConvo = { otherUser: user, messages: [] };
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
      return updatedConvo;
    } else {
      return convo;
    }
  });

  return updatedConversations;
};
