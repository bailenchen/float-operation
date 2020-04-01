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
      <reminder
        content="1、商机编号、回款编号、发票编号、回访编号的日期类型编号都从创建时间获取，合同编号的日期编号从下单时间获取，若下单时间为空，则从创建时间获取<br />2、启用自动生成编号规则后，系统原编号将不可编辑<br />3、若自动生成的编号与系统现有编号重复时，自动跳过此编号，依次往下生成<br />4、编号规则至少设置两级<br />5、文本类型的最多支持12个字符，数字类型编号起始编号位数1-9" />
      <div v-for="(listItem, index) in list" :key="index" class="rule-section">
        <div class="rule-header">
          <span class="rule-header-title">{{ listItem.label | labelName }}</span>
          <el-switch
            v-model="listItem.status"
            :active-value="1"
            :inactive-value="0"/>
          <span :class="{'inactive': listItem.status != 1}">{{ listItem.status == 1 ? '已启用自动生成规则': '已停用自动生成规则' }}</span>
        </div>
        <template v-if="listItem.status == 1">
          <!-- <el-checkbox
            v-model="listItem.replace"
            :true-label="1"
            :false-label="0">替换现有编号</el-checkbox> -->
          <div class="rule-body">
            <div v-for="(typeItem, typeIndex) in listItem.setting" :key="'rule'+typeIndex" class="rule">
              <span>{{ typeIndex | typeListName }}</span>
              <el-select
                v-model="typeItem.type"
                class="rule-type"
                placeholder="请选择"
                @change="typeChange(typeItem, listItem.setting, typeIndex)">
                <el-option
                  v-for="item in typeOptions"
                  :key="'type' + item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
              <template>
                <el-input v-if="typeItem.type == 1" v-model="typeItem.value" class="rule-input" />
                <template v-else-if="typeItem.type == 2">
                  <el-select v-model="typeItem.value" class="rule-select" placeholder="请选择">
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
                  <el-input v-model="typeItem.value" :maxlength="14" class="rule-code-input" type="number" />
                  <span class="rule-code-span">递增数</span>
                  <el-input v-model="typeItem.increaseNumber" :maxlength="9" class="rule-code-input" type="number" />
                  <span class="rule-code-span">重新开始编号</span>
                  <el-select v-model="typeItem.resetType" class="rule-code-input" placeholder="请选择">
                    <el-option
                      v-for="item in intervalOptions"
                      :key="'interval' + item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </template>
              </template>
              <i
                v-if="listItem.setting.length > 2"
                class="el-icon-remove"
                @click="deleteItem(listItem.setting, typeIndex)"/>
            </div>
          </div>
          <el-button
            :disabled="listItem.setting.length >= 6"
            class="add-buttom"
            type="text"
            @click="addItem(listItem.setting)">+添加一级</el-button>
          <div class="example">编号示例：{{ listItem.setting | exampleName }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {
  sysConfigNumberQueryAPI,
  sysConfigNumberSetAPI
} from '@/api/systemManagement/SystemCustomer'

import Reminder from '@/components/reminder'

import moment from 'moment'

export default {
  name: 'SerialNumberSet',

  components: {
    Reminder
  },

  filters: {
    typeListName(value) {
      return ['一级编号', '二级编号', '三级编号', '四级编号', '五级编号', '六级编号'][value]
    },

    labelName(label) {
      if (label == '6') {
        return '回款编号'
      } else if (label == '7') {
        return '合同编号'
      } else if (label == '17') {
        return '回访编号'
      } else if (label == '18') {
        return '发票编号'
      }
      return ''
    },

    exampleName(setting) {
      let names = ''
      for (let i = 0; i < 2; i++) {
        if (i == 1) {
          names = names ? `${names}、` : ''
        }
        for (let index = 0; index < setting.length; index++) {
          const element = setting[index]
          const line = index > 0 ? '-' : ''
          if (element.value) {
            if (element.type == 1) {
              names = names + `${line}${element.value}`
            } else if (element.type == 2) {
              let formate = ''
              if (element.value) {
                formate = {
                  yyyy: 'YYYY',
                  yyyyMM: 'YYYYMM',
                  yyyyMMdd: 'YYYYMMDD'
                }[element.value]
              }
              const value = formate ? moment().format(formate) : ''
              names = names + `${line}${value}`
            } else if (element.type == 3) {
              const length = element.value ? element.value.length : 0
              let startValue = parseInt(element.value || 0)
              const interalValue = parseInt(element.increaseNumber || 0)
              if (i == 1) {
                startValue = startValue + interalValue
              }
              let startShowValue = startValue.toString() || ''
              if (startShowValue.length != length) {
                const addCount = length - startShowValue.length
                for (let index = 0; index < addCount; index++) {
                  startShowValue = '0' + startShowValue
                }
              }
              names = names + `-${startShowValue}`
            }
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
        value: 'yyyy',
        label: 'yyyy（年）'
      }, {
        value: 'yyyyMM',
        label: 'yyyyMM（年月）'
      }, {
        value: 'yyyyMMdd',
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
      list: [] // 展示类型数据
    }
  },

  created() {
    this.getDetail()
  },

  methods: {
    /**
     * 获取详情
     */
    getDetail() {
      this.loading = true
      sysConfigNumberQueryAPI()
        .then(res => {
          this.loading = false
          this.list = res.data || []
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 增加类型
     */
    addItem(setting) {
      if (setting.length < 6) {
        setting.push({
          type: 1,
          value: ''
        })
      }
    },

    /**
     * 删除事项操作
     */
    deleteItem(setting, index) {
      if (setting.length > 2) {
        setting.splice(index, 1)
      }
    },

    /**
     * 类型修改
     */
    typeChange(typeItem, list, index) {
      if (typeItem.type == 3) {
        this.$set(list, index, {
          type: typeItem.type,
          value: '',
          increaseNumber: '',
          reset_type: 4
        })
      } else if (typeItem.type == 2) {
        this.$set(list, index, {
          type: typeItem.type,
          value: 'yyyy'
        })
      } else {
        this.$set(list, index, {
          type: typeItem.type,
          value: ''
        })
      }
    },

    /**
     * 保存操作
     */
    save() {
      this.loading = true
      sysConfigNumberSetAPI(this.list)
        .then(res => {
          this.loading = false
          this.getDetail()
          this.$message.success('操作成功')
        })
        .catch(() => {
          this.loading = false
        })
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
  margin-top: 25px;
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
    margin-top: 10px;

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

      .el-icon-remove {
        color: #ff6767;
        cursor: pointer;
        margin-left: 2px;
        display: none;
      }
    }
    .rule + .rule {
      margin-top: 8px;
    }
    .rule:hover {
      .el-icon-remove {
        display: inline;
      }
    }
  }

  .add-buttom {
    margin-left: 80px;
  }

  .example {
    color: #999;
  }
}

.rule-section + .rule-section {
  margin-top: 20px;
}
</style>
