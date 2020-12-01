<template>
  <create-view
    :loading="loading"
    :body-style="{ height: '100%'}">
    <flexbox
      direction="column"
      align="stretch"
      class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:17px;color:#333;font-weight: bold;">合同变更1</div>
        <i
          class="el-icon-close close"
          @click="hidenView" />
      </flexbox>
      <div class="crm-create-flex"/>
      <span class="attr-title">原始合同</span>
      <create-sections title="基本信息">
        <flexbox
          direction="column"
          align="stretch">
          <div class="crm-create-body">
            <el-form
              ref="crmForm"
              :model="crmForm"
              label-position="top"
              class="crm-create-box">
              <el-form-item
                v-for="(item, index) in crmForm.crmFields"
                :key="item.key"
                :prop="'crmFields.' + index + '.value'"
                :class="{ 'crm-create-block-item': item.showblock, 'crm-create-item': !item.showblock }"
                :rules="crmRules[item.key]"
                :style="{'padding-left': getPaddingLeft(item, index), 'padding-right': getPaddingRight(item, index)}">
                <div
                  slot="label"
                  style="display: inline-block;">
                  <div class="form-label">
                    {{ item.data.name }}
                    <span style="color:#999;">
                      <!-- <span style="color:#f00;"> -->
                      {{ item.data.inputTips ? '（'+item.data.inputTips+'）':'' }}
                    </span>
                  </div>
                </div>
                <component
                  :is="item.data.formType | typeToComponentName"
                  :value="item.value"
                  :index="index"
                  :item="item"
                  :leads-number="leadsNumber"
                  :relation="item.relation"
                  :radio="['single_user', 'single_structure'].includes(item.data.formType) || item.radio"
                  :disabled="item.disabled"
                  :receivables-id="editId"
                  :info-params="getInfoParams(item)"
                  :use-delete="item.useDelete"
                  :action="typeToAction"
                  @value-change="fieldValueChange" />
              </el-form-item>
            </el-form>
          </div>
        </flexbox>
      </create-sections>
    </flexbox>
  </create-view>
</template>

<script>
// components
import CreateView from '@/components/CreateView'
import CreateSections from '@/components/CreateSections'
// API
import { filedGetField } from '@/api/common'


export default {
  /** 合同管理 的 勾选后的 合同变更 操作*/
  name: 'UpdateContract',
  components: {
    CreateView,
    CreateSections
  },
  filters: {
    /** 根据type 找到组件 */
    typeToComponentName(formType) {}
  },
  props: {
    // id: [String, Number]
    // 操作数据
    selectionList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      // 标题展示名称
      title: '',
      loading: false,
      // 自定义字段验证规则
      crmRules: {},
      // 自定义字段信息表单
      crmForm: {
        crmFields: []
      },
      // 审批信息
      examineInfo: {},
      // 图片信息
      imageData: {
        mainFile: [],
        detailFile: []
      },
      createActionInfo: {
        type: 'save'
        // present: true
        // id: 6
      },
      leadsNumber: false
    }
  },
  created() {
    this.getField()
  },
  methods: {
    // 获取自定义字段
    getField() {
      // this.loading = true
      console.log(111)
      var params = {
        label: 6,
        id: this.id
      }

      console.log('参数', params)

      filedGetField(params).then(res => {
        console.log(123)

        // 添加字段
        res.data.unshift({
          name: '来源',
          value: '',
          fieldName: 'source',
          formType: 'text'
        })
        res.data.unshift({
          name: '班主任',
          value: '',
          fieldName: 'headmasterUserName',
          formType: 'text'
        })
        res.data.unshift({
          name: '所属中心',
          value: '',
          fieldName: 'dept_id',
          formType: 'text'
        })
        res.data.unshift({
          name: '学员编号',
          value: '',
          fieldName: 'leadsNumber',
          formType: 'text'
        })
        res.data.unshift({
          name: '总课次',
          value: '',
          fieldName: 'totalclassTime',
          formType: 'text'
        })
        res.data.unshift({
          name: '合同属性',
          value: '',
          fieldName: 'contractsAttr',
          setting: ['新签', '续签'],
          formType: 'select'
        })
        const list = res.data
        this.getcrmRulesAndModel(list)
      }).catch(() => {})
    },
    // 根据自定义字段获取自定义字段规则
    getcrmRulesAndModel(list) {
      let showStyleIndex = -1
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        showStyleIndex += 1
        /**
         * 规则数据
         */
        this.crmRules[item.fieldName] = this.getItemRulesArrayFromItem(item)

        var params = {}
        params['key'] = item.fieldName
        params['data'] = item
        params['styleIndex'] = showStyleIndex
        params['disabled'] = false // 是否可交互

        this.crmForm.crmFields.push(params)
      }
    },
    getItemRulesArrayFromItem() {},
    hidenView() {
      this.$emit('hiden-view')
    },
    // 获取左边padding
    getPaddingLeft(item, index) {
      if (item.showblock && item.showblock == true) {
        return '0'
      }
      return item.styleIndex % 2 == 0 ? '0' : '40px'
    },
    // 获取右边padding
    getPaddingRight(item, index) {
      if (item.showblock && item.showblock == true) {
        return '0'
      }

      return item.styleIndex % 2 == 0 ? '40px' : '0'
    }
  }
}
</script>

<style lang="scss" scoped>
.crm-create-header {
  height: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
  flex-shrink: 0;
  .close {
    display: block;
    font-size: 24px;
    color: #909399;
    margin-right: -10px;
    padding: 10px;
    cursor: pointer;
  }
  .close:hover {
    color: $xr-color-primary;
  }
}
.attr-title {
  // font-size: 16px;
  padding-left: 10px;
  font-weight: bold;
}


/** 将其改变为flex布局 */
.crm-create-box {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px 15px;
}
.crm-create-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  // overflow: hidden;
  padding-bottom: 10px;
}

// 占用一整行
.crm-create-block-item {
  flex: 0 0 100%;
  flex-shrink: 0;
  padding-bottom: 10px;
}

.form-label {
  margin: 5px 0;
  font-size: 13px;
  word-wrap: break-word;
  word-break: break-all;
}
</style>

