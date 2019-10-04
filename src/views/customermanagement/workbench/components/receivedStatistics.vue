<template>
  <div class="received-statistics card">
    <flexbox class="card-title">
      <div class="card-title-left">
        <span class="icon wk wk-icon-receivable" />
        <span class="text">回款金额目标及完成情况</span>
      </div>
      <!--<div class="card-title-right">
        <span class="box">{{ filterText }}</span>
        <span class="box">{{ timeLine }}</span>
      </div>-->
    </flexbox>
    <div class="card-desc">
      近一年的的回款目标完成情况柱状图
    </div>
    <div id="received-statistics" />
  </div>
</template>

<script>
import echarts from 'echarts'
import chartMixins from './chartMixins'
import { crmIndexSaletrend } from '@/api/customermanagement/workbench'

export default {
  name: 'ReceivedStatistics',
  mixins: [chartMixins],
  data() {
    return {
      chartOption: {
        color: ['#6ca2ff', '#ff7474'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '46px',
          left: '20px',
          right: '20px',
          bottom: '10px',
          containLabel: true,
          borderColor: '#fff'
        },
        legend: {
          right: '20px',
          data: ['目标金额', '回款回款金额']
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true,
              lineStyle: { width: 0 }
            },
            axisLabel: {
              color: '#333'
            },
            /** 坐标轴轴线相关设置 */
            axisLine: {
              lineStyle: { color: '#BDBDBD' }
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              alignWithLabel: true,
              lineStyle: { width: 0 }
            },
            /** 坐标轴轴线相关设置 */
            axisLine: {
              lineStyle: { width: 0 }
            },
            splitLine: {
              lineStyle: {
                color: '#eee',
                type: 'dotted'
              }
            }
          }
        ],
        series: [
          {
            name: '目标回款金额',
            type: 'bar',
            stack: 'one',
            barWidth: 25,
            barGap: '0',
            data: []
          },
          {
            name: '回款金额',
            type: 'bar',
            stack: 'two',
            barWidth: 25,
            barGap: '0%',
            data: []
          }
        ]
      },
      chartObj: null
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chartObj = echarts.init(document.getElementById('received-statistics'))
      this.chartObj.setOption(this.chartOption, true)
    },
    getData() {
      this.loading = true
      crmIndexSaletrend({
        label: 2,
        ...this.getBaseParams()
      }).then(res => {
        // this.trendData = {
        //   totlaContractMoney: res.data.totlaContractMoney,
        //   totlaReceivablesMoney: res.data.totlaReceivablesMoney
        // }

        const list = res.data.list || []
        const contractList = []
        const receivablesList = []
        const xAxisData = []
        for (let index = 0; index < list.length; index++) {
          const element = list[index]
          contractList.push(element.achievement)
          receivablesList.push(element.money)
          xAxisData.push(element.type)
        }
        this.chartOption.xAxis[0].data = xAxisData
        this.chartOption.series[0].data = contractList
        this.chartOption.series[1].data = receivablesList

        this.chartObj.setOption(this.chartOption, true)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "style";
  #received-statistics {
    width: 100%;
    height: 300px;
  }

  .card-title-left .icon {
    color: #FFD144;
  }
</style>
