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

// crm 批量删除小程序信息 changeLeads
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

// crm 转化为线索 CrmWeixinLeads/exportLeads
export function crmWeixinChangeLeadsAPI(data) {
  return request({
    url: 'CrmWeixinLeads/changeLeads',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// crm 导出勾选
export function CrmWeixinLeadsExportLeadsAPI(data) {
  return request({
    url: 'CrmWeixinLeads/exportLeads',
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}
