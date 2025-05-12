export function userLogin(data) {
  return {
    type: 'userLogin',
    data,
  };
}

export function userInfo(data) {
  return {
    type: 'userInfo',
    data,
  };
}

export function userLogout() {
  return {
    type: 'userLogout',
  };
}

// 添加历史记录
export function historyAdd(data) {
  return {
    type: 'historyAdd',
    data,
  };
}

// 删除历史记录 传当前值的index索引
export function historyRemove(data) {
  return {
    type: 'historyRemove',
    data,
  };
}

// 清除历史记录
export function historyClear() {
  return {
    type: 'historyClear',
  };
}

// 修改视频列表数据
export function updateVideoTotal(data) {
  return {
    type: 'updateVideoTotal',
    data,
  };
}

// 修改播放剧集索引
export function setCurrentIdx(data) {
  return {
    type: 'setCurrentIdx',
    data,
  }
}

export function userDevice(data) {
  return {
    type: 'userDevice',
    data,
  };
}

export function userQuickLogin(data) {
  return {
    type: 'userQuickLogin',
    data,
  };
}
