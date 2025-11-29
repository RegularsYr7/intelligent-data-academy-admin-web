import request from '@/utils/request'

// 查询社区帖子列表
export function listCommunityPost(query) {
  return request({
    url: '/edu/communityPost/list',
    method: 'get',
    params: query
  })
}

// 查询社区帖子详细
export function getCommunityPost(postId) {
  return request({
    url: '/edu/communityPost/' + postId,
    method: 'get'
  })
}

// 新增社区帖子
export function addCommunityPost(data) {
  return request({
    url: '/edu/communityPost',
    method: 'post',
    data: data
  })
}

// 修改社区帖子
export function updateCommunityPost(data) {
  return request({
    url: '/edu/communityPost',
    method: 'put',
    data: data
  })
}

// 删除社区帖子
export function delCommunityPost(postId) {
  return request({
    url: '/edu/communityPost/' + postId,
    method: 'delete'
  })
}

// 置顶社区帖子
export function topCommunityPost(postId, isTop) {
  return request({
    url: '/edu/communityPost/top/' + postId,
    method: 'put',
    params: { isTop }
  })
}
