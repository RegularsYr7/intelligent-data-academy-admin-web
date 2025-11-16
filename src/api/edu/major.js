import request from '@/utils/request'

// 查询专业信息列表
export function listMajor(query) {
  return request({
    url: '/edu/major/list',
    method: 'get',
    params: query
  })
}

// 查询专业信息详细
export function getMajor(majorId) {
  return request({
    url: '/edu/major/' + majorId,
    method: 'get'
  })
}

// 新增专业信息
export function addMajor(data) {
  return request({
    url: '/edu/major',
    method: 'post',
    data: data
  })
}

// 修改专业信息
export function updateMajor(data) {
  return request({
    url: '/edu/major',
    method: 'put',
    data: data
  })
}

// 删除专业信息
export function delMajor(majorId) {
  return request({
    url: '/edu/major/' + majorId,
    method: 'delete'
  })
}
