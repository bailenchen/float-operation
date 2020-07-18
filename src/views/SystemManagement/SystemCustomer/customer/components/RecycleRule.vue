<template>
  <div class="recycle-rule">
    <el-checkbox
      v-model="data.type"
      :true-label="trueLabel">{{ typeName }}</el-checkbox>
    <div
      v-if="data.type == trueLabel"
      class="recycle-rule__content">
      <!--<div>
        <span class="check-label">选择不进入公海LEADS</span>
        <el-checkbox
          v-if="dealHandleShow"
          v-model="data.dealHandle"
          :true-label="0"
          :false-label="1">已成交LEADS<el-tooltip
            content="已成交是指LEADS状态为“已成交”"
            effect="dark"
            placement="top">
            <i class="wk wk-help wk-help-tips"/>
        </el-tooltip></el-checkbox>
        <el-checkbox
          v-if="businessHandleShow"
          v-model="data.businessHandle"
          :true-label="0"
          :false-label="1">有商机LEADS</el-checkbox>
      </div>-->
      <div>
        <!--<el-radio v-model="data.customerLevelSetting" :label="1">所有LEADS统一设置</el-radio>-->
        <el-table
          :data="allCustomerData"
          border
          style="width: 100%">
          <el-table-column
            prop="level"
            label="LEADS"
            width="150"/>
          <el-table-column
            label="规则"
            prop="limitDay">
            <template slot-scope="scope">
              <template v-if="trueLabel === 1">
                <el-input
                  v-model="scope.row.limitDay"
                  class="value-input"
                  @keyup.native="inputLimit(scope.row)" />
                <span>天内通话次数小于</span>
                <el-input
                  v-model="scope.row.limitDay"
                  class="value-input"
                  @keyup.native="inputLimit(scope.row)" />
                <span>次，进入公海</span>
              </template>
              <template v-else>
                <span>超过</span>
                <el-input
                  v-model="scope.row.limitDay"
                  class="value-input"
                  @keyup.native="inputLimit(scope.row)" />
                <span>天{{ limitDayUnit }}，进入公海</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--<div>
        <el-radio v-model="data.customerLevelSetting" :label="2">根据LEADS级别分别设置</el-radio>
        <el-table
          :data="levelCustomerData"
          border
          style="width: 100%">
          <el-table-column
            prop="level"
            label="LEADS"
            width="180"/>
          <el-table-column
            :label="limitDayName"
            prop="limitDay">
            <template slot-scope="scope">
              <span>超过</span>
              <el-input v-model="scope.row.limitDay" class="value-input" @keyup.native="inputLimit(scope.row)" />
              <span>天{{ limitDayUnit }}，进入公海</span>
            </template>
          </el-table-column>
        </el-table>
      </div>-->
    </div>
  </div>
</template>

<script>


export default {
  // 回收规则
  name: 'RecycleRule',
  components: {},
  props: {
    trueLabel: [String, Number],
    isEdit: Boolean,
    data: {
      type: Object,
      default: () => {
        /**
         * "type":1, // 收回规则判断类型 1跟进记录 2商机 3成交状态
        "dealHandle":0, // 已成交LEADS是否进入公海 0不进入 1进入
        "businessHandle":1, // 有商机LEADS是否进入公海 0不进入 1进入
        "level":1, // LEADS级别 1全部 2 A（重要LEADS）3 B（普通LEADS）4 C（非优先  LEADS）
        "limitDay":30 // 公海规则限制天数
         */
        return {
          type: '',
          dealHandle: 1,
          businessHandle: 1,
          customerLevelSetting: null,
          level: []
        }
      }
    },
    levelCustomer: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      allCustomerData: [{
        level: '所有LEADS', // LEADS级别 1全部 2 A（重要LEADS）3 B（普通LEADS）4 C（非优先LEADS）
        limitDay: ''
      }],
      levelCustomerData: []
    }
  },
  computed: {
    typeName() {
      return {
        1: 'N天内"通话次数 < N次"，由系统定时退回LEADS公海池',
        2: '超过N天"无新建跟进（跟进记录）"的LEADS，由系统定时退回LEADS公海',
        3: '有跟进但超过N天"未成交"的LEADS，由系统定时退回LEADS公海'
      }[parseInt(this.trueLabel)]
    },

    limitDayName() {
      return {
        1: '未跟进天数',
        2: '未新建天数',
        3: '未成交天数'
      }[parseInt(this.trueLabel)]
    },

    limitDayUnit() {
      return {
        1: '未跟进',
        2: '未跟进',
        3: '未成交'
      }[parseInt(this.trueLabel)]
    },

    dealHandleShow() {
      return this.trueLabel == 1 || this.trueLabel == 2
    },
    businessHandleShow() {
      return this.trueLabel == 1 || this.trueLabel == 3
    }
  },
  watch: {
    'data.customerLevelSetting': {
      handler(val, oldVal) {
        if (val == 1) {
          if (this.isEdit && oldVal == null) {
            this.data.level = this.getEditData(this.allCustomerData, this.data.level)
          } else {
            this.data.level = this.allCustomerData
          }
        } else {
          if (this.isEdit && oldVal == null) {
            if (this.levelCustomerData && this.levelCustomerData.length) {
              this.data.level = this.getEditData(this.levelCustomerData, this.data.level)
            }
          } else {
            this.data.level = this.levelCustomerData
          }
        }
      },
      deep: true,
      immediate: true
    },
    levelCustomer: {
      handler(value) {
        if (value && value.length) {
          this.levelCustomerData = value.map(item => {
            const obj = {
              limitDay: ''
            }
            obj.level = item
            return obj
          })

          // 类型是2
          if (this.data.customerLevelSetting == 2) {
            if (this.isEdit && this.levelCustomerData && this.levelCustomerData.length) {
              this.data.level = this.getEditData(this.levelCustomerData, this.data.level)
            }
          }
        }
      },
      immediate: true
    }
  },
  created() {},

  beforeDestroy() {},
  methods: {
    getEditData(list, editList) {
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        for (let editIndex = 0; editIndex < editList.length; editIndex++) {
          const editItem = editList[editIndex]
          if (editItem.level == item.level) {
            item.limitDay = editItem.limitDay
          }
        }
      }

      return list
    },

    /**
     * 阻挡输入
     */
    inputLimit(data) {
      data.limitDay = data.limitDay.replace(/[^0-9]/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.recycle-rule {
  font-size: 13px;

  &__content {
    margin-left: 15px;
    padding: 15px;
    border: 1px solid $xr-border-color-base;
    border-radius: $xr-border-radius-base;
  }
}

.value-input {
  width: 80px;
  margin: 0 8px;
}

.check-label {
  margin-right: 8px;
}

.el-table,
.el-radio,
.el-checkbox {
  margin-bottom: 8px;
}

.wk-help {
  margin-left: 5px;
}
</style>
