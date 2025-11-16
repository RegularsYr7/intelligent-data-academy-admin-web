import request from '@/utils/request'

// 查询社区收藏列表
export function listCommunityCollect(query) {
  return request({
    url: '/edu/communityCollect/list',
    method: 'get',
    params: query
  })
}

// 查询社区收藏详细
export function getCommunityCollect(collectId) {
  return request({
    url: '/edu/communityCollect/' + collectId,
    method: 'get'
  })
}

// 新增社区收藏
export function addCommunityCollect(data) {
  return request({
    url: '/edu/communityCollect',
    method: 'post',
    data: data
  })
}

// 修改社区收藏
export function updateCommunityCollect(data) {
  return request({
    url: '/edu/communityCollect',
    method: 'put',
    data: data
  })
}

// 删除社区收藏
export function delCommunityCollect(collectId) {
  return request({
    url: '/edu/communityCollect/' + collectId,
    method: 'delete'
  })
}
