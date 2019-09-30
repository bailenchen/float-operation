<template>
  <div class="sale-statistics card">
    <flexbox class="card-title">
      <div class="card-title-left">
        <span class="icon wk wk-target" />
        <span class="text">销售目标</span>
      </div>
      <div class="card-title-right">
        <span class="box">{{ userInfo.username }}</span>
        <span class="box">本月</span>
      </div>
    </flexbox>
    <div class="card-desc">
      近一年的销售目标完成情况柱状图
    </div>
    <div id="sale-statistics" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'

export default {
  name: 'SaleStatistics',
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
          top: '5px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          containLabel: true,
          borderColor: '#fff'
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
              color: '#BDBDBD'
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
            axisLabel: {
              color: '#BDBDBD'
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
            name: '合同金额',
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
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chartObj = echarts.init(document.getElementById('sale-statistics'))
      this.chartObj.setOption(this.chartOption, true)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "style";
  #sale-statistics {
    width: 100%;
    height: 300px;
  }
</style>
