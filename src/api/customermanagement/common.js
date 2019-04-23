import request from '@/utils/request'

// crm 自定义字段的添加
/**
 *
 * @param {*} data
 * 操作方法 (save:添加、update:编辑、read:详情、index:列表)
 * 操作ID (如：客户ID)
 */
export function filedGetField(data) {
  return request({
    url: 'field/queryField',
    method: 'post',
    data: data
  })
}

/**
 * 详情页基本信息
 * @param {*} data 
 */
export function filedGetInformation(data) {
  return request({
    url: 'field/information',
    method: 'post',
    data: data
  })
}


/**
 * java 不使用filedGetField 
 * @param {*} data 
 */
export function filedGetTableField(data) {
  return request({
    url: 'field/queryListHead',
    method: 'post',
    data: data
  })
}

// crm 自定义字段验重
export function filedValidates(data) {
  return request({
    url: 'field/verify',
    method: 'post',
    data: data
  })
}

// crm 自定义字段(高级筛选)
export function filterIndexfields(data) {
  return request({
    url: 'scene/queryField',
    method: 'post',
    data: data
  })
}

// 商机状态组列表 systemCustomer.js 也包含该接口
export function businessGroupList(data) {
  return request({
    url: 'businessType/queryBusinessTypeList',
    method: 'post',
    data: data
  })
}
// 场景列表
export function crmSceneIndex(data) {
  return request({
    url: 'scene/queryScene',
    method: 'post',
    data: data
  })
}
// 场景设置列表
export function crmSceneSetIndex(data) {
  return request({
    url: 'scene/querySceneConfig',
    method: 'post',
    data: data
  })
}

// 场景创建
export function crmSceneSave(data) {
  return request({
    url: 'scene/addScene',
    method: 'post',
    data: data
  })
}

// 场景编辑
export function crmSceneUpdate(data) {
  return request({
    url: 'scene/updateScene',
    method: 'post',
    data: data
  })
}

// 场景默认
export function crmSceneDefaults(data) {
  return request({
    url: 'scene/setDefaultScene',
    method: 'post',
    data: data
  })
}

// 场景详情
export function crmSceneRead(data) {
  return request({
    url: 'admin/scene/read',
    method: 'post',
    data: data
  })
}

// 场景删除
export function crmSceneDelete(data) {
  return request({
    url: 'scene/deleteScene',
    method: 'post',
    data: data
  })
}

// 场景排序
export function crmSceneSort(data) {
  return request({
    url: 'scene/sceneConfig',
    method: 'post',
    data: data
  })
}

// 列表字段排序数据
export function crmFieldConfigIndex(data) {
  return request({
    url: 'field/queryFieldConfig',
    method: 'post',
    data: data
  })
}

// 列表排序编辑
export function crmFieldConfig(data) {
  return request({
    url: 'field/fieldConfig',
    method: 'post',
    data: data
  })
}

// 列表宽度设置
export function crmFieldColumnWidth(data) {
  return request({
    url: 'field/setFelidStyle',
    method: 'post',
    data: data
  })
}

// 跟进记录列表
export function crmRecordIndex(data) {
  return request({
    url: 'admin/record/index',
    method: 'post',
    data: data
  })
}

// 跟进记录添加
export function crmRecordSave(data) {
  return request({
    url: 'admin/record/save',
    method: 'post',
    data: data
  })
}

// 操作记录
export function crmIndexFieldRecord(data) {
  return request({
    url: 'CrmRecord/queryRecordList',
    method: 'post',
    data: data
  })
}

// 客户管理下 合同审批信息 新建
export function crmExamineFlowStepList(data) {
  return request({
    url: 'examineRecord/queryExamineRecordList',
    method: 'post',
    data: data
  })
}

// CRM合同回款创建时候的审批流
export function crmCreateExamineFlow(data) {
  return request({
    url: 'examine/queryExaminStep',
    method: 'post',
    data: data
  })
}

/**
 * 审批记录
 * @param {*} data
 * types
 * types_id
 */
export function crmExamineFlowRecordList(data) {
  return request({
    url: 'examineRecord/queryExamineLogList',
    method: 'post',
    data: data
  })
}

// 审核合同或者回款
export function crmExamineFlowAuditExamine(data) {
  return request({
    url: 'examineRecord/auditExamine',
    method: 'post',
    data: data
  })
}

/**
 * 合同审批人信息
 * @param {*} data
 * types crm_contract
 */
export function crmExamineFlowUserList(data) {
  return request({
    url: 'admin/examineFlow/userList',
    method: 'post',
    data: data
  })
}

/**
 * 相关团队列表
 * @param {*} data
 * types crm_leads
 * types_id 分类ID
 */
export function crmSettingTeam(data) {
  return request({
    url: 'crm/setting/team',
    method: 'post',
    data: data
  })
}

/**
 * 相关团队创建
 * @param {*} data
 * types crm_leads
 * types_id 分类ID
 */
export function crmSettingTeamSave(data) {
  return request({
    url: 'CrmCustomer/addMembers',
    method: 'post',
    data: data
  })
}

/**
 * 相关团队列表
 * @param {*} data
 * types crm_leads
 * types_id 分类ID
 */
export function crmMainIndex(data) {
  return request({
    url: 'scene/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
