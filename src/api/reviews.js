import request from '../utils/request';

/**
 * 评论管理
 * */

/**
 * 评论列表 (auth = true)
 * */
export function reviewsListApi(params) {
  return request({
    url: '/api/comment',
    method: 'get',
    params: {...params, auth: true}
  })
}

/**
 * 创建评论 (auth = true)
 * content seriesId parentId
 * */
export function createCommentApi(params) {
  return request({
    url: '/api/comment',
    method: 'post',
    params: {...params, auth: true},
  })
}

/**
 * 删除评论 (auth = true)
 * id  seriesId
 * */
export function deleteCommentApi(params) {
  return request({
    url: '/api/comment',
    method: 'delete',
    params: {...params, auth: true},
  })
}

/**
 * 点赞评论 (auth = true)
 * id  seriesId
 * */
export function likeCommentApi(params) {
  return request({
    url: '/api/comment/like',
    method: 'post',
    params: {...params, auth: true},
  })
}

/**
 * 取消点赞评论 (auth = true)
 * id  seriesId
 * */
export function dislikeCommentApi(params) {
  return request({
    url: '/api/comment/dislike',
    method: 'post',
    params: {...params, auth: true},
  })
}
