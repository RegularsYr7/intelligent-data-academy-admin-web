import request from '@/utils/request'

// 查询社区点赞列表
export function listCommunityLike(query) {
  return request({
    url: '/edu/communityLike/list',
    method: 'get',
    params: query
  })
}

// 查询社区点赞详细
export function getCommunityLike(likeId) {
  return request({
    url: '/edu/communityLike/' + likeId,
    method: 'get'
  })
}

// 新增社区点赞
export function addCommunityLike(data) {
  return request({
    url: '/edu/communityLike',
    method: 'post',
    data: data
  })
}

// 修改社区点赞
export function updateCommunityLike(data) {
  return request({
    url: '/edu/communityLike',
    method: 'put',
    data: data
  })
}

// 删除社区点赞
export function delCommunityLike(likeId) {
  return request({
    url: '/edu/communityLike/' + likeId,
    method: 'delete'
  })
}
