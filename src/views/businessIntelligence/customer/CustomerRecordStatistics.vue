<template>
  <div
    v-loading="loading"
    class="main-container">
    <filtrate-handle-view
      title="客户跟进次数分析"
      class="filtrate-bar"
      module-type="customer"
      @load="loading=true"
      @change="searchClick"/>
    <div class="content">
      <div class="axis-content">
        <div id="axismain"/>
      </div>
      <div class="table-content">
        <el-table
          v-if="showTable"
          :data="list"
          :summary-method="getSummaries"
          height="400"
          show-summary
          stripe
          border
          highlight-current-row
          @sort-change="({ prop, order }) => mixinSortFn(list, prop, order)">
          <el-table-column
            v-for="(item, index) in fieldList"
            :key="index"
            :prop="item.field"
            :label="item.name"
            sortable="custom"
            align="center"
            header-align="center"
            show-overflow-tooltip/>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import base from '../mixins/base'
import sortMixins from '../mixins/sort'
import summaryMixins from '../mixins/summary'
import echarts from 'echarts'
import {
  biCustomerRecordTimesAPI,
  biCustomerRecordListAPI
} from '@/api/businessIntelligence/customer'

export default {
  /** 客户跟进次数分析 */
  name: 'CustomerRecordStatistics',
  mixins: [base, sortMixins, summaryMixins],
  data() {
    return {
      loading: false,
      axisOption: null,

      list: [],

      postParams: {}, // 筛选参数
      axisList: [],
      fieldList: [
        { field: 'realname', name: '员工姓名' },
        { field: 'recordCount', name: '跟进次数' },
        { field: 'customerCount', name: '跟进客户数' }
      ]
    }
  },
  computed: {},
  mounted() {
    this.initAxis()
  },
  methods: {
    /**
     * 搜索点击
     */
    searchClick(params) {
      this.postParams = params
      this.getDataList()
      this.getRecordList()
    },
    /**
     * 图表数据
     */
    getDataList() {
      this.loading = true
      biCustomerRecordTimesAPI(this.postParams)
        .then(res => {
          this.loading = false
          this.axisList = res.data || []

          const customerCounts = []
          const dataCounts = []
          const xAxis = []
          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index]
            customerCounts.push(element.customerCount)
            dataCounts.push(element.recordCount)
            xAxis.push(element.type)
          }
          this.axisOption.xAxis[0].data = xAxis
          this.axisOption.series[0].data = customerCounts
          this.axisOption.series[1].data = dataCounts
          this.chartObj.setOption(this.axisOption, true)
        })
        .catch(() => {
          this.loading = false
        })
    },
    /**
     * 获取相关列表
     */
    getRecordList(dataIndex) {
      this.list = []

      const params = this.postParams

      if (typeof dataIndex !== 'undefined') {
        const dataItem = this.axisList[dataIndex]
        params.startTime = dataItem.startTime
        params.endTime = dataItem.endTime
      }

      this.loading = true
      biCustomerRecordListAPI(params)
        .then(res => {
          this.loading = false
          const data = res.data || {}
          this.list = data.list || []
          this.getSummariesData(data.total)
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 柱状图 */
    initAxis() {
      var chartObj = echarts.init(document.getElementById('axismain'))

      var option = {
        color: ['#6ca2ff', '#ff7474'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['跟进客户数', '跟进次数'],
          bottom: '0px',
          itemWidth: 14
        },
        grid: {
          top: '40px',
          left: '30px',
          right: '30px',
          bottom: '40px',
          containLabel: true,
          borderColor: '#fff'
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
              lineStyle: { color: '#333' }
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '跟进客户数',
            axisTick: {
              alignWithLabel: true,
              lineStyle: { width: 0 }
            },
            axisLabel: {
              color: '#333',
              formatter: '{value}个'
            },
            /** 坐标轴轴线相关设置 */
            axisLine: {
              lineStyle: { color: '#333' }
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: '跟进次数',
            axisTick: {
              alignWithLabel: true,
              lineStyle: { width: 0 }
            },
            axisLabel: {
              color: '#333',
              formatter: '{value}次'
            },
            /** 坐标轴轴线相关设置 */
            axisLine: {
              lineStyle: { color: '#333' }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '跟进客户数',
            type: 'bar',
            yAxisIndex: 0,
            barWidth: 15,
            data: []
          },
          {
            name: '跟进次数',
            type: 'bar',
            yAxisIndex: 1,
            barWidth: 15,
            data: []
          }
        ]
      }

      chartObj.setOption(option, true)
      chartObj.on('click', params => {
        // seriesIndex	1：跟进客户数 2:跟进次数  dataIndex 具体的哪条数据
        this.getRecordList(params.dataIndex)
      })
      this.axisOption = option
      this.chartObj = chartObj
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../styles/detail.scss';
</style>
