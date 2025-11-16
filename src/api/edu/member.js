import request from '@/utils/request'

// 查询组织成员关系列表
export function listMember(query) {
  return request({
    url: '/edu/member/list',
    method: 'get',
    params: query
  })
}

// 查询组织成员关系详细
export function getMember(memberId) {
  return request({
    url: '/edu/member/' + memberId,
    method: 'get'
  })
}

// 新增组织成员关系
export function addMember(data) {
  return request({
    url: '/edu/member',
    method: 'post',
    data: data
  })
}

// 修改组织成员关系
export function updateMember(data) {
  return request({
    url: '/edu/member',
    method: 'put',
    data: data
  })
}

// 删除组织成员关系
export function delMember(memberId) {
  return request({
    url: '/edu/member/' + memberId,
    method: 'delete'
  })
}
