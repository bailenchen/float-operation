import request from '@/utils/request'

/**
 * 地图查询接口
 * @param {*} data
 */
export function crmCrmCustomerNearbyCustomerAPI(data) {
  return request({
    url: 'CrmCustomer/nearbyCustomer',
    method: 'post',
    data: data
  })
}
