

import request from '@/utils/request'

// crm 列表
export function crmReceiveIndex(data) {
  return request({
    url: 'CrmContractCapital/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// crm 详情
export function crmReceiveRead(data) {
  return request({
    url: 'CrmContractCapital/queryById',
    method: 'post',
    data: data
  })
}


// 批量导出
export function crmReceiveExcelExport(data) {
  return request({
    url: 'CrmContractCapital/batchExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 全部导出
export function crmReceiveExcelAllExport(data) {
  return request({
    url: 'CrmContractCapital/allExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 删除
export function crmReceiveDeleteAPI(data) {
  return request({
    url: 'CrmContractCapital/deleteByIds',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


// 附件列表
export function crmReceiveFileListAPI(data) {
  return request({
    url: 'CrmContractCapital/queryFileList',
    method: 'post',
    data: data
  })
}
