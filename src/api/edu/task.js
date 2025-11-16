import request from '@/utils/request'

// 查询签到任务列表
export function listTask(query) {
  return request({
    url: '/edu/task/list',
    method: 'get',
    params: query
  })
}

// 查询签到任务详细
export function getTask(taskId) {
  return request({
    url: '/edu/task/' + taskId,
    method: 'get'
  })
}

// 新增签到任务
export function addTask(data) {
  return request({
    url: '/edu/task',
    method: 'post',
    data: data
  })
}

// 修改签到任务
export function updateTask(data) {
  return request({
    url: '/edu/task',
    method: 'put',
    data: data
  })
}

// 删除签到任务
export function delTask(taskId) {
  return request({
    url: '/edu/task/' + taskId,
    method: 'delete'
  })
}
