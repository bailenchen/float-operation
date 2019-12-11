<template>
  <div class="recycle-rule">
    <el-checkbox
      v-model="data.type"
      :true-label="trueLabel">{{ data.typeName }}</el-checkbox>
    <div
      v-if="data.type == trueLabel"
      class="recycle-rule__content">
      <div>
        <span class="check-label">选择不进入公海客户</span>
        <el-checkbox
          v-if="dealHandleShow"
          v-model="data.dealHandle"
          :true-label="0"
          :false-label="1">已成交客户<el-tooltip
            content="已成交是指客户状态为“已成交”"
            effect="dark"
            placement="top">
            <i class="wk wk-help"/>>
        </el-tooltip></el-checkbox>
        <el-checkbox
          v-if="businessHandleShow"
          v-model="data.businessHandle"
          :true-label="0"
          :false-label="1">有商机客户</el-checkbox>
      </div>
      <div>
        <el-radio v-model="data.customerLevelSetting" :label="1">所有客户统一设置</el-radio>
        <el-table
          :data="allCustomerData"
          border
          style="width: 100%">
          <el-table-column
            prop="name"
            label="客户"
            width="180"/>
          <el-table-column
            prop="limitDay"
            label="未跟进天数">
            <template slot-scope="scope">
              <span>每天最多领取</span>
              <el-input v-model="scope.row.limitDay" type="number" class="value-input" />
              <span>公海客户</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div>
        <el-radio v-model="data.customerLevelSetting" :label="2">根据客户级别分别设置</el-radio>
        <el-table
          :data="levelCustomerData"
          border
          style="width: 100%">
          <el-table-column
            prop="name"
            label="客户"
            width="180"/>
          <el-table-column
            prop="limitDay"
            label="未跟进天数">
            <template slot-scope="scope">
              <span>每天最多领取</span>
              <el-input v-model="scope.row.limitDay" type="number" class="value-input" />
              <span>公海客户</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    data: {
      type: Object,
      default: () => {
        /**
         * "type":1, // 收回规则判断类型 1跟进记录 2商机 3成交状态
        "dealHandle":0, // 已成交客户是否进入公海 0不进入 1进入
        "businessHandle":1, // 有商机客户是否进入公海 0不进入 1进入
        "level":1, // 客户级别 1全部 2 A（重要客户）3 B（普通客户）4 C（非优先  客户）
        "limitDay":30 // 公海规则限制天数
         */
        return {
          type: '',
          typeName: '',
          dealHandle: 1,
          businessHandle: 1,
          customerLevelSetting: 1,
          level: []
        }
      }
    }
  },
  data() {
    return {
      allCustomerData: [{
        name: '所有客户',
        level: 1, // 客户级别 1全部 2 A（重要客户）3 B（普通客户）4 C（非优先客户）
        limitDay: ''
      }],
      levelCustomerData: [{
        name: 'A（重要客户）',
        level: 2,
        limitDay: ''
      }, {
        name: 'B（普通客户）',
        level: 3,
        limitDay: ''
      }, {
        name: 'C（非优先客户）',
        level: 4,
        limitDay: ''
      }]
    }
  },
  computed: {
    dealHandleShow() {
      return this.trueLabel == 1 || this.trueLabel == 2
    },
    businessHandleShow() {
      return this.trueLabel == 1 || this.trueLabel == 3
    }
  },
  watch: {
    'data.customerLevelSetting': {
      handler(val) {
        if (val == 1) {
          this.data.level = this.allCustomerData
        } else {
          this.data.level = this.levelCustomerData
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},

  beforeDestroy() {},
  methods: {}
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
