import request from '@/utils/request'

// 查询学期管理列表
export function listSemester(query) {
  return request({
    url: '/edu/semester/list',
    method: 'get',
    params: query
  })
}

// 查询学期管理详细
export function getSemester(semesterId) {
  return request({
    url: '/edu/semester/' + semesterId,
    method: 'get'
  })
}

// 新增学期管理
export function addSemester(data) {
  return request({
    url: '/edu/semester',
    method: 'post',
    data: data
  })
}

// 修改学期管理
export function updateSemester(data) {
  return request({
    url: '/edu/semester',
    method: 'put',
    data: data
  })
}

// 删除学期管理
export function delSemester(semesterId) {
  return request({
    url: '/edu/semester/' + semesterId,
    method: 'delete'
  })
}
