import request from '@/utils/request'


// crm 添加图片信息
export function officialImgSaveAPI(data) {
  return request({
    url: 'officialImg/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
