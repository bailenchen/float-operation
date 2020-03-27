<template>
  <div v-loading="loading" class="serial-number-set">
    <div class="content-title">
      <span>编号规则设置</span>
      <el-button
        type="primary"
        class="rt"
        size="medium"
        @click="save">保存</el-button>
    </div>
    <div class="content-body">
      <div v-for="(listItem, index) in list" :key="index" class="rule-section">
        <div class="rule-header">
          <span class="rule-header-title">{{ listItem.label }}</span>
          <el-switch
            v-model="listItem.state"
            :active-value="1"
            :inactive-value="0"/>
          <span :class="{'inactive': listItem.state != 1}">{{ listItem.state == 1 ? '已启用自动生成规则': '已停用自动生成规则' }}</span>
        </div>
        <template v-if="listItem.state == 1">
          <el-checkbox
            v-model="listItem.replace"
            :true-label="1"
            :false-label="0">替换现有编号</el-checkbox>
          <div class="rule-body">
            <div v-for="(typeItem, typeIndex) in listItem.list" :key="'rule'+typeIndex" class="rule">
              <span>{{ typeIndex | typeListName }}</span>
              <el-select v-model="typeItem.type" class="rule-type" placeholder="请选择">
                <el-option
                  v-for="item in typeOptions"
                  :key="'type' + item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
              <template>
                <el-input v-if="typeItem.type == 1" v-model="typeItem.value" class="rule-input" />
                <template v-else-if="typeItem.type == 2">
                  <el-select v-model="typeItem.type" class="rule-select" placeholder="请选择">
                    <el-option
                      v-for="item in timeOptions"
                      :key="'time' + item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                  <el-tooltip
                    content="从合同的下单时间中获取"
                    effect="dark"
                    placement="top">
                    <i class="wk wk-help"/>>
                  </el-tooltip>
                </template>

                <template v-else-if="typeItem.type == 3">
                  <span class="rule-code-span">起始编号</span>
                  <el-input v-model="typeItem.value" class="rule-code-input" type="number" />
                  <span class="rule-code-span">递增数</span>
                  <el-input v-model="typeItem.interal" class="rule-code-input" type="number" />
                  <span class="rule-code-span">重新开始编号</span>
                  <el-select v-model="typeItem.intervalType" class="rule-code-input" placeholder="请选择">
                    <el-option
                      v-for="item in intervalOptions"
                      :key="'interval' + item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </template>
              </template>
            </div>
          </div>
          <div>编号示例：{{ listItem.list | exampleName }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {
  crmSettingRecordListAPI
  // crmSettingRecordEditAPI
} from '@/api/systemManagement/SystemCustomer'

import moment from 'moment'

export default {
  name: 'SerialNumberSet',

  components: {},

  filters: {
    typeListName(value) {
      return ['一级编号', '二级编号', '三级编号'][value]
    },

    exampleName(list) {
      console.log(list)
      let names = ''
      for (let i = 0; i < 2; i++) {
        if (i == 1) {
          names = names + '、'
        }
        for (let index = 0; index < list.length; index++) {
          const element = list[index]
          if (element.type == 1) {
            names = names ? names + `-${element.value}` : names + element.value
          } else if (element.type == 2) {
            const value = moment().format({
              1: 'YYYY',
              2: 'YYYYMM',
              3: 'YYYYMMdd'
            }[element.value])
            names = names ? names + `-${value}` : names + value
          } else if (element.type == 3) {
            const length = element.value.length
            let startValue = parseInt(element.value || 0)
            const interalValue = parseInt(element.interal || 0)
            if (i == 1) {
              startValue = startValue + interalValue
            }
            let startShowValue = startValue.toString()
            if (startShowValue.length != length) {
              for (let index = 0; index < length - startShowValue.length; index++) {
                startShowValue = '0' + startShowValue
              }
            }
            names = names ? names + `-${startShowValue}` : names + startShowValue
          }
        }
      }

      return names
    }
  },

  data() {
    return {
      loading: false, // 展示加载中效果
      typeOptions: [{
        value: 1,
        label: '文本'
      }, {
        value: 2,
        label: '日期'
      }, {
        value: 3,
        label: '数字'
      }],
      timeOptions: [{
        value: 1,
        label: 'yyyy（年）'
      }, {
        value: 2,
        label: 'yyyyMM（年月）'
      }, {
        value: 3,
        label: 'yyyyMMdd（年月日）'
      }],
      intervalOptions: [{
        value: 1,
        label: '每天'
      }, {
        value: 2,
        label: '每月'
      }, {
        value: 3,
        label: '每年'
      }, {
        value: 4,
        label: '从不'
      }],
      list: [{
        label: '合同编号',
        state: 1,
        replace: 1,
        list: [
          {
            type: 1,
            value: '',
            interal: '',
            intervalType: ''
          },
          {
            type: 1,
            value: '',
            interal: '',
            intervalType: ''
          },
          {
            type: 1,
            value: '',
            interal: '',
            intervalType: ''
          }
        ]
      }, {
        label: '回款编号',
        state: 1,
        replace: 1,
        list: [
          {
            type: 1,
            value: '',
            interal: '',
            intervalType: ''
          },
          {
            type: 1,
            value: '',
            interal: '',
            intervalType: ''
          },
          {
            type: 1,
            value: '',
            interal: '',
            intervalType: ''
          }
        ]
      }] // 展示类型数据
    }
  },

  created() {
    // this.getDetail()
  },

  methods: {
    /**
     * 获取详情
     */
    getDetail() {
      this.loading = true
      crmSettingRecordListAPI()
        .then(res => {
          this.loading = false
          this.list = res.data.map(item => {
            return { value: item }
          })
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 增加类型
     */
    addItem() {
      this.list.push({ value: '' })
    },

    /**
     * 删除事项操作
     */
    deleteItem(item, index) {
      this.list.splice(index, 1)
    },

    /**
     * 保存操作
     */
    save() {
      // const value = []
      // for (let index = 0; index < this.list.length; index++) {
      //   const element = this.list[index]
      //   if (element.value) {
      //     value.push(element.value)
      //   }
      // }
      // this.loading = true
      // crmSettingRecordEditAPI({ value: value })
      //   .then(res => {
      //     this.loading = false
      //     this.getDetail()
      //     this.$message.success('操作成功')
      //   })
      //   .catch(() => {
      //     this.loading = false
      //   })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content-title {
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
}

.content-title > span {
  display: inline-block;
  height: 36px;
  line-height: 36px;
  margin-left: 20px;
}

.content-body {
  height: calc(100% - 57px);
  padding: 30px;
  overflow-y: auto;
}

.rule-section {
  .rule-header {
    margin-bottom: 8px;

    &-title {
      font-weight: bold;
    }

    .el-switch {
      margin-left: 8px;
    }

    .inactive {
      color: #ccc;
    }
  }

  .el-checkbox {
    margin-bottom: 8px;
  }

  .rule-body {
    position: relative;
    .rule {
      &-type {
        width: 80px;
        margin-left: 15px;
      }

      &-select,
      &-input {
        width: 200px;
        margin-left: 15px;
      }

      &-code-input {
        width: 140px;
      }

      &-code-span {
        margin-left: 15px;
      }
    }

    .rule + .rule {
      margin-top: 8px;
    }
  }
}

.rule-section + .rule-section {
  margin-top: 20px;
}
</style>
