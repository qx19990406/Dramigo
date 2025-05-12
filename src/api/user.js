import request from '../utils/request';

/**
 * 用户接口
 * */

/**
 * 登录接口(auth = false)
 * params: { email: required, password: required }
 */
export function userLoginApi(params) {
  return request({
    url: '/user/login',
    method: 'post',
    params: {...params, auth: false},
  });
}

/**
 * 用户注册(auth = false)
 * params: { email: required, password: required, password2 }
 * */
export function userRegisterApi(params) {
  return request({
    url: '/register',
    method: 'post',
    params: {...params, auth: false},
  });
}

/**
 * 忘记密码(auth = false)
 * params: { email: required, password: required, flag: required, password2: required, }
 * */
export function userForgetPasswordApi(params) {
  return request({
    url: '/forget',
    method: 'post',
    params: {...params, auth: false},
  });
}

/**
 * 验证码验证(auth = false)
 * params: { email: required, code: required }
 * */
export function vailCodePassword(params) {
  return request({
    url: '/code/verify',
    method: 'post',
    params: {...params, auth: false},
  });
}

/**
 * 获取验证码(auth = false)
 * params: { email: required }
 * */
export function userGetCodeApi(params) {
  return request({
    url: '/captcha',
    method: 'get',
    params: {...params, auth: false},
  });
}

/**
 * 退出登录(auth = true)
 * */
export function userLogoutApi() {
  return request({
    url: '/api/user/signOut',
    method: 'post',
    params: {auth: true},
  });
}

/**
 * 注销用户
 * */
export function userDeleteAccount(params) {
  return request({
    url: '/api/user/logout',
    method: 'post',
    params: {...params, auth: true},
  });
}

/**
 * 获取用户信息
 * */
export function userGetInfoApi() {
  return request({
    url: '/api/user/info',
    method: 'get',
    params: {auth: true},
  });
}

/**
 * 快速登录
 * */
export function quickLoginApi(sn) {
  return request({
    url: '/quick/login',
    method: 'post',
    params: {device: sn, auth: true},
  })
}
