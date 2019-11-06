
<template>
  <div
    v-loading="loading"
    class="main-container">
    <filtrate-handle-view
      title="客户总量分析"
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
          height="400"
          stripe
          border
          highlight-current-row
          @sort-change="({ prop, order }) => mixinSortFn(list, prop, order)">
          <el-table-column
            v-for="(item, index) in fieldList"
            :key="index"
            :prop="item.field"
            :label="item.name"
            min-width="130"
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
import echarts from 'echarts'
import {
  biCustomerTotalListAPI,
  biCustomerTotalAPI
} from '@/api/businessIntelligence/customer'

export default {
  /** 客户总量分析 */
  name: 'CustomerTotalStatistics',
  mixins: [base, sortMixins],
  data() {
    return {
      loading: false,

      axisOption: null,
      axisChart: null,

      postParams: {}, // 筛选参数
      list: [],
      axisList: [],
      fieldList: [
        { field: 'realname', name: '员工姓名', sortable: true },
        { field: 'customerNum', name: '新增客户数', sortable: true },
        { field: 'dealCustomerNum', name: '成交客户数', sortable: true },
        { field: 'dealCustomerRate', name: '客户成交率(%)', sortable: true },
        { field: 'contractMoney', name: '合同总金额', sortable: true },
        { field: 'receivablesMoney', name: '回款金额', sortable: true }
        // { field: 'unreceivedMoney', name: '未回款金额', sortable: true },
        // { field: 'completedRate', name: '回款完成率(%)', sortable: true }
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
      biCustomerTotalAPI(this.postParams)
        .then(res => {
          this.loading = false
          const list = res.data || []
          this.axisList = list
          const dealData = []
          const numData = []
          const legendData = []
          for (let index = 0; index < list.length; index++) {
            const element = list[index]
            dealData.push(element.dealCustomerNum)
            numData.push(element.customerNum)
            legendData.push(element.type)
          }

          this.axisOption.xAxis[0].data = legendData
          this.axisOption.series[0].data = dealData
          this.axisOption.series[1].data = numData

          this.axisChart.setOption(this.axisOption, true)
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
      biCustomerTotalListAPI(params)
        .then(res => {
          this.loading = false
          this.list = res.data || []
          // for (let index = 0; index < this.list.length; index++) {
          //   const element = this.list[index]
          //   if (element.unreceivedMoney < 0) {
          //     element.unreceivedMoney = 0
          //   }
          // }
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 柱状图 */
    initAxis() {
      this.axisChart = echarts.init(document.getElementById('axismain'))
      this.axisChart.on('click', params => {
        // seriesIndex	1：跟进客户数 2:跟进次数  dataIndex 具体的哪条数据
        this.getRecordList(params.dataIndex)
      })

      this.axisOption = {
        color: ['#6ca2ff', '#ff7474'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['成交客户数', '新增客户数'],
          bottom: '0px',
          itemWidth: 14
        },
        grid: {
          top: '40px',
          left: '20px',
          right: '20px',
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
            name: '新增客户数',
            axisTick: {
              alignWithLabel: true,
              lineStyle: { width: 0 }
            },
            axisLabel: {
              color: '#333',
              formatter: '{value} 个'
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
            name: '成交客户数',
            type: 'bar',
            yAxisIndex: 0,
            barWidth: 15,
            data: []
          },
          {
            name: '新增客户数',
            type: 'bar',
            yAxisIndex: 0,
            barWidth: 15,
            data: []
          }
        ]
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../styles/detail.scss';
</style>

