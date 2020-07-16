import request from '@/utils/request'

// 我下属的任务列表
export function taskListAPI(data) {
  return request({
    url: 'task/queryTaskList',
    method: 'post',
    data: data
  })
}
/** ******** oA任务 ********/
// 新增任务
export function setTaskAPI(data) {
  return request({
    url: 'task/setTask',
    method: 'post',
    data: data
  })
}
// 删除任务
export function deleteTaskAPI(data) {
  return request({
    url: 'task/deleteTask',
    method: 'post',
    data: data
  })
}
// 任务详情
export function detailsTaskAPI(data) {
  return request({
    url: 'task/queryTaskInfo',
    method: 'post',
    data: data
  })
}

// 回收站任务详情
export function detailsTrashTaskAPI(data) {
  return request({
    url: 'task/queryTrashTaskInfo',
    method: 'post',
    data: data
  })
}


// 任务活动
export function queryLogTaskAPI(data) {
  return request({
    url: 'task/queryTaskLog',
    method: 'post',
    data: data
  })
}

// 编辑相关信息
export function editTaskRelationAPI(data) {
  return request({
    url: 'task/saveTaskRelation',
    method: 'post',
    data: data
  })
}

// 编辑项目任务相关信息
export function editWorkTaskRelationAPI(data) {
  return request({
    url: 'task/saveWorkTaskRelation',
    method: 'post',
    data: data
  })
}


// 创建标签
export function createTagAPI(data) {
  return request({
    url: 'taskLabel/setLabel',
    method: 'post',
    data: data
  })
}
// 编辑标签
export function editTagAPI(data) {
  return request({
    url: 'taskLabel/setLabel',
    method: 'post',
    data: data
  })
}
// 删除标签
export function deleteTagAPI(data) {
  return request({
    url: 'taskLabel/deleteLabel',
    method: 'post',
    data: data
  })
}
// 标签列表
export function tagList(data) {
  return request({
    url: 'taskLabel/getLabelList',
    method: 'post',
    data: data
  })
}

// 操作记录
export function readLoglist(data) {
  return request({
    url: 'task/queryWorkTaskLog',
    method: 'post',
    data: data
  })
}

export function setCommentAPI(data) {
  return request({
    url: 'comment/setComment',
    method: 'post',
    data: data
  })
}

// 设置项目评论
export function setWorkTaskCommentAPI(data) {
  return request({
    url: 'comment/setWorkTaskComment',
    method: 'post',
    data: data
  })
}

export function deleteCommentAPI(data) {
  return request({
    url: 'comment/deleteComment',
    method: 'post',
    data: data
  })
}

// 删除项目任务接口
export function deleteWorkTaskCommentAPI(data) {
  return request({
    url: 'comment/deleteWorkTaskComment',
    method: 'post',
    data: data
  })
}

export function commentListAPI(data) {
  return request({
    url: 'comment/queryCommentList',
    method: 'post',
    data: data
  })
}

/**
 * 删除参与人 taskId  userId
 * @param {*} data
 */
export function taskDeleteOwnerUserAPI(data) {
  return request({
    url: 'task/deleteOwnerUser',
    method: 'post',
    data: data
  })
}

/**
 * 删除标签 taskId  label
 * @param {*} data
 */
export function taskDeleteLabelAPI(data) {
  return request({
    url: 'task/deleteLabel',
    method: 'post',
    data: data
  })
}

/**
 * 办公任务导出
 * @param {*} data
 */
export function taskOaExportAPI(data) {
  return request({
    url: 'task/oaTaskExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

