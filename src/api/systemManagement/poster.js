import request from '@/utils/request'


// crm 添加图片信息
export function officialImgSaveAPI(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'officialImg/save',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// crm 官网图片删除
export function officialImgDeleteAPI(data) {
  return request({
    url: 'officialImg/delete',
    method: 'post',
    data: data
  })
}

// crm 产品图片删除
export function CrmProductDetailImgDeleteAPI(data) {
  return request({
    url: 'CrmProductDetailImg/delete',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// crm 查看产品图片 CrmProductDetailImg/queryListByType
export function CrmProductDetailImgQueryListByTypeAPI(data) {
  return request({
    url: 'CrmProductDetailImg/queryListByType',
    method: 'post',
    data: data
  })
}

// crm 查看官网图片 visitingCard/queryByUserId 1 是官网 2 是海报
export function officialImgQueryListByTypeAPI(data) {
  return request({
    url: 'officialImg/queryListByType',
    method: 'post',
    data: data
  })
}

// crm 查询个人信息 /wechat/query
export function visitingCardQueryByUserIdAPI(data) {
  return request({
    url: 'visitingCard/queryByUserId',
    method: 'post',
    data: data
  })
}

// crm 微信二维码 visitingCard/setSaveCard
export function wechatQueryAPI(data) {
  return request({
    url: 'wechat/query',
    method: 'post',
    data: data
  })
}

// crm 设为默认展示名片
export function visitingCardSetSaveCardAPI(data) {
  return request({
    url: 'visitingCard/setSaveCard',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// crm 设为关联人员
export function visitingCardRelevanceAPI(data) {
  return request({
    url: 'visitingCard/relevance',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

// crm 接触关联
export function visitingCardRelieveAPI(data) {
  return request({
    url: 'visitingCard/relieve',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

// crm 移出默认展示图片 wechat/preauthcode
export function visitingCardDeleteByUserIdAPI(data) {
  return request({
    url: 'visitingCard/deleteByUserId',
    method: 'post',
    data: data
  })
}

// crm 获取授权 wechat/preauthcode
export function wechatPreauthcodeAPI(data) {
  return request({
    url: 'wechat/preauthcode',
    method: 'post',
    data: data
  })
}

// crm 图片排序
export function officialImgSortImgAPI(data) {
  return request({
    url: 'officialImg/sortImg',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// 查看时候授权小程序
export function visitingCardCheckAuthAPI(data) {
  return request({
    url: 'visitingCard/checkAuth',
    method: 'post',
    data: data
  })
}

// 关联员工列表
export function systemUserMiNiListAPI(data) {
  return request({
    url: 'system/user/queryUserMiNiList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// 获取名片信息
export function visitingCardQueryPcAPI(data) {
  return request({
    url: 'visitingCard/queryPcByUserId',
    method: 'post',
    data: data
  })
}

// 保存名片信息
export function visitingCardSaveAPI(data) {
  return request({
    url: 'visitingCard/savePc',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// 设置员工关联的产品
export function crmProductUserSaveAPI(data) {
  return request({
    url: 'CrmProductUser/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}
