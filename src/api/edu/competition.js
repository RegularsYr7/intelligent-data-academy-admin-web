import request from '@/utils/request'

// 查询竞赛信息列表
export function listCompetition(query) {
  return request({
    url: '/edu/competition/list',
    method: 'get',
    params: query
  })
}

// 查询竞赛信息详细
export function getCompetition(competitionId) {
  return request({
    url: '/edu/competition/' + competitionId,
    method: 'get'
  })
}

// 新增竞赛信息
export function addCompetition(data) {
  return request({
    url: '/edu/competition',
    method: 'post',
    data: data
  })
}

// 修改竞赛信息
export function updateCompetition(data) {
  return request({
    url: '/edu/competition',
    method: 'put',
    data: data
  })
}

// 删除竞赛信息
export function delCompetition(competitionId) {
  return request({
    url: '/edu/competition/' + competitionId,
    method: 'delete'
  })
}
