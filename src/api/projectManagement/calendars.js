import request from '@/utils/request'

/**
 * 归档项目列表
 * @param {*} data
 */
export function workTaskDateListAPI(data) {
    return request({
        url: 'work/task/dateList',
        method: 'post',
        data: data
    })
}
