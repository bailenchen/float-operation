import request from '@/utils/request'

// 新建或编辑
export function crmInvoiceSaveAPI(data) {
  return request({
    url: 'CrmInvoice/saveOrUpdate',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 标注已开发票
export function crmInvoiceUpdateTypeAPI(data) {
  return request({
    url: 'CrmInvoice/updateTypeById',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 分页查询发票
export function crmInvoiceIndexAPI(data) {
  return request({
    url: 'CrmInvoice/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 发票详情
export function crmInvoiceReadAPI(data) {
  return request({
    url: 'CrmInvoice/queryById',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 附件列表
 * @param {*} data
 *
 */
export function crmInvoiceFileListAPI(data) {
  return request({
    url: 'CrmInvoice/queryFileList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 转移
 * @param {*} data
 */
export function crmInvoiceTransferAPI(data) {
  return request({
    url: 'CrmInvoice/transfer',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 删除
 * @param {*} data
 */
export function crmInvoiceDeleteIdsAPI(data) {
  return request({
    url: 'CrmInvoice/deleteIds',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
