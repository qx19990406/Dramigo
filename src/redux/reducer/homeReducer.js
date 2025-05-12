const initialState = {
  total: 0, // 首页视频总条数
  currentIdx: 0,
};

export default function homeReducer(state = initialState, action) {
  switch (action.type) {
    case 'updateVideoTotal': // 总数更新
      return {
        ...state,
        total: action.data,
      };
    case 'setCurrentIdx':
      return {
        ...state,
        currentIdx: action.data,
      }
    default:
      return state;
  }
}
