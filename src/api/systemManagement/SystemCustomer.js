import request from '@/utils/request'

export function businessGroupList(data) {
  return request({
    url: 'businessType/queryBusinessTypeList',
    method: 'post',
    data: data
  })
}

export function businessGroupAdd(data) {
  return request({
    url: 'businessType/setBusinessType',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// 商机状态组状态修改
export function businessGroupUpdateStatusAPI(data) {
  return request({
    url: 'businessType/updateStatus',
    method: 'post',
    data: data
  })
}

/** 商机状态组详情 */
export function businessGroupRead(data) {
  return request({
    url: 'businessType/getBusinessType',
    method: 'post',
    data: data
  })
}

// 商机状态组编辑
export function businessGroupUpdate(data) {
  return request({
    url: 'businessType/setBusinessType',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/** 商机状态组删除 */
export function businessGroupDelete(data) {
  return request({
    url: 'businessType/deleteById',
    method: 'post',
    data: data
  })
}

/** 自定义字段（字段数据）的添加编辑操作 */
export function customFieldHandle(data) {
  return request({
    url: 'field/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/** 自定义字段（字段数据）的详情 */
export function customFieldList(data) {
  return request({
    url: 'field/list',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function oaFieldHandle(data) {
  return request({
    url: 'field/examineFieldSave',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/** 自定义字段（字段数据）的列表更新时间 */
export function customFieldIndex(data) {
  return request({
    url: 'field/queryFields',
    method: 'post',
    data: data
  })
}

/** 产品类别 数据获取 */
export function productCategoryIndex(data) {
  return request({
    url: 'CrmProductCategory/queryList',
    method: 'post',
    data: data
  })
}

/** 产品分类添加*/
export function productCategorySave(data) {
  return request({
    url: 'CrmProductCategory/saveAndUpdate',
    method: 'post',
    data: data
  })
}

/** 产品分类删除*/
export function productCategoryDelete(data) {
  return request({
    url: 'CrmProductCategory/deleteById',
    method: 'post',
    data: data
  })
}

/** 客户保护规则*/
export function crmSettingConfig(data) {
  return request({
    url: 'CrmCustomer/updateRulesSetting',
    method: 'post',
    data: data
  })
}

/** 客户保护规则*/
export function crmSettingConfigData(data) {
  return request({
    url: 'CrmCustomer/getRulesSetting',
    method: 'post',
    data: data
  })
}

/**
 * 部门业绩目标列表
 * @param {*} data
 */
export function crmAchievementIndex(data) {
  return request({
    url: 'achievement/queryAchievementList',
    method: 'post',
    data: data
  })
}

/**
 * 业绩目标编辑接口
 * @param {*} data
 */
export function crmAchievementUpdate(data) {
  return request({
    url: 'achievement/setAchievement',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}


/**
 * 新增业绩目标
 * @param {*} data
 */
export function crmAchievementAdd(data) {
  return request({
    url: 'achievement/addAchievement',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}


/**
 * 删除业绩目标
 * @param {*} data
 */
export function crmAchievementDelete(data) {
  return request({
    url: 'achievement/deleteAchievement',
    method: 'post',
    data: data
  })
}

/**
 * 记录类型 数据
 * @param {*} data
 */
export function crmSettingRecordListAPI(data) {
  return request({
    url: 'CrmRecord/queryRecordOptions',
    method: 'post',
    data: data
  })
}

/**
 * 记录类型 编辑
 * @param {*} data
 */
export function crmSettingRecordEditAPI(data) {
  return request({
    url: 'CrmRecord/setRecordOptions',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 合同到期提醒 设置
 * @param {*} data
 */
export function crmSettingContractDayAPI(data) {
  return request({
    url: 'CrmContract/setContractConfig',
    method: 'post',
    data: data
  })
}

/**
 * 拥有、锁定客户数限制
 * @param {*} data
 */
export function crmSettingCustomerConfigListAPI(data) {
  return request({
    url: 'CrmCustomer/queryCustomerSetting',
    method: 'post',
    data: data
  })
}

/**
 * 拥有、锁定客户数限制 - 创建 编辑
 * @param {*} data
 */
export function crmSettingCustomerConfigSetAPI(data) {
  return request({
    url: 'CrmCustomer/customerSetting',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 拥有、锁定客户数限制 - 删除
 * @param {*} data
 */
export function crmSettingCustomerConfigDelAPI(data) {
  return request({
    url: 'CrmCustomer/deleteCustomerSetting',
    method: 'post',
    data: data
  })
}

/**
 * 客户回访查询
 * @param {*} data
 */
export function returnVisitConfigQueryAPI(data) {
  return request({
    url: 'CrmReturnVisit/queryReturnVisitRemindConfig',
    method: 'post',
    data: data
  })
}

/**
 * 客户回访设置
 * @param {*} data
 */
export function returnVisitConfigSetAPI(data) {
  return request({
    url: 'CrmReturnVisit/updateReturnVisitRemindConfig',
    method: 'post',
    data: data
  })
}

/**
 * 编号查询
 * @param {*} data
 */
export function sysConfigNumberQueryAPI(data) {
  return request({
    url: 'sysConfig/queryNumberSetting',
    method: 'post',
    data: data
  })
}

/**
 * 编号设置
 * @param {*} data
 */
export function sysConfigNumberSetAPI(data) {
  return request({
    url: 'sysConfig/setNumberSetting',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 列表字段排序 查询
 * @param {*} data
 */
export function sysConfigFieldListQueryAPI(data) {
  return request({
    url: 'field/queryCrmListHead',
    method: 'post',
    data: data
  })
}

/**
 * 数据字典列表 查询
 * @param {*} data
 */
export function sysConfigDataDictaryListQueryAPI(data) {
  return request({
    url: 'adminDictionary/queryPage',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 数据字典列表 保存
 * @param {*} data
 */
export function sysConfigDataDictarySaveAPI(data) {
  return request({
    url: 'adminDictionary/saveOrUpdate',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 个人账户认证 保存
 * @param {*} data
 */
export function sysConfigDataPersonAccountSaveAPI(data) {
  return request({
    url: 'adminAuthenticationUser/saveOne',
    method: 'post',
    data: data
  })
}

/**
 * 个人账户认证 查询
 * @param {*} data
 */
export function sysConfigDataPersonAccountQueryAPI(data) {
  return request({
    url: 'adminAuthenticationUser/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 个人账户认证 删除
 * @param {*} data
 */
export function sysConfigDataPersonAccountDeleteAPI(data) {
  return request({
    url: 'adminAuthenticationUser/deleteOne',
    method: 'post',
    data: data
  })
}

/**
 * 个人账户认证 认证
 * @param {*} data
 */
export function sysConfigDataPersonAccountAuthAPI(data) {
  return request({
    url: 'adminAuthenticationUser/authenticationOne',
    method: 'post',
    data: data
  })
}

/**
 * 机构认证 保存
 * @param {*} data
 */
export function sysConfigDataPersonOrgSaveAPI(data) {
  return request({
    url: 'adminAuthenticationUser/saveOne',
    method: 'post',
    data: data
  })
}

/**
 * 机构认证 查询
 * @param {*} data
 */
export function sysConfigDataPersonOrgQueryAPI(data) {
  return request({
    url: 'adminAuthenticationMechanism/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 机构认证 删除
 * @param {*} data
 */
export function sysConfigDataPersonOrgDeleteAPI(data) {
  return request({
    url: 'adminAuthenticationUser/deleteOne',
    method: 'post',
    data: data
  })
}

/**
 * 机构认证 认证
 * @param {*} data
 */
export function sysConfigDataPersonOrgAuthAPI(data) {
  return request({
    url: 'adminAuthenticationUser/authenticationOne',
    method: 'post',
    data: data
  })
}
