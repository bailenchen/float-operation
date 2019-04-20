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
export function oaExamineSaveAndUpdate(data) {
  return request({
    url: 'OaExamine/setOaExamine',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
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

//新建的审批流
// CRM合同回款创建时候的审批流
export function oaCreateExamineFlow(data) {
  return request({
    url: 'OaExamine/queryExaminStep',
    method: 'post',
    data: data
  })
}
