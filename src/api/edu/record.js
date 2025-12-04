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

// 复制已签到人员信息
export function copyCheckedIn(taskId) {
  return request({
    url: '/edu/record/copyCheckedIn',
    method: 'post',
    params: { taskId }
  })
}

// 复制未签到人员信息
export function copyNotCheckedIn(taskId) {
  return request({
    url: '/edu/record/copyNotCheckedIn',
    method: 'post',
    params: { taskId }
  })
}
