<template>
  <div>
    <div class="can-visit--underline" @click="openDetail">
      1122
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      title="合同充值详情"
      width="60%">
      <div v-loading="loading">
        <c-r-m-base-info :detail="detailData" :id="id" :filed-list="filedList"/>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import CRMBaseInfo from '@/views/customermanagement/components/CRMBaseInfo'

import { crmReceiveRead } from '@/api/customermanagement/receive'

export default {
  name: 'XhDetail',
  components: {
    CRMBaseInfo
  },
  props: {
    // id: [String, Number],
    action: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      showDview: false,
      dialogVisible: false,
      id: 181,
      detailData: {},
      filedList: null
    }
  },
  methods: {
    openDetail() {
      console.log('请求数据')
      this.getDetail()

      // this.showDview = true
      this.dialogVisible = true
    },
    getDetail() {
      const params = { contractCapitalId: 181 }
      this.loading = true
      crmReceiveRead(params).then(res => {
        this.loading = false
        this.detailData = res.data
        this.getBaseInfo(res.data)
      }).catch(() => {})
    },

    getBaseInfo(data) {
      this.filedList = [
        {
          name: '基本信息',
          list: [
            {
              name: '合同充值编号',
              formType: 'text',
              value: data.number
            },
            {
              name: '学员姓名',
              formType: 'text',
              value: data.customerName
            },
            {
              name: '付款日期',
              formType: 'date',
              value: data.transactionTime
            },
            {
              name: '合同充值金额（元）',
              formType: 'text',
              value: data.money
            },
            {
              name: '付款方式',
              formType: 'transactionTime',
              value: {
                '1': '现金交易',
                '2': '刷卡交易',
                '3': '支票交易',
                '4': '微信交易',
                '5': '支付宝交易',
                '6': '转账交易'
              }[data.payment]
            },
            {
              name: '课程顾问',
              formType: 'text',
              value: data.ownerUserName
            },
            {
              name: '更新时间',
              formType: 'date',
              value: data.updateTime
            },
            {
              name: '创建时间',
              formType: 'date',
              value: data.createTime
            },
            {
              name: '创建人',
              formType: 'text',
              value: data.createUserName
            }
          ]
        }
      ]
    },
    handleHandle() {

    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  /deep/ div {
    line-height: 1.15;
  }
}
</style>
