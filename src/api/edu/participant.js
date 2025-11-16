import request from '@/utils/request'

// 查询活动参与记录列表
export function listParticipant(query) {
  return request({
    url: '/edu/participant/list',
    method: 'get',
    params: query
  })
}

// 查询活动参与记录详细
export function getParticipant(participantId) {
  return request({
    url: '/edu/participant/' + participantId,
    method: 'get'
  })
}

// 新增活动参与记录
export function addParticipant(data) {
  return request({
    url: '/edu/participant',
    method: 'post',
    data: data
  })
}

// 修改活动参与记录
export function updateParticipant(data) {
  return request({
    url: '/edu/participant',
    method: 'put',
    data: data
  })
}

// 删除活动参与记录
export function delParticipant(participantId) {
  return request({
    url: '/edu/participant/' + participantId,
    method: 'delete'
  })
}
