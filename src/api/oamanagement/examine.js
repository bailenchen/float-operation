import request from '@/utils/request'

// 审批类型列表
export function oaExamineCategoryList(data) {
  return request({
    url: 'OaExamineCategory/queryAllExamineCategoryList',
    method: 'post',
    data: data
  })
}

// 审批新建
export function oaExamineSave(data) {
  return request({
    url: 'oa/examine/save',
    method: 'post',
    data: data
  })
}

// 审批编辑
export function oaExamineUpdate(data) {
  return request({
    url: 'oa/examine/update',
    method: 'post',
    data: data
  })
}

// 我发起的审批
export function oaExamineMyCreateIndex(data) {
  return request({
    url: 'OaExamine/myInitiate',
    method: 'post',
    data: data
  })
}

// 我审批的
export function oaExamineMyExamineIndex(data) {
  return request({
    url: 'OaExamine/myOaExamine',
    method: 'post',
    data: data
  })
}

// 审批删除
export function oaExamineDelete(data) {
  return request({
    url: 'oa/examine/delete',
    method: 'post',
    data: data
  })
}

// 审批详情
export function oaExamineRead(data) {
  return request({
    url: 'oa/examine/read',
    method: 'post',
    data: data
  })
}

// OA审批审核
export function oaExamineCheck(data) {
  return request({
    url: 'oa/examine/check',
    method: 'post',
    data: data
  })
}

// OA审批撤回审核
export function oaExamineRevokeCheck(data) {
  return request({
    url: 'oa/examine/revokeCheck',
    method: 'post',
    data: data
  })
}
