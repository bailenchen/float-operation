/*
 * @Author: your name
 * @Date: 2020-08-20 13:50:29
 * @LastEditTime: 2020-08-21 17:43:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\api\customermanagement\meal.js
 */
import request from '@/utils/request'

// crm 套餐列表
export function crmproductSetMealIndex(data) {
  return request({
    url: 'CrmProductSetMeal/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 套餐 详情
export function crmProductSetMealRead(data) {
  return request({
    url: 'CrmProductSetMeal/queryById',
    method: 'post',
    data: data
  })
}

/**
 * 附件列表
 * @param {*} data
 *
 */
export function crmProductSetMealFileListAPI(data) {
  return request({
    url: 'CrmProductSetMeal/queryFileList',
    method: 'post',
    data: data
  })
}

// crm 套餐价格计算
export function crmproductSetMealCalPrice(data) {
  return request({
    url: 'CrmProductSetMeal/selectProduct',
    method: 'post',
    data: data
  })
}

// crm 新建套餐
export function crmProductSetMealSave(data) {
  return request({
    url: 'CrmProductSetMeal/saveAndUpdate',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 套餐删除
 * @param {*} data
 */
export function crmProductSetMealDeleteAPI(data) {
  return request({
    url: 'CrmProductSetMeal/deleteByIds',
    method: 'post',
    data: data
  })
}

/**
 * 产品导出
 * @param {*} data
 * product_id 产品ID
 */
export function crmProductSetMealExcelExport(data) {
  return request({
    url: 'CrmProductSetMeal/batchExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

export function crmProductSetMealExcelAllExport(data) {
  return request({
    url: 'CrmProductSetMeal/allExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 套餐上架、下架
 * @param {*} data
 */
export function crmProductSetMealStatus(data) {
  return request({
    url: 'CrmProductSetMeal/updateStatus',
    method: 'post',
    data: data
  })
}
