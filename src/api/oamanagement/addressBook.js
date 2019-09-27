import request from '@/utils/request'

// 通讯录列表
export function addresslist(data) {
  return request({
    url: 'system/user/queryListName',
    method: 'post',
    data: data
  })
}

// 通讯录部门列表
export function queryListNameByDept(data) {
  return request({
    url: 'system/user/queryListNameByDept',
    method: 'post',
    data: data
  })
}

// 通讯录关注状态切换
export function toggleAttention(data) {
  return request({
    url: 'system/user/attention',
    method: 'post',
    data: data
  })
}
