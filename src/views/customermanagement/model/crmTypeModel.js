/*
 * @Author: your name
 * @Date: 2020-08-20 10:07:15
 * @LastEditTime: 2020-08-27 16:39:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\views\customermanagement\model\crmTypeModel.js
 */
export default {
  leads: 1,
  customer: 2,
  capitalAccount: 22,
  contacts: 3,
  product: 4,
  productSetMeal: 21,
  business: 5,
  contract: 6,
  receivables: 7,
  receivables_plan: 8,
  pool: 9,
  visit: 17,
  invoice: 18,
  water: 23,
  insideUser: 26,
  receive: 27,
  refundMoney: 29,
  classroom: 30,
  class: 31,

  keyToTypeData: {
    leads: 1,
    customer: 2,
    capitalAccount: 22,
    contacts: 3,
    product: 4,
    productSetMeal: 21,
    business: 5,
    contract: 6,
    receivables: 7,
    receivables_plan: 8,
    pool: 9,
    visit: 17,
    invoice: 18,
    insideUser: 26,
    receive: 27,
    refundMoney: 29,
    classroom: 30,
    class: 31
  },

  typeToKeyData: {
    1: 'leads',
    2: 'customer',
    22: 'capitalAccount',
    3: 'contacts',
    4: 'product',
    21: 'productSetMeal',
    5: 'business',
    6: 'contract',
    7: 'receivables',
    8: 'receivables_plan',
    9: 'pool',
    17: 'visit',
    18: 'invoice',
    26: 'insideUser',
    27: 'receive',
    29: 'refundMoney',
    30: 'classroom',
    31: 'class'
  },

  typeToNameData: {
    // 1: '线索',
    2: 'LEADS',
    22: '资金账户',
    3: '联系人',
    4: '产品',
    21: '课程套餐',
    5: '商机',
    6: '合同',
    7: '回款',
    8: '回款计划',
    9: '公海',
    17: '回访',
    18: '发票',
    26: '内部通讯录',
    27: '合同充值',
    29: '合同充值返还',
    30: '教室管理',
    31: '班级管理'
  },

  keyToNameData: {
    leads: '线索',
    customer: '客户',
    capitalAccount: '资金账户',
    contacts: '联系人',
    product: '产品',
    productSetMeal: '课程套餐',
    business: '商机',
    contract: '合同',
    receivables: '回款',
    receivables_plan: '回款计划',
    pool: '公海',
    visit: '回访',
    invoice: '发票',
    insideUser: '内部通讯录',
    receive: '合同充值',
    refundMoney: '合同充值返还',
    classroom: '教室管理',
    class: '班级管理'
  },

  convertKeyToType: function(key) {
    return this.keyToTypeData[key]
  },

  convertTypeToKey: function(type) {
    return this.typeToKeyData[type]
  },

  convertTypeToName: function(type) {
    if (typeof type === 'string') {
      type = parseInt(type)
    }
    return this.typeToNameData[type]
  },

  convertKeyToName: function(key) {
    return this.keyToNameData[key]
  }
}
