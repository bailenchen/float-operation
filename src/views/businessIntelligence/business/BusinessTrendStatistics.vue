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
  biBusinessTrendAPI,
  biBusinessTrendListAPI
} from '@/api/businessIntelligence/business'

export default {
  /** 新增商机数与金额趋势分析 */
  name: 'business-trend-statistics',
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
        { field: 'business_name', name: '商机名称' },
        { field: 'customer_name', name: '客户名称' },
        { field: 'type_id_info', name: '商机状态组' },
        { field: 'status_id_info', name: '商机阶段' },
        { field: 'money', name: '商机金额' },
        { field: 'deal_date', name: '预计成交日期' },
        { field: 'owner_user_name', name: '负责人' },
        { field: 'create_time', name: '创建时间' }
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
      biBusinessTrendAPI(params)
        .then(res => {
          this.loading = false
          this.axisList = res.data || []

          let moneyCounts = []
          let numCounts = []
          let xAxis = []
          for (let index = 0; index < this.axisList.length; index++) {
            const element = this.axisList[index]
            moneyCounts.push(element.business_money)
            numCounts.push(element.business_num)
            xAxis.push(element.type)
          }
          this.axisOption.xAxis[0].data = xAxis
          this.axisOption.series[0].data = moneyCounts
          this.axisOption.series[1].data = numCounts
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
      biBusinessTrendListAPI(params)
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
          data: ['新增商机金额', '新增商机数量'],
          bottom: '0px',
          itemWidth: 14
        },
        grid: {
          top: '40px',
          left: '40px',
          right: '40px',
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
            name: '新增商机金额',
            axisTick: {
              alignWithLabel: true,
              lineStyle: { width: 0 }
            },
            axisLabel: {
              color: '#BDBDBD',
              formatter: '{value}万元'
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
            name: '新增商机数量',
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
          }
        ],
        series: [
          {
            name: '新增商机金额',
            type: 'line',
            yAxisIndex: 0,
            data: []
          },
          {
            name: '新增商机数量',
            type: 'line',
            yAxisIndex: 1,
            data: []
          }
        ]
      }

      axisChart.setOption(option, true)
      axisChart.on('click', params => {
        // seriesIndex	1：新增商机金额 2:新增商机数量  dataIndex 具体的哪条数据
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
