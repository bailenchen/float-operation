/*
 * @Author: your name
 * @Date: 2020-08-28 10:40:28
 * @LastEditTime: 2020-09-09 14:27:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\api\customermanagement\account.js
 */
import request from '@/utils/request'

// crm 新建资金客户
export function crmAccountSave(data) {
  return request({
    url: 'CrmCapitalAccount/addOrUpdate',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// crm 资金客户 列表
export function crmAccountIndex(data) {
  return request({
    url: 'CrmCapitalAccount/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 资金账户导出
 * @param {*} data
 */
export function crmAccountExcelExport(data) {
  return request({
    url: 'CrmCapitalAccount/batchExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 全部导出
export function crmAccountExcelAllExport(data) {
  return request({
    url: 'CrmCapitalAccount/allExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


// 删除
export function crmAccountDelete(data) {
  return request({
    url: 'CrmCapitalAccount/deleteByIds',
    method: 'post',
    data: data
  })
}


/**
 * 附件列表
 * @param {*} data
 *
 */
export function crmAccountFileListAPI(data) {
  return request({
    url: 'CrmCapitalAccount/queryFileList',
    method: 'post',
    data: data
  })
}

// crm 资金客户 详情
export function crmAccountRead(data) {
  return request({
    url: 'CrmCapitalAccount/queryById',
    method: 'post',
    data: data
  })
}

// crm 资金客户 扫码付款
export function crmAccountScanePay(data) {
  return request({
    url: 'CrmCapitalAccountWater/unionorder',
    method: 'post',
    data: data
  })
}
