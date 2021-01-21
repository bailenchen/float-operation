
import request from '@/utils/request'

// 学员变更中心
export function crmChangeCenterAPI(data) {
  return request({
    url: 'CrmCustomer/changeDept',
    method: 'post',
    data: data
  })
}

// 校区班主任变更记录
export function crmQueryChangeLogAPI(data) {
  return request({
    url: 'CrmCustomer/selectTearcher',
    method: 'post',
    data: data
  })
}
