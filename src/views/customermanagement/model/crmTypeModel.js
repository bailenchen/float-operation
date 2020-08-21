/*
 * @Author: your name
 * @Date: 2020-08-20 10:07:15
 * @LastEditTime: 2020-08-20 13:40:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\views\customermanagement\model\crmTypeModel.js
 */
export default {
  leads: 1,
  customer: 2,
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

  keyToTypeData: {
    leads: 1,
    customer: 2,
    contacts: 3,
    product: 4,
    productSetMeal: 21,
    business: 5,
    contract: 6,
    receivables: 7,
    receivables_plan: 8,
    pool: 9,
    visit: 17,
    invoice: 18
  },

  typeToKeyData: {
    1: 'leads',
    2: 'customer',
    3: 'contacts',
    4: 'product',
    21: 'productSetMeal',
    5: 'business',
    6: 'contract',
    7: 'receivables',
    8: 'receivables_plan',
    9: 'pool',
    17: 'visit',
    18: 'invoice'
  },

  typeToNameData: {
    1: '线索',
    2: '客户',
    3: '联系人',
    4: '产品',
    21: '课程套餐',
    5: '商机',
    6: '合同',
    7: '回款',
    8: '回款计划',
    9: '公海',
    17: '回访',
    18: '发票'
  },

  keyToNameData: {
    leads: '线索',
    customer: '客户',
    contacts: '联系人',
    product: '产品',
    productSetMeal: '课程套餐',
    business: '商机',
    contract: '合同',
    receivables: '回款',
    receivables_plan: '回款计划',
    pool: '公海',
    visit: '回访',
    invoice: '发票'
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
