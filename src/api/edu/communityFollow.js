import request from '@/utils/request'

// 查询社区关注列表
export function listCommunityFollow(query) {
  return request({
    url: '/edu/communityFollow/list',
    method: 'get',
    params: query
  })
}

// 查询社区关注详细
export function getCommunityFollow(followId) {
  return request({
    url: '/edu/communityFollow/' + followId,
    method: 'get'
  })
}

// 新增社区关注
export function addCommunityFollow(data) {
  return request({
    url: '/edu/communityFollow',
    method: 'post',
    data: data
  })
}

// 修改社区关注
export function updateCommunityFollow(data) {
  return request({
    url: '/edu/communityFollow',
    method: 'put',
    data: data
  })
}

// 删除社区关注
export function delCommunityFollow(followId) {
  return request({
    url: '/edu/communityFollow/' + followId,
    method: 'delete'
  })
}
