import request from '@/utils/request'

/**
 *
 * 新建任务列表
 * @param {*} data
 */
export function workTaskClassSaveAPI(data) {
  return request({
    url: 'task/saveWorkTaskClass',
    method: 'post',
    data: data
  })
}

/**
 *
 * 编辑任务列表
 * @param {*} data
 */
export function workTaskClassUpateAPI(data) {
  return request({
    url: 'task/setWorkTaskClass',
    method: 'post',
    data: data
  })
}

/**
 *
 * 新建任务
 * @param {*} data
 */
export function workTaskSaveAPI(data) {
  return request({
    url: 'task/saveWorkTask',
    method: 'post',
    data: data
  })
}

/**
 *
 * 完成任务状态
 * @param {*} data
 */
export function workTaskStatusSetAPI(data) {
  return request({
    url: 'task/setWorkTaskStatus',
    method: 'post',
    data: data
  })
}

/**
 *
 * 编辑任务标题
 * @param {*} data
 */
export function workTaskTitleSetAPI(data) {
  return request({
    url: 'task/setWorkTaskTitle',
    method: 'post',
    data: data
  })
}

/**
 *
 * 编辑任务描述
 * @param {*} data
 */
export function workTaskDescriptionSetAPI(data) {
  return request({
    url: 'task/setWorkTaskDescription',
    method: 'post',
    data: data
  })
}

/**
 *
 * 分配任务（负责人）
 * @param {*} data
 */
export function workTaskMainUserSetAPI(data) {
  return request({
    url: 'task/setWorkTaskMainUser',
    method: 'post',
    data: data
  })
}

/**
 *
 * 设置任务时间
 * @param {*} data
 */
export function workTaskTimeSetAPI(data) {
  return request({
    url: 'task/setWorkTaskTime',
    method: 'post',
    data: data
  })
}

/**
 *
 * 设置任务标签
 * @param {*} data
 */
export function workTaskLabelSetAPI(data) {
  return request({
    url: 'task/setWorkTaskLabel',
    method: 'post',
    data: data
  })
}

/**
 *
 * 添加任务参与人
 * @param {*} data
 */
export function workTaskOwnerUserSetAPI(data) {
  return request({
    url: 'task/setWorkTaskOwnerUser',
    method: 'post',
    data: data
  })
}

/**
 *
 * 设置任务优先级
 * @param {*} data
 */
export function workTaskPrioritySetAPI(data) {
  return request({
    url: 'task/setWorkTaskPriority',
    method: 'post',
    data: data
  })
}

/**

 * 任务添加附件
 * @param {*} data
 */
export function workTaskFileUploadAPI(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'task/uploadWorkTaskFile',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 *
 * 任务删除附件
 * @param {*} data
 */
export function workTaskFileDeleteAPI(data) {
  return request({
    url: 'task/deleteWorkTaskFile',
    method: 'post',
    data: data
  })
}
