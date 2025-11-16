import request from '@/utils/request'

// 查询班级信息列表
export function listClass(query) {
  return request({
    url: '/edu/class/list',
    method: 'get',
    params: query
  })
}

// 查询班级信息详细
export function getClass(classId) {
  return request({
    url: '/edu/class/' + classId,
    method: 'get'
  })
}

// 新增班级信息
export function addClass(data) {
  return request({
    url: '/edu/class',
    method: 'post',
    data: data
  })
}

// 修改班级信息
export function updateClass(data) {
  return request({
    url: '/edu/class',
    method: 'put',
    data: data
  })
}

// 删除班级信息
export function delClass(classId) {
  return request({
    url: '/edu/class/' + classId,
    method: 'delete'
  })
}
