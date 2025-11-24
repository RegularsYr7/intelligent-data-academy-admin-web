import request from "@/utils/request";

// 查询课信息列表
export function listSchedule(query) {
  return request({
    url: "/edu/schedule/list",
    method: "get",
    params: query,
  });
}

// 查询课信息详细
export function getSchedule(scheduleId) {
  return request({
    url: "/edu/schedule/" + scheduleId,
    method: "get",
  });
}

// 新增课信息
export function addSchedule(data) {
  return request({
    url: "/edu/schedule",
    method: "post",
    data: data,
  });
}

// 修改课信息
export function updateSchedule(data) {
  return request({
    url: "/edu/schedule",
    method: "put",
    data: data,
  });
}

// 删除课信息
export function delSchedule(scheduleId) {
  return request({
    url: "/edu/schedule/" + scheduleId,
    method: "delete",
  });
}

// 获取班级课表（小程序专用接口）
export function getScheduleForMiniProgram(classId, semester) {
  return request({
    url: "/edu/schedule/miniprogram",
    method: "get",
    params: {
      classId: classId,
      semester: semester,
    },
  });
}

// 获取班级课表（管理员）
export function getScheduleForAdmin(classId, semester) {
  return request({
    url: "/edu/schedule/getScheduleForAdmin",
    method: "get",
    params: { classId, semester },
  });
}
