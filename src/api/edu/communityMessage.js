import request from '@/utils/request'

// 查询社区消息通知列表
export function listCommunityMessage(query) {
  return request({
    url: '/edu/communityMessage/list',
    method: 'get',
    params: query
  })
}

// 查询社区消息通知详细
export function getCommunityMessage(messageId) {
  return request({
    url: '/edu/communityMessage/' + messageId,
    method: 'get'
  })
}

// 新增社区消息通知
export function addCommunityMessage(data) {
  return request({
    url: '/edu/communityMessage',
    method: 'post',
    data: data
  })
}

// 修改社区消息通知
export function updateCommunityMessage(data) {
  return request({
    url: '/edu/communityMessage',
    method: 'put',
    data: data
  })
}

// 删除社区消息通知
export function delCommunityMessage(messageId) {
  return request({
    url: '/edu/communityMessage/' + messageId,
    method: 'delete'
  })
}
