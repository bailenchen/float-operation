import request from '@/utils/request'

/**
 * 归档任务列表
 * @param {*} data
 */
export function workTaskArchListAPI(data) {
  return request({
    url: 'work/archList',
    method: 'post',
    data: data
  })
}

/**
 * 项目详情
 * @param {*} data
 */
export function workWorkReadAPI(data) {
  return request({
    url: 'work/getWorkById',
    method: 'post',
    data: data
  })
}

/**
 * 项目删除
 * @param {*} data
 */
export function workWorkDeleteAPI(data) {
  return request({
    url: 'work/deleteWork',
    method: 'post',
    data: data
  })
}

/**
 * 新建项目
 * @param {*} data
 */
export function workWorkSaveAPI(data) {
  return request({
    url: 'work/setWork',
    method: 'post',
    data: data
  })
}

/**
 * 退出项目
 * @param {*} data
 */
export function workWorkLeaveAPI(data) {
  return request({
    url: 'work/leave',
    method: 'post',
    data: data
  })
}

/**
 * 任务板列表
 * @param {*} data
 */
export function workTaskIndexAPI(data) {
  return request({
    url: 'work/queryTaskByWorkId',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 设置任务类别
 * @param {*} data
 */
export function workTaskClassSetAPI(data) {
  return request({
    url: 'task/setTaskClass',
    method: 'post',
    data: data
  })
}

/**
 * 分类删除
 * @param {*} data
 */
export function workTaskclassDeleteAPI(data) {
  return request({
    url: 'work/deleteTaskList',
    method: 'post',
    data: data
  })
}

/**
 * 获取附件列表
 * @param {*} data
 */
export function workWorkFileListAPI(data) {
  return request({
    url: 'work/queryTaskFileByWorkId',
    method: 'post',
    data: data
  })
}

/**
 * 项目 -- 成员列表
 * @param {*} data
 */
export function workWorkOwnerListAPI(data) {
  return request({
    url: 'work/queryOwnerRoleList',
    method: 'post',
    data: data
  })
}

/**
 * 项目 -- 成员删除
 * @param {*} data
 */
export function workWorkOwnerDelAPI(data) {
  return request({
    url: 'work/removeWorkOwnerUser',
    method: 'post',
    data: data
  })
}

/**
 * 项目 -- 归档已完成任务
 * @param {*} data
 */
export function workTaskArchiveTaskAPI(data) {
  return request({
    url: 'work/archiveTask',
    method: 'post',
    data: data
  })
}

/**
 * 拖拽改变分类
 * @param {*} data
 */
export function workTaskUpdateOrderAPI(data) {
  return request({
    url: 'work/updateOrder',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 拖拽改变分类列表
 * @param {*} data
 */
export function workTaskUpdateClassOrderAPI(data) {
  return request({
    url: 'work/updateClassOrder',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 项目成员添加角色
 * @param {*} data
 */
export function workWorkAddUserGroupAPI(data) {
  return request({
    url: 'work/setOwnerRole',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 项目成员角色列表
 * @param {*} data
 */
export function workWorkGroupListAPI(data) {
  return request({
    url: 'work/queryRoleList',
    method: 'post',
    data: data
  })
}

/**
 * 项目收藏
 * @param {*} data
 */
export function workWorkCollectAPI(data) {
  return request({
    url: 'work/collect',
    method: 'post',
    data: data
  })
}

/**
 * 修改标签排序
 * @param {*} data
 */
export function workupdateWorkOrderAPI(data) {
  return request({
    url: 'work/updateWorkOrder',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 项目任务导出
 * @param {*} data
 */
export function workTaskExportAPI(data) {
  return request({
    url: 'work/workTaskExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 获取导入模板
 * @param {*} data
 */
export function workDownloadExcelAPI(data) {
  return request({
    url: 'work/downloadExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 项目任务导入
 * @param {*} data
 */
export function workExcelImportAPI(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'work/excelImport',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 项目任务下载错误模板
 * @param {*} data
 */
export function workDownloadErrorExcelAPI(data) {
  return request({
    url: 'work/downloadErrorExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
