<template>
  <div v-loading="loading"
       class="main-container">
    <filtrate-handle-view class="filtrate-bar"
                          @load="loading=true"
                          @change="getDataList">
    </filtrate-handle-view>
    <div class="content">
      <flexbox>
        <flexbox-item>
          <div class="axis-content">
            <div class="axismain"
                 id="allChart"></div>
          </div>
        </flexbox-item>
        <flexbox-item>
          <div class="axis-content">
            <div class="axismain"
                 id="dealChart"></div>
          </div>
        </flexbox-item>
      </flexbox>
      <div class="table-content">
        <el-table :data="list"
                  height="400"
                  stripe
                  border
                  highlight-current-row>
          <el-table-column v-for="(item, index) in fieldList"
                           :key="index"
                           :fixed="index==0?true: false"
                           :min-width="index==0?180: 100"
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
import { biAchievementPortraitAPI } from '@/api/businessIntelligence/customerPortrayal'

export default {
  /** 客户画像分析 */
  name: 'customer-portrayal-statistics',
  data() {
    return {
      loading: false,
      allOption: null,
      dealOption: null,
      allChart: null,
      dealChart: null,

      list: [],
      type: '', // 类型 source：客户来源；industry：客户行业；level：客户级别

      postParams: {},
      fieldList: []
    }
  },
  props: {},
  mixins: [base],
  computed: {},
  created() {
    this.type = this.$route.params.type
  },
  mounted() {
    this.initAxis()
  },
  beforeRouteUpdate (to, from, next) {
    this.type = to.params.type
    this.getDataList(this.postParams)
    next()
  },
  methods: {
    getDataList(params) {
      this.postParams = params
      this.loading = true
      params.type_analyse = this.type
      biAchievementPortraitAPI(params)
        .then(res => {
          this.loading = false

          // 图表信息
          let allData = []
          let dealData = []
          let legendData = []

          // 表信息
          let list = [
            {
              name: '所有客户（个）'
            },
            {
              name: '成交客户（个）'
            }
          ]
          let fieldList = [
            {
              field: 'name',
              name: {
                source: '客户来源',
                industry: '客户行业',
                level: '客户级别'
              }[this.type]
            }
          ]

          for (let eIndex = 0; eIndex < res.data.length; eIndex++) {
            const element = res.data[eIndex]
            // 图表信息
            allData.push({
              name: element[this.type],
              value: element.allCustomer
            })
            dealData.push({
              name: element[this.type],
              value: element.dealCustomer
            })
            legendData.push(element[this.type])

            // 处理表头逻辑
            let fieldKey = 'value' + eIndex
            if (fieldList.length <= res.data.length) {
              fieldList.push({
                field: fieldKey,
                name: element[this.type]
              })
            }
            let keys = ['allCustomer', 'dealCustomer']
            for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
              const keyElement = keys[keyIndex]
              list[keyIndex][fieldKey] = element[keyElement]
            }
          }

          // 图表展示
          this.allOption.legend.data = legendData
          this.dealOption.legend.data = legendData

          this.allOption.series[0].data = allData
          this.dealOption.series[0].data = dealData

          this.allChart.setOption(this.allOption, true)
          this.dealChart.setOption(this.dealOption, true)

          // 列表展示
          this.fieldList = fieldList
          this.list = list
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 柱状图 */
    initAxis() {
      this.allChart = echarts.init(document.getElementById('allChart'))
      this.dealChart = echarts.init(document.getElementById('dealChart'))
      this.allOption = this.getChartOptione('全部客户')
      this.dealOption = this.getChartOptione('成交客户')
      this.allChart.setOption(this.allOption, true)
      this.dealChart.setOption(this.dealOption, true)
    },
    getChartOptione(title) {
      return {
        title: {
          text: title,
          x: 'center',
          bottom: '10'
        },
        color: this.chartColors,
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: []
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
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
  padding: 20px 10% 40px;
  position: relative;
  .axismain {
    margin: 0 auto;
    width: 100%;
    height: 400px;
  }
}

.table-content {
  padding: 0 60px;
}
</style>
