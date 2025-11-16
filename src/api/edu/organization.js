import request from '@/utils/request'

// 查询组织信息列表
export function listOrganization(query) {
  return request({
    url: '/edu/organization/list',
    method: 'get',
    params: query
  })
}

// 查询组织信息详细
export function getOrganization(organizationId) {
  return request({
    url: '/edu/organization/' + organizationId,
    method: 'get'
  })
}

// 新增组织信息
export function addOrganization(data) {
  return request({
    url: '/edu/organization',
    method: 'post',
    data: data
  })
}

// 修改组织信息
export function updateOrganization(data) {
  return request({
    url: '/edu/organization',
    method: 'put',
    data: data
  })
}

// 删除组织信息
export function delOrganization(organizationId) {
  return request({
    url: '/edu/organization/' + organizationId,
    method: 'delete'
  })
}
