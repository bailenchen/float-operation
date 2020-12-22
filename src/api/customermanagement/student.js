
import request from '@/utils/request'

// 学员变更中心
export function crmChangeCenterAPI(data) {
  return request({
    url: 'CrmCustomer/changeDept',
    method: 'post',
    data: data
  })
}
