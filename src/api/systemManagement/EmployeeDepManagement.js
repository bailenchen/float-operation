import request from '@/utils/request'

export function depDelete(data) {
  return request({
    url: 'system/dept/deleteDept',
    method: 'post',
    data: data
  })
}

export function depEdit(data) {
  return request({
    url: 'system/dept/updateDept',
    method: 'post',
    data: data
  })
}

export function depSave(data) {
  return request({
    url: 'system/dept/addDept',
    method: 'post',
    data: data
  })
}

export function usersEdit(params) {
  return request({
    url: 'system/user/setUser',
    method: 'post',
    data: params
  })
}

export function usersAdd(params) {
  return request({
    url: 'system/user/addUser',
    method: 'post',
    data: params
  })
}

// 角色列表
export function roleList(data) {
  return request({
    url: 'system/role/getAllRoleList',
    method: 'post',
    data: data
  })
}

// 重置密码
export function resetPassword(data) {
  return request({
    url: 'system/user/resetPassword',
    method: 'post',
    data: data
  })
}

/**
 * 批量修改密码接口
 * @param {*} data
 * password
 * id 用户数组
 */
export function adminUsersUpdatePwd(data) {
  return request({
    url: 'system/user/resetPassword',
    method: 'post',
    data: data
  })
}

/**
 * 编辑登录名
 * @param {*} data
 * username
 * password
 * id
 */
export function adminUsersUsernameEditAPI(data) {
  return request({
    url: 'system/user/usernameEdit',
    method: 'post',
    data: data
  })
}

/**
 * 编辑登录名
 * @param {*} data
 * username
 * password
 * id
 * 可修改管理员
 */
export function adminUsersManagerUsernameEditAPI(data) {
  return request({
    url: 'system/user/usernameEditByManager',
    method: 'post',
    data: data
  })
}

// 用户状态修改
export function usersEditStatus(data) {
  return request({
    url: 'system/user/setUserStatus',
    method: 'post',
    data: data
  })
}

/**
 * 用户导入模板
 * @param {*} data
 */
export const userImportTemplateURL = process.env.BASE_API + 'user_import.xlsx'
export function userImportTemplateAPI(data) {
  return request({
    url: 'user_import.xlsx',
    method: 'post',
    data: data
  })
}

/**
 * 用户导入
 * @param {*} data
 */
export function userExcelImportAPI(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'system/user/excelImport',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 60000
  })
}

/**
 * 下载用户导入错误数据
 * @param {*} data
 *
 */
export function userErrorExcelDownAPI(data) {
  return request({
    url: 'system/user/downExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
