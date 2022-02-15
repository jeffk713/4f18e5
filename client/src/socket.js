import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  readNewMessages,
} from "./store/conversations";
import { readMessages } from './store/utils/thunkCreators';

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  
  socket.on("new-message", (data) => {
    console.log("SOCKET CLIENT RECEIVED MESSAGE", data)
    const userId = store.getState().user.id;
    const recipientId = data.recipientId;

    if (userId === recipientId) {
      store.dispatch(setNewMessage(data.message, data.sender));
    } else {
      return;
    }

    const convoId = data.message.conversationId;
    const convo = store.getState().conversations.find((convo) => convo.id === convoId);
    if (!convo) return;

    const otherUserUsername = convo.otherUser.username
    const activeConvo = store.getState().activeConversation;

    if (convo && activeConvo === otherUserUsername) {
      store.dispatch(readMessages({ conversationId: convoId }))
    };

  });

  socket.on("read-messages", (data) => {
    console.log("SOCKET CLIENT READ MESSAGE", data)
    const { conversationId } = data
    const convo = store.getState().conversations.find((convo) => convo.id === conversationId);
    if (!convo) return;
    
    store.dispatch(readNewMessages(conversationId))
  });
});

export default socket;
