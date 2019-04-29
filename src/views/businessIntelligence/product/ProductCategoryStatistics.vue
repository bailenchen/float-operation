<template>
  <div v-loading="loading"
       class="main-container">
    <filtrate-handle-view class="filtrate-bar"
                          :showProductSelct="true"
                          @load="loading=true"
                          @change="getDataList">
    </filtrate-handle-view>
    <div class="content">
      <div class="axis-content">
        <div id="axismain"></div>
      </div>
    </div>
  </div>
</template>

<script>
import base from '../mixins/base'
import echarts from 'echarts'
import { biProductCategoryAPI } from '@/api/businessIntelligence/product'

export default {
  /** 产品分类销量分析 */
  name: 'product-category-statistics',
  data() {
    return {
      loading: false,
      axisOption: null,
      axisChart: null
    }
  },
  mixins: [base],
  computed: {},
  mounted() {
    this.initAxis()
  },
  methods: {
    getDataList(params) {
      this.loading = true
      biProductCategoryAPI(params)
        .then(res => {
          this.loading = false

          let numCounts = []
          let legendData = []
          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index]
            numCounts.push({ name: element.product_name, value: element.num })
            legendData.push(element.product_name)
          }
          this.axisOption.legend.data = legendData
          this.axisOption.series[0].data = numCounts
          this.axisChart.setOption(this.axisOption, true)
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 柱状图 */
    initAxis() {
      var axisChart = echarts.init(document.getElementById('axismain'))

      var option = {
        title: {
          text: '产品分类销售',
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

      axisChart.setOption(option, true)
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
</style>
