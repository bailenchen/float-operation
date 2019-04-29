<template>
  <div v-loading="loading"
       class="main-container">
    <filtrate-handle-view class="filtrate-bar"
                          @load="loading=true"
                          @change="getDataList">
    </filtrate-handle-view>
    <div class="content">
      <div class="content-title">签约合同数：{{data.count_zong}}个；签约合同金额：{{data.money_zong}}元；回款金额：{{data.back_zong}}元；未收款金额：{{data.w_back_zong}}元</div>
      <div class="table-content">
        <el-table :data="list"
                  :height="tableHeight"
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
import { biAchievementSummaryAPI } from '@/api/businessIntelligence/achievement'
import filtrateHandleView from '../components/filtrateHandleView'

export default {
  /** 合同汇总表 */
  name: 'achievement-summary-statistics',
  components: {
    filtrateHandleView
  },
  data() {
    return {
      loading: false,
      tableHeight: document.documentElement.clientHeight - 220,
      list: [],
      data: {
        back_zong: 0,
        count_zong: 0,
        money_zong: 0,
        w_back_zong: 0
      },
      fieldList: [
        { field: 'type', name: '日期' },
        { field: 'count', name: '签约合同数（个）' },
        { field: 'money', name: '签约合同金额（元）' },
        { field: 'back', name: '回款金额（元）' }
      ]
    }
  },
  computed: {},
  mounted() {
    /** 控制table的高度 */
    window.onresize = () => {
      this.tableHeight = document.documentElement.clientHeight - 220
    }
  },
  methods: {
    getDataList(params) {
      this.loading = true
      biAchievementSummaryAPI(params)
        .then(res => {
          this.data = res.data
          this.list = res.data.items || []
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
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
  .content-title {
    padding: 20px 20px 5px;
    font-size: 17px;
    color: #333;
  }
}

.table-content {
  margin-top: 20px;
  padding: 0 20px;
}
</style>
