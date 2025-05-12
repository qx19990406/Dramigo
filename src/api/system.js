import request from '../utils/request';

/**
 * 版本检测
 * */
export function requestVersion() {
  return request({
    url: '/api/system/version',
    method: 'get',
    params: {auth: false},
  });
}

/**
 * 创建反馈(auth = false)
 * */
export function userFeedbackApi(params) {
  return request({
    url: '/api/feedback',
    method: 'post',
    params: {...params,auth: false},
  });
}
