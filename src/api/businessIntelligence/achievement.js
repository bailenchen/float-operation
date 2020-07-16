import request from '@/utils/request'

/**
 * 合同数量分析/金额分析/回款金额分析
 * count：合同数量分析；money：金额分析；back：回款金额分析
 */
export function biAchievementAnalysisAPI(data) {
  if (data.type === 'count') {
    return request({
      url: 'biEmployee/contractNumStats',
      method: 'post',
      data: data
    })
  } else if (data.type === 'money') {
    return request({
      url: 'biEmployee/contractMoneyStats',
      method: 'post',
      data: data
    })
  } else if (data.type === 'back') {
    return request({
      url: 'biEmployee/receivablesMoneyStats',
      method: 'post',
      data: data
    })
  }
}

export function biAchievementAnalysisExportAPI(data) {
  if (data.type === 'count') {
    return request({
      url: 'biEmployee/contractNumStatsExport',
      method: 'post',
      data: data,
      responseType: 'blob'
    })
  } else if (data.type === 'money') {
    return request({
      url: 'biEmployee/contractMoneyStatsExport',
      method: 'post',
      data: data,
      responseType: 'blob'
    })
  } else if (data.type === 'back') {
    return request({
      url: 'biEmployee/receivablesMoneyStatsExport',
      method: 'post',
      data: data,
      responseType: 'blob'
    })
  }
}

/**
 * 合同汇总表
 * @param {*} data
 */
export function biAchievementSummaryAPI(data) {
  return request({
    url: 'biEmployee/totalContract',
    method: 'post',
    data: data
  })
}

export function biAchievementSummaryExportAPI(data) {
  return request({
    url: 'biEmployee/totalContractExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
