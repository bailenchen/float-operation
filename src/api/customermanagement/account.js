/*
 * @Author: your name
 * @Date: 2020-08-28 10:40:28
 * @LastEditTime: 2020-08-28 11:09:33
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

// crm 资金客户 详情
export function crmAccountRead(data) {
  return request({
    url: 'CrmCapitalAccount/queryById',
    method: 'post',
    data: data
  })
}
