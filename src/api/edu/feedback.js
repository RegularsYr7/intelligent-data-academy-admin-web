import request from '@/utils/request'

// 查询反馈建议信息列表
export function listFeedback(query) {
  return request({
    url: '/edu/feedback/list',
    method: 'get',
    params: query
  })
}

// 查询反馈建议信息详细
export function getFeedback(feedbackId) {
  return request({
    url: '/edu/feedback/' + feedbackId,
    method: 'get'
  })
}

// 新增反馈建议信息
export function addFeedback(data) {
  return request({
    url: '/edu/feedback',
    method: 'post',
    data: data
  })
}

// 修改反馈建议信息
export function updateFeedback(data) {
  return request({
    url: '/edu/feedback',
    method: 'put',
    data: data
  })
}

// 删除反馈建议信息
export function delFeedback(feedbackId) {
  return request({
    url: '/edu/feedback/' + feedbackId,
    method: 'delete'
  })
}

// 答复反馈
export function replyFeedback(data) {
  return request({
    url: '/edu/feedback/reply',
    method: 'post',
    data: data
  })
}

// 标记反馈为已解决
export function resolveFeedback(data) {
  return request({
    url: '/edu/feedback/resolve',
    method: 'post',
    data: data
  })
}
