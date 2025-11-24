import request from "@/utils/request";

// 查询辅导员管理的班级列表
export function getUserClassList(userId) {
  return request({
    url: "/system/user/class/list/" + userId,
    method: "get",
  });
}

// 为辅导员添加管理班级
export function addUserClasses(data) {
  return request({
    url: "/system/user/class/add",
    method: "post",
    data: data,
  });
}

// 移除辅导员管理的班级
export function removeUserClass(userId, classId) {
  return request({
    url: `/system/user/class/remove/${userId}/${classId}`,
    method: "delete",
  });
}

// 同步managed_class_ids字段
export function syncManagedClassIds(userId) {
  return request({
    url: "/system/user/class/sync/" + userId,
    method: "post",
  });
}

// 查询班级的辅导员列表（根据班级ID）
// 注意：此接口需要后端提供，格式为 GET /system/user/class/teachers/{classId}
export function getClassTeachers(classId) {
  return request({
    url: "/system/user/class/teachers/" + classId,
    method: "get",
  });
}
