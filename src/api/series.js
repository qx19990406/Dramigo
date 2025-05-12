import request from '../utils/request';

/**
 * 获取分类列表(auth = false)
 * 不需要传page和size，直接获取全部
 * */
export function getCategoryListApi() {
  return request({
    method: 'get',
    url: '/api/category',
    params: {auth: false},
  });
}

/**
 * 获取剧集列表(auth = false)
 * keywords string <string>可选
 * page integer可选
 * size integer可选
 * categoryId string <string>分类id可选
 * isHot boolean 可选 是否热门, 查询热门列表
 * isNew boolean 可选 是否最新，查询最新列表
 * isFavorites boolean 可选 是否收藏，查询用户收藏列表
 * isLike  boolean 可选 是否点赞, 查询用户点赞列表
 * id integer 可选 当前剧集 id 用于不包含该 id 的列表
 * */
export function getSeriesListApi(params) {
  return request({
    url: '/api/series/list',
    method: 'get',
    params: {auth: true, ...params},
  });
}

/**
 * 获取播放集详情
 * */
export function getSeriesDetailApi(id) {
  return request({
    url: `/api/series/${id}`,
    method: 'get',
    params: {auth: true},
  });
}

/**
 * 收藏
 * */
export function collectApi(id) {
  return request({
    url: `/api/series/favorites/${id}`,
    method: 'post',
    params: {auth: true},
  })
}

/**
 * 点赞
 * */
export function likeApi(id) {
  return request({
    url: `/api/series/like/${id}`,
    method: 'post',
    params: {auth: true},
  })
}

/**
 * 取消收藏
 * */
export function disCollectApi(id) {
  return request({
    url: `/api/series/unfavorites/${id}`,
    method: 'post',
    params: {auth: true},
  });
}

/**
 * 取消点赞
 * */
export function disLikeApi(id) {
  return request({
    url: `/api/series/dislike/${id}`,
    method: 'post',
    params: {auth: true},
  })
}

/**
 * 修改播放量
 * */
export function videoPlayApi(id) {
  return request({
    url: `/api/series/play/${id}`,
    method: 'post',
    params: {auth: true},
  })
}
