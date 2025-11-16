import request from '@/utils/request'

// 查询签到记录列表
export function listRecord(query) {
  return request({
    url: '/edu/record/list',
    method: 'get',
    params: query
  })
}

// 查询签到记录详细
export function getRecord(recordId) {
  return request({
    url: '/edu/record/' + recordId,
    method: 'get'
  })
}

// 新增签到记录
export function addRecord(data) {
  return request({
    url: '/edu/record',
    method: 'post',
    data: data
  })
}

// 修改签到记录
export function updateRecord(data) {
  return request({
    url: '/edu/record',
    method: 'put',
    data: data
  })
}

// 删除签到记录
export function delRecord(recordId) {
  return request({
    url: '/edu/record/' + recordId,
    method: 'delete'
  })
}
