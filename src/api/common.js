import request from '@/utils/request'

/**
 *
 * @param {*} data
 */
export function usersList(data) {
  return request({
    url: 'system/user/queryUserList',
    method: 'post',
    data: data
  })
}

/**
 * type
 * @param {*} data
 */
export function depList(data) {
  return request({
    url: 'system/dept/queryDeptTree',
    method: 'post',
    data: data
  })
}

// 获取权限范围内部门接口
export function adminStructuresSubIndex(data) {
  return request({
    url: 'system/dept/queryDeptByAuth',
    method: 'post',
    data: data
  })
}
// 获取权限范围内部门接口
export function getUserByDeptId(data) {
  return request({
    url: 'system/user/queryUserByDeptId',
    method: 'post',
    data: data
  })
}


// 部门下的员工
export function userListByStructid(data) {
  return request({
    url: 'admin/users/userListByStructid',
    method: 'post',
    data: data
  })
}

/**
 *
 * @param {*} data
 */
export const crmFileSaveUrl = process.env.BASE_API + 'file/upload'

export function crmFileSave(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'file/upload',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function crmFileFormDataSave(data) {
  return request({
    url: 'file/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 附件列表
export function crmFileIndex(data) {
  return request({
    url: 'file/queryByBatchId',
    method: 'post',
    data: data
  })
}

/** 暂时客户管理里面也有 */
// 附件删除接口
export function crmFileDelete(data) {
  return request({
    url: 'file/removeById',
    method: 'post',
    data: data
  })
}

// 根据批次ID删除文件
export function crmFileRemoveByBatchId(data) {
  return request({
    url: 'file/removeByBatchId',
    method: 'post',
    data: data
  })
}

// 附件重命名
export function crmFileUpdate(data) {
  return request({
    url: 'file/renameFileById',
    method: 'post',
    data: data
  })
}

// crm 自定义字段的添加
/**
 *
 * @param {*} data
 */
export function filedGetField(data) {
  return request({
    url: 'field/queryField',
    method: 'post',
    data: data
  })
}

// 权限数据返回
export function adminIndexAuthList(data) {
  return request({
    url: 'system/role/auth',
    method: 'post',
    data: data
  })
}


/**
 * 系统消息列表
 * label 1 任务 2 日志 3 oa审批 4公告 5 日程 6 客户管理
 * isRead 0 未读 1 已读
 * @param {*} data
 */
export function systemMessageListAPI(data) {
  return request({
    url: 'system/message/queryList',
    method: 'post',
    data: data
  })
}

/**
 * 未读消息数
 * @param {*} data
 */
export function systemMessageUnreadCountAPI(data) {
  return request({
    url: 'system/message/queryUnreadCount',
    method: 'post',
    data: data
  })
}

/**
 * 读消息
 * @param {*} data
 */
export function systemMessageReadAPI(data) {
  return request({
    url: 'system/message/readMessage',
    method: 'post',
    data: data
  })
}

/**
 * 读全部消息
 * @param {*} data
 */
export function systemMessageReadAllAPI(data) {
  return request({
    url: 'system/message/readAllMessage',
    method: 'post',
    data: data
  })
}
