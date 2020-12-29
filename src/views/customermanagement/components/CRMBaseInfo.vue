<template>
  <div class="b-cont">
    <div>
      <sections
        v-for="(mainItem, mainIndex) in list"
        :key="mainIndex"
        :title="mainItem.name"
        class="b-cells"
        content-height="auto">
        <flexbox
          :gutter="0"
          align="stretch"
          wrap="wrap"
          style="padding: 10px 8px 0;">
          <flexbox-item
            v-for="(item, index) in mainItem.list"
            :span="getShowBlock(item.formType) ? 12 : 0.5"
            :key="index"
            :class="{'b-cell': item.formType !== 'map_address'}">
            <flexbox
              v-if="item.formType === 'map_address'"
              :gutter="0"
              wrap="wrap">
              <flexbox-item
                :span="0.5"
                class="b-cell"
                @click.native="checkMapView(item)">
                <flexbox
                  class="b-cell-b"
                  align="stretch">
                  <div class="b-cell-name">定位</div>
                  <div
                    class="b-cell-value"
                    style="color: #3E84E9;cursor: pointer;">{{ item.value.location }}</div>
                </flexbox>
              </flexbox-item>
              <flexbox-item
                :span="0.5"
                class="b-cell">
                <flexbox
                  class="b-cell-b"
                  align="stretch">
                  <div class="b-cell-name">区域</div>
                  <div class="b-cell-value">{{ item.value.address }}</div>
                </flexbox>
              </flexbox-item>
              <flexbox-item
                :span="0.5"
                class="b-cell">
                <flexbox
                  class="b-cell-b"
                  align="stretch">
                  <div class="b-cell-name">详细地址</div>
                  <div class="b-cell-value">{{ item.value.detailAddress }}</div>
                </flexbox>
              </flexbox-item>
            </flexbox>

            <flexbox
              v-else-if="item.formType === 'single_user'"
              align="stretch"
              class="b-cell-b">
              <div class="b-cell-name">{{ item.name }}</div>
              <div class="b-cell-value">{{ item.value ? item.value.realname : '' }}</div>
            </flexbox>

            <flexbox
              v-else-if="isModule(item)"
              align="stretch"
              class="b-cell-b">
              <div class="b-cell-name">{{ item.name }}</div>
              <div class="b-cell-value can-check" @click="checkModuleDetail(item)">{{ getModuleName(item) }}</div>
            </flexbox>

            <flexbox
              v-else-if="item.formType === 'checkbox' || item.formType === 'structure' || item.formType === 'user'"
              align="stretch"
              class="b-cell-b">
              <div class="b-cell-name">{{ item.name }}</div>
              <div class="b-cell-value">{{ item.value | arrayValue(getArrayKey(item.formType)) }}</div>
            </flexbox>

            <flexbox
              v-else-if="item.formType === 'file'"
              align="stretch"
              class="b-cell-b">
              <div class="b-cell-name">{{ item.name }}</div>
              <div class="b-cell-value">
                <file-list-view :list="item.value || []" />
              </div>
            </flexbox>

            <flexbox
              v-else-if="item.formType === 'check_status'"
              align="stretch"
              class="b-cell-b">
              <div class="b-cell-name">{{ item.name }}</div>
              <div class="b-cell-value">{{ getStatusName(item.value) }}</div>
            </flexbox>

            <!-- 特殊处理关联合同编号 -->
            <flexbox
              v-else-if="item.formType === 'relativenum'"
              align="stretch"
              class="b-cell-b">
              <div class="b-cell-name">{{ item.name }}</div>
              <div
                v-for="(sitem,sindex) in item.value || []"
                :key="sindex"
                class="b-cell-value num-name" @click="enterRelativeDetail(sitem)">{{ sitem.num }}
                <span
                  v-if="sindex != item.value.length - 1"
                  style="margin-right:10px;">,</span>
              </div>
            </flexbox>

            <flexbox
              v-else
              align="stretch"
              class="b-cell-b">
              <div class="b-cell-name">{{ item.name }}</div>
              <div class="b-cell-value">{{ item.value }}</div>
            </flexbox>
          </flexbox-item>
        </flexbox>
        <!-- 合同详细资料展示 -->
        <slot name="first" />
      </sections>
      <slot />
    </div>
    <map-view
      v-if="showMapView"
      :title="mapViewInfo.title"
      :lat="mapViewInfo.lat"
      :lng="mapViewInfo.lng"
      @hidden="showMapView=false" />

    <c-r-m-full-screen-detail
      :visible.sync="showFullDetail"
      :id="fullDetailId"
      :crm-type="fullDetailType"/>
  </div>
</template>

<script>
import loading from '../mixins/loading'
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import Sections from '../components/Sections'
import { filedGetInformation } from '@/api/customermanagement/common'
import MapView from '@/components/MapView' // 地图详情
import FileListView from '@/components/FileListView'
import { crmMarketingInformationAPI } from '@/api/customermanagement/marketing'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'

import { separator } from '@/filters/vue-numeral-filter/filters'
import { isObject } from '@/utils/types'

export default {
  // 客户管理 的 基本信息
  name: 'CRMBaseInfo',
  components: {
    Sections,
    MapView,
    FileListView,
    CRMFullScreenDetail: () => import('./CRMFullScreenDetail.vue')
  },
  filters: {
    arrayValue(array, field) {
      if (
        !array ||
        Object.prototype.toString.call(array) !== '[object Array]'
      ) {
        return ''
      }

      return array
        .map(item => {
          return field ? item[field] : item
        })
        .join('，')
    }
  },
  mixins: [loading, CheckStatusMixin],
  props: {
    // 模块ID
    id: [String, Number],
    poolId: [String, Number],
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 没有值就是全部类型 有值就是当个类型
    crmType: {
      type: String,
      default: ''
    },
    // 固定字段的数据
    filedList: Array
  },
  data() {
    return {
      list: [],
      // 控制展示地图详情
      showMapView: false,
      // 地图详情信息
      mapViewInfo: {},
      showFullDetail: false,
      fullDetailId: '',
      fullDetailType: ''
    }
  },
  computed: {},
  watch: {
    id: function(val) {
      if (!this.filedList) {
        this.getBaseInfo(true)
      }
    },
    filedList() {
      this.list = this.filedList
    }

  },
  created() {
    this.$bus.on('crm-detail-update', (data) => {
      this.getBaseInfo(false)
    })
  },
  beforeDestroy() {
    this.$bus.off('crm-detail-update')
  },
  mounted() {
    if (this.filedList) {
      this.list = this.filedList
    } else {
      this.getBaseInfo(true)
    }
  },
  activated: function() {
    this.getBaseInfo(false)
  },
  deactivated: function() {},
  methods: {
    // 进入关联详情
    enterRelativeDetail(item) {
      this.showFullDetail = true
      this.fullDetailId = item.contractId
      this.fullDetailType = 'contract'
    },
    /**
     * 获取基础信息
     */
    getBaseInfo(loading) {
      this.loading = !!loading
      if (this.crmType === 'marketing') {
        crmMarketingInformationAPI().then(res => {
          this.list = res.data
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        const keytype = this.crmType == 'student' ? 'customer' : this.crmType
        const params = {
          types: crmTypeModel[keytype],
          id: this.id
        }

        // 如果有公海id 需上传确定展示字段
        if (this.poolId) {
          params.poolId = this.poolId
        }


        filedGetInformation(params)
          .then(res => {
            const baseList = []
            const systemList = []
            console.log('数据', res.data)

            // 充值返还
            if (this.crmType == 'refund') {
              const baseList = [
                {
                  name: '合同充值返编号',
                  formType: 'text',
                  value: res.data.refund.num
                },
                {
                  name: '学员编号',
                  formType: 'text',
                  value: res.data.refund.leadsNumber
                },
                {
                  name: '学员姓名',
                  formType: 'text',
                  value: res.data.refund.customerName
                },
                {
                  name: '所属中心',
                  formType: 'text',
                  value: res.data.refund.deptIdName
                },
                {
                  name: '合同充值返还日期',
                  formType: 'date',
                  value: res.data.refund.refundTime
                },
                {
                  name: '合同充值返还金额（元）',
                  formType: 'text',
                  value: res.data.refund.money
                },
                {
                  name: '合同充值返还方式',
                  formType: 'transactionTime',
                  value: res.data.refund.refundWayName
                },
                {
                  name: '合同充值返还类型',
                  formType: 'text',
                  value: {
                    1: '常规充值返还',
                    2: '特殊充值返还'
                  }[res.data.refund.refundType]
                },
                {
                  name: '教育顾问',
                  formType: 'text',
                  value: res.data.refund.ownerUserName
                },
                {
                  name: '备注',
                  formType: 'text',
                  value: res.data.refund.remarks
                },
                {
                  name: '审批状态',
                  formType: 'date',
                  value: {
                    0: '待审核',
                    1: '通过',
                    2: '拒绝',
                    3: '审核中',
                    4: '撤回',
                    5: '未提交',
                    6: '创建 ',
                    7: '已删除',
                    8: '作废',
                    9: '家长审核中',
                    10: '家长拒绝'
                  }[res.data.refund.checkStatus]
                }
              ]
              const capitalList = [
                {
                  name: '支付方式',
                  formType: 'text',
                  value: {
                    1: '现金交易',
                    2: '刷卡交易',
                    3: '支票交易',
                    4: '微信交易',
                    5: '支付宝交易',
                    6: '转账交易'
                  }[res.data.refund.capital.payment]
                },
                {
                  name: '用户账户',
                  formType: 'text',
                  value: res.data.refund.capital.account
                },
                {
                  name: '资金退款金额（元）',
                  formType: 'text',
                  value: res.data.refund.capital.refundMoney
                },
                {
                  name: '交易时间',
                  formType: 'date',
                  value: res.data.refund.capital.dealTime
                },
                {
                  name: '退款人',
                  formType: 'text',
                  value: res.data.refund.capital.refundUserName
                },
                {
                  name: '备注',
                  formType: 'text',
                  value: res.data.refund.capital.remarks
                }

              ]
              this.list = [{
                name: '基本信息',
                list: baseList
              }, {
                name: '资金退款',
                list: capitalList
              }]
              this.loading = false
              return
            }

            res.data.forEach(item => {
              if (item.formType === 'floatnumber') {
                item.value = separator(item.value)
              }
              if (item.sysInformation == 1) {
                systemList.push(item)
              } else {
                baseList.push(item)
              }
            })

            this.list = [
              {
                name: '基本信息',
                list: baseList
              },
              {
                name: '系统信息',
                list: systemList
              }
            ]
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },

    /**
     * 查看地图详情
     */
    checkMapView(item) {
      if (item.value && item.value !== '') {
        this.mapViewInfo = {
          title: item.value.location,
          lat: item.value.lat,
          lng: item.value.lng
        }
        this.showMapView = true
      }
    },

    getArrayKey(type) {
      if (type === 'structure') {
        return 'name'
      } else if (type === 'user') {
        return 'realname'
      }

      return ''
    },

    isModule(item) {
      return [
        'customer',
        'business',
        'contract',
        'contacts',
        'category',
        'statusName',
        'typeName'].includes(item.formType)
    },

    getShowBlock(type) {
      return ['map_address', 'file'].includes(type)
    },

    getModuleName(item) {
      const field = {
        customer: 'customerName',
        business: 'businessName',
        contract: 'contractNum',
        contacts: 'contactsName',
        category: 'categoryName',
        statusName: 'statusName',
        typeName: 'typeName'
      }[item.formType]
      return item.value ? item.value[field] : ''
    },

    /**
     * 查看详情
     */
    checkModuleDetail(data) {
      if (isObject(data.value)) {
        this.fullDetailType = data.formType
        this.fullDetailId = data.value[`${data.formType}Id`]
        this.showFullDetail = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.b-cont {
  position: relative;
  padding: 15px;
  height: 100%;
  overflow-y: auto;
  overflow-y: overlay;
}

.b-cells {
  margin-top: 25px;
}

.b-cell {
  padding: 0 10px;
}

.b-cell-b {
  width: auto;
  padding: 8px;
  .b-cell-name {
    width: 100px;
    margin-right: 10px;
    font-size: 13px;
    flex-shrink: 0;
    color: #777;
  }
  .b-cell-value {
    font-size: 13px;
    color: #333;
    line-height: 1.2;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
  }
  .b-cell-foot {
    flex-shrink: 0;
    display: block;
    width: 15px;
    height: 15px;
    margin-left: 8px;
  }
}

.f-item {
  padding: 3px 0;
  height: 25px;
  .f-img {
    position: block;
    width: 15px;
    height: 15px;
    padding: 0 1px;
    margin-right: 8px;
  }
  .f-name {
    color: #666;
    font-size: 12px;
    margin-right: 10px;
  }
}

.can-check {
  color: $xr-color-primary !important;
  cursor: pointer;
}

.num-name {
  color: #2362FB !important;
  cursor: pointer;
}

</style>
