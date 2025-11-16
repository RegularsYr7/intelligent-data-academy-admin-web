import request from '@/utils/request'

// 查询失物招领信息列表
export function listFound(query) {
  return request({
    url: '/edu/found/list',
    method: 'get',
    params: query
  })
}

// 查询失物招领信息详细
export function getFound(itemId) {
  return request({
    url: '/edu/found/' + itemId,
    method: 'get'
  })
}

// 新增失物招领信息
export function addFound(data) {
  return request({
    url: '/edu/found',
    method: 'post',
    data: data
  })
}

// 修改失物招领信息
export function updateFound(data) {
  return request({
    url: '/edu/found',
    method: 'put',
    data: data
  })
}

// 删除失物招领信息
export function delFound(itemId) {
  return request({
    url: '/edu/found/' + itemId,
    method: 'delete'
  })
}
