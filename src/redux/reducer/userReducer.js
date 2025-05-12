const initialState = {
  isLogin: false,
  token: '',
  userId: 0,
  avatar: '',
  username: '',
  email: '',
  inner: false,
  deviceSN: '',
  nickname: '',
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'userLogin':
      return {
        ...state,
        isLogin: true,
        token: action.data.token,
      };
    case 'userInfo':
      return {
        ...state,
        userId: action.data.id,
        username: action.data.username,
        email: action.data.email,
        avatar: action.data.avatar,
        nickname: action.data.nickname,
      };
    case 'userLogout':
      return {
        ...initialState,
      };
    case 'userDevice':
      return {
        ...state,
        deviceSN: action.data,
      };
    case 'userQuickLogin':
      return {
        ...state,
        inner: action.data.inner,
        userId: action.data.id,
        token: action.data.token,
        isLogin: true,
      };
    default:
      return state;
  }
}
