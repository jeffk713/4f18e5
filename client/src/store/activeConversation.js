// ACTIONS

const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

// ACTION CREATORS

export const setActiveChat = (username) => {
  return {
    type: SET_ACTIVE_CHAT,
    username
  };
};

// REDUCER

const reducer = (state = "", action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return action.username;
    }
    default:
      return state;
  }
};

export default reducer;
