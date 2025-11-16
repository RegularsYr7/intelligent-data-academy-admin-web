import request from '@/utils/request'

// 查询地图地标信息列表
export function listLandmark(query) {
  return request({
    url: '/edu/landmark/list',
    method: 'get',
    params: query
  })
}

// 查询地图地标信息详细
export function getLandmark(landmarkId) {
  return request({
    url: '/edu/landmark/' + landmarkId,
    method: 'get'
  })
}

// 新增地图地标信息
export function addLandmark(data) {
  return request({
    url: '/edu/landmark',
    method: 'post',
    data: data
  })
}

// 修改地图地标信息
export function updateLandmark(data) {
  return request({
    url: '/edu/landmark',
    method: 'put',
    data: data
  })
}

// 删除地图地标信息
export function delLandmark(landmarkId) {
  return request({
    url: '/edu/landmark/' + landmarkId,
    method: 'delete'
  })
}
