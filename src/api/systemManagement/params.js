/**
 * Create by yxk at 2020/7/23 0023
 */
import request from '@/utils/request'

// 查询渠道
export function QueryChannelCategory() {
  return request({
    url: 'adminChannelCategory/queryList',
    method: 'post'
  })
}

// 添加/编辑渠道
export function AddChannelCategory(data) {
  return request({
    url: 'adminChannelCategory/addAdminChannelType',
    method: 'post',
    data: data
  })
}

// 删除渠道
export function DeleteChannelCategory(data) {
  return request({
    url: 'adminChannelCategory/delectAddAdminChannelType',
    method: 'post',
    data: data
  })
}

// 查询渠道类型列表
export function QueryChannelType(data) {
  return request({
    url: 'adminChannelType/queryAdminChannelType',
    method: 'post'
  })
}

// 编辑渠道类型
// export function SelectEdit(data) {
//   return request({
//     url: 'adminChannelType/selectEdit',
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     },
//     data: data
//   })
// }

// 添加渠道类型
export function AddChannelType(data) {
  return request({
    url: 'adminChannelType/addAdminChannelType',
    method: 'post',
    // headers: {
    //   'Content-Type': 'application/json;charset=UTF-8'
    // },
    data: data
  })
}

// 删除渠道类型
export function DeleteChannelType(data) {
  return request({
    url: 'adminChannelType/delectAddAdminChannelType',
    method: 'post',
    data: data
  })
}

// 查询年级配置
export function QueryAdminGrade(data) {
  return request({
    url: 'adminGrade/queryAdminGrade',
    method: 'post'
  })
}

// 添加/编辑年级
export function AddAdminGrade(data) {
  return request({
    url: 'adminGrade/addAdminGrade',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// 查询科目配置
export function QueryAdminSubject(data) {
  return request({
    url: 'adminSubject/queryAdminSubject',
    method: 'post'
  })
}

// 添加/编辑科目
export function AddAdminSubject(data) {
  return request({
    url: 'adminSubject/addAdminGrade',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// 查询科目赠送规则
export function QueryAdminGive(data) {
  return request({
    url: 'adminGive/queryAdminGive',
    method: 'post'
  })
}

// 查询辅导方式
export function QueryCoach(data) {
  return request({
    url: 'system/user/queryCoach',
    method: 'post'
  })
}

// 添加/编辑科目赠送规则
export function AddAdminGive(data) {
  return request({
    url: 'adminGive/addAdminGive',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// 查询承诺到访/回访提醒设置
export function QueryReminderSettings(data) {
  return request({
    url: 'adminReminderSettings/queryAdminReminderSettings',
    method: 'post',
    data: data
  })
}

// 修改LEADS承诺到访提醒设置
export function UpdateLeadsReminderSettings(data) {
  return request({
    url: 'adminReminderSettings/updateReachVisitRemindConfig',
    method: 'post',
    data: data
  })
}

// 修改学员回访提醒设置
export function UpdateStudentReminderSettings(data) {
  return request({
    url: 'adminReminderSettings/updateReturnVisitRemindConfig',
    method: 'post',
    data: data
  })
}

// 查询签约可能性
export function QuerySignUpList(data) {
  return request({
    url: 'adminSignUp/queryAdminSubject',
    method: 'post'
  })
}

// 添加/编辑签约可能性
export function AddAdminSignUp(data) {
  return request({
    url: 'adminSignUp/addAdminGrade',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// 查询跟进结果
export function QueryFollowUpResults(data) {
  return request({
    url: 'adminFollowUpResults/queryAdminFollowUpResults',
    method: 'post'
  })
}

// 添加/编辑跟进结果
export function AddFollowUpResults(data) {
  return request({
    url: 'adminFollowUpResults/addAdminFollowUpResults',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}