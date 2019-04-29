<template>
  <div v-loading="loading"
       class="main-container">
    <filtrate-handle-view class="filtrate-bar"
                          @load="loading=true"
                          @change="getDataList">
    </filtrate-handle-view>
    <div class="content">
      <div class="axis-content">
        <div id="axismain"></div>
      </div>
      <div class="table-content" v-if="showTable">
        <el-table :data="list"
                  height="400"
                  stripe
                  border
                  highlight-current-row>
          <el-table-column v-for="(item, index) in fieldList"
                           :key="index"
                           align="center"
                           header-align="center"
                           show-overflow-tooltip
                           :prop="item.field"
                           :label="item.name">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import base from '../mixins/base'
import echarts from 'echarts'
import {
  biCustomerPoolAPI,
  biCustomerPoolListAPI
} from '@/api/businessIntelligence/customer'

export default {
  /** 公海客户分析 */
  name: 'customer-pool-statistics',
  data() {
    return {
      loading: false,
      axisOption: null,
      axisChart: null,

      showTable: false,
      list: [],

      postParams: {}, // 筛选参数
      axisList: [],
      fieldList: [
        { field: 'realname', name: '姓名' },
        { field: 'username', name: '部门' },
        { field: 'receive', name: '公海池领取客户数' },
        { field: 'put_in', name: '进入公海客户数' },
        { field: 'customer_num', name: '客户总数' }
      ]
    }
  },
  mixins: [base],
  computed: {},
  mounted() {
    this.initAxis()
  },
  methods: {
    getDataList(params) {
      this.showTable = false

      this.postParams = params
      this.loading = true
      biCustomerPoolAPI(params)
        .then(res => {
          this.loading = false
          this.axisList = res.data || []

          let putCounts = []
          let receiveCounts = []
          let xAxis = []
          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index]
            putCounts.push(element.put_in)
            receiveCounts.push(element.receive)
            xAxis.push(element.type)
          }
          this.axisOption.xAxis[0].data = xAxis
          this.axisOption.series[0].data = putCounts
          this.axisOption.series[1].data = receiveCounts
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
      this.showTable = true

      let params = {
        user_id: this.postParams.user_id,
        structure_id: this.postParams.structure_id
      }

      let dataItem = this.axisList[dataIndex]
      params.start_time = dataItem.start_time
      params.end_time = dataItem.end_time

      this.loading = true
      biCustomerPoolListAPI(params)
        .then(res => {
          this.loading = false
          this.list = res.data
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 柱状图 */
    initAxis() {
      var axisChart = echarts.init(document.getElementById('axismain'))

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
          data: ['进入公海客户数', '公海池领取客户数'],
          bottom: '0px',
          itemWidth: 14
        },
        grid: {
          top: '40px',
          left: '30px',
          right: '50px',
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
            name: '进入公海客户数',
            axisTick: {
              alignWithLabel: true,
              lineStyle: { width: 0 }
            },
            axisLabel: {
              color: '#BDBDBD',
              formatter: '{value}个'
            },
            /** 坐标轴轴线相关设置 */
            axisLine: {
              lineStyle: { color: '#BDBDBD' }
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: '公海池领取客户数',
            axisTick: {
              alignWithLabel: true,
              lineStyle: { width: 0 }
            },
            axisLabel: {
              color: '#BDBDBD',
              formatter: '{value}次'
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
        series: [
          {
            name: '进入公海客户数',
            type: 'bar',
            yAxisIndex: 0,
            data: []
          },
          {
            name: '公海池领取客户数',
            type: 'bar',
            yAxisIndex: 1,
            data: []
          }
        ]
      }

      axisChart.setOption(option, true)
      axisChart.on('click', params => {
        // seriesIndex	1：进入公海客户数 2:公海池领取客户数  dataIndex 具体的哪条数据
        this.getRecordList(params.dataIndex)
      })
      this.axisOption = option
      this.axisChart = axisChart
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../styles/detail.scss';

.main-container {
  height: 100%;
  position: relative;
}

.filtrate-bar {
  position: absolute;
  background-color: white;
  z-index: 2;
  left: 0;
  right: 0;
  top: 0;
  padding: 15px 20px 5px 20px;
  margin-right: 15px;
}

.content {
  padding-top: 54px;
  overflow-y: auto;
}

.axis-content {
  padding: 20px 20% 40px;
  position: relative;
  #axismain {
    margin: 0 auto;
    width: 100%;
    height: 400px;
  }
}

.table-content {
  padding: 0 60px;
}
</style>
