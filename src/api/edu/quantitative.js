import request from '@/utils/request'

// 查询量化分记录列表
export function listQuantitative(query) {
  return request({
    url: '/edu/quantitative/list',
    method: 'get',
    params: query
  })
}

// 查询量化分记录详细
export function getQuantitative(recordId) {
  return request({
    url: '/edu/quantitative/' + recordId,
    method: 'get'
  })
}

// 新增量化分记录
export function addQuantitative(data) {
  return request({
    url: '/edu/quantitative',
    method: 'post',
    data: data
  })
}

// 修改量化分记录
export function updateQuantitative(data) {
  return request({
    url: '/edu/quantitative',
    method: 'put',
    data: data
  })
}

// 删除量化分记录
export function delQuantitative(recordId) {
  return request({
    url: '/edu/quantitative/' + recordId,
    method: 'delete'
  })
}
