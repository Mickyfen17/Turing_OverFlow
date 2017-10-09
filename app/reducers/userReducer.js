const user = (state = {}, action) => {
  switch (action.type) {
    case 'USER_LOGIN' :
      return action.user;

    case 'USER_LOGOUT' :
      return action.user;

    default:
      return state;
  }
};

export default user;
