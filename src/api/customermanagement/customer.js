import request from '@/utils/request'

// crm 新建客户
export function crmCustomerSave(data) {
  return request({
    url: 'CrmCustomer/addOrUpdate',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// crm 客户列表
export function crmCustomerIndex(data) {
  return request({
    url: 'CrmCustomer/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 删除
export function crmCustomerDelete(data) {
  return request({
    url: 'CrmCustomer/deleteByIds',
    method: 'post',
    data: data
  })
}

// crm 公海列表
export function crmCustomerPool(data) {
  return request({
    url: 'CrmCustomerPool/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 删除
export function crmCustomerPoolDeleteAPI(data) {
  return request({
    url: 'CrmCustomerPool/deleteByIds',
    method: 'post',
    data: data
  })
}

// 设置公海
export function crmCustomerPoolSetAPI(data) {
  return request({
    url: 'CrmCustomerPool/setCustomerPool',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 公海设置列表
export function crmCustomerPoolSetListAPI(data) {
  return request({
    url: 'CrmCustomerPool/queryPoolSettingList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 公海设置删除
export function crmCustomerPoolSetDeleteAPI(data) {
  return request({
    url: 'CrmCustomerPool/deleteCustomerPool',
    method: 'post',
    data: data
  })
}

// 公海设置详情
export function crmCustomerPoolSetDetailAPI(data) {
  return request({
    url: 'CrmCustomerPool/queryPoolById',
    method: 'post',
    data: data
  })
}

// 公海启停
export function crmCustomerPoolSetChangeStatusAPI(data) {
  return request({
    url: 'CrmCustomerPool/changeStatus',
    method: 'post',
    data: data
  })
}

/**
 * 公海客户转移
 * prePoolId 转出公海id
 * postPoolId 转入公海id
 * @param {*} data
 */
export function crmCustomerPoolSetTransferAPI(data) {
  return request({
    url: 'CrmCustomerPool/transfer',
    method: 'post',
    data: data
  })
}

/**
 * 跨公海转移客户
 * @param data
 * @constructor
 */
export function TransferCustomerAPI(data) {
  return request({
    url: 'crmCustomerPoolRule/customerPoolTransfer',
    method: 'post',
    data: data
  })
}

/**
 * 转移数据源
 * @param {*} data
 */
export function crmCustomerPoolSetNameListAPI(data) {
  return request({
    url: 'CrmCustomerPool/queryPoolNameList',
    method: 'post',
    data: data
  })
}

/**
 * 客户管理用到的公海列表
 * @param {*} data
 */
export function crmCustomerPoolNameListAPI(data) {
  return request({
    url: 'CrmCustomerPool/queryPoolNameListByAuth',
    method: 'post',
    data: data
  })
}

/**
 * 获取客户级别选项接口
 * @param {*} data
 */
export function crmCustomerPoolQueryLevelAPI(data) {
  return request({
    url: 'CrmCustomerPool/queryCustomerLevel',
    method: 'post',
    data: data
  })
}

// crm 详情
export function crmCustomerRead(data) {
  return request({
    url: 'CrmCustomer/queryById',
    method: 'post',
    data: data
  })
}

// 操作
/**
 * 客户锁定，解锁
 * @param {*} data
 */
export function crmCustomerLock(data) {
  return request({
    url: 'CrmCustomer/lock',
    method: 'post',
    data: data
  })
}

/**
 * 客户放入公海
 * @param {*} data
 * customer_id 	客户数组
 */
export function crmCustomerPutInPool(data) {
  return request({
    url: 'CrmCustomer/updateCustomerByIds',
    method: 'post',
    data: data
  })
}

/**
 * 客户转移
 * @param {*} data
 */
export function crmCustomerTransfer(data) {
  return request({
    url: 'CrmCustomer/transfer',
    method: 'post',
    data: data
  })
}

/**
 * 客户导出
 * @param {*} data
 * customer_id 客户ID
 */
export function crmCustomerExcelExport(data) {
  return request({
    url: 'CrmCustomer/batchExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

export function crmCustomerExcelAllExport(data) {
  return request({
    url: 'CrmCustomer/allExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 客户导入
 * @param {*} data
 * customer_id 客户ID
 */
export function crmCustomerExcelImport(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'CrmCustomer/uploadExcel',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 公海客户导入
 * @param {*} data
 * customer_id 客户ID
 */
export function crmCustomerPoolExcelImport(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'CrmCustomerPool/uploadExcel',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 客户导入模板下载
 * @param {*} data
 *
 */
export const crmCustomerExcelDownloadURL = process.env.BASE_API + 'CrmCustomer/downloadExcel'
export function crmCustomerDownloadExcelAPI(data) {
  return request({
    url: 'CrmCustomer/downloadExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 公海导出
 * @param {*} data
 */
export function crmCustomerPoolExcelExportAPI(data) {
  return request({
    url: 'CrmCustomerPool/batchExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    timeout: 60000
  })
}

export function crmCustomerPoolExcelAllExport(data) {
  return request({
    url: 'CrmCustomerPool/allExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function crmCustomerPoolQueryPoolFieldtAPI(data) {
  return request({
    url: 'CrmCustomerPool/queryPoolField',
    method: 'post',
    data: data
  })
}

/**
 * 客户分配
 * @param {*} data
 */
export function crmCustomerDistribute(data) {
  return request({
    url: 'CrmCustomer/distributeByIds',
    method: 'post',
    data: data
  })
}

/**
 * 分配班主任
 * @param {*} data
 */
export function CustomerDistributeTeacher(data) {
  return request({
    url: 'CrmCustomer/distribution',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 客户领取
 * @param {*} data
 */
export function crmCustomerReceive(data) {
  return request({
    url: 'CrmCustomer/receiveByIds',
    method: 'post',
    data: data
  })
}

/**
 * 客户下联系人
 * @param {*} data
 */
export function crmCustomerQueryContacts(data) {
  return request({
    url: 'CrmCustomer/queryContacts',
    method: 'post',
    data: data
  })
}

/**
 * 客户下回访
 * @param {*} data
 */
export function crmCustomerQueryVisitAPI(data) {
  return request({
    url: 'CrmCustomer/queryReturnVisit',
    method: 'post',
    data: data
  })
}

/**
 * 客户下商机
 * @param {*} data
 */
export function crmCustomerQueryBusiness(data) {
  return request({
    url: 'CrmCustomer/queryBusiness',
    method: 'post',
    data: data
  })
}

/**
 * 客户下合同
 * @param {*} data
 */
export function crmCustomerQueryContract(data) {
  return request({
    url: 'CrmCustomer/queryContract',
    method: 'post',
    data: data
  })
}

/**
 * 客户下回款计划
 * @param {*} data
 */
export function crmCustomerQueryReceivablesPlan(data) {
  return request({
    url: 'CrmCustomer/queryReceivablesPlan',
    method: 'post',
    data: data
  })
}

/**
 * 客户下回款
 * @param {*} data
 */
export function crmCustomerQueryReceivables(data) {
  return request({
    url: 'CrmCustomer/queryReceivables',
    method: 'post',
    data: data
  })
}


/**
 * 跟进记录
 * @param {*} data
 */
export function crmCustomerRecordSave(data) {
  return request({
    url: 'CrmCustomer/addRecord',
    method: 'post',
    data: data
  })
}
export function crmCustomerRecordIndex(data) {
  return request({
    url: 'CrmCustomer/getRecord',
    method: 'post',
    data: data
  })
}
// 团队操作

/**
 * 团队成员创建
 * @param {*} data
 * types crm_leads
 * typesId 分类ID
 */
export function crmCustomerSettingTeamSave(data) {
  return request({
    url: 'CrmCustomer/addMembers',
    method: 'post',
    data: data
  })
}

export function crmCustomerSettingTeamDelete(data) {
  return request({
    url: 'CrmCustomer/deleteMembers',
    method: 'post',
    data: data
  })
}

export function crmCustomerTeamMembers(data) {
  return request({
    url: 'CrmCustomer/getMembers',
    method: 'post',
    data: data
  })
}

export function crmCustomerUpdateMembers(data) {
  return request({
    url: 'CrmCustomer/updateMembers',
    method: 'post',
    data: data
  })
}

// 退出团队
export function crmCustomerExitTeam(data) {
  return request({
    url: 'CrmCustomer/exitTeam',
    method: 'post',
    data: data
  })
}

/**
 * 查重
 * @param {*} data
 */
export function crmCustomerQueryListAPI(data) {
  return request({
    url: 'CrmCustomer/queryList',
    method: 'post',
    data: data
  })
}

/**
 * 客户标记跟进
 * @param {*} data
 * id 客户IDs
 */
export function crmCustomerSetFollowAPI(data) {
  return request({
    url: 'CrmBackLog/setCustomerFollowup',
    method: 'post',
    data: data
  })
}

/**
 * 客户成交状态修改
 * @param {*} data
 * id 客户IDs
 */
export function crmCustomerDealStatusAPI(data) {
  return request({
    url: 'CrmCustomer/setDealStatus',
    method: 'post',
    data: data
  })
}

/**
 * 设置首要联系人
 * @param {*} data
 *
 */
export function crmCustomerSetContactsAPI(data) {
  return request({
    url: 'CrmCustomer/setContacts',
    method: 'post',
    data: data
  })
}

/**
 * 数据查重
 * @param {*} data
 *
 */
export function crmCustomerDataCheckAPI(data) {
  return request({
    url: 'CrmCustomer/dataCheck',
    method: 'post',
    data: data
  })
}

/**
 * 附件列表
 * @param {*} data
 *
 */
export function crmCustomerFileListAPI(data) {
  return request({
    url: 'CrmCustomer/queryFileList',
    method: 'post',
    data: data
  })
}

/**
 * tab数量
 * @param {*} data
 *
 */
export function crmCustomerNumAPI(data) {
  return request({
    url: 'CrmCustomer/num',
    method: 'post',
    data: data
  })
}

/**
 * 呼叫中心客服的权限
 * @param {*} data
 * id 客户IDs
 */
export function crmCallCheckAuth(data) {
  return request({
    url: 'call/checkAuth',
    method: 'post',
    data: data
  })
}

/**
 * 客户标星
 * @param {*} data
 *
 */
export function crmCustomerStarAPI(data) {
  return request({
    url: 'CrmCustomer/star',
    method: 'post',
    data: data
  })
}

/**
 * 呼叫中心客服的权限
 * @param {*} data
 * id 客户IDs
 */
export function crmCallSaveAPI(data) {
  return request({
    url: 'call/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 发票信息
 * @param {*} data
 */
export function crmCustomerInvoiceAPI(data) {
  return request({
    url: 'CrmCustomer/queryInvoice',
    method: 'post',
    data: data
  })
}

/**
 * 删除发票信息
 * @param {*} data
 */
export function crmCustomerInvoiceInfoAPI(data) {
  return request({
    url: 'CrmCustomer/queryInvoiceInfo',
    method: 'post',
    data: data
  })
}

/**
 * 通话记录
 * @param {*} data
 */
export function crmCustomerCallRecordAPI(data) {
  return request({
    url: 'CrmCustomer/queryCallRecord',
    method: 'post',
    data: data
  })
}
