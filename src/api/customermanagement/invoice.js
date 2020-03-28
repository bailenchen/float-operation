import request from '@/utils/request'

// 新建
export function crmInvoiceSaveAPI(data) {
  return request({
    url: 'CrmInvoice/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 编辑
export function crmInvoiceUpdateAPI(data) {
  return request({
    url: 'CrmInvoice/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 标注已开发票
export function crmInvoiceStatusUpdateAPI(data) {
  return request({
    url: 'CrmInvoice/updateInvoiceStatus',
    method: 'post',
    data: data
  })
}

// 标注已开发票
export function crmInvoiceStatusResetAPI(data) {
  return request({
    url: 'CrmInvoice/resetInvoiceStatus',
    method: 'post',
    data: data
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
    data: data
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
    data: data
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
    data: data
  })
}

/**
 * 删除
 * @param {*} data
 */
export function crmInvoiceDeleteIdsAPI(data) {
  return request({
    url: 'CrmInvoice/deleteById',
    method: 'post',
    data: data
  })
}

/**
 * 发票规则信息
 * @param {*} data
 */
export function crmInvoiceNumberConfigAPI(data) {
  return request({
    url: 'sysConfig/queryInvoiceNumberSetting',
    method: 'post',
    data: data
  })
}

/**
 * 转移
 * @param {*} data
 */
export function crmInvoiceTransfer(data) {
  return request({
    url: 'CrmInvoice/transfer',
    method: 'post',
    data: data
  })
}

/**
 * 新建发票信息
 * @param {*} data
 */
export function crmInvoiceSaveInvoiceInfoAPI(data) {
  return request({
    url: 'CrmInvoice/saveInvoiceInfo',
    method: 'post',
    data: data
  })
}

/**
 * 编辑发票信息
 * @param {*} data
 */
export function crmInvoiceUpdateInvoiceInfoAPI(data) {
  return request({
    url: 'CrmInvoice/updateInvoiceInfo',
    method: 'post',
    data: data
  })
}

/**
 * 删除发票信息
 * @param {*} data
 */
export function crmInvoiceDeleteInvoiceInfoAPI(data) {
  return request({
    url: 'CrmInvoice/deleteInvoiceInfo',
    method: 'post',
    data: data
  })
}
