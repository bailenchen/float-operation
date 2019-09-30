<template>
  <div
    v-loading="loading"
    class="sales-funnel card">
    <flexbox class="card-title">
      <div class="card-title-left">
        <span class="icon wk wk-funnel" />
        <span class="text">销售漏斗</span>
      </div>
      <div class="card-title-right">
        <span class="box">{{ userInfo.username }}</span>
        <span class="box">本月</span>
      </div>
    </flexbox>
    <div id="sales-funnel" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import {
  crmIndexFunnel
} from '@/api/customermanagement/workbench'
export default {
  name: 'SalesFunnel',
  data() {
    return {
      chartOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/> 预测金额: {c}元'
        },
        calculable: true,
        legend: {
          data: [],
          // 图例文本格式化
          formatter: function(name) {
            return name.split('(')[0]
          }
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 0
        },
        series: [
          {
            type: 'funnel',
            /** 数据排序 */
            sort: 'none',
            /** 数据图形间距。 */
            gap: 2,
            min: 0,
            max: 100,
            label: {
              normal: {
                show: true,
                position: 'right'
              },
              emphasis: {
                textStyle: {
                  fontSize: 16
                }
              }
            },
            labelLine: {
              normal: {
                length: 20,
                lineStyle: {
                  width: 1,
                  type: 'solid'
                }
              }
            },
            itemStyle: {
              /** 传入的是数据项 seriesIndex, dataIndex, data, value 等各个参数 */
              color: data => {
                return [
                  '#6CA2FF',
                  '#6AC9D7',
                  '#72DCA2',
                  '#DBB375',
                  '#E164F7',
                  '#FF7474',
                  '#FFB270',
                  '#FECD51'
                ][data.dataIndex % 8]
              }
            },
            data: []
          }
        ]
      },
      chartObj: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    this.initFunnel()
    this.getData()
  },
  methods: {
    initFunnel() {
      this.chartObj = echarts.init(document.getElementById('sales-funnel'))
      this.chartObj.setOption(this.chartOption, true)
    },
    getData() {
      const params = {}
      this.loading = true
      crmIndexFunnel(params).then(res => {
        this.loading = false
        const data = []

        /**
         * 假数据
         */
        res.data = {
          'sumMoney': '17082.00',
          'list': [
            {
              'money': '17082.00',
              'typeId': 52,
              'count': 4,
              'name': '验证客户',
              'orderNum': 1
            },
            {
              'money': '17452.00',
              'typeId': 52,
              'count': 2,
              'name': '需求分析',
              'orderNum': 5
            },
            {
              'money': '21154.00',
              'typeId': 52,
              'count': 5,
              'name': '方案报价',
              'orderNum': 2
            },
            {
              'money': '14562.00',
              'typeId': 52,
              'count': 3,
              'name': '谈判审核',
              'orderNum': 3
            }
          ],
          'sumShu': 0,
          'sumYing': 0
        }


        let sumMoney = 0
        const legendArr = []
        for (let index = 0; index < res.data.list.length; index++) {
          const element = res.data.list[index]
          data.push({
            name: (element.name || '') + '(' + element.orderNum + ')',
            value: element.money
          })
          sumMoney += parseFloat(element.money || 0)
          legendArr.push(element.name || '')
        }

        this.chartOption.series[0].data = data
        this.chartOption.legend.data = data.map(o => o.name)
        this.chartOption.series[0].max = sumMoney < 1 ? 1 : sumMoney
        this.chartObj.setOption(this.chartOption, true)

        // this.funnelData = {
        //   winSingle: res.data.sumYing,
        //   loseSingle: res.data.sumShu
        // }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "style";
  #sales-funnel {
    width: 100%;
    height: 322px;
    margin-top: 10px;
  }

  .card-title-left .icon {
    color: #50CF9E;
  }
</style>
