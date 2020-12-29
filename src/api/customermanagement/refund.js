

import request from '@/utils/request'


// crm 合同充值返还 添加/编辑
export function crmRefundSaveOrUpdateAPI(data) {
  return request({
    url: 'CrmRefund/saveOrUpdate',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// crm 合同充值返还 列表
export function crmRefundQueryPageListAPI(data) {
  return request({
    url: 'CrmRefund/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// crm 合同充值返还 详情
export function crmRefundReadAPI(data) {
  return request({
    url: 'CrmRefund/queryById',
    method: 'post',
    data: data
  })
}


// 删除
export function crmRefundDeleteAPI(data) {
  return request({
    url: 'CrmRefund/deleteByIds',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


// 批量导出
export function crmRefundExcelExport(data) {
  return request({
    url: 'CrmRefund/batchExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 全部导出
export function crmRefundExcelAllExport(data) {
  return request({
    url: 'CrmRefund/allExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

