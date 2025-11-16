import request from '@/utils/request'

// 查询社区评论/回复列表
export function listCommunityComment(query) {
  return request({
    url: '/edu/communityComment/list',
    method: 'get',
    params: query
  })
}

// 查询社区评论/回复详细
export function getCommunityComment(commentId) {
  return request({
    url: '/edu/communityComment/' + commentId,
    method: 'get'
  })
}

// 新增社区评论/回复
export function addCommunityComment(data) {
  return request({
    url: '/edu/communityComment',
    method: 'post',
    data: data
  })
}

// 修改社区评论/回复
export function updateCommunityComment(data) {
  return request({
    url: '/edu/communityComment',
    method: 'put',
    data: data
  })
}

// 删除社区评论/回复
export function delCommunityComment(commentId) {
  return request({
    url: '/edu/communityComment/' + commentId,
    method: 'delete'
  })
}
