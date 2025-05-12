const initialState = {
  list: [],
};

export default function historyReducer(state = initialState, action) {
  switch (action.type) {
    case 'historyAdd':
      const it = state.list.find(item => item === action.data);
      const updateList = it ? state.list : [...state.list, action.data];
      return {
        list: [...updateList],
      };
    case 'historyRemove':
      const arr = state.list;
      arr.splice(action.data, 1);
      return {
        list: [...arr],
      };
    case 'historyClear':
      return {
        list: [],
      };
    default:
      return state;
  }
}
