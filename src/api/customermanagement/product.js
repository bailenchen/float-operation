import request from '@/utils/request'

// crm 新建产品
export function crmProductSave(data) {
  return request({
    url: 'CrmProduct/saveAndUpdate',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// crm 列表
export function crmProductIndex(data) {
  return request({
    url: 'CrmProduct/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 产品上架列表
export function crmProductSaleIndexAPI(data) {
  return request({
    url: 'CrmProduct/querySaleProductPageList ',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// crm 详情
export function crmProductRead(data) {
  return request({
    url: 'CrmProduct/queryById',
    method: 'post',
    data: data
  })
}

/**
 * 产品上架、下架
 * @param {*} data
 */
export function crmProductStatus(data) {
  return request({
    url: 'CrmProduct/updateStatus',
    method: 'post',
    data: data
  })
}


/**
 * 产品导出
 * @param {*} data
 * product_id 产品ID
 */
export function crmProductExcelExport(data) {
  return request({
    url: 'CrmProduct/batchExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

export function crmProductExcelAllExport(data) {
  return request({
    url: 'CrmProduct/allExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 产品导入
 * @param {*} data
 *
 */
export function crmProductExcelImport(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'CrmProduct/uploadExcel',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 产品导入模板下载
 * @param {*} data
 *
 */
export const crmProductExcelDownloadURL = process.env.BASE_API + 'CrmProduct/downloadExcel'
export function crmProductDownloadExcelAPI(data) {
  return request({
    url: 'CrmProduct/downloadExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 附件列表
 * @param {*} data
 *
 */
export function crmProductFileListAPI(data) {
  return request({
    url: 'CrmProduct/queryFileList',
    method: 'post',
    data: data
  })
}

/**
 * tab数量
 * @param {*} data
 *
 */
export function crmProductNumAPI(data) {
  return request({
    url: 'CrmProduct/num',
    method: 'post',
    data: data
  })
}
/**
 * 详情图添加
 * @param {*} data
 *
 */
export function CrmProductDetailImgSave(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'CrmProductDetailImg/save',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
/**
 * 查询官网图片 CrmProductDetailImg/queryListByType
 * @param {*} data
 *
 */
export function CrmProductDetailImgQueryListByType(data) {
  return request({
    url: 'CrmProductDetailImg/queryListByType',
    method: 'post',
    data: data
  })
}
/**
 * 删除产品图片
 * @param {*} data
 *
 */
export function CrmProductDetailImgDelete(data) {
  return request({
    url: 'CrmProductDetailImg/delete',
    method: 'post',
    data: data
  })
}
/**
 * 产品简介添加
 * @param {*} data
 *
 */
export function CrmProductDetailImgSaveImg(data) {
  return request({
    url: 'CrmProductDetailImg/saveImg',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
}
