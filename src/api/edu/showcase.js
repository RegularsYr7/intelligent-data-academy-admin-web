import request from '@/utils/request'

// 查询风采展示信息列表
export function listShowcase(query) {
  return request({
    url: '/edu/showcase/list',
    method: 'get',
    params: query
  })
}

// 查询风采展示信息详细
export function getShowcase(showcaseId) {
  return request({
    url: '/edu/showcase/' + showcaseId,
    method: 'get'
  })
}

// 新增风采展示信息
export function addShowcase(data) {
  return request({
    url: '/edu/showcase',
    method: 'post',
    data: data
  })
}

// 修改风采展示信息
export function updateShowcase(data) {
  return request({
    url: '/edu/showcase',
    method: 'put',
    data: data
  })
}

// 删除风采展示信息
export function delShowcase(showcaseId) {
  return request({
    url: '/edu/showcase/' + showcaseId,
    method: 'delete'
  })
}
