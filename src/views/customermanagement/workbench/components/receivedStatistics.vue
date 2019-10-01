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
          data: ['目标金额', '回款金额']
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '2019-01',
              '2019-02',
              '2019-03',
              '2019-04',
              '2019-05',
              '2019-06',
              '2019-07',
              '2019-08'
            ],
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
            name: '目标金额',
            type: 'bar',
            stack: 'one',
            barWidth: 25,
            barGap: '0',
            data: [1000, 1570, 3589, 2578, 5744, 4145, 2457, 554]
          },
          {
            name: '回款金额',
            type: 'bar',
            stack: 'two',
            barWidth: 25,
            barGap: '0%',
            data: [258, 14255, 4558, 5274, 2545, 2547, 5745, 7565]
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
      // let params = this.getBaseParams()
      // TODO 回款统计数据获取、渲染
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
