import request from '@/utils/request'

// crm 查询小程序分页列表
export function crmAppletIndexAPI(data) {
  return request({
    url: 'CrmWeixinLeads/queryPage',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// crm 批量删除小程序信息
export function crmWeixinDeleteAPI(data) {
  return request({
    url: 'CrmWeixinLeads/deleteByIds',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}
