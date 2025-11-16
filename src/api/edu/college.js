import request from '@/utils/request'

// 查询学院信息列表
export function listCollege(query) {
  return request({
    url: '/edu/college/list',
    method: 'get',
    params: query
  })
}

// 查询学院信息详细
export function getCollege(collegeId) {
  return request({
    url: '/edu/college/' + collegeId,
    method: 'get'
  })
}

// 新增学院信息
export function addCollege(data) {
  return request({
    url: '/edu/college',
    method: 'post',
    data: data
  })
}

// 修改学院信息
export function updateCollege(data) {
  return request({
    url: '/edu/college',
    method: 'put',
    data: data
  })
}

// 删除学院信息
export function delCollege(collegeId) {
  return request({
    url: '/edu/college/' + collegeId,
    method: 'delete'
  })
}
